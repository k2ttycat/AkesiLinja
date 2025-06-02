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

import { parse } from "@babel/parser";
import { generate } from "@babel/generator";
import ASTTypes from "ast-types";

export function applyInjections(source: string, mod: string): string {
	console.warn("Applying injections has not been implemented.");

	// This will allow the mod to use the AkesiLinja's API to inject itself.
	// In the future, injections will be applied in `applyInjections()` instead.
	// This will not be backwards compatible
	eval?.(mod);
	return source;
};