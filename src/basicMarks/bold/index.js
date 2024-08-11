import { toggleMark } from "prosemirror-commands"

function getBoldMarkDef() {
    return {
        parseDOM: [
            { tag: "strong" },
            {
                tag: "b",
                getAttrs: function (mark) {
                    return mark.style.fontWeight != "normal" && null;
                }
            },
            {
                style: "font-weight",
                getAttrs: function (value) {
                    return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null;
                }
            }
        ],

        toDOM: function () {
            return ["strong"];
        }
    }
}

export function addBoldMark(marks, options) {
    return marks.append({
        bold: getBoldMarkDef(options)
    })
}

export function toggleBold(view) {
    return toggleMark(view.state.schema.marks.bold)(view.state, view.dispatch)
}