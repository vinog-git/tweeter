var Twitter = require('twitter');
var config = require('./config.js');
var tempdata = require('./data.js');
var T = new Twitter(config);

var tweets = tempdata.data;

function postTweet(tweetNumber) {
  var tweetNumber = tweetNumber || 0;

  var params = {
    status: tweets[tweetNumber] + ' ' + '@vinshine'
  }

  T.post('statuses/update', params, function(err, result, response) {
    if (!err) {
      console.log(result.text);
      tweetNumber++;
      if (tweets[tweetNumber]) {
        postTweet(tweetNumber);
      }
    } else {
      console.log(err);
    }
  });
}

postTweet(0);
