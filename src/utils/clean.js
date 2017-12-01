/**
 * clean
 * @author ydr.me
 * @create 2017-11-29 17:49
 * @update 2017-11-29 17:49
 */


'use strict';

var modfication = require('blear.core.modification');
var attribute = require('blear.core.attribute');

var nodal = require('./nodal');
var detachFor = nodal.detachFor;

var dataRE = /^data-[.]+/;


module.exports = cleanNode;


// ===========================
/**
 * 清理节点
 * @param node
 * @param allowTags
 * @param allowAttrs
 * @param allowData
 */
function cleanNode(node, allowTags, allowAttrs, allowData) {
    var work = function (node) {
        var childNodes = node.childNodes;

        detachFor(childNodes, function (i, childNode) {
            var childNodeType = childNode.nodeType;

            if (childNodeType === 1) {
                var attrs = childNode.attributes;
                var childNodeName = childNode.nodeName.toLowerCase();

                detachFor(attrs, function (j, attr) {
                    var attrName = attr.name;

                    if (attrName === 'style' || allowData && dataRE.test(attrName)) {
                        return;
                    }

                    var safeAttrs = allowAttrs[childNodeName] || [];

                    // 不存在的属性，删除
                    if (safeAttrs.indexOf(attrName) < 0) {
                        attribute.removeAttr(childNode, attrName);
                        return false;
                    }
                });

                work(childNode);
            } else if (childNodeType !== 3) {
                modfication.remove(childNode);
                return false;
            }
        });
    };

    work(node);
}


