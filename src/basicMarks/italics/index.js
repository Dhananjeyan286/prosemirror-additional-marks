import { toggleMark } from "prosemirror-commands"

function getItalicsMarkDef() {
    return {
        parseDOM: [
            { tag: "i" },
            { tag: "em" },
            {
                style: "font-style",
                getAttrs: function (value) {
                    value = value.toLowerCase();
                    return value.includes("italic");
                }
            }
        ],

        toDOM: function () {
            return ["em"];
        }
    }
}

export function addItalicsMark(marks, options) {
    return marks.append({
        italics: getItalicsMarkDef(options)
    })
}

export function toggleItalics(view) {
    return toggleMark(view.state.schema.marks.italics)(view.state, view.dispatch)
}