module.exports={
    database:{
        url:'mongodb://localhost:27017/meanauth',
        userscollection: 'users',
        logcollection: 'authlog'
    },
    logging:{
        store: {
            db: false
        },
        folder : 'logs'
    },
    secret:'asecret'
}