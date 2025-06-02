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

import { applyInjections } from "./common.ts";
import astTypes from "ast-types";
import * as generator from "@babel/generator";
import * as parser from "@babel/parser";

declare global {
	interface Window {
		akesilinja: {
			astTypes,
			generator,
			parser
		}
	}
}

(function () {
	if (window.akesilinja) {
		alert("AkesiLinja is already loaded; maybe you have multiple copies trying to run at once?");
	} else {
		makeGUI();
		waitForGame((game) => {
			window.akesilinja = {
				astTypes,
				generator,
				parser
			};
			const mod = getMod();
			const modedGame = applyInjections(game, mod);
			eval?.(modedGame);
		});
	}

	function makeGUI() {
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

	// Todo: Find a more elegent way to detect Google Snake.
	function waitForGame(fn: (game: string) => void) {
		const appendChildOld = document.body.appendChild;
		// @ts-ignore `DocumentFragment` is not assignable to `T extends node`.
		// UM ACTUALLY, `DocumentFragment` CAN be returned from appendChild().
		// See https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild#return_value
		document.body.appendChild = function (child) {
			if (!(child instanceof HTMLScriptElement)) return Reflect.apply(appendChildOld, this, [child]);

			// I have no clue how this works, but it detects when the script not Google Snake.
			if (
				!child.src.includes('funbox') &&
				!child.src.includes('xjs=s1') &&
				(!child.src.includes('/xjs/') || window.location.href.includes('fbx?fbx=snake_arcade'))
			) return Reflect.apply(appendChildOld, this, [child]);

			var returnVal = child instanceof DocumentFragment ? new DocumentFragment() : child;
			const req = new XMLHttpRequest();
			req.open('GET', child.src, false);
			req.onload = () => {
				if (!/trophy|apple|snake_arcade/.test(req.responseText)) {
					// Oops, this code doesn't look like Google Snake!
					returnVal = Reflect.apply(appendChildOld, this, [child]);
					return;
				}

				// Now we have our game code.
				fn(req.responseText);
			};
			req.send();
			return returnVal;
		};
	}

	function getMod(): string {
		// First, load locally.
		var mod = localStorage.getItem("snakeMod");
		if (mod) return mod;

		// Then, remotely.
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
		if (mod) return mod;

		// Lastly, give up.
		return "console.warn(\"No mod has been loaded.\");";
	}
})();
