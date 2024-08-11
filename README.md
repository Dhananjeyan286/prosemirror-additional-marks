# prosemirror-additional-marks

This package defines a set of additional marks for prosemirror which can be used when creating your own editor.

## Live Demo

[https://dhananjeyan286.github.io/prosemirror-additional-marks/demo/src/index.html](https://dhananjeyan286.github.io/prosemirror-additional-marks/demo/src/index.html)

## Installation
```
npm i prosemirror-additional-marks
```

## Usage

**Note : Add the below entry in your package.json file for now to avoid loading multiple prosemirror-model packages, will fix this in future versions
"resolutions": {
    "prosemirror-model": "1.22.3"
}**

```js

import { EditorState, Plugin } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { addMarks, addShortcuts, addCommands, getPlugins } from "../../dist/index.es";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { buildKeymap, buildInputRules } from "prosemirror-example-setup";
import { keymap } from "prosemirror-keymap";

let config = ["bold", "italics", "underline", "strikethrough", "link", "fontSize", "fontFamily", "fontColor", "backgroundColor", "script", "inlineCode"]

// config can also be like this
// let config = [
//     "bold",
//     "italics",
//     "underline",
//     "strikethrough",
//     { name: "link", regex: defaultLinkRegex },
//     { name: "fontSize", default: "10pt" },
//     { name: "fontFamily", default: "Arial" },
//     { name: "fontColor", default: "#000000" },
//     { name: "backgroundColor", default: "#ffffff" },
//     "script",
//     "inlineCode"
// ]

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
    marks: addMarks(schema.spec.marks, config),
});

let editor = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        schema: mySchema,
        plugins: getDefaultPlugins(mySchema).concat(getPlugins(config)),
    })
});
window.editor = editor

addCommands(editor, config)
addShortcuts(editor, config)
// editor.dom.addEventListener("cursorPositionChanged", (e) => {
//     console.log(e.detail); // a event that throws the marks at current cursor position whenever view is updated,
//     // this can be used when updating the menubar with respect to cursor movements
//     // for eg : bold icon can be highlighted if bold mark is present at current cursor position by adding an event listener to the dom event "cursorPositionChanged"
// });
```

## APIs Exposed

```js

import { preProcessConfig, getSubConfig, addMarks, addShortcuts, addCommands, getPlugins, sampleConfig } from "prosemirror-additional-marks"

addMarks(marks, config) // returns you the marks that needs to put in your schema based on your config

addShortcuts(view, config) // adds shortcuts based on your config

addCommands(view, config) // adds the commands to view.commands object which you can use to bind it to the menubar
// view.commands.addLink(link) eg - view.commands.addLink("https://www.google.com"),
// view.commands.addLinkWithText(link, text), eg - view.commands.addLinkWithText("https://www.google.com", "Google"),
// view.commands.removeLink(),

// view.commands.setBackgroundColor(color), eg - view.commands.setBackgroundColor("red"),
// view.commands.setBackgroundColor() - to remove background color,

// view.commands.setFontColor(color), eg - view.commands.setFontColor("red"),
// view.commands.setFontColor() - to remove font color,

// view.commands.setFontFamily(fontFamilyName), eg - view.commands.setFontFamily("Times New Roman"),
// view.commands.setFontFamily() - to remove font family,

// view.commands.setFontSize(size), eg - view.commands.setFontSize("15pt"),
// view.commands.setFontSize() - to remove font size,

// view.commands.toggleBold(),
// view.commands.toggleInlineCode(),
// view.commands.toggleItalics(),
// view.commands.toggleStrikethrough(),
// view.commands.toggleSubScript(),
// view.commands.toggleSuperScript(),
// view.commands.toggleUnderline()

getPlugins(config) // returns shortcuts plugin for the config, cursorEventsPlugin to get marks at current cursor position for every view updation,
// plugin that adds default style attributes to editor-div

sampleConfig // gives the default config

preProcessConfig(config) // returns the config after pre processing

getSubConfig(name, config) // returns the specific config for the given mark name

```

## Authors

[RM. Dhananjeyan](https://github.com/Dhananjeyan286)

## Credits

[Joe B. Lewis](https://github.com/joelewis) - For knowledge sharing

## Issues

Use Github Issues to file requests and bugs.

## License

MIT License
