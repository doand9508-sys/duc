
//=============================================================================
// RPG Maker MZ - 选择窗口背景
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<选择窗口背景>
 * @author FlyCat
 * 
 * 
 * @help
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_ChoiceCore = true;

var FlyCat = FlyCat || {};
FlyCat.ChoiceCore = {};
FlyCat.ChoiceCore.parameters = PluginManager.parameters('FlyCat_ChoiceCore');


Scene_Message.prototype.createChoiceListWindow = function () {
    this._blackForSprite = new Sprite(ImageManager.loadBitmap('img/menu/', 'zz'));
    this._blackForSprite.hide();
    this.addChild(this._blackForSprite);
    this._choiceListWindow = new Window_ChoiceList();
    this.addChild(this._choiceListWindow);
};
FlyCat.ChoiceCore.Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize;
Window_ChoiceList.prototype.initialize = function () {
    FlyCat.ChoiceCore.Window_ChoiceList_initialize.call(this, new Rectangle());
    this._backBitmap = null;
    this._bitmapLoading = false;
    this._backScaleH = 1;
    this._backBitmap = ImageManager.loadBitmap('img/menu/', 'chBack');
    this._cursorBitmap = ImageManager.loadBitmap('img/menu/', 'choiceBack');

};
FlyCat.ChoiceCore.Window_ChoiceList_start = Window_ChoiceList.prototype.start;
Window_ChoiceList.prototype.start = function () {
    if ($gameMessage.choiceBackground() == 0) {
        this._backShow = false;
        this._bitmapLoading = true;
    } else {
        FlyCat.ChoiceCore.Window_ChoiceList_start.call(this);
    }
};
Window_ChoiceList.prototype.updatePlacement = function () {
    if ($gameMessage.choiceBackground() == 0) {
        if ($gameMessage.choicePositionType() == 0) {
            this.x = 5;
            this.y = (Graphics.boxHeight - this.windowHeight()) / 2;
        } else if ($gameMessage.choicePositionType() == 1) {
            this.x = (Graphics.boxWidth - this.windowWidth()) / 2;
            this.y = (Graphics.boxHeight - this.windowHeight()) / 2;
        } else if ($gameMessage.choicePositionType() == 2) {
            this.x = Graphics.boxWidth - this.windowWidth() - 5;
            this.y = (Graphics.boxHeight - this.windowHeight()) / 2;
        } else {
            this.x = this.windowX();
            this.y = this.windowY();
        }
    } else {
        this.x = this.windowX();
        this.y = this.windowY();
    }
    this.width = this.windowWidth();
    this.height = this.windowHeight();
};
Window_ChoiceList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    if ($gameMessage.choiceBackground() == 0) {
        if (!this._backShow) {
            this.drawChoiceBack();
            this._backShow = true;
        }
        this.drawCursorBitmap(rect, index);
        this.changeTextColor('#eaeedf');
        this.contents.outlineColor = '#ccdad1';
        this.contents.outlineWidth = 1;
    }
    this.changePaintOpacity(this.isCommandEnabled(index));
    var text = JsonEx.makeDeepCopy(this.commandName(index));
    var textState = this.createTextState(text, 0, 0, 0);
    var textState = this.newFlushTextState(textState);
    const textW = Math.floor(textState.outputWidth / 2);
    const ww = Math.floor(this.itemWidth() / 2 - textW - this.contents.fontSize / 2);
    this.drawTextEx(this.commandName(index), rect.x + ww, rect.y, rect.width, align);
};
Window_ChoiceList.prototype.newFlushTextState = function (textState) {
    while (textState.index < textState.text.length) {
        this.processCharacter(textState);
    }
    const text = textState.buffer;
    const rtl = textState.rtl;
    const width = this.textWidth(text);
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;
    textState.x += rtl ? -width : width;
    textState.buffer = this.createTextBuffer(rtl);
    const outputWidth = Math.abs(textState.x - textState.startX);
    if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
    }
    textState.outputHeight = y - textState.startY + height;
    return textState;
};
Window_ChoiceList.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
    if ($gameMessage.choiceBackground() == 0) {
        this.changeTextColor('#eaeedf');
        this.contents.outlineColor = '#ccdad1';
        this.contents.outlineWidth = 1;
    };
};
Window_ChoiceList.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#eaeedf');
        this.contents.outlineColor = '#ccdad1';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 1;
    }
};
Window_ChoiceList.prototype.drawCursorBitmap = function (rect, index) {
    if (index == this.index()) {
        var type = 1;
    } else {
        var type = 0;
    }
    const bitmap = this._cursorBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x + 32;
        const dy = rect.y;
        const sx = 0;
        const sy = ph * type;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_ChoiceList.prototype.drawChoiceBack = function () {
    const height = this.windowHeight();
    const bitmap = this._backBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = 0;
        const dy = 0;
        const sx = 0;
        const sy = 0;
        const scw = pw;
        const sch = ph * this._backScaleH;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};
FlyCat.ChoiceCore.Window_ChoiceList_update = Window_ChoiceList.prototype.update;
Window_ChoiceList.prototype.update = function () {
    if ($gameMessage.choiceBackground() == 0) {
        Window_Selectable.prototype.update.call(this);
        if (this._bitmapLoading && this._backBitmap && this._backBitmap.isReady() && this._cursorBitmap && this._cursorBitmap.isReady()) {
            this.updatePlacement();
            this.updateBackground();
            this.placeCancelButton();
            this.createContents();
            this.refresh();
            this.selectDefault();
            this.open();
            this.activate();
            this._bitmapLoading = false;

        }
    } else {
        FlyCat.ChoiceCore.Window_ChoiceList_update.call(this);
    }
};

FlyCat.ChoiceCore.Window_ChoiceList_open = Window_ChoiceList.prototype.open;
Window_ChoiceList.prototype.open = function () {
    FlyCat.ChoiceCore.Window_ChoiceList_open.call(this);
    if ($gameMessage.choiceBackground() == 0 && SceneManager._scene._blackForSprite) {
        SceneManager._scene._blackForSprite.show();
    };
};

FlyCat.ChoiceCore.Window_ChoiceList_close = Window_ChoiceList.prototype.close;
Window_ChoiceList.prototype.close = function () {
    FlyCat.ChoiceCore.Window_ChoiceList_close.call(this);
    if ($gameMessage.choiceBackground() == 0 && SceneManager._scene._blackForSprite) {
        SceneManager._scene._blackForSprite.hide();
    };
};
Window_ChoiceList.prototype.setBackgroundType = function (type) {
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
Window_ChoiceList.prototype.windowWidth = function () {
    if ($gameMessage.choiceBackground() == 0) {
        return 467;
    } else {
        const width = this.maxChoiceWidth() + this.colSpacing() + this.padding * 2;
        return Math.min(width, Graphics.boxWidth);
    }
};
Window_ChoiceList.prototype.windowHeight = function () {
    if ($gameMessage.choiceBackground() == 0) {
        if (this.numVisibleRows() < 3) {
            this._backScaleH = 1;
        } else {
            this._backScaleH = (this.numVisibleRows() - 2) * 0.2 + 1;
        }
        return 200 * this._backScaleH;
    } else {
        return this.fittingHeight(this.numVisibleRows());
    }
};
FlyCat.ChoiceCore.Window_ChoiceList_drawBackgroundRect = Window_ChoiceList.prototype.drawBackgroundRect;
Window_ChoiceList.prototype.drawBackgroundRect = function (rect) {
    if ($gameMessage.choiceBackground() == 0) {

    } else {
        FlyCat.ChoiceCore.Window_ChoiceList_drawBackgroundRect.call(this, rect);
    }
};
FlyCat.ChoiceCore.Window_ChoiceList_itemHeight = Window_ChoiceList.prototype.itemHeight;
Window_ChoiceList.prototype.itemHeight = function () {
    if ($gameMessage.choiceBackground() == 0) {
        return Math.floor(this.innerHeight / this.numVisibleRows()) - 4;
    } else {
        return FlyCat.ChoiceCore.Window_ChoiceList_itemHeight.call(this);
    }
};
Window_ChoiceList.prototype._updateCursor = function () {
    if ($gameMessage.choiceBackground() == 0) {
        this._cursorSprite.alpha = 0;
    } else {
        this._cursorSprite.alpha = 1;
    }
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};
FlyCat.ChoiceCore.Window_ChoiceList_select = Window_ChoiceList.prototype.select;
Window_ChoiceList.prototype.select = function (index) {
    FlyCat.ChoiceCore.Window_ChoiceList_select.call(this, index);
    if ($gameMessage.choiceBackground() == 0) {
        if (index != this._lastIndex) {
            this._backShow = false;
            this.refresh();
            this._lastIndex = index;
        }
    }
};
