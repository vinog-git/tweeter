"use strict";
let Twitter = require('twitter');
let config = require('./config');
let T = new Twitter(config);

function getStatus(m_id) {
    // let statusUrl = `media/upload.json?command=STATUS&media_id=${m_id}`;
    let statusParams = {
        command: 'STATUS',
        media_id: parseInt(m_id)
    };
    T.get('media/upload', statusParams, (err, result, response) => {
        if (!err) {
            console.log(result.processing_info.state);
            return result.processing_info.state;
        } else {
            console.log(err);
            return err;
        }
    });

}

function uploadMedia(file_name) {
    
    file_name = 'uploads/' + file_name;
    let data = require('fs').readFileSync(file_name);
    T.post('media/upload', { media: data }, (err, result, response) => {
        if (!err) {
            console.log(`Media ID: ${result.media_id_string}\n`);
            // getStatus(result.media_id_string);
            let postData = {
                status: 'Star Wars :',
                media_ids: result.media_id_string
            }
            T.post('statuses/update', postData, (err, result, response) => {
                if (!err) {
                    console.log(`Status ID: ${result.id_str}\n`);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

module.exports = {
    getStatus: getStatus,
    uploadMedia: uploadMedia
}