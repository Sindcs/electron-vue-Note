/**
 * Created by Sind on 2017/11/14.
 */
import {sourceType} from './enumtype'
import util from '../common/util'

// 期刊
let cjfd = {
  uuid: '', // 主键
  uniqueId: '', // 唯一标示
  sign: '', // 标记
  lietratureType: sourceType.thesis.cjfd, // 类型
  title: '', // 标题
  author: '', // 作者
  source: {}, // 来源
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1, // 是否发生更改（未同步）
  content: '', // 内容
  dateCreated: Date.now(), // 创建时间
  organization: '', // 机构
  location: '', // 所在地，
  postalcode: '', // 邮编
  cataLogId: '', // 目录id
  cataLogType: '',
  tags: '', // 标签
  sourceUrl: '', // 来源链接
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  keywords: '', // 关键字
  abstracts: '', // 摘要
  periodicalName: '', // 刊名
  publishYear: '', // 出版年份
  issue: '', // 卷
  reelNum: '', // 期
  startStopPage: '', // 起止页码
  isbn: '',
  doi: '',
  issn: '',
  fund: '', // 基金
  remark: '', // 备注
  language: '' // 语种
}

// 图书、专著
let books = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.books, // 类型
  title: '', // 标题
  author: '', // 作者
  source: {}, // 来源
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  uniqueId: '',
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: Date.now(),
  cataLogId: '', // 目录id
  cataLogType: '',
  tags: '', // 标签
  sourceUrl: '', // 来源链接
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  editor: '', // 编辑
  subjectTerm: '', // 主题词
  publishHouse: '', // 出版社
  publishYear: '', // 出版年份
  publishPlace: '', // 出版地
  printCount: null, // 印次
  startStopPage: null,
  isbn: '',
  fund: '',
  remark: '',
  language: ''
}

// 学位论文
let degreethesis = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.degreethesis, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  keywords: '',
  abstracts: '',
  conferringUnit: '', // 授予单位
  publishYear: '',
  publishPlace: '',
  storeUnit: '',
  startStopPage: null,
  fund: '',
  remark: '',
  language: ''
}

// 会议论文
let conferencethesis = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.conferencethesis, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  keywords: '',
  abstracts: '',
  sponsorHost: '', // 主办单位
  conferenceName: '',
  conferenceThesis: '', // 会议论文集
  conferencePlace: '', // 会议地点
  conferenceYear: null, // 会议年份
  startStopPage: null,
  fund: '',
  remark: '',
  language: ''
}

// 国标
let nationstandard = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.nationstandard, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  name: '',
  englishName: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  standardNum: '',
  subjectTerm: '',
  englishSubjectTerm: '',
  abstracts: '',
  countryType: '', // 国别
  publishTime: null,
  implementTime: null, // 实施日期
  publishUnit: '', // 发布单位
  draftUnit: '', // 起草单位
  pageNum: null,
  remark: '',
  language: ''
}

// 专利
let patent = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.patent, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  name: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  owner: '', // 专利所有者
  abstracts: '',
  independentClaim: '', // 主权项
  patentNum: null, // 专利号
  patentCountry: '', // 专利国别
  publishTime: null,
  pageNum: null,
  remark: '',
  language: ''
}

// 报纸
let newspaper = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.newspaper, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isAnalysisFalse: 0,
  isFromMiddle: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  keywords: '',
  name: '', // 报纸名称
  publishYear: null,
  plateNumber: null, // 版号
  publishTime: null,
  edition: '',
  remark: '',
  language: ''
}

// 通用
let commonthesis = {
  uuid: '',
  sign: '', // 标记
  lietratureType: sourceType.thesis.commonthesis, // 类型
  title: '', // 标题
  author: '', // 作者
  source: '', // 来源
  uniqueId: '',
  size: null,
  isdroped: 0,
  isShared: 0,
  isDelete: 0,
  isUpFile: 0,
  isSyncFile: 0,
  isFromMiddle: 0,
  isAnalysisFalse: 0,
  documentType: '',
  isMonitored: 0,
  suffix: '',
  dateUpdated: null,
  isChanged: 1,
  isDocSync: 0,
  content: '',
  dateCreated: null,
  cataLogId: '', // 目录id
  cataLogType: '',
  doi: '',
  tags: '',
  sourceUrl: '',
  filePath: '', // 文档位置
  downloadPath: '', // 文档下载位置
  keywords: '',
  abstracts: '',
  editor: '',
  periodcalName: '',
  publishHouse: '',
  storeUnit: '',
  publishYear: '',
  publishTime: '',
  publishPlace: '',
  issue: '',
  reelNum: null,
  startStopPage: null,
  isbn: '',
  issn: '',
  fund: '',
  remark: '',
  language: ''
}

export const lietratureType2Type = function (sourseDoc, lietratureType) {
  let result = {}
  switch (lietratureType) {
    case sourceType.thesis.cjfd:
      result = util.transObject2otherObject(sourseDoc, cjfd)
      break
    case sourceType.thesis.books:
      result = util.transObject2otherObject(sourseDoc, books)
      break
    case sourceType.thesis.commonthesis:
      result = util.transObject2otherObject(sourseDoc, commonthesis)
      break
    case sourceType.thesis.conferencethesis:
      result = util.transObject2otherObject(sourseDoc, conferencethesis)
      break
    case sourceType.thesis.degreethesis:
      result = util.transObject2otherObject(sourseDoc, degreethesis)
      break
    case sourceType.thesis.newspaper:
      result = util.transObject2otherObject(sourseDoc, newspaper)
      break
    case sourceType.thesis.nationstandard:
      result = util.transObject2otherObject(sourseDoc, nationstandard)
      break
    case sourceType.thesis.patent:
      result = util.transObject2otherObject(sourseDoc, patent)
      break
    case sourceType.thesis.scientAchievements:
      result = util.transObject2otherObject(sourseDoc, commonthesis)
      break
  }
  result.lietratureType = lietratureType
  return result
}
