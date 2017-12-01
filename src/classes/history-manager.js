/**
 * HistoryManager
 * @author ydr.me
 * @create 2017-11-29 14:15
 * @update 2017-11-29 14:15
 */


'use strict';

var Class = require('blear.classes.class');
var object = require('blear.utils.object');

var defaults = {
    /**
     * 最长记录
     */
    max: 99
};
var HistoryManager = Class.extend({
    className: 'HistoryManager',
    constructor: function (options) {
        var the = this;

        HistoryManager.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_histories] = [];
        the[_gid] = 0;
    },

    /**
     * 插入记录
     * @param item
     * @returns {HistoryManager}
     */
    put: function (item) {
        var the = this;

        item.gid = the[_gid]++;
        item.timeStamp = Date.now();
        the[_histories].push(item);

        if (the[_histories].length === the[_options].max) {
            the[_histories].shift();
        }

        return the;
    },

    /**
     * 取出记录
     * @returns {*}
     */
    pop: function () {
        return this[_histories].pop();
    },

    /**
     * 最近一个记录
     * @returns {*}
     */
    recent: function () {
        var histories = this[_histories];
        return histories[histories.length - 1];
    },

    /**
     * 销毁
     */
    destroy: function () {
        var the = this;

        the[_histories] = the[_options] = the[_gid] = null;
        HistoryManager.invoke('destroy', the);
    }
});
var sole = HistoryManager.sole;
var pro = HistoryManager.prototype;
var _options = sole();
var _histories = sole();
var _gid = sole();


HistoryManager.defaults = defaults;
module.exports = HistoryManager;



