const http = require('http');
const Bundle = require('bono/bundle');
const AccountingBundle = require('./bundle');
const config = require('./config')();

const PORT = process.env.PORT || 3000;

const app = new Bundle();

app.use(require('bono/middlewares/logger')());

app.bundle('/accounting', new AccountingBundle(config));

app.get('/', ctx => {
  ctx.body = { see: '/accounting' };
});

const server = http.Server(app.callback());
server.listen(PORT, () => console.log(`Listening on ${PORT}`));
