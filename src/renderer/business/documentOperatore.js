/**
 * Created by Sind on 2017/4/28.
 * 文档操作类
 */
import documentdal from '../dal/documentdal'
import sqlite from '../foundation/sqlitdb'
import tagdal from '../dal/tag'
import cataLogOperatore from '../business/cataLogOperatore'
import resouredal from '../dal/resource'
import appConfig from '../config/appConfig'
import tagdocument from '../dal/tag_documentdal'
import config from '../config/index'
import ipcMessage from '../common/ipcMessage'
import renderUtil from '../common/renderutil'
import util from '../common/util'
var enumType = require('../model/enumtype')

var db = sqlite.sqliteDb
var path = require('path')
var fs = require('fs')

export default {
  
}
