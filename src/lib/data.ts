/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import currentBank from "../data/current.json";
import nextBank from "../data/next.json";
import { extractBLZFromBBAN } from "./extract";
import type { BankData, ProbablyString } from "./types";

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
  nextRemove: string[],
): Banks => {
  const combinedData: Banks = { ...current, ...nextUpsert };

  for (const nextRemoveBLZ of nextRemove) {
    delete combinedData[nextRemoveBLZ];
  }

  return combinedData;
};

const nextValidFrom = new Date(nextBank.valid);
let combinedBanks: Banks | undefined;

/**
 * Get data, either current or combined with next by comparing it to valid-to
 * date from next data
 * @param date
 * @returns
 */
export const bankDataSet = (date?: string | Date): Banks | null => {
  const currentDate = dateObject(date);
  if (Number.isNaN(currentDate.getTime())) {
    return null;
  }

  if (currentDate >= nextValidFrom) {
    combinedBanks ??= combineCurrentNext(
      currentBank,
      nextBank.upsert,
      nextBank.remove,
    );
    return combinedBanks;
  }

  return currentBank;
};

const bicMaps = new WeakMap<Banks, Map<string, string>>();

/**
 * Get (and lazily build) a BIC to BLZ lookup map for a data set
 */
const bicMap = (data: Banks): Map<string, string> => {
  let map = bicMaps.get(data);
  if (!map) {
    map = new Map();

    for (const [blz, bank] of Object.entries(data)) {
      if (bank[1] && !map.has(bank[1])) {
        map.set(bank[1], blz);
      }
    }

    bicMaps.set(data, map);
  }

  return map;
};

/**
 * Get name (and BIC if available) for bank with given BLZ
 *
 * @param blz German BLZ with 8 digits
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null if invalid
 */
export const bankDataByBLZ = (
  blz: ProbablyString,
  date?: string | Date,
): BankData | null => {
  if (!blz?.match(/^[1-9]\d{7}$/)) {
    return null;
  }

  const bankData = bankDataSet(date)?.[blz];
  if (!bankData) {
    return null;
  }

  return {
    bankName: bankData[0],
    bic: bankData[1],
    blz,
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
  date?: string | Date,
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
 * @param iban German IBAN with 22 digits
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null if invalid
 */
export const bankDataByIBAN = (
  iban: ProbablyString,
  date?: string | Date,
): BankData | null => {
  if (!iban?.match(/^DE\d{20}$/i)) {
    return null;
  }

  return bankDataByBBAN(iban.slice(4), date);
};

/**
 * Get bank data for bank with given BIC
 *
 * @param bic BIC to search for
 * @param date Bank data valid at this date (default: current date)
 * @returns Bank data or null
 */
export const bankDataByBIC = (
  bic: ProbablyString,
  date?: string | Date,
): BankData | null => {
  if (!bic?.match(/^[A-Z]{4}DE[A-Z0-9]{2}([A-Z0-9]{3})?$/i)) {
    return null;
  }

  const searchBIC = `${bic.toUpperCase()}${bic.length === 8 ? "XXX" : ""}`;

  const data = bankDataSet(date);
  const blz = data && bicMap(data).get(searchBIC);
  if (!blz) {
    return null;
  }

  return {
    bankName: data[blz][0],
    bic: data[blz][1],
    blz,
  };
};

/**
 * Check whether the BIC exists in the bank data
 *
 * @param bic BIC to search for
 * @param date Bank data valid at this date (default: current date)
 * @returns Whether BIC exists in bank data
 */
export const isBICInData = (bic: string, date?: string | Date): boolean => {
  return bankDataByBIC(bic, date) != null;
};
