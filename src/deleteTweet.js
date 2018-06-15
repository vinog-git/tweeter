"use strict";

function deleteTweet() {
  let Twitter = require('twitter');
  let config = require('./config.js');
  let T = new Twitter(config);

  let params = {
    screen_name: 'vaderdarther'
  }

  T.get('statuses/user_timeline', params, function (err, result, response) {
    if (!err) {
      console.log(result.length);
      let allTweets = result;
      for (let i = 0; i < allTweets.length; i++) {
        let params = {
          id: allTweets[i].id_str
        }
        T.post('statuses/destroy', params, function (err, result, response) {
          if (!err) {
            console.log(result.id);
          } else {
            console.log(err);
          }
        });
      }
    } else {
      console.log(err);
    }
  });
}

module.exports = deleteTweet;