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
    await this.ledger.initAccounts(await ctx.parse());
  }

  async create (ctx) {
    let body = await ctx.parse();

    let entry = await this.ledger.getAccount(body.code);
    if (entry) {
      ctx.throw(409);
    }

    try {
      let entry = this.ledger.newAccount(body);
      await entry.save();

      ctx.status = 201;
      ctx.set('Location', `${ctx.originalUrl}/${entry.code}`);

      return { entry };
    } catch (err) {
      ctx.throw(400, err);
    }
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

    try {
      entry.sync(body);

      await entry.save();

      return { entry };
    } catch (err) {
      ctx.throw(400, err);
    }
  }

  async transaction (ctx) {
    let entries = await this.ledger.getTransactions(ctx.parameters.code);
    return { entries };
  }
}

module.exports = AccountBundle;
