import * as esprima from "esprima";
import escodegen from "escodegen";

declare global {
	interface Window {
		asekilinja: {
			applyChanges: (code: string) => string
		}
	}
}

export function init() {
	window.asekilinja = {
		applyChanges(code) {
			const ast = esprima.parseScript(code);
			console.log(ast.body.length); // just to see it do something.
			// @ts-ignore escodegen.FORMAT_MINIFY *does* exist.
			return escodegen.generate(ast, { format: escodegen.FORMAT_MINIFY });
		}
	};
}