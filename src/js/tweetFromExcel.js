"use strict";

let Twitter = require('twitter');
let config = require('./config');
let T = new Twitter(config);

function tweetFromExcel() {
    fetch('/api/v1/xlsx').then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(res => {
            console.log('Received excel Response.');
            if (res.data) {
                tweetStatuses(res.data);
            }
        });
}

function tweetStatuses(tweets) {
    tweets = JSON.parse(tweets);

    tweets.forEach((singleTweet) => {
        console.log('Tweeting status\n');
        let postUrl = 'statuses/update';
        let postParams = {
            status: singleTweet.Message
        }

        T.post(postUrl, postParams, (err, result, response) => {
            if (!err) {
                console.log(`Tweeted. \nID: ${result.id_str}. Message: ${result.text}\n`);
            } else {
                console.log(`Failed to post Tweets. Error: ${err}\n`);
            }
        });
    });
}

module.exports = tweetFromExcel;