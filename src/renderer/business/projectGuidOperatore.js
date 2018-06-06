import connection from '../common/mysql'
//var connection = require('../common/mysql').connection
var fs = require('fs')

export default {
  getProjectList: function (callback) {
    connection.query(`SELECT ID, HtmlContent FROM project_guide`,
      [],
      (err, res) => {
        if (err) {
          callback(err, null)
        } else if (res && res.length) {
          callback(null, res)
        } else {
          callback(null, [])
        }
      })
  },
  updateProject: function (id, content, sourceContent, fileName) {
    connection.query(`UPDATE project_guide SET HtmlContent = ? WHERE ID = ?`,
      [content, id],
      (err) => {
        if (err) {
          console.log(err)
        } else {
          var lineSql = `<ID>= ${id}\r\n<HtmlContent>= ${sourceContent}\r\n`
          fs.exists(fileName, exist => {
            if (exist) {
              fs.appendFile(fileName, lineSql, function (err) {
                if (err) {
                  console.error(err)
                } else {
                  console.log('写入成功')
                }
              })
            } else {
              fs.writeFile(fileName, lineSql, function (err) {
                if (err) {
                  console.error(err)
                } else {
                  console.log('写入成功')
                }
              })
            }
          })
        }
      })
  }
}
