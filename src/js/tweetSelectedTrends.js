"use strict";

let Twitter = require('twitter');
let config = require('./config');
let T = new Twitter(config);

function tweetSelectedTrends(trends) {
    tweetOneTrend(trends[0]).catch((err) => {
        console.log(err);
    }).then((data) => {
        trends.shift();
        if (trends[0]) {
            tweetSelectedTrends(trends);
        } else {
            console.log('All DONE\n');
        }
    });
}

function tweetOneTrend(trend) {
    return new Promise((resolve, reject) => {
        getTweetsForTrend(trend).catch((err) => {
            reject(err);
        }).then((data) => {
            resolve(data);
        });
    });
}

function getTweetsForTrend(trend) {
    return new Promise((resolve, reject) => {
        let searchParams = { count: 100, q: trend }
        T.get('search/tweets', searchParams, (err, result, response) => {
            if (!err) {
                let fetchedStatuses = result.statuses;
                let randomTweetIndex = Math.floor(Math.random() * fetchedStatuses.length);
                followOwners(fetchedStatuses[randomTweetIndex]).catch((err) => {
                    reject(err);
                }).then((data) => {
                    retweetWithId(data).catch((err) => {
                        reject(err);
                    }).then((data) => {
                        console.log(`Success: ${trend}`);
                        resolve(data);
                    });
                });
            } else {
                reject(err);
            }
        });

    });
}

function followOwners(selectedTweet) {
    return new Promise((resolve, reject) => {
        let user_id_str = selectedTweet.user.id_str;
        let followParams = { user_id: user_id_str }
        T.post('friendships/create', followParams, (err, result, response) => {
            if (!err) {
                resolve(selectedTweet.id_str);
            } else {
                reject(err);
            }
        });
    });
}

function retweetWithId(statusId) {
    return new Promise((resolve, reject) => {
        let url = 'statuses/retweet/' + statusId;
        let retweetParams = { trim_user: true }
        T.post(url, retweetParams, (err, result, response) => {
            if (!err) {
                resolve(`Retweeted - ${result.text} Id - ${result.id_str}`);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = tweetSelectedTrends;