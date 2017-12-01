/**
 * ButtonManager
 * @author ydr.me
 * @create 2017-11-29 14:48
 * @update 2017-11-29 14:48
 */


'use strict';

var Events = require('blear.classes.events');
var object = require('blear.utils.object');
var typeis = require('blear.utils.typeis');
var selector = require('blear.core.selector');
var attribute = require('blear.core.attribute');
var event = require('blear.core.event');

var nativeTypeMap = {
    bold: 1,
    italic: 1,
    underline: 1,
    strikeThrough: 1
};
var defaults = {
    el: null,
    activeClassName: 'active',
    cmd: 'bold'
};
var ButtonManager = Events.extend({
    className: 'ButtonManager',
    constructor: function (options) {
        var the = this;

        ButtonManager.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the.type = 'external';
        the.active = false;
        var cmd = the[_options].cmd;
        the.type = nativeTypeMap[cmd] ? 'native' : 'external';
        the[_buttonEl] = selector.query(the[_options].el)[0];
        event.on(the[_buttonEl], 'mousedown', the[_listener] = function () {
            the.toggle();
            the.emit('action', function () {
                var fn = this[cmd];
                if (typeis.Function(cmd)) {
                    cmd.call(this)
                } else if (typeis.Function(fn)) {
                    fn.call(this);
                }
            });
            return false;
        });
    },

    /**
     * 切换按钮状态
     * @returns {ButtonManager}
     */
    toggle: function () {
        var the = this;
        the[_active](!the.active);
        return the;
    },

    /**
     * 更新状态
     * @returns {ButtonManager}
     */
    update: function () {
        var the = this;
        var boolean = document.queryCommandState(the[_options].cmd);
        the[_active](boolean);
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_buttonEl], 'mousedown', the[_listener]);
        ButtonManager.invoke('destroy', the);
    }
});

var sole = ButtonManager.sole;
var pro = ButtonManager.prototype;
var _options = sole();
var _buttonEl = sole();
var _listener = sole();
var _active = sole();

/**
 * 激活按钮
 * @param boolean
 */
pro[_active] = function (boolean) {
    var the = this;
    var activeClassName = the[_options].activeClassName;

    if (boolean === the.active) {
        return;
    }

    the.active = boolean;
    attribute[(boolean ? 'add' : 'remove') + 'Class'](the[_buttonEl], activeClassName);
};

ButtonManager.defaults = defaults;
module.exports = ButtonManager;



