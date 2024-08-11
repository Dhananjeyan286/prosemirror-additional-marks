import { defaultLinkRegex } from "./basicMarks/link";
import featureSpec from "./buildEditor"
import { registerShortcut } from "./shortcuts"

var sampleConfig = [
    "bold",
    "italics",
    "underline",
    "strikethrough",
    { name: "link", regex: defaultLinkRegex },
    { name: "fontSize", default: "10pt" },
    { name: "fontFamily", default: "Arial" },
    { name: "fontColor", default: "#000000" },
    { name: "backgroundColor", default: "#ffffff" },
    "script",
    "inlineCode"
]

export function preProcessConfig(config) {
    return config.map((subConfig) => {
        if(typeof subConfig === "string") {
            return getSubConfig(subConfig, sampleConfig)
        } else {
            let defaultSubConfig = getSubConfig(subConfig.name, sampleConfig)
            return Object.assign({}, defaultSubConfig, subConfig)
        }
    })
}

export function getSubConfig(name, config) {
    var subConfigFeature = config.filter((subConfig) => {
        if(typeof subConfig === "string" && subConfig === name) {
            return true
        } else if(subConfig.name === name) {
            return true
        } else {
            return false
        }
    })[0]

    return typeof subConfigFeature === "string" ? { name: subConfigFeature } : subConfigFeature
}

export function addMarks(marks, config) {
    config = preProcessConfig(config);
    config.forEach((subConfig) => {
        marks = featureSpec[subConfig.name].addMarks(marks, subConfig)
    })
    return marks
}

export function addShortcuts(view, config) {
    config = preProcessConfig(config)

    view.registerShortcut = registerShortcut.bind(null, view)

    config.forEach((subConfig) => {
        featureSpec[subConfig.name].registerShortcut && featureSpec[subConfig.name].registerShortcut(view, subConfig)
    })
}

export function addCommands(view, config) {
    config = preProcessConfig(config)

    view.commands = {}

    config.forEach((subConfig) => {
        featureSpec[subConfig.name].addCommands(view, subConfig)
    })
}


export { getPlugins } from "./editorPlugins"
export { sampleConfig }

// TODO :
// 1. Need to bundle only one prosemirror-model package - since this is not possible now, in package.json in demo folder we have added "resolutions" keys
// and told it to reuse prosemirror-model package instead of using a new one.
// 2. Need to add menubar for all options