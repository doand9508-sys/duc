//=============================================================================
// RPG Maker MZ - -战斗Ui
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<战斗Ui>
 * @author Cat
 * @help
 * ====================================================================
*/
'use strict';
var Imported = Imported || {};
Imported.Cat_BattleUi = true;

var Cat = Cat || {};
Cat.BattleUi = {};
Cat.BattleUi.parameters = PluginManager.parameters('Cat_BattleUi');


Cat.BattleUi.Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
Scene_Battle.prototype.createPartyCommandWindow = function () {
    this._partyCommandBackSprite = null;
    this._partyCommandBackSprite = new Sprite();
    this._partyCommandBackSprite.hide();
    this._partyCommandBackSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', "actorCommand");
    this._partyCommandBackSprite.anchor.set(0.5);
    this.addChild(this._partyCommandBackSprite);
    this._partyCommandBackSprite.x = Graphics.width / 2;
    this._partyCommandBackSprite.y = Graphics.height / 2;

    Cat.BattleUi.Scene_Battle_createPartyCommandWindow.call(this);

    this._partyCommandSprite = new Sprite();
    this.addChild(this._partyCommandSprite);
    this._partyCommandSprite.hide();
    var x = 0;
    var y = -76;
    for (let i = 0; i < 2; i++) {
        const sprite = new Sprite_BattlePartyButton();
        sprite._buttonId = i;
        sprite.bitmap = ImageManager.loadBitmap('img/battleUi/', "partyButton_" + i)
        sprite.anchor.set(0.5);
        sprite.x = x + Graphics.width / 2;
        sprite.y = y + Graphics.height / 2;
        y += 152;
        this._partyCommandSprite.addChild(sprite);
    }
};
Scene_Battle.prototype.partyCommandWindowRect = function () {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = 2000//this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};
Cat.BattleUi.Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandBackSprite = null;
    this._actorCommandBackSprite = new Sprite();
    this._actorCommandBackSprite.hide();
    this._actorCommandBackSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', "actorCommand");
    this._actorCommandBackSprite.anchor.set(0.5);
    this.addChild(this._actorCommandBackSprite);
    this._actorCommandBackSprite.x = Graphics.width / 2;
    this._actorCommandBackSprite.y = Graphics.height / 2;

    Cat.BattleUi.Scene_Battle_createActorCommandWindow.call(this);

    this._actorCommandSprite = new Sprite();
    this.addChild(this._actorCommandSprite);
    this._actorCommandSprite.hide();
    var x = 0;
    var y = -100;
    for (let i = 0; i < 5; i++) {
        const sprite = new Sprite_BattleActorButton();
        if (i == 1) {
            x = -100;
            y = 0;
        } else if (i == 2) {
            x = 0;
            y = 100;
        } else if (i == 3) {
            x = 100;
            y = 0;
        } else if (i == 4) {
            x = 0;
            y = 0;
        }
        sprite._buttonId = i;
        sprite.bitmap = ImageManager.loadBitmap('img/battleUi/', "commandButton_" + i)
        sprite.anchor.set(0.5);
        sprite.setFrame(0, 100, 100, 100);
        sprite.x = x + Graphics.width / 2;
        sprite.y = y + Graphics.height / 2;
        this._actorCommandSprite.addChild(sprite);
        this._moveWindowDistance = 0;
        this._moveWindowDistances = -300;
    }
};
Scene_Battle.prototype.actorCommandWindowRect = function () {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = 2000//this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Battle.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    const statusWindow = new Window_BattleStatus(rect);
    this.addChild(statusWindow);
    this._statusWindow = statusWindow;
    this._onSkillItemCommand = false;//道具技能背景图控制
};
Scene_Battle.prototype.updateStatusWindowPosition = function () {
    if (!BattleManager.actor() && this._statusWindow.x != -450) {
        this._moveWindowDistances = -300;
        this._moveWindowDistance += 10;
        if (this._moveWindowDistance < 300) {
            this._statusWindow.move(- this._moveWindowDistance, this._statusWindow.y, this._statusWindow.width, this._statusWindow.height);
        }
    } else {
        this._moveWindowDistance = 0;
        if (this._statusWindow.x < -10) {
            this._moveWindowDistances += 10;
            this._statusWindow.move(this._moveWindowDistances, this._statusWindow.y, this._statusWindow.width, this._statusWindow.height);
        } else {
            this._statusWindow.x = -10;
        }
        // 
    }
};
Scene_Battle.prototype.statusWindowRect = function () {
    const extra = 10;
    const ww = 300;
    const wh = 500;
    const wx = -450;
    const wy = 250;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createHelpWindow = function () {
    this._skillCommandBackSprite1 = null;
    this._skillCommandBackSprite1 = new Sprite();
    this._skillCommandBackSprite1.hide();
    this._skillCommandBackSprite1.bitmap = ImageManager.loadBitmap('img/battleUi/', "itemHelpBack");
    // this._skillCommandBackSprite.anchor.set(0.5);
    this.addChild(this._skillCommandBackSprite1);
    this._skillCommandBackSprite1.x = 0;
    this._skillCommandBackSprite1.y = -10;

    const rect = this.helpWindowRect();
    this._helpWindow = new Window_BattleHelp(rect);
    this._helpWindow.hide();
    this.addChild(this._helpWindow);
};
Scene_Battle.prototype.helpWindowRect = function () {
    const wx = 10;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Battle.prototype.createSkillWindow = function () {
    this._skillCommandBackSprite = null;
    this._skillCommandBackSprite = new Sprite();
    this._skillCommandBackSprite.hide();
    this._skillCommandBackSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', "itemBack");
    // this._skillCommandBackSprite.anchor.set(0.5);
    this.addChild(this._skillCommandBackSprite);
    this._skillCommandBackSprite.x = 0;
    this._skillCommandBackSprite.y = -14;

    const rect = this.skillWindowRect();
    this._skillWindow = new Window_BattleSkill(rect);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
    this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
    this.addChild(this._skillWindow);
};
Scene_Battle.prototype.skillWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = this.windowAreaHeight() - 20;
    const wx = 0;
    const wy = Graphics.boxHeight - wh + 10 - 24;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Battle.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_BattleItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addChild(this._itemWindow);
};
Scene_Battle.prototype.enemyWindowRect = function () {
    const wx = 2000//this.isRightInputMode() ? 0 : Graphics.boxWidth - this._statusWindow.width;
    const ww = this._statusWindow.width;
    const wh = this.windowAreaHeight();
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Battle.prototype.actorWindowRect = function () {
    const ww = 600;
    const wh = 250;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = 250;
    return new Rectangle(wx, wy, ww, wh);
};
Cat.BattleUi.Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function () {
    this._onSkillItemCommand = true;
    Cat.BattleUi.Scene_Battle_onSkillOk.call(this);
};
Cat.BattleUi.Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function () {
    this._onSkillItemCommand = true;
    Cat.BattleUi.Scene_Battle_onItemOk.call(this);
};
Cat.BattleUi.Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel
Scene_Battle.prototype.onActorCancel = function () {
    Cat.BattleUi.Scene_Battle_onActorCancel.call(this);
    this._onSkillItemCommand = false;
};
Cat.BattleUi.Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel
Scene_Battle.prototype.onEnemyCancel = function () {
    Cat.BattleUi.Scene_Battle_onEnemyCancel.call(this);
    this._onSkillItemCommand = false;
};

/*Window*/
Window_BattleActor.prototype.numVisibleRows = function () {
    return 1;
};
Window_BattleActor.prototype.maxCols = function () {
    return 2;
};
Window_BattleActor.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_BattleActor.prototype.drawBack = function (bitmap, x, y) {
    const pw = bitmap.width;
    const ph = bitmap.height;
    const sw = pw;
    const sh = ph;
    const dx = x + 16;
    const dy = y + 4;
    this.contents.blt(bitmap, 0, 0, sw, sh, dx, dy);
};
Window_BattleActor.prototype._updateCursor = function () {
    this._cursorSprite.alpha = this._makeCursorAlpha();
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};
Window_BattleActor.prototype.placeGauge = function (actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_BattleGauge);
    sprite.setup(actor, type);
    sprite.move(x + 26, y + 4);
    sprite.show();
};
Cat.BattleUi.Window_PartyCommand_activate = Window_PartyCommand.prototype.activate;
Window_PartyCommand.prototype.activate = function () {
    Cat.BattleUi.Window_PartyCommand_activate.call(this);
    SceneManager._scene._partyCommandBackSprite.show();
    if (SceneManager._scene._partyCommandSprite) SceneManager._scene._partyCommandSprite.show();
};
Cat.BattleUi.Window_PartyCommand_deactivate = Window_PartyCommand.prototype.deactivate;
Window_PartyCommand.prototype.deactivate = function () {
    Cat.BattleUi.Window_PartyCommand_deactivate.call(this);
    SceneManager._scene._partyCommandBackSprite.hide();
    if (SceneManager._scene._partyCommandSprite) SceneManager._scene._partyCommandSprite.hide();
};

Cat.BattleUi.Window_ActorCommand_activate = Window_ActorCommand.prototype.activate;
Window_ActorCommand.prototype.activate = function () {
    Cat.BattleUi.Window_PartyCommand_activate.call(this);
    SceneManager._scene._actorCommandBackSprite.show();
    if (SceneManager._scene._actorCommandSprite) SceneManager._scene._actorCommandSprite.show();
};
Cat.BattleUi.Window_ActorCommand_deactivate = Window_ActorCommand.prototype.deactivate;
Window_ActorCommand.prototype.deactivate = function () {
    Cat.BattleUi.Window_ActorCommand_deactivate.call(this);
    SceneManager._scene._actorCommandBackSprite.hide();
    if (SceneManager._scene._actorCommandSprite) SceneManager._scene._actorCommandSprite.hide();
};
Cat.BattleUi.Window_ActorCommand_open = Window_ActorCommand.prototype.open;
Window_ActorCommand.prototype.open = function () {
    Cat.BattleUi.Window_ActorCommand_open.call(this);
    SceneManager._scene._actorCommandBackSprite.show();
    if (SceneManager._scene._actorCommandSprite) SceneManager._scene._actorCommandSprite.show();
};
Cat.BattleUi.Window_ActorCommand_close = Window_ActorCommand.prototype.close;
Window_ActorCommand.prototype.close = function () {
    Cat.BattleUi.Window_ActorCommand_close.call(this);
    SceneManager._scene._actorCommandBackSprite.hide();
    if (SceneManager._scene._actorCommandSprite) SceneManager._scene._actorCommandSprite.hide();
};


Window_ActorCommand.prototype.numVisibleRows = function () {
    return 3;
};
Window_ActorCommand.prototype.maxCols = function () {
    return 2;
};

Window_ActorCommand.prototype.cursorRight = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    // if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
    //     this.smoothSelect((index + 1) % maxItems);
    // }
    if (index == 0) {
        this.smoothSelect(3);
    } else if (index == 1) {
        this.smoothSelect(4);
    }
    else if (index == 2) {
        this.smoothSelect(3);
    }
    else if (index == 3) {
        this.smoothSelect(1);
    } else if (index == 4) {
        this.smoothSelect(3);
    }
};

Window_ActorCommand.prototype.cursorLeft = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    // if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
    //     this.smoothSelect((index - 1 + maxItems) % maxItems);
    // }
    if (index == 0) {
        this.smoothSelect(1);
    } else if (index == 1) {
        this.smoothSelect(3);
    }
    else if (index == 2) {
        this.smoothSelect(1);
    }
    else if (index == 3) {
        this.smoothSelect(4);
    } else if (index == 4) {
        this.smoothSelect(1);
    }
};
Window_ActorCommand.prototype.cursorDown = function (wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    // if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
    //     this.smoothSelect((index + maxCols) % maxItems);
    // }
    if (index == 0) {
        this.smoothSelect(4);
    } else if (index == 2) {
        this.smoothSelect(0);
    } else if (index == 1) {
        this.smoothSelect(2);
    } else if (index == 3) {
        this.smoothSelect(2);
    } else if (index == 4) {
        this.smoothSelect(2);
    }
};

Window_ActorCommand.prototype.cursorUp = function (wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    // if (index >= maxCols || (wrap && maxCols === 1)) {
    //     this.smoothSelect((index - maxCols + maxItems) % maxItems);
    // }
    if (index == 0) {
        this.smoothSelect(2);
    } else if (index == 2) {
        this.smoothSelect(4);
    } else if (index == 1) {
        this.smoothSelect(0);
    }
    else if (index == 3) {
        this.smoothSelect(0);
    } else if (index == 4) {
        this.smoothSelect(0);
    }
};
Cat.BattleUi.Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection
Scene_Battle.prototype.startActorSelection = function () {
    Cat.BattleUi.Scene_Battle_startActorSelection.call(this);
    if (SceneManager._scene._onSkillItemCommand) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    }
};

Cat.BattleUi.Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection
Scene_Battle.prototype.startEnemySelection = function () {
    Cat.BattleUi.Scene_Battle_startEnemySelection.call(this);
    if (SceneManager._scene._onSkillItemCommand) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    }
};

Cat.BattleUi.Window_BattleSkill_activate = Window_BattleSkill.prototype.activate;
Window_BattleSkill.prototype.activate = function () {
    Cat.BattleUi.Window_BattleSkill_activate.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    }
};
Cat.BattleUi.Window_BattleSkill_deactivate = Window_BattleSkill.prototype.deactivate;
Window_BattleSkill.prototype.deactivate = function () {
    Cat.BattleUi.Window_BattleSkill_deactivate.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.hide();
        SceneManager._scene._skillCommandBackSprite1.hide();
    }
};
Cat.BattleUi.Window_BattleSkill_show = Window_BattleSkill.prototype.show;
Window_BattleSkill.prototype.show = function () {
    Cat.BattleUi.Window_BattleSkill_show.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    };
};
Cat.BattleUi.Window_BattleSkill_hide = Window_BattleSkill.prototype.hide;
Window_BattleSkill.prototype.hide = function () {
    Cat.BattleUi.Window_BattleSkill_hide.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.hide();
        SceneManager._scene._skillCommandBackSprite1.hide();
    }
};



Cat.BattleUi.Window_BattleItem_activate = Window_BattleItem.prototype.activate;
Window_BattleItem.prototype.activate = function () {
    Cat.BattleUi.Window_BattleItem_activate.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    };
};
Cat.BattleUi.Window_BattleItem_deactivate = Window_BattleItem.prototype.deactivate;
Window_BattleItem.prototype.deactivate = function () {
    Cat.BattleUi.Window_BattleItem_deactivate.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.hide();
        SceneManager._scene._skillCommandBackSprite1.hide();
    }
};
Cat.BattleUi.Window_BattleItem_show = Window_BattleItem.prototype.show;
Window_BattleItem.prototype.show = function () {
    Cat.BattleUi.Window_BattleItem_show.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.show();
        SceneManager._scene._skillCommandBackSprite1.show();
    }
};
Cat.BattleUi.Window_BattleItem_hide = Window_BattleItem.prototype.hide;
Window_BattleItem.prototype.hide = function () {
    Cat.BattleUi.Window_BattleItem_hide.call(this);
    if (SceneManager._scene._skillCommandBackSprite) {
        SceneManager._scene._skillCommandBackSprite.hide();
        SceneManager._scene._skillCommandBackSprite1.hide();
    }
};

Cat.BattleUi.Window_BattleSkill_initialize = Window_BattleSkill.prototype.initialize;
Window_BattleSkill.prototype.initialize = function (rect) {
    Cat.BattleUi.Window_BattleSkill_initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/battleUi/', 'itemListBack');
};

Window_BattleSkill.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        if (index == this.index()) {
            this.drawCursorBitmap(rect, 0)
        } else {
            this.drawCursorBitmap(rect, 1)
        }
        this.changePaintOpacity(this.isEnabled(skill));
        if (index == this.index()) {
            this.changeTextColor('#fefbce');
            this.contents.outlineColor = '#8f4117';
            this.contents.outlineWidth = 3;
        } else {
            this.changeTextColor('#f0feff');
            this.contents.outlineColor = '#255279';
            this.contents.outlineWidth = 3;
        }
        this.resetTextColor();
        this.drawItemName(skill, rect.x + 4, rect.y + 4, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x - 2, rect.y + 3, rect.width);
        this.changePaintOpacity(1);
    }
};
Window_BattleSkill.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.contents.outlineColor = ColorManager.textColor(15);
        this.contents.outlineWidth = 3;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
        this.resetTextColor();
    }
};
Cat.BattleUi.Window_BattleSkill_update = Window_BattleSkill.prototype.update;
Window_BattleSkill.prototype.update = function () {
    Cat.BattleUi.Window_BattleSkill_update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
Cat.BattleUi.Window_BattleSkill_select = Window_BattleSkill.prototype.select;
Window_BattleSkill.prototype.select = function (index) {
    Cat.BattleUi.Window_BattleSkill_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_BattleSkill.prototype.drawBackgroundRect = function (rect) {
};
Window_BattleSkill.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};
Window_BattleSkill.prototype.numVisibleRows = function () {
    return 3;
};
Window_BattleSkill.prototype.maxCols = function () {
    return 2;
};
Window_BattleSkill.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_BattleSkill.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x - 6;
        const dy = rect.y;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};


Cat.BattleUi.Window_BattleItem_initialize = Window_BattleItem.prototype.initialize;
Window_BattleItem.prototype.initialize = function (rect) {
    Cat.BattleUi.Window_BattleItem_initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/battleUi/', 'itemListBack');
};
Window_BattleItem.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        if (index == this.index()) {
            this.drawCursorBitmap(rect, 0)
        } else {
            this.drawCursorBitmap(rect, 1)
        }
        this.changePaintOpacity(this.isEnabled(item));
        if (index == this.index()) {
            this.changeTextColor('#fefbce');
            this.contents.outlineColor = '#8f4117';
            this.contents.outlineWidth = 3;
        } else {
            this.changeTextColor('#f0feff');
            this.contents.outlineColor = '#255279';
            this.contents.outlineWidth = 3;
        }
        this.drawItemName(item, rect.x + 4, rect.y + 4, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x - 2, rect.y + 4, rect.width);
        this.changePaintOpacity(1);
    }
};
Window_BattleItem.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.contents.outlineColor = ColorManager.textColor(15);
        this.contents.outlineWidth = 3;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
        this.resetTextColor();
    }
};
Cat.BattleUi.Window_BattleItem_update = Window_BattleItem.prototype.update;
Window_BattleItem.prototype.update = function () {
    Cat.BattleUi.Window_BattleItem_update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Cat.BattleUi.Window_BattleItem_select = Window_BattleItem.prototype.select;
Window_BattleItem.prototype.select = function (index) {
    Cat.BattleUi.Window_BattleItem_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_BattleItem.prototype.drawBackgroundRect = function (rect) {
};
Window_BattleItem.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};
Window_BattleItem.prototype.numVisibleRows = function () {
    return 3;
};
Window_BattleItem.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_BattleItem.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x - 6;
        const dy = rect.y;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_BattleStatus.prototype.numVisibleRows = function () {
    return 2;
};
Window_BattleStatus.prototype.maxCols = function () {
    return 1;
};
Window_BattleStatus.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_BattleStatus.prototype.placeActorName = function (actor, x, y) {
    const key = "actor%1-name".format(actor.actorId());
    const sprite = this.createInnerSprite(key, Sprite_BattleName);
    sprite.setup(actor);
    sprite.move(x + 50, y - 59);
    sprite.show();
};
Cat.BattleUi.Window_BattleStatus_preparePartyRefresh = Window_BattleStatus.prototype.preparePartyRefresh;
Window_BattleStatus.prototype.preparePartyRefresh = function () {
    Cat.BattleUi.Window_BattleStatus_preparePartyRefresh.call(this);
    var bitmap = ImageManager.loadBitmap('img/battleUi/', 'back');
    bitmap.addLoadListener(this.performPartyRefresh.bind(this));
};
Window_BattleStatus.prototype.performPartyRefresh = function () {
    this._bitmapsReady++;
    if (this._bitmapsReady >= $gameParty.members().length + 1) {
        this.refresh();
    }
};
Window_BattleStatus.prototype.drawBack = function (bitmap, x, y) {
    const pw = bitmap.width;
    const ph = bitmap.height;
    const sw = pw;
    const sh = ph;
    const dx = x - 10;
    const dy = y + 8;
    this.contents.blt(bitmap, 0, 0, sw, sh, dx, dy);
};
Window_BattleStatus.prototype.drawItemImage = function (index) {
    const actor = this.actor(index);
    const rect = this.faceRect(index);
    var bitmap = ImageManager.loadBitmap('img/battleUi/', 'back');
    this.drawBack(bitmap, rect.x, rect.y, rect.width, rect.height);
};
Window_BattleStatus.prototype.placeBasicGauges = function (actor, x, y) {
    var ofx = 78;
    var ofy = 38 - 89 + 15 + 8;
    this.placeGauge(actor, "hp", x + ofx, y + ofy);
    this.placeGauge(actor, "mp", x + ofx, y + this.gaugeLineHeight() + ofy + 14);
    if ($dataSystem.optDisplayTp) {
        this.placeGauge(actor, "tp", x + ofx, y + this.gaugeLineHeight() * 2 + ofy + 27);
    }
};
Window_BattleStatus.prototype.placeGauge = function (actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_BattleGauge);
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();
};
Window_BattleStatus.prototype.drawBackgroundRect = function (rect) {
};
Window_BattleStatus.prototype.placeStateIcon = function (actor, x, y) {
    const key = "actor%1-stateIcon".format(actor.actorId());
    const sprite = this.createInnerSprite(key, Sprite_StateIcon);
    sprite.setup(actor);
    sprite.move(x - 240, y + 30);
    sprite.show();
};
Window_BattleStatus.prototype._updateCursor = function () {
    this._cursorSprite.alpha = this._makeCursorAlpha();
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x - 20;
    this._cursorSprite.y = this._cursorRect.y;
};
function Sprite_BattleName() {
    this.initialize(...arguments);
}

Sprite_BattleName.prototype = Object.create(Sprite_Name.prototype);
Sprite_BattleName.prototype.constructor = Sprite_BattleName;

Sprite_BattleName.prototype.initialize = function () {
    Sprite_Name.prototype.initialize.call(this);
};
Sprite_BattleName.prototype.bitmapHeight = function () {
    return 40;
};
Sprite_BattleName.prototype.redraw = function () {
    const name = this.name();
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupFont();
    this.bitmap.clear();
    this.bitmap.drawText(name, 0, 0, width, height, "center");
};
Sprite_BattleName.prototype.setupFont = function () {
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.textColor = '#be460a';
    this.bitmap.outlineColor = '#d58a5a';
    this.bitmap.outlineWidth = 1;
};

function Sprite_BattlePartyButton() {
    this.initialize(...arguments);
}
Sprite_BattlePartyButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_BattlePartyButton.prototype.constructor = Sprite_BattlePartyButton;

Sprite_BattlePartyButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._buttonId = -1;
};

Sprite_BattlePartyButton.prototype.onClick = function () {
    if (SceneManager._scene._partyCommandWindow.active) {
        SceneManager._scene._partyCommandWindow.select(this._buttonId);
        SceneManager._scene._partyCommandWindow.processOk();
    }
};

Sprite_BattlePartyButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._partyCommandWindow.active) {
        SceneManager._scene._partyCommandWindow.select(this._buttonId);
        SoundManager.playCursor();
    };
};

Sprite_BattlePartyButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (SceneManager._scene._partyCommandWindow.active) {
        const index = SceneManager._scene._partyCommandWindow.index();
        if (index >= 0 && this._buttonId == index) {
            this.setFrame(0, 0, 100, 100);
        } else {
            this.setFrame(0, 100, 100, 100);
        }
    }
};
Sprite_BattlePartyButton.prototype.onMouseExit = function () {
};
Sprite_BattlePartyButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};


function Sprite_BattleActorButton() {
    this.initialize(...arguments);
}
Sprite_BattleActorButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_BattleActorButton.prototype.constructor = Sprite_BattleActorButton;

Sprite_BattleActorButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._buttonId = -1;
};

Sprite_BattleActorButton.prototype.onClick = function () {
    if (SceneManager._scene._actorCommandWindow.active) {
        SceneManager._scene._actorCommandWindow.select(this._buttonId);
        SceneManager._scene._actorCommandWindow.processOk();
    }
};

Sprite_BattleActorButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._actorCommandWindow.active) {
        SceneManager._scene._actorCommandWindow.select(this._buttonId);
        SoundManager.playCursor();
    };
};

Sprite_BattleActorButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (SceneManager._scene._actorCommandWindow.active) {
        const index = SceneManager._scene._actorCommandWindow.index();
        if (index >= 0 && this._buttonId == index) {
            this.setFrame(0, 0, 100, 100);
        } else {
            this.setFrame(0, 100, 100, 100);
        }
    }
};
Sprite_BattleActorButton.prototype.onMouseExit = function () {
};
Sprite_BattleActorButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};


/*血条精灵*/
function Sprite_BattleGauge() {
    this.initialize(...arguments);
}

Sprite_BattleGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_BattleGauge.prototype.constructor = Sprite_BattleGauge;

Sprite_BattleGauge.prototype.initialize = function () {
    Sprite_Gauge.prototype.initialize.call(this);
    this._valueBitmap = new Bitmap(228, 40);
    this._hpSprite = new Sprite();
    this.addChild(this._hpSprite);

    this._mpSprite = new Sprite();
    this.addChild(this._mpSprite);

    this._tpSprite = new Sprite();
    this.addChild(this._tpSprite);

    this._valueSprite = new Sprite();
    this.addChild(this._valueSprite);
};

Sprite_BattleGauge.prototype.redraw = function () {
    this.bitmap.clear();
    const currentValue = this.currentValue();
    if (!isNaN(currentValue)) {
        this.drawGauge();
    }
};
Sprite_BattleGauge.prototype.drawGaugeRect = function (x, y, width, height) {
    const rate = this.gaugeRate();
    const currentValue = this.currentValue();
    const currentMaxValue = this.currentMaxValue();
    if (this._statusType === "hp") {
        this._hpSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', 'hpg');
        this._hpSprite.setFrame(0, 0, Math.floor(132 * rate), 17);
        var ofx = 0;
        var ofy = 0;
    } else if (this._statusType === "mp") {
        this._mpSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', 'mpg');
        this._mpSprite.setFrame(0, 0, Math.floor(132 * rate), 17);
        var ofx = 0;
        var ofy = 0;
    } else if (this._statusType === "tp") {
        this._tpSprite.bitmap = ImageManager.loadBitmap('img/battleUi/', 'tpg');
        this._tpSprite.setFrame(0, 0, Math.floor(132 * rate), 17);
        var ofx = 0;
        var ofy = 0;
    };
    if (this._valueBitmap) this._valueBitmap.clear();
    this._valueBitmap.addLoadListener(this.listenerValueBitmap.bind(this));
    this.setupValueFont();
    this._valueBitmap.drawText(currentValue + ' / ' + currentMaxValue, 0 + ofx, 0 + ofy, 132, 40, "center");
    this._valueSprite.x = x - 74;
    this._valueSprite.y = y - 25;
};
Sprite_BattleGauge.prototype.listenerValueBitmap = function (bitmapLoaded) {
    if (bitmapLoaded === this._valueBitmap) {
        this._valueSprite.bitmap = this._valueBitmap;
    }
};

Sprite_BattleGauge.prototype.setupValueFont = function () {
    this._valueBitmap.fontFace = this.valueFontFace();
    this._valueBitmap.fontSize = 17;
    this._valueBitmap.textColor = '#fffee5';
    this._valueBitmap.outlineColor = "#5f3a24";
    this._valueBitmap.outlineWidth = 2;
};

Sprite_BattleGauge.prototype.currentValue = function () {
    if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.hp;
            case "mp":
                return this._battler.mp;
            case "tp":
                return this._battler.tp;
            case "exp":
                return this._battler.currentExp() - this._battler.currentLevelExp();
            case "time":
                return this._battler.tpbChargeTime();
        }
    }
    return NaN;
};

Sprite_BattleGauge.prototype.currentMaxValue = function () {
    if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.mhp;
            case "mp":
                return this._battler.mmp;
            case "tp":
                return this._battler.maxTp();
            case "exp":
                return this._battler.nextLevelExp() - this._battler.currentLevelExp();
            case "time":
                return 1;
        }
    }
    return NaN;
};
Sprite_BattleGauge.prototype.gaugeRate = function () {
    const value = this._value;
    const maxValue = this._maxValue;
    return maxValue > 0 ? value / maxValue : 0;
};
Sprite_BattleGauge.prototype.bitmapWidth = function () {
    return 128;
};

Sprite_BattleGauge.prototype.bitmapHeight = function () {
    return 24;
};

Sprite_BattleGauge.prototype.gaugeHeight = function () {
    return 12;
};

Sprite_BattleGauge.prototype.valueFontSize = function () {
    return 12;
};

function Window_BattleHelp() {
    this.initialize(...arguments);
}

Window_BattleHelp.prototype = Object.create(Window_Help.prototype);
Window_BattleHelp.prototype.constructor = Window_BattleHelp;

Window_BattleHelp.prototype.initialize = function (rect) {
    Window_Help.prototype.initialize.call(this, rect);
    this.opacity = 0;
};
// Window_BattleHelp.prototype.resetFontSettings = function () {
//     this.contents.fontFace = $gameSystem.mainFontFace();
//     this.contents.fontSize = 24;
//     this.resetTextColor();
//     this.changeTextColor('#4e7574');
//     this.contents.outlineColor = '#587c7a';
//     this.contents.outlineWidth = 1;
// };
// Window_BattleHelp.prototype.processColorChange = function (colorIndex) {
//     if (colorIndex == 0 && $gameMessage.background() == 0) {
//         this.changeTextColor('#4e7574');
//         this.contents.outlineColor = '#587c7a';
//         this.contents.outlineWidth = 1;
//     } else if (colorIndex == 6 && $gameMessage.background() == 0) {
//         this.changeTextColor('#edbd28');
//         this.contents.outlineColor = '#f6d160';
//         this.contents.outlineWidth = 1;
//     } else {
//         if ($gameMessage.background() == 0) {
//             this.changeTextColor(ColorManager.textColor(colorIndex));
//             this.changeOutlineColor(ColorManager.textColor(colorIndex));
//             this.contents.outlineWidth = 1;
//         } else {
//             this.changeTextColor(ColorManager.textColor(colorIndex));
//             this.changeOutlineColor(ColorManager.outlineColor());
//             this.contents.outlineWidth = 3;
//         }
//     }
// };