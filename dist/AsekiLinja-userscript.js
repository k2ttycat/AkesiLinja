// ==UserScript==
// @namespace https://github.com/k2ttycat
// @version 1.0
// @description A mod loader for Google Snake.
// @author k2ttycat (https://github.com/k2ttycat)
// @run-at document-body
// @updateURL https://github.com/k2ttycat/AsekiLinja/raw/main/dist/AsekiLinja-userscript.js
// @match https://*.google.com/search*
// @match https://*.google.com/fbx?fbx=snake_arcade*
// ==/UserScript==
window.asekilinja?alert("AsekiLinja is already running; maybe you have multiple copies trying to run at once?"):console.log("Hello");