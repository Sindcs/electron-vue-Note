/**
 * Created by Sind on 2017/4/26.
 * model
 */

// 标签
const tag = {
  uuid: 1, // 主键
  name: 'test', // 名称（唯一）
  dateCreated: Date.now() // 创建时间
}

// 资源类型
const sourceType = {
  key,
  value
}

// 文档类型
const documentType = {
  key,
  value
}

// 目录类型
const cataLogType = {
  key,
  value
}

// 目录
const cataLog = {
  uuid,
  name,
  type,
  isMonitored, // 是否监控文件夹
  cataLogChain, // 目录uuid链
  path, // 目录路径（用于监控文件夹）
  parentCataLogId,
  docNum, // 文档数
  dateCreated
}

// 收藏
const favorites = {
  documentId,
  type, // 类型cataLogType
  favoritesTimes
}

// 资源表
const resource = {
  uuid,
  ownerId, // 笔记id
  mine, // 类型
  width,
  height, // 高度
  sourceUrl, // 资源来源url
  dateCreated, // 创建时间
  size, // 大小
  md5, // MD5
  data // 二进制数据
}

// 文档内容
const documentcontent = {
  uuid,
  content
}

// 文档关系表
const document_document = {
  documentId,
  rdocumentId
}

//
//
// 以下为在key-value数据库存放字段

// 笔记
const note = {
  uuid,
  title, // 标题
  author, // 作者
  tags, // 标签ids
  dateCreated, // 创建时间
  dateUpdated, // 更新时间
  source, // 来源
  sourceUrl, // 来源url
  isdroped, // 是否在回收站
  isShared, // 是否共享
  size, // 大小
  isDocSync,
  isChanged, // 是否更改（用于同步）
  abstracts, // 摘要简介
  content, // 内容（去掉html标签的内容，仅供检索用）
  cataLogId // 目录id
}

