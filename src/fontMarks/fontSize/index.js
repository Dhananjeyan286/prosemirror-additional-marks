import { setFontMark } from "../utils";

function getFontSizeMarkDef(options) {
    return {
        attrs: {
            value: { default: null },
        },
        parseDOM: [
            {
                style: "font-size",
                getAttrs: function (sizeValue) {
                    if (!sizeValue) {
                        return false;
                    }
                    sizeValue = sizeValue.replace(/"|'| /g, ""); // remove quotes if present
                    if(sizeValue === options.default) {
                        return false
                    } else {
                        return { value: sizeValue };
                    }
                },
            }
        ],

        toDOM: function (node) {
            var value = node.attrs.value;
            if (value) {
                return [
                    "span",
                    { style: "font-size:" + value + ";" },
                ]
            }
        }
    }
}

export function addFontSizeMark(marks, options) {
    return marks.append({
        fontSize: getFontSizeMarkDef(options)
    })
}

export function setFontSize(options, view, value) {
    if(!value) {
        value = ""
    } else {
        value = value.replace(/"|'| /g, ""); // remove quotes if present
        if (value === options.default) {
            value = "";
        }
    }

    return setFontMark(view.state.schema.marks.fontSize, value, view);
}

// TODO :
// 1. Get size converter and convert all font sizes to pt(size units) both in parseDOM and through commands
// 1. Get min and max font size values from options and add font sizes only within that range in both parseDOM and through commands