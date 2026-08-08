/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import {
  bankDataByBBAN,
  bankDataByBIC,
  bankDataByBLZ,
  bankDataByIBAN,
} from "./lib/data";
import { isValidBIC } from "./lib/validate";

declare global {
  interface Window {
    bankdataGermany: {
      // biome-ignore lint/complexity/noBannedTypes: Browser global, only need "callable", not a specific signature
      [name: string]: Function;
    };
  }
}

if (typeof window.bankdataGermany === "undefined") {
  window.bankdataGermany = {};
}

window.bankdataGermany.bankDataByBBAN = bankDataByBBAN;
window.bankdataGermany.bankDataByBIC = bankDataByBIC;
window.bankdataGermany.bankDataByBLZ = bankDataByBLZ;
window.bankdataGermany.bankDataByIBAN = bankDataByIBAN;
window.bankdataGermany.isValidBIC = isValidBIC;
