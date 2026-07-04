//=============================================================================
// RPG Maker MZ - -商店Ui
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<商店Ui>
 * @author Cat
 * @help
 * ====================================================================
*/
'use strict';
var Imported = Imported || {};
Imported.Cat_ShopCoreUi = true;

var Cat = Cat || {};
Cat.ShopCoreUi = {};
Cat.ShopCoreUi.parameters = PluginManager.parameters('Cat_ShopCoreUi');

Cat.ShopCoreUi.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_ItemGoldShop) {
        this.opacity = 0;
    } else {
        Cat.ShopCoreUi.Sprite_Button_updateOpacity.call(this);
    }
};

Scene_ItemGoldShop.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createItemGoldShopWindow();
    this.createItemGoldShopInfoWindow();
    this.createItemGoldShopCommandWindow()
    this.createNumberInputWindow();
    this.createGoldLsWindow();
    this.createTimeWindow();
};

Cat.ShopCoreUi.Scene_ItemGoldShop_createBackground = Scene_ItemGoldShop.prototype.createBackground
Scene_ItemGoldShop.prototype.createBackground = function () {
    Cat.ShopCoreUi.Scene_ItemGoldShop_createBackground.call(this);
    this._backgroundSprite_new = new Sprite();
    this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/shopUi/', 'back');
    this.addChild(this._backgroundSprite_new);
};

Scene_ItemGoldShop.prototype.createNumberInputWindow = function () {
    this._backgroundSprite_news = new Sprite();
    this._backgroundSprite_news.bitmap = ImageManager.loadBitmap('img/shopUi/', 'buttonBack');
    this.addChild(this._backgroundSprite_news);
    this._backgroundSprite_news.visible = false;

    const rect = this.newNumberInputRect();
    this._shopNumberInputWindow = new Window_ShopNumberInput(rect);
    this._shopNumberInputWindow.setHandler("cancel", this.closeShopNumberInputWindow.bind(this));
    this.addChild(this._shopNumberInputWindow);
    this._shopNumberInputWindow.deactivate();
    this._shopNumberInputWindow.hide();
};

Scene_ItemGoldShop.prototype.onItem = function () {
    this._backgroundSprite_news.visible = true;
    const data = $gameSystem._ItemShop[this._shopId];
    if ($gameSystem._ItemShop[this._shopId].type) {
        var useItemNumber = $gameParty.gold();
        var type = 0;
    } else {
        var useItemNumber = $gameParty.numItems(data.useItem);
        var type = 1;
    }
    var itemGold = this._shopItemListWindow.itemGold();
    this._shopItemListWindow.deactivate();
    const item = this._shopItemListWindow.item();
    this._shopNumberInputWindow.activate();
    this._shopNumberInputWindow.setup(item, itemGold, type, data.useItem);
    this._shopNumberInputWindow.show();
};
Scene_ItemGoldShop.prototype.createItemGoldShopInfoWindow = function () {
    const rect = this.itemGoldShopInfoWindowRect();
    // this._shopItemInfoWindow = new Window_ShopItemInfo(rect);
    // this.addChild(this._shopItemInfoWindow);
    this._shopInfoSprite = new Sprite();
    this.addChild(this._shopInfoSprite);
    this._shopInfoSprite.bitmap = ImageManager.loadBitmap('img/shopUi/', $gameSystem._ItemShop[this._shopId].shopNote || '');
    this._shopInfoSprite.x = -30;
    const rects = this.goldInfoWindowRect();
    this._goldInfoWindow = new Window_GoldInfo(rects);
    this.addChild(this._goldInfoWindow);
    const rectss = this.itemInfoWindowRect();
    this._itemInfoWindow = new Window_ItemInfo(rectss);
    this.addChild(this._itemInfoWindow);
};

Scene_ItemGoldShop.prototype.goldInfoWindowRect = function () {
    const ww = 1000;
    const wh = 100;
    const wx = 206;
    const wy = this.mainAreaTop() + 26;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_ItemGoldShop.prototype.itemGoldShopWindowRect = function () {
    const ww = 920;
    const wh = 380;
    const wx = 160;
    const wy = 144;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_ItemGoldShop.prototype.itemInfoWindowRect = function () {
    const ww = 1000;
    const wh = 150;
    const wx = 170;
    const wy = 497;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ItemGoldShop.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._shopId >= 0) {
        if (this._goldInfoWindow) this._goldInfoWindow.refresh();
        if (this._itemInfoWindow && this._shopItemListWindow) {
            const index = this._shopItemListWindow.index();
            const item = this._shopItemListWindow._list[index];
            if (item) {
                this._itemInfoWindow.refresh(item);
            } else {
                this._itemInfoWindow.createContents();
            }
        }
    }
}

Scene_ItemGoldShop.prototype.newNumberInputRect = function () {
    const ww = 400;
    const wh = 400;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = Graphics.height / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Window_GoldInfo.prototype.refresh = function () {
    const data = $gameSystem._ItemShop[this._shopId];
    const type = $gameSystem._ItemShop[this._shopId].type;
    const useItems = data.useItem;
    this.createContents();
    if (type) {
        const text_1 = '\\I[' + FlyCat.ItemGoldShop.goldIcon + ']' + TextManager.currencyUnit;
        this.drawTextEx('当前商店使用货币：' + text_1, 0, 20, this.width);
        this.drawTextEx('当前拥有货币数量：' + String($gameParty.gold()), 450, 20, this.width);
    } else {
        this.drawTextEx('当前商店使用货币：' + '\\I[' + useItems.iconIndex + ']' + useItems.name, 0, 20, this.width);
        this.drawTextEx('当前拥有货币数量：' + String($gameParty.numItems(useItems)), 450, 20, this.width);
    }
};
Window_GoldInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 25;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_ItemInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
    } else if (colorIndex == 6) {
        this.changeTextColor('#edbd28');
        this.contents.outlineColor = '#f6d160';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 1;
    }
};
Window_ItemInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.resetTextColor();
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
};

Window_ShopItemList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadBitmap = ImageManager.loadBitmap('img/shopUi/', 'listBack');
    this._shopId = $gameTemp._ItemGoldShopId;
    this.createCursorSprite();
    this._loadingPictrue = false;
    this.activate();
};

Window_ShopItemList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/shopUi/', 'cursor');
    this._cursorSprites.scale.set(0.8);
    this._clientArea.addChild(this._cursorSprites);
};

Cat.ShopCoreUi.Window_ShopItemList_update = Window_ShopItemList.prototype.update;
Window_ShopItemList.prototype.update = function () {
    Cat.ShopCoreUi.Window_ShopItemList_update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this.select(0);
        this._loadingPictrue = true;
    }
};
Cat.ShopCoreUi.Window_ShopItemList_select = Window_ShopItemList.prototype.select;
Window_ShopItemList.prototype.select = function (index) {
    Cat.ShopCoreUi.Window_ShopItemList_select.call(this, index)
    if (index != this._lastIndex && this._shopId >= 0) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_ShopItemList.prototype.numVisibleRows = function () {
    return 5;
};
Window_ShopItemList.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 8;
        const dy = rect.y - 12;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_ShopItemList.prototype.drawBackgroundRect = function (rect) {
};
Window_ShopItemList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 2;
        this._cursorSprites.y = this._cursorSprite.y + 42;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_ShopItemList.prototype.drawItem = function (index) {
    if ($gameSystem._ItemShop[this._shopId].type) {
        var useItemNumber = $gameParty.gold();
        var useItems = null;
    } else {
        var useItems = $gameSystem._ItemShop[this._shopId].useItem;
        var useItemNumber = $gameParty.numItems(useItems);
    }
    const rect = this.itemLineRect(index);
    if (index == this.index()) {
        this.drawCursorBitmap(rect, 0)
    } else {
        this.drawCursorBitmap(rect, 1)
    }
    const item = this._list[index];
    const itemColor = 0;
    const itemNumber = this._listNubmer[index]
    if (useItemNumber < itemNumber) {
        this.changeTextColor(ColorManager.textColor(10))//5.1
        this.contents.outlineColor = ColorManager.textColor(10);
        this.contents.outlineWidth = 0;
    }
    else if (Imported.FlyCat_CoreEngine) {
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
    }
    else {
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
    }
    if (item) {
        this.drawIcon(item.iconIndex, rect.x + 10, rect.y - 6);
        this.contents.fontSize = 22;
        this.drawText(item.name, rect.x + 36 + 10, rect.y - 10, this.width / this.maxCols(), 'left');
        this.contents.fontSize = 18;
        this.resetTextColor();
        if (useItemNumber < itemNumber) {
            this.changeTextColor(ColorManager.textColor(10))//5.1
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 0;
        }
        if (useItems) {
            // this.drawShopIcon(useItems.iconIndex, rect.x + this.itemWidth() - 48, rect.y + 16);
            var text = useItems.name + ':';
        } else {
            //  this.drawShopIcon(FlyCat.ItemGoldShop.goldIcon, rect.x + rect.width - 90, rect.y + 18);
            var text = '银两:'
        }
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(text + itemNumber, rect.x + 30, rect.y + 4, rect.width - 36, 'right');
        this.resetFontSettings();
    }
    this.resetTextColor();
};
Window_ShopItemList.prototype.drawShopIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 0.8;
    const sch = ph * 0.8;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};

Window_ShopItemList.prototype.maxCols = function () {
    return 3;
};

Window_ShopItemList.prototype.numVisibleRows = function () {
    return 4;
};

Window_ShopItemList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_ShopNumberInput.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._item = null;
    this._sell = false;
    this._max = 99;
    this._number = 1;
    this.createButtons();
    //  this.refresh();
    this.select(0);
};
Window_ShopNumberInput.prototype.refresh = function () {
    Window_Selectable.prototype.refresh.call(this);
    this.contents.fontSize = 20;
    this.drawItemBackground(0);
    this.drawGoldItem();
    this.drawCurrentItemName();
    this.drawNumber();
};
Window_ShopNumberInput.prototype.createButtons = function () {
    this._buttons = [];
    if (ConfigManager.touchUI) {
        for (const type of ["down2", "down", "up", "up2", "ok", "cancel"]) {
            const button = new Sprite_ShopButton(type);
            this._buttons.push(button);
            this.addInnerChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
        this._buttons[0].x = 2;
        this._buttons[0].y = 197;
        this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].x = 92;
        this._buttons[1].y = 197;
        this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[2].x = 233;
        this._buttons[2].y = 197;
        this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
        this._buttons[3].x = 274;
        this._buttons[3].y = 197;
        this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
        this._buttons[4].x = 26;
        this._buttons[4].y = 300;
        this._buttons[5].setClickHandler(this.onButtonCancel.bind(this));
        this._buttons[5].x = 200;
        this._buttons[5].y = 300;
    }
};
Window_ShopNumberInput.prototype.drawCurrentItemName = function () {
    const padding = this.itemPadding();
    const x = padding * 2;
    const y = this.itemNameY();
    const width = this.multiplicationSignX() - padding * 3;
    if (this._item) this.drawItemName(this._item, x + 30, y - 56, width);
};
Window_ShopNumberInput.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 18;
    this.resetTextColor();
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
};
Window_ShopNumberInput.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x, iconY);
        if (item.color) { this.changeTextColor(ColorManager.textColor(item.color)); }
        this.contents.fontSize = 28;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_ShopNumberInput.prototype.drawGoldItem = function () {
    const padding = this.itemPadding();
    const x = padding * 2;
    const y = this.itemNameY() - 80;
    const width = this.width - 25;
    if (this._item) {
        this.contents.fontSize = 22;
        const number = this._number;
        if (this._goldType == 0) {
            var gold = $gameParty.gold();
            var price = this._item.price * number;
            // this.drawTextEx('当前携带\\[' + FlyCat.ItemGoldShop.goldIcon + ']银两:  ' + gold, 0, 0, this.width, 'left');
            this.drawTextEx('消耗:' + '\\I[' + FlyCat.ItemGoldShop.goldIcon + ']银两:  ' + price, 24, 132, this.width, 'left')
        } else {
            var price = this._itemGold * number;
            var useItemNumber = $gameParty.numItems(this._useItem);
            //   this.drawTextEx('当前携带' + this._useItem.name + '数量:' + useItemNumber, 0, 0, this.width, 'left');
            this.drawTextEx('消耗:' + '\\I[' + this._useItem.iconIndex + ']' + this._useItem.name + ':  ' + price, 24, 132, this.width, 'left')
        }
        // this.drawItemName()
    };
    this.contents.fontSize = 22;
};
Window_ShopNumberInput.prototype.drawNumber = function () {
    const x = this.cursorX();
    const y = this.itemNameY();
    const width = this.cursorWidth() - this.itemPadding();
    this.resetTextColor();
    //   this.drawText('数量', -100, y + 42, this.width, "right");
    this.drawText(this._number, x - 178, y + 69, width + 48, "right");
};
Window_ShopNumberInput.prototype.itemRect = function () {
    const rect = new Rectangle();
    rect.x = this.cursorX() - 178;
    rect.y = this.itemNameY() + 66;
    rect.width = this.cursorWidth() + 48;
    rect.height = this.lineHeight() + 6;
    if (rect.width >= 91) {
        rect.width = 85;
        rect.x = this.cursorX() - 178 + 8;
    }
    return rect;
};
Window_ShopNumberInput.prototype.drawIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 0.8;
    const sch = ph * 0.8;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};
Window_ShopNumberInput.prototype.onButtonCancel = function () {
    this.processCancel();
};
Window_ShopNumberInput.prototype.processOk = function () {
    if (this._item) {
        var item = this._item;
    }
    if (!item) {
        SoundManager.playBuzzer();
    } else {
        var number = this._number;
        if (this._goldType == 0) {
            var price = item.price * number;
            var gold = $gameParty.gold();
            if (gold < price) {
                this._item = null;
                SoundManager.playBuzzer();
            } else {
                $gameParty.loseGold(price);
                $gameParty.gainItem(item, number);
                SoundManager.playShop();
            }
        } else {
            var price = this._itemGold * number;
            var useItemNumber = $gameParty.numItems(this._useItem);
            if (useItemNumber < price) {
                this._item = null;
                SoundManager.playBuzzer();
            } else {
                $gameParty.loseItem(this._useItem, price);
                $gameParty.gainItem(item, number);
                SoundManager.playShop();
            }
        }

    };
    this.refresh();
    this.deactivate();
    this.hide();
    SceneManager._scene._goldLsWindow.refresh();
    SceneManager._scene._shopItemListWindow.activate();
    SceneManager._scene._shopItemListWindow.refresh();
    SceneManager._scene._backgroundSprite_news.visible = false;
};
Window_ShopNumberInput.prototype.processCancel = function () {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
    SceneManager._scene._backgroundSprite_news.visible = false;
};
function Sprite_ShopButton() {
    this.initialize(...arguments);
}

Sprite_ShopButton.prototype = Object.create(Sprite_Button.prototype);
Sprite_ShopButton.prototype.constructor = Sprite_ShopButton;

Sprite_ShopButton.prototype.initialize = function (buttonType) {
    Sprite_Button.prototype.initialize.call(this, buttonType);
};
Sprite_ShopButton.prototype.loadButtonImage = function () {
    this.bitmap = ImageManager.loadBitmap('img/shopUi/', 'ButtonSet');
};
Sprite_ShopButton.prototype.buttonData = function () {
    const buttonTable = {
        cancel: { x: 9, w: 3 },
        pageup: { x: 2, w: 1 },
        pagedown: { x: 3, w: 1 },
        down: { x: 4, w: 1 },
        up: { x: 5, w: 1 },
        down2: { x: 0, w: 2 },
        up2: { x: 2, w: 2 },
        ok: { x: 6, w: 3 },
        menu: { x: 9, w: 1 }
    };
    //  console.log(this._buttonType, buttonTable[this._buttonType])
    return buttonTable[this._buttonType];
};

Sprite_ShopButton.prototype.updateOpacity = function () {
    this.opacity = 255;
};