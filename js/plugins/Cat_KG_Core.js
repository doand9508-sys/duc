//=============================================================================
// RPG Maker MZ - 快感系统
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<快感系统>
 * @author Cat
 * 
 * @param back
 * @text 变量条背景
 * @desc 变量条背景
 * @require 1
 * @dir img/system/
 * @type file
 *
 * @param img
 * @text 变量条
 * @desc 变量条
 * @require 1
 * @dir img/system/
 * @type file
 * 
 * @command showKg
 * @text 显示快感条
 * @desc 
 * 
 * @arg maxValue
 * @type number
 * @text 完成所需数值
 * @desc 完成所需数值
 * @default 100
 * 
 * @arg id
 * @type variable
 * @text 快感变量
 * @desc 快感变量
 * @default 
 * 
 * @arg x
 * @type string
 * @text 快感条X位置
 * @desc 快感条X位置
 * @default 
 * 
 * @arg y
 * @type string
 * @text 快感条Y位置
 * @desc 快感条Y位置
 * @default 
 * 
 * @arg time
 * @type string
 * @text 限制时间(秒)
 * @desc 限制时间(秒)
 * @default 
 * 
 * @arg success
 * @type common_event
 * @text 成功触发公共事件
 * @desc 成功触发公共事件
 * @default 
 * 
 * @arg lose
 * @type common_event
 * @text 失败触发公共事件
 * @desc 失败触发公共事件
 * @default
 * 
 * @help
 * 一次只能接取一个任务，等到这个任务完成或失败才能领取下一个
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_KG_Core = true;

var Cat = Cat || {};
Cat.KG_Core = {};
Cat.KG_Core.parameters = PluginManager.parameters('Cat_KG_Core');
Cat.KG_Core.back = String(Cat.KG_Core.parameters['back']);
Cat.KG_Core.img = String(Cat.KG_Core.parameters['img']);

PluginManager.registerCommand('Cat_KG_Core', 'showKg', args => {
    const id = Number(args.id);
    const x = Number(args.x);
    const y = Number(args.y);
    const time = Number(args.time);
    const success = Number(args.success);
    const lose = Number(args.lose);
    const maxValue = Number(args.maxValue);
    SceneManager._scene._kgSprite.startKg(id, x, y, time, success, lose, maxValue);
});

Cat.KG_Core.Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function () {
    if (this._kgSprite && this._kgSprite._start) {
        this._kgSprite.saveData();
    }
    Cat.KG_Core.Scene_Map_terminate.call(this);

};

Cat.KG_Core.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
    Cat.KG_Core.Scene_Map_createAllWindows.call(this);
    this.createKgSprite();
};

Scene_Base.prototype.createKgSprite = function () {
    this._kgSprite = new Sprite_KgUi();
    this.addChild(this._kgSprite);
    this._kgSprite.visible = false;
    if ($gameSystem._kgData) {
        this._kgSprite.startKg($gameSystem._kgData[0], $gameSystem._kgData[1],
            $gameSystem._kgData[2], $gameSystem._kgData[3], $gameSystem._kgData[4],
            $gameSystem._kgData[5], $gameSystem._kgData[6]);
    };
};

function Sprite_KgUi() {
    this.initialize(...arguments);
}

Sprite_KgUi.prototype = Object.create(Sprite.prototype);
Sprite_KgUi.prototype.constructor = Sprite_KgUi;

Sprite_KgUi.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_KgUi.prototype.initMembers = function () {
    this.anchor.set(0.5);
    this.x = 640;
    this.y = 360;
    this._start = false;
    this.bitmap = ImageManager.loadBitmap('img/system/', Cat.KG_Core.back);
    this.createValueGauge();
    this._valueSprite = new Sprite();
    this.addChild(this._valueSprite);
    this._valueSprite.x = -196;
    this._valueSprite.y = 0;
    this._counts = 0;
};

Sprite_KgUi.prototype.createValueGauge = function () {
    this._imgSprite = new Sprite();
    this.addChild(this._imgSprite);
    this._imgSprite.x = -185;
    this._imgSprite.y = -8;
    this._imgSprite.bitmap = ImageManager.loadBitmap('img/system/', Cat.KG_Core.img);
    this._imgSprite.setFrame(0, 0, 0, 0);
};

Sprite_KgUi.prototype.startKg = function (id, x, y, time, success, lose, maxValue) {
    this._counts = 0;
    this.x = x;
    this.y = y;
    this._id = Number(id);
    this._time = Number(time);
    this._success = Number(success);
    this._lose = Number(lose);
    this._maxValue = maxValue;
    this._valueBitmap = new Bitmap(this.width, this.height);
    this._valueBitmap.addLoadListener(this.setValueBitmap.bind(this));
    this._imgSprite.setFrame(0, 0, 0, 0);
    this._start = true;
};

Sprite_KgUi.prototype.saveData = function () {
    if (!$gameSystem._kgData) {
        $gameSystem._kgData = [];
    }
    $gameSystem._kgData = [this._id, this.x, this.y, this._time, this._success, this._lose, this._maxValue];
};

Sprite_KgUi.prototype.setValueBitmap = function (bitmap) {
    if (bitmap && bitmap.isReady()) {
        this.setupValueBitmapFont();
        const nowValue = $gameVariables.value(this._id);
        const text = '当前快感值：' + nowValue + '/' + this._maxValue;
        this._valueBitmap.drawText(text, 0, 0, bitmap.width, 30, "left");
        const text1 = "当前剩余时间：" + this._time;
        this._valueBitmap.drawText(text1, 0, 30, bitmap.width, 30, "left");
    };
    this._valueSprite.bitmap = this._valueBitmap;
    this._valueSprite.y = 30;
};

Sprite_KgUi.prototype.setupValueBitmapFont = function () {
    this._valueBitmap.fontFace = $gameSystem.mainFontFace();
    this._valueBitmap.fontSize = 22;
    this._valueBitmap.textColor = ColorManager.textColor(0);
    this._valueBitmap.outlineColor = ColorManager.outlineColor();
    this._valueBitmap.outlineWidth = 3;
};

Sprite_KgUi.prototype.stopKr = function () {
    this._start = false;
    this._imgSprite.setFrame(0, 0, 0, 0);
    this.visible = false;
};

Sprite_KgUi.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._start && this._imgSprite && this._imgSprite.bitmap) {
        this._counts++;
        const width = this._imgSprite.bitmap.width;
        const height = this._imgSprite.bitmap.height;
        const value = $gameVariables.value(this._id);
        const rate = value / this._maxValue;
        this._imgSprite.setFrame(0, 0, Math.floor(width * rate), height);
        if (this._valueBitmap) {
            this._valueBitmap.clear();
            const text = '当前快感值：' + value + '/' + this._maxValue;
            this._valueBitmap.drawText(text, 0, 0, this._valueBitmap.width, 30, "left");
            const text1 = "当前剩余时间：" + this._time + "秒"
            this._valueBitmap.drawText(text1, 0, 30, this._valueBitmap.width, 30, "left");
            this.visible = true;
        }
        if (this._counts >= 60) {
            this._time--;
            if (this._time <= 0) {
                $gameSystem._kgData = null;
                if (value >= this._maxValue) {
                    $gameTemp.reserveCommonEvent(this._success);
                } else {
                    $gameTemp.reserveCommonEvent(this._lose);
                };
                this.stopKr();
            }
            this._counts = 0;
        };
        if (value >= this._maxValue) {
            $gameSystem._kgData = null;
            $gameTemp.reserveCommonEvent(this._success);
            this.stopKr();
        };
    };
};