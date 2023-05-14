/**
 * bankdata-germany
 * Copyright (C) 2022-2023 Markus Baumer <markus@baumer.dev>
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

import { isValidBIC } from "../../lib/validate";

describe("isValidBIC", () => {
  it("returns true for BIC MARKDEF1100", () => {
    expect(isValidBIC("MARKDEF1100")).toEqual(true);
  });
  it("returns true for BIC PBNKDEFFXXX", () => {
    expect(isValidBIC("PBNKDEFFXXX")).toEqual(true);
  });
  it("returns true for BIC PBNKDEFF", () => {
    expect(isValidBIC("PBNKDEFF")).toEqual(true);
  });

  it("returns false for null", () => {
    expect(isValidBIC(null)).toEqual(false);
  });
  it("returns false for invalid BIC format", () => {
    expect(isValidBIC("1")).toEqual(false);
  });
  it("returns false for wrong country", () => {
    expect(isValidBIC("BNPAFRPH")).toEqual(false);
  });
  it("returns false for unknown BIC AAAADE00000", () => {
    expect(isValidBIC("AAAADE00000")).toEqual(false);
  });
});
