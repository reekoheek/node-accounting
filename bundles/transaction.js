const BaseBundle = require('./base');

class TransactionBundle extends BaseBundle {
  constructor (config) {
    super(config);

    this.get('/', this.index.bind(this));
    this.post('/', this.create.bind(this));
  }

  async index (ctx) {
    let entries = await this.ledger.getTransactions();
    return { entries };
  }

  async create (ctx) {
    const body = await ctx.parse();

    let entry = await this.ledger.post(body);
    ctx.status = 201;
    ctx.set('Location', `${ctx.originalUrl}/${entry.id}`);
    return { entry };
  }
}

module.exports = TransactionBundle;
