function markApplies(doc, ranges, type) {
    var rangeAllowsMark = function (i) {
        var ref = ranges[i];
        var $from = ref.$from;
        var $to = ref.$to;
        var can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false; //if depth is 0 check first whether doc node allows this markType else set can to false

        doc.nodesBetween($from.pos, $to.pos, function (node) {
            if (can) {
                return false;
            }
            can = node.inlineContent && node.type.allowsMarkType(type);
        });
        if (can) {
            return { v: true };
        }
    };

    for (var i = 0; i < ranges.length; i++) {
        var returned = rangeAllowsMark(i);
        if (returned) {
            return returned.v;
        }
    }
    return false;
}

export function setFontMark(markType, value, view) {
    var ref = view.state.selection;
    var empty = ref.empty;
    var $cursor = ref.$cursor;
    var ranges = ref.ranges;
    var state = view.state;
    var dispatch = view.dispatch;

    if ((empty && !$cursor) || !markApplies(view.state.doc, ranges, markType)) {
        return false;
    }

    var attrs = { value: value };

    /** This code is generic for font-family, font-size.
     * For example, if we want to change the font:
     *
     * Case 1: If $from === $to then we would have value for $cursor
     *
     *      a. Sub-Case-1:If fontFamily value in attrs is empty, it means the required fontFamily value is the default font type defined in CSS file,
     *      and if we want default font type we no need to add any mark , we should only remove the fontFamily mark if it is already present.
     *
     *      b. Sub-Case 2:If fontFamily mark with the attrs value "Times New Roman" is already present then, and if we want to change the font type to "Courier New",
     *      then we need to first remove the fontFamily mark with the attrs value "Times New Roman" and then only add a new fontFamily mark with the attrs set to "Courier New".
     *
     *      c. Sub-Case 3:If fontFamily value in attrs has some value and if fontFamily mark is not present at all then we only need to add the fontFamily mark to stored marks.
     *
     * Case 2: If $from !== $to then we would not have any value for $cursor:
     *
     *      a. Sub-Case-1: If we want to change the font type to default font then we need to just remove the fontFamily mark if it is already present.
     *
     *      b. Sub-Case-2: If we want to change the font to another font , then first remove the fontFamily mark if it is already present and
     *      then add the fontFamily mark with the attrs value set to the required font type.
     */

    if ($cursor) {
        if (!attrs.value) {
            dispatch(state.tr.removeStoredMark(markType));
        } else if (markType.isInSet(state.storedMarks || $cursor.marks())) {
            let tr1 = state.tr.removeStoredMark(markType);
            dispatch(tr1.addStoredMark(markType.create(attrs)));
        } else {
            dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
    } else {
        var tr = state.tr;

        for (var i$1 = 0; i$1 < ranges.length; i$1++) {
            var ref$2 = ranges[i$1];
            var $from$1 = ref$2.$from;
            var $to$1 = ref$2.$to;

            if (!attrs.value) {
                tr = tr.removeMark($from$1.pos, $to$1.pos, markType);
                continue;
            }

            tr = tr.removeMark($from$1.pos, $to$1.pos, markType);
            tr = tr.addMark($from$1.pos, $to$1.pos, markType.create(attrs));
        }
        view.dispatch(tr);
    }

    return true;
}
