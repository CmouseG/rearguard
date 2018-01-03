import chalk from "chalk";
import { execSync } from "child_process";
import * as chokidar from "chokidar";
import * as fs from "fs";
import * as DtsCreator from "typed-css-modules";
import { context, nodeModulePath } from "../config/target.config";

export function typedCSS(forceBuild = false) {
  if (forceBuild) {
    execSync(`node ${nodeModulePath}/typed-css-modules/lib/cli.js ${context} -c`, { encoding: "utf8", stdio: "inherit" });
  } else {
    const creator = new DtsCreator({
      camelCase: true,
      rootDir: process.cwd(),
      searchDir: context,
    });
    const watcher = chokidar.watch([`${context}/**/*.css`], { ignoreInitial: true });

    watcher.on("change", async (filePath) => {
      const content = await creator.create(filePath, fs.readFileSync(filePath, { encoding: "utf-8" }));
      await content.writeFile();

      console.log(chalk.bold.magenta(`[REARGUARD][TYPED_CSS][FROM: ${filePath}]`));
    });

    console.log(chalk.bold.magenta(`[REARGUARD][TYPED_CSS][WATCH_CSS]`));
  }
}
