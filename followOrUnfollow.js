var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);
var params = {
  screen_name: 'bala18111'
};
T.get('users/show', params, function(error, user, response) {
  if (!error) {
    var userId = user.id;
    var userStatusesCount = user.statuses_count;
    var isFollowing = user.following;

    console.log('userId', userId, userStatusesCount, isFollowing);
    var followParams = {
      screen_name: params.screen_name,
      user_id: userId,
      follow: false
    };
    if (!isFollowing) {
      console.log('Was not following; attempting to follow');
      T.post('friendships/create', followParams, function(error, result, response) {
        if (!error) {
          console.log(result.following);
        } else {
          console.log(error)
        }
      });
    } else {
      console.log('Already following the user, so unfollowing', params.screen_name);
      T.post('friendships/destroy', followParams, function(error, newResult, response) {
        if (!error) {
          setTimeout(function(){
            console.log(newResult);
          },100);
        } else {
          console.log(error)
        }
      });

    }
  } else {
    console.log(error);
  }
});
