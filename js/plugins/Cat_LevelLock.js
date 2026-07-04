//=============================================================================
// RPG Maker MV - Cat-限制等级
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<限制等级>
 * @author Cat
 * 
 * @param maxLevel
 * @text 等级上限
 * @type number
 * @desc 默认等级上限（默认上限：99级）
 * @default 99
 * 
 * @command ChangeActorMaxLevel
 * @text 修改指定角色等级上限
 * @desc 修改指定角色等级上限
 *
 * @arg actorId
 * @type number
 * @min 1
 * @max 9999
 * @default 1
 * @text 角色ID号
 * @desc 角色ID号设置
 *
 * @arg maxLevel
 * @type number
 * @min 1
 * @max 9999
 * @default 1
 * @text 等级上限
 * @desc 等级上限（最小为1）
 * 
 * @help
 * ------------------------------插件命令--------------------------------
 * 
 * 自定义角色等级上限 插件命令：ChangeActorMaxLevel （可指定角色等级）
 * 范例：插件指令中选择  角色ID = X  等级上限 = X   
 * 
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_LevelLock = true;

var Cat = Cat || {};
Cat.LevelLock = {};
Cat.LevelLock.parameters = PluginManager.parameters('Cat_LevelLock');
Cat.LevelLock.maxLevel = Number(Cat.LevelLock.parameters['maxLevel'] || 99);

PluginManager.registerCommand('Cat_LevelLock', 'ChangeActorMaxLevel', args => {
    //  console.log(Number(args.actorId), Number(args.maxLevel))
    $gameTemp.ChangeActorMaxLevel(Number(args.actorId), Number(args.maxLevel));
});

Game_Temp.prototype.ChangeActorMaxLevel = function (actorId, maxLevel) {
    $gameActors.actor(actorId)._maxLevel = maxLevel;
};
Cat.LevelLockGame_Actor_initMembers = Game_Actor.prototype.initMembers
Game_Actor.prototype.initMembers = function () {
    Cat.LevelLockGame_Actor_initMembers.call(this);
    this._maxLevel = Cat.LevelLock.maxLevel;
};
Game_Actor.prototype.maxLevel = function () {
    if (this._maxLevel) {
        return this._maxLevel;
    }
    else {
        return Cat.LevelLock.maxLevel;
    }
};