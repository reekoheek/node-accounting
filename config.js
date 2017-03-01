const NString = require('node-norm/schema/nstring');
const NInteger = require('node-norm/schema/ninteger');
const NDatetime = require('node-norm/schema/ndatetime');

function getPristineConnection () {
  return {
    name: 'default',
    schemas: [
      {
        name: 'account',
        fields: [
          new NString('code').filter('required'),
          new NString('name').filter('required'),
          new NString('cname').filter('required'),
          new NString('currency'),
          new NString('kind').filter('required'),
          new NString('parent'),
          new NInteger('debit').filter(['default', 0]),
          new NInteger('credit').filter(['default', 0]),
        ],
      },
      {
        name: 'transaction',
        fields: [
          new NString('code').filter('required'),
          new NString('date').filter('required'),
          new NDatetime('created_time').filter('required'),
          new NInteger('debit').filter(['default', 0]),
          new NInteger('credit').filter(['default', 0]),
        ],
      },
    ],
  };
}

let cache;
module.exports = function ({ test = false } = {}) {
  if (test) {
    return {
      connections: [
        Object.assign({}, getPristineConnection()),
      ],
    };
  }

  if (!cache) {
    let adapter = process.env.DB_ADAPTER === 'mysql' ? require('node-norm-mysql') : 'disk';
    cache = {
      secret: process.env.SECRET || '',
      connections: [
        Object.assign({}, getPristineConnection(), {
          adapter,
          file: process.env.DB_FILE,
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_DATABASE || 'node_accounting',
        }),
      ],
    };
  }
  return cache;
};
