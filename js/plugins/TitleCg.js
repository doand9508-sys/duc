//=============================================================================
// RPG Maker MZ - TitleCg
//=============================================================================

/*:
 * @target MZ
 * @plugindesc TitleCg
 * @author Admin
 * 
 * @param data
 * @text CG设置
 * @type struct<cgData>[]
 * @default
 * 
 * @command openLock
 * @text 解锁指定Cg
 * @desc 解锁指定Cg
 *
 * @arg id
 * @type number
 * @min 1
 * @text CgId
 * @desc CgId
 * 
 * @help
 * 强制占用变量1000
 */

/*~struct~cgData:
@param img
@text 标题CG
@require 1
@dir img/pictures/
@type file

@param eventId
@type common_event
@min 1
@text 执行公共事件id
@desc 执行公共事件id
*/

var Imported = Imported || {};
Imported.TitleCg = true;

var A = A || {};
A.TitleCg = {};
A.TitleCg.parameters = PluginManager.parameters('TitleCg');
A.TitleCg.data = JSON.parse(A.TitleCg.parameters['data'] || '[]');

if (A.TitleCg.data) {
    const max = A.TitleCg.data.length;
    for (let i = 0; i < max; i++) {
        A.TitleCg.data[i] = JSON.parse(A.TitleCg.data[i])
        A.TitleCg.data[i].eventId = JSON.parse(A.TitleCg.data[i].eventId) || 0
    };
};

PluginManager.registerCommand('TitleCg', 'openLock', args => {
    const id = Number(args.id);
    DataManager.SaveRecall(id);
});

A.TitleCg.Scene_LL_Title_create = Scene_LL_Title.prototype.create;
Scene_LL_Title.prototype.create = function () {
    A.TitleCg.Scene_LL_Title_create.call(this);
    A.TitleCg.data.forEach((item) => {
        if (item) {
            ImageManager.loadBitmap('img/pictures/', item.img);
        }
    })
};

Scene_LL_Title.prototype.commandReading = function () {
    SceneManager.push(Scene_TitleCg);
};

A.TitleCg.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_TitleCg) {
        this.opacity = 0;
    } else {
        A.TitleCg.Sprite_Button_updateOpacity.call(this);
    }
};

function Scene_TitleCg() {
    this.initialize(...arguments);
}

Scene_TitleCg.prototype = Object.create(Scene_Message.prototype);
Scene_TitleCg.prototype.constructor = Scene_TitleCg;

Scene_TitleCg.prototype.initialize = function () {
    Scene_Message.prototype.initialize.call(this);
    Input.keyMapper[84] = 't';
    this._onPressing = false;
    this._selectIndex = 1;
    this._maxSelectIndex = Math.ceil(A.TitleCg.data.length / 15);
};

Scene_TitleCg.prototype.createBackground = function () {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this._backgroundSprite_new = new Sprite();
    this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'backGround');
    this.addChild(this._backgroundSprite_new);
};

Scene_TitleCg.prototype.create = function () {
    Scene_Message.prototype.create.call(this);
    this.createBackground();
    this._interpreter = new Game_Interpreter();
    this._interpreter.clear();
    this.createListWindow();
    this.createSprite();
    this.createDisplayObjects();
};

Scene_TitleCg.prototype.createDisplayObjects = function () {
    this.createWindowLayer();
    this.createAllWindows();
};

Scene_TitleCg.prototype.createAllWindows = function () {
    this.createSpriteset();
    this.createMessageWindow();
    this.createScrollTextWindow();
    this.createGoldWindow();
    this.createNameBoxWindow();
    this.createChoiceListWindow();
    this.createNumberInputWindow();
    this.createEventItemWindow();
    this.associateWindows();
};

Scene_TitleCg.prototype.createMessageWindow = function () {
    const rect = this.messageWindowRect();
    this._messageWindow = new Window_Message(rect);
    this.addChild(this._messageWindow);
};

Scene_TitleCg.prototype.createSpriteset = function () {
    this._spriteset = new Spriteset_Cg();
    this.addChild(this._spriteset);
};

Scene_TitleCg.prototype.update = function () {
    Scene_Message.prototype.update.call(this);
    if (Input.isTriggered('t') && this._messageWindow) {
        this._messageWindow.visible = !this._messageWindow.visible;

    };
    this._interpreter.update();
    if (this._interpreter.isRunning()) {
        return;
    }
    this.setupBattleEvent();
    if (this._interpreter.isRunning()) {
        return;
    }
};

Scene_TitleCg.prototype.setupBattleEvent = function () {
    if (!this._interpreter.isRunning()) {
        if (this._interpreter.setupReservedCommonEvent()) {
            return;
        }
    }
};

Scene_TitleCg.prototype.createSprite = function () {
    if (!this._mainSprite) {
        this._mainSprite = new Sprite();
        this.addChild(this._mainSprite);
        var x = 70;
        var y = 190;
        var xcounts = 0
        for (let i = 1; i < 16; i++) {
            const sprite = new Sprite_CgButton(i);
            sprite._buttonId = i;
            this._mainSprite.addChild(sprite);
            sprite.x = x;
            sprite.y = y;
            sprite.oldx = x;
            sprite.oldy = y;
            xcounts++;
            if (xcounts == 5) {
                var x = 70;
                y += 141;
                xcounts = 0;
            } else {
                x += 224;
            }
        };
        this._leftSprite = new Sprite_CgButton_Left();
        this.addChild(this._leftSprite);
        this._leftSprite.x = 1010;
        this._leftSprite.y = 636;
        this._rightSprite = new Sprite_CgButton_Right();
        this.addChild(this._rightSprite);
        this._rightSprite.x = 1165;
        this._rightSprite.y = 636;

        this._textSprite = new Sprite();
        this.addChild(this._textSprite);
        this._textSprite.x = 1012;
        this._textSprite.y = 588;

        this._textBitmap = new Bitmap(150, 140)
        this._textBitmap.fontSize = 30;
        this._textBitmap.addLoadListener(this.loadTextBitmap.bind(this));

    }
    this._mainSprite.children.forEach((item) => {
        if (item) {
            if (A.TitleCg.data[item._buttonId - 1]) {
                item.setImg(A.TitleCg.data[item._buttonId - 1].img);
            }
        };
    });

    this._blackSprite = new Sprite();
    this.addChild(this._blackSprite);
    this._blackSprite.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'black');
    this._blackSprite.visible = false;
    this._blackSprite.anchor.set(0.5);
    this._blackSprite.x = Graphics.width / 2;
    this._blackSprite.y = Graphics.height / 2;

    this._bigSprite = new Sprite();
    this.addChild(this._bigSprite);
    this._bigSprite.alpha = 0;
    this._bigSprite.anchor.set(0.5);
    this._bigSprite.x = Graphics.width / 2;
    this._bigSprite.y = Graphics.height / 2;
};

Scene_TitleCg.prototype.loadTextBitmap = function (bitmap) {
    if (bitmap && bitmap.isReady()) {
        bitmap.clear();
        bitmap.fontFace = $gameSystem.mainFontFace()
        bitmap.fontSize = 30;
        bitmap.textColor = ColorManager.textColor(0);
        bitmap.outlineColor = ColorManager.textColor(15);
        bitmap.outlineWidth = 3;
        bitmap.drawText(this._selectIndex + '/' + this._maxSelectIndex, 0, 0, 150, 140, 'center');
        this._textSprite.bitmap = bitmap;
    };
}

Scene_TitleCg.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_CgList(rect);
    this._listWindow.setHandler("cancel", this.cancelCg.bind(this));
    this.addChild(this._listWindow);
    this._listWindow.activate();
};

Scene_TitleCg.prototype.cancelCg = function () {
    if (this._interpreter.isRunning()) {
        this._listWindow.activate();
        return;
    }
    this.popScene();
};

Scene_TitleCg.prototype.listWindowRect = function () {
    const ww = 400;
    const wh = 414;
    const wx = 2000;
    const wy = 210;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_TitleCg.prototype.leftCg = function () {
    if (this._selectIndex - 1 <= 0) {
        this._selectIndex = this._maxSelectIndex;
    } else {
        this._selectIndex--;
    }
    this._textSprite.bitmap.clear();
    this._textSprite.bitmap.drawText(this._selectIndex + '/' + this._maxSelectIndex, 0, 0, 150, 140, 'center');
    this._mainSprite.children.forEach((item) => {
        if (item) {
            var index = item._buttonId - 1;
            var addIndex = (this._selectIndex - 1) * 15
            index += addIndex;
            if (A.TitleCg.data[index]) {
                if (ConfigManager._recalls && ConfigManager._recalls[item._buttonId + addIndex]) {
                    item._lockSprite.visible = false;
                } else {
                    item._lockSprite.visible = true;
                }
                item.visible = true;
                item.setImg(A.TitleCg.data[index].img);
            } else {
                item.visible = false;
                item.setImg('');
            }
        };
    });
};

Scene_TitleCg.prototype.rightCg = function () {
    if (this._selectIndex + 1 > this._maxSelectIndex) {
        this._selectIndex = 1;
    } else {
        this._selectIndex++;
    }
    this._textSprite.bitmap.clear();
    this._textSprite.bitmap.drawText(this._selectIndex + '/' + this._maxSelectIndex, 0, 0, 150, 140, 'center');
    this._mainSprite.children.forEach((item) => {
        if (item) {
            var index = item._buttonId - 1;
            var addIndex = (this._selectIndex - 1) * 15
            index += addIndex;
            if (A.TitleCg.data[index]) {
                if (ConfigManager._recalls && ConfigManager._recalls[item._buttonId + addIndex]) {
                    item._lockSprite.visible = false;
                } else {
                    item._lockSprite.visible = true;
                }
                item.visible = true;
                item.setImg(A.TitleCg.data[index].img);
            } else {
                item.visible = false;
                item.setImg('');
            }
        };
    });
};

function Window_CgList() {
    this.initialize(...arguments);
};

Window_CgList.prototype = Object.create(Window_Selectable.prototype);
Window_CgList.prototype.constructor = Window_CgList;

Window_CgList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._list = [];
}

Scene_TitleCg.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 110;
    this._cancelButton.y = this.buttonY() + 50;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1);
    this._cancelButton.opacity = 0;
};

function Sprite_CgButton() {
    this.initialize(...arguments);
}
Sprite_CgButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_CgButton.prototype.constructor = Sprite_CgButton;

Sprite_CgButton.prototype.initialize = function (i) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._img = '';
    this._onPressing = false;
    this._endPressing = false;
    this._buttonId = i;
    this._mainSprite = new Sprite();
    this.addChild(this._mainSprite);
    this._mainSprite.x = 15;
    this._mainSprite.y = 10;
    this._mainSprite.scale.x = 0.15;
    this._mainSprite.scale.y = 0.15;
    this._mainSprite.visible = false;
    this._lockSprite = new Sprite();
    this.addChild(this._lockSprite);
    this._lockSprite.visible = true;
    this._lockSprite.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'lock');
    if (ConfigManager._recalls && ConfigManager._recalls[this._buttonId]) {
        this._lockSprite.visible = false;
    }
    this.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'back');
};

Sprite_CgButton.prototype.setImg = function (img) {
    this._img = img;
    this._mainSprite.bitmap = ImageManager.loadBitmap('img/pictures/', img);
    this._mainSprite.visible = !this._lockSprite.visible;
};

Sprite_CgButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    if (SceneManager._scene._onPressing && this._onPressing && this._endPressing == false) {
        var sprite = SceneManager._scene._bigSprite;
        SceneManager._scene._blackSprite.visible = true;
        sprite.bitmap = ImageManager.loadBitmap('img/pictures/', this._img);
        if (sprite.bitmap && sprite.bitmap.isReady()) {
            sprite.alpha += 0.02;
            if (sprite.alpha >= 1) {
                sprite.alpha = 1;
                if (TouchInput.isTriggered() || Input.isTriggered("ok") || TouchInput.isCancelled()) {
                    this._endPressing = true;
                }
            }
        }
    };
    if (this._endPressing) {
        var sprite = SceneManager._scene._bigSprite;
        sprite.alpha -= 0.06;
        if (sprite.alpha <= 0) {
            sprite.alpha = 0;
            SceneManager._scene._blackSprite.visible = false;
            SceneManager._scene._onPressing = false;
            SceneManager._scene._listWindow.activate();
            this._onPressing = false;
            this._endPressing = false;
        }
    }
};

Sprite_CgButton.prototype.onClick = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    };

    if (this._lockSprite.visible) {
        SoundManager.playBuzzer();
        return;
    }
    SoundManager.playOk();
    var index = this._buttonId - 1;
    var addIndex = (SceneManager._scene._selectIndex - 1) * 15;
    if (A.TitleCg.data[index + addIndex] && A.TitleCg.data[index + addIndex].eventId) {
        $gameTemp.reserveCommonEvent(A.TitleCg.data[index + addIndex].eventId);
    }
    // SceneManager._scene._onPressing = true;
    // SceneManager._scene._listWindow.deactivate();
    // this._onPressing = true;
};

Sprite_CgButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    this._colorTone = [50, 50, 50, 0]
    this.y = this.oldy - 10;
    this._updateColorFilter();
};

Sprite_CgButton.prototype.onMouseExit = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    this._colorTone = [0, 0, 0, 0]
    this.y = this.oldy;
    this.scale.set(1)
    this._updateColorFilter();
};

function Sprite_CgButton_Left() {
    this.initialize(...arguments);
}
Sprite_CgButton_Left.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_CgButton_Left.prototype.constructor = Sprite_CgButton_Left;

Sprite_CgButton_Left.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'button');
    this.setFrame(0, 0, 46, 46);
};

Sprite_CgButton_Left.prototype.onClick = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    SoundManager.playCursor();
    SceneManager._scene.leftCg();
};

Sprite_CgButton_Left.prototype.onMouseEnter = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    SoundManager.playCursor();
    this.setFrame(0, 46, 46, 46);
};

Sprite_CgButton_Left.prototype.onMouseExit = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    this._colorTone = [0, 0, 0, 0]
    this.setFrame(0, 0, 46, 46);
    this._updateColorFilter();
};

function Sprite_CgButton_Right() {
    this.initialize(...arguments);
}
Sprite_CgButton_Right.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_CgButton_Right.prototype.constructor = Sprite_CgButton_Right;

Sprite_CgButton_Right.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadBitmap('img/newUi/cg/', 'button');
    this.scale.x = -1;
    this.setFrame(0, 0, 46, 46);
};

Sprite_CgButton_Right.prototype.onClick = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    SoundManager.playCursor();
    SceneManager._scene.rightCg();
};

Sprite_CgButton_Right.prototype.onMouseEnter = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    SoundManager.playCursor();
    this.setFrame(0, 46, 46, 46);
};

Sprite_CgButton_Right.prototype.onMouseExit = function () {
    if (SceneManager._scene._onPressing || SceneManager._scene._interpreter.isRunning()) {
        return;
    }
    this._colorTone = [0, 0, 0, 0]
    this.setFrame(0, 0, 46, 46);
    this._updateColorFilter();
};

function Spriteset_Cg() {
    this.initialize(...arguments);
}

Spriteset_Cg.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Cg.prototype.constructor = Spriteset_Cg;

Spriteset_Cg.prototype.initialize = function () {
    Spriteset_Base.prototype.initialize.call(this);
};

Spriteset_Cg.prototype.loadSystemImages = function () {
    Spriteset_Base.prototype.loadSystemImages.call(this);
};

Spriteset_Cg.prototype.createLowerLayer = function () {

};

Spriteset_Cg.prototype.createUpperLayer = function () {
    this.createPictures();
};

Spriteset_Cg.prototype.update = function () {
    Sprite.prototype.update.call(this);
};