const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

let tweetTrendingTopics = require('./src/tweetTrendingTopics');

app.use('/', express.static('src'));
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Tweeter is listening at ' + PORT));

// Check if config file is available
if (fs.existsSync('src/config.js')) {
    tweetTrendingTopics();
    console.log('Config file found: Starting to tweet');
} else {
    console.log('Config file for T. authentication is missing');
}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Service to store config file
app.post("/config", function (request, response) {
    let contentForConfigJs = request.body;
    let callResponse = { callStatus: 'Failure' };
    if (contentForConfigJs.userAuth !== 'iRobot') {
        callResponse.callStatus = 'Authentication Failed';
        console.log('Authentication failed');
        response.writeHead(401, { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify(callResponse));
    } else {

        fs.writeFile('src/config.js', contentForConfigJs.userInput, (err) => {
            if (err) {
                callResponse.callStatus = 'Unable to create File';
                console.log('Unable to create file');
                response.writeHead(412, { 'Content-Type': 'text/plain' });
                response.end(JSON.stringify(callResponse));
            } else {
                callResponse.callStatus = 'Success';
                tweetTrendingTopics();
                console.log('Config file created: Starting to tweet');
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end(JSON.stringify(callResponse));

            }
        });
    }

});