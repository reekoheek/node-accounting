/* global describe it beforeEach */

const http = require('http');
const request = require('supertest');
const assert = require('assert');
const Bundle = require('../bundle');

const COA = [
  {
    code: '1000',
    cname: 'asset',
    name: 'Aset',
    children: [
      { code: '1001', name: 'Aset:Kas', currency: 'IDR' },
      { code: '1002', name: 'Aset:Bank', currency: 'IDR' },
    ],
  },
  {
    code: '3000',
    cname: 'equity',
    name: 'Modal',
    currency: 'IDR',
  },
];

describe('# accounting', () => {
  let app;
  beforeEach(() => {
    app = http.Server(new Bundle(require('../config')({ test: true })).callback());
  });

  describe('/account', () => {
    describe('# before initialized', () => {
      describe('GET /', () => {
        it('status 200 and return no accounts', async () => {
          let { body: { entries } } = await request(app).get('/account').expect(200);
          assert(entries instanceof Array);
          assert.equal(entries.length, 0);
        });
      });

      describe('PUT /', () => {
        it('status 200 and initialized accounts from nested CoA', async () => {
          await request(app).put('/account').send(COA).expect(200);

          let { body: { entries } } = await request(app).get('/account').expect(200);
          assert.equal(entries.length, 4);
          assert.equal(entries[3].currency, 'IDR');
        });

        it('throw 204 when CoA empty', async () => {
          await request(app).put('/account').send([]).expect(204);
        });

        it('throw 400 when caught error', async () => {
          await request(app).put('/account').send([{}]).expect(400);
        });
      });
    });

    describe('# after initialized', () => {
      beforeEach(async () => {
        await request(app).put('/account').send(COA).expect(200);
      });

      describe('GET /', () => {
        it('return all accounts', async () => {
          let { body: { entries } } = await request(app).get('/account').expect(200);
          assert.equal(entries.length, 4);
        });
      });

      describe('POST /', () => {
        it('status 201 and location set and created new account', async () => {
          let { body: { entry } } = await request(app).post('/account').send({ code: '2000', cname: 'liability', name: 'Hutang' }).expect(201);
          assert.equal(entry.code, '2000');
          assert.equal(entry.kind, 'credit');
          assert.equal(entry.name, 'Hutang');
        });

        it('throw 409 when account with code already exists', async () => {
          await request(app).post('/account').send({ code: '3000', cname: 'equity', name: 'Modal Lain' }).expect(409);
        });

        it('throw 400 when account invalid', async () => {
          await request(app).post('/account').send({ name: 'Malformed' }).expect(400);
        });
      });

      describe('GET /{code}', () => {
        it('status 200 and return account', async () => {
          let { body: { entry } } = await request(app).get('/account/1001').expect(200);
          assert(entry.name, 'Aset:Kas');
          assert(entry.currency, 'IDR');
        });

        it('throw 404 when account with code not found', async () => {
          await request(app).get('/account/9999').expect(404);
        });
      });

      describe('PATCH /{code}', () => {
        it('status 200 and update account with code', async () => {
          let { body: { entry } } = await request(app).patch('/account/1001').send({ name: 'Aset:Dompet' }).expect(200);
          assert(entry.name, 'Aset:Dompet');
          assert(entry.currency, 'IDR');
        });

        it('status 204 when account not changed', async () => {
          await request(app).patch('/account/1001').send({ currency: 'IDR' }).expect(204);
        });

        it('throw 404 when account with code not found', async () => {
          await request(app).patch('/account/9999').send({ name: 'foo' }).expect(404);
        });

        it('throw 400 when caught validation error', async () => {
          await request(app).patch('/account/1002').send({ name: '' }).expect(400);
        });
      });

      describe('GET /{code}/transaction', () => {
        it('status 200 and return transactions of account with code', async () => {
          let { body: { entries } } = await request(app).get('/account/1002/transaction').expect(200);
          assert(entries instanceof Array);
        });

        // TODO get transactions after post
      });
    });
  });

  describe('/transaction', () => {
    beforeEach(async () => {
      await request(app).put('/account').send(COA).expect(200);
    });

    describe('GET /', () => {
      it('status 200 and return all transactions', async () => {
        let { body: { entries } } = await request(app).get('/transaction').expect(200);
        assert(entries instanceof Array);
      });
    });

    describe('POST /', () => {
      it('status 201 and create new transaction', async () => {
        {
          let { body: { entry } } = await request(app).get('/account/1001').expect(200);
          assert.equal(entry[entry.kind], 0);
        }

        let now = new Date();
        let tx = {
          date: now,
          note: 'Transfer dari bank ke kas',
          entries: [
            { code: '1001', debit: 1000 },
            { code: '1002', credit: 1000 },
          ],
        };
        let { body: { entry } } = await request(app).post('/transaction').send(tx).expect(201);
        assert.equal(entry.date, JSON.parse(JSON.stringify(now)));
        assert.equal(entry.entries.length, 2);

        {
          let { body: { entry } } = await request(app).get('/account/1001').expect(200);
          assert.equal(entry[entry.kind], 1000);
        }

        {
          let { body: { entry } } = await request(app).get('/account/1002').expect(200);
          assert.equal(entry[entry.kind], -1000);
        }
      });

      it('throw 400 when transaction invalid', async () => {
        let now = new Date();
        let tx = {
          date: now,
          note: 'Transfer dari bank ke kas',
          entries: [
            { code: '1001', debit: 9000 },
            { code: '1002', credit: 1000 },
          ],
        };
        await request(app).post('/transaction').send(tx).expect(400);
      });
    });
  });
});
