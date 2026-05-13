/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import { isBICInData } from "./data";
import type { ProbablyString } from "./types";

/**
 * Validate German BIC
 *
 * @param bic BIC
 * @returns
 */
export const isValidBIC = (bic: ProbablyString): boolean => {
  if (!bic) {
    return false;
  }

  return isBICInData(bic);
};
