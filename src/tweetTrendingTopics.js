"use strict";

function tweetTrendingTopics() {
  var Twitter = require('twitter');
  var config = require('./config');
  var T = new Twitter(config);

  // setInterval Tweeter
  startTweeting();
  let counter = 0;
  let startContinuousTweeting = setInterval(function () {
    counter++;
    if (counter) {
      console.log('Tweeting with ', counter);
      startTweeting();
    } else {
      clearInterval(startContinuousTweeting);
    }
  }, 3600000);

  function startTweeting() {
    // Get trending topics of a location with woeid (Chennai :: 2295424)  id: 2295424
    var trendsParams = {
      id: 23424848
    }
    T.get('trends/place', trendsParams, function (err, result, response) {
      if (!err) {
        var trends = result[0].trends;
        var sortedTrends = trends.sort(function (b, c) {
          if (b.tweet_volume < c.tweet_volume) {
            return -1
          }
          if (b.tweet_volume > c.tweet_volume) {
            return 1
          }
          return 0
        });

        for (let i = sortedTrends.length - 1; i >= sortedTrends.length - 5; i--) {
          console.log(`Trending : ${sortedTrends[i].name} with ${sortedTrends[i].tweet_volume} tweets`);
          searchAndRetweet(sortedTrends[i].name);
        }
      } else {
        console.log('Failed to get trends of a place');
        console.log(err);
      }
    });

    // Set Trends manually and retweet
    // var trends = ['#LeapForth', '#VijayAwards', '#Aramm', 'Best Actor', '#4SaalModiSarkar', '#AFGvBAN', '#KadaikuttySingamTeaser', '#VikramVedha', '#IndiaWantsRamMandir', '#kumaraswamy'];
    //
    // for (var i = 0; i < trends.length; i++) {
    //   console.log('trends[i].name>>>>', trends[i]);
    //   searchAndRetweet(trends[i]);
    // }

    function searchAndRetweet(queryString) {
      // console.log('queryString::', queryString);
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
          for (let i = 0; i < 5; i++) {
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

            // setTimeout(() => {
            //   T.post(url, retweetParams, function (err, result, response) {
            //     if (!err) {
            //       console.log(result.text);
            //     } else {
            //       console.log('Failed to Retweet' + url);
            //       console.log(err)
            //     }
            //   });
            // }, i * 10000);
          }
        } else {
          console.log('Failed to fetch tweets with query string' + searchParams.q);
          console.log(err);
        }
      });
    }
  }

}

module.exports = tweetTrendingTopics;