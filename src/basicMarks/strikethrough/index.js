import { toggleMark } from "prosemirror-commands";

function getStrikethroughMarkDef() {
    return {
        parseDOM: [
            { tag: "s" },
            { tag: "strike" },
            { tag: "del" },
            {
                style: "text-decoration",
                getAttrs: function (value) {
                    value = value.toLowerCase();
                    return isStringPresent(value, "line-through");
                }
            }
        ],

        toDOM: function () {
            return ["del"];
        }
    }
}

export function addStrikethroughMark(marks, options) {
    return marks.append({
        strikethrough: getStrikethroughMarkDef(options)
    })
}


export function toggleStrikethrough(view) {
    return toggleMark(view.state.schema.marks.strikethrough)(view.state, view.dispatch);
}