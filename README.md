# BankData-Germany: Data and BIC Validator for German Banks.

![CI: Lint, test and build](https://github.com/baumerdev/bankdata-germany/workflows/Lint,%20test%20and%20build/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/baumerdev/bankdata-germany/badge.svg?branch=main)](https://coveralls.io/github/baumerdev/bankdata-germany?branch=main)

This TypeScript/JavaScript library contains bank data for German banks like
names and BIC/Swift Codes. You can use it e.g to enhance
user-interfaces/forms where a user enters an IBAN and you automatically fill
out the bank-name and BIC fields.

This library is not a validator for IBAN itself. So if you need validation
take a look at the main project [IBANTools-Germany](https://baumerdev.github.io/ibantools-germany/).

> _Version 1.2300.* includes the data from 2022-12-05 until 2023-03-04 and from 2023-03-06 until 2023-06-04 and validation will be performed according to the data that is valid at your system time (data will change at 2023-03-06 midnight CET)._

* [Installation](#installation)
* [Usage](#usage)
* [Data Source](#data-source)
* [Package Version](#package-version)

## Installation

### Package Manager

Add it to your project with your package manager like npm or yarn. You should
explicitly install the latest version since the bank data may change multiple
times a year.

```sh
$ npm install --save bankdata-germany@latest
# or
$ yarn add bankdata-germany@latest
```

### Browser / CDN

If you just want the functions in your browser, you can include the following
pre-build file.

```html
<script src="https://cdn.jsdelivr.net/npm/bankdata-germany/dist/build/browser.js"></script>
```

## Usage

The npm package contains the code for ESM and CJS, so instead of `import`, as
shown in the usage examples below, you can use `require` as well.

### IBAN / Bank Details

You can get detailed information for a bank by BLZ, BBAN or IBAN.

Note: If you use the BBAN/IBAN function no verification takes place. It just
extracts the BLZ and checks if it exists.

```javascript
import { bankDataByBLZ, bankDataByBBAN, bankDataByIBAN } from "bankdata-germany"

bankDataByBLZ("10010010");
bankDataByBBAN("100100100000138301");
bankDataByIBAN("DE48100100100000138301");
// {
//   bankName: "Postbank Ndl der Deutsche Bank",
//   bic: "PBNKDEFFXXX",
//   blz: "10010010"
// }
```

### Validation

You can validate BIC/Swift Codes. But even if those formats are international
standards this library only validates data for Germany and will return false
for all other countries.

```javascript
import { isValidBIC } from "bankdata-germany"

isValidBIC("MARKDEFF"); // true
isValidBIC("MARKDEFFXXX"); // true
isValidBIC("foobar"); // false (invalid format)
isValidBIC("BNPAFRPH"); // false (corrent but not a German BIC)
```

### Browser / CDN

If you use the pre-build version, an object `bankdataGermany` is globally
defined on `window` containing the functions.

```javascript
bankdataGermany.bankDataByBLZ("10010010");
bankdataGermany.bankDataByBBAN("100100100000138301");
bankdataGermany.bankDataByIBAN("DE48100100100000138301");
bankdataGermany.isValidBIC("MARKDEFF");
```

## Data Source

Bank data is taken from the official website of
[Deutsche Bundesbank](https://www.bundesbank.de/en/tasks/payment-systems/services/bank-sort-codes/download-bank-sort-codes-626218)
who publishes updated data every quarter.

These updates can contain technical changes (modifications in check digit
methods) and content changes (BLZ, bank names, etc). It is possible that there
are updates that do not contain any relevant changes for this library at all.

## Package Version

The version numbers are based on [Semantic Versioning](https://semver.org/)
with modifications.

> 1.2205.3

The first number representes the Major version. If this number increases there
are updates that may not be backward compatiple and you have to adjust your
code. That means the above version string is from major version **1**.

The first two digits of the second number stand for the year of the included
data and check digit methods. The third and fourth digit increase when there
are either minor version changes that are backward compatible or when new data
is included. That means the above version string is from year 20**22** and
has had a few minor updates, perhaps data updates for spring and summer.

The last number is for patches and bug fixes.

Since the data may change up to four times a year you should use a suitable
version string in your package.json. Since there will be only breaking changes
when the first number changes, you should be good with e.g. `"1.x"`
