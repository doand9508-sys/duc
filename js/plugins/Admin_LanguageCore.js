//=============================================================================
// RPG Maker MZ - 多語言系統
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 <多語言系統>
 * @author Admin
 * 
 * @param language
 * @text 設置語言種類
 * @type struct<languageData>[]
 * @desc 設置語言種類
 * @default 
 * 
 * @param x
 * @type number
 * @default 0
 * @text 語言图标X位置
 * @desc 語言图标X位置
 * 
 * @param y
 * @type number
 * @default 0
 * @text 語言图标Y位置
 * @desc 語言图标Y位置
 * 
 * @help
 */

/*~struct~languageData:
@param name
@text 語言名称
@type string

@param dataName
@text data文件後綴
@type string

@param type
@text 語言類型
@type select
@option 简体
@value 1
@option 繁體
@value 2
@option 英語
@value 3
@option 日語
@value 4

@param mainFont
@text 主語言字體
@type string
@default 

@param numberFont
@text 數字字體
@type string
@default 
*/

'use strict';
var Imported = Imported || {};
Imported.Admin_LanguageCore = true;

var C = C || {};
Admin.LanguageCore = {};
Admin.LanguageCore.parameters = PluginManager.parameters('Admin_LanguageCore');
Admin.LanguageCore.language = JSON.parse(Admin.LanguageCore.parameters['language'] || '[]');
Admin.LanguageCore.x = Number(Admin.LanguageCore.parameters['x'] || 0);
Admin.LanguageCore.y = Number(Admin.LanguageCore.parameters['y'] || 0);

if (Admin.LanguageCore.language) {
    const max = Admin.LanguageCore.language.length;
    for (let i = 0; i < max; i++) {
        Admin.LanguageCore.language[i] = JSON.parse(Admin.LanguageCore.language[i])
        Admin.LanguageCore.language[i].id = i;
        Admin.LanguageCore.language[i].type = Number(Admin.LanguageCore.language[i].type);
    }
    //console.log(C.LanguageCore.language)
};

/*繁体文本强制替换*/
const twLanguage = {};

twLanguage["斗"] = "鬥";
twLanguage["灵力："] = "靈力：";
twLanguage["云霓大陆"] = "雲霓大陆";
twLanguage["流云城"] = "流雲城";
twLanguage["针"] = "针";
twLanguage["怒气"] = "怒氣";
twLanguage["投喂"] = "投餵";

/*英语文本强制替换*/
const enLanguage = {
    "姓名：": "Name：",
}

/*日语文本强制替换*/
const jpLanguage = {};


DataManager.loadDataFile = function (name, src) {
    const xhr = new XMLHttpRequest();
    var language = JSON.parse(localStorage.getItem('GameLanguage'));
    var file = '';
    if (language) {
        var file = language.dataName;
    }
    const url = "data" + file + "/" + src;
    window[name] = null;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");
    xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
    xhr.onerror = () => this.onXhrError(name, src, url);
    xhr.send();
};

function getLanguageText(text, data) {
    text = String(text)
    if (data && data[text]) {
        text = data[text];
        text = text.replace(/\\n(?!\w)/g, '\n');
        return text;
    } else {
        if (data) {
            text = replaceWithTraditional(text, data);
        }
        return text;
    }
};

function replaceWithTraditional(text, mapping) {
    const keys = Object.keys(mapping);
    keys.sort((a, b) => b.length - a.length);
    const escapedKeys = keys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(escapedKeys.join('|'), 'g');
    return text.replace(regex, matched => mapping[matched]);
}

function getLanguageId(id) {
    for (let i = 0; i < Admin.LanguageCore.language.length; i++) {
        if (Admin.LanguageCore.language[i].type == id) {
            return Admin.LanguageCore.language[i];
        }
    }
    return null;
};

Admin.LanguageCore.Scene_Boot_initialize = Scene_Boot.prototype.initialize;
Scene_Boot.prototype.initialize = function () {
    Admin.LanguageCore.Scene_Boot_initialize.call(this);
    this.initializeLanguage();
};

Scene_Boot.prototype.initializeLanguage = function () {
    if (!localStorage.getItem('GameLanguage')) {
        var language = null;
        if (navigator.appName == 'Netscape') {
            language = navigator.language;
        } else {
            language = navigator.browserLanguage;
        }
        if (language.indexOf('zhtw') > -1) {
            var data = getLanguageId(2);
        } else if (language.indexOf('zh') > -1) {
            var data = getLanguageId(1);
        } else if (language.indexOf('ja') > -1) {
            var data = getLanguageId(4);
        } else {
            var data = getLanguageId(3);
        };
        if (data) {
            localStorage.removeItem('GameLanguage');
            localStorage.setItem('GameLanguage', JSON.stringify(data));
        }
    }
};

Admin.LanguageCore.Scene_Boot_startNormalGame = Scene_Boot.prototype.startNormalGame;
Scene_Boot.prototype.startNormalGame = function () {
    if (!localStorage.getItem('GameLanguage')) {
        SceneManager.push(Scene_Language);
    } else {
        Admin.LanguageCore.Scene_Boot_startNormalGame.call(this);
    }
};

Admin.LanguageCore.Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
Scene_Boot.prototype.loadGameFonts = function () {
    if (localStorage.getItem('GameLanguage')) {
        FontManager._urls = {};
        FontManager._states = {};
        const data = JSON.parse(localStorage.getItem('GameLanguage'))
        $dataSystem.advanced.mainFontFilename = data.mainFont;
        $dataSystem.advanced.numberFontFilename = data.numberFont;
        const advanced = $dataSystem.advanced;
        FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
        FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
    } else {
        Admin.LanguageCore.Scene_Boot_loadGameFonts.call(this);
    }
};

Admin.LanguageCore.Bitmap_drawText = Bitmap.prototype.drawText;
Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
    if (localStorage.getItem('GameLanguage')) {
        const data = JSON.parse(localStorage.getItem('GameLanguage'))
        if (data) {
            if (data.type == 2) {
                var lg = twLanguage;
            } else if (data.type == 3) {
                var lg = enLanguage;
            } else if (data.type == 4) {
                var lg = jpLanguage;
            } else {
                var lg = null;
            }
            if (lg) {
                var text = getLanguageText(text, lg);
            }
        }
        Admin.LanguageCore.Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align)
    } else {
        Admin.LanguageCore.Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align)
    }
};

Admin.LanguageCore.Window_Base_drawTextEx = Window_Base.prototype.drawTextEx;
Window_Base.prototype.drawTextEx = function (text, x, y, width) {
    if (localStorage.getItem('GameLanguage')) {
        const data = JSON.parse(localStorage.getItem('GameLanguage'))
        if (data) {
            if (data.type == 2) {
                var lg = twLanguage;
            } else if (data.type == 3) {
                var lg = enLanguage;
            } else if (data.type == 4) {
                var lg = jpLanguage;
            } else {
                var lg = null;
            }
            if (lg) {
                var text = getLanguageText(text, lg);
            }
        }
        return Admin.LanguageCore.Window_Base_drawTextEx.call(this, text, x, y, width);
    } else {
        return Admin.LanguageCore.Window_Base_drawTextEx.call(this, text, x, y, width);
    }
};

Admin.LanguageCore.Scene_LL_Title_createMenuButtons = Scene_LL_Title.prototype.createMenuButtons;
Scene_LL_Title.prototype.createMenuButtons = function () {
    Admin.LanguageCore.Scene_LL_Title_createMenuButtons.call(this);
    this._languageButtonSprite = new Sprite_languageButton();
    this._languageButtonSprite.setClickHandler(this.openLanguage.bind(this));
    this.addChild(this._languageButtonSprite);
    this._languageButtonSprite.hide();
    this._languageButtonSprite.x = Admin.LanguageCore.x;
    this._languageButtonSprite.y = Admin.LanguageCore.y;
    var language = JSON.parse(localStorage.getItem('GameLanguage'));
    if (language) {
        var img = language.dataName;
    } else {
        var img = '';
    }
    this._languageButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'languageButton' + img);
};

Scene_LL_Title.prototype.openLanguage = function () {
    if (!SceneManager._scene._afficheListWindow.visible) {
        SceneManager.push(Scene_Language);
    }
};

function Sprite_languageButton() {
    this.initialize(...arguments);
}
Sprite_languageButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_languageButton.prototype.constructor = Sprite_languageButton;

Sprite_languageButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._lastBimap = null;
    this._pressCounts = 0;
};

Sprite_languageButton.prototype.onClick = function () {
    if (SceneManager._scene._flyOnCommand == 0 && !SceneManager._scene._afficheListWindow.visible) {
        SoundManager.playOk()
        if (this._clickHandler) {
            this._clickHandler();
        }
    };
};

Sprite_languageButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Sprite_languageButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._flyOnCommand == 0 && !SceneManager._scene._afficheListWindow.visible) {
        SoundManager.playCursor();
        this._colorTone = [50, 50, 50, 0]
        this._updateColorFilter();
    }
};

Sprite_languageButton.prototype.onMouseExit = function () {
    if (SceneManager._scene._flyOnCommand == 0 && !SceneManager._scene._afficheListWindow.visible) {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};

function Scene_Language() {
    this.initialize(...arguments);
}

Scene_Language.prototype = Object.create(Scene_Base.prototype);
Scene_Language.prototype.constructor = Scene_Language;

Scene_Language.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Language.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createLanguageList();
};

Scene_Language.prototype.createLanguageList = function () {
    const rect = this.languageListWindowRect();
    this._languageListWindow = new Window_LanguageList(rect);
    this._languageListWindow.setHandler("ok", this.okLanguage.bind(this));
    //  this._languageListWindow.setHandler("cancel", this.popScene.bind(this));
    this.addChild(this._languageListWindow);
    this._languageListWindow.activate();
    this._languageListWindow.select(0);
    this._languageListWindow.refresh();
};

Scene_Language.prototype.okLanguage = function () {
    if (!this._languageListWindow.item()) {
        this._languageListWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    localStorage.removeItem('GameLanguage');
    const data = JSON.stringify(this._languageListWindow.item());
    localStorage.setItem('GameLanguage', data);
    SoundManager.playUseItem();
    Cat.ItemCore._loadAlone = false;
    SceneManager.goto(Scene_Boot);
};

Scene_Language.prototype.languageListWindowRect = function () {
    const n = Admin.LanguageCore.language.length + 1;
    const ww = 400;
    const wh = n * 40 + 30;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_LanguageList() {
    this.initialize(...arguments);
};

Window_LanguageList.prototype = Object.create(Window_Selectable.prototype);
Window_LanguageList.prototype.constructor = Window_LanguageList;

Window_LanguageList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 255;
    this._list = [];
    this.refresh();
};

Window_LanguageList.prototype.updateBackOpacity = function () {
    this.backOpacity = 255;
};

Window_LanguageList.prototype.resetFontSettings = function () {
    this.contents.fontFace = "rmmz-mainfont, Microsoft Yahei, PingFang SC, sans-serif";
    this.contents.fontSize = 24;
    this.resetTextColor();
}

Window_LanguageList.prototype.updateTone = function () {
    const tone = [0, 0, 0];
    this.setTone(tone[0], tone[1], tone[2]);
};

Window_LanguageList.prototype.updatePadding = function () {
    this.padding = 10;
};

Window_LanguageList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
};

Window_LanguageList.prototype.maxCols = function () {
    return 1;
};

Window_LanguageList.prototype.item = function () {
    return this._list[this.index()];
};

Window_LanguageList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

Window_LanguageList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_LanguageList.prototype.numVisibleRows = function () {
    return 3;
};

Window_LanguageList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    this._list = Admin.LanguageCore.language;
    if (this._list.length > 0) {
        this.drawAllItems();
    }
};

Window_LanguageList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawText(item.name, rect.x, rect.y, rect.width, 'center');
    };
};
