import { setFontMark } from "../utils";

function getFontFamilyMarkDef(options) {
    return {
        attrs: {
            value: { default: null },
        },
        parseDOM: [
            {
                style: "font-family",

                getAttrs: function (fontName) {
                    if (!fontName) {
                        return false;
                    }
                    var defaultFontFamily = options.default.toLowerCase();
                    fontName = fontName.replace(/"|'/g, ""); // remove quotes
                    var modifiedFontName = fontName.toLowerCase()

                    if(modifiedFontName === defaultFontFamily) {
                        return false
                    } else {
                        return { value: fontName }
                    }
                },
            },
        ],

        toDOM: function (node) {
            var value = node.attrs.value;
            if (value) {
                return [
                    "span",
                    { style: "font-family:" + value + ";" },
                ];
            }
        }
    }
}

export function addFontFamilyMark(marks, options) {
    return marks.append({
        fontFamily: getFontFamilyMarkDef(options)
    })
}

export function setFontFamily(options, view, value) {
    if(!value) {
        value = ""
    } else {
        var defaultFontFamily = options.default.toLowerCase();
        value = value.replace(/"|'/g, ""); // remove quotes
        var modifiedValue = value.toLowerCase();

        if (modifiedValue === defaultFontFamily) {
            value = "";
        }
    }

    return setFontMark(view.state.schema.marks.fontFamily, value, view);
}

// TODO :
// 1. Get set of allowed font family names from options and allow only those font families into the editor both in parseDOM and through commands
// 2. fontName can consists of space separated values, in those cases, check if first font is present in allowed font, if so insert it, else ignore it.
// 3. if fontName consists of space separated values, iterate through each font family, and return the first font family name that matches with the allowed font families
// if no font family name matches, then return false
// 4. Get 2 values for each allowed font family:
//      a. a display name used to show in menubar
//      b. a value which needs to be put inside the editor, which can consists of space separated fallback font families