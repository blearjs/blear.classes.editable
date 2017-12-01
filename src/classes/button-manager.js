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

var mouseEventType = 'mousedown';
// var nativeTypeMap = {
//     bold: 1,
//     italic: 1,
//     underline: 1,
//     strikeThrough: 1
// };
var defaults = {
    el: null,
    activeClassName: 'active',
    cmd: 'bold',
    shortcut: null,
    hotkey: null
};
var ButtonManager = Events.extend({
    className: 'ButtonManager',
    constructor: function (options) {
        var the = this;

        ButtonManager.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the.type = 'external';
        the.active = false;
        the[_buttonEl] = selector.query(the[_options].el)[0];
        the[_initEvent]();
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
        var shortcut = the[_options].shortcut;

        if (shortcut) {
            the[_options].hotkey.unbind(shortcut, the[_action]);
        }

        event.un(the[_buttonEl], mouseEventType, the[_listener]);
        ButtonManager.invoke('destroy', the);
    }
});

var sole = ButtonManager.sole;
var pro = ButtonManager.prototype;
var _options = sole();
var _buttonEl = sole();
var _initEvent = sole();
var _listener = sole();
var _active = sole();
var _action = sole();

/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var cmd = the[_options].cmd;

    the[_action] = function () {
        the.emit('action', function () {
            // this === editable
            var fn = this[cmd];
            if (typeis.Function(cmd)) {
                cmd.call(this)
            } else if (typeis.Function(fn)) {
                fn.call(this);
            }
        });
    };

    if (the[_options].shortcut) {
        the[_options].hotkey.bind(the[_options].shortcut, the[_action]);
    }

    event.on(the[_buttonEl], mouseEventType, the[_listener] = function (ev) {
        the.toggle();
        the[_action]();
        ev.preventDefault();
    });
};

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



