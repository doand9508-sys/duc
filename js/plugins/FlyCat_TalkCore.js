
//=============================================================================
// RPG Maker MZ - 对话背景框
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<对话背景框>
 * @author FlyCat
 * 
 * 
 * @help
 */

'use strict';
var Imported = Imported || {};
Imported.FlyCat_TalkCore = true;

var FlyCat = FlyCat || {};
FlyCat.TalkCore = {};
FlyCat.TalkCore.parameters = PluginManager.parameters('FlyCat_TalkCore');



Scene_Message.prototype.createNameBoxWindow = function () {
    this._nameBoxWindow = new Window_NameBox();
    this.addChild(this._nameBoxWindow);
};

Scene_Message.prototype.messageWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(6, false) - 10;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};


Window_NameBox.prototype.setBackgroundType = function (type) {
    if (type === 0) {
        this.opacity = 0;
    } else {
        this.opacity = 0;
    }
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};
Window_NameBox.prototype.refresh = function () {
    if (Imported.FlyCat_FSXXL_WindowSkin) {
        if (!$gameSystem._flyCatWindowSkin) $gameSystem._flyCatWindowSkin = "Window";
        this.windowskin = ImageManager.loadSystem($gameSystem._flyCatWindowSkin);
    }
    if ($gameMessage.background() == 0) {
        this.windowskin = ImageManager.loadSystem("Window11");
    };
    const rect = this.baseTextRect();
    this.contents.clear();
    this.contents.fontSize = 24;
    this.changeTextColor('#fbf0b5');
    this.contents.outlineColor = '#b6bf9e';
    this.contents.outlineWidth = 1;
    const width = this.windowWidth();
    const nameWidth = this.textWidth(this._name);
    const x = (width - nameWidth) / 2 - this.contents.fontSize / 2;
    this.drawTextEx(this._name, x, rect.y, width);
};
Window_NameBox.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 24;
    this.resetTextColor();
    if ($gameMessage.background() == 0) {
        this.changeTextColor('#fbf0b5');
        this.contents.outlineColor = '#b6bf9e';
        this.contents.outlineWidth = 1;
    }
};
Window_NameBox.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0 && $gameMessage.background() == 0) {
        this.changeTextColor('#fbf0b5');
        this.contents.outlineColor = '#b6bf9e';
        this.contents.outlineWidth = 1;
    } else if (colorIndex == 6 && $gameMessage.background() == 0) {
        this.changeTextColor('#edbd28');
        this.contents.outlineColor = '#f6d160';
        this.contents.outlineWidth = 1;
    } else {
        if ($gameMessage.background() == 0) {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.changeOutlineColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 1;
        } else {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.changeOutlineColor(ColorManager.outlineColor());
            this.contents.outlineWidth = 3;
        }
    }
};
Window_NameBox.prototype.windowWidth = function () {
    if (this._name) {
        const textWidth = this.textSizeEx(this._name).width;
        const padding = this.padding + this.itemPadding();
        const width = Math.ceil(textWidth) + padding * 2;
        return 152;//Math.min(width, Graphics.boxWidth);
    } else {
        return 0;
    }
};

Window_NameBox.prototype.updatePlacement = function () {
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    const messageWindow = this._messageWindow;
    if ($gameMessage.isRTL()) {
        this.x = messageWindow.x + messageWindow.width - this.width;
    } else {
        this.x = 68//Graphics.width - this.width - 51;
    }
    if (messageWindow.y > 0) {
        this.y = messageWindow.y - this.height + 66;
    } else {
        this.y = 6;//messageWindow.y + messageWindow.height;
    }
};

FlyCat.TalkCore.Window_Message_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function (rect) {
    FlyCat.TalkCore.Window_Message_initialize.call(this, rect);
    this.opacity = 0;
};
FlyCat.TalkCore.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
    FlyCat.TalkCore.Window_Message_startMessage.call(this);
    if ($gameMessage.background() == 0) {
        this.windowskin = ImageManager.loadSystem("Window11");

    };
};
Window_Message.prototype.updatePlacement = function () {
    const goldWindow = this._goldWindow;
    if ($gameMessage.background() == 0) {
        this._positionType = $gameMessage.positionType();
    } else {
        this._positionType = $gameMessage.positionType();
    }
    this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
    if (goldWindow) {
        goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
    }
};
Window_Message.prototype._refreshPauseSign = function () {
    const sx = 144;
    const sy = 96;
    const p = 24;
    this._pauseSignSprite.bitmap = this._windowskin;
    this._pauseSignSprite.anchor.x = 0.5;
    this._pauseSignSprite.anchor.y = 1;
    if ($gameMessage.background() == 0) {
        this._pauseSignSprite.move(this._width - 50, this._height - 30);
        this._pauseSignSprite.scale.set(1.1);
    } else {
        this._pauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignSprite.scale.set(1);
    }
    this._pauseSignSprite.setFrame(sx, sy, p, p);
    this._pauseSignSprite.alpha = 0;
};
Window_Message.prototype.setBackgroundType = function (type) {
    if (type === 0) {
        this.height = Window_Base.prototype.fittingHeight(6) - 10;
        this.updatePlacement();
        this.opacity = 0;
    } else {
        this.opacity = 0;
    }
    if (type != 0) {
        this.height = Window_Base.prototype.fittingHeight(4) + 8;
        this.updatePlacement();
    };
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};

Window_Message.prototype.flushTextState = function (textState) {
    const text = textState.buffer;
    const rtl = textState.rtl;
    const width = this.textWidth(text);
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;
    if (textState.drawing) {
        if ($gameMessage.background() == 0) {
            this.contents.drawText(text, x + 14, y + 44, width, height);
        } else {
            this.contents.drawText(text, x, y, width, height);
        }
    }
    textState.x += rtl ? -width : width;
    textState.buffer = this.createTextBuffer(rtl);
    const outputWidth = Math.abs(textState.x - textState.startX);
    if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
    }
    textState.outputHeight = y - textState.startY + height;
};
Window_Message.prototype.processDrawIcon = function (iconIndex, textState) {
    if (textState.drawing) {
        if ($gameMessage.background() == 0) {
            this.drawIcon(iconIndex, textState.x + 2 + 14, textState.y + 2 + 44);
        } else {
            this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
        }
    }
    textState.x += ImageManager.iconWidth + 4;
};
Window_Message.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
    if ($gameMessage.background() == 0) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    }
};
Window_Message.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0 && $gameMessage.background() == 0) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    } else if (colorIndex == 6 && $gameMessage.background() == 0) {
        this.changeTextColor('#edbd28');
        this.contents.outlineColor = '#f6d160';
        this.contents.outlineWidth = 1;
    } else {
        if ($gameMessage.background() == 0) {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.changeOutlineColor(ColorManager.textColor(colorIndex));
            this.contents.outlineWidth = 1;
        } else {
            this.changeTextColor(ColorManager.textColor(colorIndex));
            this.changeOutlineColor(ColorManager.outlineColor());
            this.contents.outlineWidth = 3;
        }
    }
};
FlyCat.TalkCore.Window_Message_initMembers = Window_Message.prototype.initMembers;
Window_Message.prototype.initMembers = function () {
    this._backBitmap = null;
    FlyCat.TalkCore.Window_Message_initMembers.call(this);
};
FlyCat.TalkCore.Window_Message_loadMessageFace = Window_Message.prototype.loadMessageFace;
Window_Message.prototype.loadMessageFace = function () {
    FlyCat.TalkCore.Window_Message_loadMessageFace.call(this);
    this._backBitmap = ImageManager.loadBitmap('img/menu/', '对话框');
};
Window_Message.prototype.update = function () {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    this.synchronizeNameBox();
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateBackLoading() && this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};
Window_Message.prototype.updateBackLoading = function () {
    if ($gameMessage.background() != 0) return false;
    if (this._backBitmap) {
        if (this._backBitmap.isReady()) {
            this.drawMessageBack();
            this._backBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

Window_Message.prototype.drawMessageBack = function () {
    const bitmap = this._backBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = -10;
        const dy = 0;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
