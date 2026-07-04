//=============================================================================
// RPG Maker MZ - 敌人血条/光标/角色信息框
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<敌人血条/光标/角色信息框>
 * @author Cat
 * 
 * @command showBattleActorInfo
 * @text 显示战斗信息窗口
 * @desc 显示战斗信息窗口
 * 
 * @command hideBattleActorInfo
 * @text 隐藏战斗信息窗口
 * @desc 隐藏战斗信息窗口
 * 
 * @help
 * 敌人备注：
 * <血条偏移:X,Y>
 * <隐藏血条>
 * 插件指令：
 * 显示战斗信息窗口
 * 隐藏战斗信息窗口
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_EnemyHpCursor = true;

var Cat = Cat || {};
Cat.EnemyHpCursor = {};
Cat.EnemyHpCursor.parameters = PluginManager.parameters('Cat_EnemyHpCursor');

PluginManager.registerCommand('Cat_EnemyHpCursor', 'hideBattleActorInfo', args => {
    if ($gameParty.inBattle()) {
        SceneManager._scene.hideActorInfo();
    }
});

PluginManager.registerCommand('Cat_EnemyHpCursor', 'showBattleActorInfo', args => {
    if ($gameParty.inBattle()) {
        SceneManager._scene.showActorInfo();
    }
});

Cat.EnemyHpCursor.BattleManager_processVictory = BattleManager.processVictory;
BattleManager.processVictory = function () {
    SceneManager._scene._closeActorInfo = true;;
    Cat.EnemyHpCursor.BattleManager_processVictory.call(this);
};

Cat.EnemyHpCursor.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    Cat.EnemyHpCursor.Scene_Battle_update.call(this);
    if ((this._actorCommandWindow.visible || this._partyCommandWindow.active) && !SceneManager._scene._closeActorInfo && !$gameMessage.isBusy()) {
        SceneManager._scene.showActorInfo();
    } else {
        SceneManager._scene.hideActorInfo();
    };
};

Cat.EnemyHpCursor.Scene_Battle_commandGuard = Scene_Battle.prototype.commandGuard;
Scene_Battle.prototype.commandGuard = function () {
    this._actorCommandWindow.visible = false;
    Cat.EnemyHpCursor.Scene_Battle_commandGuard.call(this);
};

Cat.EnemyHpCursor.Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function () {
    Cat.EnemyHpCursor.Scene_Battle_create.call(this);
    this._closeActorInfo = false;
    this.createActorInfoSprite();
};

Scene_Battle.prototype.hideActorInfo = function () {
    if (!this._actorInfoSprite) return;
    for (let i = 0; i < this._actorInfoSprite.length; i++) {
        this._actorInfoSprite[i].hide();
    }
};

Scene_Battle.prototype.showActorInfo = function () {
    if (!this._actorInfoSprite) return;
    for (let i = 0; i < this._actorInfoSprite.length; i++) {
        this._actorInfoSprite[i].show();
    }
};

Scene_Battle.prototype.createActorInfoSprite = function () {
    this._actorInfoSprite = [];
    for (let i = 0; i < $gameParty.battleMembers().length; i++) {
        this._actorInfoSprite[i] = new Sprite_BattleActorInfo();
        this.addChild(this._actorInfoSprite[i]);
        this._actorInfoSprite[i].setBattler($gameParty.battleMembers()[i]);
        if (i == 0 && $gameParty.battleMembers().length == 2) {
            // this._actorInfoSprite[i].y = Graphics.height / 2 - 125;
            this._actorInfoSprite[i].x = 0;
        } else {
            //  this._actorInfoSprite[i].y = Graphics.height / 2 + 150;
            this._actorInfoSprite[i].x = 350;
        }
        this._actorInfoSprite[i].y = Graphics.height / 2 + 150;
    };
};

Cat.EnemyHpCursor.Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
Scene_Battle.prototype.createSpriteset = function () {
    Cat.EnemyHpCursor.Scene_Battle_createSpriteset.call(this);
    if (!this._enemyCursorSprite) this.createEnemyCursorSprite();
    this.createEnemyCursor();
}

Scene_Battle.prototype.createEnemyCursorSprite = function () {
    this._enemyCursorSprite = new Sprite();
    this._enemyCursorSprite.z = 10;
    this.addChild(this._enemyCursorSprite);
};

Scene_Battle.prototype.createEnemyCursor = function () {
    this._battleCursorSprite = new Sprite_BattleCursor();
    this._battleCursorSprite.z = 99;
    this._enemyCursorSprite.addChild(this._battleCursorSprite);
    // this._enemyCursorSprite.children.sort(function (a, b) { return a.z - b.z });
}

Cat.EnemyHpCursor.Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
Scene_Battle.prototype.startEnemySelection = function () {
    Cat.EnemyHpCursor.Scene_Battle_startEnemySelection.call(this);
    this.createBattleCusor();
}

Scene_Battle.prototype.createBattleCusor = function () {
    this._battleCursorSprite.clearcursor();
    if (!this._actorWindow || !this._enemyWindow) return;
    if (!this._actorWindow.active && !this._enemyWindow.active) return;
    const ntr = $gameTroop.members().length;
    for (let i = 0; i < ntr; i++) {
        const battler = $gameTroop.members()[i];
        if (battler.isSelected()) {
            this._battleCursorSprite.setcursor(battler);
        }
    }
}

Cat.EnemyHpCursor.Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function () {
    Cat.EnemyHpCursor.Scene_Battle_onEnemyCancel.call(this);
    this._battleCursorSprite.clearcursor();
}

Cat.EnemyHpCursor.Window_BattleEnemy_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function (index) {
    Cat.EnemyHpCursor.Window_BattleEnemy_select.call(this, index);
    SceneManager._scene.createBattleCusor();
};

Cat.EnemyHpCursor.Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection
Scene_Battle.prototype.endCommandSelection = function () {
    Cat.EnemyHpCursor.Scene_Battle_endCommandSelection.call(this);
    this._battleCursorSprite.clearcursor();
};

function Sprite_StateInfo() {
    this.initialize(...arguments);
}

Sprite_StateInfo.prototype = Object.create(Sprite.prototype);
Sprite_StateInfo.prototype.constructor = Sprite_StateInfo;

Sprite_StateInfo.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
    this.createStateSprite();
};

Sprite_StateInfo.prototype.createStateSprite = function () {
    this._stateSprite = [];
    for (let i = 0; i < 7; i++) {
        this._stateSprite[i] = new Sprite();
        this.addChild(this._stateSprite[i]);
        this._stateSprite[i].bitmap = this._bitmap;
        this._stateSprite[i].setFrame(0, 0, 0, 0);
    };
};

Sprite_StateInfo.prototype.setup = function (battler) {
    this._battler = battler;
    this._lastStateLength = 0;
    this._stateList = [];
};

Sprite_StateInfo.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._battler && this._battler.states()) {
        if (this._lastStateLength != this._battler.states().length) {
            this._stateList = [];
            for (let i = 0; i < 7; i++) {
                if (this._battler.states()[i]) {
                    this._stateList.push(this._battler.states()[i].iconIndex);
                }
            };
            this._lastStateLength = this._battler.states().length;
        };
    };
    if (this._stateList && this._battler && this._bitmap && this._bitmap.isReady()) {
        for (let i = 0; i < 7; i++) {
            if (this._stateList[i]) {
                this.updateFrame(this._stateSprite[i], this._stateList[i])
                this._stateSprite[i].x = i * 40;
            } else {
                this._stateSprite[i].setFrame(0, 0, 0, 0);
            }
        };
    };
};

Sprite_StateInfo.prototype.initMembers = function () {
    this._battler = null;
};

Sprite_StateInfo.prototype.loadBitmap = function () {
    this._bitmap = ImageManager.loadSystem("IconSet");
};

Sprite_StateInfo.prototype.updateFrame = function (sprite, iconIndex) {
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    sprite.setFrame(sx, sy, pw, ph);
};

function Sprite_BattleActorInfo() {
    this.initialize.apply(this, arguments);
}

Sprite_BattleActorInfo.prototype = Object.create(Sprite.prototype);
Sprite_BattleActorInfo.prototype.constructor = Sprite_BattleActorInfo;

Sprite_BattleActorInfo.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._actor = null;
    this.createBackSprite();
    this.createNameSprite();
    this.createHpSprite();
    this.createMpSprite();
    this.createTpSprite();
    this.createStateOverlay();
};

Sprite_BattleActorInfo.prototype.createStateOverlay = function () {
    this._stateSprite = new Sprite_StateInfo();
    this.addChild(this._stateSprite);
    this._stateSprite.scale.set(0.6)
    this._stateSprite.x = 46;
    this._stateSprite.y = 50;
};

Sprite_BattleActorInfo.prototype.createBitmap = function (type) {
    const bitmap = new Bitmap(228, 200);
    if (type == 1 || type > 4) {
        if (type > 4) {
            bitmap.fontSize = 20;
        } else {
            bitmap.fontSize = 24;
        }
        bitmap.outlineWidth = 1;
        bitmap.textColor = '#462a39';
    } else {
        bitmap.fontSize = 12;
        bitmap.outlineWidth = 3;
        bitmap.textColor = '#ffffff';
    }
    bitmap.outlineColor = '#462a39';
    return bitmap;
};

Sprite_BattleActorInfo.prototype.setBattler = function (actor) {
    this._actor = actor;
    this._stateSprite.setup(this._actor);
    var nameBitmap = this.createBitmap(1);
    nameBitmap.addLoadListener(this.onBitmapLoad.bind(this, nameBitmap, 1));
    var hpBitmap = this.createBitmap(2);
    hpBitmap.addLoadListener(this.onBitmapLoad.bind(this, hpBitmap, 2));
    var mpBitmap = this.createBitmap(3);
    mpBitmap.addLoadListener(this.onBitmapLoad.bind(this, mpBitmap, 3));
    var tpBitmap = this.createBitmap(4);
    tpBitmap.addLoadListener(this.onBitmapLoad.bind(this, tpBitmap, 4));

    var hpNameBitmap = this.createBitmap(5);
    hpNameBitmap.addLoadListener(this.onBitmapLoad.bind(this, hpNameBitmap, 5));
    var mpNameBitmap = this.createBitmap(6);
    mpNameBitmap.addLoadListener(this.onBitmapLoad.bind(this, mpNameBitmap, 6));
    var tpNameBitmap = this.createBitmap(7);
    tpNameBitmap.addLoadListener(this.onBitmapLoad.bind(this, tpNameBitmap, 7));
};

Sprite_BattleActorInfo.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._actor) {
        const hp = this._actor.hp;
        const mhp = this._actor.mhp;
        const rateHp = hp / mhp;
        this._hpSprite.setFrame(0, 0, 159 * rateHp, 17)
        const mp = this._actor.mp;
        const mmp = this._actor.mmp;
        const rateMp = mp / mmp;
        this._mpSprite.setFrame(0, 0, 159 * rateMp, 17)
        const tp = this._actor.tp;
        const mtp = 100;
        const rateTp = tp / mtp;
        this._tpSprite.setFrame(0, 0, 159 * rateTp, 17);
        if (hp != this._lastHp) {
            this._hpValueSprite.bitmap.clear();
            this._hpValueSprite.bitmap.drawText(this._actor.hp + '/' + this._actor.mhp, 0, 0, 150, 30, "center");
            this._lastHp = hp;
        }
        if (mp != this._lastMp) {
            this._mpValueSprite.bitmap.clear();
            this._mpValueSprite.bitmap.drawText(this._actor.mp + '/' + this._actor.mmp, 0, 1, 150, 30, "center");
            this._lastHp = mp;
        }
        if (tp != this._lastTp) {
            this._tpValueSprite.bitmap.clear();
            this._tpValueSprite.bitmap.drawText(this._actor.tp + '/' + 100, 0, 0, 150, 30, "center");
            this._lastTp = tp;
        };
    };
};

Sprite_BattleActorInfo.prototype.createNameSprite = function () {
    this._nameSprite = new Sprite();
    this.addChild(this._nameSprite);
    this._nameSprite.x = 31;
    this._nameSprite.y = 16;
};

Sprite_BattleActorInfo.prototype.onBitmapLoad = function (bitmap, type) {
    if (bitmap && bitmap.isReady()) {
        if (type == 1) {
            this._nameSprite.bitmap = bitmap;
            this._nameSprite.bitmap.drawText(this._actor._name, 0, 0, 200, 30, "center");
        } else if (type == 2) {
            this._hpValueSprite.bitmap = bitmap;
        } else if (type == 3) {
            this._mpValueSprite.bitmap = bitmap;
        } else if (type == 4) {
            this._tpValueSprite.bitmap = bitmap;
        } else if (type == 5) {
            this._hpNameSprite.bitmap = bitmap;
            this._hpNameSprite.bitmap.drawText('生命：', 0, 0, 200, 30, "left");
        } else if (type == 6) {
            this._mpNameSprite.bitmap = bitmap;
            this._mpNameSprite.bitmap.drawText('灵力：', 0, 0, 200, 30, "left");
        } else if (type == 7) {
            this._tpNameSprite.bitmap = bitmap;
            this._tpNameSprite.bitmap.drawText('怒气：', 0, 0, 200, 30, "left");
        }
    };
};

Sprite_BattleActorInfo.prototype.createBackSprite = function () {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', 'back');
    this.addChild(this._backSprite);
};

Sprite_BattleActorInfo.prototype.createHpSprite = function () {
    this._hpSprite = new Sprite();
    this._hpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', '血条');
    this.addChild(this._hpSprite);
    this._hpSprite.x = 95;
    this._hpSprite.y = 75;
    this._hpValueSprite = new Sprite();
    this.addChild(this._hpValueSprite);
    this._hpValueSprite.x = 95;
    this._hpValueSprite.y = 69;

    this._hpNameSprite = new Sprite();
    this.addChild(this._hpNameSprite);
    this._hpNameSprite.x = 30;
    this._hpNameSprite.y = 68;
};

Sprite_BattleActorInfo.prototype.createMpSprite = function () {
    this._mpSprite = new Sprite();
    this._mpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', '灵力');
    this.addChild(this._mpSprite);
    this._mpSprite.x = 95;
    this._mpSprite.y = 129;
    this._mpValueSprite = new Sprite();
    this.addChild(this._mpValueSprite);
    this._mpValueSprite.x = 95;
    this._mpValueSprite.y = 123;

    this._mpNameSprite = new Sprite();
    this.addChild(this._mpNameSprite);
    this._mpNameSprite.x = 30;
    this._mpNameSprite.y = 121;
};

Sprite_BattleActorInfo.prototype.createTpSprite = function () {
    this._tpSprite = new Sprite();
    this._tpSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', '怒气');
    this.addChild(this._tpSprite);
    this._tpSprite.x = 95;
    this._tpSprite.y = 182;
    this._tpValueSprite = new Sprite();
    this.addChild(this._tpValueSprite);
    this._tpValueSprite.x = 95;
    this._tpValueSprite.y = 176;

    this._tpNameSprite = new Sprite();
    this.addChild(this._tpNameSprite);
    this._tpNameSprite.x = 30;
    this._tpNameSprite.y = 174;
};


function Sprite_BattleCursor() {
    this.initialize.apply(this, arguments);
}

Sprite_BattleCursor.prototype = Object.create(Sprite.prototype);
Sprite_BattleCursor.prototype.constructor = Sprite_BattleCursor;

Sprite_BattleCursor.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.n_usingEnemy = 0;
    this.EnemyCursor = [];
    this.CreateCursor();
}

Sprite_BattleCursor.prototype.CreateCursor = function () {
    for (let i = 0; i < 8; i++) {
        this.EnemyCursor[i] = new Sprite(ImageManager.loadBitmap('img/newUi/battle/', '敌人光标'));
        this.EnemyCursor[i].anchor.x = 0.5;
        this.EnemyCursor[i].anchor.y = 0.5;
        this.EnemyCursor[i].visible = false;
        this.EnemyCursor[i].ymove = -32;
        this.addChild(this.EnemyCursor[i]);
    }
}

Sprite_BattleCursor.prototype.setcursor = function (battler) {
    if (battler.isActor() && !$gameSystem.isSideView()) return;
    var btl = this.EnemyCursor[this.n_usingEnemy];
    const spr = battler._sprite();
    btl.xbase = -5;

    btl.x = battler.x ? battler.x : spr.x;
    btl.x = btl.x + btl.xbase + 10;
    btl.ybase = (battler.y ? battler.y : spr.y) - (battler.height ? battler.height : spr.height);
    btl.y = btl.ybase + btl.ymove - 20;

    btl.visible = true;
    this.n_usingEnemy++;
}

Sprite_BattleCursor.prototype.clearcursor = function () {
    for (let i = 0; i < 8; i++) {
        this.EnemyCursor[i].visible = false;
        this.EnemyCursor[i].ymove = -32;
    }
    this.n_usingEnemy = 0;
};

Sprite_BattleCursor.prototype.update = function () {
    for (let i = 0; i < this.n_usingEnemy; i++) {
        const btl = this.EnemyCursor[i];
        btl.y = btl.ybase + btl.ymove;
        btl.ymove++;
        if (btl.ymove > 0) btl.ymove = -32;
    }
};

Game_Battler.prototype._sprite = function () {
    return BattleManager._spriteset.findTargetSprite(this);
}

Cat.EnemyHpCursor.Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function () {
    Cat.EnemyHpCursor.Sprite_Enemy_update.call(this);
    if (this._enemy) {
        if (this._gaugeOffsetX == undefined) {
            this._gaugeOffsetX = 0;
            this._gaugeOffsetY = 0;
        }
        if (this._enemy.enemy() && this._enemy.enemy().meta.血条偏移) {
            this._gaugeOffsetX = Number(this._enemy.enemy().meta.血条偏移.split(',')[0] || 0);
            this._gaugeOffsetY = Number(this._enemy.enemy().meta.血条偏移.split(',')[1] || 0);
        }
        if (this._enemy.enemy() && this._enemy.enemy().meta.隐藏血条 && this._gaugeSprite) {
            this._gaugeSprite.visible = false;
        }
        this.updateGaugesprite();
    };
};

Sprite_Enemy.prototype.updateGaugesprite = function () {
    if (!this._gaugeSprite) {
        this.createGaugeSprite();
        this._gaugeSprite.setBattler(this._enemy);
    }
    this._gaugeSprite.x = this.x + this._gaugeOffsetX - this.width / 2;
    this._gaugeSprite.y = this.y - this.height + this._gaugeOffsetY;
    this._gaugeSprite.zIndex = 9999;
    this._gaugeSprite.scale.x = this.scale.x;
    this._gaugeSprite.scale.y = this.scale.y;
    this.parent.sortChildren();
    if (this._battler.isDead()) {
        if (this._gaugeSprite.alpha > 0) {
            this._gaugeSprite.alpha -= 0.02;
        }
    } else {
        if (this._gaugeSprite.alpha < 1) {
            this._gaugeSprite.alpha += 0.2;
        }
    }
}

Sprite_Enemy.prototype.createGaugeSprite = function () {
    this._gaugeSprite = new Sprite_actorGauge();
    this._gaugeSprite.anchor.x = 0.5;
    this._gaugeSprite.anchor.y = 1;
    this.parent.addChild(this._gaugeSprite);
};

function Sprite_actorGauge() {
    this.initialize(...arguments);
}

Sprite_actorGauge.prototype = Object.create(Sprite.prototype);
Sprite_actorGauge.prototype.constructor = Sprite_actorGauge;

Sprite_actorGauge.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._gaugeAlpha = 1;
};

Sprite_actorGauge.prototype.setBattler = function (battler) {
    this._battler = battler;
    this.initSubSprites(battler);
};

Sprite_actorGauge.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateShowHide();
};

Sprite_actorGauge.prototype.updateShowHide = function () {
    this.children.forEach((sprite) => {
        sprite.alpha = 1;
    })
}

Sprite_actorGauge.prototype.initSubSprites = function (battler) {
    let x = 0;
    let y = -20
    this._hpSprite = new GaugeSprite(battler, 'hp', x, y);
    this._hpSprite.anchor.x = 0.5;
    this.addChild(this._hpSprite);
};

function GaugeSprite() {
    this.initialize(...arguments);
}

GaugeSprite.prototype = Object.create(Sprite.prototype);
GaugeSprite.prototype.constructor = GaugeSprite;

GaugeSprite.prototype.initialize = function (battler, type, x, y) {
    Sprite.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this._baseX = x;
    this._baseY = y;
    this._battler = battler;
    this._type = type;
    this._oldHp = battler.hp;
    this._currentHp = 0;
    this._blendCount = 10;
    this._blendValue = [255, 255, 255, 255];
    this._damageValue = 10;
    if (this._battler.isActor()) {
        this._baseBlandColor = [200, 0, 0, 255]
    } else {
        this._baseBlandColor = [128, 0, 0, 255]
    }
    this.initBackground();
    this.initGauge();
};

GaugeSprite.prototype.initBackground = function () {
    let bitmap = ImageManager.loadBitmap('img/newUi/battle/', '敌人血条1');
    this._backSprite = new Sprite(bitmap);
    this.addChild(this._backSprite);
};

GaugeSprite.prototype.initGauge = function () {
    this._gaugeBitmap = ImageManager.loadBitmap('img/newUi/battle/', '敌人血条2');;
    this._gaugeBitmap.addLoadListener(this.setGaugeBitmap.bind(this));
};

GaugeSprite.prototype.setGaugeBitmap = function () {
    this._gaugeWidth = this._gaugeBitmap.width;
    this._gaugeHeight = this._gaugeBitmap.height;
    this._gaugeSprite = new Sprite();
    if (this.isHp()) {
        let bitmap = new Bitmap(this._gaugeWidth, this._gaugeHeight);
        bitmap.blt(this._gaugeBitmap, 0, 0, this._gaugeWidth, this._gaugeHeight, 0, 0)
        this._gaugeSprite.bitmap = bitmap;
        if (this._battler.isEnemy()) {
            this.setGaugeGrid();
        }
        this._currentHpSprite = new Sprite(this._gaugeBitmap);
        this._currentHpSprite.setBlendColor(this._baseBlandColor);
        this._currentHpSprite.setFrame(0, 0, 0, this._gaugeHeight);
        this.addChild(this._currentHpSprite);
        this._currentHp = this._battler._hp;
    } else {
        this._gaugeSprite.bitmap = this._gaugeBitmap;
    }
    this._gaugeSprite.setFrame(0, 0, 0, this._gaugeHeight);
    this.addChild(this._gaugeSprite);
};

var mybitmap;
GaugeSprite.prototype.setGaugeGrid = function () {
    mybitmap = this._gaugeBitmap;
    let mhp = this._battler.mhp;
    let grid = Math.ceil(mhp / 500);
    if (grid > 50) grid = 50;
    let maxWidth = this._gaugeWidth - 10
    let width = Math.round(maxWidth / grid);
    let x0 = (this._gaugeWidth - maxWidth) / 2;
    const max = 6;
    for (let j = max - 1; j > 0; j--) {
        this._gaugeSprite._bitmap.paintOpacity = 128 + 64 / (max - j);
        for (let i = 1; i < grid; i++) {
            let x = x0 + width * i;
            let y = max - j;
            this._gaugeSprite._bitmap.fillRect(x, y, 1, 1, '#FFAAAA');
            this._gaugeSprite._bitmap.fillRect(x + 1, y, 1, 1, '#FF0000');
        }
    }
};

GaugeSprite.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.isHp()) {
        this.updateCurrentHp();
    }
    this.updateHp();
};

GaugeSprite.prototype.updateHp = function () {
    if (this._gaugeSprite) {
        let rate = 0;
        if (this.isHp()) {
            rate = this._battler._hp / this._battler.mhp
        } else {
            rate = this._battler._mp / this._battler.mmp
        }
        const width = rate * this._gaugeWidth;
        const height = this._gaugeHeight;
        this._gaugeSprite.setFrame(0, 0, width, height);
    }
}

GaugeSprite.prototype.updateCurrentHp = function () {
    this._hpDifference = this._oldHp - this._battler._hp;
    if (this._oldHp !== this._battler.hp) {
        this._oldHp = this._battler._hp;
        this._blendCount = 10;
        this._blendValue = [255, 255, 255, 255];
        this._damageValue = 10;
    }
    if (this._battler._hp < this._currentHp) {
        if (this._damageValue > 0) {
            let x = Math.randomInt(5) - 2;
            let y = Math.randomInt(5) - 2;
            this.x = this._baseX + x;
            this.y = this._baseY + y;
            this._damageValue--;
        } else {
            this.x = this._baseX;
            this.y = this._baseY;
        }
        let curBlend = eval(this._blendValue.join("+"));
        let baseBlend = eval(this._baseBlandColor.join("+"));
        if (this._blendCount > 0) {
            this._blendCount--
        } else {
            if (curBlend > baseBlend) {
                for (let i = 0; i < 4; i++) {
                    this._blendValue[i] -= (255 - this._baseBlandColor[i]) / 15;
                }
            } else {
                // let step = this._hpDifference / 15;    
                let step = Math.floor((this._currentHp - this._battler._hp) / 20) + 1;
                let newHp = (this._currentHp - step);
                if (newHp < this._battler._hp) newHp = this._battler._hp;
                this._currentHp = newHp;
            }
        }
    } else {
        if (this._currentHp <= this._battler._hp) {
            this._currentHp = this._battler._hp
            this._oldHp = this._battler._hp;
            this._blendCount = 10;
            this._blendValue = [255, 255, 255, 255];
            this._damageValue = 10;
        }
    }
    if (this._currentHpSprite) {
        this._currentHpSprite.setBlendColor(this._blendValue)
        let rate = this._currentHp / this._battler.mhp;
        let width = this._gaugeWidth * rate;
        let height = this._gaugeHeight;
        this._currentHpSprite.setFrame(0, 0, width, height);
    }
}

GaugeSprite.prototype.isHp = function () {
    return this._type === 'hp';
}