module.exports={
    database:{
        url:'mongodb://localhost:27017/meanauth',
        userscollection: 'users',
        logcollection: 'authlog'
    },
    logging:{
        folder : 'logs'
    },
    secret:'asecret'
}