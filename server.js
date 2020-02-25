require('dotenv/config');
require('reflect-metadata');
require('ts-node/register');

require('./src/bootstrap.ts')
	.bootstrap()
	.catch(console.error);
