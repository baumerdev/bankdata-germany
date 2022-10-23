/**
 * bankdata-germany
 * Copyright (C) 2022 Markus Baumer <markus@baumer.dev>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.

 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ProbablyString } from "./types";

/**
 * Extract  BLZ from BBAN
 *
 * @param bban German BBAN with 18 digits
 * @returns BLZ or null if invalid
 */
export const extractBLZFromBBAN = (bban: ProbablyString): string | null => {
  if (!bban || !bban.match(/^[1-9]\d{17}$/)) {
    return null;
  }

  return bban.slice(0, 8);
};
