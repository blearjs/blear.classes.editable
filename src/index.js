/**
 * blear.classes.editable
 * @ref https://github.com/codemirror/codemirror
 * @ref https://github.com/mycolorway/simditor
 * @ref https://github.com/wangfupeng1988/wangEditor/
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';


var Events = require('blear.classes.events');
var Hotkey = require('blear.classes.hotkey');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');
var event = require('blear.core.event');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var time = require('blear.utils.time');
var typeis = require('blear.utils.typeis');

var nativeCommand = require('./commands/native');
var RangeManager = require('./classes/range-manager');
var HistoryManager = require('./classes/history-manager');
var ButtonManager = require('./classes/button-manager');
var clean = require('./utils/clean');
var nodal = require('./utils/nodal');
var clipboard = require('./utils/clipboard');

var defaults = {
    el: null,
    allowTags: [
        'br', 'span', 'a', 'img', 'b', 'strong', 'i', 'strike', 'u', 'font', 'p',
        'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'hr'
    ],
    allowAttrs: {
        img: ['src', 'alt', 'width', 'height'],
        a: ['href', 'target'],
        font: ['color'],
        code: ['class'],
        pre: ['class']
    }
};
var Editable = Events.extend({
    className: 'Editable',
    constructor: function (options) {
        var the = this;
        Editable.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_buttons] = [];
        the[_containerEl] = selector.query(the[_options].el)[0];
        the[_hotkey] = new Hotkey({
            el: the[_containerEl]
        });
        the[_rangerManager] = new RangeManager({
            containerEl: the[_containerEl],
            historyManager: new HistoryManager()
        });
        the[_latestRange] = null;
        the[_initNode]();
        the[_initEvent]();
    },

    /**
     * 加粗
     * @returns {Editable}
     */
    bold: nativeExec('bold'),

    /**
     * 斜体
     * @returns {Editable}
     */
    italic: nativeExec('italic'),

    /**
     * 下划线
     * @returns {Editable}
     */
    underline: nativeExec('underline'),

    /**
     * 删除线
     * @returns {Editable}
     */
    strikeThrough: nativeExec('strikeThrough'),

    /**
     * 插入节点
     * @param node
     * @returns {Editable}
     */
    insertNode: function (node) {
        var the = this;
        the.focus();
        time.nextTick(function () {
            the[_rangerManager].insertNode(node);
            the.focus();
        });
        return the;
    },

    /**
     * 实例化一个按钮
     * @param meta {Object}
     * @param meta.el
     * @param meta.cmd {String|Function}
     * @param [meta.shortcut] {String}
     * @returns {Editable}
     */
    button: function (meta) {
        var the = this;
        var button = new ButtonManager({
            el: meta.el,
            cmd: meta.cmd,
            hotkey: the[_hotkey],
            shortcut: meta.shortcut
        });
        the[_pushButtons](button);
        return the;
    },

    /**
     * 聚焦
     * @returns {Editable}
     */
    focus: function () {
        var the = this;
        the[_rangerManager].focus();
        return the;
    },

    /**
     * 取值
     * @returns {string|*|string}
     */
    getValue: function () {
        var the = this;
        // var cloneNode = the[_containerEl].cloneNode(true);
        return the[_containerEl].innerHTML;
    },

    /**
     * 设值
     * @param value
     * @returns {Editable}
     */
    setValue: function (value) {
        var the = this;
        the[_containerEl].innerHTML = value;
        the.focus();
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(the[_containerEl], 'keydown', the[_onKeydownListener]);
        event.un(the[_containerEl], 'paste', the[_onPasteListener]);
        event.un(the[_containerEl], 'mousedown', the[_onMousedownListener]);
        the[_rangerManager].destroy();
        the[_rangerManager] = null;
        array.each(the[_buttons], function (index, btn) {
            btn.destroy();
        });
        the[_buttons] = null;
        the[_hotkey].destroy();
        Editable.invoke('destroy', the);
    }
});
var pro = Editable.prototype;
var sole = Editable.sole;
var _options = sole();
var _hotkey = sole();
var _buttons = sole();
var _initNode = sole();
var _pastingContainerEl = sole();
var _createPastingConatinerEl = sole();
var _initEvent = sole();
var _containerEl = sole();
var _rangerManager = sole();
var _latestRange = sole();
var _beforeExec = sole();
var _afterExec = sole();
var _fixContainer = sole();
var _pushButtons = sole();
var _onKeydownListener = sole();
var _onPasteListener = sole();
var _onMousedownListener = sole();

/**
 * 初始化节点
 */
pro[_initNode] = function () {
    var the = this;
    the[_fixContainer]();
};

/**
 * 初始化事件
 */
pro[_initEvent] = function () {
    var the = this;
    var options = the[_options];

    the[_hotkey].bind('backspace', function (ev) {
        if (nodal.isEmpty(the[_containerEl])) {
            the[_fixContainer]();
            return ev.preventDefault();
        }

        if (isInitialState(the[_containerEl])) {
            return ev.preventDefault();
        }
    });

    event.on(the[_containerEl], 'keydown', the[_onKeydownListener] = function (ev) {
        the[_rangerManager].change();
    });

    event.on(the[_containerEl], 'paste', the[_onPasteListener] = function (ev) {
        if (the[_pastingContainerEl]) {
            return false;
        }

        var image = clipboard.image(ev);

        if (image) {
            the.emit('pasteImage', image, function (meta) {
                if (typeis.String(meta)) {
                    meta = {url: meta};
                }

                var imgEl = modification.create('img', {
                    src: meta.url,
                    alt: meta.alt || '',
                    width: meta.width || 'auto',
                    height: meta.height || 'auto'
                });
                the.insertNode(imgEl);
            });
            return false;
        }

        the[_pastingContainerEl] = createPastingContainerEl();
        the[_pastingContainerEl].focus();
        time.nextTick(function () {
            clean(the[_pastingContainerEl], options.allowTags, options.allowAttrs, true);
            var pastingNodes = array.from(the[_pastingContainerEl].childNodes);

            array.each(pastingNodes, function (index, node) {
                the[_rangerManager].insertNode(node);
                return false;
            });

            the.focus();
            modification.remove(the[_pastingContainerEl]);
            the[_pastingContainerEl] = null;
        });
    });

    event.on(the[_containerEl], 'mousedown', 'img', the[_onMousedownListener] = function (ev) {
        the[_rangerManager].wrapNode(this);
        return false;
    });

    the[_rangerManager].on('selectionChanged', function () {
        array.each(the[_buttons], function (index, btn) {
            btn.update();
        });
    });
};

/**
 * 修正容器
 */
pro[_fixContainer] = function () {
    var the = this;
    var childNodes = the[_containerEl].childNodes;

    if (!childNodes.length) {
        the[_containerEl].innerHTML = '<p><br></p>';
    }
};

/**
 * 增加按钮
 * @param button
 */
pro[_pushButtons] = function (button) {
    var the = this;

    the[_buttons].push(button);
    button.on('action', function (cmd) {
        var type = typeis(cmd);

        switch (type) {
            case 'function':
                cmd.call(the);
                break;

            case 'string':
                if (typeis.Function(the[cmd])) {
                    the[cmd].call(the);
                }
                break;
        }
    });
};


Editable.defaults = defaults;
Editable.mac = Hotkey.mac;
module.exports = Editable;

// ===============================================


function nativeExec(command) {
    return function () {
        var the = this;

        the[_rangerManager].focus();
        nativeCommand(command);

        return the;
    }
}

/**
 * 是否为初始状态
 * @param containerEl
 * @returns {boolean}
 */
function isInitialState(containerEl) {
    var childNodes = containerEl.childNodes;

    if (childNodes.length > 1) {
        return false;
    }

    var childNode = childNodes[0];
    var childChildNodes = childNode.childNodes;

    return childChildNodes.length === 1 && childChildNodes[0].nodeName === 'BR';
}

/**
 * 创建用于当前复制粘贴所有的元素
 * @returns {div}
 */
function createPastingContainerEl() {
    var el = modification.create('div', {
        contenteditable: true,
        tabindex: -1,
        style: {
            position: 'fixed',
            opacity: 0,
            width: 1,
            height: 20
        }
    });
    modification.insert(el);
    return el;
}


