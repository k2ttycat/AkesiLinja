/*
 * Copyright (C) 2025 K2ttycat
 *
 * This file is part of AsejiLinja.
 *
 * AsejiLinja is free software: you can redistribute it and/or modify
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

import * as esprima from "esprima";
import escodegen from "escodegen";
import { ASTNode } from "ast-types";

declare global {
	interface Window {
		asekilinja: {
			applyChanges: (code: string) => string,
			getAst: () => ASTNode
			mod: string
		}
	}
}

export function init() {
	var gameAst;
	window.asekilinja = {
		applyChanges(code) {
			gameAst = esprima.parseScript(code);
			try {
				(0, eval)(window.asekilinja.mod);
				return escodegen.generate(gameAst, { format: escodegen.FORMAT_MINIFY, verbatim: "x-verbatim" });
			} catch (error) {
				alert("Mod threw an error when attempting to load. Running vanilla version instead.");
				console.error(error);
				return code;
			}
		},
		getAst() {
			return gameAst;
		},
		mod: ""
	};

	// First load the mod from `snakeMod`.
	window.asekilinja.mod = localStorage.getItem("snakeMod") || "";
	if (window.asekilinja.mod !== "") return;

	// If we still don't have a mod, load it by fetching `snakeModUrl`.
	const snakeModUrl = localStorage.getItem("snakeModUrl");
	if (snakeModUrl) {
		const req = new XMLHttpRequest();
		req.open("GET", snakeModUrl, false);
		req.onload = () => {
			if (req.status !== 200) {
				alert(`Failed to load mod due to mod URL status: ${req.status} ${req.statusText}.`);
				return;
			}
			window.asekilinja.mod = req.responseText;
		};
		req.onerror = (error) => {
			alert(`Failed to load mod due to network error.`);
			console.error(error);
		};
		req.send();
	}
	console.warn("No mod has been specified.");
}