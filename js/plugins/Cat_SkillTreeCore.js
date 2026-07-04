
//=============================================================================
// RPG Maker MZ - 技能树核心
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<技能树核心>
 * @author FlyCat
 * 
 * @param data
 * @type struct<TreeDataType>[]
 * @default
 * @text 技能树设置
 * @desc 技能树设置
 * 
 * @command openTreeData
 * @text 打开指定技能树
 * @desc 打开指定技能树
 *
 * @arg Id
 * @type number
 * @default 1
 * @text 技能树Id
 * @desc 技能树Id
 * 
 * @help
 * 技能备注：<演示动画偏移:x,y,scale> x横轴偏移 y纵轴偏移 scale 缩放率 默认100%
 * 范例：<演示动画偏移:0,100,100> x偏移0 y偏移100像素 缩放100%为正常
 * 
 * <技能进阶:id,id,id,id>
 * 范例：<技能进阶:11,12,13,14>
 * 在主技能上书写备注 可进阶几次就写几个技能的备注 对应的插件设置内要一致
 */
/*~struct~TreeDataType:
 @param name
 @text 方便查看当前种类（无作用）
 @type string
 @default 

 @param backImg
 @text 技能演示背景
 @require 1
 @dir img/menu/
 @type file

 @param playerImg
 @text 技能演示立绘
 @require 1
 @dir img/menu/
 @type file

 @param x
 @text 立绘X
 @type number
 @default 664

 @param y
 @text 立绘Y
 @type number
 @default 287

 @param actorScale
 @text 角色立绘缩放比例
 @type string
 @default 0.5
 @desc 默认0.5（1就是原比例）

 @param enemyImg
 @text 技能演示敌人立绘
 @require 1
 @dir img/menu/
 @type file

 @param eX
 @text 敌人立绘X
 @type number
 @default 570

 @param eY
 @text 敌人立绘Y
 @type number
 @default 600

 @param scale
 @text 敌人立绘缩放比例
 @type string
 @default 0.5
 @desc 默认0.5（1就是原比例）

 @param treeData
 @text 技能设置
 @type struct<TreeData>[]
 @default 
 @desc 技能设置
*/
/*~struct~TreeData:
@param skillId
@text 选择学习技能
@type skill
@default 

@param level
@text 学习技能所需等级
@type number
@default 1

@param itemData
@text 学习所需物品材料
@type struct<itemMaterialDate>

@param maxLevel
@text 进阶次数
@type number
@default 4

@param upData
@text 技能进阶材料设置
@type struct<itemMaterialDate>[]
@desc 对应每个等级的材料

@default
*/
/*~struct~itemMaterialDate:
@param item
@text 物品
@type item

@param number
@text 所需数量
@type number
@default 1
*/


'use strict';
var Imported = Imported || {};
Imported.Cat_SkillTreeCore = true;

var Cat = Cat || {};
Cat.SkillTreeCore = {};
Cat.SkillTreeCore.parameters = PluginManager.parameters('Cat_SkillTreeCore');
Cat.SkillTreeCore.data = JSON.parse(Cat.SkillTreeCore.parameters['data'] || '[]');

if (Cat.SkillTreeCore.data) {
    const length = Cat.SkillTreeCore.data.length;
    for (let i = 0; i < length; i++) {
        if (Cat.SkillTreeCore.data[i]) {
            Cat.SkillTreeCore.data[i] = JSON.parse(Cat.SkillTreeCore.data[i]);
            Cat.SkillTreeCore.data[i].treeData = JSON.parse(Cat.SkillTreeCore.data[i].treeData);
            for (let s = 0; s < Cat.SkillTreeCore.data[i].treeData.length; s++) {
                Cat.SkillTreeCore.data[i].treeData[s] = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s]);
                //    Cat.SkillTreeCore.data[i].treeData[s].gold = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].gold);
                Cat.SkillTreeCore.data[i].treeData[s].itemData = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].itemData);
                Cat.SkillTreeCore.data[i].treeData[s].itemData.item = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].itemData.item)
                Cat.SkillTreeCore.data[i].treeData[s].itemData.number = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].itemData.number)
                Cat.SkillTreeCore.data[i].treeData[s].level = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].level);
                Cat.SkillTreeCore.data[i].treeData[s].maxLevel = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].maxLevel);
                Cat.SkillTreeCore.data[i].treeData[s].skillId = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].skillId);
                Cat.SkillTreeCore.data[i].treeData[s].upData = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].upData);
                for (let ss = 0; ss < Cat.SkillTreeCore.data[i].treeData[s].upData.length; ss++) {
                    Cat.SkillTreeCore.data[i].treeData[s].upData[ss] = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].upData[ss]);
                    Cat.SkillTreeCore.data[i].treeData[s].upData[ss].item = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].upData[ss].item);
                    Cat.SkillTreeCore.data[i].treeData[s].upData[ss].number = JSON.parse(Cat.SkillTreeCore.data[i].treeData[s].upData[ss].number);
                };
            }
        }
    }
    //console.log(Cat.SkillTreeCore.data)
};


PluginManager.registerCommand('Cat_SkillTreeCore', 'openTreeData', args => {
    $gameTemp._skillTreeDataId = Number(args.Id) - 1;
    SceneManager.push(Scene_TreeCore);
});

Cat.SkillTreeCore.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_TreeCore) {
        this.opacity = 0;
    } else {
        Cat.SkillTreeCore.Sprite_Button_updateOpacity.call(this);
    }
};

function Scene_TreeCore() {
    this.initialize(...arguments);
}

Scene_TreeCore.prototype = Object.create(Scene_MenuBase.prototype);
Scene_TreeCore.prototype.constructor = Scene_TreeCore;

Scene_TreeCore.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._treeId = $gameTemp._skillTreeDataId;
    this._data = Cat.SkillTreeCore.data[this._treeId];
    this._actor = $gameParty.allMembers()[0];
    if (!$gameSystem._skillTreeData) {
        $gameSystem._skillTreeData = [];
    }
    if (!$gameSystem._skillTreeData[this._treeId]) {
        $gameSystem._skillTreeData[this._treeId] = this._data;
        if ($gameSystem._skillTreeData[this._treeId]) {
            for (let i = 0; i < $gameSystem._skillTreeData[this._treeId].treeData.length; i++) {
                const data = $gameSystem._skillTreeData[this._treeId].treeData[i];
                data._skillLevel = 0;
                data.upSkillData = [];
                if (data && data.skillId > 0 && $dataSkills[data.skillId]) {
                    const skill = $dataSkills[data.skillId];
                    if (skill.meta.技能进阶) {
                        data.upSkillData = skill.meta.技能进阶.split(',');
                    }
                };

            }
        }
    }
};
Cat.SkillTreeCore.Scene_HeartCore_createBackground = Scene_HeartCore.prototype.createBackground
Scene_TreeCore.prototype.createBackground = function () {
    Cat.SkillTreeCore.Scene_HeartCore_createBackground.call(this);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'skillBack');
};
Scene_TreeCore.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};
Scene_TreeCore.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createSkillInfoWindow();
    this.createSkillListWindow();
    this.createAnimationSprite();
};
Scene_TreeCore.prototype.createAnimationSprite = function () {
    this._playerSprite = new Sprite()
    this._playerSprite.x = Number($gameSystem._skillTreeData[this._treeId].x) || 664;
    this._playerSprite.y = Number($gameSystem._skillTreeData[this._treeId].y) || 287;
    this._playerSprite.bitmap = ImageManager.loadBitmap('img/menu/', $gameSystem._skillTreeData[this._treeId].playerImg);
    const actorScale = Number($gameSystem._skillTreeData[this._treeId].actorScale) || 0.5;
    this._playerSprite.scale.set(actorScale);
    this.addChild(this._playerSprite)

    this._animationSprite = new NewSpriteset_Base();
    this._animationSprite._animationId = 0;
    this._animationSprite._playingAnimation = false;
    this._animationSprite.x = Number($gameSystem._skillTreeData[this._treeId].eX) || 570;
    this._animationSprite.y = Number($gameSystem._skillTreeData[this._treeId].eY) || 600;
    this._animationSprite.bitmap = ImageManager.loadBitmap('img/menu/', $gameSystem._skillTreeData[this._treeId].enemyImg);
    this.addChild(this._animationSprite);
    this._animationSprite.anchor.x = 0.5;
    this._animationSprite.anchor.y = 1;
    const scale = Number($gameSystem._skillTreeData[this._treeId].scale) || 0.5;
    this._animationSprite.scale.set(scale);
};
Scene_TreeCore.prototype.createSkillInfoWindow = function () {
    const rect = this.skillInfoWindowRect();
    this._skillInfoWindow = new Window_SkillTreeInfo(rect);
    this.addChild(this._skillInfoWindow);

    const rects = this.animationWindowRect();
    this._animationWindow = new Window_SkillTreeAnimation(rects);
    this.addChild(this._animationWindow);
};
Scene_TreeCore.prototype.skillInfoWindowRect = function () {
    const wx = 550;
    const wy = 100;
    const ww = 560;
    const wh = 330;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_TreeCore.prototype.animationWindowRect = function () {
    const wx = 382;
    const wy = 270;
    const ww = 748;
    const wh = 346;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_TreeCore.prototype.createSkillListWindow = function () {
    const rect = this.skillWindowRect();
    this._skillWindow = new Window_SkillTreeList(rect);
    this._skillWindow.setHandler('ok', this.onSkill.bind(this));
    this._skillWindow.setHandler('cancel', this.popScene.bind(this));
    this.addChild(this._skillWindow);
    this._skillWindow.activate();
    if (this._skillWindow._list && this._skillWindow._list.length > 0) {
        this._skillWindow.select(0);
    }
};
Scene_TreeCore.prototype.onSkill = function () {
    this._skillWindow.deactivate();
    this._commandWindow.activate();
    this._commandWindow.select(0);
};
Scene_TreeCore.prototype.skillWindowRect = function () {
    const wx = 110;
    const wy = 110;
    const ww = 290;
    const wh = 480;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_TreeCore.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_SkillTreeCommand(rect);
    this._commandWindow.setHandler('learn', this.onLearnCommand.bind(this));
    this._commandWindow.setHandler('upLearn', this.onUpLearnCommand.bind(this));
    this._commandWindow.setHandler('cancel', this.cancelSkill.bind(this));
    this.addChild(this._commandWindow);
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this.createCommandSprite();
};
Scene_TreeCore.prototype.createCommandSprite = function () {
    this._skillTreeButtonSprite = [];
    var x = 410;
    var y = 120;
    for (let i = 0; i < 2; i++) {
        this._skillTreeButtonSprite[i] = new Sprite_TreeCommandButton();
        this.addChild(this._skillTreeButtonSprite[i]);
        this._skillTreeButtonSprite[i]._buttonId = i;
        this._skillTreeButtonSprite[i].bitmap = ImageManager.loadBitmap('img/menu/', "learnSkill_" + i)
        this._skillTreeButtonSprite[i].x = x;
        this._skillTreeButtonSprite[i].y = y;
        y += 50;
    }
};
Scene_TreeCore.prototype.commandWindowRect = function () {
    const ww = 200;
    const wh = 100;
    const wx = 2000;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_TreeCore.prototype.onLearnCommand = function () {
    const actor = $gameParty.allMembers()[0];
    const skill = this._skillWindow.skill();
    if (!skill) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    var needLevel = skill.level;
    if (this._actor._level < needLevel) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    const level = skill._skillLevel;
    if (level == 0) {
        const skills = $dataSkills[skill.skillId];
        if (this._actor.isLearnedSkill(skills.id)) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            return;
        } else {
            if (skill.itemData) {
                var needItem = $dataItems[Number(skill.itemData.item)];
                var needNumber = Number(skill.itemData.number);
                var number = $gameParty.numItems(needItem);
                if (number < needNumber) {
                    this._commandWindow.activate();
                    SoundManager.playBuzzer();
                    return;
                };
                $gameParty.loseItem(needItem, needNumber);
            };
            actor.learnSkill(skills.id);
            SoundManager.playUseItem();
            this._commandWindow.activate();
            this._skillWindow._loadingPictrue = false;
            return;
        }
    } else {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }

};
Scene_TreeCore.prototype.onUpLearnCommand = function () {
    const actor = $gameParty.allMembers()[0];
    const skill = this._skillWindow.skill();
    if (!skill) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    const skills = $dataSkills[skill.skillId];
    var skillLevel = skill._skillLevel;
    var upSkillData = skill.upSkillData;
    var maxLevel = skill.maxLevel;
    if (skillLevel >= maxLevel) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    if (!this._actor.isLearnedSkill(skills.id) && skillLevel == 0) {
        this._commandWindow.activate();
        SoundManager.playBuzzer();
        return;
    };
    if (skill.upData) {
        var upData = skill.upData[skillLevel];
        var needItem = $dataItems[Number(upData.item)];
        var needNumber = Number(upData.number);
        var number = $gameParty.numItems(needItem);
        if (number < needNumber) {
            this._commandWindow.activate();
            SoundManager.playBuzzer();
            return;
        };
        $gameParty.loseItem(needItem, needNumber);
    };
    if (skillLevel == 0) {
        actor.forgetSkill(skill.skillId);
    } else {
        actor.forgetSkill(Number(upSkillData[skillLevel - 1]));
    }
    actor.learnSkill(Number(upSkillData[skillLevel]));
    skill._skillLevel += 1;
    SoundManager.playUseItem();
    this._commandWindow.activate();
    this._skillWindow._loadingPictrue = false;
    return;

};
Scene_TreeCore.prototype.cancelSkill = function () {
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this._skillWindow.activate();
};

Scene_TreeCore.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._skillInfoWindow && this._skillWindow) {
        const skill = this._skillWindow.skill();
        if (skill) {
            this._skillInfoWindow.refresh(skill);
            if (this._animationSprite && this._animationSprite._playingAnimation == false) {
                this._lastSkill = skill;
                var skillLevel = skill._skillLevel;
                var upSkillData = skill.upSkillData;
                if (skillLevel > 0) {
                    var skills = $dataSkills[Number(upSkillData[skillLevel - 1])];
                } else {
                    var skills = $dataSkills[skill.skillId];
                }
                $gameTemp._animationXy = null;
                if (skills.meta.演示动画偏移) {
                    const meta = skills.meta.演示动画偏移.split(',');
                    const x = Number(meta[0]) || 0;
                    const y = Number(meta[1]) || 0;
                    const scale = Number(meta[2]) || 100;
                    $gameTemp._animationXy = [x, y, scale]
                }
                if (skills.animationId > 0) {
                    const animationId = skills.animationId;
                    $gameTemp.newRequestAnimation(this._animationSprite, animationId, true)
                    this._animationSprite._playingAnimation = true;
                }
            }
        }
    }
};
function Window_SkillTreeCommand() {
    this.initialize.apply(this, arguments);
}

Window_SkillTreeCommand.prototype = Object.create(Window_Command.prototype)
Window_SkillTreeCommand.prototype.constructor = Window_SkillTreeCommand;

Window_SkillTreeCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 255;
};
Window_SkillTreeCommand.prototype.makeCommandList = function () {
    this.addCommand('学习技能', 'learn', true);
    this.addCommand('技能升级', 'upLearn', true);
};
Window_SkillTreeCommand.prototype.maxItems = function () {
    return 2;
};
Window_SkillTreeCommand.prototype.numVisibleRows = function () {
    return 2;
};
Window_SkillTreeCommand.prototype.maxCols = function () {
    ;
    return 1;
};

function Window_SkillTreeInfo() {
    this.initialize(...arguments);
}

Window_SkillTreeInfo.prototype = Object.create(Window_Base.prototype);
Window_SkillTreeInfo.prototype.constructor = Window_SkillTreeInfo;

Window_SkillTreeInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._treeId = $gameTemp._skillTreeDataId;
    this._treeData = $gameSystem._skillTreeData[this._treeId];
    this._actor = $gameParty.allMembers()[0];
};
Window_SkillTreeInfo.prototype.refresh = function (data) {
    this.contents.clear();
    this._data = data;
    var skillLevel = data._skillLevel;
    var upSkillData = data.upSkillData;
    if (skillLevel > 0) {
        var skill = $dataSkills[Number(upSkillData[skillLevel - 1])];
    } else {
        var skill = $dataSkills[data.skillId];
    }
    //   console.log(skill)
    var needItem = null;
    var needNumber = 0;
    var needLevel = data.level;
    var upData = data.upData[skillLevel];
    var maxLevel = data.maxLevel;
    if (data.itemData) {
        var needItem = $dataItems[Number(data.itemData.item)];
        var needNumber = Number(data.itemData.number);
    }
    if (this._actor.isLearnedSkill(skill.id)) {
        this.contents.fontSize = 18;
        var text = '（已学习）';
        var text_1 = '当前技能等级：' + (skillLevel + 1) + '（最高' + (maxLevel + 1) + '）';
        this.drawTextEx(text_1, 0, 0, this.width, 22);
        this.drawTextEx('升级所需条件：', 0, 36, this.width, 22);
        if (upData) {
            const item = $dataItems[Number(upData.item)];
            const number = upData.number;
            const nowNumber = $gameParty.numItems(item);
            if (nowNumber >= number) {
                var color = '\\C[3]';
            } else {
                var color = '\\C[18]';
            }
            var text_2 = '\\I[' + item.iconIndex + ']' + item.name + ' x ' + number + color + '（当前' + item.name + '：' + nowNumber + '）';
            this.drawTextEx(text_2, 0, 72, this.width, 22);
        } else {
            this.drawTextEx('无', 0, 72, this.width, 22);
        }
        if (skill.description) {
            this.drawTextEx('介绍：' + skill.description, 0, 108, this.width, 18);
        }
    } else {
        var text = '（未学习）';
        if (needItem) {
            var number = $gameParty.numItems(needItem);
            if (number >= needNumber) {
                var color = '\\C[3]';
            } else {
                var color = '\\C[27]';
            }
            var text_1 = '\\I[' + needItem.iconIndex + ']' + needItem.name + ' x ' + needNumber + color + '（当前灵石：' + number + '）';
        } else {
            var text_1 = '无';
        };
        this.drawTextEx('学习该技能条件：', 0, 0, this.width);
        this.drawTextEx(text_1, 0, 36, this.width, 22);
        var text_2 = '人物等级需达到' + needLevel + '级（当前人物等级:' + this._actor._level + '级)';
        this.drawTextEx(text_2, 0, 72, this.width, 22);
        if (skill.description) {
            this.drawTextEx('介绍：' + skill.description, 0, 108, this.width, 18);
        }

    }
};
Window_SkillTreeInfo.prototype.drawTextEx = function (text, x, y, width, type) {
    this.resetFontSettings(type);
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState.outputWidth;
};
Window_SkillTreeInfo.prototype.resetFontSettings = function (type) {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.resetTextColor();
    if (this._data) {
        this.contents.fontSize = type ? type : 18;
        var skillLevel = this._data._skillLevel;
        var upSkillData = this._data.upSkillData;
        if (skillLevel > 0) {
            var skill = $dataSkills[Number(upSkillData[skillLevel - 1])];
        } else {
            var skill = $dataSkills[this._data.skillId];
        }
        if (this._actor.isLearnedSkill(skill.id)) {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 0;
        } else {
            this.contents.fontSize = type ? type : 24;
            this.changeTextColor('#de4b2e');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 0;
        }
    }
};

function Window_SkillTreeList() {
    this.initialize(...arguments);
}

Window_SkillTreeList.prototype = Object.create(Window_Selectable.prototype);
Window_SkillTreeList.prototype.constructor = Window_SkillTreeList;

Window_SkillTreeList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'learnSkillBack');
    this.createCursorSprite();
    this._treeId = $gameTemp._skillTreeDataId;
    this._data = $gameSystem._skillTreeData[this._treeId];
    this._list = $gameSystem._skillTreeData[this._treeId].treeData;
    this._actor = $gameParty.allMembers()[0];
    this._loadingPictrue = false;
};
Window_SkillTreeList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
Window_SkillTreeList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 2;
        const dy = rect.y - 6;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_SkillTreeList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'learnSkill');
    this._clientArea.addChild(this._cursorSprites);
};
Window_SkillTreeList.prototype.skill = function () {
    return this._list[this.index()];
};
Window_SkillTreeList.prototype.refresh = function () {
    this.contents.clear();
    this.contents.fontSize = 24;
    if (this._list && this._list.length > 0) {
        this.drawAllItems();
    };
};
Window_SkillTreeList.prototype.drawBackgroundRect = function (rect) {
};
Window_SkillTreeList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    this._skillLevel = item._skillLevel;
    const skillId = item.skillId;
    const skill = $dataSkills[skillId];
    if (skill) {
        this.drawCursorBitmap(rect);
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawItemName(skill, rect.x + 10, rect.y, this.itemWidth());
    }
}
Window_SkillTreeList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 10;
        this._cursorSprites.y = this._cursorSprite.y + 2;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_SkillTreeList.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        if (this._actor.isLearnedSkill(item.id) || this._skillLevel > 0) {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 0;
            var text = '（已学习）';
        } else {
            this.changeTextColor('#de4b2e');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 0;
            var text = '（未学习）';
        }
        this.contents.fontSize = 18;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name + text, x + textMargin, y, itemWidth);
    }
};
Window_SkillTreeList.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};
Window_SkillTreeList.prototype.maxCols = function () {
    return 1;
};
Window_SkillTreeList.prototype.numVisibleRows = function () {
    return 8;
};
Window_SkillTreeList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

function Window_SkillTreeAnimation() {
    this.initialize(...arguments);
}

Window_SkillTreeAnimation.prototype = Object.create(Window_Base.prototype);
Window_SkillTreeAnimation.prototype.constructor = Window_SkillTreeAnimation;

Window_SkillTreeAnimation.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._treeId = $gameTemp._skillTreeDataId;
    this._treeData = $gameSystem._skillTreeData[this._treeId];
    this._actor = $gameParty.allMembers()[0];
    this.refresh();
};
Window_SkillTreeAnimation.prototype.refresh = function () {
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', this._treeData.backImg);
    this._loadBitmap.addLoadListener(this.loadingBitmap.bind(this));
};
Window_SkillTreeAnimation.prototype.loadingBitmap = function (bitmap) {
    if (bitmap && bitmap.isReady()) {
        this.contents.clear();
        this.contentsBack.clear();
        this.drawMapBackGround();
    }
};
Window_SkillTreeAnimation.prototype.drawMapBackGround = function () {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = 0;
        const dy = 0;
        const sx = 0;
        const sy = 0;
        const scw = this.width;
        const sch = this.height;
        this.contentsBack.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};
function Sprite_TreeCommandButton() {
    this.initialize(...arguments);
}
Sprite_TreeCommandButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_TreeCommandButton.prototype.constructor = Sprite_TreeCommandButton;

Sprite_TreeCommandButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._buttonId = -1;
};

Sprite_TreeCommandButton.prototype.onClick = function () {
    if (SceneManager._scene._commandWindow.active) {
        SceneManager._scene._commandWindow.select(this._buttonId);
        SceneManager._scene._commandWindow.processOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Sprite_TreeCommandButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._commandWindow.active) {
        SceneManager._scene._commandWindow.select(this._buttonId);
        SoundManager.playCursor();
        this._colorTone = [30, 30, 30, 0]
        this._updateColorFilter();
        this._counts = 2;
        this.opacity = 255;
    };
};
Sprite_TreeCommandButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    const index = SceneManager._scene._commandWindow.index();
    if (index >= 0 && this._buttonId == index) {
        this._colorTone = [30, 30, 30, 0]
        this._updateColorFilter();
    } else {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};
Sprite_TreeCommandButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
    this._counts = 0;
};
Sprite_TreeCommandButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};

Cat.SkillTreeCore.Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function () {
    Cat.SkillTreeCore.Game_Temp_initialize.call(this);
    this._newAnimationQueue = [];
};

Game_Temp.prototype.newRequestAnimation = function (
    targets, animationId, mirror = false
) {
    if ($dataAnimations[animationId]) {
        const request = {
            targets: targets,
            animationId: animationId,
            mirror: mirror
        };
        this._newAnimationQueue.push(request);
        const targersList = [];
        targersList.push(targets)
        for (const target of targersList) {
            if (target.startAnimation) {
                target.startAnimation();
            }
        }
    }
};

Game_Temp.prototype.newRetrieveAnimation = function () {
    if (!this._newAnimationQueue) this._newAnimationQueue = [];
    return this._newAnimationQueue.shift();
};

function Sprite_NewAnimation() {
    this.initialize(...arguments);
}

Sprite_NewAnimation.prototype = Object.create(Sprite_Animation.prototype);
Sprite_NewAnimation.prototype.constructor = Sprite_NewAnimation;

Sprite_NewAnimation.prototype.initialize = function () {
    Sprite_Animation.prototype.initialize.call(this);
};
Sprite_NewAnimation.prototype.updateFlash = function () {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
            this._flashColor = [0, 0, 0, 0];
            target.setBlendColor(this._flashColor);
        }
    }
};
function NewSpriteset_Base() {
    this.initialize(...arguments);
}

NewSpriteset_Base.prototype = Object.create(Sprite.prototype);
NewSpriteset_Base.prototype.constructor = NewSpriteset_Base;

NewSpriteset_Base.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._animationSprites = [];
    this.createLowerLayer();
};
NewSpriteset_Base.prototype.createLowerLayer = function () {
    this.createBaseSprite();
    this.createBattleField();
};
NewSpriteset_Base.prototype.createBaseSprite = function () {
    this._baseSprite = new Sprite();
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 0;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
};
NewSpriteset_Base.prototype.createBattleField = function () {
    this._effectsContainer = new Sprite();
    this._effectsContainer.z = 80;
    this.addChild(this._effectsContainer);
    this.sortMz();
};
NewSpriteset_Base.prototype.sortMz = function () {
    this.children.sort((a, b) => a.z - b.z);
};
NewSpriteset_Base.prototype.battleFieldOffsetY = function () {
    return 24;
};
NewSpriteset_Base.prototype.processAnimationRequests = function () {
    for (; ;) {
        const request = $gameTemp.newRetrieveAnimation();
        if (request) {
            this.createAnimation(request);
        } else {
            break;
        }
    }
};
NewSpriteset_Base.prototype.createAnimation = function (request) {
    const animation = $dataAnimations[request.animationId];
    const targets = request.targets;
    const targersList = [];
    targersList.push(targets)
    const mirror = request.mirror;
    let delay = this.animationBaseDelay();
    const nextDelay = this.animationNextDelay();
    if (this.isAnimationForEach(animation)) {
        for (const target of targersList) {
            this.createAnimationSprite([target], animation, mirror, delay);
            delay += nextDelay;
        }
    } else {
        this.createAnimationSprite(targersList, animation, mirror, delay);
    }
};
NewSpriteset_Base.prototype.isAnimationForEach = function (animation) {
    const mv = this.isMVAnimation(animation);
    return mv ? animation.position !== 3 : animation.displayType === 0;
};
NewSpriteset_Base.prototype.animationBaseDelay = function () {
    return 60;
};

NewSpriteset_Base.prototype.animationNextDelay = function () {
    return 60;
};
NewSpriteset_Base.prototype.isMVAnimation = function (animation) {
    return !!animation.frames;
};

NewSpriteset_Base.prototype.createAnimationSprite = function (
    targets, animation, mirror, delay
) {
    const mv = this.isMVAnimation(animation);
    const sprite = new (mv ? Sprite_AnimationMV : Sprite_NewAnimation)();
    const targetSprites = targets;
    const baseDelay = this.animationBaseDelay();
    const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
    if (this.animationShouldMirror(targets[0])) {
        mirror = !mirror;
    }
    sprite.targetObjects = targets;
    if ($gameTemp._animationXy) {
        animation.scale = $gameTemp._animationXy[2] || 100;
        animation.offsetX = $gameTemp._animationXy[0] || 0;
        animation.offsetY = $gameTemp._animationXy[1] || 0;
    }
    sprite.setup(targetSprites, animation, mirror, delay, previous);
    this._effectsContainer.addChild(sprite);
    this._animationSprites.push(sprite);
};
NewSpriteset_Base.prototype.lastAnimationSprite = function () {
    return this._animationSprites[this._animationSprites.length - 1];
};
NewSpriteset_Base.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateAnimations();
};
NewSpriteset_Base.prototype.animationShouldMirror = function (target) {
    return target && target.isActor && target.isActor();
};
NewSpriteset_Base.prototype.updateAnimations = function () {
    for (const sprite of this._animationSprites) {
        if (!sprite.isPlaying()) {
            this.removeAnimation(sprite);
        }
    }
    this.processAnimationRequests();
};
NewSpriteset_Base.prototype.removeAnimation = function (sprite) {
    this._animationSprites.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    for (const target of sprite.targetObjects) {
        if (target.endAnimation) {
            target.endAnimation();
        }
    }
    this._playingAnimation = false;
    sprite.destroy();
};