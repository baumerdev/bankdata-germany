/*!
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */
import * as main from "../main";

/* eslint-disable @typescript-eslint/no-unsafe-call */
describe("main", () => {
  it("exports function named bankDataByBBAN", () => {
    expect(typeof main.bankDataByBBAN).toBe("function");
  });
  it("exports function named bankDataByBIC", () => {
    expect(typeof main.bankDataByBIC).toBe("function");
  });
  it("exports function named bankDataByBLZ", () => {
    expect(typeof main.bankDataByBLZ).toBe("function");
  });
  it("exports function named bankDataByIBAN", () => {
    expect(typeof main.bankDataByIBAN).toBe("function");
  });
  it("exports function named isValidBIC", () => {
    expect(typeof main.isValidBIC).toBe("function");
  });
});
