//=============================================================================
// RPG Maker MZ - Battle_Rewards
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<Battle_Rewards>
 * @author Cat
 * 
 * @param text_0
 * @text 金钱提示语
 * @desc 金钱提示语
 * @type string
 * @default 获得灵石：
 * 
 * @param text_1
 * @text 经验提示语
 * @desc 经验提示语
 * @type string
 * @default 获得修为：
 * 
 * @param text_2
 * @text 物品提示语
 * @desc 物品提示语
 * @type string
 * @default 获得物品：
 * 
 * @param text_3
 * @text 升级提示语
 * @desc 升级提示语
 * @type string
 * @default  升级！
 * 
 * @help
 * 
 */
var Imported = Imported || {};
Imported.Cat_VictoryUi = true;

var Cat = Cat || {};
Cat.VictoryUi = {};
Cat.VictoryUi.parameters = PluginManager.parameters('Cat_VictoryUi');
Cat.VictoryUi.text_0 = String(Cat.VictoryUi.parameters['text_0']);
Cat.VictoryUi.text_1 = String(Cat.VictoryUi.parameters['text_1']);
Cat.VictoryUi.text_2 = String(Cat.VictoryUi.parameters['text_2']);
Cat.VictoryUi.text_3 = String(Cat.VictoryUi.parameters['text_3']);

BattleManager.displayVictoryMessage = function () {
    //$gameMessage.add(TextManager.victory.format($gameParty.name()));
};

BattleManager.displayDefeatMessage = function () {
    // $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};
BattleManager.displayStartMessages = function () {
    // for (const name of $gameTroop.enemyNames()) {
    //     $gameMessage.add(TextManager.emerge.format(name));
    // }
    // if (this._preemptive) {
    //     $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    // } else if (this._surprise) {
    //     $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    // }
};

BattleManager.processVictory = function () {
    if (!$gameSystem._battleEndSelect) {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        //console.log(this._rewards.items)
        this.displayVictoryMessage();
        this.gainExp();
        this.displayRewards();
        this.gainRewards();
    }
    if ($gameSystem._battleEndOk == true) {
        Cat.VictoryUi._Scene_Battle._backGroundSprtie.visible = false;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.close();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.hide();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.close();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.hide();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.close();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.hide();
        $gameSystem._battleEndSelect = false;
        this.endBattle(0);
    }
};

BattleManager.gainRewards = function () {
    this.gainGold();
    this.gainDropItems();
};

BattleManager.gainExp = function () {
    const exp = this._rewards.exp;
    const actor = $gameParty.allMembers()[0];
    const lastActor = JsonEx.makeDeepCopy(actor);
    actor.gainExp(exp);
    if (actor._level > lastActor._level) {
        this._upActorLast = lastActor;
        this._upLevel = true;
    } else {
        this._upActorLast = null;
        this._upLevel = false;
    }
};

BattleManager.displayRewards = function () {
    if (Cat.VictoryUi._Scene_Battle) {
        Cat.VictoryUi._Scene_Battle._backGroundSprtie.visible = true;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.open();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.show();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow._gold = this._rewards.gold;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow._exp = this._rewards.exp;
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.refresh(this._rewards.items);
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.open();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.show();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow._upLevel = this._upLevel;
        Cat.VictoryUi._Scene_Battle._victoryActorWindow._upActorLast = this._upActorLast;
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.open();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.show();
        $gameSystem._battleEndSelect = true;
    }
};

Game_Actor.prototype.displayLevelUp = function (newSkills) {
    if ($gameParty._inBattle == true) {
    } else {
        const text = TextManager.levelUp.format(
            this._name,
            TextManager.level,
            this._level
        );
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }
    }
};

Cat.VictoryUi.Scene_Battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function () {
    Cat.VictoryUi.Scene_Battle_initialize.call(this);
    $gameSystem._battleEndOk = false;
    $gameSystem._battleEndSelect = false;
    Cat.VictoryUi._Scene_Battle = this;
};

Cat.VictoryUi.Scene_Battle_create = Scene_Battle.prototype.create
Scene_Battle.prototype.create = function () {
    Cat.VictoryUi.Scene_Battle_create.call(this);
    this.createDisplayVictoryWindow();
};

Scene_Battle.prototype.createDisplayVictoryWindow = function () {
    this.createBackGroundSprite();
    this.createVictorySatusWindow();
    this.createVictoryItemWindow();
    this.createVictoryActorWindow();
};

Scene_Battle.prototype.createVictoryActorWindow = function () {
    const rect = this.victoryActorRect();
    this._victoryActorWindow = new Window_VictoryActor(rect);
    this.addChild(this._victoryActorWindow);
    this._victoryActorWindow.hide();
    this._victoryActorWindow.close();
};

Scene_Battle.prototype.victoryActorRect = function () {
    const ww = 350;
    const wh = 460;
    const wx = 726;
    const wy = Graphics.boxHeight / 2 - 210;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createBackGroundSprite = function () {
    this._backGroundSprtie = new Sprite()
    this.addChild(this._backGroundSprtie)
    this._backGroundSprtie.bitmap = ImageManager.loadBitmap('img/battleUi/', "战斗结算");
    this._backGroundSprtie.x = 0;
    this._backGroundSprtie.y = 0;
    this._backGroundSprtie.visible = false;
};

Scene_Battle.prototype.createVictorySatusWindow = function () {
    const rect = this.victorySatusRect();
    this._victorySatusWindow = new Window_VictorySatus(rect);
    this.addChild(this._victorySatusWindow);
    this._victorySatusWindow.hide();
    this._victorySatusWindow.close();
};

Scene_Battle.prototype.victorySatusRect = function () {
    const ww = 350;
    const wh = 460;
    const wx = 210;
    const wy = Graphics.boxHeight / 2 - 210;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createVictoryItemWindow = function () {
    const rect = this.victoryItemRect();
    this._victoryItemWindow = new Window_VictoryItem(rect);
    this.addChild(this._victoryItemWindow);
    this._victoryItemWindow.hide();
    this._victoryItemWindow.close();
};
Scene_Battle.prototype.victoryItemRect = function () {
    const ww = 350;
    const wh = 350;
    const wx = 210;
    const wy = Graphics.boxHeight / 2 - 80;
    return new Rectangle(wx, wy, ww, wh);
};

Cat.VictoryUi.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    Cat.VictoryUi.Scene_Battle_update.call(this);
    if ($gameSystem._battleEndSelect == true) {
        if (TouchInput.isTriggered() || Input.isPressed("ok")) {
            $gameSystem._battleEndOk = true;
        }
    }
};

function Window_VictorySatus() {
    this.initialize(...arguments);
}

Window_VictorySatus.prototype = Object.create(Window_Base.prototype);
Window_VictorySatus.prototype.constructor = Window_VictorySatus;

Window_VictorySatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._gold = null;
    this._exp = null;
    this.opacity = 0;
};

Window_VictorySatus.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._gold != null && this._exp != null) {
        this.drawInfo();
    }
};

Window_VictorySatus.prototype.drawInfo = function () {
    if (this.contents) {
        this.createContents();
        const gold = this._gold;
        const exp = this._exp;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawText(Cat.VictoryUi.text_0 + gold, 5, 0, this.width, 'left');
        this.drawText(Cat.VictoryUi.text_1 + exp, 5, 40, this.width, 'left');
        this.drawText(Cat.VictoryUi.text_2, 5, 80, this.width, 'left');
    };
};

function Window_VictoryActor() {
    this.initialize(...arguments);
}

Window_VictoryActor.prototype = Object.create(Window_Base.prototype);
Window_VictoryActor.prototype.constructor = Window_VictoryActor;

Window_VictoryActor.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._upLevel = false;
    this._upActorLast = null;
};

Window_VictoryActor.prototype.refresh = function () {
    if (this.contents) {
        this.createContents();
        this.contents.fontSize = $gameSystem.mainFontSize();;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        const actor = $gameParty.allMembers()[0];
        const level = actor._level;
        const hp = actor.mhp;
        const mp = actor.mmp;
        const atk = actor.atk;
        const mat = actor.mat;
        const def = actor.def;
        const mdf = actor.mdf;
        const agi = actor.agi;
        const luk = actor.luk;
        const upLevel = this._upLevel;
        const lastActor = this._upActorLast;
        var text = '';
        if (upLevel && lastActor) {
            var text = Cat.VictoryUi.text_3;
            var y = 0;
            var ofy = 40;
            var x = 20;
            this.drawTextEx(TextManager.level + ": " + level + '（\\C[10]↑' + Math.floor(level - lastActor.level) + '\\C[0]）' + '\\C[10]' + text, x, y, this.width, 'left');
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
            y += ofy;
            this.drawTextEx(TextManager.hp + ": " + hp + '（\\C[10]↑' + Math.floor(hp - lastActor.mhp) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.mp + ": " + mp + '（\\C[10]↑' + Math.floor(mp - lastActor.mmp) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(2) + ": " + atk + '（\\C[10]↑' + Math.floor(atk - lastActor.atk) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(3) + ": " + def + '（\\C[10]↑' + Math.floor(def - lastActor.def) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(4) + ": " + mat + '（\\C[10]↑' + Math.floor(mat - lastActor.mat) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(5) + ": " + mdf + '（\\C[10]↑' + Math.floor(mdf - lastActor.mdf) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(6) + ": " + agi + '（\\C[10]↑' + Math.floor(agi - lastActor.agi) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
            this.drawTextEx(TextManager.param(7) + ": " + luk + '（\\C[10]↑' + Math.floor(luk - lastActor.luk) + '\\C[0]）', x, y, this.width, 'left');
            y += ofy;
        } else {
            var text = '';
            var y = 0;
            var ofy = 40;
            var x = 20;
            this.drawTextEx(TextManager.level + ": " + level + '\\C[10]' + text, x, y, this.width, 'left');
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
            y += ofy;
            this.drawText(TextManager.hp + ": " + hp, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.mp + ": " + mp, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(2) + ": " + atk, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(3) + ": " + def, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(4) + ": " + mat, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(5) + ": " + mdf, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(6) + ": " + agi, x, y, this.width, 'left');
            y += ofy;
            this.drawText(TextManager.param(7) + ": " + luk, x, y, this.width, 'left');
            y += ofy;
        }
    }
};

Window_VictoryActor.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 10) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
    } else {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
    }
};

Window_VictoryActor.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();;
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
};

Window_VictoryActor.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.refresh();
};

function Window_VictoryItem() {
    this.initialize(...arguments);
}

Window_VictoryItem.prototype = Object.create(Window_Selectable.prototype);
Window_VictoryItem.prototype.constructor = Window_VictoryItem;

Window_VictoryItem.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_VictoryItem.prototype.refresh = function (items) {
    this._list = [];
    this._list = items || [];
    if (this.contents) {
        this.createContents();
        if (this._list.length > 0) {
            this.drawAllItems();
        }
    }
};

Window_VictoryItem.prototype.drawItem = function (index) {
    const rect = this.itemRect(index);
    const name = this._list[index].name;
    const iconIndex = this._list[index].iconIndex;
    this.contents.fontSize = 20;
    this.drawIcon(iconIndex, rect.x, rect.y + 3, 36, 36)
    // var color = 0;
    // if (this._list[index].meta.color) var color = Number(this._list[index].meta.color);
    // this.changeTextColor(ColorManager.textColor(color));
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
    this.drawText(name, rect.x + 36, rect.y + 2, this.itemWidth(), 'left')
    this.resetTextColor();
};

Window_VictoryItem.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_VictoryItem.prototype.numVisibleRows = function () {
    return 8;
};

Window_VictoryItem.prototype.maxCols = function () {
    return 1;
};

Window_VictoryItem.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_VictoryItem.prototype.drawBackgroundRect = function (rect) {
    // const c1 = ColorManager.textColor(8);
    // const x = rect.x;
    // const y = rect.y;
    // const w = rect.width;
    // const h = rect.height;
    // this.contentsBack.strokeRect(x, y, w, h, c1);
};
