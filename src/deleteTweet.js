var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);


//Delete single tweet
// var params = {
//   id: '999649989302210561'
// }
//
// T.post('statuses/destroy', params, function(err, result, response) {
//   if (!err) {
//     console.log(result);
//   } else {
//     console.log(err);
//   }
// });
//END of Delete single tweet



//Delete All Tweets
var params = {
  screen_name: 'vaderdarther'
}

T.get('statuses/user_timeline', params, function(err, result, response) {
  if (!err) {
    console.log(result.length);
    var allTweets = result;
    for (var i = 0; i < allTweets.length; i++) {
      var params = {
        id: allTweets[i].id_str
      }
      T.post('statuses/destroy', params, function(err, result, response) {
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
//Delete All Tweets
