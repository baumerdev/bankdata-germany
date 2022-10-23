/*!
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

import { bankDataByBBAN, bankDataByBLZ, bankDataByIBAN } from "./lib/data";
import { isValidBIC } from "./lib/validate";

declare global {
  interface Window {
    bankdataGermany: {
      // eslint-disable-next-line @typescript-eslint/ban-types
      [name: string]: Function;
    };
  }
}

if (typeof window.bankdataGermany === "undefined") {
  window.bankdataGermany = {};
}

window.bankdataGermany.bankDataByBBAN = bankDataByBBAN;
window.bankdataGermany.bankDataByBLZ = bankDataByBLZ;
window.bankdataGermany.bankDataByIBAN = bankDataByIBAN;
window.bankdataGermany.isValidBIC = isValidBIC;
