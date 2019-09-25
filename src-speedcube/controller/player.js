const config = require('config')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const Router = require('koa-router')
const router = new Router()
const ObjectId = require('mongodb').ObjectId

function initPlayer(inparam) {
    inparam.lastLogin = Date.now()
    delete inparam._id
    return true
}

router.post('/login', async (ctx, next) => {
    const mongodb = global.mongodb
    const inparam = ctx.request.body
    let player
    // 查询玩家是否存在，不存在则自动创建
    if (inparam._id) {
        player = await mongodb.collection('player').findOne({ _id: ObjectId(inparam._id) })
        if (!player) {
            initPlayer(inparam)
            res = await mongodb.collection('player').insertOne(inparam)
            player = { ...inparam, _id: res.insertedId }
        } else {
            mongodb.collection('player').findOneAndUpdate({ _id: ObjectId(player._id) }, { $set: { lastLogin: Date.now() } })
        }
    } else {
        initPlayer(inparam)
        let res = await mongodb.collection('player').insertOne(inparam)
        player = { ...inparam, _id: res.insertedId }
    }
    const token = jwt.sign(_.pick(player, ['_id']), config.auth.secret)
    ctx.body = { player, token }
})

router.post('/upload', async (ctx, next) => {
    const token = ctx.tokenVerify
    const mongodb = global.mongodb
    const inparam = ctx.request.body
    delete inparam._id
    await mongodb.collection('player').updateOne({ _id: ObjectId(token._id) }, { $set: inparam })
    ctx.body = { err: false }
})



module.exports = router