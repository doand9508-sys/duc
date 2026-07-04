//=============================================================================
// RPG Maker MZ - 钓鱼
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<钓鱼>
 * @author FlyCat
 * 
 * @param fishData
 * @text 鱼设置
 * @type struct<fishData>[]
 * @default
 * 
 * @command openFishScene
 * @text 打开钓鱼界面
 * @desc 打开钓鱼界面
 * 
 * @arg rate
 * @text 垂钓概率
 * @desc 鱼漂漂浮时出现鱼的概率
 * @type number
 * @default 100
 * 
 * @help
 * 第一阶段：鱼自动游走，按下左键可以延长当前方向游走时间，按下右键可以将鱼拉动。
 * 当鱼进阶屏幕右侧时，触发第二阶段，鱼开始向左侧冲刺。
 * 冲刺一段时间后，可以按下右键疯狂拖拽鱼，在规定时间内拖拽到鱼，即为抓到。
 * 没有抓到鱼，鱼将回到第一阶段。
 * 物品备注
 * <鱼竿:20>//20是力道
 * <鱼竿图:XXX>
 * <鱼饵:1,2,3>//使用此等鱼饵会出现的鱼的种类
 * 插件指令：
 * 打开钓鱼界面，并且设置出现鱼的概率
 */

/*~struct~fishData:
@param name
@text 名字
@type string
@default

@param event
@text 触发公共事件
@type common_event
@default 0

@param img
@text 动态图
@require 1
@dir img/newUi/
@type file 

@param id
@text 绑定物品
@type item[] 

@param value
@text 力道(速度)
@type number
@default 10

@param ctime
@text 冲刺时间（帧）
@type number
@default 60

@param time
@text 抓捕时间（帧）
@type number
@default 240
*/

'use strict';
var Imported = Imported || {};
Imported.Cat_FishCore = true;

var Cat = Cat || {};
Cat.FishCore = {};
Cat.FishCore.parameters = PluginManager.parameters('Cat_FishCore');
Cat.FishCore.fishData = JSON.parse(Cat.FishCore.parameters['fishData'] || []);

if (Cat.FishCore.fishData) {
    var data = Cat.FishCore.fishData;
    var max = data.length;
    for (let i = 0; i < max; i++) {
        if (data[i]) {
            data[i] = JSON.parse(data[i]);
            data[i].id = JSON.parse(data[i].id);
        };
    };
};

PluginManager.registerCommand('Cat_FishCore', 'openFishScene', args => {
    $gameSystem._fishRate = Number(args.rate);
    SceneManager.push(Scene_Fish);
});

Cat.FishCore.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && (SceneManager._scene instanceof Scene_FishGame
        || SceneManager._scene instanceof Scene_Fish
        || SceneManager._scene instanceof Scene_FishGame_Start)) {
        this.opacity = 0;
    } else {
        Cat.FishCore.Sprite_Button_updateOpacity.call(this);
    }
};

function Scene_FishGame_Start() {
    this.initialize(...arguments);
}

Scene_FishGame_Start.prototype = Object.create(Scene_MenuBase.prototype);
Scene_FishGame_Start.prototype.constructor = Scene_FishGame_Start;

Scene_FishGame_Start.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._start = false;
};

Scene_FishGame_Start.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createBack();
    this.createFish();
    this.createFisher();
    this.createForGround();
    this.createCommandWindow();
};

Scene_FishGame_Start.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_FishYpCommand(rect);
    this._commandWindow.setHandler('ok', this.onYp.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.activate();
    this._commandWindow.select(0);
};

Scene_FishGame_Start.prototype.commandWindowRect = function () {
    const ww = 500;
    const wh = 300;
    const wx = Graphics.width / 2 - ww / 2 + 30;
    const wy = Graphics.height / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_FishGame_Start.prototype.onYp = function () {
    this._start = true;
    this._commandWindow.deactivate();
    this._commandWindow.hide();
};

Scene_FishGame_Start.prototype.createFish = function () {
    this._fishSprite = new Sprite_FishP();
    this.addChild(this._fishSprite);
    this._fishSprite.hide();
};

Scene_FishGame_Start.prototype.createFisher = function () {
    this._fisherSprite = new Sprite_Fisher();
    this.addChild(this._fisherSprite);
    this._fisherSprite.hide();
    this._fisherSprite.x = 660;
    this._fisherSprite.y = 150;
};

Scene_FishGame_Start.prototype.createBack = function () {
    this._backSprite = new Sprite();
    this.addChild(this._backSprite);
    this._backSprite.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '水面');
    this._backSprite3 = new Sprite();
    this.addChild(this._backSprite3);
    this._backSprite3.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '背景水面');
};

Scene_FishGame_Start.prototype.createForGround = function () {
    this._forSprite = new Sprite();
    this.addChild(this._forSprite);
    this._forSprite.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '背景水面2');
};

SoundManager.playFishSe = function (fileName, value) {
    if (!fileName) return;
    const se = {};
    se.name = fileName;
    se.pitch = value;
    se.volume = 100;
    AudioManager.playSe(se);
};

Scene_FishGame_Start.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._start) {
        if (TouchInput.isTriggered() && !this._fishSprite._move) {
            SoundManager.playFishSe('Laser1', 100)
            if (this.getRectOk()) {
                this._fishx = TouchInput.x;
                this._fishy = TouchInput.y;
                this._fisherSprite.setStart();
            };
        };
        if (this._fisherSprite.end && !this._fishSprite._move) {
            this._fishSprite.x = this._fishx - this._fishSprite.width / 2;
            this._fishSprite.y = this._fishy - this._fishSprite.height;
            this._fishSprite.show();
            this._fishSprite._move = true;
        }
    };
};

Scene_FishGame_Start.prototype.getRectOk = function () {
    // console.log(TouchInput.x, TouchInput.y)
    var rect1 = new Rectangle(0, 382, 545, 338);
    var rect2 = new Rectangle(545, 427, 427, 293);
    var rect3 = new Rectangle(972, 427, 120, 233);
    var rect4 = new Rectangle(1092, 427, 188, 59);
    var rect5 = new Rectangle(1092, 608, 186, 40);
    var rect6 = new Rectangle(1135, 230, 146, 256);
    var rect7 = new Rectangle(852, 266, 281, 61);
    var rect8 = new Rectangle(643, 306, 211, 47);
    var rect9 = new Rectangle(517, 324, 125, 40);
    for (let i = 1; i < 10; i++) {
        if (isPointInsideRect(TouchInput.x, TouchInput.y, eval('rect' + i))) {
            //   console.log('满足条件');
            return true;
        }
    }
    // console.log('不满足条件');
    SoundManager.playBuzzer();
    return false;
};

function isPointInsideRect(x, y, rect) {
    if (rect) {
        return x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height;
    }
}

function isPointInsideRect_X(x, y) {
    if (x < 0 || x > 1280) {
        return false;
    }
    if (y < 0 || y > 720) {
        return false;
    }
    var rect1 = new Rectangle(0, 382, 545, 338);
    var rect2 = new Rectangle(545, 427, 427, 293);
    var rect3 = new Rectangle(972, 427, 120, 233);
    var rect4 = new Rectangle(1092, 427, 188, 59);
    var rect5 = new Rectangle(1092, 608, 186, 40);
    var rect6 = new Rectangle(1135, 230, 146, 485);
    var rect7 = new Rectangle(852, 266, 281, 61);
    var rect8 = new Rectangle(643, 306, 211, 47);
    var rect9 = new Rectangle(517, 324, 125, 40);
    for (let i = 1; i < 10; i++) {
        if (isPointInsideRect(x, y, eval('rect' + i))) {
            return true;
        }
    }
    return false;
}

function Scene_FishGame() {
    this.initialize(...arguments);
}

Scene_FishGame.prototype = Object.create(Scene_MenuBase.prototype);
Scene_FishGame.prototype.constructor = Scene_FishGame;

Scene_FishGame.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    const item = $gameTemp._selectLure.meta.鱼饵.split(',');
    const id = item[Math.floor((Math.random() * item.length))];
    this._fish = Cat.FishCore.fishData[id - 1]
    $gameSystem._gainFish = this._fish;
    // console.log(this._fish.name)
};

Scene_FishGame.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createParallax();
    this.createFish();
    this.createPP();
    this.createForGround();
};

Scene_FishGame.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._parallax && this._fishSpirte) {
        if (this._fishSpirte._right) {
            this._parallax.origin.x += (this._fishSpirte._speed + 4);
            this._forGround.origin.x += this._fishSpirte._speed;
            this._pp.origin.x += this._fishSpirte._speed;
        } else {
            this._parallax.origin.x -= (this._fishSpirte._speed + 4);
            this._forGround.origin.x -= this._fishSpirte._speed;
            this._pp.origin.x -= this._fishSpirte._speed;
        }
        if (this._lineSprite.bitmap && this._lineSprite.bitmap.isReady()) {
            this._lineSprite.bitmap.clear();
            if (this._fishSpirte._state == 8) {
                this._fishSpirte._endLineX += 5;
                this._fishSpirte._endLineY -= 5;
                this._lineSprite.bitmap.drawRadarLines(this._fishSpirte._endLineX + 474, this._fishSpirte._endLineY + 210);
            } else {
                if (this._fishSpirte._right) {
                    this._lineSprite.bitmap.drawRadarLines(this._fishSpirte.x + 474, this._fishSpirte.y + 210);
                } else {
                    this._lineSprite.bitmap.drawRadarLines(this._fishSpirte.x + 50, this._fishSpirte.y + 210);
                }
            }
        }
    }
};

Scene_FishGame.prototype.createFish = function () {
    this._lineSprite = new Sprite();
    this.addChild(this._lineSprite);
    this._lineSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);

    this._fishSpirte = new Sprite_Fish();
    this.addChild(this._fishSpirte);
    this._fishSpirte.x = 500;
    this._fishSpirte.y = 360;
};

Scene_FishGame.prototype.createPP = function () {
    this._pp = new TilingSprite();
    this._pp.move(0, 0, Graphics.width, Graphics.height)
    this.addChild(this._pp);
    this._pp.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '泡泡');
};

Scene_FishGame.prototype.createParallax = function () {
    this._parallax = new TilingSprite();
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._parallax);
    this._parallax.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '底图');
};

Scene_FishGame.prototype.createForGround = function () {
    this._forGround = new TilingSprite();
    this._forGround.move(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._forGround);
    this._forGround.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '海草');

    this._light = new Sprite();
    this.addChild(this._light);
    this._light.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '光');
};


function Scene_Fish() {
    this.initialize(...arguments);
}

Scene_Fish.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Fish.prototype.constructor = Scene_Fish;

Scene_Fish.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    $gameTemp._selectRod = null;
    $gameTemp._selectLure = null;
    this._gainItem = null;
};

Scene_Fish.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createRodListWindow();
    this.createLureListWindow();
    this.createSuccessSprite();
    if ($gameSystem._fishSuccess != undefined) {
        if ($gameSystem._fishSuccess) {
            this._commandWindow.deactivate();
            BattleManager.playVictoryMe()
            const id = $gameSystem._gainFish.id[Math.floor((Math.random() * $gameSystem._gainFish.id.length))];
            const item = $dataItems[id];
            this._gainItem = item;
            $gameParty.gainItem(item, 1);
            this._successSprite.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '胜利');
            this._successSprite.show();
        }
        if ($gameSystem._fishSuccess == false) {
            this._commandWindow.deactivate();
            BattleManager.playDefeatMe();
            this._gainItem = null;
            this._successSprite.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '失败');
            this._successSprite.show();
        };
        this.createCommandWindow_X();
    };

};

Scene_Fish.prototype.createCommandWindow_X = function () {
    const rect = this.commandWindowRect_X();
    this._commandWindow_x = new Window_FishSFCommand(rect);
    this._commandWindow_x.setHandler('ok', this.onSuccessFail.bind(this));
    this.addChild(this._commandWindow_x);
    this._commandWindow_x.activate();
    this._commandWindow_x.select(0);
};

Scene_Fish.prototype.onSuccessFail = function () {
    this._commandWindow_x.deactivate();
    this._commandWindow_x.hide();
    this._commandWindow.activate();
    this._successSprite.hide();
    if ($gameSystem._gainFish.event && $gameSystem._gainFish.event > 0) {
        $gameTemp.reserveCommonEvent($gameSystem._gainFish.event);
        $gameSystem._fishSuccess = null;
        $gameSystem._gainFish = null;
        SceneManager.goto(Scene_Map)
    } else {
        $gameSystem._fishSuccess = null;
        $gameSystem._gainFish = null;
    }
};

Scene_Fish.prototype.commandWindowRect_X = function () {
    const ww = 400;
    const wh = 150;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = Graphics.height / 2 - wh / 2 + 200;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Fish.prototype.createSuccessSprite = function () {
    this._successSprite = new Sprite();
    this._successSprite.anchor.set(0.5);
    this.addChild(this._successSprite);
    this._successSprite.x = Graphics.width / 2;
    this._successSprite.y = Graphics.height / 2;
    this._successSprite.hide();
};

Cat.FishCore.Scene_Fish_createBackground = Scene_Fish.prototype.createBackground;
Scene_Fish.prototype.createBackground = function () {
    Cat.FishCore.Scene_Fish_createBackground.call(this);
    this._backSprite = new Sprite();
    this._backSprite.anchor.set(0.5);
    this._backSprite.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '底框');
    this.addChild(this._backSprite)
    this._backSprite.x = Graphics.width / 2;
    this._backSprite.y = Graphics.height / 2;
};

Scene_Fish.prototype.createRodListWindow = function () {
    const rect = this.rodListWindowRect();
    this._rodListWindow = new Window_RodList(rect);
    this._rodListWindow.setHandler('ok', this.onRod.bind(this));
    this._rodListWindow.setHandler('cancel', this.cancelRod.bind(this));
    this.addChild(this._rodListWindow);
    this._rodListWindow.deactivate();
    this._rodListWindow.hide();
};

Scene_Fish.prototype.rodListWindowRect = function () {
    const ww = 660;
    const wh = 300;
    const wx = Graphics.width / 2 - ww / 2 - 3;
    const wy = Graphics.height / 2 - 270;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Fish.prototype.createLureListWindow = function () {
    const rect = this.lureListWindowRect();
    this._lureListWindow = new Window_LureList(rect);
    this._lureListWindow.setHandler('ok', this.onLure.bind(this));
    this._lureListWindow.setHandler('cancel', this.cancelLure.bind(this));
    this.addChild(this._lureListWindow);
    this._lureListWindow.deactivate();
    this._lureListWindow.hide();
};

Scene_Fish.prototype.onLure = function () {
    if (this._lureListWindow.item()) {
        SoundManager.playEquip();
        $gameTemp._selectLure = this._lureListWindow.item();
        this.cancelLure();
    } else {
        this._lureListWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
};

Scene_Fish.prototype.cancelLure = function () {
    this._commandWindow.activate();
    this._commandWindow.refresh();
    this._lureListWindow.hide();
    this._lureListWindow.deactivate();
};

Scene_Fish.prototype.lureListWindowRect = function () {
    const ww = 660;
    const wh = 300;
    const wx = Graphics.width / 2 - ww / 2 - 3;
    const wy = Graphics.height / 2 - 270;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Fish.prototype.onRod = function () {
    if (this._rodListWindow.item()) {
        SoundManager.playEquip();
        $gameTemp._selectRod = this._rodListWindow.item();
        this.cancelRod();
    } else {
        this._rodListWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
};

Scene_Fish.prototype.cancelRod = function () {
    this._commandWindow.activate();
    this._commandWindow.refresh();
    this._rodListWindow.hide();
    this._rodListWindow.deactivate();
};

Scene_Fish.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._commandWindow && this._rodListWindow && this._lureListWindow) {
        if (this._commandWindow.index() == 0) {
            this._rodListWindow.show();
            this._lureListWindow.hide();
        } else if (this._commandWindow.index() == 1) {
            this._lureListWindow.show();
            this._rodListWindow.hide();
        } else {
            this._rodListWindow.hide();
            this._lureListWindow.hide();
        }
    };
};

Scene_Fish.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_FishCommand(rect);
    this._commandWindow.setHandler('selectRod', this.selectRod.bind(this));
    this._commandWindow.setHandler('selectLure', this.selectLure.bind(this));
    this._commandWindow.setHandler('startFish', this.startFish.bind(this));
    this._commandWindow.setHandler('cancel', this.gotoMap.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.activate();
    this._commandWindow.select(0);
};

Scene_Fish.prototype.gotoMap = function () {
    SceneManager.goto(Scene_Map)
};

Scene_Fish.prototype.selectRod = function () {
    this._commandWindow.deactivate();
    this._rodListWindow.show();
    this._rodListWindow.activate();
    this._rodListWindow.select(0);
};

Scene_Fish.prototype.selectLure = function () {
    this._commandWindow.deactivate();
    this._lureListWindow.show();
    this._lureListWindow.activate();
    this._lureListWindow.select(0);
};

Scene_Fish.prototype.startFish = function () {
    if ($gameTemp._selectRod && $gameTemp._selectLure) {
        $gameSystem._fishSuccess = false;
        $gameParty.loseItem($gameTemp._selectLure, 1);
        SceneManager.push(Scene_FishGame_Start);
    } else {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
};

Scene_Fish.prototype.commandWindowRect = function () {
    const ww = 400;
    const wh = 260;
    const wx = Graphics.width / 2 - ww / 2 + 30;
    const wy = Graphics.height / 2 - wh / 2 + 140;
    return new Rectangle(wx, wy, ww, wh);
};

Bitmap.prototype.drawRadarLines = function (x, y) {
    var context = this._context;
    context.save();
    context.beginPath();
    context.strokeStyle = 'silver';
    context.lineWidth = 2;
    var startX = Graphics.width;
    var startY = 0;
    context.moveTo(startX, startY)
    context.lineTo(x, y)
    context.stroke();
    context.restore();
    //  this.destroy();
};

function Sprite_Fisher() {
    this.initialize(...arguments);
}

Sprite_Fisher.prototype = Object.create(Sprite.prototype);
Sprite_Fisher.prototype.constructor = Sprite_Fisher;

Sprite_Fisher.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._counts = 0;
    this._aniCounts = 0;
    this.setFrame(0, 0, 0, 0);
    this.bitmap = ImageManager.loadBitmap('img/newUi/dy/', $gameTemp._selectRod.meta.鱼竿图 ? $gameTemp._selectRod.meta.鱼竿图 : '鱼竿');
};

Sprite_Fisher.prototype.setStart = function () {
    this.start = true;
    this.setFrame(this._aniCounts * 700, 0, 700, 570);
    this.show();
};

Sprite_Fisher.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.bitmap && this.bitmap.isReady()) {
        if (this.start) {
            this._counts++;
            if (this._counts >= 15) {
                this._aniCounts++;
                this.setFrame(this._aniCounts * 700, 0, 700, 570);
                if (this._aniCounts > 3) {
                    this._aniCounts = 0;
                    this.start = false;
                    this.end = true;
                }
                this._counts = 0;
            };
        } else if (this.end) {
            this.setFrame(3 * 700, 0, 700, 570);
        }
    };
};

function Sprite_FishP() {
    this.initialize(...arguments);
}

Sprite_FishP.prototype = Object.create(Sprite.prototype);
Sprite_FishP.prototype.constructor = Sprite_FishP;

Sprite_FishP.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._move = false;
    this._moving = false;
    this._moveCounts = 0;
    this._endTimeCounts = 0;
    this._counts = 0;
    this._movex = 0;
    this._movey = 0;
    this._aniCounts = 0;
    this._ani = [1, 0, 2, 1];
    this.setFrame(0, 0, 0, 0);
    this.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '鱼漂');
};

Sprite_FishP.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.bitmap && this.bitmap.isReady()) {
        this._counts++;
        if (this._counts >= 15) {
            this._aniCounts++;
            this.setFrame(this._ani[this._aniCounts] * 105, 0, 105, 105);
            if (this._aniCounts >= 3) {
                this._aniCounts = 0;
            }
            this._counts = 0;
        };
        if (this._move) {
            if (!this._moving) {
                this._randomDirection = Math.floor(Math.random() * 9) + 1;
                this._randomDirectionTime = Math.floor(Math.random() * 120) + 60;
                this._speed = 5;
                this._moving = true;
            };
            if (this._moving) {
                this._randomDirectionTime--;
                this._moveCounts++;
                if (this._moveCounts >= 15) {
                    //console.log(this._randomDirection, this._randomDirectionTime, this._endTimeCounts)
                    if (this._randomDirection == 1) {
                        if (isPointInsideRect_X(this.x - this._speed, this.y + this._speed + this.height)) {
                            this.x -= this._speed;
                            this.y += this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 2) {
                        if (isPointInsideRect_X(this.x, this.y + this._speed + this.height)) {
                            this.y += this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 3) {
                        if (isPointInsideRect_X(this.x + this._speed, this.y + this._speed + this.heigh)) {
                            this.x += this._speed
                            this.y += this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 4) {
                        if (isPointInsideRect_X(this.x - this._speed, this.y + this.heigh)) {
                            this.x -= this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 5) {
                        if (isPointInsideRect_X(this.x, this.y + this.heigh)) {

                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 6) {
                        if (isPointInsideRect_X(this.x + this._speed, this.y + this.heigh)) {
                            this.x += this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 7) {
                        if (isPointInsideRect_X(this.x - this._speed, this.y - this._speed + this.heigh)) {
                            this.x -= this._speed
                            this.y -= this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 8) {
                        if (isPointInsideRect_X(this.x, this.y - this._speed + this.heigh)) {
                            this.y -= this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    } else if (this._randomDirection == 9) {
                        if (isPointInsideRect_X(this.x + this._speed, this.y - this._speed + this.heigh)) {
                            this.x += this._speed
                            this.y -= this._speed
                        } else {
                            this._randomDirection = Math.floor(Math.random() * 9) + 1;
                        }
                    };
                    this._moveCounts = 0;
                }
                if (this._randomDirectionTime <= 0) {
                    this._endTimeCounts++;
                    if (this._endTimeCounts >= 5) {
                        $gameSystem._fishSuccess = false;
                        SceneManager.goto(Scene_FishGame);
                    } else {
                        this._randomRate = Math.floor(Math.random() * 100) + 1;
                        if (this._randomRate <= $gameSystem._fishRate) {
                            SceneManager.goto(Scene_FishGame);
                        }
                        this._randomDirectionTime = 0;
                        this._moving = false;
                    }
                }
            }
        }
    }
};

function Sprite_Fish() {
    this.initialize(...arguments);
}

Sprite_Fish.prototype = Object.create(Sprite.prototype);
Sprite_Fish.prototype.constructor = Sprite_Fish;

Sprite_Fish.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._endLineX = 0;
    this._endLineY = 0;
    this._fish = SceneManager._scene._fish;
    this._counts = 0;
    this._aniCounts = 0;
    this._ani = [1, 0, 2, 1];
    this._actorSpeed = Number($gameTemp._selectRod.meta.鱼竿);
    this._speed = Number(this._fish.value);
    this._right = true;
    this._left = false;
    this._state = 0;
    this._randomDirection = 0;
    this._randomDirectionTime = 0;
    this.bitmap = ImageManager.loadBitmap('img/newUi/', this._fish.img);
    this.setFrame(500, 0, 500, 300);
    this._lineSprite = SceneManager._scene._lineSprite;
};

Sprite_Fish.prototype.action = function () {
    const maxy = 370;
    const miny = -140
    const maxx = 860;
    const minx = -200;
    if (this.y <= miny) {
        this.y = miny;
    }
    if (this.y >= maxy) {
        this.y = maxy;
    }
    if (this._state == 0) {
        this._speed = Number(this._fish.value);;
        this._randomDirection = Math.floor(Math.random() * 4) + 1;
        this._randomDirectionTime = Math.floor(Math.random() * 120) + 60;
        this._state = 1;
    };
    if (this._state == 1) {
        if (Input.isTriggered('left')) {
            this._randomDirectionTime += this._actorSpeed;
        } else if (Input.isTriggered('right')) {
            //  this._randomDirectionTime += this._actorSpeed;
            this.x += this._actorSpeed;
            this.y -= 0.5;
        }
        if (this._randomDirectionTime > 0) {
            this._randomDirectionTime--;
            if (this._randomDirection == 1) {
                this.y -= this._speed;
            } else if (this._randomDirection == 2) {
                this.y += this._speed;
            } else if (this._randomDirection == 3) {
                this.x -= this._speed;
                this._right = false;
                this._left = true;
                this.setFrame(this._ani[this._aniCounts] * 500, 300, 500, 300);
            } else if (this._randomDirection == 4) {
                this.x += this._speed;
                this._right = true;
                this._left = false;
                this.setFrame(this._ani[this._aniCounts] * 500, 0, 500, 300);
            }
            if (this.x <= minx) {
                this.x = minx;
                this._randomDirectionTime = 60;
                this._state = 3;
            }
            if (this.x >= maxx) {
                this.x = maxx;
                this._speed = this._speed * 2;
                this._right = false;
                this._left = true;
                this.setFrame(this._ani[this._aniCounts] * 500, 300, 500, 300);
                this._randomDirectionTime = Number(this._fish.time) + Number(this._fish.ctime);
                this._state = 2;
            }
        } else {
            this._randomDirectionTime = 0;
            this._state = 0;
        }
    } else if (this._state == 2) {
        if (Input.isTriggered('right') && this._randomDirectionTime <= Number(this._fish.time)) {
            this.x += (this._actorSpeed * 2);
            // this._right = true;
            // this._left = false;
            // this.setFrame(this._ani[this._aniCounts] * 400, 0, 400, 300);
            if (this.x >= maxx) {
                this.x = maxx;
                this._state = 5;
            };
        } else {
            this.x -= this._speed;
            this._left = true;
            this._right = false;
            this.setFrame(this._ani[this._aniCounts] * 500, 300, 500, 300);
        }
        this._randomDirectionTime--;
        if (this.x <= minx) {
            this.x = minx;
            this._randomDirectionTime = 60;
            this._state = 3;
        } else if (this._randomDirectionTime <= 0) {
            this._state = 4;
            this._randomDirectionTime = 0;
            this._state = 0;
        }
    } else if (this._state == 3) {
        this._randomDirectionTime--;
        this.x--;
        if (this._randomDirectionTime <= 0) {
            //  console.log('鱼跑了！')
            this._randomDirectionTime = 0;
            this._left = true;
            this._right = false;
            this.setFrame(this._ani[this._aniCounts] * 500, 300, 500, 300);
            this._speed = 14;
            this._state = 6;
        }
    } else if (this._state == 5) {
        //  console.log('抓到了！')
        this._right = true;
        this._left = false;
        this.setFrame(this._ani[this._aniCounts] * 500, 0, 500, 300);
        this._speed = 14;
        this._state = 7;
    }
    if (this._state == 7) {
        this.x -= this._speed / 2;
        if (this.x <= 360) {
            this.x = 360;
            this._state = 9;
        }
    };
    if (this._state == 9) {
        this.x += this._speed;
        this.y -= this._speed;
        if (this.x >= maxx) {
            $gameSystem._fishSuccess = true;
            SceneManager.goto(Scene_Fish);
        }
    };
    if (this._state == 6) {
        this.x += this._speed / 2;
        if (this.x >= 360) {
            this.x = 360;
            this._endLineX = this.x;
            this._endLineY = this.y;
            this._state = 8;
        }
    };
    if (this._state == 8) {
        this.x -= this._speed;
        if (this.x <= minx - 300) {
            SceneManager.goto(Scene_Fish);
        }
    };
    //  console.log('状态：', this._state)
};

Sprite_Fish.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.bitmap && this.bitmap.isReady()) {
        this.action();
        this._counts++;
        if (this._counts >= 15) {
            this._aniCounts++;
            if (this._right) {
                //this._aniCounts = 0;
                //  this._lineSprite.scale.x = 1;
                if (this._aniCounts == 2) {
                    this._lineSprite.x = -10;
                    this._lineSprite.y = -24;
                } else if (this._aniCounts == 0) {
                    this._lineSprite.x = 0;
                    this._lineSprite.y = -10;
                } else {
                    this._lineSprite.x = -8;
                    this._lineSprite.y = -6;
                }
                this.setFrame(this._ani[this._aniCounts] * 500, 0, 500, 300);
            } else {
                // this._aniCounts = 0;
                // this._lineSprite.scale.x = -1;
                if (this._aniCounts == 2) {
                    this._lineSprite.x = 0;
                    this._lineSprite.y = -5;
                } else if (this._aniCounts == 0) {
                    this._lineSprite.x = 0;
                    this._lineSprite.y = 0;
                } else {
                    this._lineSprite.x = 0;
                    this._lineSprite.y = -20;
                }
                this.setFrame(this._ani[this._aniCounts] * 500, 300, 500, 300);
            }
            if (this._aniCounts >= 3) {
                // this._lineSprite.x = 0;
                // this._lineSprite.y = 0;
                this._aniCounts = 0;
            }
            this._counts = 0;
        }
    };
};

function Window_FishCommand() {
    this.initialize.apply(this, arguments);
}

Window_FishCommand.prototype = Object.create(Window_Command.prototype);
Window_FishCommand.prototype.constructor = Window_FishCommand;

Window_FishCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/dy/', '条框');
    this.createCursorSprite();
    // this.refresh();
};

Window_FishCommand.prototype.updateLoading = function () {
    if (this._loadBitmap && !this._loadBitmap.isReady()) {
        return false;
    }
    return true;
}

Window_FishCommand.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_FishCommand.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 10;
        const sx = 0;
        const sy = 0;
        const scw = pw;
        const sch = ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_FishCommand.prototype.updateBackOpacity = function () {
    this.backOpacity = 255;
};

Window_FishCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '光标');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_FishCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawCursorBitmap(rect);
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    var text = '';
    if (index == 0) {
        var text = $gameTemp._selectRod ? $gameTemp._selectRod.name : '无';
    } else if (index == 1) {
        var text = $gameTemp._selectLure ? $gameTemp._selectLure.name : '无';
    }
    this.drawText(this.commandName(index) + text, rect.x + 30, rect.y - 2, rect.width, 'left');
};

Window_FishCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        var ofx = 0;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + ofx;
        this._cursorSprites.y = this._cursorSprite.y + 2;
    } else {
        this._cursorSprites.visible = false;
    };
};

Window_FishCommand.prototype.makeCommandList = function () {
    this.addCommand('选择鱼竿：', 'selectRod', true);
    this.addCommand('选择鱼饵：', 'selectLure', true);
    this.addCommand('开始钓鱼', 'startFish', true);
    this.addCommand('返回', 'cancel', true);
};

Window_FishCommand.prototype.maxItems = function () {
    return 4;
};

Window_FishCommand.prototype.numVisibleRows = function () {
    return 4;
};

Window_FishCommand.prototype.maxCols = function () {
    return 1;
};

Window_FishCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_FishCommand.prototype.drawBackgroundRect = function (rect) {
};

function Window_RodList() {
    this.initialize(...arguments);
}

Window_RodList.prototype = Object.create(Window_Selectable.prototype);
Window_RodList.prototype.constructor = Window_RodList;

Window_RodList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/dy/', '条框1');
    this.createCursorSprite();
    this.opacity = 0;
    //  this.refresh();
};

Window_RodList.prototype.updateLoading = function () {
    if (this._loadBitmap && !this._loadBitmap.isReady()) {
        return false;
    }
    return true;
}

Window_RodList.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_RodList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 2;
        const dy = rect.y - 8;
        const sx = 0;
        const sy = 0;
        const scw = pw;
        const sch = ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_RodList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '光标');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_RodList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y;
    } else {
        this._cursorSprites.visible = false;
    };
};

Window_RodList.prototype.item = function () {
    return this._list[this.index()]
};

Window_RodList.prototype.updateBackOpacity = function () {
    this.backOpacity = 255;
};

Window_RodList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const items = $gameParty.items();
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item && item.meta.鱼竿) {
            this._list.push(item);
        }
    };
    this.drawAllItems();
};

Window_RodList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 22;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item.name, rect.x + 48 + 20, rect.y, rect.width, 'left');
        this.drawIcon(item.iconIndex, rect.x + 16 + 20, rect.y + 2);
    };
};

Window_RodList.prototype.maxCols = function () {
    return 3;
};

Window_RodList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_RodList.prototype.numVisibleRows = function () {
    return 5;
};

Window_RodList.prototype.drawBackgroundRect = function (rect) {
};

Window_RodList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

function Window_LureList() {
    this.initialize(...arguments);
}

Window_LureList.prototype = Object.create(Window_RodList.prototype);
Window_LureList.prototype.constructor = Window_LureList;

Window_LureList.prototype.initialize = function (rect) {
    Window_RodList.prototype.initialize.call(this, rect);
};

Window_LureList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const items = $gameParty.items();
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        if (item && item.meta.鱼饵) {
            this._list.push(item);
        }
    };
    this.drawAllItems();
};

Window_LureList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        const number = $gameParty.numItems(item);
        this.drawText(item.name + '(' + number + ')', rect.x + 48 + 20, rect.y, rect.width, 'left');
        this.drawIcon(item.iconIndex, rect.x + 16 + 20, rect.y + 2);
    };
};

function Window_FishYpCommand() {
    this.initialize.apply(this, arguments);
}

Window_FishYpCommand.prototype = Object.create(Window_Command.prototype);
Window_FishYpCommand.prototype.constructor = Window_FishYpCommand;

Window_FishYpCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.createCursorSprite();
};

Window_FishYpCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '光标');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_FishYpCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 108;
        this._cursorSprites.y = this._cursorSprite.y - 4;
    } else {
        this._cursorSprites.visible = false;
    };
};

Window_FishYpCommand.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + 180;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_FishYpCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_FishYpCommand.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    Window_Selectable.prototype.refresh.call(this);
    this.contents.fontSize = 30;
    this.drawText('提示', 0, 0, this.width - 26, 'center');
    this.contents.fontSize = 20;
    this.drawText('1.鼠标点击想要投掷鱼漂的位置就可投掷鱼漂', 0, 30, this.width, 'left');
    this.drawText('2.鱼上钩后按下键盘→可进行拖拽', 0, 60, this.width, 'left');
    this.drawText('3.鱼上钩后按下键盘←可延长当前鱼朝向时间', 0, 90, this.width, 'left');
    this.drawText('4.在规定时间内快速敲击键盘→可成功捕鱼', 0, 120, this.width, 'left');
};

Window_FishYpCommand.prototype.makeCommandList = function () {
    this.addCommand('确定', 'ok', true);
};

Window_FishYpCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_FishYpCommand.prototype.maxCols = function () {
    return 1;
};

Window_FishYpCommand.prototype.maxItems = function () {
    return 1;
};

function Window_FishSFCommand() {
    this.initialize.apply(this, arguments);
}

Window_FishSFCommand.prototype = Object.create(Window_Command.prototype);
Window_FishSFCommand.prototype.constructor = Window_FishSFCommand;

Window_FishSFCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.createCursorSprite();
};

Window_FishSFCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dy/', '光标');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_FishSFCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 110;
        this._cursorSprites.y = this._cursorSprite.y - 2;
    } else {
        this._cursorSprites.visible = false;
    };
};

Window_FishSFCommand.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY() + 80;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_FishSFCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_FishSFCommand.prototype.refresh = function () {
    this.clearCommandList();
    this.makeCommandList();
    Window_Selectable.prototype.refresh.call(this);
    this.contents.fontSize = 30;
    this.drawText('结算', 0, 0, this.width - 26, 'center');
    this.contents.fontSize = 20;
    if ($gameSystem._fishSuccess) {
        const item = SceneManager._scene._gainItem;
        this.drawText('恭喜你成功获得：' + item.name + ' * 1', 0, 40, this.width, 'center');
    } else {
        this.drawText('你什么都没有获得！', 0, 40, this.width, 'center');
    }
};

Window_FishSFCommand.prototype.makeCommandList = function () {
    this.addCommand('确定', 'ok', true);
};

Window_FishSFCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_FishSFCommand.prototype.maxCols = function () {
    return 1;
};

Window_FishSFCommand.prototype.maxItems = function () {
    return 1;
};