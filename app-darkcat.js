// 应用配置
process.env.NODE_ENV = 'app-darkcat'
const config = require('config')
const appPort = config.server.appPort

// 应用服务相关
const Koa = require('koa')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const mount = require('koa-mount')

// 应用中间件
const xcontroller = require('koa-xcontroller')
const xerror = require('koa-xerror')
const xauth = require('koa-xauth')
const xlog = require('koa-xlog')

// 应用工具
const mongoConnect = require('./util/mongo')
mongoConnect(config.server)

// 应用服务
const app = new Koa()
app.use(mount('/', cors()))
app.use(xerror(config.error))
app.use(koaBody())
app.use(xlog(config.log))
app.use(xauth(config.auth))
xcontroller.init(app, config.server)
app.listen(appPort)
console.info(`应用服务启动【执行环境:${process.env.NODE_ENV},端口:${appPort}】`)