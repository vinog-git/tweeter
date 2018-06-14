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


// setInterval Tweeter
tweeter();
var counter = 0;
var startTweeting = setInterval(function() {
  if (counter < 5) {
    console.log('Tweeting with ', counter);
    tweeter();
  } else {
    clearInterval(startTweeting);
  }
  counter++;
}, 60000);



function tweeter() {

  // Get trending topics of a location with woeid (Chennai :: 2295424)  id: 2295424
  var trendsParams = {
    id: 23424848
  }
  T.get('trends/place', trendsParams, function(err, result, response) {
    if (!err) {
      var trends = result[0].trends;
      var sortedTrends = trends.sort(function(b, c) {
        if (b.tweet_volume < c.tweet_volume) {
          return -1
        }
        if (b.tweet_volume > c.tweet_volume) {
          return 1
        }
        return 0
      })
      for (var i = trends.length - 1; i >= trends.length - 6; i--) {
        console.log('trends[i].name>>>>', trends[i].name);
        searchAndRetweet(trends[i].name);
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
      count: 5
    }
    T.get('search/tweets', searchParams, function(err, result, response) {
      if (!err) {
        var fetchedStatuses = result.statuses;
        console.log(queryString + ' - ' + fetchedStatuses.length);

        // Retweet with id
        for (var i = 0; i < fetchedStatuses.length; i++) {
          var url = 'statuses/retweet/' + fetchedStatuses[i].id_str;
          var retweetParams = {
            trim_user: true
          }

          T.post(url, retweetParams, function(err, result, response) {
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
