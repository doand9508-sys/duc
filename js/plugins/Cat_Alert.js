//=============================================================================
// RPG Maker MZ - 自定义提示系统
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<自定义提示系统>
 * @author Cat
 * 
 * @command showAlert
 * @text 显示提示
 * @desc 
 * 
 * @arg id
 * @type number
 * @text 提示窗口ID
 * @desc 提示窗口ID
 * @default
 * 
 * @arg x
 * @type string
 * @text 提示窗口X位置
 * @desc 提示窗口X位置
 * @default 
 * 
 * @arg y
 * @type string
 * @text 提示窗口Y位置
 * @desc 提示窗口Y位置
 * @default
 * 
 * @arg w
 * @type string
 * @text 提示窗口宽度
 * @desc 提示窗口宽度
 * @default 
 * 
 * @arg h
 * @type string
 * @text 提示窗口高度
 * @desc 提示窗口高度
 * @default
 * 
 * @arg text
 * @type note
 * @text 显示内容
 * @desc 显示内容
 * @default 
 * 
 * @arg time
 * @type string
 * @text 显示时间(秒)
 * @desc 显示时间(秒)
 * @default 
 * 
 * @arg move
 * @type select
 * @text 移动模式
 * @desc 移动模式
 * @option 不移动
 * @value -1
 * @option 向上
 * @value 0
 * @option 向下
 * @value 1
 * @option 向左
 * @value 2
 * @option 向右
 * @value 3
 * @default -1
 * 
 * @arg moveTime
 * @type string
 * @text 移动时间(秒)
 * @desc 移动时间(秒)
 * @default 0
 * 
 * @arg moveValue
 * @type string
 * @text 移动距离
 * @desc 移动距离
 * @default 0
 * 
 * @arg endType
 * @type select
 * @text 消失模式
 * @desc 消失模式
 * @option 直接消失
 * @value 0
 * @option 逐渐消失
 * @value 1
 * @default 0
 * 
 * @arg endTime
 * @type string
 * @text 消失时间(秒)
 * @desc 消失时间(秒)
 * @default 0.5
 * 
 * @help
 * 
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_ = true;

var Cat = Cat || {};
Cat.Alert = {};
Cat.Alert.parameters = PluginManager.parameters('Cat_Alert');

PluginManager.registerCommand('Cat_Alert', 'showAlert', args => {
    const id = Number(args.id);
    const x = Number(args.x);
    const y = Number(args.y);
    const time = Number(args.time);
    const w = Number(args.w);
    const h = Number(args.h);
    const text = String(args.text);
    const move = Number(args.move);
    const moveTime = Number(args.moveTime);
    const moveValue = Number(args.moveValue);
    const endType = Number(args.endType);
    const endTime = Number(args.endTime);
    if (!$gameSystem._alertData) {
        $gameSystem._alertData = [];
    };
    if (!$gameSystem._alertData[id]) {
        $gameSystem._alertData[id] = [];
    };
    if ($gameSystem._alertData[id].length > 0) {
        return;
    }
    SceneManager._scene.createAlertWindow(id, x, y, time, w, h, text, false, move, moveTime, moveValue, endType, endTime);
});

Cat.Alert.Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function () {
    if ($gameSystem._alertData) {
        for (let i = 0; i < $gameSystem._alertData.length; i++) {
            if ($gameSystem._alertData[i]) {
                for (let s = 0; s < this.children; s++) {
                    if (this.children[s] instanceof Window_Alert && this.children[s].id == i) {
                        var window = this.children[s];
                        $gameSystem._alertData[i][1] = window.x;
                        $gameSystem._alertData[i][2] = window.y;
                        $gameSystem._alertData[i][3] = window.time;
                        $gameSystem._alertData[i][8] = window.start;
                        $gameSystem._alertData[i][9] = window.moveType;
                        $gameSystem._alertData[i][10] = window.moveTime;
                        $gameSystem._alertData[i][11] = window.moveValue;
                        $gameSystem._alertData[i][12] = window.endType;
                        $gameSystem._alertData[i][13] = window.endTime;
                    }
                }

            }
        };
    }
    Cat.Alert.Scene_Map_terminate.call(this);
};

Cat.Alert.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function () {
    Cat.Alert.Scene_Map_createAllWindows.call(this);
    if ($gameSystem._alertData) {
        for (let i = 0; i < $gameSystem._alertData.length; i++) {
            if ($gameSystem._alertData[i]) {
                const data = $gameSystem._alertData[i];
                this.createAlertWindow(data[0], data[1], data[2], data[3],
                    data[4], data[5], data[6], data[8], data[9], data[10],
                    data[11], data[12], data[13]);
            }
        };
    }
};

Scene_Map.prototype.createAlertWindow = function (id, x, y, time, w, h, text, type, move, moveTime, moveValue, endType, endTime) {
    const wx = x;
    const wy = y;
    const ww = w;
    const wh = h;
    const rect = new Rectangle(wx, wy, ww, wh);;
    const window = new Window_Alert(rect);
    window.id = id;
    window.time = time;
    window.text = text;
    window.moveType = move;
    window.moveTime = moveTime;
    window.moveValue = moveValue;
    window.moveEnd = false;
    window.endType = endType;
    window.endTime = endTime;
    window.alpha = 1;
    $gameSystem._alertData[id] = [id, x, y, time, w, h, text, null, type, move, moveTime, moveValue, endType, endTime];
    this.addChild(window);
};

function Window_Alert() {
    this.initialize(...arguments);
}

Window_Alert.prototype = Object.create(Window_Base.prototype);
Window_Alert.prototype.constructor = Window_Alert;

Window_Alert.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.id = -1;
    this.time = 0;
    this.text = '';
    this.start = false;
    this.counts = 0;
    this.moveCounts = 0;
    this.moveType = -1;
    this.moveTime = 0;
    this.moveValue = 0;
    this.moveEnd = false;
    this.endType = 0;
    this.endTime = 0;
    this.alpha = 1;
    this.endAlpha = false;
};

Window_Alert.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this.text) {
        this.start = true;
    };
    if (this.start) {
        this.createContents();
        this.drawTextEx(eval(this.text), 0, 0, this.width);
        if (this.moveType == 0) {
            const moveY = this.moveValue;
            const speed = moveY / (this.moveTime * 60);
            if (this.y > moveY) {
                this.y -= speed;
            } else {
                this.y = moveY;
                this.moveEnd = true;
            };
        } else if (this.moveType == 1) {
            const moveY = this.moveValue;
            const speed = moveY / (this.moveTime * 60);
            if (this.y < moveY) {
                this.y += speed;
            } else {
                this.y = moveY;
                this.moveEnd = true;
            };
        } else if (this.moveType == 2) {
            const moveX = this.moveValue;
            const speed = moveX / (this.moveTime * 60);
            if (this.x > moveX) {
                this.x -= speed;
            } else {
                this.x = moveX;
                this.moveEnd = true;
            };
        } else if (this.moveType == 3) {
            const moveX = this.moveValue;
            const speed = moveX / (this.moveTime * 60);
            if (this.x < moveX) {
                this.x += speed;
            } else {
                this.x = moveX;
                this.moveEnd = true;
            };
        } else {
            this.moveEnd = true;
        };
        if (this.moveEnd) {
            this.counts++;
            if (this.counts == 60 && !this.endAlpha) {
                this.counts = 0;
                this.time--;
                if (this.time <= 0) {
                    if (this.endType == 0) {
                        $gameSystem._alertData[this.id] = null;
                        SceneManager._scene.removeChild(this);
                        this.start = false;
                    } else if (this.endType == 1) {
                        this.endAlpha = true;
                    };
                };
            } else if (this.endAlpha) {
                const speed = 1 / (this.endTime * 60);
                this.alpha -= speed;
                if (this.alpha <= 0) {
                    $gameSystem._alertData[this.id] = null;
                    SceneManager._scene.removeChild(this);
                    this.endAlpha = false;
                    this.start = false;
                }
            }
        };
    };
};