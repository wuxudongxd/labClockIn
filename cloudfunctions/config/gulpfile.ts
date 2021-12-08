import fs from "fs/promises";
import path from "path";
import { OutputOptions, rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import clear from "rollup-plugin-clear";
import copy from "rollup-plugin-copy";

const entryDir = "../functions";
const outDir = "../build";

const compile = async () => {
  const functions = await fs.readdir(entryDir);
  const builds = functions.map(async (item) => {
    const input = `${entryDir}/${item}`;
    const output = `${outDir}/${item}`;

    const inputOption = {
      input: `${input}/test1.ts`,
      plugins: [
        // 清空目标目录
        clear({
          targets: [output],
        }),
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
        }),
        commonjs(),
        typescript(),
      ],
      external: ["wx-server-sdk"],
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

export default compile;
