# BankData-Germany: Data and BIC Validator for German Banks.

![CI: Lint, test and build](https://github.com/baumerdev/bankdata-germany/workflows/Lint,%20test%20and%20build/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/baumerdev/bankdata-germany/badge.svg?branch=main)](https://coveralls.io/github/baumerdev/bankdata-germany?branch=main)

This TypeScript/JavaScript library contains bank data for German banks like
names and BIC/Swift Codes. You can use it e.g to enhance
user-interfaces/forms where a user enters an IBAN and you automatically fill
out the bank-name and BIC fields.

This library is not a validator for IBAN itself. So if you need validation
take a look at the main project [IBANTools-Germany](https://baumerdev.github.io/ibantools-germany/).

* [Installation](#installation)
* [Usage](#usage)
* [Data Source](#data-source)

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
