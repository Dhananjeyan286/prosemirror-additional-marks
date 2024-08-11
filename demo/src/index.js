import { EditorState, Plugin } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { addMarks, addShortcuts, addCommands, getPlugins, sampleConfig } from "../../dist/index.es";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { buildKeymap, buildInputRules } from "prosemirror-example-setup";
import { keymap } from "prosemirror-keymap";

export function getDefaultPlugins(schema) {
    let plugins = [
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),
    ];

    var attributes = {
        class: "ProseMirror-example-setup-style"
    };

    return plugins.concat(
        new Plugin({
            props: { attributes: attributes },
        })
    );
}

let nodes = addListNodes(schema.spec.nodes, "paragraph block*", "block")

let mySchema = new Schema({
    nodes: nodes,
    marks: addMarks(schema.spec.marks, sampleConfig),
});

let editor = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        schema: mySchema,
        plugins: getDefaultPlugins(mySchema).concat(getPlugins(sampleConfig)),
    })
});
window.editor = editor

addCommands(editor, sampleConfig)
addShortcuts(editor, sampleConfig)
editor.dom.addEventListener("cursorPositionChanged", (e) => {
    console.log(e.detail); // a event that throws the marks at current cursor position whenever view is updated,
    // this can be used when updating the menubar with respect to cursor movements
    // for eg : bold icon can be highlighted if bold mark is present at current cursor position by adding an event listener to the dom event "cursorPositionChanged"
});