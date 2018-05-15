/**
 * Created by ding on 2017/8/10.
 */
var enumTypes = require('../model/enumtype')
var dict = {
  documentTypeIcon: [
    {key: enumTypes.documentType.word + 'I', value: 'word'},
    {key: enumTypes.documentType.caj + 'I', value: 'caj'},
    {key: enumTypes.documentType.pdf + 'I', value: 'pdf'},
    {key: enumTypes.documentType.excel + 'I', value: 'exell'},
    {key: enumTypes.documentType.html + 'I', value: 'html'},
    {key: enumTypes.documentType.image + 'I', value: 'image'},
    {key: enumTypes.documentType.video + 'I', value: 'video'},
    {key: enumTypes.documentType.audio + 'I', value: 'video'},
    {key: enumTypes.documentType.projectDoc + 'I', value: ''},
    {key: enumTypes.documentType.txt + 'I', value: 'other'},
    {key: enumTypes.documentType.other + 'I', value: 'undefined'},
    {key: enumTypes.documentType.ppt + 'I', value: 'ppt'},
    {key: enumTypes.documentType.code + 'I', value: 'code'}
  ],
  catalogTypeIcon: [
    {key: enumTypes.cataLogType.achievement + 'I', value: 'cataIcon iconfont icon-boshimao-copy'},
    {key: enumTypes.cataLogType.literatureDatum + 'I', value: 'cataIcon iconfont icon-ziliao1'},
    {key: enumTypes.cataLogType.personalNote + 'I', value: 'cataIcon iconfont iconfont icon-Shape-copy'},
    {key: enumTypes.cataLogType.thesisLiterature + 'I', value: 'cataIcon iconfont icon-qikan'},
    {key: enumTypes.quikDirType.home + 'I', value: 'cataIcon iconfont icon-shouye2'},
    {key: enumTypes.quikDirType.classify + 'I', value: 'cataIcon iconfont icon-shaixuan3'},
    {key: enumTypes.quikDirType.group + 'I', value: 'cataIcon iconfont icon-shaixuan3'},
    {key: enumTypes.quikDirType.message + 'I', value: 'cataIcon iconfont icon-gongxiangwenxian'},
    {key: enumTypes.quikDirType.resyclebin + 'I', value: 'cataIcon iconfont icon-huishouzhan3'},
    {key: enumTypes.quikDirType.resentRead + 'I', value: 'cataIcon iconfont icon-gongxiangwenxian'},
    {key: enumTypes.quikDirType.setting + 'I', value: 'cataIcon iconfont icon-gongxiangwenxian'},
    {key: enumTypes.quikDirType.fav + 'I', value: 'cataIcon iconfont icon-gongxiangwenxian'}
  ]
}
module.exports = dict
