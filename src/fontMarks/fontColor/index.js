import { setFontMark } from "../utils";

function getFontColorMarkDef(options) {
    return {
        attrs: {
            value: { default: null },
        },
        parseDOM: [
            {
                style: "color",
                getAttrs: function (colorValue) {
                    if (!colorValue) {
                        return false
                    } else if(colorValue === options.default) {
                        return false
                    } else {
                        return { value: colorValue };
                    }
                },
            },
        ],

        toDOM: function (node) {
            var { value } = node.attrs;
            if (value) {
                return [
                    "span",
                    { style: "color:" + value + ";" },
                ];
            }
        }
    }
}

export function addFontColorMark(marks, options) {
    return marks.append({
        fontColor: getFontColorMarkDef(options)
    })
}

export function setFontColor(options, view, value) {
    if(!value) {
        value = ""
    } else {
        if (value === options.default) {
            value = "";
        }
    }

    return setFontMark(view.state.schema.marks.fontColor, value, view);
}

// TODO :
// 1. Use converter to convert all incoming values into #rrggbbaa format, and compare those values with default font color value
// (convert default font color value also to #rrggbbaa and then compare), only color values with the format #rrggbbaa should go into the editor both through parseDOM and through commands