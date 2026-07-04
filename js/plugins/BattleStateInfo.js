//=============================================================================
// RPG Maker MZ - BattleStateInfo
//=============================================================================

/*:
 * @target MZ
 * @plugindesc BattleStateInfo
 * @author Admin
  * 
 * @param ww
 * @text 显示窗口宽度
 * @type string
 * @default 300
 * 
 * @param wh
 * @text 显示窗口高度
 * @type string
 * @default 200
 * 
 * @help
 * 状态备注：
 * <状态简介:\I[10]状态:\C[10]xxx\n\C[3]xxxx\n\C[10]xxx>
 */

'use strict';
var Imported = Imported || {};
Imported.BattleStateInfo = true;

var Admin = Admin || {};
Admin.BattleStateInfo = {};
Admin.BattleStateInfo.parameters = PluginManager.parameters('BattleStateInfo');
Admin.BattleStateInfo.ww = Number(Admin.BattleStateInfo.parameters['ww']) || 300;
Admin.BattleStateInfo.wh = Number(Admin.BattleStateInfo.parameters['wh']) || 200;

const DeBuffText = [
    '弱化生命',//生命强化 id:0
    '弱化灵力',//魔法强化 id:1
    '弱化通常攻击',//攻击强化 id:2
    '弱化通常防御',//防御强化 id:3
    '弱化法术攻击',//魔法攻击强化 id:4
    '弱化法术防御',//魔法防御强化 id:5
    '弱化身法速度',//敏捷强化 id:6
    '弱化悟性'//幸运强化 id:7
];

const BuffText = [
    '强化生命',//生命强化 id:0
    '强化灵力',//魔法强化 id:1
    '强化通常攻击',//攻击强化 id:2
    '强化通常防御',//防御强化 id:3
    '强化法术攻击',//魔法攻击强化 id:4
    '强化法术防御',//魔法防御强化 id:5
    '强化身法速度',//敏捷强化 id:6
    '强化悟性'//幸运强化 id:7
];

Admin.BattleStateInfo.Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function () {
    Admin.BattleStateInfo.Scene_Battle_create.call(this);
    this.createBuffInfoWindow();
};

Scene_Battle.prototype.createBuffInfoWindow = function () {
    const rect = this.infoBuffWindowRect();
    this._infoBuffWindow = new Window_AdminStateInfo(rect);
    this.addChild(this._infoBuffWindow);
};

Scene_Battle.prototype.infoBuffWindowRect = function () {
    const ww = Admin.BattleStateInfo.ww;
    const wh = Admin.BattleStateInfo.wh;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_AdminStateInfo() {
    this.initialize(...arguments);
}

Window_AdminStateInfo.prototype = Object.create(Window_Base.prototype);
Window_AdminStateInfo.prototype.constructor = Window_AdminStateInfo;

Window_AdminStateInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.hide();
    this.opacity = 144;
    this._text = '';
};

Window_AdminStateInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._text) {
        this.refresh();
    } else {
        this.hide();
    }
};

Window_AdminStateInfo.prototype.setText = function (text) {
    this._text = text;
};

Window_AdminStateInfo.prototype.refresh = function () {
    this.createContents();
    if (this._text) {
        var text = this._text;
        this.drawTextEx(text, 10, -4, this.width);
        this.show();
    }
};

Window_AdminStateInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.contents.fontSize = 14;
};

function Sprite_AdminStateInfo() {
    this.initialize(...arguments);
}
Sprite_AdminStateInfo.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_AdminStateInfo.prototype.constructor = Sprite_AdminStateInfo;

Sprite_AdminStateInfo.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

Sprite_AdminStateInfo.prototype.initMembers = function () {
    this._clickHandler = null;
    this._pressCounts = 0;
    this._type = -1;
    this._name = '';
    this._stateId = 0;
    this.opacity = 255;
    this._ofx = 0;
    this._ofy = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_AdminStateInfo.prototype.setPosXy = function (x, y) {
    this._ofx = x;
    this._ofy = y;
};

Sprite_AdminStateInfo.prototype.createBitmap = function () {
    this._valueSprite = new Sprite();
    this.addChild(this._valueSprite);
    this._valueSprite.y = -22;
    this._valueSprite.x = -10;
    const width = 50;
    const height = 50;
    this._valueBitmap = new Bitmap(width, height);
    this._valueBitmap.fontSize = 14;
    this._valueBitmap.textColor = ColorManager.textColor(0);
    this._valueBitmap.outlineColor = ColorManager.textColor(15);
    this._valueBitmap.outlineWidth = 4;
};

Sprite_AdminStateInfo.prototype.updateIconFrame = function () {
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (this._stateIconIndex % 16) * pw;
    const sy = Math.floor(this._stateIconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_AdminStateInfo.prototype.setObject = function (state, type, turn, buffIndex) {
    this._type = type;
    this._stateIconIndex = 0;
    this._state = state;
    // console.log(this._type, this._state)
    this._buffTurn = turn;
    this._buffIndex = buffIndex;
    if (this._type == 0) {
        this._stateIconIndex = state.iconIndex || 0;
    } else {
        if (this._state >= 1) {
            this._stateIconIndex = 32 + buffIndex;
        } else {
            this._stateIconIndex = 48 + buffIndex;
        }
    }
    this.bitmap = ImageManager.loadSystem("IconSet");
    this.updateIconFrame();
    this.refresh();
};

Sprite_AdminStateInfo.prototype.refresh = function () {
    if (this._valueBitmap) this._valueBitmap.clear();
    if (this._type == 0) {
        const states = this._state;
        if (states.autoRemovalTiming == 0 || !this._buffTurn) {
            var turnCounts = '';
        } else {
            var turnCounts = this._buffTurn;
        }
        this._valueBitmap.drawText(turnCounts, -30, 6, 50, 50, 'right');
        this._valueBitmap.addLoadListener(this.BitmapLoad.bind(this));
    } else {
        var turnCounts = this._buffTurn ? this._buffTurn : '';
        this._valueBitmap.drawText(turnCounts, -30, 6, 50, 50, 'right');
        this._valueBitmap.addLoadListener(this.BitmapLoad.bind(this));
    }

};

Sprite_AdminStateInfo.prototype.BitmapLoad = function () {
    if (this._valueBitmap.isReady()) {
        this._valueSprite.bitmap = this._valueBitmap;
    }
};

Sprite_AdminStateInfo.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (this._valueSprite.bitmap) {
        this.refresh();
    }
};

Sprite_AdminStateInfo.prototype.onClick = function () {
    SoundManager.playOk()
    if (this._clickHandler) {
        this._clickHandler();
    }

};

Sprite_AdminStateInfo.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Sprite_AdminStateInfo.prototype.onMouseEnter = function () {
    //  SoundManager.playCursor();
    this._colorTone = [50, 50, 50, 0]
    this._updateColorFilter();
    var text = '无内容';
    if (this._type == 0) {
        const states = this._state;
        if (states.meta.状态简介) {
            var text = states.meta.状态简介;
            var text = text.replace(/\\n/g, "\n")
        }
    } else {
        if (this._state == 1) {
            var text = BuffText[this._buffIndex];
        } else {
            var text = DeBuffText[this._buffIndex];
        }
    }
    //const ofx = this._ofx;
    //const ofy = this._ofy;
    //console.log(this._ofx, this._ofy, this.x, this.y)
    const ww = SceneManager._scene._infoBuffWindow.width;
    const wh = SceneManager._scene._infoBuffWindow.height;
    var x = TouchInput.x;
    var y = TouchInput.y;
    if (x + ww > 1280) {
        var x = 1280 - ww;
    }
    if (x - ww < 0) {
        var x = 0;
    }
    if (y + wh > 720) {
        var y = 720 - wh - 50;
    }
    if (y - wh < 0) {
        var y = 120;
    }
    SceneManager._scene._infoBuffWindow.x = x;
    SceneManager._scene._infoBuffWindow.y = y;
    SceneManager._scene._infoBuffWindow.setText(text);

};

Sprite_AdminStateInfo.prototype.onMouseExit = function () {
    SceneManager._scene._infoBuffWindow.setText(null);
    this._colorTone = [0, 0, 0, 0];
    this._updateColorFilter();
};

Admin.BattleStateInfo.Sprite_Enemy_createStateIconSprite = Sprite_Enemy.prototype.createStateIconSprite;
Sprite_Enemy.prototype.createStateIconSprite = function () {
    Admin.BattleStateInfo.Sprite_Enemy_createStateIconSprite.call(this);
    this._stateIconSprite._tempEnemy = this;
};

Sprite_BattleActorInfo.prototype.createStateOverlay = function () {
    this._stateSprite = new Sprite_StateIcon();
    this.addChild(this._stateSprite);
    this._stateSprite.scale.set(1)
    this._stateSprite.x = 50;
    this._stateSprite.y = 41;
};

Admin.BattleStateInfo.Sprite_StateIcon_initMembers = Sprite_StateIcon.prototype.initMembers;
Sprite_StateIcon.prototype.initMembers = function () {
    Admin.BattleStateInfo.Sprite_StateIcon_initMembers.call(this);
    this._catStateIcons = [];
};

// Admin.BattleStateInfo.Sprite_StateIcon_loadBitmap = Sprite_StateIcon.prototype.loadBitmap;
// Sprite_StateIcon.prototype.loadBitmap = function () {
//     if (this._battler instanceof Game_Enemy) {

//     } else {
//         Admin.BattleStateInfo.Sprite_StateIcon_loadBitmap.call(this);
//     }
// };

Sprite_StateIcon.prototype.getAllState = function () {
    const data = this._battler.states();
    const list = [];
    for (const state of data) {
        if (state && state.iconIndex > 0) {
            list.push(state);
        }
    }
    return list;
};

Sprite_StateIcon.prototype.getAllBuff = function () {
    const data = this._battler._buffs;
    const data_1 = this._battler._buffTurns;
    var count = 0;
    const list = [];
    const turnList = [];
    const buffIndex = [];
    for (const state of data) {
        if (state != 0) {
            list.push(state);
            turnList.push(data_1[count]);
            buffIndex.push(count);
        }
        count++
    }
    return [list, turnList, buffIndex]
};

Sprite_StateIcon.prototype.update = function () {
    Sprite.prototype.update.call(this);
    //  if (this._battler instanceof Game_Enemy) {
    if (this._battler) {
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            for (let i = 0; i < this._catStateIcons.length; i++) {
                this.removeChild(this._catStateIcons[i]);
            };
            if (this._battler.allIcons().length == 0) { return };
            var w = ImageManager.iconWidth;
            var m = Math.min(Math.max(this._battler.allIcons().length, 0), 8);
            const stateList = this.getAllState();
            const buffList = this.getAllBuff()[0];
            const buffTurn = this.getAllBuff()[1];
            const buffIndex = this.getAllBuff()[2];
            for (let i = 0; i < m; i++) {
                this._catStateIcons[i] = new Sprite_AdminStateInfo();
                if (i < stateList.length) {
                    this._catStateIcons[i].setObject(stateList[i], 0, this._battler._stateTurns[stateList[i].id]);
                } else {
                    this._catStateIcons[i].setObject(buffList[i - stateList.length], 1, buffTurn[i - stateList.length], buffIndex[i - stateList.length]);
                }
                if (this._battler instanceof Game_Enemy) {
                    this._catStateIcons[i].x = (w + 6) * i - 40;
                    this._catStateIcons[i].y = -32;
                } else {
                    this._catStateIcons[i].x = (w + 6) * i;
                    this._catStateIcons[i].y = 40;
                }
                this.addChild(this._catStateIcons[i]);
            }
            this._animationCount = 0;
        }
    };
    // } else {
    //     this._animationCount++;
    //     if (this._animationCount >= this.animationWait()) {
    //         this.updateIcon();
    //         this.updateFrame();
    //         this._animationCount = 0;
    //     }
    // }
};