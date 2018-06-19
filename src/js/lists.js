"use strict";

const Twitter = require('twitter');
let config = require('./config');
const T = new Twitter(config);

let lists = {
    createList: function (data) {
        return new Promise((resolve, reject) => {
            console.log(data.title);
            return;
            T.post('lists/create', { name: data.title }, (err, result, response) => {
                if (!err) {
                    console.log(`List created. slug: ${result.slug} :: list_id: ${result.id_str}\n`);
                    console.log(typeof (result.id_str));
                    resolve(result.id_str);
                } else {
                    reject(err);
                }
            });
        })
    },
    addUsersToList: function (listId, usersString) {
        console.log(listId, usersString);
        // let usersArray = usersString.split(',');
        let addUsersParam = {
            list_id: listId,
            screen_name: usersString
        };
        console.log(addUsersParam);
        T.post('lists/members/create_all', addUsersParam, (err, result, response) => {
            if (!err) {
                console.log(`Members added to list.\n`);
                T.get('lists/show', { list_id: listId }, (err, result, response) => {
                    if (!err) {
                        console.log(`List now contains ${result.member_count} members\n`);
                    } else {
                        console.log(err);
                    }
                });
            } else {
                console.log(err);
            }
        });
    },
    addToList: function (data) {
        this.isDuplicateList(data).catch((err) => {
            console.log(err);
        }).then((data) => {
            if (data) {
                this.createList(data).catch(err => console.log(err)).then((listId) => {
                    this.addUsersToList(listId, data.users);
                });
            } else {
                console.log('exiting');
            }
        });
    },
    isDuplicateList: function (data) {
        return new Promise((resolve, reject) => {
            T.get('lists/list', (err, result, response) => {
                if (!err) {
                    if (result.length) {
                        let currentList = result.filter((singleList) => {
                            return singleList.name === data.title.trim();
                        });
                        if (currentList.length) {
                            console.log('List with that name exists\n');
                            reject('Duplicate list name');
                        } else {
                            console.log('List can be created \n');
                            resolve(data);
                        }
                    } else {
                        console.log('Zero lists found. First list can be created \n');
                        resolve(data);
                    }
                } else {
                    console.log(err);
                    reject(err);
                }
            });
        });
    }
}

module.exports = lists