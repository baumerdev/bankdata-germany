/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
/**
 * This is a type that should be a string (for e.g. validating or generating)
 * IBANs, BBANs, bank account numbers etc. But since this library is most
 * likely used with user input, we accept null and undefined as well to prevent
 * type errors.
 *
 * Nonetheless the functions using params of this type still will return empty
 * results or invalid results but won't throw type errors.
 */
export type ProbablyString = string | null | undefined;

/**
 * Data for BIC
 */
export interface BankData {
  /**
   * Name of bank
   */
  bankName: string;
  /**
   * BIC/SWIFT code
   */
  bic?: string;
  /**
   * BLZ (Bankleitzahl, bank sort code)
   */
  blz: string;
}
