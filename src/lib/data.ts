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

import currentBank from "../data/current.json";
import { extractBLZFromBBAN } from "./extract";
import { BankData, ProbablyString } from "./types";

export interface Banks {
  [method: string]: string[];
}

/**
 * Get name (and BIC if available) for bank with given BLZ
 *
 * @param blz German BLZ with 8 digits
 * @returns Bank data or null if invalid
 */
export const bankDataByBLZ = (blz: string): BankData | null => {
  if (!blz.match(/^[1-9]\d{7}$/)) {
    return null;
  }

  const bankData = (currentBank as Banks)[blz];
  if (!bankData) {
    return null;
  }

  return {
    bankName: bankData[0],
    bic: bankData[1],
    blz: blz,
  };
};

/**
 * Get name (and BIC if available) for bank with given BBAN
 *
 * @param bban German BBAN with 18 digits
 * @returns Bank data or null if invalid
 */
export const bankDataByBBAN = (bban: ProbablyString): BankData | null => {
  const blz = extractBLZFromBBAN(bban);
  if (!blz) {
    return null;
  }

  return bankDataByBLZ(blz);
};

/**
 * Get name (and BIC if available) for bank with given IBAN
 *
 * @param bban German IBAN with 22 digits
 * @returns Bank data or null if invalid
 */
export const bankDataByIBAN = (iban: ProbablyString): BankData | null => {
  if (!iban || !iban.match(/^DE\d{20}$/i)) {
    return null;
  }

  return bankDataByBBAN(iban.slice(4));
};

/**
 * Search all bank data and check if any contains the BIC
 *
 * @param bic BIC to search for
 * @returns Whether BIC exists in bank data
 */
export const isBICInData = (bic: string): boolean => {
  if (!bic.match(/^[A-Z]{4}DE[A-Z0-9]{2}([A-Z0-9]{3})?$/i)) {
    return false;
  }

  const searchBIC = `${bic.toUpperCase()}${bic.length === 8 ? "XXX" : ""}`;

  return (
    typeof Object.values(currentBank as Banks).find(
      (bank) => bank[1] && bank[1] === searchBIC
    ) !== "undefined"
  );
};
