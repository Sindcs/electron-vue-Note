/**
 * Created by Sind on 2017/4/26.
 */

// 资源类型
export const sourceType = {
  note: '1000',
  thesis: {
    cjfd: 'Journal', // 期刊
    books: 'Books', // 图书、专著
    degreethesis: 'Degreethesis', // 论文
    conferencethesis: 'Conferencethesis', // 会议
    nationstandard: 'Nationstandard', // 国标
    patent: 'Patent', // 专利
    newspaper: 'NewsPaper', // 报纸
    scientAchievements: 'ScientAchievements', // 科技成果
    commonthesis: 'Commonthesis' // 通用
  },
  documentdatum: '3000', // 文档资料
  achievement: '4000' // 个人成果
}

// 文档类型
export const documentType = {
  pdf: 'pdf',
  caj: 'caj',
  word: 'word',
  ppt: 'ppt',
  excel: 'excel',
  html: 'html',
  code: 'code',
  image: 'image',
  video: 'video',
  audio: 'audio',
  projectDoc: 'projectDoc',
  txt: 'txt',
  other: 'other'
}


// 目录类型
export const cataLogType = {
  favorite: '02',
  recyleBin: '03',
  unclassify: '04',
  personalNote: '10', // 个人笔记
  group: '50', // 群组
  classify: '60', //
  message: '80' // 消息
}

// 三状态
export const statusCode = {
  hasChild: '400',
  exist: '500',
  notExist: '404',
  success: '200',
  failed: '300'
}

// 删除的资源类型
export const deleteSourceType = {
  document: 'document', // 文档
  cataLog: 'cataLog', // 目录
  tag: 'tag', // 标签,
  favorite: 'favorite',
  tagDocumentRelation: 'tagDocumentRelation',
  documentRelation: 'documentRelation'
}

// 执行结果状态码
export const ResultCode = {
  Success: 200,
  Failure: 500,
  Exist: 300,
  NotFund: 400,
  NotSupport: 603
}

// 消息类型
export const MessageType = {
  groupApply: '1',
  groupApplyHandel: '01',
  system: '2',
  privateChat: 'chat',
  groupChat: 'groupchat'
}
