import * as esbuild from "esbuild";
import {
  buildConfig,
  cleanDirectory,
  copyAssets,
  staticAssetsPath,
} from "./esbuild.common.js";

cleanDirectory(buildConfig.outdir);
copyAssets(staticAssetsPath, buildConfig.outdir);

const result = await esbuild.build(buildConfig);
console.log(result);
