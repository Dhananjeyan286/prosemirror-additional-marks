function getLinkMarkDef() {
    return {
        attrs: {
            href: { default: null }
        },
        inclusive: false,
        parseDOM: [
            {
                tag: "a[href]",
                getAttrs: function (dom) {
                    if(dom.getAttribute("href")) {
                        return { href: dom.getAttribute("href") } 
                    } else {
                        return false
                    }
                }
            }
        ],
        toDOM: function (mark) {
            return ["a", { href: mark.attrs.href }]
        }
    }
}

export function addLinkMark(marks, options) {
    return marks.append({
        link: getLinkMarkDef(options)
    })
}

var defaultLinkRegex = /^((ht|f)tp(s?)\:\/\/){0,1}[-.\w]*(\/?)([a-zA-Z0-9\|\(\)~\-\.\!\?\,\:\'\/\\\+=&amp;%\$#_@\P{InBasicLatin}]*)?$/;

function getAllLinks(view) {
    var links = getAllLinkRanges(view);
    // join continuing links across paras
    return joinLinks(links, view);
};

function getLinkFromNode(node) {
    return node.marks.filter(function (m) {
        return m.type.name === "link";
    })[0];
};

function getAllLinkRanges(view) {
    // all leaf nodes
    var allTextNodes = [];
    view.state.doc.content.nodesBetween(
        0,
        view.state.doc.content.size,
        function (node, pos) {
            if (node.isLeaf) {
                allTextNodes.push({ node: node, pos: pos });
            }
        }
    );

    // get all adjacent links
    var links = [];
    var currentLink = null;
    allTextNodes.forEach(function (n) {
        var node = n.node;
        var pos = n.pos;
        if (view.state.schema.marks.link.isInSet(node.marks)) {
            // node contains link mark, start a run or join with a new run
            var link = getLinkFromNode(node);
            if (!currentLink) {
                currentLink = {
                    href: link.attrs.href,
                    start: pos,
                    end: pos + node.nodeSize,
                };
            } else if ( currentLink.href === link.attrs.href && currentLink.end === pos ) {
                // see if this can be joined
                currentLink.end = currentLink.end + node.nodeSize;
            } else {
                // this is a link with a different href. cut and start a new run
                links.push(currentLink);
                currentLink = {
                    href: link.attrs.href,
                    start: pos,
                    end: pos + node.nodeSize,
                };
            }
        } else {
            // no mark, if there's an existing run break it.
            if (currentLink) {
                links.push(currentLink);
                currentLink = null;
            } // else do nothing
        }
    });
    if (currentLink) {
        links.push(currentLink);
    }

    return links;
};

function joinLinks(links, view) {
    // join links across adjacent paras
    var joinedLinks = links.reduce(function (joinedLinks, link) {
        var previousLink = joinedLinks.pop();
        if (!previousLink) {
            joinedLinks.push(link);
        } else if (
            link.start - previousLink.end === 2 && // 2 - gap between two paras
            !view.state.doc.resolve(previousLink.end).nodeAfter &&
            previousLink.href === link.href
        ) {
            previousLink.end = link.end;
            joinedLinks.push(previousLink);
        } else {
            joinedLinks.push(previousLink);
            joinedLinks.push(link);
        }
        return joinedLinks;
    }, []);

    return joinedLinks;
}

function getLinkRange(view) {
    // case 1: add link to selection
    // case 2: edit an existing link
    var range = view.state.selection.ranges[0];
    var start = range.$from.pos,
        end = range.$to.pos;
    if (start === end) {
        // collapsed case
        // if link surrounds cursor, edit link.
        // if no surrounding link, do nothing.
        var node = view.state.doc.nodeAt(start);
        if (node && view.state.schema.marks.link.isInSet(node.marks)) {
            // link surround case
            // modify start and end to cover the surrounding link range.
            var linkRange = getSurroundingLinkRange(view, start);
            start = linkRange.start;
            end = linkRange.end;
        } // else do nothing
    } // else do nothing.
    return {
        start: start,
        end: end,
    };
}

function getSurroundingLinkRange(view, index) {
    var links = getAllLinks(view);
    var linkSurroundingIndex = links.filter(function (linkRng) {
        return index >= linkRng.start && index <= linkRng.end;
    })[0];
    return linkSurroundingIndex;
}

export function addLink(options, view, link) {
    var regurl = options.regex || defaultLinkRegex;
    var isValidUrl = regurl.test(link);
    var attrs = {}

    // always check if the link starts with http:// or https://
    // if it does'nt start with http:// or https://, then add http:// to the link, so that the link will not be relative
    // that is if http:// is not added and simply google.com is added, then the link will be relative
    // so on clicking the link it will go to currentdomain/google.com
    // instead if http:// is added, then on clicking the link it will go to http://google.com
    if(!link.startsWith('ht' + 'tp://') && !link.startsWith('ht' + 'tps://')) {
        link = 'ht' + 'tp://' + link
    }

    attrs.href = link

    if (isValidUrl) {
        var markType = view.state.schema.marks.link;
        var range = getLinkRange(view);
        view.state.tr.removeMark(range.start, range.end, markType);
        var schema = view.state.schema;
        if(range.start === range.end) {
            var nodeAtStart = view.state.doc.nodeAt(range.start);
            var markSet = (nodeAtStart && nodeAtStart.storedMarks) || [];
            var mark = schema.mark('link', attrs) //no i18n
            markSet.push(mark);
            var textNode = schema.text(link, mark);
            var tr = view.state.tr.replaceWith(range.start, range.end, textNode);
            view.dispatch(tr);
        } else {
            view.dispatch( view.state.tr.addMark(range.start, range.end, view.state.schema.marks.link.create(attrs) ) );
        }
    } else {
        throw new Error("Invalid URL")
    }
}

export function addLinkWithText(options, view, link, text) {
    var regurl = options.regex || defaultLinkRegex;
    var isValidUrl = regurl.test(link);

    // always check if the link starts with http:// or https://
    // if it does'nt start with http:// or https://, then add http:// to the link, so that the link will not be relative
    // that is if http:// is not added and simply google.com is added, then the link will be relative
    // so on clicking the link it will go to currentdomain/google.com
    // instead if http:// is added, then on clicking the link it will go to http://google.com
    if (!link.startsWith("ht" + "tp://") && !link.startsWith("ht" + "tps://")) {
        link = "ht" + "tp://" + link;
    }

    var from = view.state.selection.$from.pos;
    var to = view.state.selection.$to.pos;
    if (isValidUrl) {
        var attrs = { href: link };
        var linkMark = view.state.schema.marks.link.create(attrs);
        var textNode = view.state.schema.text(text, [linkMark]);
        view.dispatch(view.state.tr.replaceWith(from, to, textNode));
    }
}

// removes link if present where the cursor is placed
export function removeLink(view) {
    var range = view.state.selection.ranges[0];
    var start = range.$from.pos,
        end = range.$to.pos;

    if (start === end) {
        // collapsed case
        // if link surrounds cursor, edit link.
        // if no surrounding link, do nothing.
        var node = view.state.doc.nodeAt(start);
        if (view.state.schema.marks.link.isInSet(node.marks)) {
            // link surround case
            // modify start and end to cover the surrounding link range.
            range = getSurroundingLinkRange(view, start);
            start = range.start;
            end = range.end;
        } // else do nothing
    } // else do nothing.

    view.dispatch(view.state.tr.removeMark(start, end, view.state.schema.marks.link));
}

export { defaultLinkRegex }

// TOOD :
// 1. do link autodetect on paste and on type
// 2. Make inclusive as true to handle spell replacement issue
// 3. Need to add context menu when cursor is in link