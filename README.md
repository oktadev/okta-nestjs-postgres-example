# Build a Simple API with NestJS and Postgres Example

This project is an example for the [Build a Secure NestJS API with Postgres](https://developer.okta.com/blog/2020/02/26/build-a-secure-nestjs-api-with-postgres) blog post.

## Requirements

- [Node.js](https://nodejs.org) version 8+
- [Docker Desktop](https://www.docker.com/get-started)
- A free [Okta developer account](https://developer.okta.com)

## Setup

1. Clone or download this repository
1. Run `npm install` to install the project dependencies
1. Copy `.env.sample` to `.env`
1. Add a new Service application to your Okta developer account named "Instamiligram"
1. Add a new Okta API token (API -> Tokens -> Create Token) and copy this token to the `.env` file to replace `{yourApiToken}`
1. Update `.env` and replace `{yourOktaDomain}` with the URL for your Okta account (e.g. `dev-123456.oktapreview.com`)
1. Run the following commands

```sh
docker-compose up -d
npx nodemon server.js --ext ts
```
