# node-koperasi

Koperasi is a form of business entity that gather people as investor members,
and collect its capital from monthly-basis tuition.

This is the web application to manage `koperasi` business.

## Environment Variables

### SECRET

Set secret to encrypt data

### SETUP_TOKEN

Set token for web setup

### DB_ADAPTER

Options

- mysql
- disk (default)

### DB_FILE

When `DB_ADAPTER` is disk

### DB_HOST

When `DB_ADAPTER` is mysql

Default value `localhost`

### DB_USER || 'root',

When `DB_ADAPTER` is mysql

Default value `root`

### DB_PASSWORD || '',

When `DB_ADAPTER` is mysql

Default value ``

### DB_DATABASE

When `DB_ADAPTER` is mysql.

Default value `node_koperasi`
