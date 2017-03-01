const BaseBundle = require('./base');

class AccountBundle extends BaseBundle {
  constructor (config) {
    super(config);

    this.get('/', this.index.bind(this));
    this.put('/', this.init.bind(this));
    this.post('/', this.create.bind(this));

    this.get('/{code}', this.read.bind(this));
    this.patch('/{code}', this.update.bind(this));
    this.get('/{code}/transaction', this.transaction.bind(this));
    // this.get('/{code}/balance', this.balance.bind(this));
  }

  async index (ctx) {
    let entries = await this.ledger.getAccounts();
    return { entries };
  }

  async init (ctx) {
    let body = await ctx.parse();

    if (!body || !body.length) {
      ctx.status = 204;
      ctx.body = '';
      return;
    }

    await this.ledger.initAccounts(body);
  }

  async create (ctx) {
    let body = await ctx.parse();

    let entry = await this.ledger.getAccount(body.code);
    if (entry) {
      ctx.throw(409);
    }

    entry = this.ledger.newAccount(body);
    await entry.save();

    ctx.status = 201;
    ctx.set('Location', `${ctx.originalUrl}/${entry.code}`);

    return { entry };
  }

  async read (ctx) {
    let entry = await this.ledger.getAccount(ctx.parameters.code);
    if (!entry) {
      ctx.throw(404);
    }

    return { entry };
  }

  async update (ctx) {
    let body = await ctx.parse();
    let entry = await this.ledger.getAccount(ctx.parameters.code);
    if (!entry) {
      ctx.throw(404);
    }

    entry.set(body);

    let changed = await entry.save();
    if (!changed) {
      ctx.status = 204;
      return;
    }

    return { entry };
  }

  async transaction (ctx) {
    let entries = await this.ledger.getTransactions(ctx.parameters.code);
    return { entries };
  }
}

module.exports = AccountBundle;
