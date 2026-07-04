//=============================================================================
// RPG Maker MZ - 装备强化/升级
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<装备强化/升级>
 * @author Cat
 * 
 * @command openIntensifyScene
 * @text 打开强化界面
 * @desc 打开强化界面
 * 
 * @arg type
 * @text 类型
 * @desc 选择强化类型
 * @type select
 * @option 武器
 * @value 武器
 * @option 护甲
 * @value 护甲
 * @default 武器
 * 
 * @command openUpScene
 * @text 打开升级界面
 * @desc 打开升级界面
 * 
 * @arg type
 * @text 类型
 * @desc 选择强化类型
 * @type select
 * @option 武器
 * @value 武器
 * @option 护甲
 * @value 护甲
 * @default 武器
 * 
 * @help
 * 消耗灵石公式：强化等级*100+100
 * 如果写了材料序列则按照序列上设置的来读取
 * 装备备注：
 * <强化上限:x>
 * <装备升级:升级后装备id>
 * <升级材料:材料id,数量>
 * <升级灵石:数量>
 * <强化属性:id1,value1,id2,value2>
 * 属性id 0-7 对应8种基础属性
 * 不写下列序列，只会默认等级*灵石的材料，没有物品材料
 * <强化材料>
 * 等级 强化等级数值 所需灵石 材料一ID 材料一数量 材料二ID 材料二数量
 * </强化材料>
 * 
 * <强化材料>
 * 等级 1 100 202 1 203 1
 * 等级 2 200 202 2 203 2 
 * </强化材料>
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_EquipCore = true;

var Cat = Cat || {};
Cat.EquipCore = {};
Cat.EquipCore.parameters = PluginManager.parameters('Cat_EquipCore');

PluginManager.registerCommand('Cat_EquipCore', 'openIntensifyScene', args => {
    $gameTemp._selectEquipType = args.type;
    SceneManager.push(Scene_Intensify);
});

PluginManager.registerCommand('Cat_EquipCore', 'openUpScene', args => {
    $gameTemp._selectEquipType = args.type;
    SceneManager.push(Scene_UpEquip);
});

Cat.EquipCore.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && (SceneManager._scene instanceof Scene_Intensify || SceneManager._scene instanceof Scene_UpEquip)) {
        this.opacity = 0;
    } else {
        Cat.EquipCore.Sprite_Button_updateOpacity.call(this);
    }
};

SoundManager.playIntensifySe = function (fileName, value) {
    if (!fileName) return;
    const se = {};
    se.name = fileName;
    se.pitch = value;
    se.volume = 100;
    AudioManager.playSe(se);
};

function Scene_UpEquip() {
    this.initialize(...arguments);
}

Scene_UpEquip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_UpEquip.prototype.constructor = Scene_UpEquip;

Scene_UpEquip.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._qhState = 1;
    this._success = false;
    this._animationCount = 0;
    this._animationId = 1;
    this._animationValue = 0;
    this._animationSpeed = 2;
    this.loadBitmap();
};

Scene_UpEquip.prototype.loadBitmap = function () {
    this._loadBitmap = [];
    this._loadBitmap[0] = ImageManager.loadBitmap('img/newUi/dz/', 'guage_Back');
    this._loadBitmap[1] = ImageManager.loadBitmap('img/newUi/dz/', 'guage');
    this._loadBitmap[2] = new Bitmap(816, 48);
    this._loadBitmap[3] = new Bitmap(816, 48);
    this._loadBitmap[4] = ImageManager.loadBitmap('img/newUi/dz/', 'dh3');
    this._loadBitmap[5] = ImageManager.loadBitmap('img/newUi/dz/', 'dh4');
    this._loadBitmap[6] = ImageManager.loadBitmap('img/newUi/dz/', 'qhdh6');
    this._loadBitmap[7] = ImageManager.loadBitmap('img/newUi/dz/', 'qhdh7');
};

Scene_UpEquip.prototype.updateLoading = function () {
    for (let i = 0; i < 4; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    // if (this._animationSprite3 && this._animationSprite3.bitmap && !this._animationSprite3.bitmap.isReady()) {
    //     return false;
    // }
    return true;
}

Cat.EquipCore.Scene_UpEquip_createBackground = Scene_UpEquip.prototype.createBackground
Scene_UpEquip.prototype.createBackground = function () {
    Cat.EquipCore.Scene_UpEquip_createBackground.call(this);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'back');
};

Scene_UpEquip.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};

Scene_UpEquip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createGoldLsWindow();
    this.createEquipSprite();
    this.createListWindow();
    this.createCommandWindow();
    this.createInfoWindow();
    this.createAnimationSprite();
    this.createRadioInfoWindow();
    // this.createTimeWindow()
};

Scene_UpEquip.prototype.createRadioInfoWindow = function () {
    const rect = this.radioInfoWindowRect();
    this._radioInfoWindow = new Window_TowerRadioInfo(rect);
    this.addChild(this._radioInfoWindow);
};

Scene_UpEquip.prototype.radioInfoWindowRect = function () {
    const ww = 300;
    const wh = 200;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = Graphics.height / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_UpEquip.prototype.createAnimationSprite = function () {
    this._animationSprite = new Sprite();
    this.addChild(this._animationSprite);
    this._animationSprite.x = Graphics.width / 2 - 408;
    this._animationSprite.y = Graphics.height / 2;

    this._animationSprite2 = new Sprite();
    this.addChild(this._animationSprite2);
    this._animationSprite2.setFrame(0, 0, 0, 0)
    this._animationSprite2.x = Graphics.width / 2 - 408;
    this._animationSprite2.y = Graphics.height / 2;

    this._animationSprite3 = new Sprite();
    this.addChild(this._animationSprite3);
    this._animationSprite3.x = Graphics.width / 2 - 408;
    this._animationSprite3.y = Graphics.height / 2;

    this._animationSprite4 = new Sprite();
    this.addChild(this._animationSprite4);
    this._animationSprite4.x = Graphics.width / 2 - 408;
    this._animationSprite4.y = Graphics.height / 2 + 60;
};

Scene_UpEquip.prototype.createEquipSprite = function () {
    this._equipSprite = new Sprite();
    this.addChild(this._equipSprite);
    this._equipSprite.x = 587;
    this._equipSprite.y = 140;
};

Scene_UpEquip.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_IntensifyEquipList_X(rect);
    this._listWindow.setHandler('ok', this.onList.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._listWindow);
    this._listWindow.activate();
    this._listWindow.select(0);
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._listWindow) this._listWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_UpEquip.prototype.listWindowRect = function () {
    const ww = 300;
    const wh = 478;
    const wx = 150;
    const wy = 124;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_UpEquip.prototype.onList = function () {
    const item = this._listWindow.item();
    if (!item) {
        this._listWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
    this._listWindow.deactivate();
    this._commandWindow.activate();
    this._commandWindow.select(0);
};

Scene_UpEquip.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_IntensifyCommand_X(rect);
    this._commandWindow.setHandler('ok', this.onCommand.bind(this));
    this._commandWindow.setHandler('cancel', this.cancelCommand.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
};

Scene_UpEquip.prototype.commandWindowRect = function () {
    const ww = 370;
    const wh = 80;
    const wx = 580;
    const wy = 366 + 180 + 1;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_UpEquip.prototype.cancelCommand = function () {
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this._listWindow.activate();
};

Scene_UpEquip.prototype.onCommand = function () {
    const item = this._listWindow.item();
    if (item) {
        var max = 10;
        if (item.meta.强化上限) {
            var max = Number(item.meta.强化上限)
        }
        if (item.intensify < max) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this._radioInfoWindow.refresh('升级')
            //  alert('该装备未强化至最高等级无法升级！')
            return;
        }
        const gold = $gameParty.numItems($dataItems[FlyCat.LL_SceneMenu.goldItem]);
        var needGold = item.intensify * 100 + 100;
        if (item.meta.升级灵石) {
            var needGold = Number(item.meta.升级灵石);
        }
        if (gold < needGold) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this._radioInfoWindow.refresh('灵石', needGold)
            return;
        }
        if (item.meta.升级材料) {
            const meta = item.meta.升级材料.split(',');
            const items = $dataItems[Number(meta[0])];
            const needNumber = Number(meta[1])
            const nowNumber = $gameParty.numItems(items);
            if (nowNumber < needNumber) {
                this._commandWindow.activate();
                SoundManager.playBuzzer();
                this._radioInfoWindow.refresh('材料', items, needNumber)
                return;
            };
            $gameParty.loseItem(items, needNumber);
        };
        $gameParty.loseItem($dataItems[53], needGold);
        // var randomNumber = Math.floor(Math.random() * 100) + 1;
        // if (randomNumber < (10 - item.intensify) * 10) {
        this._success = true;
        // } else {
        //     this._success = false;
        // }
        this._qhState = 2;
    } else {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
};

Scene_UpEquip.prototype.createInfoWindow = function () {
    const rect = this.infoWindowRect();
    this._infoWindow = new Window_IntensifyInfo_X(rect);
    this.addChild(this._infoWindow);
};

Scene_UpEquip.prototype.infoWindowRect = function () {
    const ww = 700;
    const wh = 500;
    const wx = 450;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_UpEquip.prototype.onSuccess = function () {
    const item = this._listWindow.item();
    if (DataManager.isArmor(item)) {
        var items = $dataArmors[Number(item.meta.装备升级)];
    } else {
        var items = $dataWeapons[Number(item.meta.装备升级)];
    };
    $gameParty.gainItem(items, 1);
    $gameParty.loseItem(item, 1);
};

Scene_UpEquip.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (!this._listWindow.item() && this._infoWindow) {
        this._infoWindow.createContents();
        this._equipSprite.bitmap = ImageManager.loadBitmap('');
    }
    if (this._equipSprite && this._listWindow.item()) {
        const item = this._listWindow.item();
        this._infoWindow.refresh(item);
        if (DataManager.isArmor(item)) {
            this._equipSprite.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'yf');
        } else {
            this._equipSprite.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'sjzb');
        };
        if (Imported.MiniInformationWindow && item) {
            this._listWindow.setMiniWindow(item);
            this._listWindow._miniInfoWindow.show();
        }
    }
    if (this._qhState == 2 && this.updateLoading()) {
        this._animationSprite.bitmap = this._loadBitmap[0];
        this._animationSprite2.bitmap = this._loadBitmap[1];
        this._animationSprite3.bitmap = this._loadBitmap[2];
        this._animationSprite4.bitmap = this._loadBitmap[3];
        this._animationCount++;

        this._animationSprite4.bitmap.clear();
        this._animationSprite4.bitmap.textColor = ColorManager.textColor(10);
        this._animationSprite4.bitmap.fontSize = 30;
        this._animationSprite4.outlineWidth = 3;
        this._animationSprite4.bitmap.fontFace = $gameSystem.mainFontFace();
        this._animationSprite4.bitmap.drawText('按下ESC跳过', 0, 0, 816, 48, 'center');

        if (DataManager.isArmor(this._listWindow.item())) {
            if (this._animationCount >= this._animationSpeed) {
                this._animationValue++
                if (this._animationValue % 20 == 0) {
                    SoundManager.playIntensifySe('Flash1', 150);
                };
                this._animationSprite3.bitmap.clear();
                this._animationSprite3.bitmap.textColor = ColorManager.textColor(0);
                this._animationSprite3.bitmap.fontSize = 30;
                this._animationSprite3.outlineWidth = 3;
                this._animationSprite3.bitmap.drawText(this._animationValue + '%', 0, 0, 816, 48, 'center');
                this._animationSprite2.setFrame(0, 0, 816 * this._animationValue / 100, 48)
                if (this._animationValue >= 100) {
                    this._animationValue = 100;
                    this._qhState = 3;
                }
            };
        } else {
            if (this._animationCount >= this._animationSpeed) {
                this._animationValue++
                if (this._animationValue % 20 == 0) {
                    SoundManager.playIntensifySe('Hammer', 50);
                }
                this._animationSprite3.bitmap.clear();
                this._animationSprite3.bitmap.textColor = ColorManager.textColor(0);
                this._animationSprite3.bitmap.fontSize = 30;
                this._animationSprite3.outlineWidth = 3;
                this._animationSprite3.bitmap.drawText(this._animationValue + '%', 0, 0, 816, 48, 'center');
                this._animationSprite2.setFrame(0, 0, 816 * this._animationValue / 100, 48)
                if (this._animationValue >= 100) {
                    this._animationValue = 100;
                    this._qhState = 3;
                }
            };
        }
    }
    if (Input.isTriggered("escape") && this._qhState == 2) {
        this._qhState = 3;
    };
    if (this._qhState == 3) {
        this._animationSprite.bitmap = ImageManager.loadBitmap();
        this._animationSprite2.bitmap = ImageManager.loadBitmap();
        this._animationSprite3.bitmap.clear();
        this._animationSprite4.bitmap.clear();

        if (this._success) {
            if (DataManager.isArmor(this._listWindow.item())) {
                this._animationSprite.x = Graphics.width / 2 - 200;
                this._animationSprite.y = Graphics.height / 2 - 260;
                this._animationSprite.bitmap = this._loadBitmap[6];
            } else {
                this._animationSprite.x = Graphics.width / 2 - 300;
                this._animationSprite.y = Graphics.height / 2 - 335;
                this._animationSprite.bitmap = this._loadBitmap[4];
            }
            SoundManager.playIntensifySe('Heal7', 150);
            this.onSuccess();
        } else {
            if (DataManager.isArmor(this._listWindow.item())) {
                this._animationSprite.x = Graphics.width / 2 - 200;
                this._animationSprite.y = Graphics.height / 2 - 260;
                this._animationSprite.bitmap = this._loadBitmap[7];
            } else {
                this._animationSprite.x = Graphics.width / 2 - 300;
                this._animationSprite.y = Graphics.height / 2 - 335;
                this._animationSprite.bitmap = this._loadBitmap[5];
            }
            SoundManager.playIntensifySe('Down2', 100);
        }
        this._animationCount = 0;
        // this._animationId = 1;
        this._animationValue = 0;
        this._animationSpeed = 2;
        this._qhState = 4;
    };
    if (this._qhState == 4) {
        this._animationCount++;
        if (this._animationCount == 120) {
            this._animationSprite.bitmap = ImageManager.loadBitmap();
            this._animationSprite.x = Graphics.width / 2 - 400;
            this._animationSprite.y = Graphics.height / 2;
            this._animationCount = 0;
            this._goldLsWindow.refresh();
            this._listWindow.refresh();
            this._qhState = 5;
        }
    };
    if (this._qhState == 5) {
        this._qhState = 1;
        //   this._animationSprite.bitmap = ImageManager.loadBitmap('');
        this._commandWindow.activate();
    };
};

function Scene_Intensify() {
    this.initialize(...arguments);
}

Scene_Intensify.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Intensify.prototype.constructor = Scene_Intensify;

Scene_Intensify.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._qhState = 1;
    this._success = false;
    this._animationCount = 0;
    this._animationId = 1;
    this._animationValue = 0;
    this._animationSpeed = 2;
    this.loadBitmap();
};

Scene_Intensify.prototype.loadBitmap = function () {
    this._loadBitmap = [];
    this._loadBitmap[0] = ImageManager.loadBitmap('img/newUi/dz/', 'guage_Back');
    this._loadBitmap[1] = ImageManager.loadBitmap('img/newUi/dz/', 'guage');
    this._loadBitmap[2] = new Bitmap(816, 48);
    this._loadBitmap[3] = new Bitmap(816, 48);
    this._loadBitmap[4] = ImageManager.loadBitmap('img/newUi/dz/', 'dh3');
    this._loadBitmap[5] = ImageManager.loadBitmap('img/newUi/dz/', 'dh4');
    this._loadBitmap[6] = ImageManager.loadBitmap('img/newUi/dz/', 'qhdh6');
    this._loadBitmap[7] = ImageManager.loadBitmap('img/newUi/dz/', 'qhdh7');
};

Scene_Intensify.prototype.updateLoading = function () {
    for (let i = 0; i < 8; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    // if (this._animationSprite3 && this._animationSprite3.bitmap && !this._animationSprite3.bitmap.isReady()) {
    //     return false;
    // }
    return true;
};

Cat.EquipCore.Scene_Intensify_createBackground = Scene_Intensify.prototype.createBackground
Scene_Intensify.prototype.createBackground = function () {
    Cat.EquipCore.Scene_Intensify_createBackground.call(this);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'back');
};

Scene_Intensify.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};

Scene_Intensify.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createGoldLsWindow();
    this.createEquipSprite();
    this.createListWindow();
    this.createCommandWindow();
    this.createInfoWindow();
    this.createAnimationSprite();
    this.createRadioInfoWindow();
    // this.createTimeWindow()
};

Scene_Intensify.prototype.createRadioInfoWindow = function () {
    const rect = this.radioInfoWindowRect();
    this._radioInfoWindow = new Window_TowerRadioInfo(rect);
    this.addChild(this._radioInfoWindow);
};

Scene_Intensify.prototype.radioInfoWindowRect = function () {
    const ww = 300;
    const wh = 200;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = Graphics.height / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Intensify.prototype.createAnimationSprite = function () {
    this._animationSprite = new Sprite();
    this.addChild(this._animationSprite);
    this._animationSprite.setFrame(0, 0, 816, 48)
    this._animationSprite.x = Graphics.width / 2 - 408;
    this._animationSprite.y = Graphics.height / 2;

    this._animationSprite2 = new Sprite();
    this.addChild(this._animationSprite2);
    this._animationSprite2.setFrame(0, 0, 0, 0)
    this._animationSprite2.x = Graphics.width / 2 - 408;
    this._animationSprite2.y = Graphics.height / 2;

    this._animationSprite3 = new Sprite();
    this.addChild(this._animationSprite3);
    this._animationSprite3.x = Graphics.width / 2 - 408;
    this._animationSprite3.y = Graphics.height / 2;

    this._animationSprite4 = new Sprite();
    this.addChild(this._animationSprite4);
    this._animationSprite4.x = Graphics.width / 2 - 408;
    this._animationSprite4.y = Graphics.height / 2 + 60;
};

Scene_Intensify.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_IntensifyCommand(rect);
    this._commandWindow.setHandler('ok', this.onCommand.bind(this));
    this._commandWindow.setHandler('cancel', this.cancelCommand.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
};

Scene_Intensify.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (!this._listWindow.item() && this._infoWindow) {
        this._infoWindow.createContents();
        this._equipSprite.bitmap = ImageManager.loadBitmap('');
    }
    if (this._equipSprite && this._listWindow.item()) {
        const item = this._listWindow.item();
        this._infoWindow.refresh(item);
        if (DataManager.isArmor(item)) {
            this._equipSprite.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'yf');
        } else {
            this._equipSprite.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'dzzb');
        };
        if (Imported.MiniInformationWindow && item) {
            this._listWindow.setMiniWindow(item);
            this._listWindow._miniInfoWindow.show();
        }
    }
    if (this._qhState == 2 && this.updateLoading()) {
        this._animationSprite.bitmap = this._loadBitmap[0];
        this._animationSprite2.bitmap = this._loadBitmap[1];
        this._animationSprite3.bitmap = this._loadBitmap[2];
        this._animationSprite4.bitmap = this._loadBitmap[3];

        this._animationSprite4.bitmap.clear();
        this._animationSprite4.bitmap.textColor = ColorManager.textColor(10);
        this._animationSprite4.bitmap.fontSize = 30;
        this._animationSprite4.outlineWidth = 3;
        this._animationSprite4.bitmap.fontFace = $gameSystem.mainFontFace();
        this._animationSprite4.bitmap.drawText('按下ESC跳过', 0, 0, 816, 48, 'center');

        this._animationCount++;
        if (DataManager.isArmor(this._listWindow.item())) {
            if (this._animationCount >= this._animationSpeed) {
                this._animationValue++
                if (this._animationValue % 20 == 0) {
                    SoundManager.playIntensifySe('Flash1', 150);
                };

                this._animationSprite3.bitmap.clear();
                this._animationSprite3.bitmap.textColor = ColorManager.textColor(0);
                this._animationSprite3.bitmap.fontSize = 30;
                this._animationSprite3.outlineWidth = 3;
                this._animationSprite3.bitmap.drawText(this._animationValue + '%', 0, 0, 816, 48, 'center');

                this._animationSprite2.setFrame(0, 0, 816 * this._animationValue / 100, 48)
                if (this._animationValue >= 100) {
                    this._animationValue = 100;
                    this._qhState = 3;
                }
            };
        } else {
            if (this._animationCount >= this._animationSpeed) {
                this._animationValue++
                if (this._animationValue % 20 == 0) {
                    SoundManager.playIntensifySe('Hammer', 50);
                }
                this._animationSprite3.bitmap.clear();
                this._animationSprite3.bitmap.textColor = ColorManager.textColor(0);
                this._animationSprite3.bitmap.fontSize = 30;
                this._animationSprite3.outlineWidth = 3;
                this._animationSprite3.bitmap.drawText(this._animationValue + '%', 0, 0, 816, 48, 'center');
                this._animationSprite2.setFrame(0, 0, 816 * this._animationValue / 100, 48)
                if (this._animationValue >= 100) {
                    this._animationValue = 100;
                    this._qhState = 3;
                }
            };
        }
        if (Input.isTriggered("escape") && this._qhState == 2) {
            this._qhState = 3;
        };
    }
    if (this._qhState == 3) {
        this._animationSprite.bitmap = ImageManager.loadBitmap();
        this._animationSprite2.bitmap = ImageManager.loadBitmap();
        this._animationSprite3.bitmap.clear();
        this._animationSprite4.bitmap.clear();
        if (this._success) {
            if (DataManager.isArmor(this._listWindow.item())) {
                this._animationSprite.x = Graphics.width / 2 - 200;
                this._animationSprite.y = Graphics.height / 2 - 260;
                this._animationSprite.bitmap = this._loadBitmap[6];
            } else {
                this._animationSprite.x = Graphics.width / 2 - 300;
                this._animationSprite.y = Graphics.height / 2 - 335;
                this._animationSprite.bitmap = this._loadBitmap[4];
            }
            SoundManager.playIntensifySe('Heal7', 150);
            this.onSuccess();
        } else {
            if (DataManager.isArmor(this._listWindow.item())) {
                this._animationSprite.x = Graphics.width / 2 - 200;
                this._animationSprite.y = Graphics.height / 2 - 260;
                this._animationSprite.bitmap = this._loadBitmap[7];
            } else {
                this._animationSprite.x = Graphics.width / 2 - 300;
                this._animationSprite.y = Graphics.height / 2 - 335;
                this._animationSprite.bitmap = this._loadBitmap[5];
            }
            SoundManager.playIntensifySe('Down2', 100);
        }
        this._animationCount = 0;
        // this._animationId = 1;
        this._animationValue = 0;
        this._animationSpeed = 2;
        this._qhState = 4;
    };
    if (this._qhState == 4) {
        this._animationCount++;
        if (this._animationCount == 120) {
            this._animationSprite.bitmap = ImageManager.loadBitmap();
            this._animationSprite.x = Graphics.width / 2 - 400;
            this._animationSprite.y = Graphics.height / 2;
            this._animationCount = 0;
            this._goldLsWindow.refresh();
            this._listWindow.refresh();
            this._qhState = 5;
        }
    };
    if (this._qhState == 5) {
        this._qhState = 1;
        // this._animationSprite.bitmap = ImageManager.loadBitmap('');
        this._commandWindow.activate();
    };
};

Scene_Intensify.prototype.onCommand = function () {
    const item = this._listWindow.item();
    if (item) {
        var max = 10;
        if (item.meta.强化上限) {
            var max = Number(item.meta.强化上限)
        }
        if (item.intensify >= max) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this._radioInfoWindow.refresh('强化');
            return;
        }
        const gold = $gameParty.numItems($dataItems[53]);
        const needGold = item._intensifyLevelGold[item.intensify];
        if (gold < needGold) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            this._radioInfoWindow.refresh('强化灵石', needGold);
            return;
        }
        if (item.meta.强化材料) {
            const data = item._intensifyLevelData[item.intensify];
            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    const items = $dataItems[Number(data[i][0])];
                    const needNumber = Number(data[i][1])
                    const nowNumber = $gameParty.numItems(items);
                    if (nowNumber < needNumber) {
                        this._commandWindow.activate();
                        SoundManager.playBuzzer();
                        this._radioInfoWindow.refresh('强化材料', items, needNumber);
                        return;
                    };
                };
            };
            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    const items = $dataItems[Number(data[i][0])];
                    const needNumber = Number(data[i][1])
                    $gameParty.loseItem(items, needNumber);
                };
            };
            // const meta = item.meta.强化材料.split(',');
            // const items = $dataItems[Number(meta[0])];
            // const needNumber = Number(meta[1])
            // const nowNumber = $gameParty.numItems(items);
            // if (nowNumber < needNumber) {
            //     this._commandWindow.activate();
            //     SoundManager.playBuzzer();
            //     return;
            // };
            // $gameParty.loseItem(items, needNumber);
            // const itemsx = $dataItems[Number(meta[2])];
            // const needNumberx = Number(meta[3])
            // const nowNumberx = $gameParty.numItems(itemsx);
            // if (nowNumberx < needNumberx) {
            //     this._commandWindow.activate();
            //     SoundManager.playBuzzer();
            //     return;
            // };
            // $gameParty.loseItem(itemsx, needNumberx);
        };
        $gameParty.loseItem($dataItems[53], needGold);
        // var randomNumber = Math.floor(Math.random() * 100) + 1;
        // if (randomNumber < (10 - item.intensify) * 10) {
        //     this._success = true;
        // } else {
        //     this._success = false;
        // }
        this._success = true;
        this._qhState = 2;
    } else {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
};

Scene_Intensify.prototype.onSuccess = function () {
    const item = this._listWindow.item();
    const param = item._intensifyParam;
    for (let index = 0; index < param.length; index++) {
        const paramValue = param[index];
        if (paramValue > 0) {
            var value = paramValue;
            item.params[index] += value;
        };
    };
    item.intensify++;
    ItemManager.updateBoostItemName(item);
};

Scene_Intensify.prototype.cancelCommand = function () {
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this._listWindow.activate();
};

Scene_Intensify.prototype.commandWindowRect = function () {
    const ww = 370;
    const wh = 80;
    const wx = 580;
    const wy = 366 + 180 + 1;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Intensify.prototype.createInfoWindow = function () {
    const rect = this.infoWindowRect();
    this._infoWindow = new Window_IntensifyInfo(rect);
    this.addChild(this._infoWindow);
};

Scene_Intensify.prototype.infoWindowRect = function () {
    const ww = 700;
    const wh = 500;
    const wx = 450;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Intensify.prototype.createEquipSprite = function () {
    this._equipSprite = new Sprite();
    this.addChild(this._equipSprite);
    this._equipSprite.x = 587;
    this._equipSprite.y = 140;
};

Scene_Intensify.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_IntensifyEquipList(rect);
    this._listWindow.setHandler('ok', this.onList.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._listWindow);
    this._listWindow.activate();
    this._listWindow.select(0);
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._listWindow) this._listWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_Intensify.prototype.onList = function () {
    const item = this._listWindow.item();
    if (!item) {
        this._listWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
    this._listWindow.deactivate();
    this._commandWindow.activate();
    this._commandWindow.select(0);
};

Scene_Intensify.prototype.listWindowRect = function () {
    const ww = 300;
    const wh = 478;
    const wx = 150;
    const wy = 124;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_IntensifyEquipList() {
    this.initialize(...arguments);
}

Window_IntensifyEquipList.prototype = Object.create(Window_Selectable.prototype);
Window_IntensifyEquipList.prototype.constructor = Window_IntensifyEquipList;

Window_IntensifyEquipList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/newUi/dz/', 'listBack');
    this.createCursorSprite();
    this.activate();
    this.refresh();
};

Window_IntensifyEquipList.prototype.item = function () {
    return this._list[this.index()]
};

Window_IntensifyEquipList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const weapons = $gameParty.weapons();
    const armors = $gameParty.armors()
    if ($gameTemp._selectEquipType == '武器' || $gameTemp._selectEquipType == 'Vũ khí') {
        for (let index = 0; index < weapons.length; index++) {
            const weapon = weapons[index];
            if (DataManager.isAloneItems(weapon) && weapon.meta.强化材料) {
                this._list.push(weapon);
            }
        };
    } else {
        for (let index = 0; index < armors.length; index++) {
            const armor = armors[index];
            if (DataManager.isAloneItems(armor) && armor.etypeId != 8 && armor.meta.强化材料) {
                this._list.push(armor);
            }
        };
    }

    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText('无可强化装备', -10, this.height / 2 - 40, this.width, 'center')
        this.select(-1);
    };
};

Window_IntensifyEquipList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 22;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item.name, rect.x + 48 + 10, rect.y - 3, rect.width, 'left');
        this.drawIcon(item.iconIndex, rect.x + 16 + 10, rect.y - 2);
    }
};

Window_IntensifyEquipList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_IntensifyEquipList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_IntensifyEquipList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x - 20 + 10;
        this._cursorSprites.y = this._cursorSprite.y + 4;
    } else {
        this._cursorSprites.visible = false;
    };
    this._miniInfoWindow.x = this._cursorSprites.x;
};

Window_IntensifyEquipList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 4;
        const dy = rect.y - 16;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    };
};

Window_IntensifyEquipList.prototype.maxCols = function () {
    return 1;
};

Window_IntensifyEquipList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_IntensifyEquipList.prototype.numVisibleRows = function () {
    return 7;
};

Window_IntensifyEquipList.prototype.drawBackgroundRect = function (rect) {
};

Window_IntensifyEquipList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

function Window_IntensifyEquipList_X() {
    this.initialize(...arguments);
}

Window_IntensifyEquipList_X.prototype = Object.create(Window_IntensifyEquipList.prototype);
Window_IntensifyEquipList_X.prototype.constructor = Window_IntensifyEquipList_X;

Window_IntensifyEquipList_X.prototype.initialize = function (rect) {
    Window_IntensifyEquipList.prototype.initialize.call(this, rect);
};

Window_IntensifyEquipList_X.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const weapons = $gameParty.weapons();
    const armors = $gameParty.armors();
    if ($gameTemp._selectEquipType == '武器' || $gameTemp._selectEquipType == 'Vũ khí') {
        for (let index = 0; index < weapons.length; index++) {
            const weapon = weapons[index];
            if (DataManager.isAloneItems(weapon) && weapon.meta.装备升级) {
                this._list.push(weapon);
            }
        };
    } else {
        for (let index = 0; index < armors.length; index++) {
            const armor = armors[index];
            if (DataManager.isAloneItems(armor) && armor.etypeId != 8 && armor.meta.装备升级) {
                this._list.push(armor);
            }
        };
    }
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText('无可升级装备', -10, this.height / 2 - 40, this.width, 'center')
        this.select(-1);
    };
};


function Window_IntensifyInfo() {
    this.initialize(...arguments);
}

Window_IntensifyInfo.prototype = Object.create(Window_Base.prototype);
Window_IntensifyInfo.prototype.constructor = Window_IntensifyInfo;

Window_IntensifyInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_IntensifyInfo.prototype.refresh = function (item) {
    this.createContents();
    this._item = item;
    this.changeTextColor('#462a39');
    this.contents.fontSize = 20;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    var max = 10;
    if (this._item.meta.强化上限) {
        var max = Number(this._item.meta.强化上限)
    }
    if (this._item.intensify >= max) {
        var textMax = 'Max';
    } else {
        var textMax = this._item.intensify;
    }
    this.drawText('当前强化等级：' + textMax, 130, 270, this.width, 'left');
    this.drawText('强化后提升：', 130, 300, this.width, 'left');
    var x = 130;
    var y = 330;
    const param = item._intensifyParam;
    var numberx = 0;
    const paramName = ['Hp+', 'Mp+', 'Công Kích+', 'Phòng Ngự+', 'Pháp Công+', 'Pháp Phòng+', 'Thân Pháp+', 'Khí Vận+'];
    for (let index = 0; index < param.length; index++) {
        const paramValue = param[index];
        if (paramValue > 0) {
            var value = paramValue;
            this.drawText(paramName[index] + value, x, y, 200, 'left');
            numberx++;
            if (numberx % 2 === 0) {
                x = 130;
                y += 28;
            } else {
                x = 300;
            };
        };
    };
    var x = 296;
    var y = 402;
    this.drawIcon(330, x, y)
    const gold = this._item._intensifyLevelGold[this._item.intensify];
    this.drawText('灵石(' + $gameParty.numItems($dataItems[53]) + '/' + gold + ')', x + 80, y + 4, 150, 'center');
    var text = '';
    if (this._item.meta.强化材料) {
        const data = this._item._intensifyLevelData[this._item.intensify];
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                const items = $dataItems[Number(data[i][0])];
                const number = Number(data[i][1])
                // if (i == 1) {
                //     var text = text + '  ' + items.name + '(' + $gameParty.numItems(items) + '/' + number + ')';
                // } else {
                //     var text = items.name + '(' + $gameParty.numItems(items) + '/' + number + ')';
                // }
                if (i == 0) {
                    var x = 43;
                    var y = 282;
                } else if (i == 1) {
                    var x = 530;
                    var y = 282;
                }
                this.drawIcon(items.iconIndex, x, y)
                this.drawText(items.name + '(' + $gameParty.numItems(items) + '/' + number + ')', x - 50, y - 40, 150, 'center');
            }
        };
    };
    if (this._item.intensify >= max) {
        return;
    }
    // const gold = this._item._intensifyLevelGold[this._item.intensify];
    // this.drawText('所需材料：', x, y, this.width, 'left');
    // y += 26;
    // this.contents.fontSize = 16;
    // this.drawText('灵石(' + $gameParty.numItems($dataItems[53]) + '/' + gold + ')' + '  ' + text, x, y, this.width, 'left');
};

Window_IntensifyInfo.prototype.drawIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 1.5;
    const sch = ph * 1.5;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};

function Window_IntensifyCommand() {
    this.initialize.apply(this, arguments);
}

Window_IntensifyCommand.prototype = Object.create(Window_Command.prototype);
Window_IntensifyCommand.prototype.constructor = Window_IntensifyCommand;

Window_IntensifyCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.createCursorSprite();
    this.refresh();
};

Window_IntensifyCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites);
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/newUi/dz/', 'cursor');
    this._cursorSprites.scale.set(1);
    this._cursorSprites.setFrame(0, 0, 48, 48);
    this._clientArea.addChild(this._cursorSprites);
};

Window_IntensifyCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 26;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText(this.commandName(index), rect.x + 16, rect.y, rect.width, align);
};

Window_IntensifyCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        var ofx = 0;
        if (this.index() == 1) {
            var ofx = 24;
        };
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + ofx + 50;
        this._cursorSprites.y = this._cursorSprite.y + 2;
    } else {
        this._cursorSprites.visible = false;
    };
};

Window_IntensifyCommand.prototype.makeCommandList = function () {
    this.addCommand('开始强化', 'ok', true);
};

Window_IntensifyCommand.prototype.maxItems = function () {
    return 1;
};

Window_IntensifyCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_IntensifyCommand.prototype.maxCols = function () {
    return 1;
};

Window_IntensifyCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_IntensifyCommand.prototype.drawBackgroundRect = function (rect) {
};

function Window_IntensifyCommand_X() {
    this.initialize.apply(this, arguments);
}

Window_IntensifyCommand_X.prototype = Object.create(Window_IntensifyCommand.prototype);
Window_IntensifyCommand_X.prototype.constructor = Window_IntensifyCommand_X;

Window_IntensifyCommand_X.prototype.initialize = function (rect) {
    Window_IntensifyCommand.prototype.initialize.call(this, rect);
};

Window_IntensifyCommand_X.prototype.makeCommandList = function () {
    this.addCommand('开始升级', 'ok', true);
    // this.addCommand('返回', 'cancel', true);
};

function Window_IntensifyInfo_X() {
    this.initialize(...arguments);
}

Window_IntensifyInfo_X.prototype = Object.create(Window_Base.prototype);
Window_IntensifyInfo_X.prototype.constructor = Window_IntensifyInfo_X;

Window_IntensifyInfo_X.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_IntensifyInfo_X.prototype.refresh = function (item) {
    this.createContents();
    this._item = item;
    this.changeTextColor('#462a39');
    this.contents.fontSize = 20;
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    if (DataManager.isArmor(item)) {
        var items = $dataArmors[Number(this._item.meta.装备升级)];
    } else {
        var items = $dataWeapons[Number(this._item.meta.装备升级)];
    }
    this.drawText('升级后装备：', 130, 270, this.width, 'left');
    this.drawIcon(items.iconIndex, 130, 300);
    this.drawText(items.name, 170, 300, this.width, 'left');
    var x = 296;
    var y = 402;
    this.drawIcons(330, x, y)
    var needGold = this._item.intensify * 100 + 100;
    if (item.meta.升级灵石) {
        var needGold = Number(item.meta.升级灵石);
    }
    this.drawText('灵石(' + $gameParty.numItems($dataItems[53]) + '/' + needGold + ')', x + 80, y + 4, 150, 'center');
    var text = '';
    if (this._item.meta.升级材料) {
        const meta = this._item.meta.升级材料.split(',');
        const items = $dataItems[Number(meta[0])];
        const number = Number(meta[1])
        var x = 43;
        var y = 282;
        this.drawIcons(items.iconIndex, x, y)
        this.drawText(items.name + '(' + $gameParty.numItems(items) + '/' + number + ')', x - 50, y - 40, 150, 'center');
        // var text = items.name + '(' + $gameParty.numItems(items) + '/' + number + ')';
    };
    // this.drawText('所需材料：', x, y, this.width, 'left');
    // y += 30;
    // var needGold = this._item.intensify * 100 + 100;
    // if (item.meta.升级灵石) {
    //     var needGold = Number(item.meta.升级灵石);
    // }
    // this.drawText('灵石(' + $gameParty.numItems($dataItems[FlyCat.LL_SceneMenu.goldItem]) + '/' + needGold + ')' + '  ' + text, x, y, this.width, 'left');
};

Window_IntensifyInfo_X.prototype.drawIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 1;
    const sch = ph * 1;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};

Window_IntensifyInfo_X.prototype.drawIcons = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 1.5;
    const sch = ph * 1.5;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};

function Window_TowerRadioInfo() {
    this.initialize(...arguments);
}

Window_TowerRadioInfo.prototype = Object.create(Window_Base.prototype);
Window_TowerRadioInfo.prototype.constructor = Window_TowerRadioInfo;

Window_TowerRadioInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 255;
    this._type = null;
    this._times = 0;
    this.hide();
};

Window_TowerRadioInfo.prototype.updateBackOpacity = function () {
    this.backOpacity = 255;
};

Window_TowerRadioInfo.prototype.refresh = function (type, data, value) {
    this.contents.fontSize = 22;
    this.contents.clear();
    this.show();
    if (type) {
        this._type = type;
    }
    if (type == '升级') {
        var text = '无法升级！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText('该装备未强化至最高等级！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
    if (type == '强化') {
        var text = '无法强化！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText('该装备已强化至最高等级！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
    if (type == '灵石') {
        var text = '无法升级！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText('灵石不足' + data + '！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
    if (type == '强化灵石') {
        var text = '无法强化！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText('灵石不足' + data + '！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
    if (type == '材料') {
        var text = '无法升级！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText(data.name + '数量不足' + value + '！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
    if (type == '强化材料') {
        var text = '无法强化！';
        this.drawText(text, 0, this.height / 2 - 55, this.width - this.contents.fontSize, 'center')
        this.drawText(data.name + '数量不足' + value + '！', 0, this.height / 2, this.width - this.contents.fontSize, 'center')
    };
};

Window_TowerRadioInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this._type) {
        this._times++
        if (this._times > 120) {
            this._times = 0;
            this._type = null;
            this.hide();
        }
    }
}