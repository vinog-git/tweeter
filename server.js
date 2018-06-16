"use strict";

//----------------------------------------------------------------------------
// Require lib modules
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

//----------------------------------------------------------------------------
// Require custom modules
let tweetTrendingTopics = require('./src/js/tweetTrendingTopics');

//----------------------------------------------------------------------------
// Start Express Server
app.use('/', express.static('src'));
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Tweeter is listening at ' + PORT));
//----------------------------------------------------------------------------
// Check config file availability
if (fs.existsSync('./src/js/config.js')) {
    tweetTrendingTopics.startTweeting();
    console.log('Config file found: Starting to tweet');
} else {
    console.log(`Can't Tweet without auth details. \nProvide auth details.`);
}
//----------------------------------------------------------------------------
// BodyParser to read request body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//----------------------------------------------------------------------------


// All API Services
//----------------------------------------------------------------------------
// Create config file and start tweeting
app.post("/api/v1/config", function (req, res) {
    req.body = JSON.stringify(req.body);
    let data = `module.exports=${req.body}`;
    fs.writeFile('./src/js/config.js', data, (err) => {
        if (err) {
            console.log(`Error in createFile: ${err}`);
            res.end();
        } else {
            console.log('Config file created: Starting to tweet');
            tweetTrendingTopics.startTweeting();
            res.end('File Created. Tweeting Now.');
        }
    });
});
//----------------------------------------------------------------------------
// Start or stop tweeting
app.all('/api/v1/tweets/:action', (req, res) => {
    let action = req.params.action;
    if (action === 'start') {
        console.log('Started tweeting.')
        res.end('Started tweeting.');
        tweetTrendingTopics.startTweeting();
    } else {
        console.log('Stopped tweeting.')
        res.end('Stopped tweeting.');
        tweetTrendingTopics.stopTweeting();
    }
});
//----------------------------------------------------------------------------