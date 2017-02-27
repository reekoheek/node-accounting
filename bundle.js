const Bundle = require('bono/bundle');
const AccountBundle = require('./bundles/account');
const TransactionBundle = require('./bundles/transaction');
const Manager = require('node-norm');
const Ledger = require('node-ledger');

class AccountingBundle extends Bundle {
  constructor (config) {
    super();

    const manager = new Manager(config);
    const ledger = new Ledger({ manager });

    this.use(require('bono/middlewares/json')());

    // use this to use norm middleware
    // this.use(require('node-bono-norm/middleware')({ manager }));

    this.bundle('/account', new AccountBundle({ ledger }));
    this.bundle('/transaction', new TransactionBundle({ ledger }));
  }
}

module.exports = AccountingBundle;
