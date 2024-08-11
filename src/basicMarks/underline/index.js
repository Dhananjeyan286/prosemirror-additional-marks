import { toggleMark } from "prosemirror-commands"

function getUnderlineMarkDef() {
    return {
            parseDOM: [
            { tag: "u" },
            {
                style: "text-decoration",
                getAttrs: function (value) {
                    value = value.toLowerCase();
                    return value.includes("underline");
                }
            }
        ],

        toDOM: function () {
            return ["u"];
        }
    }
}

export function addUnderlineMark(marks, options) {
    return marks.append({
        underline: getUnderlineMarkDef(options)
    })
}


export function toggleUnderline(view) {
    return toggleMark(view.state.schema.marks.underline)(view.state, view.dispatch);
}