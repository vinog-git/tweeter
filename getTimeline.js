var Twitter = require('twitter');
var config = require('./config.js');

var T = new Twitter(config);

// Get user Timeline
var params = {
  user_id: '999643631488126976',
  screen_name: 'vaderdarther'
}

T.get('statuses/user_timeline', params, function(err, result, response) {
  if (!err) {
    if (result.length) {
      console.log(result[0].user.statuses_count);
    } else {
      console.log('Zero Tweets!');
    }

  } else {
    console.log(err)
  }
});
