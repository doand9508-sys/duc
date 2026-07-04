//=============================================================================
// RPG Maker MZ - 更新公告
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<更新公告>
 * @author Cat
 * 
 * @param data
 * @text 数据设置
 * @type struct<AfficheData>[]
 * @default []
 * 
 * @param backGround
 * @text 背景
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @param listBackGround
 * @text 列表背景
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @param cursor
 * @text 列表光标
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @param look
 * @text 已阅图片
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @param nolook
 * @text 未阅图片
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @param close
 * @text 关闭图片
 * @require 1
 * @dir img/affiche/
 * @type file
 * 
 * @help
 * 在img/下创建affiche文件夹
 * 将图片放入affiche文件夹下
 */

/*~struct~AfficheData:
@param name
@text 公告名称
@type string

@param img
@text 公告图片
@require 1
@dir img/affiche/
@type file
*/

'use strict';
var Imported = Imported || {};
Imported.Cat_Affiche = true;

var Cat = Cat || {};
Cat.Affiche = {};
Cat.Affiche.parameters = PluginManager.parameters('Cat_Affiche');
Cat.Affiche.backGround = String(Cat.Affiche.parameters['backGround']);
Cat.Affiche.listBackGround = String(Cat.Affiche.parameters['listBackGround']);
Cat.Affiche.cursor = String(Cat.Affiche.parameters['cursor']);
Cat.Affiche.look = String(Cat.Affiche.parameters['look']);
Cat.Affiche.nolook = String(Cat.Affiche.parameters['nolook']);
Cat.Affiche.close = String(Cat.Affiche.parameters['close']);
Cat.Affiche.data = JSON.parse(Cat.Affiche.parameters['data'] || '[]');

if (Cat.Affiche.data) {
    const max = Cat.Affiche.data.length;
    for (let i = 0; i < max; i++) {
        Cat.Affiche.data[i] = JSON.parse(Cat.Affiche.data[i])
        Cat.Affiche.data[i].id = i;
    };
};

Cat.Affiche.Scene_LL_Title_createMenuButtons = Scene_LL_Title.prototype.createMenuButtons;
Scene_LL_Title.prototype.createMenuButtons = function () {
    Cat.Affiche.Scene_LL_Title_createMenuButtons.call(this);
    $gameTemp._showAfficheList = [];
    $gameTemp._showReadAfficheList = [];
    if (Cat.Affiche.data && Cat.Affiche.data.length > 0) {
        if (!ConfigManager._affiche) {
            ConfigManager._affiche = [];
        }
        for (let s = 0; s < Cat.Affiche.data.length; s++) {
            const element = Cat.Affiche.data[s];
            if (ConfigManager._affiche[s]) {
                $gameTemp._showReadAfficheList.push(element);
            } else {
                $gameTemp._showAfficheList.push(element);
            };
        };
    };
    this.createAfficheBackGroundSprite();
    this.createAfficheWindow();
    this.createInfoSprite();
    this.createCancelSprite();
};
Scene_LL_Title.prototype.createCancelSprite = function () {
    this._cancelButtonSprite = new Sprite_CancelAfficheButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.close);
    this._cancelButtonSprite.x = 1026;
    this._cancelButtonSprite.y = 111;
    this._cancelButtonSprite.setClickHandler(this.cancelAffiche.bind(this));
    this._cancelButtonSprite.hide();
};

Scene_LL_Title.prototype.createInfoSprite = function () {
    this._afficheInfoSprtie = new Sprite();
    this.addChild(this._afficheInfoSprtie);
    this._afficheInfoSprtie.hide();
};

Scene_LL_Title.prototype.createAfficheBackGroundSprite = function () {
    this._afficheBackSprtie = new Sprite();
    this.addChild(this._afficheBackSprtie);
    this._afficheBackSprtie.bitmap = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.backGround);
    this._afficheBackSprtie.hide();
};

Scene_LL_Title.prototype.createAfficheWindow = function () {
    const rect = this.afficheListWindowRect();
    this._afficheListWindow = new Window_AffichetList(rect);
    this._afficheListWindow.setHandler("cancel", this.cancelAffiche.bind(this));
    this.addChild(this._afficheListWindow);
    this._afficheListWindow.deactivate();
    this._afficheListWindow.hide();
};

Scene_LL_Title.prototype.showAfficheWindow = function () {
    this._afficheInfoSprtie.show();
    this._afficheBackSprtie.show();
    this._afficheListWindow.show();
    this._cancelButtonSprite.show();
    this._afficheListWindow.refresh();
    this._afficheListWindow.activate();
    this._moveIndex = 0;
    this._afficheListWindow.select(this._moveIndex);
};

Scene_LL_Title.prototype.hideAfficheWindow = function () {
    this._afficheInfoSprtie.hide();
    this._afficheBackSprtie.hide();
    this._afficheListWindow.hide();
    this._cancelButtonSprite.hide();
};

Scene_LL_Title.prototype.afficheListWindowRect = function () {
    const ww = 260;
    const wh = 360;
    const wx = 226;
    const wy = 180;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Title.prototype.cancelAffiche = function () {
    this._afficheListWindow.deactivate();
    this.hideAfficheWindow();
    this._afficheInfoSprtie.bitmap = '';
    this._commandWindow.activate();
    this._flyOnCommand = 0;
};

function Window_AffichetList() {
    this.initialize(...arguments);
};

Window_AffichetList.prototype = Object.create(Window_Selectable.prototype);
Window_AffichetList.prototype.constructor = Window_AffichetList;

Window_AffichetList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._lastIndex = -1;
    this._list = [];
    this._loadBitmap = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.listBackGround);
    this._loadBitmap_1 = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.look);
    this._loadBitmap_2 = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.nolook);
    this.createCursorSprite();
}

Window_AffichetList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/affiche/', Cat.Affiche.cursor);
    this._clientArea.addChild(this._cursorSprites);
};

Window_AffichetList.prototype.refresh = function () {
    if (!$gameTemp._showAfficheList || !$gameTemp._showAfficheList) {
        return;
    }
    this.createContents();
    this._list = [];
    const data = $gameTemp._showAfficheList.concat($gameTemp._showReadAfficheList);
    const max = data.length;
    for (let i = 0; i < max; i++) {
        if (data[i]) {
            this._list.push(data[i]);
        };
    };
    this.drawAllItems();
};

Cat.Affiche.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function () {
    const config = Cat.Affiche.ConfigManager_makeData.call(this);
    config._affiche = this._affiche;
    return config;
};

Cat.Affiche.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function (config) {
    Cat.Affiche.ConfigManager_applyData.call(this, config)
    this._affiche = config._affiche ? config._affiche : [];
};

Window_AffichetList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (this._loadBitmap && this._loadBitmap.isReady() &&
        this._loadBitmap_1 && this._loadBitmap_1.isReady() && this._loadBitmap_2 && this._loadBitmap_2.isReady()) {
        this.refresh();
    }
    const index = this.index();
    const item = this._list[index];
    if (item) {
        if (!ConfigManager._affiche) {
            ConfigManager._affiche = [];
        }
        if (!ConfigManager._affiche.includes(item.id)) {
            ConfigManager._affiche[item.id] = true;
            ConfigManager.save();
        }

    }
    if (item && index != this._lastIndex) {
        const img = item.img;
        if (img) {
            SceneManager._scene._afficheInfoSprtie.bitmap = ImageManager.loadBitmap('img/affiche/', img);
            this._lastIndex = index;
        }
    };
};

Window_AffichetList.prototype.drawItem = function (index) {
    this.contents.fontSize = 24;
    const item = this._list[index];
    const rect = this.itemLineRect(index);
    if (item) {
        this.drawCursorBitmap(rect);
        this.contents.outlineWidth = 0;
        if (ConfigManager._affiche && ConfigManager._affiche[item.id] == true) {
            this.drawLookBitmap(rect);
        } else {
            this.drawNoLookBitmap(rect);
        }
        this.drawText(item.name, rect.x - 10, rect.y + 4, rect.width, 'center')
    };
};

Window_AffichetList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y - 16;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    };
};

Window_AffichetList.prototype.drawLookBitmap = function (rect) {
    const bitmap = this._loadBitmap_1;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 130;
        const dy = rect.y + 32;
        const sx = 0;
        const sy = 0;
        const sw = 0.5 * pw;
        const sh = 0.5 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, sw, sh);
    };
};

Window_AffichetList.prototype.drawNoLookBitmap = function (rect) {
    const bitmap = this._loadBitmap_2;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 170;
        const dy = rect.y - 8;
        const sx = 0;
        const sy = 0;
        const sw = 0.5 * pw;;
        const sh = 0.5 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, sw, sh);
    };
};

Window_AffichetList.prototype.drawBackgroundRect = function (rect) {
};

Window_AffichetList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

Window_AffichetList.prototype.maxCols = function () {
    return 1;
};

Window_AffichetList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_AffichetList.prototype.numVisibleRows = function () {
    return 4;
};

Window_AffichetList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x - 50;
    this._cursorSprite.y = this._cursorRect.y + 20;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y;
    } else {
        this._cursorSprites.visible = false;
    }
};

function Sprite_CancelAfficheButton() {
    this.initialize(...arguments);
}
Sprite_CancelAfficheButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_CancelAfficheButton.prototype.constructor = Sprite_CancelAfficheButton;

Sprite_CancelAfficheButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._lastBimap = null;
    this._pressCounts = 0;
};

Sprite_CancelAfficheButton.prototype.onClick = function () {
    SoundManager.playCancel()
    if (this._clickHandler) {
        this._clickHandler();
    }
};

Sprite_CancelAfficheButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (!this.visible) {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};

Sprite_CancelAfficheButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Sprite_CancelAfficheButton.prototype.onMouseEnter = function () {
    SoundManager.playCursor();
    this._colorTone = [50, 50, 50, 0]
    this._updateColorFilter();
};
Sprite_CancelAfficheButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
};