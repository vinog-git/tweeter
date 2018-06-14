var Twitter = require('twitter');
var config = require('./config.js');

var T = new Twitter(config);

// Get location/Woeid of trending topics
/*T.get('trends/available',function(err, result, response){
if(!err){
  console.log(result.length, JSON.stringify(result[0]))
}else{
  console.log(err);
}
});
*/

// Get trending topics of a location with woeid (Chennai :: 2295424)

var params = {
  id: 2295424
}
T.get('trends/place', params, function (err, result, response) {
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
    })
    trends.forEach(function (trend) {
      console.log(trend);
    });
  } else {
    console.log(err);
  }
});

return;

// Get statuses by query string

var params = {
  q: '#Chengannurbyelection',
  count: 10
}
T.get('search/tweets', params, function (err, result, response) {
  if (!err) {
    console.log(result.statuses);
  } else {
    console.log(err);
  }
});



// Get a tweet by ID

var url = 'statuses/show/1002085504546816000';
var params = {
  trim_user: true
}
T.get(url, params, function (err, result, response) {
  if (!err) {
    console.log(result);
  } else {
    console.log(err)
  }

})





// Retweet with id


var url = 'statuses/retweet/1002085504546816000';
var params = {
  trim_user: true
}
T.post(url, params, function (err, result, response) {
  if (!err) {
    console.log(result);
  } else {
    console.log(err)
  }

});


// Get user Timeline
// var params = {
//   user_id: '999643631488126976',
//   screen_name: 'vaderdarther'
// }

// T.get('statuses/user_timeline', params, function(err, result, response){
//   if(!err){
//     console.log(result[0].user.statuses_count);
//   }else{
//     console.log(err)
//   }
// });