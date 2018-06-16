"use strict";

//----------------------------------------------------------------------------
// Require lib modules
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const xlsx = require('xlsx');
const Twitter = require('twitter');
//----------------------------------------------------------------------------
// Require custom modules
let tweetTrendingTopics = require('./src/js/tweetTrendingTopics');
//----------------------------------------------------------------------------
// Initial Tweet
(function init() {
    let isConfigured = fs.existsSync('./src/js/config.js');
    if (isConfigured) {
        // tweetTrendingTopics.startTweeting();
    } else {
        console.log('Config File not Available.');
    }
})();
//----------------------------------------------------------------------------
// Start Express Server
app.use('/', express.static('src'));
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Tweeter is listening at ' + PORT));
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
    console.log(data);
    fs.writeFile('./src/js/config.js', data.toString(), (err) => {
        if (!err) {
            let isConfigured = fs.existsSync('./src/js/config.js');
            if (isConfigured) {
                console.log('Config file Created.');
                res.end('File Created. Now run /api/v1/tweets/start \n');
            }
        } else {
            console.log(`Error in createFile: ${err}`);
            res.end();
        }
    });
});
//----------------------------------------------------------------------------
// Start or stop tweeting
app.all('/api/v1/tweets/:action', (req, res) => {
    let action = req.params.action;
    if (action === 'start') {
        console.log('Started tweeting.')
        res.end('Started tweeting.\n');
        tweetTrendingTopics.startTweeting();
    } else {
        console.log('Stopped tweeting.')
        res.end('Stopped tweeting.\n');
        isConfigured = isConfigFilePresent();
        if (isConfigured) {
            tweetTrendingTopics.stopTweeting();
        }
    }
});
//----------------------------------------------------------------------------
// Get data from tweets.xlsx

app.get('/api/v1/xlsx', (req, res) => {
    let isConfigured = fs.existsSync('./src/js/config.js');
    if (isConfigured && fs.existsSync('uploads/tweets.xlsx')) {
        let workbook = xlsx.readFile('uploads/tweets.xlsx');
        let sheet_name_list = workbook.SheetNames;
        let xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log('Excel file data returned');
        res.writeHead(200);
        res.end(JSON.stringify({ 'data': xlData }));
    } else {
        res.writeHead(412);
        res.end(JSON.stringify({ 'error': 'Config File Unavailable' }));
    }
});
//----------------------------------------------------------------------------
// Trigger tweet from excel

app.get('/api/v1/tweetfromexcel', (req, res) => {
    let isConfigured = fs.existsSync('./src/js/config.js');
    if (isConfigured && fs.existsSync('uploads/tweets.xlsx')) {
        let config = require('./src/js/config');
        const T = new Twitter(config);

        let workbook = xlsx.readFile('uploads/tweets.xlsx');
        let sheet_name_list = workbook.SheetNames;
        let tweets = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log(`${tweets.length} tweets received. Tweeting now...`);

        let postUrl = 'statuses/update';
        tweets.forEach((singleTweet) => {
            let postParams = { status: singleTweet.Message };
            T.post(postUrl, postParams, (err, result, response) => {
                if (!err) {
                    console.log(`Success: \nID: ${result.id_str}. \nMessage: ${result.text}`);
                } else {
                    console.log(`Failed to post Tweets. Error: ${err}`);
                }
            });
        });
        res.end(`Completed tweeting all messages.`)
    } else {
        console.log('Config File not Available.');
        res.end('Config File not Available.\n')
    }
});
//----------------------------------------------------------------------------