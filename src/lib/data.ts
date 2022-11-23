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
import nextBank from "../data/next.json";
import { extractBLZFromBBAN } from "./extract";
import { BankData, ProbablyString } from "./types";

export interface Banks {
  [blz: string]: string[];
}

export interface NextBanks {
  remove: string[];
  upsert: Banks;
  valid: string;
}

/**
 * Returns date object
 *
 * @param date Date from string or current date if undefined
 * @returns
 */
export const dateObject = (date?: string | Date): Date => {
  if (date === undefined) {
    return new Date();
  }
  if (typeof date === "string") {
    return new Date(date);
  }

  return date;
};

/**
 * Combines current data by adding or removing from data provided in next
 * @param current
 * @param nextUpsert
 * @param nextRemove
 */
export const combineCurrentNext = (
  current: Banks,
  nextUpsert: Banks,
  nextRemove: string[]
): Banks => {
  const combinedData: Banks = { ...current, ...nextUpsert };

  for (const nextRemoveBLZ of nextRemove) {
    delete combinedData[nextRemoveBLZ];
  }

  return combinedData;
};

/**
 * Get data, either current or combined with next by comparing it to valid-to
 * date from next data
 * @param date
 * @returns
 */
export const bankDataSet = (date?: string | Date): Banks => {
  const nextValidFrom = new Date(nextBank.valid);
  const currentDate = dateObject(date);

  if (currentDate >= nextValidFrom) {
    return combineCurrentNext(currentBank, nextBank.upsert, nextBank.remove);
  }

  return currentBank;
};

/**
 * Get name (and BIC if available) for bank with given BLZ
 *
 * @param blz German BLZ with 8 digits
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null if invalid
 */
export const bankDataByBLZ = (
  blz: string,
  date?: string | Date
): BankData | null => {
  if (!blz.match(/^[1-9]\d{7}$/)) {
    return null;
  }

  const bankData = bankDataSet(date)[blz];
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
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null if invalid
 */
export const bankDataByBBAN = (
  bban: ProbablyString,
  date?: string | Date
): BankData | null => {
  const blz = extractBLZFromBBAN(bban);
  if (!blz) {
    return null;
  }

  return bankDataByBLZ(blz, date);
};

/**
 * Get name (and BIC if available) for bank with given IBAN
 *
 * @param bban German IBAN with 22 digits
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null if invalid
 */
export const bankDataByIBAN = (
  iban: ProbablyString,
  date?: string | Date
): BankData | null => {
  if (!iban || !iban.match(/^DE\d{20}$/i)) {
    return null;
  }

  return bankDataByBBAN(iban.slice(4), date);
};

/**
 * Search all bank data and check if any contains the BIC
 *
 * @param bic BIC to search for
 * @param date Bank data valid at this date (default: current date)
 * @returns Whether BIC exists in bank data
 */
export const isBICInData = (bic: string, date?: string | Date): boolean => {
  if (!bic.match(/^[A-Z]{4}DE[A-Z0-9]{2}([A-Z0-9]{3})?$/i)) {
    return false;
  }

  const searchBIC = `${bic.toUpperCase()}${bic.length === 8 ? "XXX" : ""}`;

  return (
    typeof Object.values(bankDataSet(date)).find(
      (bank) => bank[1] && bank[1] === searchBIC
    ) !== "undefined"
  );
};
