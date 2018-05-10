/**
 * Created by Sind on 2017/7/24.
 */
import config from '../config/index'

var redis = require('redis')
var client = redis.createClient(config.dbConnct.redis.port, config.dbConnct.redis.host)

client.on('ready', () => {
  console.log('redis ready')
})
client.on('error', (err) => {
  console.log(err)
})

module.exports = client