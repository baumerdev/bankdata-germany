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
import { BankData, ProbablyString } from "./lib/types";
import { isValidBIC } from "./lib/validate";

export {
  BankData,
  bankDataByBBAN,
  bankDataByBIC,
  bankDataByBLZ,
  bankDataByIBAN,
  isValidBIC,
  ProbablyString,
};
