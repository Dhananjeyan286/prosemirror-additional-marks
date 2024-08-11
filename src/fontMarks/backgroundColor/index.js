import { setFontMark } from "../utils";

function getBackgroundColorMarkDef(options) {
    return {
        attrs: {
            value: { default: null }
        },
        parseDOM: [
            {
                style: "background-color",
                getAttrs: function (colorValue) {
                    if (!colorValue) {
                        return false
                    } else if(colorValue === options.default) {
                        return false
                    } else {
                        return { value: colorValue };
                    }
                }
            }
        ],

        toDOM: function (node) {
            var { value } = node.attrs;
            if (value) {
                return [
                    "span",
                    { style: "background-color:" + value + ";" },
                ];
            }
        }
    }
}

export function addBackgroundColorMark(marks, options) {
    return marks.append({
        backgroundColor: getBackgroundColorMarkDef(options)
    })
}

export function setBackgroundColor(options, view, value) {
    if(!value) {
        value = ""
    } else {
        if (value === options.default) {
            value = "";
        }
    }

    return setFontMark(view.state.schema.marks.backgroundColor, value, view);
}

// TODO :
// 1. Use converter to convert all incoming values into #rrggbbaa format, and compare those values with default background color value
// (convert default background color value also to #rrggbbaa and then compare),
// only color values with the format #rrggbbaa should go into the editor both through parseDOM and through commands