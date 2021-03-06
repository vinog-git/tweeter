"use strict";

//----------------------------------------------------------------------------
// Require lib modules
const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const xlsx = require('xlsx');
const wget = require('wget');
require('dotenv').config();

const Twitter = require('twitter');
let config = require('./src/js/config');
const T = new Twitter(config);
//----------------------------------------------------------------------------
// Require custom modules
const media = require('./src/js/mediaUpload');
const tweetTrendingTopics = require('./src/js/tweetTrendingTopics');
const tweetSelectedTrends = require('./src/js/tweetSelectedTrends');
const lists = require('./src/js/lists');
let tweetinginIntervals = [];
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
// Promise to create File
// let createFile = new Promise((resolve, reject) => {
//     let source = process.env.file_location;
//     let outPutFile = 'uploads/tweets.xlsx';
//     wget.download(source, outPutFile);
//     resolve('success');
// });
//----------------------------------------------------------------------------
// let mediaStatus = media.getStatus('1212');
// media.uploadMedia('star_wars.png');
//----------------------------------------------------------------------------


// Function for tweeting trends

function tweetTrends(trends){
    console.log(`selectedTrends in service: ${trends}`);
    tweetSelectedTrends(trends);
}



// All API Services
//----------------------------------------------------------------------------
// Start or stop tweeting. action - start/stop

app.all('/api/v1/tweets/:action', (req, res) => {
    let action = req.params.action;
    if (action === 'start') {
        console.log('Started tweeting.')
        res.end('Started tweeting.\n');
        tweetTrendingTopics.startTweeting();
    } else {
        console.log('Stopped tweeting.')
        res.end('Stopped tweeting.\n');
        tweetTrendingTopics.stopTweeting();
    }
});
//----------------------------------------------------------------------------
// Get data from tweets.xlsx

app.get('/api/v1/xlsx', (req, res) => {
    if (fs.existsSync('uploads/tweets.xlsx')) {
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
    createFile.then(() => {
        let workbook = xlsx.readFile('uploads/tweets.xlsx');
        let sheet_name_list = workbook.SheetNames;
        let tweets = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log(`${tweets.length} tweets received. Tweeting now...`);
        let postUrl = 'statuses/update';
        let tweetsResult = [];
        tweets.forEach((singleTweet) => {
            let postParams = { status: singleTweet.Message };
            T.post(postUrl, postParams, (err, result, response) => {
                if (!err) {
                    tweetsResult.push(result.id_str);
                } else {
                    console.log(`Failed to post Tweets. Error: ${err}`);
                }
            });
        });
        res.end(`Completed tweeting all messages.\n`);
    });
});
//----------------------------------------------------------------------------
// Tweet with given trends
app.post('/api/v1/selectedtrends', (req, res) => {
    let selectedTrends = req.body.data;
    let authKey = req.body.authKey;
    if (authKey === process.env.v_key) {
        console.log('Successfully authenticated. Tweeting now. \n');
        
        // Tweet Immediately
        tweetTrends(selectedTrends);

        //Timer to tweet regularly
        let startTweetingSelectedTrends = setInterval(()=>{
            tweetTrends(selectedTrends)
        }, 600000);
        tweetinginIntervals.push(startTweetingSelectedTrends);
        res.end('Tweeting\n');
    } else {
        console.log('Authentication Failure');
        res.end('Authentication Failure.\n');
    }
});
//----------------------------------------------------------------------------
// Stop all interval Tweeting;
app.get('/api/v1/stopalltweets', (req, res) => {
    if (tweetinginIntervals.length) {
        tweetinginIntervals.forEach((singleTimer) => {
            clearInterval(singleTimer);
            console.log(`Stopped tweeting\n`);
            res.end(`Stopped tweeting\n`);
        });
    } else {
        res.end('No timers to stop\n')
    }
});
//----------------------------------------------------------------------------
// Create list and add users;
app.post('/api/v1/listAdd', (req, res) => {
    let data = req.body.data;
    let authKey = req.body.authKey;
    if (authKey === process.env.v_key) {
        console.log('Successfully authenticated.');
        res.end('Successfully authenticated.\n');
        lists.addToList(data);
    } else {
        console.log('Authentication Failure');
        res.end('Authentication Failure.\n');
    }
})

//----------------------------------------------------------------------------