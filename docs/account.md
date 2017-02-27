# Account

URI /account

## GET /

List all accounts

## PUT /

BODY [ { code, name, cname, children: [ $account ] } = $account ]

Initialize chart of accounts

## POST /

BODY { code, name, cname, parent? }

Add new account

## GET /{code}

Get account by code

## PUT /{code}

BODY { code, name, cname, parent? }

Update account by code

## GET /{code}/transaction

List all transactions of account
