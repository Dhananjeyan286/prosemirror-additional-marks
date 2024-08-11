import { addBoldMark, toggleBold } from "./basicMarks/bold"
import { addItalicsMark, toggleItalics } from "./basicMarks/italics";
import { addUnderlineMark, toggleUnderline } from "./basicMarks/underline"
import { addStrikethroughMark, toggleStrikethrough } from "./basicMarks/strikethrough"
import { addLinkMark, addLink, addLinkWithText, removeLink } from "./basicMarks/link";
import { addFontFamilyMark, setFontFamily } from "./fontMarks/fontFamily";
import { addFontSizeMark, setFontSize } from "./fontMarks/fontSize";
import { addFontColorMark, setFontColor } from "./fontMarks/fontColor";
import { addBackgroundColorMark, setBackgroundColor } from "./fontMarks/backgroundColor";
import { addScriptMark, toggleSubScript, toggleSuperScript } from "./advancedMarks/script";
import { addInlineCodeMark, toggleInlineCode } from "./advancedMarks/inlineCode";

var featureSpec = {
    bold: {
        addMarks: function (marks, options) {
            marks = marks.remove("strong"); // remove bold mark if present already
            return addBoldMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleBold = toggleBold.bind(null, view); // view.commands.toggleBold()
        },

        registerShortcut: function (view, options) {
            view.registerShortcut("Mod-b", view.commands.toggleBold);
        },
    },
    italics: {
        addMarks: function (marks, options) {
            marks = marks.remove("em") // remove italics mark if already present
            return addItalicsMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleItalics = toggleItalics.bind(null, view); // view.commands.toggleItalics()
        },

        registerShortcut: function (view, options) {
            view.registerShortcut("Mod-i", view.commands.toggleItalics);
        },
    },
    underline: {
        addMarks: function (marks, options) {
            return addUnderlineMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleUnderline = toggleUnderline.bind(null, view); // view.commands.toggleUnderline()
        },

        registerShortcut: function (view, options) {
            view.registerShortcut("Mod-u", view.commands.toggleUnderline);
        },
    },
    strikethrough: {
        addMarks: function (marks, options) {
            return addStrikethroughMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleStrikethrough = toggleStrikethrough.bind( null, view ); // view.commands.toggleStrikethrough()
        },

        registerShortcut: function (view, options) {
            view.registerShortcut("Mod-Shift-x", view.commands.toggleStrikethrough);
        },
    },
    link: {
        addMarks: function (marks, options) {
            marks = marks.remove("link") // remove link mark if already present
            return addLinkMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.addLink = addLink.bind(null, options, view); // view.commands.addLink(link)
            view.commands.addLinkWithText = addLinkWithText.bind(null, options, view); // view.commands.addLinkWithText(link, text)
            view.commands.removeLink = removeLink.bind(null, view); // view.commands.removeLink()
        },
    },
    fontSize: {
        addMarks: function (marks, options) {
            return addFontSizeMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.setFontSize = setFontSize.bind(null, options, view); // view.commands.setFontSize("13")
        },
    },
    fontFamily: {
        addMarks: function (marks, options) {
            return addFontFamilyMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.setFontFamily = setFontFamily.bind(null, options, view); // view.commands.setFontFamily("Times New Roman")
        },
    },
    fontColor: {
        addMarks: function (marks, options) {
            return addFontColorMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.setFontColor = setFontColor.bind(null, options, view); // view.commands.setFontColor("red")
        },
    },
    backgroundColor: {
        addMarks: function (marks, options) {
            return addBackgroundColorMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.setBackgroundColor = setBackgroundColor.bind(null, options, view); // view.commands.setBackgroundColor("pink")
        },
    },
    script: {
        addMarks: function (marks, options) {
            return addScriptMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleSuperScript = toggleSuperScript.bind(null, view); // view.commands.toggleSuperScript()
            view.commands.toggleSubScript = toggleSubScript.bind(null, view); // view.commands.toggleSubScript()
        },

        registerShortcut: function (view, options) {
            view.registerShortcut("Mod-.", view.commands.toggleSuperScript);
            view.registerShortcut("Mod-,", view.commands.toggleSubScript);
        },
    },
    inlineCode: {
        addMarks: function (marks, options) {
            marks = marks.remove("code") // remove inline code mark if already present
            return addInlineCodeMark(marks, options);
        },

        addCommands: function (view, options) {
            view.commands.toggleInlineCode = toggleInlineCode.bind(null, view); // view.commands.toggleInlineCode()
        },
    },
};

export default featureSpec