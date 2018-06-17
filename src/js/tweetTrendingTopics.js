"use strict";

let tweeterTimer;

function tweetTrendingTopics() {
  let Twitter = require('twitter');
  let config = require('./config');
  let T = new Twitter(config);

  let counter = 0;
  tweeterTimer = setInterval(function () {
    counter++;
    if (counter) {
      console.log('Tweeting with ', counter);
      startTweeting();
    }
  }, 3600000);

  function startTweeting() {
    // Get trending topics of a location with woeid (Chennai :: 2295424)  id: 2295424
    var trendsParams = {
      id: 23424848
    }
    T.get('trends/place', trendsParams, function (err, result, response) {
      if (!err) {
        let trends = result[0].trends;
        let sortedTrends = trends.sort(function (b, c) {
          if (b.tweet_volume < c.tweet_volume) {
            return -1
          }
          if (b.tweet_volume > c.tweet_volume) {
            return 1
          }
          return 0
        });

        let filteredTrends = sortedTrends.filter((singleTrend) => {
          return singleTrend.tweet_volume != null
        });
        
        for (let i = filteredTrends.length - 1; i >= 0; i--) {
          console.log(`Trending : ${filteredTrends[i].name} with ${filteredTrends[i].tweet_volume} tweets`);
          searchAndRetweet(sortedTrends[i].name);
        }
      } else {
        console.log('Failed to get trends of a place');
        console.log(err);
      }
    });

    function searchAndRetweet(queryString) {
      // Get statuses by query string
      var searchParams = {
        q: queryString,
        count: 100
      }
      T.get('search/tweets', searchParams, function (err, result, response) {
        if (!err) {
          let resultStatuses = result.statuses;
          console.log(`${resultStatuses.length} statuses for '${queryString}'`);

          // Choose random tweets from the result to retweet
          let fetchedStatuses = [];
          for (let i = 0; i < 2; i++) {
            let randomTweetIndex = Math.floor(Math.random() * resultStatuses.length);
            if (i < resultStatuses.length) {
              fetchedStatuses.push(resultStatuses[randomTweetIndex]);
              console.log(`id_str :: ${fetchedStatuses[i].id_str}`)
            }
          }

          // Retweet with id
          for (let i = 0; i < fetchedStatuses.length; i++) {
            let url = 'statuses/retweet/' + fetchedStatuses[i].id_str;
            let retweetParams = {
              trim_user: true
            }
            T.post(url, retweetParams, function (err, result, response) {
              if (!err) {
                console.log(result.text);
              } else {
                console.log('Failed to Retweet' + url);
                console.log(err)
              }
            });
          }
        } else {
          console.log('Failed to fetch tweets with query string' + searchParams.q);
          console.log(err);
        }
      });
    }
  }

}

function stopTweeting() {
  clearInterval(tweeterTimer);
}

module.exports = {
  startTweeting: tweetTrendingTopics,
  stopTweeting: stopTweeting
};