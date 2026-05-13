/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import type { ProbablyString } from "./types";

/**
 * Extract  BLZ from BBAN
 *
 * @param bban German BBAN with 18 digits
 * @returns BLZ or null if invalid
 */
export const extractBLZFromBBAN = (bban: ProbablyString): string | null => {
  if (!bban?.match(/^[1-9]\d{17}$/)) {
    return null;
  }

  return bban.slice(0, 8);
};
