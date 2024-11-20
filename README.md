# BankData-Germany: Data and BIC Validator for German Banks.

![CI: Lint, test and build](https://github.com/baumerdev/bankdata-germany/workflows/Lint,%20test%20and%20build/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/baumerdev/bankdata-germany/badge.svg?branch=main)](https://coveralls.io/github/baumerdev/bankdata-germany?branch=main)

This TypeScript/JavaScript library contains bank data for German banks, such
as names and BIC/SWIFT codes. You can use it (for example) to enhance user
interfaces/forms, where a user enters an IBAN and you automatically fill out
the bank name and BIC fields.

This library is not an IBAN validator itself. If you require validation,
please refer to the main project. [IBANTools-Germany](https://baumerdev.github.io/ibantools-germany/).

> _Version 1.2403.* includes data from 2024-09-09 to 2024-12-08, as well as from 2024-12-09 to 2025-03-02. Validation will be based on the data that is valid according to your system time (data changes at midnight CET on 2024-12-09)._

* [Installation](#installation)
* [Usage](#usage)
* [Data Source](#data-source)
* [Package Version](#package-version)

## Installation

### Package Manager

Add it to your project using a package manager like npm or yarn. You should
explicitly install the latest version, as the bank data may change multiple
times a year.

```sh
$ npm install --save bankdata-germany@latest
# or
$ yarn add bankdata-germany@latest
```

### Browser / CDN

If you only want the functions in your browser, you can include the following
pre-built file.

```html
<script src="https://cdn.jsdelivr.net/npm/bankdata-germany/dist/build/browser.js"></script>
```

## Usage

The npm package contains the code for both ESM and CJS. Therefore, in addition
to using `import` as shown in the usage examples below, you can also utilize
`require`.

### IBAN / Bank Details

You can retrieve detailed information for a bank using BLZ, BBAN, or IBAN.

Note: When using the BBAN/IBAN function, no verification will be performed. It
solely extracts the BLZ and verifies its existence.

```javascript
import { bankDataByBLZ, bankDataByBIC, bankDataByBBAN, bankDataByIBAN } from "bankdata-germany"

bankDataByBLZ("10010010");
bankDataByBIC("PBNKDEFFXXX");
bankDataByBBAN("100100100000138301");
bankDataByIBAN("DE48100100100000138301");
// {
//   bankName: "Postbank Ndl der Deutsche Bank",
//   bic: "PBNKDEFFXXX",
//   blz: "10010010"
// }
```

### Validation

You can validate BIC/SWIFT codes. However, despite these formats being
international standards, this library exclusively validates data for Germany
and will return "false" for all other countries.

```javascript
import { isValidBIC } from "bankdata-germany"

isValidBIC("MARKDEFF"); // true
isValidBIC("MARKDEFFXXX"); // true
isValidBIC("foobar"); // false (invalid format)
isValidBIC("BNPAFRPH"); // false (corrent but not a German BIC)
```

### Browser / CDN

When using the pre-built version, the `bankdataGermany` object is globally
defined on the `window`, containing the functions.

```javascript
bankdataGermany.bankDataByBLZ("10010010");
bankdataGermany.bankDataByBIC("PBNKDEFFXXX");
bankdataGermany.bankDataByBBAN("100100100000138301");
bankdataGermany.bankDataByIBAN("DE48100100100000138301");
bankdataGermany.isValidBIC("MARKDEFF");
```

## Data Source

Bank data is sourced from the official website of
[Deutsche Bundesbank](https://www.bundesbank.de/en/tasks/payment-systems/services/bank-sort-codes/download-bank-sort-codes-626218)
which publishes updated data every quarter.

These updates can encompass both technical changes, such as modifications in
check digit methods, as well as content changes like alterations to BLZ, bank
names, and more. Some updates might not contain any relevant changes for this
library at all.

## Package Version

The version numbers are based on [Semantic Versioning](https://semver.org/)
with some modifications.

> 1.2205.3

The first number represents the Major version. If this number increases, there
may be updates that are not backward compatible, requiring adjustments to your
code. In the above version string, the major version is **1**.

The first two digits of the second number indicate the year of the included data
and check digit methods. The third and fourth digits increase either with minor
version changes that maintain backward compatibility or when new data is
included. In the provided version string, the year is 20**22**, with a few minor
updates, possibly including data updates for spring and summer.

The last number is reserved for patches and bug fixes.

Considering that the data could change up to four times a year, it's advisable
to use an appropriate version string in your package.json. As breaking changes
occur only when the first number changes, specifying something like `"1.x"`
should suffice.
