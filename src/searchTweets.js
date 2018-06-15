var Twitter = require('twitter');
var config = require('./config.js');

var T = new Twitter(config);


var searchParams = {
  q: '#FactsOfIndianJudiciary',
  count: 30
}

T.get('search/tweets', searchParams, function(err, result, response) {
  if (!err) {
    var fetchedStatuses = result.statuses;
    console.log(fetchedStatuses.length);
    fetchedStatuses.forEach(function(singleStatus){
      console.log(singleStatus.text);
    })
  } else {
    console.log(err)
  }
});
