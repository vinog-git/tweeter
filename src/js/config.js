"use strict"
require('dotenv').config();
let ENV = JSON.parse(process.env.twitter_key);

module.exports = {
    "consumer_key": ENV.consumer_key,
    "consumer_secret": ENV.consumer_secret,
    "access_token_key": ENV.access_token_key,
    "access_token_secret": ENV.access_token_secret
}