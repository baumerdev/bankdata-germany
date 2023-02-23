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
import nextBank from "../../data/next.json";
import {
  bankDataByBBAN,
  bankDataByBLZ,
  bankDataByIBAN,
  bankDataSet,
  Banks,
  combineCurrentNext,
  dateObject,
  isBICInData,
  NextBanks,
} from "../../lib/data";

const nextValidDate = new Date((nextBank as NextBanks).valid);

describe("current.json", () => {
  // Safeguard that there are enough converted entries.
  it("contains more than 3000 entries", () => {
    expect(Object.keys(currentBank as Banks).length).toBeGreaterThan(3500);
  });
});

describe("dateObject", () => {
  it("returns same date object as provided", () => {
    const testDate = new Date();
    expect(dateObject(testDate)).toBe(testDate);
  });
  it("creates correct date object from string", () => {
    expect(dateObject("2022-03-04T05:06:07+0800")).toEqual(
      new Date("2022-03-04T05:06:07+0800")
    );
  });
  it("creates current date object for undefined param", () => {
    expect(dateObject().toUTCString()).toEqual(new Date().toUTCString());
  });
});

describe("combineCurrentNext", () => {
  const exampleCurrent: Banks = {
    "11111111": ["a", "b"],
    "22222222": ["c", "d"],
    "33333333": ["e"],
    "44444444": ["g"],
  };
  const exampleNextUpsert: Banks = {
    "33333333": ["e", "f"],
    "55555555": ["i", "j"],
  };
  const exampleNextRemove: string[] = ["11111111"];

  it("correctly builds combined data", () => {
    expect(
      combineCurrentNext(exampleCurrent, exampleNextUpsert, exampleNextRemove)
    ).toEqual({
      "22222222": ["c", "d"],
      "33333333": ["e", "f"],
      "44444444": ["g"],
      "55555555": ["i", "j"],
    });
  });
});

describe("bankDataSet", () => {
  it("returns current if valid-from date isn't reached", () => {
    expect(bankDataSet(new Date(0))).toEqual(currentBank);
  });
  it("returns modified data if valid date is reached", () => {
    expect(bankDataSet(nextValidDate)).not.toEqual(currentBank);
  });
});

describe("bankDataByBLZ without next", () => {
  Object.keys(currentBank as Banks).forEach((blz) => {
    const blzData = (currentBank as Banks)[blz];
    const blzObject = { bankName: blzData[0], bic: blzData[1], blz };
    it(`returns correct data for BLZ ${blz}`, () => {
      expect(bankDataByBLZ(String(blz), new Date(0))).toEqual(blzObject);
    });
  });

  it("returns null for unknown BLZ 12345678", () => {
    expect(bankDataByBLZ("12345678", new Date(0))).toEqual(null);
  });
  it("returns null for unknown BLZ 00000000", () => {
    expect(bankDataByBLZ("00000000", new Date(0))).toEqual(null);
  });
  it("returns null for BLZ 1234567 (not 8 digits)", () => {
    expect(bankDataByBLZ("1234567", new Date(0))).toEqual(null);
  });
  it("returns null for BLZ 123_5678 (invalid char)", () => {
    expect(bankDataByBLZ("123_5678", new Date(0))).toEqual(null);
  });
});

describe("bankDataByBLZ with next", () => {
  const combinedCheckDigits = combineCurrentNext(
    currentBank,
    (nextBank as NextBanks).upsert,
    (nextBank as NextBanks).remove
  );

  Object.keys(combinedCheckDigits).forEach((blz) => {
    const blzData = combinedCheckDigits[blz];
    const blzObject = { bankName: blzData[0], bic: blzData[1], blz };
    it(`returns correct data for BLZ ${blz}`, () => {
      expect(bankDataByBLZ(String(blz), new Date(nextValidDate))).toEqual(
        blzObject
      );
    });
  });

  it("returns null for unknown BLZ 12345678", () => {
    expect(bankDataByBLZ("12345678", new Date(nextValidDate))).toEqual(null);
  });
  it("returns null for unknown BLZ 00000000", () => {
    expect(bankDataByBLZ("00000000", new Date(nextValidDate))).toEqual(null);
  });
  it("returns null for BLZ 1234567 (not 8 digits)", () => {
    expect(bankDataByBLZ("1234567", new Date(nextValidDate))).toEqual(null);
  });
  it("returns null for BLZ 123_5678 (invalid char)", () => {
    expect(bankDataByBLZ("123_5678", new Date(nextValidDate))).toEqual(null);
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

describe("Change 2023-03-06", () => {
  test("BLZ 10010200 is unknown before valid-from date", () => {
    expect(bankDataByBLZ("10010200", new Date(0))).toEqual(null);
  });
  test("BLZ 10010200 has data at valid-from date", () => {
    expect(bankDataByBLZ("10010200", new Date(nextValidDate))).toEqual({
      bankName: "Treezor, Berlin",
      bic: "TRZODEB2XXX",
      blz: "10010200",
    });
  });
  test("BLZ 20230800 has old before valid-from date", () => {
    expect(bankDataByBLZ("20230800", new Date(0))).toEqual({
      bankName: "Max Heinr. Sutor",
      bic: "MHSBDEHBXXX",
      blz: "20230800",
    });
  });
  test("BLZ 20230800 has new data at valid-from date", () => {
    expect(bankDataByBLZ("20230800", new Date(nextValidDate))).toEqual({
      bankName: "Sutor Bank",
      bic: "MHSBDEHBXXX",
      blz: "20230800",
    });
  });
  test("BLZ 25851335 has data before valid-from date", () => {
    expect(bankDataByBLZ("25851335", new Date(0))).toEqual({
      bankName: "Sparkasse Uelzen Lüchow-Dannenberg -alt-",
      bic: "NOLADE21DAN",
      blz: "25851335",
    });
  });
  test("BLZ 25851335 is unknown at valid-from date", () => {
    expect(bankDataByBLZ("25851335", new Date(nextValidDate))).toEqual(null);
  });
});
