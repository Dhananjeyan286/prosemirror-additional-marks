import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
// import builtins from 'rollup-plugin-node-builtins';

let configuration = [
    {
        input: "./src/index.js",
        output: {
            format: "iife",
            file: "./dist/index.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),
        ],
    },
    {
        input: "./src/index.js",
        output: {
            format: "iife",
            file: "./dist/index.min.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),
            terser(),
        ],
    },
    {
        input: "./src/index.js",
        output: {
            format: "iife",
            file: "./dist/index.es5.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: [
                                "> 1%",
                                "last 5 version",
                                "ie > 10",
                                "not dead",
                            ],
                        },
                    ],
                ],
            }),
        ],
    },
    {
        input: "./src/index.js",
        output: {
            format: "iife",
            file: "./dist/index.es5.min.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),

            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: [
                                "> 1%",
                                "last 5 version",
                                "ie > 10",
                                "not dead",
                            ],
                        },
                    ],
                ],
            }),
            terser(),
        ],
    },
    {
        input: "./src/index.js",
        output: {
            format: "es",
            file: "./dist/index.es.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),

            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: [
                                "> 1%",
                                "last 5 version",
                                "ie > 10",
                                "not dead",
                            ],
                        },
                    ],
                ],
            }),
        ],
    },
    {
        input: "./src/index.js",
        output: {
            format: "es",
            file: "./dist/index.es.min.js",
            name: "ProsemirrorAdditionalMarks",
        },
        plugins: [
            // builtins(),
            resolve(),
            commonJS({
                include: ["node_modules/*"],
            }),
            babel({
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: [
                                "> 1%",
                                "last 5 version",
                                "ie > 10",
                                "not dead",
                            ],
                        },
                    ],
                ],
            }),
            terser(),
        ],
    },
];

export default (cmdLineArgs) => {
    if (cmdLineArgs.dev) {
        return configuration[4];
    } else {
        return configuration;
    }
};
