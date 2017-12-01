/**
 * 剪贴板
 * @author ydr.me
 * @create 2017-11-30 11:23
 * @update 2017-11-30 11:23
 */


'use strict';

var array = require('blear.utils.array');

var imageRE = /^image\//;

exports.image = getClipboardImage;

// ==============================

/**
 * 获取剪贴板里的图片
 * @param ev
 * @returns {null|File}
 */
function getClipboardImage(ev) {
    var files = ev.clipboardData.files;

    if (!files.length) {
        return null;
    }

    var image = null;

    array.each(files, function (index, file) {
        if (imageRE.test(file.type)) {
            image = file;
            return false;
        }
    });

    return image;
}


