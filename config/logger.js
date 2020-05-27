/*
* configuration for logger.
* logger used is winston package
*/
const path = require('path');
const fs = require('fs');
const appRoot = require('app-root-path');
const clfDate = require('clf-date');

const winston = require('winston');
const winstonMdB = require('winston-mongodb');
const config = require('./database');




//creation of the logger
// this logger sends all info level message to the console
const logger = winston.createLogger({
    defaultMeta: { service: 'AuthLogger' },
    transports: [
        
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(), winston.format.json(),
                winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
                winston.format.colorize()
            )
       }),
       new winston.transports.File({
        filename: 'auth_info.log',
        level: 'info',
        format: winston.format.combine(
             winston.format.timestamp(), winston.format.json(),
             winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
             winston.format.colorize()//,
       // this.winstonConsoleFormat()
         )
     }) ,
       new winstonMdB.MongoDB({
           db:config.database.url,
           collection: config.logcollection,
           level: 'info',
           options: { 
               useUnifiedTopology: true,

            },
           format: winston.format.combine(
                winston.format.timestamp(), winston.format.json(),
                winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
            )
        })
        

    ]
});



module.exports = logger;