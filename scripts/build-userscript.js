import { Parcel, createWorkerFarm } from "@parcel/core";
import parcelFS from "@parcel/fs";
import fs from "fs";
import path from "path";

let workerFarm = createWorkerFarm();
let outputFS = new parcelFS.MemoryFS(workerFarm);

let bundler = new Parcel({
	entries: "src/userscript.js",
	mode: "production",
	defaultTargetOptions: {
		sourceMaps: false
	},
	defaultConfig: "@parcel/config-default",
	workerFarm,
	outputFS
});

try {
	let { bundleGraph } = await bundler.run();

	for (let bundle of bundleGraph.getBundles()) {
		fs.writeFileSync(path.resolve("dist/AsekiLinja-userscript.js"), fs.readFileSync(path.resolve("src/userscript-metadata.js"), "utf8") + await outputFS.readFile(bundle.filePath, "utf8"));
	}
} finally {
	await workerFarm.end();
}