/**
 * bankdata-germany
 * Copyright (C) 2022-2024 Markus Baumer <markus@baumer.dev>
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
