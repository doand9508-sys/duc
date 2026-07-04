//=============================================================================
// RPG Maker MZ - 气泡对话框
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<气泡对话框>
 * @author Cat
 * @help
 * 文本备注：<qp:id,宽度,头像补偿x,头像补偿y>
 * id=0是主角
 * id>0都是事件id
 * 宽度就是窗口宽度
 * 头像补偿xy 调头像位置
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_MessageWindow = true;

var Cat = Cat || {};
Cat.MessageWindow = {};
Cat.MessageWindow.parameters = PluginManager.parameters('Cat_MessageWindow');

Cat.MessageWindow.Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function () {
    Cat.MessageWindow.Game_Message_clear.call(this);
    this._catFaceMessageSprite = null;
    this._catFaceMessageWidth = 200;
    this._catFaceOfx = 0;
    this._catFaceOfy = 0;
};

Cat.MessageWindow.Game_Message_add = Game_Message.prototype.add;
Game_Message.prototype.add = function (text) {
    text = this.getQpMessageData(text);
    Cat.MessageWindow.Game_Message_add.call(this, text);
};

Game_Message.prototype.getQpMessageData = function (text) {
    var target = null;
    if (text.match(/<qp:(\S+)>/)) {
        const data = RegExp.$1.split(',');
        const id = Number(data[0]);
        //  console.log(id)
        if (data[1]) {
            this._catFaceMessageWidth = Number(data[1]);
        } else {
            this._catFaceMessageWidth = 200;
        }
        if (data[2]) {
            this._catFaceOfx = Number(data[2]);
        }
        if (data[3]) {
            this._catFaceOfy = Number(data[3]);
        }
        if ($gameMessage.faceName()) {
            this._catFaceMessageWidth += ImageManager.faceWidth + 20;
        }
        if (id == 0) {
            var target = $gamePlayer;
        } else if (id > 0) {
            var target = $gameMap.event(id);
        }
    }
    // console.log(target)
    if (!this._catFaceMessageSprite && target) {
        this._catFaceMessageSprite = SceneManager._scene._spriteset.findTargetSprite(target)
        //console.log(this._catFaceMessageSprite)
    }
    return text.replace(/<qp:(\S+)>/g, '');
};

Game_Message.prototype.getQpFaceSprite = function () {
    return this._catFaceMessageSprite;
};

Cat.MessageWindow.Window_Message_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function (rect) {
    this._baseRect = rect;
    Cat.MessageWindow.Window_Message_initialize.call(this, rect);
    this._catFaceSprite = new Sprite();
    this.addChild(this._catFaceSprite);
    this._catFaceSprite.hide();
};

Cat.MessageWindow.Window_Message_drawMessageFace = Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace = function () {
    if ($gameMessage.getQpFaceSprite()) {
        const name = $gameMessage.faceName();
        const index = $gameMessage.faceIndex();
        const rw = ImageManager.faceWidth, rh = ImageManager.faceHeight;
        const rx = (index % 4) * rw, ry = Math.floor(index / 4) * rh;
        this._catFaceSprite.bitmap = ImageManager.loadFace(name);
        this._catFaceSprite.setFrame(rx, ry, rw, rh);
        this._catFaceSprite.x = $gameSystem.windowPadding() + $gameMessage._catFaceOfx;
        this._catFaceSprite.y = this.height - rh - $gameSystem.windowPadding() + $gameMessage._catFaceOfy;
        this._catFaceSprite.show();
    } else {
        this._catFaceSprite.hide();
        Cat.MessageWindow.Window_Message_drawMessageFace.call(this);
    }
};

Cat.MessageWindow.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function () {
    Cat.MessageWindow.Window_Message_terminateMessage.call(this);
    if (this._catFaceSprite) {
        this._catFaceSprite.hide();
    }
};

Cat.MessageWindow.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
    this.newCatMessageWindow();
    Cat.MessageWindow.Window_Message_startMessage.call(this);
};

Window_Message.prototype.newCatMessageWindow = function () {
    if ($gameMessage.getQpFaceSprite()) {
        this.width = $gameMessage._catFaceMessageWidth;
        const text = $gameMessage.allText();
        var textWidth = 0;
        var newText = [];
        for (let i = 0; i < text.length; i++) {
            var value = this.textWidth(text[i]);
            textWidth += value;
            if ($gameMessage.faceName()) {
                if (textWidth >= this.width - 24 - ImageManager.faceWidth - 48) {
                    newText.push('\n');
                    textWidth = 0;
                };
            } else {
                if (textWidth >= this.width - 52) {
                    newText.push('\n');
                    textWidth = 0;
                };
            }
        };
        if (newText.length == 0) {
            if ($gameMessage.faceName()) {
                this.width = this.textWidth(text) + 24 + ImageManager.faceWidth + 48;
            } else {
                this.width = this.textWidth(text) + 36;
            }
        }
		this.width += 24; 	//wolfzq追加，给中文标点多半格。
        // this.width = maxWidth + 24;
        this.height = (newText.length + 1) * 36 + 24;
        this.createContents();
    } else {
        const rect = this._baseRect;
        if (this.width !== rect.width || this.height !== rect.height) {
            this.width = rect.width;
            this.height = rect.height;
            this.x = rect.x;
            this.createContents();
        }
    }
};

Cat.MessageWindow.Window_Message_update = Window_Message.prototype.update;
Window_Message.prototype.update = function () {
    Cat.MessageWindow.Window_Message_update.call(this);
    this.updateCatQpPosition();
};

Window_Message.prototype.updateCatQpPosition = function () {
    if (!this.visible) {
        return;
    }
    if (!$gameMessage.getQpFaceSprite()) {
        return;
    }
    const sprite = $gameMessage.getQpFaceSprite();
    const spacing = 24;
	var vw = this.width / 2;
    this.x = sprite.x - vw - 4;
    this.y = sprite.y - sprite.height - this.height - spacing;
	//wolfzq矫正对话位置。
	if (this.x < 0) {
		this.x = 0;
	} else if (this.x + vw > Graphics.width) {
		this.x = Graphics.width - vw;
	}
};

Cat.MessageWindow.Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
Window_Message.prototype.convertEscapeCharacters = function (text) {
    /* eslint no-control-regex: 0 */
    if (!$gameMessage.getQpFaceSprite()) {
        return Cat.MessageWindow.Window_Message_convertEscapeCharacters.call(this, text);
    } else {
        const regex = /[\r\n]/g;
        let match;
        const newLineIndices = [];

        while ((match = regex.exec(text))) {
            newLineIndices.push(match.index);
        }
        var textWidth = 0;
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
            $gameVariables.value(parseInt(p1))
        );
        /*text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
            $gameVariables.value(parseInt(p1))
        );*/
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
            this.actorName(parseInt(p1))
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
            this.partyMemberName(parseInt(p1))
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        text = text.replace(/\x1bCT\[(\d+)\]/gi, function () {
            $gameMessage.setAlign(Number(arguments[1] || 0));
            return "";
        }.bind(this));
        var newText = [];
        for (let i = 0; i < text.length; i++) {
            var value = this.textWidth(text[i]);
            newText.push(text[i]);
            if (newLineIndices.includes(i)) {
                textWidth = 0;
            }
            textWidth += value;
            if ($gameMessage.faceName()) {
                if (textWidth >= this.width - 24 - ImageManager.faceWidth - 48) {
                    newText.push('\n');
                    textWidth = 0;
                };
            } else {
                if (textWidth >= this.width - 52) {
                    newText.push('\n');
                    textWidth = 0;
                };
            }
        };
        text = newText.join('')
        return text;
    };
};