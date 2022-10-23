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

import currentBank from "../../data/current.json";
import {
  bankDataByBBAN,
  bankDataByBLZ,
  bankDataByIBAN,
  Banks,
  isBICInData,
} from "../../lib/data";

describe("current.json", () => {
  // Safeguard that there are enough converted entries.
  it("contains more than 3000 entries", () => {
    expect(Object.keys(currentBank as Banks).length).toBeGreaterThan(3500);
  });
});

describe("bankDataByBLZ", () => {
  Object.keys(currentBank as Banks).forEach((blz) => {
    const blzData = (currentBank as Banks)[blz];
    const blzObject = { bankName: blzData[0], bic: blzData[1], blz };
    it(`returns correct data for BLZ ${blz}`, () => {
      expect(bankDataByBLZ(String(blz))).toEqual(blzObject);
    });
  });

  it("returns null for unknown BLZ 12345678", () => {
    expect(bankDataByBLZ("12345678")).toEqual(null);
  });
  it("returns null for unknown BLZ 00000000", () => {
    expect(bankDataByBLZ("00000000")).toEqual(null);
  });
  it("returns null for BLZ 1234567 (not 8 digits)", () => {
    expect(bankDataByBLZ("1234567")).toEqual(null);
  });
  it("returns null for BLZ 123_5678 (invalid char)", () => {
    expect(bankDataByBLZ("123_5678")).toEqual(null);
  });
});

describe("isBICInData", () => {
  it("returns true for BIC MARKDEF1100", () => {
    expect(isBICInData("MARKDEF1100")).toEqual(true);
  });
  it("returns true for BIC PBNKDEFFXXX", () => {
    expect(isBICInData("PBNKDEFFXXX")).toEqual(true);
  });
  it("returns true for BIC PBNKDEFF", () => {
    expect(isBICInData("PBNKDEFF")).toEqual(true);
  });

  it("returns false for invalid BIC format", () => {
    expect(isBICInData("1")).toEqual(false);
  });
  it("returns false for unknown BIC AAAADE00000", () => {
    expect(isBICInData("AAAADE00000")).toEqual(false);
  });
});

describe("bankDataByBBAN", () => {
  it("returns data for BBAN", () => {
    expect(bankDataByBBAN("100000000000000001")).toEqual({
      bankName: "Bundesbank",
      bic: "MARKDEF1100",
      blz: "10000000",
    });
  });
  it("returns null for BBAN null (not a string)", () => {
    expect(bankDataByBBAN(null)).toEqual(null);
  });
  it("returns null for BBAN with invalid format", () => {
    expect(bankDataByBBAN("0")).toEqual(null);
  });
  it("returns null for BBAN with unknown BLZ", () => {
    expect(bankDataByBBAN("123456780000000000")).toEqual(null);
  });
  it("returns null for BBAN with unknown BLZ", () => {
    expect(bankDataByBBAN("000000000000000000")).toEqual(null);
  });
  it("returns data for BBAN with unknown BLZ but disabled validation", () => {
    expect(bankDataByBBAN("100000000000000000")).not.toEqual(null);
  });
});

describe("bankDataByIBAN", () => {
  it("returns data for IBAN null (not a string)", () => {
    expect(bankDataByIBAN("DE00100000000000000001")).toEqual({
      bankName: "Bundesbank",
      bic: "MARKDEF1100",
      blz: "10000000",
    });
  });
  it("returns null for IBAN null (wrong country)", () => {
    expect(bankDataByIBAN("FR00100000000000000001")).toEqual(null);
  });
  it("returns null for IBAN null (not a string)", () => {
    expect(bankDataByIBAN(null)).toEqual(null);
  });
  it("returns null for IBAN with invalid format", () => {
    expect(bankDataByIBAN("0")).toEqual(null);
  });
  it("returns null for IBAN with unknown BLZ", () => {
    expect(bankDataByIBAN("DE00123456780000000000")).toEqual(null);
  });
  it("returns null for IBAN with unknown BLZ", () => {
    expect(bankDataByIBAN("DE00000000000000000000")).toEqual(null);
  });
});
