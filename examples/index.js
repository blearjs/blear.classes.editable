/**
 * 文件描述
 * @author ydr.me
 * @create 2017-11-28 15:47
 * @update 2017-11-28 15:47
 */


'use strict';

var Editable = require('../src/index');

var edi = new Editable({
    el: '#demo'
});
var imageUrl = 'http://simditor.tower.im/assets/images/image.png';

edi.button({
    el: '#bold',
    cmd: 'bold',
    shortcut: (Editable.mac ? 'cmd' : 'ctrl') + ' + b'
});
edi.button({
    el: '#italic',
    cmd: 'italic'
});
edi.button({
    el: '#underline',
    cmd: 'underline'
});
edi.button({
    el: '#strikeThrough',
    cmd: 'strikeThrough'
});
edi.button({
    el: '#insertImage',
    cmd: function () {
        var imgEl = document.createElement('img');
        imgEl.src = imageUrl;
        this.insertNode(imgEl);
    }
});
edi.on('pasteImage', function (image, next) {
    next(imageUrl);
});


// document.getElementById('insertImage').onclick = function () {
//     sel.bold();
// };

window.edi = edi;
