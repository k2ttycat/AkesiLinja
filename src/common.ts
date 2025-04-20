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

import * as esprima from "esprima";
import escodegen from "escodegen";
import ASTTypes from "ast-types";

declare global {
	interface Window {
		akesilinja: {
			applyChanges: (code: string) => string,
			getAst: () => ASTTypes.ASTNode,
			ASTTypes
		}
	}
}

export function init() {
	var gameAst;
	var mod = "console.warn('No mod has been loaded.')";

	// Load the currently selected mod.
	mod = localStorage.getItem("snakeMod") || "";
	if (mod === "") {
		const snakeModUrl = localStorage.getItem("snakeModUrl");
		if (snakeModUrl) {
			const req = new XMLHttpRequest();
			req.open("GET", snakeModUrl, false);
			req.onload = () => {
				if (req.status !== 200) {
					alert(`Failed to load mod URL. Received status: ${req.status} ${req.statusText}.`);
					return;
				}
				mod = req.responseText;
			};
			req.onerror = (error) => {
				alert("Failed to load mod URL due to network error.");
				console.error(error);
			};
			req.send();
		}
	}

	// Global object to provide an API for mods.
	window.akesilinja = {
		applyChanges(code) {
			gameAst = esprima.parseScript(code);
			try {
				(0, eval)(mod);
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
		ASTTypes
	};

	// GUI menu for controling what mod gets loaded.
	const popoverContainer = document.createElement("div");
	popoverContainer.innerHTML = `
		<div popover="manual" id="akesilinja-menu">
			<p>Hello world! This is the AkesiLinja menu!</p>
		</div>
	`;
	const popoverButton = document.createElement("button");
	popoverButton.innerText = "AkesiLinja Mods";
	popoverButton.setAttribute("popovertarget", "akesilinja-menu");
	Object.assign(popoverButton.style, {
		ZIndex: "99999",
		position: "fixed",
		bottom: "0px",
		right: "0px"
	});
	document.body.appendChild(popoverContainer);
	document.body.appendChild(popoverButton);
}