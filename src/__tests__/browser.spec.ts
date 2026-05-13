/*!
 * @jest-environment jsdom
 *
 * bankdata-germany
 * Copyright (c) 2022-2026 Markus Baumer <markus@baumer.dev>
 * SPDX-License-Identifier: MIT OR MPL-2.0
 */

import "../browser";

describe("browser", () => {
  it("adds function bankdataGermany.bankDataByBBAN to window", () => {
    expect(typeof window.bankdataGermany.bankDataByBBAN).toBe("function");
  });
  it("adds function bankdataGermany.bankDataByBLZ to window", () => {
    expect(typeof window.bankdataGermany.bankDataByBLZ).toBe("function");
  });
  it("adds function bankdataGermany.bankDataByIBAN to window", () => {
    expect(typeof window.bankdataGermany.bankDataByIBAN).toBe("function");
  });
  it("adds function bankdataGermany.isValidBIC to window", () => {
    expect(typeof window.bankdataGermany.isValidBIC).toBe("function");
  });
  it("does not overwrite an existing window.ibantoolsGermany object", () => {
    const marker = () => "marker";
    window.bankdataGermany = { marker };
    // biome-ignore lint/correctness/noUndeclaredVariables: jest globals are injected by the jest test runner
    jest.isolateModules(() => {
      // biome-ignore lint/style/noCommonJs: require is required inside jest.isolateModules to force re-evaluation of the module body
      require("../browser");
    });
    expect(window.bankdataGermany.marker).toBe(marker);
    expect(typeof window.bankdataGermany.bankDataByBBAN).toBe("function");
  });
});
