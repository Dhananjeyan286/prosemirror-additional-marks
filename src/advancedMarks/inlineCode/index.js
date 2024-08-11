import { toggleMark } from "prosemirror-commands";

function getInlineCodeMarkDef() {
    return {
        parseDOM: [
            { tag: "code" },
            { tag: "q" }
        ],
        toDOM: function () {
            return ["code"];
        }
    }
}

export function addInlineCodeMark(marks, options) {
    return marks.append({
        inlineCode: getInlineCodeMarkDef(options)
    })
}


export function toggleInlineCode(view) {
    return toggleMark(view.state.schema.marks.inlineCode)(view.state, view.dispatch);
}