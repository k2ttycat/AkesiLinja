/*
 * Copyright (C) 2025 K2ttycat
 *
 * This file is part of AkesiLinja.
 *
 * AkesiLinja is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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
		fs.writeFileSync(path.resolve("dist/AkesiLinja-userscript.js"), fs.readFileSync(path.resolve("src/userscript-metadata.js"), "utf8") + await outputFS.readFile(bundle.filePath, "utf8"));
	}
} finally {
	await workerFarm.end();
}