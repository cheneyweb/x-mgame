// 持久化相关
const MongoClient = require('mongodb').MongoClient

function mongoConnect(options) {
    options.mongoOption = options.mongoOption || {}
    MongoClient.connect(options.mongodbUrl, { useNewUrlParser: true, ...options.mongoOption }, (err, database) => {
        if (err) {
            log.warn('mongo reconnecting...')
            setTimeout(() => mongoConnect(options), 1000)
        } else {
            global.mongo = database
            global.mongodb = database.db(options.mongodbUrl.substring(options.mongodbUrl.lastIndexOf('/') + 1, options.mongodbUrl.length))
            global.getMongoSession = async () => {
                const session = await database.startSession()
                await session.startTransaction({
                    readConcern: { level: 'majority' },
                    writeConcern: { w: 'majority' }
                })
                return session
            }
        }
    })
}

module.exports = mongoConnect