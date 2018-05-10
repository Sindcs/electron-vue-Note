/**
 * Created by Sind on 2017/7/4.
 */
//const uuidV1 = require('uuid')
var $ = require('jquery')

export default {
  getSyncApiUrl: (url) => {
    return `/sync_api/v0${url}`
  },
  getFileApiUrl: (url) => {
    return `/file_api/v0${url}`
  },
  // 获取uuid
  getUuid: function () {
    return 'dadad'
  },
  removeStyle: function (dom) {
    let exceptList = [
      'title',
      'style',
      'script',
      'meta',
      'link',
      'dialog',
      'audio',
      'embed',
      'video',
      'wbr'
    ];
    let nodeName = dom.prop("nodeName");
    if (nodeName) {
      nodeName = nodeName.toLowerCase();
      if (exceptList.indexOf(nodeName) >= 0) {
        dom.remove();
        return false;
      }
    } else {
      return false;
    }
    dom.removeAttr('style');
    dom.removeAttr('onchange');
    dom.removeAttr('onclick');
    dom.removeAttr('style');
    dom.removeAttr('onmouseout');
    dom.removeAttr('onmouseover');
    dom.removeAttr('onmousedown');
    dom.removeAttr('onmouseup');
    dom.removeAttr('onfocus');
    dom.removeAttr('class');
    dom.removeAttr('id');
    var href = dom.attr('href');
    let lhref = '';
    if (href) {
      lhref = href.toLowerCase();
    }
    if (href && !(lhref.indexOf('http:') === 0 || lhref.indexOf('https:') === 0)) {
      dom.removeAttr('href');
    }
    let childList = dom.children();
    if (childList && childList.length) {
      childList.each((index, element) => {
        this.removeStyle($(element));
      });
    }
    return true;
  }
}
