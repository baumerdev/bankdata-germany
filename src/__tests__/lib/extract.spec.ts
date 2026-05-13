/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import { extractBLZFromBBAN } from "../../lib/extract";

describe("extractBLZFromBBAN", () => {
  it("extracts BLZ 10220500 from BBAN 102205000009290701", () => {
    expect(extractBLZFromBBAN("102205000009290701")).toEqual("10220500");
  });

  it("cannot extract data from invalid BBAN (wrong format)", () => {
    expect(extractBLZFromBBAN("1022050000092907021")).toEqual(null);
  });

  it("cannot extract data from invalid BBAN format (wrong length)", () => {
    expect(extractBLZFromBBAN("10220500000929070")).toEqual(null);
  });
});
