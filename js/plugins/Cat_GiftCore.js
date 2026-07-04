//=============================================================================
// RPG Maker MV - Cat-Gift_Core
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<Gift_Core>
 * @author Cat
 * 
 * @command openGaveGifts
 * @text 打开送礼列表
 * @desc 打开送礼列表
 * 
 * @help
 * 绑定事件：
 * 事件备注：
 * <好友:npcId,名字>
 * 范例：
 * <好友:1,流云大师兄>
 * 事件第一行：$gameTemp._npcEvent = this._eventId;
 * 
 * 序列内，道具武器护甲必须在好友度执行下方。
 * 喜欢和不喜欢对话也要在好友度下方。
 * 礼物序列
 * <礼物>
 * XXX填写序列内容
 * </礼物>
 * 
 * 序列指令：
 * 好友度 npcId 增减数值 概率  
 * 范例：
 * 如果接受礼物的NPC是1号，那么50%概率增加10点好友度
 *  <礼物>
 * 好友度 1 10 50 
 * </礼物>
 * 如果接受礼物的NPC是1号，那么50%概率增加10点好友度
 * 如果接受礼物的NPC是2号，那么100%概率减少10点好友度
 *  <礼物>
 * 好友度 1 10 50 
 * 好友度 2 -10 100 
 * </礼物>
 * 
 * 序列指令：
 * 喜欢对话 npcId 对话内容
 * 不喜欢对话 npcId 对话内容
 * 对话 npcId 对话内容
 * 
 * 范例：可以按顺序写，变成完整对话  此对话从上到下执行，只有对应id的npc会显示
 * 对话 1 \C[0]你这东西很平常
 * 对话 1 \C[0]你好
 * 
 * 根据自己需求和情况来写礼物序列
 * 如果送的东西NPC喜欢 则可以写上喜欢话术  
 * 喜欢 1 \C[0]这东西我非常喜欢，太感谢你了
 * 如果不喜欢，写不喜欢话术
 * 反感 1 \C[0]你完蛋了,我要弄死你,敢送我牛子
 * 反感 1 \C[0]真想打死你,哈哈哈！
 * 
 * 以下是回送奖励设置；
 * 以下设置都在好友度序列下面写，
 * 因为只有判断了喜欢你送的礼物，NPC才会回送
 * 
 * 道具 npcId 道具id 给予道具数量 给道具概率
 * 武器 npcId 武器id 给予武器数量 给武器概率
 * 护甲 npcId 护甲id 给予护甲数量 给护甲概率
 * 
 * 道具 1 2 2 100   
 * 武器 1 1 1 50
 * 护甲 1 1 1 50
 * 
 * 以下是特殊：
 * 开关 npcId 2号开关开，false是关
 * 变量 npcId 3号变量 增加10  如果是减少就写-10
 * 公共事件 npcId 28号事件100%执行
 * 
 * 开关 1 2 true
 * 变量 1 3 10
 * 公共事件 1 28 100
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_GiftCore = true;

var Cat = Cat || {};
Cat.GiftCore = {};
Cat.GiftCore.parameters = PluginManager.parameters('Cat_GiftCore');

PluginManager.registerCommand('Cat_GiftCore', 'openGaveGifts', args => {
    SceneManager._scene._giftItemSprite.visible = true;
    SceneManager._scene._giftItemWindow.startGift();
    SceneManager._scene._cancelButtonSprite.show();
});

Cat.GiftCore.Scene_Message_createAllWindows = Scene_Message.prototype.createAllWindows;
Scene_Message.prototype.createAllWindows = function () {
    Cat.GiftCore.Scene_Message_createAllWindows.call(this);
    this._giveGiftStart = false;
    this.createGiftItemWindow();
    this.createGiveGiftProgressBarWindow();
};
Scene_Message.prototype.createGiveGiftProgressBarWindow = function () {
    const rect = this.progressBarWindowRect();
    this._progressBarWindow = new Window_progressBar(rect);
    this.addWindow(this._progressBarWindow);
    this._progressBarWindow.hide();
};
Scene_Message.prototype.progressBarWindowRect = function () {
    const ww = 520;
    const wh = 100;
    const wx = Graphics.boxWidth / 2 - ww / 2;
    const wy = Graphics.boxHeight / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Message.prototype.createGiftItemWindow = function () {
    this._giftItemSprite = new Sprite();
    this.addChild(this._giftItemSprite);
    this._giftItemSprite.hide();
    this._giftItemSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');

    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.scale.set(0.7);
    this._cancelButtonSprite.setClickHandler(this.cancelGift.bind(this));
    this._cancelButtonSprite.hide();

    const rect = this.giftItemWindowRect();
    this._giftItemWindow = new Window_GiftList(rect);
    this._giftItemWindow.setHandler('ok', this.onGift.bind(this));
    this._giftItemWindow.setHandler('cancel', this.cancelGift.bind(this));
    this.addChild(this._giftItemWindow);
    this._giftItemWindow.deactivate();
    this._giftItemWindow.hide();
    this._giftItemWindow.setMessageWindow(this._messageWindow);
    this._messageWindow.setGiftItemWindow(this._giftItemWindow);
    this._giftItemSprite.x = this._giftItemWindow.x + 13;
    this._giftItemSprite.y = this._giftItemWindow.y + 5;

    this._cancelButtonSprite.x = this._giftItemWindow.x + this._giftItemWindow.width - 23;
    this._cancelButtonSprite.y = this._giftItemWindow.y - 16;

    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._giftItemWindow) this._giftItemWindow._miniInfoWindow = this._miniWindow;
    };
};
Cat.GiftCore.Scene_Message_update = Scene_Message.prototype.update;
Scene_Message.prototype.update = function () {
    Cat.GiftCore.Scene_Message_update.call(this);
    if (this._giftItemWindow && this._giftItemWindow.active && this._giftItemWindow._list) {
        const index = this._giftItemWindow.index();
        const item = this._giftItemWindow._list[index];
        if (Imported.MiniInformationWindow && item) {
            this._giftItemWindow.setMiniWindow(item);
            this._giftItemWindow._miniInfoWindow.show();
        }
    }
    if (this._giveGiftStart == true) {
        this.onGiveGiftsItemOk();
        this._giveGiftStart = false;
    }
};
Scene_Message.prototype.onGiveGiftsItemOk = function () {
    this._progressBarWindow.hide();
    const item = $gameTemp._onNpcItem;
    const event = $dataMap.events[$gameTemp._npcEvent]
    $gameTemp._love = false;
    if (item.note.match(/<礼物>\n([\s\S]+?)\n<\/礼物>/i)) {
        var data = RegExp.$1.split(/\n/);
        data.forEach(line => {
            if (line.match(/好友度[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const value = Number(meta[1]);
                const rate = Number(meta[2]);
                const nowRate = Math.floor(Math.random() * 100 + 1);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId) {
                        if (nowRate < rate) {
                            addLoveValue(npcId - 1, value);
                            const text = '\\C[0]你的礼物我很喜欢，好友度增长' + value + '。';
                            $gameTemp._love = true;
                            $gameParty.loseItem(item, 1);
                            $gameMessage.newPage();
                            $gameMessage.setSpeakerName(npcName);
                            $gameMessage.add(text);
                        } else {
                            const text = '\\C[0]我不要这个东西！';
                            $gameTemp._love = false;
                            $gameMessage.newPage();
                            $gameMessage.setSpeakerName(npcName);
                            $gameMessage.add(text);
                        }
                    };
                }
            }
            else if (line.match(/对话[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const npcText = meta[1];
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId) {
                        const text = npcText;
                        $gameMessage.newPage();
                        $gameMessage.setSpeakerName(npcName);
                        $gameMessage.add(text);
                    };
                };
            }
            else if (line.match(/喜欢[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const npcText = meta[1];
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId && $gameTemp._love == true) {
                        const text = npcText;
                        $gameMessage.newPage();
                        $gameMessage.setSpeakerName(npcName);
                        $gameMessage.add(text);
                    };
                };
            }
            else if (line.match(/反感[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const npcText = meta[1];
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId && $gameTemp._love == false) {
                        const text = npcText;
                        $gameMessage.newPage();
                        $gameMessage.setSpeakerName(npcName);
                        $gameMessage.add(text);
                    };
                };
            }
            else if (line.match(/道具[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const itemId = Number(meta[1]);
                const number = Number(meta[2]);
                const rate = Number(meta[3]);
                const item = $dataItems[itemId];
                const nowRate = Math.floor(Math.random() * 100 + 1);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId) {
                        if (nowRate < rate && $gameTemp._love == true) {
                            const text = '\\C[0]看你挺顺眼，这些小玩意就赠与你吧！你获得：' + item.name + 'X' + number;
                            $gameParty.gainItem(item, number)
                            $gameMessage.newPage();
                            $gameMessage.setSpeakerName(npcName);
                            $gameMessage.add(text);
                        };
                    };
                }
            }
            else if (line.match(/武器[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const itemId = Number(meta[1]);
                const number = Number(meta[2]);
                const rate = Number(meta[3]);
                const item = $dataWeapons[itemId];
                const nowRate = Math.floor(Math.random() * 100 + 1);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId) {
                        if (nowRate < rate && $gameTemp._love == true) {
                            const text = '\\C[0]看你挺顺眼，这些小玩意就赠与你吧！你获得：' + item.name + 'X' + number;
                            $gameParty.gainItem(item, number)
                            $gameMessage.newPage();
                            $gameMessage.setSpeakerName(npcName);
                            $gameMessage.add(text);
                        };
                    };
                }
            }
            else if (line.match(/护甲[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const itemId = Number(meta[1]);
                const number = Number(meta[2]);
                const rate = Number(meta[3]);
                const item = $dataArmors[itemId];
                const nowRate = Math.floor(Math.random() * 100 + 1);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    const npcName = npcMeta[1];
                    if (npcId == needId) {
                        if (nowRate < rate && $gameTemp._love == true) {
                            const text = '\\C[0]看你挺顺眼，这些小玩意就赠与你吧！你获得：' + item.name + 'X' + number;
                            $gameParty.gainItem(item, number)
                            $gameMessage.newPage();
                            $gameMessage.setSpeakerName(npcName);
                            $gameMessage.add(text);
                        };
                    };
                }
            } else if (line.match(/开关[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const swId = Number(meta[1]);
                const type = eval(meta[2]);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    if (npcId == needId) {
                        $gameSwitches.setValue(swId, type);
                    };
                }
            } else if (line.match(/变量[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const vId = Number(meta[1]);
                const value = Number(meta[2]);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    if (npcId == needId) {
                        $gameVariables.setValue(vId, $gameVariables.value(vId) + value);
                    };
                }
            } else if (line.match(/公共事件[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const needId = Number(meta[0]);
                const commonEventId = Number(meta[1]);
                const rate = Number(meta[2]);
                const nowRate = Math.floor(Math.random() * 100 + 1);
                if (event && event.meta.好友) {
                    const npcMeta = event.meta.好友.split(',');
                    const npcId = npcMeta[0];
                    if (npcId == needId) {
                        if (nowRate < rate) {
                            $gameTemp.reserveCommonEvent(commonEventId);
                        };
                    };
                }
            };
        })
    };
};
Scene_Message.prototype.onGift = function () {
    const index = this._giftItemWindow.index();
    const item = this._giftItemWindow._list[index];
    if (item) {
        this.cancelGift();
        $gameTemp._onNpcItem = item;
        this._progressBarWindow.refresh()
        this._progressBarWindow.open();
        this._progressBarWindow.show();
        this._progressBarWindow._startCount = 1;
    } else {
        SoundManager.playBuzzer();
        this._giftItemWindow.activate();
    }
};
Scene_Message.prototype.cancelGift = function () {
    this._giftItemWindow.deactivate();
    this._giftItemWindow.hide();
    this._giftItemSprite.hide();
    this._cancelButtonSprite.hide();
};
Scene_Message.prototype.giftItemWindowRect = function () {
    const ww = 380;
    const wh = 450;
    const wx = (Graphics.width - ww) / 2;
    const wy = (Graphics.height - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Cat.GiftCore.Game_Message_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function () {
    if (SceneManager._scene instanceof Scene_Map) {
        return Cat.GiftCore.Game_Message_isBusy.call(this) ||
            SceneManager._scene._giftItemWindow.active ||
            SceneManager._scene._giveGiftStart ||
            SceneManager._scene._progressBarWindow.visible
    } else {
        return Cat.GiftCore.Game_Message_isBusy.call(this);
    };
};
Window_Message.prototype.setGiftItemWindow = function (giftItemWindow) {
    this._giftItemWindow = giftItemWindow;
};

function Window_progressBar() {
    this.initialize(...arguments);
}

Window_progressBar.prototype = Object.create(Window_Base.prototype);
Window_progressBar.prototype.constructor = Window_progressBar;

Window_progressBar.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._startCount = 0;
    this._counts = 0;
    this._counts_1 = 0;
    this._counts_2 = 0;
    this.refresh();
};
Window_progressBar.prototype.refresh = function () {
    this.contentsBack.clear();
    this.contentsBack.strokeRect(20, 20, 450, 20, ColorManager.textColor(15))

};
Window_progressBar.prototype.refresh_1 = function () {
    this.contents.clear();
    const value = Math.floor(this._counts_1 / 450 * 100);
    this.contents.fontSize = 20;
    this.drawText(value + '%', 20, 12, 450, 'center');
    if (this._counts_2 == 0) {
        this.drawText('对方正在思考中.', 20, 40, 450, 'center')
    }
    if (this._counts_2 == 1) {
        this.drawText('对方正在思考中..', 20, 40, 450, 'center')
    }
    if (this._counts_2 == 2) {
        this.drawText('对方正在思考中...', 20, 40, 450, 'center')
    }
    if (this._counts_2 == 3) {
        this.drawText('对方正在思考中....', 20, 40, 450, 'center')
    }
};

Window_progressBar.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._startCount > 0) {
        this._counts++;
        if (this._counts == 1) {
            this._counts = 0;
            this._counts_1 += 2;
            if (this._counts_1 % 30 == 0) {
                this._counts_2++;
                if (this._counts_2 == 4) {
                    this._counts_2 = 0;
                }
            }
            this.refresh_1();
            this.contentsBack.gradientFillRect(20, 20, this._counts_1, 19, ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
            if (this._counts_1 == 450) {
                this._counts_1 = 0;
                this.contents.clear();
                this.contentsBack.clear();
                SceneManager._scene._giveGiftStart = true;
                this._startCount = 0;
            }
        }
    }
};

function Window_GiftList() {
    this.initialize(...arguments);
}

Window_GiftList.prototype = Object.create(Window_Selectable.prototype);
Window_GiftList.prototype.constructor = Window_GiftList;

Window_GiftList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._type = -1;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');
    this.createCursorSprite();
};
Window_GiftList.prototype.setMessageWindow = function (messageWindow) {
    this._messageWindow = messageWindow;
};
Window_GiftList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_2');
    this._clientArea.addChild(this._cursorSprites);
};
Window_GiftList.prototype.update = function () {
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
Window_GiftList.prototype.startGift = function () {
    this._loadingPictrue = false;
    this.activate();
};
Window_GiftList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};
Window_GiftList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    this._list = $gameParty.allItems().filter(item => item.meta.礼物);
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawText('没有可赠送物品', -10, this.height / 2 - 30, this.width, 'center');
    };
};
Window_GiftList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawCursorBitmap(rect)
        this.drawIcon(item.iconIndex, rect.x + 5, rect.y - 4)
        this.drawText(item.name, rect.x + 48, rect.y, this.width, 'left');
        this.drawText("持有：", rect.x, rect.y, rect.width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), rect.x, rect.y, rect.width, "right");
    }
}
Window_GiftList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_GiftList.prototype.numVisibleRows = function () {
    return 8;
};
Window_GiftList.prototype.lineHeight = function () {
    return 27;
};
Window_GiftList.prototype.drawBackgroundRect = function (rect) {
};
Window_GiftList.prototype._updateCursor = function () {
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
Window_GiftList.prototype.drawCursorBitmap = function (rect) {
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