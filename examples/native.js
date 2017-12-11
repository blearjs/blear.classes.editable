/**
 * 文件描述
 * @author ydr.me
 * @create 2017-12-11 14:53
 * @update 2017-12-11 14:53
 */


'use strict';

var demoEl = document.getElementById('demo');
var boldEl = document.getElementById('bold');
var italicEl = document.getElementById('italic');

boldEl.onclick = function () {
    document.execCommand('bold');
};

italicEl.onclick = function () {
    document.execCommand('italic');
};

