/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
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
