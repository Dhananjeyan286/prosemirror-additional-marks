import { Plugin, PluginKey } from "prosemirror-state";
import { getShortcutsPlugin } from "./shortcuts"
import { preProcessConfig, getSubConfig } from "./index"

function getStyleText(config) {
    var defaultFontSize = getSubConfig("fontSize", config).default
    var defaultFontFamily = getSubConfig("fontFamily", config).default;
    var defaultFontColor = getSubConfig("fontColor", config).default;
    var defaultBackgroundColor = getSubConfig("backgroundColor", config).default;

    return "font-size: " + defaultFontSize + "; font-family: " + defaultFontFamily + "; color: " + defaultFontColor + "; background-color: " + defaultBackgroundColor + ";"
}

function getCursorEventsPlugin() { // a plugin that throws the marks at current cursor position whenever view is updated,
    // this can be used when updating the menubar with respect to cursor movements
    // for eg : bold icon can be highlighted if bold mark is present at current cursor position by adding an event listener to the dom event "cursorPositionChanged"
    return new Plugin({
        key: new PluginKey("cursorEvents"),
        view: function() {
            return {
                update: function(view) {
                    var marks = getMarks(view)
                    view.dom.dispatchEvent(new CustomEvent('cursorPositionChanged', {
                        detail: { marks }
                    }));
                }
            }
        }

        
    })
}

var getMarks = function(view) {
    var fromPos = view.state.selection.$from.pos, toPos = view.state.selection.$to.pos
    var marks;

    if(fromPos === toPos) {
        marks = view.state.storedMarks || view.state.selection.$from.marks();
    } else {
        // if there is selction alone get marks from, fromPosition + 1, instead of from position:

        // in general the decision to whether enable bold icon or not should be taken based on, if the user types a letter there, will that letter
        // be inserted as bold letter or not, irrespective of whether the from & to positions are same or different, if the letter is inserted as bold
        // letter then bold icon should be enabled else it shld'nt be enabled.
        
        // assume the below case:
        // double click and select a word, and then click bold icon, now the expectation is the word should be bold as well as bold icon should be enabled,
        // because if we type any letter now, the selected word would be replaced by the typed letter, and the letter would be bold as well.
        // but what we get is the word becomes bold but bold icon is not enabled, this is because from position doesn'nt have bold mark,
        // only fromPosition + 1 has bold mark.
        
        var newFromPos = fromPos + 1
        var newResolvedFromPos = view.state.doc.resolve(newFromPos)
        marks = newResolvedFromPos.marks()
    }

    return marks
}

export function getPlugins(config) {
    config = preProcessConfig(config)

    var plugins = [getShortcutsPlugin(), getCursorEventsPlugin()]

    var attributes = {
        style: getStyleText(config),
    };
    return plugins.concat(
        new Plugin({
            key: new PluginKey("additionalMarksDefaultAttributes"),
            props: { attributes: attributes },
        })
    );
}
