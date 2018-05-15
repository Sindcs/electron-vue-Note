/**
 * Created by Sind on 2017/6/7.
 */
var enumType = require('../model/enumtype')

var dict = {
  cataLogTypeDict: [
    { key: enumType.cataLogType.personalNote, value: '个人笔记' },
    { key: enumType.cataLogType.thesisLiterature, value: '论文文献' },
    { key: enumType.cataLogType.literatureDatum, value: '文档资料' }
    // { key: enumType.cataLogType.achievement, value: '我的成果' }
  ],
  sourseTypeDict: [
    { key: enumType.sourceType.note, value: '个人笔记', level: 1 },
    { key: enumType.sourceType.thesis, value: '论文文献', level: 1 },
    { key: enumType.sourceType.thesis.cjfd, value: '期刊', level: 2 },
    { key: enumType.sourceType.thesis.books, value: '图书/专著/论文集/研究报告', level: 2 },
    { key: enumType.sourceType.thesis.degreethesis, value: '论文', level: 2 },
    { key: enumType.sourceType.thesis.conferencethesis, value: '会议', level: 2 },
    { key: enumType.sourceType.thesis.nationstandard, value: '国家标准', level: 2 },
    { key: enumType.sourceType.thesis.commonthesis, value: '通用类型', level: 2 },
    { key: enumType.sourceType.thesis.newspaper, value: '报纸', level: 2 },
    { key: enumType.sourceType.thesis.patent, value: '专利', level: 2 },
    { key: enumType.sourceType.documentdatum, value: '文档资料', level: 1 },
    { key: enumType.sourceType.achievement, value: '个人成果', level: 1 }
  ],
  documentTypeDict: [
    { key: enumType.documentType.pdf, value: {extension: 'pdf', typeName: 'pdf文档'} },
    { key: enumType.documentType.caj, value: {extension: 'caj', typeName: 'caj文档'} },
    { key: enumType.documentType.word, value: {extension: 'doc,docx', typeName: 'word文档'} },
    { key: enumType.documentType.ppt, value: {extension: 'ppt,pptx', typeName: 'ppt演示文稿'} },
    { key: enumType.documentType.excel, value: {extension: 'xls,xlsx', typeName: 'excel文档'} },
    { key: enumType.documentType.html, value: {extension: 'html,htm', typeName: '网页'} },
    { key: enumType.documentType.txt, value: {extension: 'txt', typeName: '网页'} },
    { key: enumType.documentType.code, value: {extension: 'cs,js,css,php,pl,py,rb,java,vb,c,cs,cpp,xml,bsh', typeName: '代码'} },
    { key: enumType.documentType.image, value: {extension: 'png,jpg,bmp,jpeg,gif', typeName: '图片文件'} },
    { key: enumType.documentType.video, value: {extension: 'mp3', typeName: '音频文件'} },
    { key: enumType.documentType.audio, value: {extension: 'mp4,avi,wma,rmvb', typeName: '视频文件'} },
    { key: enumType.documentType.projectDoc, value: {extension: 'sln', typeName: '工程文件'} },
    { key: enumType.documentType.other, value: {extension: 'zip,exe,kdh,nh,gz', typeName: '其他文件'} }
  ],
  relTypeDict: [
    {key: enumType.cataLogType.personalNote, value: '关联笔记'},
    {key: enumType.cataLogType.thesisLiterature, value: '关联文献'},
    {key: enumType.cataLogType.literatureDatum, value: '关联文档'}
  ]
}
module.exports = dict
