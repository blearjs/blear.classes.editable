/**
 * node
 * @author ydr.me
 * @create 2017-11-29 13:38
 * @update 2017-11-29 13:38
 */


'use strict';

exports.isEmpty = isEmpty;
exports.getLastChildNode = getLastChildNode;
exports.getNodeLength = getNodeLength;

// ==================================

/**
 * 判断是否为空节点
 * @param node
 * @returns {boolean}
 */
function isEmpty(node) {
    return node.childNodes.length === 0;
}


/**
 * 获取最后一个子节点
 * @param node
 * @returns {*}
 */
function getLastChildNode(node) {
    var childNodes = node.childNodes;
    return childNodes[childNodes.length - 1];
}


/**
 * 获取节点长度
 * @param node
 * @returns {number}
 */
function getNodeLength(node) {
    switch (node.nodeType) {
        case 7:
        case 10:
            return 0;
        // 文本和注释
        case 3:
        case 8:
            return node.length;
        // 节点
        default:
            return node.childNodes.length;
    }
}
