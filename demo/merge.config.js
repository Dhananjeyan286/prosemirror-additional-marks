import resolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
// import builtins from 'rollup-plugin-node-builtins';

let configuration = [
    {
        input: "./src/index.js",
        output: {
            format: "iife",
            file: "./bundle.js",
            name: "ProsemirrorAdditionalMarksDemo",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),
        ],
    },
];

export default () => {
    return configuration;
};
