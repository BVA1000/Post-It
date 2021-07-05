'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "updatedAt" on table "posts"
 * changeColumn "createdAt" on table "posts"
 * changeColumn "updatedAt" on table "users"
 * changeColumn "createdAt" on table "users"
 *
 **/

var info = {
    "revision": 5,
    "name": "updated_users_posts_created_updated",
    "created": "2021-07-02T15:46:42.583Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "posts",
            "updatedAt",
            {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "createdAt",
            {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "updatedAt",
            {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "createdAt",
            {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
