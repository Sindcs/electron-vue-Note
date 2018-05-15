/**
 * Created by Sind on 2017/10/29.
 */
import tagdocumentdal from '../dal/tag_documentdal'

export default {
// 获取发生更新的关系
  getHasChangedRelation: () => {
    return new Promise((resolve, reject) => {
      tagdocumentdal.getHasChangedRelation((err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  insertOneRelation: (uuid, relation) => {
    return new Promise((resolve, reject) => {
      tagdocumentdal.getOneDocTagRelations(uuid, (err, row) => {
        if (err) {
          reject(err)
        } else {
          if (!row || !row.length) {
            tagdocumentdal.insert(relation, (err) => {
              if (err) {
                reject(err)
              } else {
                resolve('insert')
              }
            })
          } else {
            resolve('update')
          }
        }
      })
    })
  },
  // 重新设置更改状态
  resetIsChanged: (uuid) => {
    return new Promise((resolve, reject) => {
      tagdocumentdal.resetIsChanged(uuid, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  deleteOneSync: (uuid) => {
    return tagdocumentdal.deleteOne(uuid)
  },
  resetAllIsChanged: () => {
    return new Promise((resolve, reject) => {
      tagdocumentdal.resetAllIsChanged(1, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
