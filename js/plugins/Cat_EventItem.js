//=============================================================================
// RPG Maker MZ - EventItem
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<自定义事件物品选择>
 * @base Cat_Children_X.js
 * @author Cat
 *
 * @help
 * 物品自定义备注：
 * 范例：
 * 物品备注<蓝月虫>
 * 第一步：脚本写：$gameTemp._catItemCustom = '蓝月虫';
 * 第二步：事件打开选择物品
 * 第三步：脚本写：$gameTemp._catItemCustom = null;
 * 第四步：判断该物品，执行相应操作
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_EventItem = true;

var Cat = Cat || {};
Cat.EventItem = {};
Cat.EventItem.parameters = PluginManager.parameters('Cat_EventItem');

Window_EventItem.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if ($gameTemp._catItem) {
        this._data = $gameParty.allItems().filter(item => this.includes(item) && item.meta.赠送孩子);
    }
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_EventItem.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if ($gameTemp._catItem) {
        this._data = $gameParty.allItems().filter(item => this.includes(item) && item.meta.赠送孩子);
    } else if ($gameTemp._catItemCustom) {
        const meta = 'item.meta.' + $gameTemp._catItemCustom;
        this._data = $gameParty.allItems().filter(item => this.includes(item) && meta);
    }
    if (this.includes(null)) {
        this._data.push(null);
    }
};