import fs from "fs/promises";
import path from "path";
import { OutputOptions, rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import sucrase from "@rollup/plugin-sucrase";
import copy from "rollup-plugin-copy";
// import { watch } from "gulp";

const entryDir = "../functions";
const outDir = "../build";

const compile = async () => {
  const functions = await fs.readdir(entryDir);
  const builds = functions.map(async (item) => {
    const input = `${entryDir}/${item}`;
    const output = `${outDir}/${item}`;

    const inputOption = {
      input: `${input}/index.ts`,
      plugins: [
        copy({
          targets: [
            {
              src: `${input}/package.json`,
              dest: output,
            },
          ],
          verbose: true,
        }),
        resolve({
          resolveOnly: [""],
          extensions: [".js", ".ts"],
        }),
        commonjs(),
        sucrase({
          exclude: ["node_modules/**"],
          transforms: ["typescript"],
        }),
      ],
    };
    const bundle = await rollup(inputOption);
    const outputOption = {
      file: `${output}/index.js`,
      format: "cjs",
      sourcemap: true,
      banner: `/* 此文件自动生成，请勿手动修改，源文件位于 ${path.relative(
        output,
        input
      )} */`,
    };
    return bundle.write(outputOption as OutputOptions);
  });
  return Promise.all(builds);
};

// watch(entryDir, compile);

export default compile;
