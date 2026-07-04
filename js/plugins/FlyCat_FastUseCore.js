
//=============================================================================
// RPG Maker MZ - 快捷使用
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<快捷使用>
 * @author FlyCat
 * 
 * 
 * @help
 * 物品备注：
 * <气血药品>
 * <灵力药品>
 */

'use strict';
var Imported = Imported || {};
Imported.FlyCat_FastUseCore = true;

var FlyCat = FlyCat || {};
FlyCat.FastUseCore = {};
FlyCat.FastUseCore.parameters = PluginManager.parameters('FlyCat_FastUseCore');

FlyCat.FastUseCore.Scene_Status_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function () {
    FlyCat.FastUseCore.Scene_Status_create.call(this);
    this.createFastUseWindow();
    this.createFastUseSprite();
};
Scene_Status.prototype.createFastUseSprite = function () {
    var x = 560;
    var y = 155;
    this._fastUseButtonSprite = [];
    for (let i = 0; i < 2; i++) {
        this._fastUseButtonSprite[i] = new Sprite_FastUseButton();
        this.addChild(this._fastUseButtonSprite[i]);
        this._fastUseButtonSprite[i]._buttonId = i;
        this._fastUseButtonSprite[i].bitmap = ImageManager.loadBitmap('img/menu/', "jiahao");
        this._fastUseButtonSprite[i].x = x;
        this._fastUseButtonSprite[i].y = y;
        y += 35;
    }
};
Scene_Status.prototype.createFastUseWindow = function () {

    this._equipItemBackSprite = new Sprite();
    this.addChild(this._equipItemBackSprite);
    this._equipItemBackSprite.hide();
    this._equipItemBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'zz');

    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');

    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.scale.set(0.7);
    this._cancelButtonSprite.setClickHandler(this.cancelUse.bind(this));
    this._cancelButtonSprite.hide();

    const rect = this.petUseListWindowRect();
    this._actorUseListWindow = new Window_ActorUseList(rect);
    this._actorUseListWindow.setHandler('ok', this.onUse.bind(this));
    this._actorUseListWindow.setHandler('cancel', this.cancelUse.bind(this));
    this.addChild(this._actorUseListWindow);
    this._actorUseListWindow.deactivate();
    this._actorUseListWindow.hide();

    this._cancelButtonSprite.x = this._actorUseListWindow.x + this._actorUseListWindow.width - 23;
    this._cancelButtonSprite.y = this._actorUseListWindow.y - 16;

    this._equipItemSprite.x = this._actorUseListWindow.x + 13;
    this._equipItemSprite.y = this._actorUseListWindow.y + 5;

    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._actorUseListWindow) this._actorUseListWindow._miniInfoWindow = this._miniWindow;
    };
};
Scene_Status.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._actorUseListWindow && this._actorUseListWindow.active && this._actorUseListWindow._list) {
        const index = this._actorUseListWindow.index();
        const item = this._actorUseListWindow._list[index];
        if (Imported.MiniInformationWindow && item) {
            this._actorUseListWindow.setMiniWindow(item);
            this._actorUseListWindow._miniInfoWindow.show();
        }
    }
};
Scene_Status.prototype.petUseListWindowRect = function () {
    const ww = 380;
    const wh = 450;
    const wx = (Graphics.width - ww) / 2 - 66;
    const wy = (Graphics.height - wh) / 2 + 80;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Status.prototype.cancelUse = function () {
    this._cancelButtonSprite.hide()
    this._equipItemBackSprite.hide();
    this._actorUseListWindow.deactivate();
    this._actorUseListWindow.hide();
    this._equipItemSprite.hide();
    this._commandWindow.activate();
};
Scene_Status.prototype.onUse = function () {
    const actor = $gameParty.allMembers()[0];
    const item = this._actorUseListWindow._list[this._actorUseListWindow.index()];
    if (this._actorUseListWindow._list.length < 1 || !item) {
        SoundManager.playBuzzer();
        this._actorUseListWindow.activate();
        return;
    }
    $gameParty.setLastItem(item);
    this.useItem(actor, item);
    this._actorUseListWindow.refresh();
    this._actorUseListWindow.activate();
};
Scene_Status.prototype.useItem = function (actor, item) {
    if (item && item.meta.指定角色) {
        const actorId = Number(item.meta.指定角色);
        if (actor._actorId != actorId) {
            SoundManager.playBuzzer();
            this._actorUseListWindow.refresh();
            this._actorUseListWindow.activate();
            return;
        }
    }
    const action = new Game_Action(actor);
    action.setItemObject(item);
    SoundManager.playUseItem();
    actor.useItem(item);
    this.applyItem(actor, item);
    this.checkCommonEvent();
    this.checkGameover();
    this._statusLLWindow.refresh();
};
Scene_Status.prototype.applyItem = function (actor, item) {
    const action = new Game_Action(actor);
    action.setItemObject(item);
    for (const target of this.itemTargetActors(actor, item)) {
        for (let i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }
    action.applyGlobal();
};
Scene_Status.prototype.itemTargetActors = function (actor, item) {
    const action = new Game_Action(actor);
    action.setItemObject(item);
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return actor;
    } else {
        return [actor];
    }
};
Scene_Status.prototype.checkCommonEvent = function () {
    if ($gameTemp.isCommonEventReserved()) {
        SceneManager.goto(Scene_Map);
    }
};



function Window_ActorUseList() {
    this.initialize(...arguments);
}

Window_ActorUseList.prototype = Object.create(Window_Selectable.prototype);
Window_ActorUseList.prototype.constructor = Window_ActorUseList;

Window_ActorUseList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._type = -1;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');
    this.createCursorSprite();
};
Window_ActorUseList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_2');
    this._clientArea.addChild(this._cursorSprites);
};
Window_ActorUseList.prototype.update = function () {
    Window_StatusBase.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        if (this._list.length > 0) {
            this.select(0);
        } else {
            this.deselect();
        }
        this.show();
        this._loadingPictrue = true;
    }
    if (this.active && this._miniInfoWindow) this._miniInfoWindow.hide();
};
Window_ActorUseList.prototype.setActor = function (actor, type) {
    this._actor = actor;
    this._type = type;
    this._loadingPictrue = false;
    SceneManager._scene._commandWindow.deactivate();
    SceneManager._scene._equipItemSprite.show();
    SceneManager._scene._equipItemBackSprite.show();
    SceneManager._scene._cancelButtonSprite.show()
    this.activate();
};
Window_ActorUseList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};
Window_ActorUseList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    if (this._type == 0) {
        this._list = $gameParty.allItems().filter(item => item.meta.气血药品);
    } else if (this._type == 1) {
        this._list = $gameParty.allItems().filter(item => item.meta.灵力药品);
    }
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        if (this._type == 0) {
            this.drawText('没有恢复气血的药品', -10, this.height / 2 - 30, this.width, 'center');
        }
        if (this._type == 1) {
            this.drawText('没有恢复灵力的药品', -10, this.height / 2 - 30, this.width, 'center');
        }
    };
};
Window_ActorUseList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawCursorBitmap(rect)
        this.drawIcon(item.iconIndex, rect.x + 5, rect.y - 4)
        this.drawText(item.name, rect.x + 48, rect.y, this.width, 'left');
        if (!DataManager.isSkill(item)) {
            this.drawText("持有：", rect.x, rect.y, rect.width - this.textWidth("00"), "right");
            this.drawText($gameParty.numItems(item), rect.x, rect.y, rect.width, "right");
        }

    }
}
Window_ActorUseList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_ActorUseList.prototype.numVisibleRows = function () {
    return 8;
};
Window_ActorUseList.prototype.lineHeight = function () {
    return 27;
};
Window_ActorUseList.prototype.drawBackgroundRect = function (rect) {
};
Window_ActorUseList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 3;
        this._cursorSprites.y = this._cursorSprite.y - 1;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_ActorUseList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 2;
        const dy = rect.y - 9;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

function Sprite_FastUseButton() {
    this.initialize(...arguments);
}
Sprite_FastUseButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_FastUseButton.prototype.constructor = Sprite_FastUseButton;

Sprite_FastUseButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._buttonId = -1;
};

Sprite_FastUseButton.prototype.onClick = function () {
    const actor = $gameParty.allMembers()[0];
    if (this._buttonId == 0) {
        SceneManager._scene._actorUseListWindow.setActor(actor, 0);
    } else {
        SceneManager._scene._actorUseListWindow.setActor(actor, 1);
    }
};

Sprite_FastUseButton.prototype.onMouseEnter = function () {
    SoundManager.playCursor();
    this._colorTone = [50, 50, 50, 0]
    this._updateColorFilter();
};

Sprite_FastUseButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
};
Sprite_FastUseButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
};
Sprite_FastUseButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};