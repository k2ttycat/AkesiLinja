import { init } from "./common.ts";

(function () {
	if (window.asekilinja) {
		alert("AsekiLinja is already loaded; maybe you have multiple copies trying to run at once?");
	} else {
		init();

		var appendChildOld = document.body.appendChild;
		document.body.appendChild = function (...args) {
			var [elm] = args;
			if (elm.tagName !== "SCRIPT") return Reflect.apply(appendChildOld, this, args);

			// I have no clue how this works, but it detects when the script not Google Snake.
			if (
				!elm.src.includes('funbox') &&
				!elm.src.includes('xjs=s1') &&
				(!elm.src.includes('/xjs/') || window.location.href.includes('fbx?fbx=snake_arcade'))
			) return Reflect.apply(appendChildOld, this, args);

			var returnVal = elm instanceof DocumentFragment ? new DocumentFragment : elm;
			const req = new XMLHttpRequest();
			req.open('GET', elm.src, false);
			req.onload = () => {
				if (!/trophy|apple|snake_arcade/.test(req.responseText)) {
					// Oops, this code doesn't look like Google Snake!
					returnVal = Reflect.apply(appendChildOld, this, args);
					return;
				}

				// Now we have our game code.
				var newGameCode = window.asekilinja.applyChanges(req.responseText);
				(0, eval)(newGameCode);
			};
			req.send();
			return returnVal;
		};
	}
})();