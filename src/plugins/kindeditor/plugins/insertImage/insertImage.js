//kineditor
KindEditor.plugin('insertImage', function (K) {
    var self = this, name = 'insertImage';
    var mapWidth = K.undef(self.mapWidth, 280),
      mapHeigth =  K.undef(self.mapHeigth, 290);
    var ImgObj = new Image(); //建立一个图像对象
    var AllImgExt = ".jpg|.jpeg|.gif|.bmp|.png|";//全部图片格式类型
    var FileObj, ImgWidth, ImgHeight, FileExt, ErrMsg, FileMsg, HasCheked, IsImg;//全局变量 图片相关属性
    //以下为限制变量
    var AllowExt = ".jpg|.gif|.jpeg|.gif|.bmp|.png|"; //允许上传的文件类型 ?为无限制 每个扩展名后边要加一个"|" 小写字母表示
    //var AllowExt=0
    var AllowImgFileSize = 1024; //允许上传图片文件的大小 0为无限制 单位：KB
    var AllowImgWidth = 1024; //允许上传的图片的宽度 ?为无限制 单位：px(像素)
    var AllowImgHeight = 768; //允许上传的图片的高度 ?为无限制 单位：px(像素)
    var HasChecked = false;
    var imagRealUrl = "";

    //获取文件url
    function getFileUrl(sourceId) {
        var url = "";
        var docObj = document.getElementById(sourceId);
        if (docObj.files && docObj.files[0]) {
            url = window.URL.createObjectURL(docObj.files[0]);
        } else {
            docObj.select();
            window.parent.document.body.focus();
            url = document.selection.createRange().text;
        }
        //document.selection.empty();
        return url;
    }

    //等比例显示图片大小
    function AutoResizeImage(objImg) {
        var maxWidth = 0, maxHeight = 0;
        if (objImg.id == "iwidth") {
            maxWidth = objImg.value;
        } else {
            maxHeight = objImg.value;
        }
        var ratio = 1;
        var w = ImgObj.width;
        var h = ImgObj.height;
        var wRatio = maxWidth / w;
        var hRatio = maxHeight / h;
        if (maxWidth == 0 && maxHeight == 0) {
            ratio = 1;
        } else if (maxWidth == 0) {//
            if (hRatio < 1) ratio = hRatio;
        } else if (maxHeight == 0) {
            if (wRatio < 1) ratio = wRatio;
        } else if (wRatio < 1 || hRatio < 1) {
            ratio = (wRatio <= hRatio ? wRatio : hRatio);
        }
        if (ratio < 1) {
            w = w * ratio;
            h = h * ratio;
        }
        document.getElementById('iheigth').value = h;
        document.getElementById('iwidth').value = w;
    }

    //转化为base64
    function getBase64Image(realPath) {
        var xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
        xmlHttp.open("POST", realPath, false);
        xmlHttp.send("");

        var xmlDom = new ActiveXObject("MSXML2.DOMDocument");
        var tmpNode = xmlDom.createElement("tmpNode");
        tmpNode.dataType = "bin.base64";
        tmpNode.nodeTypedValue = xmlHttp.responseBody;
        var imgBase64Data = tmpNode.text;
        return imgBase64Data;
    }

    //转换为base64
    function convertImgToBase64(img, cwidth, callback, outputFormat) {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        img.crossOrigin = 'Anonymous';
        var width = img.width;
        var height = img.height;
        // 按比例压缩
        var rate = cwidth / width;
        canvas.width = width * rate;
        canvas.height = height * rate;
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
        var dataUrl = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataUrl);
        canvas = null;
    }

    //判断照片大小
    function getPhotoSize(obj) {
        var fileSize = 0;
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        if (isIE && !obj.files) {
            var filePath = obj.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = obj.files[0].size;
        }
        fileSize = Math.round(fileSize / 1024 * 100) / 100; //单位为KB
        return fileSize;
    }

    //检测图像属性
    function CheckProperty(obj,realwidth,realheigth)
    {
        FileObj = obj;
        ImgWidth = ImgObj.width; //取得图片的宽度
        ImgHeight = ImgObj.height; //取得图片的高度
        var imgFileSize = parseInt(''+getPhotoSize(FileObj) * (realwidth * realheigth) / (ImgWidth * ImgHeight)+'');//取得图片文件的大小
        FileMsg = "\n图片大小:" + realwidth + "*" + realheigth + "px";
        FileMsg = FileMsg + "\n图片文件大小:" + imgFileSize + "Kb";
        FileMsg = FileMsg + "\n图片文件扩展名:" + FileExt;
        ErrMsg = "";
        if (AllowImgWidth != 0 && AllowImgWidth < realwidth)
            ErrMsg = ErrMsg + "\n图片宽度超过限制。请上传宽度小于" + AllowImgWidth + "px的文件，当前图片宽度为" + realwidth + "px";
        if (AllowImgHeight != 0 && AllowImgHeight < realheigth)
            ErrMsg = ErrMsg + "\n图片高度超过限制。请上传高度小于" + AllowImgHeight + "px的文件，当前图片高度为" + realheigth + "px";
        if (AllowImgFileSize != 0 && AllowImgFileSize < imgFileSize)
            ErrMsg = ErrMsg + "\n图片文件大小超过限制。请上传小于" + AllowImgFileSize + "KB的文件，当前文件大小为" + imgFileSize + "KB;\n您可以调整图片长宽来改变图片大小！";
        if (ErrMsg != "")
            ShowMsg(ErrMsg, false);
        else
            ShowMsg(FileMsg, true);
    }
    ImgObj.onerror = function () { ErrMsg = '\n图片格式不正确或者图片已损坏!' }

    //显示信息
    function ShowMsg(msg, tf) //显示提示信息 tf=true 显示文件信息 tf=false 显示错误信息 msg-信息内容
    {
        //msg = msg.replace("\n", "<li>");
        //msg = msg.replace(/\n/gi, "<li>");
        var imageShow = document.getElementById('imgShow');
        var localImagId = document.getElementById('localImag');
        if (!tf) {
            alert(msg);
            HasChecked = false;
        }
        else {
            if (IsImg) {
                if (navigator.userAgent.indexOf("MSIE 10.0") > 0 || navigator.userAgent.indexOf("Chrome") > 0 || navigator.userAgent.indexOf("Firefox") > 0) {
                    imageShow.src = imagRealUrl;
                } else {
                    localImagId.style.width = "260px";
                    localImagId.style.height = "280px";
                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imagRealUrl;
                    alert(localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader"));
                }
            }
            else
                alert("非图片文件！");
            HasChecked = true;
        }
    }

    function imageshowchang() {
        if (ImgObj != null) {
            var w = ImgObj.width;
            var h = ImgObj.height;
            document.getElementById('iwidth').value = w;
            document.getElementById('iheigth').value = h;
        }
    }

    //检查文件类型
    function CheckExt(obj) {
        ErrMsg = "";
        FileMsg = "";
        FileObj = obj;
        IsImg = false;
        HasChecked = false;
        var url = obj.value;
        imagRealUrl = getFileUrl(obj.id);
        if (url == "") return false;
        FileExt = url.substr(url.lastIndexOf(".")).toLowerCase();
        if (AllowExt != 0 && AllowExt.indexOf(FileExt + "|") == -1) //判断文件类型是否允许上传
        {
            ErrMsg = "\n该文件类型不是允许的图片类型。\n请选择 " + AllowExt + " 类型的文件，当前文件类型为" + FileExt;
            ShowMsg(ErrMsg, false);
            return false;
        }
        if (AllImgExt.indexOf(FileExt + "|") != -1) //如果图片文件，则进行图片信息处理
        {
            IsImg = true;
            ImgObj.src = imagRealUrl;
            ShowMsg(ErrMsg, true);
            setTimeout(imageshowchang, 60);

            return false;
        }
        else {
            FileMsg = "\n文件扩展名:" + FileExt;
            ShowMsg(FileMsg, true);
            ImgObj = null;
        }
    }
    K.undef(self.mapHeight, 210);
    self.clickToolbar(name, function () {
        var html = ['<div style="padding:10px 20px;">',
			'<div class="ke-header">',
            '</div>',
			// left start
			'<div class="ke-left">',
            '<div class="ke-dialog-row">',
			'<input type="file" name="imgOne" id="imgOne"/> &nbsp;',
            '</div>',
            '<div class="ke-map" style="width:' + mapWidth + 'px;height:' + mapHeigth + 'px;">',
            '<div id="localImag" width="260px">',
            '<img id="imgShow" src="" width = "260px" heigth = "250px" style="display: block;" />&nbsp;',
            '</div>',
            '</div>',
            '<div>',
            '<label for="keUrl" style="width:40px;">' + '宽度:' + '</label>',
            '<input type="text" id="iwidth" name="width" class="ke-input-text" style="width:55px;"/> &nbsp;&nbsp;',
            '<label for="keUrl" style="width:40px;">' + '高度:' + '</label>',
            '<input type="text" id="iheigth" name="width" class="ke-input-text" style="width:55px;"/> &nbsp;&nbsp;',
            '</div>',
			'</div>'
			].join('');
        var dialog = self.createDialog({
            name: name,
            width: mapWidth + 42,
            title: self.lang(name),
            body: html,
            yesBtn: {
                name: self.lang('yes'),
                click: function () {
                    if (HasChecked) {
                        var width = document.getElementById('iwidth').value;
                        var height = document.getElementById('iheigth').value;
                        //alert(getBase64Image(imagRealUrl));
                        CheckProperty(FileObj, width, height);
                        if (HasChecked) {
                            convertImgToBase64(ImgObj, width, function (base64Image) {
                                self.insertHtml('<img src = "' + base64Image + '"  alt = "" />');
                                self.hideDialog().focus();
                            });
                        }
                        window.URL.revokeObjectURL(imagRealUrl);
                        HasChecked = true;
                    }
                    self.focus();
                }
            }
        });
        var div = dialog.div;
        var changInput = K('[name="imgOne"]', div)
        var widthInput = K('#iwidth', div)
        var heigthInput = K('#iheigth', div)
        changInput.change(function(e) {
            CheckExt(this)
        })
        widthInput.change(function(e) {
            AutoResizeImage(this)
        })
        heigthInput.change(function(e) {
            AutoResizeImage(this)
        })
    });
});
