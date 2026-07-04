//=============================================================================
// RPG Maker MZ - Ui-新版
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<Ui-新版>
 * @author FlyCat
 * 
 * @help
 * 此插件放在FlyCat_LL_SceneMenu.js下
 * 称谓图片名字就是称谓的名字
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_New_SceneMenu = true;

var FlyCat = FlyCat || {};
FlyCat.New_SceneMenu = {};
FlyCat.New_SceneMenu.parameters = PluginManager.parameters('FlyCat_New_SceneMenu');


SceneManager._backgroundSaveBitmap = null;

SceneManager.snapSaveForBackground = function () {
    if (this._backgroundSaveBitmap) {
        this._backgroundSaveBitmap.destroy();
    }
    this._backgroundSaveBitmap = this.snap();
};
SceneManager.backgroundSaveBitmap = function () {
    return this._backgroundSaveBitmap;
};

SceneManager._backgroundOptionBitmap = null;

SceneManager.snapOptionForBackground = function () {
    if (this._backgroundOptionBitmap) {
        this._backgroundOptionBitmap.destroy();
    }
    this._backgroundOptionBitmap = this.snap();
};
SceneManager.backgroundOptionBitmap = function () {
    return this._backgroundOptionBitmap;
};

Window_MiniInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    if (SceneManager._scene instanceof Scene_Equip || SceneManager._scene instanceof Scene_Item) {
        this.windowskin = ImageManager.loadSystem("Window10");
    } else {
        this.windowskin = ImageManager.loadSystem("Window10");
    }
    this._showInfo = DrillUp.m_window_defaultState === "true";
    this.openness = 0;
    this._maxCols = 1;
};
Window_MiniInfo.prototype.updateBackOpacity = function () {
    this.backOpacity = 200;
};
Window_MiniInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
};
Window_MiniInfo.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_MiniInfo.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    } else if (colorIndex == 6) {
        this.changeTextColor('#edbd28');
        this.contents.outlineColor = '#f6d160';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = ColorManager.textColor(colorIndex)//'#eeeee8';
        this.contents.outlineWidth = 1;
    }
};
Scene_Map.prototype.callMenu = function () {
    SceneManager.snapSaveForBackground()
    SoundManager.playOk();
    SceneManager.push(Scene_Status);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};
/*游戏结束*/

/*技能*/
Scene_Skill.prototype.refreshActor = function () {
    const actor = this.actor();
    this._skillTypeWindow.setActor(actor);
    //  this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};
Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
    this._commandWindow.deactivate();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._itemWindow) this._itemWindow._miniInfoWindow = this._miniWindow;
    };
};
Scene_Skill.prototype.determineItem = function () {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    this.useItem();
    this.activateItemWindow();
};

Scene_Skill.prototype.useItem = function () {
    Scene_ItemBase.prototype.useItem.call(this);
    this._statusLLWindow.refresh();
    this._itemWindow.refresh();
};

Scene_Skill.prototype.itemTargetActors = function () {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members()[0];
    } else {
        return [$gameParty.members()[0]];
    }
};
Scene_Skill.prototype.user = function () {
    return $gameParty.allMembers()[0];
};
Scene_Skill.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_ItemHelp(rect);
    this.addChild(this._helpWindow);
};
Scene_Skill.prototype.helpWindowRect = function () {
    const wx = 216;
    const wy = 535;
    const ww = 990;
    const wh = 90;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Skill.prototype.createSkillTypeWindow = function () {
    const rect = this.skillTypeWindowRect();
    this._skillTypeWindow = new Window_NewSkillType(rect);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler("cancel", this.cancelSceneSkill.bind(this));
    this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};
Scene_Skill.prototype.commandSkill = function () {
    if (this._itemWindow._data.length < 1) {
        this._skillTypeWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    this._itemWindow.activate();
    this._itemWindow.selectLast();
    this._itemWindow.select(0);
};
Scene_Skill.prototype.cancelSceneSkill = function () {
    this._skillTypeWindow.deactivate();
    this._skillTypeWindow.deselect();
    this._commandWindow.activate();
};
Scene_Skill.prototype.skillTypeWindowRect = function () {
    const wx = 205;
    const wy = 136;
    const ww = 500;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Skill.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_Skill.prototype.statusWindowRect = function () {
    const ww = 1050;
    const wh = 400;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Skill.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_NewSkillList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};
Scene_Skill.prototype.itemWindowRect = function () {
    const wx = 210;
    const wy = 210;
    const ww = 1000;
    const wh = 334;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Skill.prototype.needsPageButtons = function () {
    return false;
};
/*任务*/
if (Imported.FlyCat_Quest) {
    Scene_Quest.prototype.create = function () {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createTimeWindow();
        this.createQuestInfoWindow();
        this.createQuestListWindow();
        if (this._questListWindow._list.length < 1) {
            this._commandWindow.activate();
            this._questListWindow.deactivate();
        } else {
            this._commandWindow.deactivate();
            this._questListWindow.activate();
        }
    };
    Scene_Quest.prototype.createQuestListWindow = function () {
        const rect = this.questListWindowRect();
        this._questListWindow = new Window_QuestList(rect);
        this._questListWindow.setHandler("cancel", this.cancelQuest.bind(this));
        this.addChild(this._questListWindow);
        this._questListWindow.activate();
        if (this._questListWindow._list.length > 0) {
            this._questListWindow.select(0);
        }
    };
    Scene_Quest.prototype.cancelQuest = function () {
        this._questListWindow.deactivate();
        this._commandWindow.activate();
    };
    Scene_Quest.prototype.questListWindowRect = function () {//任务列表窗口大小设置
        const ww = 280;
        const wh = 560;
        const wx = 193;
        const wy = 81;
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Quest.prototype.createQuestInfoWindow = function () {
        const rect = this.questInfoWindowRect();
        this._questInfoWindow = new Window_QuestInfo(rect);
        this.addChild(this._questInfoWindow);
    };
    Scene_Quest.prototype.questInfoWindowRect = function () {//任务信息窗口大小设置
        const ww = 740;
        const wh = 530;
        const wx = 470
        const wy = 90;
        return new Rectangle(wx, wy, ww, wh);
    };
    Scene_Quest.prototype.update = function () {
        Scene_MenuBase.prototype.update.call(this);
        if (this._questListWindow && this._questInfoWindow) {
            const index = this._questListWindow.index();
            const quest = this._questListWindow._list[index];
            if (quest != this._lastQuest && quest) {
                this._questInfoWindow.setQuest(quest);
                this._lastQuest = quest;
            }
        }
    };
}
/*装备*/
Scene_Equip.prototype.needsPageButtons = function () {
    return false;
};
Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createActorsSprite();
    this.createHelpWindow();
    this.createTimeWindow();
    this.createStatusWindow_1();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
    this._commandWindow.deactivate();
    this._slotWindow.activate();
    this._slotWindow.select(0);
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._slotWindow) this._slotWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_Equip.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._slotWindow && this._slotWindow.active) {
        const index = this._slotWindow.index();
        const item = this._slotWindow.item(index);
        if (Imported.MiniInformationWindow && item) {
            this._slotWindow.setMiniWindow(item);
            this._slotWindow._miniInfoWindow.show();
        }
    }
    // if (this._itemWindow && this._itemWindow.active) {
    //     const index = this._itemWindow.index();
    //     const item = this._itemWindow.item(index);
    //     if (Imported.MiniInformationWindow && item) {
    //         this._itemWindow.setMiniWindow(item);
    //     }
    // }
};
Scene_Equip.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addChild(this._itemWindow);
};
Scene_Equip.prototype.onSlotCancel = function () {
    this._slotWindow.deselect();
    this._slotWindow.deactivate();
    this._commandWindow.activate();
};
Scene_Equip.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addChild(this._helpWindow);
};
Scene_Equip.prototype.helpWindowRect = function () {
    const wx = 2000;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Equip.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_EquipStatus(rect);
    this.addChild(this._statusWindow);
};

Scene_Equip.prototype.statusWindowRect = function () {
    const ww = 340;
    const wh = 430;
    const wx = Graphics.width - ww - 15;
    const wy = 172;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Equip.prototype.createStatusWindow_1 = function () {
    const rect = this.statusWindowRect_1();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_Equip.prototype.statusWindowRect_1 = function () {
    const ww = 1050;
    const wh = 400;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Equip.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;

    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');
};

Scene_Equip.prototype.commandWindowRect = function () {
    const ww = 270;
    const wh = 450;
    const wx = -20;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.slotWindowRect = function () {
    const wx = 205;
    const wy = 165;
    const ww = 360;
    const wh = 420;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.itemWindowRect = function () {
    const wx = 550;
    const wy = 155;
    const ww = 390;
    const wh = 450;
    this._equipItemSprite.x = wx + 13;
    this._equipItemSprite.y = wy + 9;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.onSlotOk = function () {
    //   this._slotWindow.hide();
    this._equipItemSprite.show();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._itemWindow.select(0);
};
Scene_Equip.prototype.hideItemWindow = function () {
    this._slotWindow.show();
    this._slotWindow.activate();
    this._itemWindow.hide();
    this._itemWindow.deselect();
    this._equipItemSprite.hide();
};

/*道具*/
Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createTimeWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createCommandWindow();
    this.createStatusWindow();
    this.createActorWindow();
    //   this.createSlWindow();
    this._commandWindow.deactivate();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._itemWindow) this._itemWindow._miniInfoWindow = this._miniWindow;
    };
};
Scene_Item.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_Item.prototype.statusWindowRect = function () {
    const ww = 1050;
    const wh = 400;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Item.prototype.createCategoryWindow = function () {
    const rect = this.categoryWindowRect();
    this._categoryWindow = new Window_NewItemCategory(rect);
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.cancelSceneItem.bind(this));
    this.addChild(this._categoryWindow);
};
Scene_Item.prototype.cancelSceneItem = function () {
    this._categoryWindow.deselect();
    this._categoryWindow.deactivate();
    this._commandWindow.activate();
};
// Scene_Item.prototype.useItem = function () {
//     Scene_ItemBase.prototype.useItem.call(this);
//     this._itemWindow.redrawCurrentItem();
//     this._statusLLWindow.refresh();
// };
Scene_Item.prototype.categoryWindowRect = function () {
    const wx = 205;
    const wy = 136;
    const ww = 500;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Item.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_NewItemList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addChild(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
    if (!this._categoryWindow.needsSelection()) {
        this._itemWindow.y -= this._categoryWindow.height;
        this._itemWindow.height += this._categoryWindow.height;
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this.onCategoryOk();
    }
};
Scene_Item.prototype.onCategoryOk = function () {
    if (this._itemWindow._data.length < 1) {
        this._categoryWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    this._itemWindow.activate();
    this._itemWindow.selectLast();
    this._itemWindow.select(0);
};
Scene_Item.prototype.itemWindowRect = function () {
    const wx = 210;
    const wy = 210;
    const ww = 1000;
    const wh = 334;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Item.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_ItemHelp(rect);
    this.addChild(this._helpWindow);
};

Scene_Item.prototype.helpWindowRect = function () {
    const wx = 216;
    const wy = 535;
    const ww = 990;
    const wh = 90;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Item.prototype.user = function () {
    return $gameParty.allMembers()[0];
};
Scene_Item.prototype.determineItem = function () {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    this.useItem();
    this.activateItemWindow();
};
Scene_Item.prototype.itemTargetActors = function () {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members()[0];
    } else {
        return [$gameParty.members()[0]];
    }
};
/*设置*/
// Scene_Options.prototype.createBackground = function () {
//     this._backgroundFilter = new PIXI.filters.BlurFilter();
//     this._backgroundSprite = new Sprite();
//     this._backgroundSprite.bitmap = SceneManager.backgroundSaveBitmap();
//     this._backgroundSprite.filters = [this._backgroundFilter];
// this._backgroundSprite_new = new Sprite();
// this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '系统设置背景');
// this.addChild(this._backgroundSprite_new);
// };
Scene_Options.prototype.createOptionsWindow = function () {
    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.setClickHandler(this.cancelSceneOptions.bind(this));
    this._cancelButtonSprite.show();

    const rect = this.optionsWindowRect();
    this._optionsWindow = new Window_Options(rect);
    this._optionsWindow.setHandler("cancel", this.cancelSceneOptions.bind(this));
    this.addWindow(this._optionsWindow);
};

Scene_Options.prototype.cancelSceneOptions = function () {
    if ($gameSystem._onCommandLoad) {
        $gameSystem._onCommandLoad = false;
        $gameTemp.setTitleStatic(false);
        SceneManager.goto(Scene_LL_Title);
    } else {
        SceneManager.push(Scene_Status);
    }
};
Scene_Options.prototype.maxCommands = function () {
    return 8;
};
Scene_Options.prototype.optionsWindowRect = function () {
    //  const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
    const ww = 400;
    const wh = 416;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2 + 14;
    this._cancelButtonSprite.x = wx + ww - 38;
    this._cancelButtonSprite.y = wy - 42;
    return new Rectangle(wx, wy, ww, wh);
};
// Scene_Options.prototype.createCancelButton = function () {
//     this._cancelButton = new Sprite_Button("cancel");
//     this._cancelButton.x = Graphics.boxWidth / 2 + 165;
//     this._cancelButton.y = this.buttonY() + 110;
//     this.addWindow(this._cancelButton);
//     this._cancelButton.scale.y = 1.2;
//     this._cancelButton.scale.x = 0.5;
// };
/*游戏结束*/
FlyCat.New_SceneMenu.Scene_GameEnd_createCommandWindow = Scene_GameEnd.prototype.createCommandWindow;
Scene_GameEnd.prototype.createCommandWindow = function () {
    FlyCat.New_SceneMenu.Scene_GameEnd_createCommandWindow.call(this);
    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.x = this._commandWindow.x + this._commandWindow.width - 38;
    this._cancelButtonSprite.y = this._commandWindow.y - 76;
    this._cancelButtonSprite.setClickHandler(this.popScene.bind(this));
    this._cancelButtonSprite.show();
};

Scene_GameEnd.prototype.commandWindowRect = function () {
    const ww = 400;
    const wh = 230;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2 + 46;
    return new Rectangle(wx, wy, ww, wh);
};
/*人物信息*/
Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createActorsSprite();
    this.createTimeWindow();
    this.createCommandWindow();
    this.createStatusWindow();
    this.createZxQuestWindow();
    this.createStatesWindow();
};
Scene_Status.prototype.needsPageButtons = function () {
    return false;
};
Scene_Status.prototype.refreshActor = function () {
};
Scene_Status.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_Status.prototype.statusWindowRect = function () {
    const ww = 800;
    const wh = 400;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Status.prototype.createStatesWindow = function () {
    const rect = this.statesWindowRect();
    this._statusLLWindow = new Window_MenuLLStates(rect);
    this.addChild(this._statusLLWindow);
};
Scene_Status.prototype.statesWindowRect = function () {
    const ww = 260;
    const wh = 184;
    const wx = 640;
    const wy = 263;
    return new Rectangle(wx, wy, ww, wh);
};
/*重写*/

// Scene_MenuBase.prototype.createBackground = function () {
//     this._backgroundFilter = new PIXI.filters.BlurFilter();
//     this._backgroundSprite = new Sprite();
//     this._backgroundSprite.bitmap = SceneManager.backgroundBitmap() ? SceneManager.backgroundBitmap() : SceneManager.backgroundSaveBitmap();
//     this._backgroundSprite.filters = [this._backgroundFilter];
//     this.addChild(this._backgroundSprite);
//     this.setBackgroundOpacity(192);
// };

// FlyCat.New_SceneMenu.Scene_MenuBase_createBackground = Scene_MenuBase.prototype.createBackground
// Scene_MenuBase.prototype.createBackground = function () {
//     FlyCat.New_SceneMenu.Scene_MenuBase_createBackground.call(this);
//     if (SceneManager._scene instanceof Scene_Title) {

//     } else if (SceneManager._scene instanceof Scene_Options) {
//         this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
//         this._backgroundSprite.filters = [];
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '系统设置背景');
//         this.addChild(this._backgroundSprite_new);
//     } else if (SceneManager._scene instanceof Scene_Status) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '主界面');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_Item) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '背包背景');
//         this.addChild(this._backgroundSprite_new);
//     } else if (SceneManager._scene instanceof Scene_File) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '存档背景');
//         this.addChild(this._backgroundSprite_new);
//     } else if (SceneManager._scene instanceof Scene_Equip) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '装备背景');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_Quest) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '任务背景');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_Skill) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '技能背景');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_LL_Pet) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '宠物背景');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_GameEnd) {
//         this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
//         this._backgroundSprite.filters = []; Scene_Gameover
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', 'gameOverBack');
//         this.addChild(this._backgroundSprite_new);
//     }
//     else if (SceneManager._scene instanceof Scene_LL_SM) {
//         this._backgroundSprite_new = new Sprite();
//         this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', '私密日记背景');
//         this.addChild(this._backgroundSprite_new);
//     }
// };
Scene_MenuBase.prototype.createButtons = function () {
    if (ConfigManager.touchUI) {
        if (this.needsPageButtons()) {
            this.createPageButtons();
        }
        if (this.needsCancelButton()) {
            this.createCancelButton();
        }
    } else {
        this.createCancelButton();
    }
};
Scene_MenuBase.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;// + 30;
    this._cancelButton.y = this.buttonY();// + 40;
    this.addWindow(this._cancelButton);
    //this._cancelButton.scale.set(1.2);
};
Scene_MenuBase.prototype.createZxQuestWindow = function () {
    const rect = this.zxQuestsWindowRect();
    this._statusWindow = new Window_ZxQuest(rect);
    this.addChild(this._statusWindow);
};

Scene_MenuBase.prototype.zxQuestsWindowRect = function () {
    const ww = 752;
    const wh = 160;
    const wx = 188;
    const wy = 480;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_MenuBase.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};

Scene_MenuBase.prototype.statusWindowRect = function () {
    const ww = 600;
    const wh = 400;
    const wx = 300;
    const wy = 250;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_MenuBase.prototype.createTimeWindow = function () {
    const rect = this.timesWindowRect();
    this._timeWindow = new Window_MenuTime(rect);
    this.addChild(this._timeWindow);
};

Scene_MenuBase.prototype.timesWindowRect = function () {
    const ww = 160;
    const wh = 130;
    const wx = 30;
    const wy = 520;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_MenuBase.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
};
Scene_MenuBase.prototype.cancelCommand = function () {
    SceneManager.goto(Scene_Map);
};
Scene_MenuBase.prototype.commandQuest = function () {
    $gameTemp._mapToQuest = false;
    if (SceneManager._scene instanceof Scene_Quest) {
        if (this._questListWindow._list.length < 1) {
            SoundManager.playBuzzer();
            this._commandWindow.activate();
            return
        } else {
            this._questListWindow.activate();
            this._commandWindow.deactivate();
            return
        }
    };
    SceneManager.push(Scene_Quest);
};
Scene_MenuBase.prototype.commandFormation = function () {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};
Scene_MenuBase.prototype.commandOptions = function () {
    SceneManager.snapOptionForBackground();
    SceneManager.push(Scene_Options);
};

Scene_MenuBase.prototype.commandSave = function () {
    $gameTemp._loadFile = true;
    SceneManager.push(Scene_File);
};
Scene_Menu.prototype.commandSave = function () {
    $gameTemp._loadFile = true;
    SceneManager.push(Scene_File);
};
Scene_MenuBase.prototype.commandGameEnd = function () {
    SceneManager.snapOptionForBackground();
    SceneManager.push(Scene_GameEnd);
};
Scene_MenuBase.prototype.commandItem = function () {
    if (SceneManager._scene instanceof Scene_Item) {
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
        return
    };
    SceneManager.push(Scene_Item);
};
Scene_MenuBase.prototype.commandPersonal = function () {
    this.onPersonalOk();
};
Scene_MenuBase.prototype.commandSm = function () {
    if ($gameSwitches.value(FlyCat.LL_SceneMenu.smSwitchId) == false) {
        if (SceneManager._scene instanceof Scene_LL_SM) {
            this._commandWindow.activate();
            return
        };
        SceneManager.push(Scene_LL_SM);
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
    }
};
Scene_MenuBase.prototype.commandPet = function () {
    if (SceneManager._scene instanceof Scene_LL_Pet) {
        if (this._petListWindow._list.length < 1) {
            SoundManager.playBuzzer();
            this._commandWindow.activate();
            return;
        } else {
            this._petListWindow.activate();
            return;
        }
    }
    SceneManager.push(Scene_LL_Pet);
};
Scene_MenuBase.prototype.commandHY = function () {
    SceneManager.push(Scene_LL_HY);
};
Scene_MenuBase.prototype.commandHYBook = function () {
    SceneManager.push(Scene_LL_HyBook);
};
Scene_MenuBase.prototype.onPersonalOk = function () {
    switch (this._commandWindow.currentSymbol()) {
        case "skill":
            if (SceneManager._scene instanceof Scene_Skill) {
                this._skillTypeWindow.activate();
                this._skillTypeWindow.select(0);
                break;
            }
            SceneManager.push(Scene_Skill);
            break;
        case "equip":
            if (SceneManager._scene instanceof Scene_Equip) {
                this._slotWindow.activate();
                this._slotWindow.select(0);
                break;
            }
            SceneManager.push(Scene_Equip);
            break;
        case "status":
            if (SceneManager._scene instanceof Scene_Status) {
                SoundManager.playBuzzer();
                this._commandWindow.activate();
                break;
            }
            SceneManager.push(Scene_Status);
            break;
    }
};
Scene_MenuBase.prototype.commandWindowRect = function () {
    const ww = 270;
    const wh = 450;
    const wx = -20;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.commandWindowRect = function () {
    const ww = 270;
    const wh = 450;
    const wx = -20;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_MenuBase.prototype.cancelSl = function () {
    this._slCommandWindow.hide();
    this._slCommandWindow.deactivate();
    this._commandWindow.activate();
};
// Scene_MenuBase.prototype.commandSL = function () {
//     this._commandWindow.deactivate();
//     this._slCommandWindow.show();
//     this._slCommandWindow.activate();
// };
Scene_MenuBase.prototype.createSlWindow = function () {
    const rect = this.slWindowRect();
    this._slCommandWindow = new Window_slCommand(rect);
    this._slCommandWindow.setHandler('save', this.commandSave.bind(this));
    this._slCommandWindow.setHandler('load', this.commandLoad.bind(this));
    this._slCommandWindow.setHandler('cancel', this.cancelSl.bind(this));
    this.addChild(this._slCommandWindow);
    this._slCommandWindow.hide();
    this._slCommandWindow.deactivate();
};
Scene_MenuBase.prototype.commandLoad = function () {
    SceneManager.push(Scene_Load);
};
Scene_MenuBase.prototype.slWindowRect = function () {
    const ww = 200;
    const wh = 112;
    const wx = Graphics.boxWidth / 2 - ww / 2;
    const wy = Graphics.boxHeight / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Menu.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    //   this.createActorsSprite();
    // this.createCommandWindow();
    //  this.createSlWindow();
};
/*主菜单*/
Scene_Menu.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    //   this._statusWindow.refresh();
};
Scene_Menu.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
};
/*游戏结束*/
Window_GameEnd.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '设置列表框');
    this.createCursorSprite();
    this.open();
};
Window_GameEnd.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(40, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_GameEnd.prototype.makeCommandList = function () {
    this.addCommand('回到开始界面', "toTitle");
    this.addCommand('继续游戏', "cancel");
};
Window_GameEnd.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.drawCursorBitmap(rect);
    this.contents.fontSize = 24;
    if (index == this.index()) {
        this.changeTextColor('#8c6d4c');
        this.contents.outlineColor = '#8c6d4c';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    }
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
Window_GameEnd.prototype.drawBackgroundRect = function (rect) {
};
Window_GameEnd.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 3;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_GameEnd.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this.select(0);
        this.activate();
        this._loadingPictrue = true;
    }
};
Window_GameEnd.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_GameEnd.prototype.numVisibleRows = function () {
    return 3;
};
Window_GameEnd.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
FlyCat.New_SceneMenu.Window_GameEnd_select = Window_GameEnd.prototype.select;
Window_GameEnd.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_GameEnd_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
/*设置*/
Window_Options.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '设置列表框');
    this.createCursorSprite();
};
Window_Options.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(90, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_Options.prototype.drawItem = function (index) {
    const title = this.commandName(index);
    const status = this.statusText(index);
    const rect = this.itemLineRect(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.drawCursorBitmap(rect);
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 22;
    if (index == this.index()) {
        this.changeTextColor('#8c6d4c');
        this.contents.outlineColor = '#8c6d4c';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#4a6d6c');
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 0;
    }
    this.drawText(title, rect.x + 14, rect.y, titleWidth, "left");
    this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
};
Window_Options.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_Options.prototype.drawBackgroundRect = function (rect) {
};
// Window_Options.prototype._updateCursor = function () {
//     this._cursorSprite.alpha = 0;
//     this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
//     this._cursorSprite.x = this._cursorRect.x;
//     this._cursorSprite.y = this._cursorRect.y;
// };
Window_Options.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this.select(0);
        this.activate();
        this._loadingPictrue = true;
    }
};
Window_Options.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_Options.prototype.numVisibleRows = function () {
    return 8;
};
FlyCat.New_SceneMenu.Window_Options_select = Window_Options.prototype.select;
Window_Options.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_Options_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_Options.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y - 6;
    } else {
        this._cursorSprites.visible = false;
    }
};
/*Window_MenuCommand*/
Window_MenuCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '光标');
    this.createCursorSprite();
};
Window_MenuCommand.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(44, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_MenuCommand.prototype.processOk = function () {
    Window_MenuCommand._lastProcessIndex = this.index();
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};
Window_MenuCommand.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        if (Window_MenuCommand._lastProcessIndex) {
            this.select(Window_MenuCommand._lastProcessIndex);
        } else {
            this.select(0);
        }
        //  this.activate();
        this._loadingPictrue = true;
    }
};
Window_MenuCommand.prototype.addSaveCommand = function () {
    if (this.needsCommand("save")) {
        const enabled = this.isSaveEnabled();
        this.addCommand('存档读档', "save", enabled);
    }
};
Window_MenuCommand.prototype.addMainCommands = function () {
    const enabled = this.areMainCommandsEnabled();
    if (this.needsCommand("status")) {
        this.addCommand('人物信息', "status", enabled);
    }
    if (this.needsCommand("item")) {
        this.addCommand('空间戒指', "item", enabled);
    }
    if (this.needsCommand("equip")) {
        this.addCommand("装备", "equip", enabled);
    }
    if (this.needsCommand("skill")) {
        this.addCommand("技能玉石", "skill", enabled);
    }
    this.addCommand("任务玉简", '任务', true);
    this.addCommand("灵宠", "pet", true);
    const smEnabled = !$gameSwitches.value(FlyCat.LL_SceneMenu.smSwitchId);
    this.addCommand("私密日记", "sm", smEnabled);
};
Window_MenuCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 20;
    this.contents.outlineWidth = 3;
    this.changeTextColor(ColorManager.textColor(0));//5.1
    if (index == this.index()) {
        this.drawCursorBitmap(rect);
        this.changeTextColor('#8c6d4c');
        this.contents.outlineColor = '#8c6d4c';
        this.contents.outlineWidth = 1;
        this.drawText(this.commandName(index), rect.x - 8, rect.y, rect.width, align);
        // this.drawText(this.commandName(index), rect.x - 36, rect.y, rect.width, align);
    } else {
        this.changeTextColor('#d1dee4');
        // this.contents.outlineColor = '#d1dee4';
        this.contents.outlineWidth = 0;
        this.drawText(this.commandName(index), rect.x - 8, rect.y, rect.width, align);
    }

};
Window_MenuCommand.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 2;
        const dy = rect.y - 7;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_MenuCommand.prototype.drawBackgroundRect = function (rect) {
};

Window_MenuCommand.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 19;
        this._cursorSprites.y = this._cursorSprite.y - 10;
    } else {
        this._cursorSprites.visible = false;
    }
};
FlyCat.New_SceneMenu.Window_MenuCommand_select = Window_MenuCommand.prototype.select;
Window_MenuCommand.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_MenuCommand_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_MenuCommand.prototype.numVisibleRows = function () {
    return 10;
};


/*存档读档*/
function Window_slCommand() {
    this.initialize.apply(this, arguments);
}

Window_slCommand.prototype = Object.create(Window_Command.prototype);
Window_slCommand.prototype.constructor = Window_slCommand;

Window_slCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 255;
};
Window_slCommand.prototype.makeCommandList = function () {
    this.addCommand('储存进度', 'save', true);
    this.addCommand('读取进度', 'load', true);
};
Window_slCommand.prototype.maxItems = function () {
    return 2;
};
Window_slCommand.prototype.numVisibleRows = function () {
    return 2;
};
Window_slCommand.prototype.maxCols = function () {
    return 1;
};
Window_slCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 24;
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

/*时间*/
Window_MenuTime.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._loadingPictrue = false;
    this._loadBitmap = {
        '春天': '',
        '夏天': '',
        '秋天': '',
        '冬天': '',
    };
    this._loadBitmap['春天'] = ImageManager.loadBitmap('img/menu/', '春天');
    this._loadBitmap['夏天'] = ImageManager.loadBitmap('img/menu/', '夏天');
    this._loadBitmap['秋天'] = ImageManager.loadBitmap('img/menu/', '秋天');
    this._loadBitmap['冬天'] = ImageManager.loadBitmap('img/menu/', '冬天');
    this.opacity = 0;
    // this.refresh();
};
Window_MenuTime.prototype.drawTimeText = function () {
    this.contents.clear();
    const year = $gameVariables.value(FlyCat.LL_SceneMenu.yearVariable);//$gameSystem._menuYear ? $gameSystem._menuYear : 0;
    const month = $gameVariables.value(FlyCat.LL_SceneMenu.monthVariable)//$gameSystem._menuMonth ? $gameSystem._menuMonth : 1;
    const weather = $gameSystem._menuWeather ? $gameSystem._menuWeather : '无';
    this.resetTextColor();
    this.contents.fontSize = 30;
    this.contents.outlineColor = '#4f7a80'
    this.contents.outlineWidth = 5;
    this.drawText("修仙纪元", 0, 0, this.width - 20, 'center');
    this.contents.fontSize = 20;
    this.drawText(year + " 年 " + month + " 月", 0, 30, this.width - 20, 'center');
    this.contents.fontSize = 24;
    this.drawWeatherBitmap(75, 68, weather)
    this.drawText("季节 : " + weather, 0, 72, this.width - 20, 'center');
};
Window_MenuTime.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap['春天'].isReady() && this._loadBitmap['夏天'].isReady()
        && this._loadBitmap['秋天'].isReady() && this._loadBitmap['冬天'].isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
Window_MenuTime.prototype.drawWeatherBitmap = function (x, y, name) {
    const bitmap = this._loadBitmap[name];
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = x;
        const dy = y;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
/*任务*/
Window_ZxQuest.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.refresh();
};
Window_ZxQuest.prototype.refresh = function () {
    this.contents.clear();
    const id = $gameSystem._zxQuest || 0;
    var x = 0;
    var y = 0;
    const width = this.width;
    const height = this.height;
    this.contents.fontSize = 18;
    this.contents.outlineWidth = 0;
    this.changeTextColor('#4a6d6c');
    if (id > 0) {
        var quest = eval(FlyCat.LL_SceneMenu.zxQuest[id - 1]);
        this.drawTextEx(quest, x, y, width);
    }
    else {
        this.contents.fontSize = 24;
        var quest = '还未领取主线任务！';
        this.drawText(quest, x, y + height / 2 - 36, width, "center");
    }
};
Window_ZxQuest.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.changeTextColor('#4a6d6c');
    this.contents.outlineColor = this.contents.textColor;
    this.contents.outlineWidth = 1;
};
Window_ZxQuest.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#4a6d6c');
        this.contents.outlineColor = this.contents.textColor;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
    }
};
/*状态*/
Window_MenuLLStatus.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._actor = $gameParty.allMembers()[0];
    this._levelNameSprite = new Sprite();
    this.addChild(this._levelNameSprite);
    this._levelNameSprite.x = 770;
    this._levelNameSprite.y = 0;
    this._loadBitmap = [];
    this.opacity = 0;
    if (SceneManager._scene instanceof Scene_Skill) {
        for (let i = 0; i < 3; i++) {
            this._loadBitmap[i] = ImageManager.loadBitmap('img/menu/', 'skillRate_' + i);
        }
    } else {
        for (let i = 0; i < 4; i++) {
            this._loadBitmap[i] = ImageManager.loadBitmap('img/menu/', 'hmtep_' + i);
        }
    }
    this._loadingPictrue = false;
};
Window_MenuLLStatus.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (SceneManager._scene instanceof Scene_Skill) {
        if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap[0].isReady() && this._loadBitmap[1].isReady()
            && this._loadBitmap[2].isReady()) {
            this.refresh();
            this._loadingPictrue = true;
        }
    } else {
        if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap[0].isReady() && this._loadBitmap[1].isReady()
            && this._loadBitmap[2].isReady() && this._loadBitmap[3].isReady()) {
            this.refresh();
            this._loadingPictrue = true;
        }
    }
};
Window_MenuLLStatus.prototype.drawSmValueBitmap = function (x, y, now, max, id) {
    const bitmap = this._loadBitmap[id];
    const rate = now / max;
    if (bitmap) {
        const pw = Math.floor(bitmap.width * rate);
        const ph = bitmap.height;
        const dx = x;
        const dy = y;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
    this.contents.outlineWidth = 3;
    this.contents.fontSize = 20;
    this.contents.fontFace = $gameSystem.mainFontFace();
    if (id == 0) this.contents.outlineColor = '#a42820';
    if (id == 1) this.contents.outlineColor = '#21549a';
    if (id == 2) this.contents.outlineColor = '#b7925e';
    if (id == 3) this.contents.outlineColor = '#44a73a';
    if (now < 300) {
        var text = '第一阶段 '
    } else if (now < 600) {
        var text = '第二阶段 '
    } else {
        var text = '第三阶段 '
    }
    var rates = Math.floor(rate * 100);
    if (rates > 100) {
        var rates = 100;
    }
    this.changeTextColor(ColorManager.textColor(0));
    this.drawText(text + rates + '%', x, y - 10, 248, 'center');
    this.contents.fontSize = 24;
    this.changeOutlineColor(ColorManager.outlineColor());
};
Window_MenuLLStatus.prototype.drawHmtepBitmap = function (x, y, now, max, id) {
    const bitmap = this._loadBitmap[id];
    const rate = now / max;
    if (bitmap) {
        const pw = Math.floor(bitmap.width * rate);
        const ph = bitmap.height;
        const dx = x;
        const dy = y;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
    this.contents.outlineWidth = 3;
    this.contents.fontSize = 16;
    if (id == 0) this.contents.outlineColor = '#a42820';
    if (id == 1) this.contents.outlineColor = '#21549a';
    if (id == 2) this.contents.outlineColor = '#b7925e';
    if (id == 3) this.contents.outlineColor = '#44a73a';
    this.changeTextColor(ColorManager.textColor(0));
    if (SceneManager._scene instanceof Scene_Skill) {
        this.drawText(now + '/' + max, x, y - 10, 138, 'center');
    } else {
        this.drawText(now + '/' + max, x, y - 10, 248, 'center');
    }

    this.contents.fontSize = 24;
    this.changeOutlineColor(ColorManager.outlineColor());
};
Window_MenuLLStatus.prototype.refresh = function () {
    this.contents.clear();
    const actor = this._actor;
    const width = this.width;
    var x = 60;
    var y = 16;

    this.contents.fontSize = 32;
    this.contents.outlineWidth = 0;
    this.changeTextColor('#765a3a');
    this.contents.outlineColor = '#765a3a';
    this.contents.outlineWidth = 1;
    this.drawText(actor.name(), x, y, width, 'left');

    this.contents.fontSize = 24;
    this.contents.outlineWidth = 0;
    this.changeTextColor('#8c6e4c');
    this.drawText("等级：" + actor.level, x + 165, y, width, "left");


    this.contents.fontSize = 20;
    this.changeTextColor('#5f4322');
    this.contents.outlineColor = '#5f4322';
    this.contents.outlineWidth = 1;
    if (FlyCat.LL_SceneMenu.goldItem) {
        var goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem]
        var goldItemNumber = $gameParty.numItems(goldItem);
    }
    else {
        var goldItemNumber = 0;
    }
    if (SceneManager._scene instanceof Scene_Skill) {
        this.drawHmtepBitmap(x + 371, y + 6, actor.hp, actor.mhp, 0)
        this.drawHmtepBitmap(x + 587, y + 6, actor.mp, actor.mmp, 1)
        this.drawHmtepBitmap(x + 805, y + 6, actor.tp, 100, 2)
    } else {
        if (SceneManager._scene instanceof Scene_LL_Pet || SceneManager._scene instanceof Scene_Item || SceneManager._scene instanceof Scene_Equip) {
            this.drawText(goldItemNumber, x + 680, y - 5, 110, "center");
            this.drawText($gameParty.gold(), x + 850, y - 5, 110, "center");
        }
        else {
            this.drawText(goldItemNumber, x + 390, y - 5, 110, "center");
            this.drawText($gameParty.gold(), x + 555, y - 5, 110, "center");
        }
    }
    if (SceneManager._scene instanceof Scene_LL_SM) {
        const llLevelName = $gameSystem.LLlevelName(actor.level);
        this._levelNameSprite.bitmap = ImageManager.loadBitmap('img/menu/', llLevelName);
        this.changeOutlineColor(ColorManager.outlineColor());
        this.contents.outlineWidth = 0;
        y += 64;
        const mouthValue = $gameVariables.value(FlyCat.LL_Sm.mouthValue);
        const thoraxValue = $gameVariables.value(FlyCat.LL_Sm.thoraxValue);
        const vaginaValue = $gameVariables.value(FlyCat.LL_Sm.vaginaValue);
        const bunsValue = $gameVariables.value(FlyCat.LL_Sm.bunsValue);
        this.drawSmValueBitmap(x + 117, y, mouthValue, 900, 0)
        y += 35
        this.drawSmValueBitmap(x + 117, y, thoraxValue, 900, 1)
        y += 35
        this.drawSmValueBitmap(x + 117, y, vaginaValue, 900, 2)
        y += 35
        this.drawSmValueBitmap(x + 117, y, bunsValue, 900, 3)
        y += 35
        const ziwei = $gameVariables.value(FlyCat.LL_Sm.peopleHValue);
        const renlei = $gameVariables.value(FlyCat.LL_Sm.plantHValue);
        const guaiwu = $gameVariables.value(FlyCat.LL_Sm.yzHValue);
        const renleihaizi = $gameVariables.value(FlyCat.LL_Sm.boyValue);
        const guaishouhaizi = $gameVariables.value(FlyCat.LL_Sm.girlValue);
        const shaungxiucishu = $gameVariables.value(FlyCat.LL_Sm.childrenValue);
        const hyPj = $gameSystem._hyPingJiaText ? $gameSystem._hyPingJiaText : '无';
        const qjValue = $gameVariables.value(FlyCat.LL_Sm.qjValue);
        const ljValue = $gameVariables.value(FlyCat.LL_Sm.ljValue);
        const sjValue = $gameVariables.value(FlyCat.LL_Sm.sjValue);
        const hyValue = $gameVariables.value(FlyCat.LL_Sm.hyValue);
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4e7574';
        this.contents.outlineWidth = 0.5;
        this.contents.fontSize = 21;

        this.drawText('自慰次数：' + ziwei, x + 2, y, 170, "left");
        y += 35;
        this.drawText('被人类骚扰次数：' + renlei, x + 2, y, 170, "left");
        y += 35;
        this.drawText('被怪物骚扰次数：' + guaiwu, x + 2, y, 170, "left");
        y += 52;
        this.drawText('强奸次数：' + qjValue, x + 2, y, 170, "left");
        this.drawText('轮奸次数：' + ljValue, x + 170, y, 170, "left");
        y += 35;
        this.drawText('兽交次数：' + sjValue, x + 2, y, 170, "left");
        this.drawText('怀孕次数：' + hyValue, x + 170, y, 170, "left");
        y += 35;
        this.drawText('双修次数：' + shaungxiucishu, x + 2, y, 170, "left");
        y += 35;
        this.drawText('人类孩子：' + renleihaizi, x + 2, y, 170, "left");
        this.drawText('怪兽孩子：' + guaishouhaizi, x + 170, y, 170, "left");
        y += 35;
        this.drawText('怀孕评价：', x + 2, y, 170, "left");
        this.changeTextColor('#d74b8a');
        this.contents.outlineColor = '#e8bcc4';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 21;
        this.drawText(hyPj, x + this.textWidth('怀孕评价：'), y, 170, "left");
        this.resetTextColor();
    };
    if (SceneManager._scene instanceof Scene_Status) {
        const llLevelName = $gameSystem.LLlevelName(actor.level);
        this._levelNameSprite.bitmap = ImageManager.loadBitmap('img/menu/', llLevelName);
        this.changeOutlineColor(ColorManager.outlineColor());
        this.contents.outlineWidth = 0;

        y += 64;
        this.drawHmtepBitmap(x + 79, y, actor.hp, actor.mhp, 0)

        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4a6d6c';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 24;
        //2022.11.9
        // if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
        //     var text = '白浊 ';
        //     this.drawText(FlyCat.LL_SceneMenu.bzNode, x + 460, y + 202, 170, "right");
        // } else {
        //     var text = ' ';
        // }
        // if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
        //     var text1 = '发情 ';
        //     this.drawText(FlyCat.LL_SceneMenu.fqNode, x + 460, y + 110, 170, "right");
        // } else {
        //     var text1 = ' ';
        // }
        // if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) {
        //     var text2 = '控制 ';
        //     this.drawText(FlyCat.LL_SceneMenu.kzNode, x + 460, y + 234, 170, "right");
        // } else {
        //     var text2 = ' ';
        // }
        // if ($gameSwitches.value(FlyCat.LL_SceneMenu.jscSwitch)) {
        //     var text3 = '寄生 ';
        //     this.drawText(FlyCat.LL_SceneMenu.jsNode, x + 460, y + 172, 170, "right");
        // } else {
        //     var text3 = ' ';
        // }
        // if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
        //     var text4 = '怀孕 ';
        //     this.drawText(FlyCat.LL_SceneMenu.hyNode, x + 460, y + 141, 170, "right");
        // } else {
        //     var text4 = ' ';
        // }

        //  this.drawText(text + text1 + text2 + text3 + text4, x + 520, y - 14, 170, "right");

        this.contents.fontSize = 22;
        const reputationText = $gameSystem._menuReputationText || "无";
        this.drawText(reputationText, x + 460, y + 16, 170, "right");

        const remarkText = $gameSystem._menuRemarkText || "无";
        this.drawText(remarkText, x + 460, y + 42, 170, "right");

        if ($gameSystem._menuTearPeopleName) {
            var name = $gameSystem._menuTearPeopleName;
        }
        else {
            var name = '未破处';
        }
        this.drawText(name, x + 460, y + 68, 170, "right");

        // this.drawText(FlyCat.LL_SceneMenu.fqNode, x + 460, y + 110, 170, "right");
        // this.drawText(FlyCat.LL_SceneMenu.hyNode, x + 460, y + 141, 170, "right");
        // this.drawText(FlyCat.LL_SceneMenu.jsNode, x + 460, y + 172, 170, "right");
        // this.drawText(FlyCat.LL_SceneMenu.bzNode, x + 460, y + 202, 170, "right");
        // this.drawText(FlyCat.LL_SceneMenu.kzNode, x + 460, y + 234, 170, "right");

        y += 35;
        this.drawHmtepBitmap(x + 79, y, actor.mp, actor.mmp, 1)
        y += 35;
        this.drawHmtepBitmap(x + 79, y, actor.tp, 100, 2)
        y += 35;
        const nowExp = actor.currentExp() - actor.currentLevelExp();
        const maxExp = actor.nextLevelExp() - actor.currentLevelExp();
        this.drawHmtepBitmap(x + 79, y, nowExp, maxExp, 3)

        y += 35;
        if (FlyCat.LL_SceneMenu.corruptValue) {
            var corruptValue = $gameVariables.value(FlyCat.LL_SceneMenu.corruptValue);
            var dl_1 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_1);
            var dl_2 = $gameSwitches.value(FlyCat.LL_SceneMenu.dlSwitchId_2);
            if (corruptValue < 0) var corruptValue = 0;
            if (corruptValue >= 99 && dl_1 == false) var corruptValue = 99;
            if (corruptValue >= 500 && dl_2 == false) var corruptValue = 500;
            if (corruptValue >= 1000) var corruptValue = 1000;
        }
        else {
            var corruptValue = 0;
        }
        if (corruptValue <= 99) var text = "（一阶段）";
        if (corruptValue > 99) var text = "（二阶段）";
        if (corruptValue > 500) var text = "（三阶段）";
        this.changeTextColor('#a872ae');
        this.contents.outlineColor = '#af7eb4';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.drawText(corruptValue + text, x + 79, y - 10, width, 'left')

        y += 35;
        if (FlyCat.LL_SceneMenu.xmValue) {
            var xmValue = $gameVariables.value(FlyCat.LL_SceneMenu.xmValue);
            if (xmValue < 0) var xmValue = 0;
            if (xmValue >= 1000) var xmValue = 1000;
        }
        else {
            var xmValue = 0;
        }
        this.changeTextColor('#698eec');
        this.contents.outlineColor = '#bac9ec';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(xmValue, x + 79, y - 10, width, 'left')

        var gongdeVariable = 0;
        if (FlyCat.LL_SceneMenu.gongdeVariable) {
            var gongdeVariable = $gameVariables.value(FlyCat.LL_SceneMenu.gongdeVariable);
            if (gongdeVariable < 0) {
                gongdeVariable = 0;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 0)
            } else if (gongdeVariable > 9999) {
                gongdeVariable = 9999;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.gongdeVariable, 9999)
            }
        }
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4a6d6c';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(gongdeVariable, x + 260, y - 10, width, 'left')

        y += 35;
        if (FlyCat.LL_SceneMenu.sexValue) {
            var sexValue = $gameVariables.value(FlyCat.LL_SceneMenu.sexValue);
            if (sexValue < 0) var sexValue = 0;
            if (sexValue >= 1000) var sexValue = 1000;
        }
        else {
            var sexValue = 0;
        }
        this.changeTextColor('#9874ec');
        this.contents.outlineColor = '#b39cec';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(sexValue, x + 79, y - 10, width, 'left')


        if (FlyCat.LL_SceneMenu.jingqiVariable) {
            var jingqiVariable = $gameVariables.value(FlyCat.LL_SceneMenu.jingqiVariable);
            if (jingqiVariable < 0) {
                var jingqiVariable = 0;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 0)
            }
            if (jingqiVariable > 999) {
                var jingqiVariable = 1000;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.jingqiVariable, 1000)
            }
        }
        else {
            var jingqiVariable = 0;
        }
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4a6d6c';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(jingqiVariable, x + 260, y - 10, width, 'left')

        y += 35;
        if (FlyCat.LL_SceneMenu.pregnancyValue) {
            var pregnancyValue = $gameVariables.value(FlyCat.LL_SceneMenu.pregnancyValue);
            if (pregnancyValue < 0) {
                var pregnancyValue = 0;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 0)
            }
            if (pregnancyValue > 99) {
                var pregnancyValue = 100;
                $gameVariables.setValue(FlyCat.LL_SceneMenu.pregnancyValue, 100)
            }
        }
        else {
            var pregnancyValue = 0;
        }
        this.changeTextColor('#f27c94');
        this.contents.outlineColor = '#f6c2c2';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawText(pregnancyValue, x + 79, y - 12, width, 'left')
    }
};


/*道具*/
function Window_NewItemCategory() {
    this.initialize(...arguments);
}

Window_NewItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_NewItemCategory.prototype.constructor = Window_NewItemCategory;

Window_NewItemCategory.prototype.initialize = function (rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '道具按钮背景');
    this.createCursorSprite();
};
Window_NewItemCategory.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(90, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_NewItemCategory.prototype.update = function () {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
Window_NewItemCategory.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    if (index == this.index()) {
        this.drawCursorBitmap(rect, 0)
    } else {
        this.drawCursorBitmap(rect, 1)
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 20;
    if (index == this.index()) {
        this.changeTextColor('#ffffff');
        this.contents.outlineColor = '#dfcfa1';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#976f41');
        this.contents.outlineColor = '#976f41';
        this.contents.outlineWidth = 0.5;
    }
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
Window_NewItemCategory.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_NewItemCategory.prototype.numVisibleRows = function () {
    return 1;
};
Window_NewItemCategory.prototype.drawBackgroundRect = function (rect) {
};
Window_NewItemCategory.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 6;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_NewItemCategory.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x + 3;
        const dy = rect.y;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
FlyCat.New_SceneMenu.Window_NewItemCategory_select = Window_NewItemCategory.prototype.select;
Window_NewItemCategory.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_NewItemCategory_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_NewItemCategory.prototype.maxCols = function () {
    return 4;
};

Window_NewItemCategory.prototype.makeCommandList = function () {
    if (this.needsCommand("item")) {
        this.addCommand(TextManager.item, "item");
    }
    if (this.needsCommand("weapon")) {
        this.addCommand(TextManager.weapon, "weapon");
    }
    if (this.needsCommand("armor")) {
        this.addCommand(TextManager.armor, "armor");
    }
    if (this.needsCommand("keyItem")) {
        this.addCommand(TextManager.keyItem, "keyItem");
    }
};

Window_NewItemCategory.prototype.needsCommand = function (name) {
    const table = ["item", "weapon", "armor", "keyItem"];
    const index = table.indexOf(name);
    if (index >= 0) {
        return $dataSystem.itemCategories[index];
    }
    return true;
};

Window_NewItemCategory.prototype.setItemWindow = function (itemWindow) {
    this._itemWindow = itemWindow;
};

Window_NewItemCategory.prototype.needsSelection = function () {
    return this.maxItems() >= 2;
};





function Window_NewItemList() {
    this.initialize(...arguments);
}

Window_NewItemList.prototype = Object.create(Window_Selectable.prototype);
Window_NewItemList.prototype.constructor = Window_NewItemList;

Window_NewItemList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._category = "none";
    this._data = [];
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '道具列表背景');
    this.createCursorSprite();
};
Window_NewItemList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(90, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_NewItemList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
FlyCat.New_SceneMenu.Window_NewItemList_select = Window_NewItemList.prototype.select;
Window_NewItemList.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_NewItemList_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_NewItemList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._loadingPictrue = false;
        //  this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_NewItemList.prototype.maxCols = function () {
    return 2;
};

Window_NewItemList.prototype.colSpacing = function () {
    return 16;
};

Window_NewItemList.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_NewItemList.prototype.item = function () {
    return this.itemAt(this.index());
};

Window_NewItemList.prototype.itemAt = function (index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_NewItemList.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this.item());
};

Window_NewItemList.prototype.includes = function (item) {
    switch (this._category) {
        case "item":
            return DataManager.isItem(item) && item.itypeId === 1 && !item.meta.宠物使用;
        case "weapon":
            return DataManager.isWeapon(item);
        case "armor":
            return DataManager.isArmor(item);
        case "keyItem":
            return DataManager.isItem(item) && item.itypeId === 2 && !item.meta.宠物使用;
        default:
            return false;
    }
};

Window_NewItemList.prototype.needsNumber = function () {
    if (this._category === "keyItem") {
        return $dataSystem.optKeyItemsNumber;
    } else {
        return true;
    }
};

Window_NewItemList.prototype.isEnabled = function (item) {
    return $gameParty.canUse(item);
};

Window_NewItemList.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_NewItemList.prototype.selectLast = function () {
    const index = this._data.indexOf($gameParty.lastItem());
    this.forceSelect(index >= 0 ? index : 0);
};
Window_NewItemList.prototype.drawBackgroundRect = function (rect) {
};
Window_NewItemList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y - 7;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_NewItemList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y - 2;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_NewItemList.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        //   this.changePaintOpacity(this.isEnabled(item));
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.drawItemName(item, rect.x + 10, rect.y + 1, rect.width - numberWidth, index);
        this.drawItemNumber(item, rect.x, rect.y + 1, rect.width, index);
        // this.changePaintOpacity(1);
    }
};

Window_NewItemList.prototype.drawItemName = function (item, x, y, width, index) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        // if (index == this.index()) {
        //     this.changeTextColor('#8c6d4c');
        //     this.contents.outlineColor = '#8c6d4c';
        //     this.contents.outlineWidth = 1;
        // } else
        if (!this.isEnabled(item)) {
            this.changeTextColor(ColorManager.textColor(10));//5.1
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 0;
        } else {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
        }
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_NewItemList.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText("剩餘：", x, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};
Window_NewItemList.prototype.numberWidth = function () {
    return this.textWidth("000");
};

Window_NewItemList.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item());
};

Window_NewItemList.prototype.refresh = function () {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};


function Window_ItemHelp() {
    this.initialize(...arguments);
}

Window_ItemHelp.prototype = Object.create(Window_Base.prototype);
Window_ItemHelp.prototype.constructor = Window_ItemHelp;

Window_ItemHelp.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
    this.opacity = 0;
};

Window_ItemHelp.prototype.setText = function (text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_ItemHelp.prototype.clear = function () {
    this.setText("");
};

Window_ItemHelp.prototype.setItem = function (item) {
    this.setText(item ? item.description : "");
};

Window_ItemHelp.prototype.refresh = function () {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};
Window_ItemHelp.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 22;
    this.resetTextColor();
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
};


/*装备*/
Window_EquipSlot.prototype.initialize = function (rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '装备列表_0');
    this.createCursorSprite();
    this.refresh();
};
Window_EquipSlot.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
        // this.refresh();
    }
};
Window_EquipSlot.prototype.update = function () {
    Window_StatusBase.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
    if (this._itemWindow) {
        if (this._actor.actor().meta.宠物立绘) {
            this._itemWindow.setSlotId(7);
        } else {
            this._itemWindow.setSlotId(this.index());
        }
    }
};
Window_EquipSlot.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', '装备列表_1');
    this._clientArea.addChild(this._cursorSprites);
};
Window_EquipSlot.prototype.drawItem = function (index, index_1) {
    if (this._actor) {
        const slotName = this.actorSlotName(this._actor, index);
        const item = this.itemAt(index);
        const slotNameWidth = this.slotNameWidth();
        if (index_1 == 1) {
            var index = 0;
        }
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        const itemWidth = rect.width - slotNameWidth;
        //  this.changeTextColor(ColorManager.systemColor());
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.changePaintOpacity(this.isEnabled(index));
        if (!this.isEnabled(index)) {
            this.changeTextColor('#a6a79f');
            this.contents.outlineColor = '#c7c9c0';
            this.contents.outlineWidth = 1;
        }
        this.contents.fontSize = 22;
        this.drawText(slotName, rect.x, rect.y + 2, slotNameWidth, rect.height);
        this.drawItemName(item, rect.x + slotNameWidth - 52, rect.y + 2, itemWidth);
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.maxItems = function () {
    return this._actor ? this._actor.equipSlots().length - 1 : 0;
};
Window_EquipSlot.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 0;
        this.contents.fontSize = 22;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_EquipSlot.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_EquipSlot.prototype.numVisibleRows = function () {
    return 8;
};
Window_EquipSlot.prototype.drawBackgroundRect = function (rect) {
};
Window_EquipSlot.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1//this._makeCursorAlpha();
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 85;
        this._cursorSprites.y = this._cursorSprite.y - 1;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_EquipSlot.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x + 80;
        const dy = rect.y - 2;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

/*装备列表*/
Window_EquipItem.prototype.initialize = function (rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._actor = null;
    this._slotId = 0;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = [];
    this._loadBitmap[0] = ImageManager.loadBitmap('img/menu/', 'xz_0');
    this._loadBitmap[1] = ImageManager.loadBitmap('img/menu/', 'xz_0');
    this.createCursorSprite();
};
Window_EquipItem.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_2');
    this._clientArea.addChild(this._cursorSprites);
};
Window_EquipItem.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
        //this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.setSlotId = function (slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this._loadingPictrue = false;
        // this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.update = function () {
    Window_StatusBase.prototype.update.call(this);
    if (!this._loadingPictrue && this.updateLoading()) {
        this.refresh();
        this._loadingPictrue = true;
    }
    if (this.active && this._miniInfoWindow) this._miniInfoWindow.hide();
};
// FlyCat.New_SceneMenu.Window_EquipItem_drawAllItems = Window_EquipItem.prototype.drawAllItems;
// Window_EquipItem.prototype.drawAllItems = function () {
//     this.drawBackBitmap();
//     FlyCat.New_SceneMenu.Window_EquipItem_drawAllItems.call(this);
// };
Window_EquipItem.prototype.updateLoading = function () {
    for (let i = 0; i < this._loadBitmap.length; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}
Window_EquipItem.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_EquipItem.prototype.numVisibleRows = function () {
    return 8;
};
Window_EquipItem.prototype.lineHeight = function () {
    return 27;
};
Window_EquipItem.prototype.drawBackgroundRect = function (rect) {
};
Window_EquipItem.prototype._updateCursor = function () {
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
// Window_EquipItem.prototype.drawBackBitmap = function () {
//     const bitmap = this._loadBitmap[0];
//     if (bitmap) {
//         const pw = bitmap.width;
//         const ph = bitmap.height;
//         const dx = 0;
//         const dy = 0;
//         const sx = 0;
//         const sy = 0;
//         this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
//     }
// };
Window_EquipItem.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap[1];
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
Window_EquipItem.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 0;
        this.contents.fontSize = 22;
        this.drawCursorBitmap(rect)
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y - 1, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x - 4, rect.y - 1, rect.width);
        this.changePaintOpacity(1);
    } else {
        const rect = this.itemLineRect(index);
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 22;
        this.drawCursorBitmap(rect);
        this.drawText('【卸下该装备】', rect.x, rect.y - 1, rect.width, 'center');
    }
};
Window_EquipItem.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText("持有：", x, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};
Window_EquipItem.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 0;
        this.contents.fontSize = 22;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

Window_EquipStatus.prototype.initialize = function (rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this._tempActor = null;
    this.opacity = 0;
    this.refresh();
};

Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        // const nameRect = this.itemLineRect(0);
        // this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
        // this.drawActorFace(this._actor, nameRect.x, nameRect.height);
        this.drawAllParams();
    }
};
Window_EquipStatus.prototype.drawAllParams = function () {

    for (let i = 0; i < 4; i++) {
        const x = 116;
        const y = i * 36;
        this.drawItem(x, y, i, 0);
    };
    for (let i = 0; i < 6; i++) {
        const x = 116;
        const y = 198 + i * 36;
        this.drawItem(x, y, 2 + i, 1);
    };
};
Window_EquipStatus.prototype.drawItem = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 0;
    this.contents.fontSize = 20;
    if (this._actor) {
        this.drawCurrentParam(x, y, paramId, type);
    }
    if (this._tempActor) {
        this.drawNewParam(x + paramWidth + rightArrowWidth + 16, y, paramId, type);
    }
};
Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    if (type == 0) {
        if (paramId < 2) {
            this.drawText(this._actor.param(paramId), x, y, paramWidth, "center");
        } else {
            if (paramId == 2) var value = this._actor.tp;
            if (paramId == 3) var value = this._actor.currentExp() - this._actor.currentLevelExp();
            this.drawText(value, x, y, paramWidth, "center");
        }

    } else {
        this.drawText(this._actor.param(paramId), x, y, paramWidth, "center");
    }
};
Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId, type) {
    const paramWidth = this.paramWidth();
    if (type == 0) {
        if (paramId < 2) {
            const newValue = this._tempActor.param(paramId);
            const diffvalue = newValue - this._actor.param(paramId);
            this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalue));
            this.drawText(newValue, x, y, paramWidth, "center");
        } else {
            if (paramId == 2) {
                var value = this._tempActor.tp;
                var diffvalues = value - this._actor.tp;
            }
            if (paramId == 3) {
                var value = this._tempActor.currentExp() - this._tempActor.currentLevelExp();
                var diffvalues = value - (this._actor.currentExp() - this._actor.currentLevelExp());

            }
            this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalues));
            this.drawText(value, x, y, paramWidth, "center");
        }
    } else {
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(ColorManager.newParamchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "center");
    }
};

/*任务*/
if (Imported.FlyCat_Quest) {
    Window_QuestList.prototype.initialize = function (rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._list = [];
        this.opacity = 0;
        this._loadingPictrue = false;
        this._loadBitmap = ImageManager.loadBitmap('img/menu/', '任务列表背景');
        this.activate();
        // this.select(0);
        //  this.refresh();
    }
    Window_QuestList.prototype.update = function () {
        Window_Selectable.prototype.update.call(this);
        if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
            this.refresh();
            if (this._list.length > 0) {
                this.activate();
                SceneManager._scene._commandWindow.deactivate();
                if ($gameTemp._mapToQuest) {
                    SceneManager._scene._commandWindow.select(4);
                }
            }
            this.select(0);
            this._loadingPictrue = true;
        }
    };
    Window_QuestList.prototype.drawBackgroundRect = function (rect) {
    };
    Window_QuestList.prototype._updateCursor = function () {
        this._cursorSprite.alpha = 0;
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
    };
    FlyCat.Quest.Window_QuestList_select = Window_QuestList.prototype.select;
    Window_QuestList.prototype.select = function (index) {
        FlyCat.Quest.Window_QuestList_select.call(this, index)
        if (index != this.lastselect) {
            this.refresh();
            this.lastselect = index;
        }
    };
    Window_QuestList.prototype.drawCursorBitmap = function (rect, type) {
        const bitmap = this._loadBitmap;
        if (bitmap) {
            const pw = bitmap.width;
            const ph = bitmap.height / 2;
            const dx = rect.x - 4;
            const dy = rect.y;
            const sx = 0;
            const sy = type * ph;
            this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
        }
    };
    Window_QuestList.prototype.refresh = function () {
        this.makeQuestList();
        if (this.contents) {
            this.contents.clear();
            if (this._list.length < 1) {
                this.drawItemEmpty(0);
            } else {
                this.drawAllItems();
            }
        }
    };
    Window_QuestList.prototype.resetFontSettings = function () {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 16;
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    };
    Window_QuestList.prototype.drawItem = function (index) {
        this.contents.fontSize = 18;
        const rect = this.itemLineRect(index);
        const quest = this._list[index];
        const textType = quest.questType;
        if (quest) {
            if (index == this.index()) {
                this.drawCursorBitmap(rect, 1)
            } else {
                this.drawCursorBitmap(rect, 0)
            }
            this.changeTextColor(ColorManager.textColor(0));
            this.drawTextEx(textType + quest.questName, rect.x - 4, rect.y + 8);
            this.resetTextColor();
        }
    };
    Window_QuestList.prototype.drawItemEmpty = function (index) {
        this.contents.fontSize = 24;
        const rect = this.itemLineRect(index);
        this.changeTextColor(ColorManager.textColor(0));
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawText(FlyCat.Quest.noQuestText, rect.x, this.height / 2 - 48, rect.width, 'center');
        this.resetTextColor();
    };



    Window_QuestInfo.prototype.initialize = function (rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this._loadingPictrue = true;
        this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'gth');
    }
    Window_QuestInfo.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        if (!this._loadingPictrue && this._loadBitmap && this._quest && this._loadBitmap.isReady()) {
            this.refresh(this._quest);
            this._loadingPictrue = true;
        }
    };
    Window_QuestInfo.prototype.setQuest = function (quest) {
        this._quest = quest;
        this._loadingPictrue = false;
    };
    Window_QuestInfo.prototype.refresh = function (quest) {
        this.createContents();
        this.resetTextColor();
        var questTask = '';
        var x = 10;
        var y = 5;
        this.contents.fontSize = FlyCat.Quest.questProgressTextSize;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 24;
        this.drawCursorBitmap(0, y + 2)
        this.drawText(FlyCat.Quest.questProgressText, 10 + 24, y)
        y += 26;
        this.contents.fontSize = 20;
        if (quest.questTask.length > 0) {
            var questTask = quest.questTask.split(",");
            for (let i = 0; i < questTask.length; i++) {
                var text = questTask[i];
                if (text) {
                    var text = text.replace(/["\[\]]/gm, '');
                    this.changeTextColor('#edbd28');
                    this.contents.outlineColor = '#f6d160';
                    this.contents.outlineWidth = 1;
                    if (quest.taskNumber < i) {
                        this.changeTextColor('#5e6b6b');
                        this.contents.outlineColor = '#d2d5c9';
                        this.contents.outlineWidth = 1;
                    }
                    this.drawText(text, x + 24, y)
                    y += 26;
                    this.resetTextColor();
                }
            }
        }
        else {
            this.changeTextColor('#5e6b6b');
            this.contents.outlineColor = '#d2d5c9';
            this.contents.outlineWidth = 1;
            this.drawText("无", 10, y)
            y += 26;
            this.resetTextColor();
        }

        this.contents.fontSize = 24;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawCursorBitmap(0, y + 7)
        this.drawText(FlyCat.Quest.questIntroduceText, 10 + 24, y + 5)
        var textNote = eval(quest.questNote)//String(quest.questNote);
        //  var textNote = textNote.replace(/\\n/g, ' \n ')
        // var textNote = textNote.replace(/["]/gm, '');
        this.drawTextEx(textNote, x + 24, y + 40)
        this.resetTextColor();
    };
    Window_QuestInfo.prototype.processColorChange = function (colorIndex) {
        if (colorIndex == 0) {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#4e7574';
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
    Window_QuestInfo.prototype.resetFontSettings = function () {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = 20;
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
    };

    Window_QuestInfo.prototype.drawCursorBitmap = function (x, y) {
        const bitmap = this._loadBitmap;
        if (bitmap) {
            const pw = bitmap.width;
            const ph = bitmap.height;
            const dx = x;
            const dy = y;
            const sx = 0;
            const sy = 0;
            this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
        }
    };
}

/*技能*/

function Window_NewSkillType() {
    this.initialize(...arguments);
}

Window_NewSkillType.prototype = Object.create(Window_SkillType.prototype);
Window_NewSkillType.prototype.constructor = Window_SkillType;

Window_NewSkillType.prototype.initialize = function (rect) {
    Window_SkillType.prototype.initialize.call(this, rect);
    this.select(0);
    this.activate();
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '道具按钮背景');
    this.createCursorSprite();
};
Window_NewSkillType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(90, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_NewSkillType.prototype.update = function () {
    Window_SkillType.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};

Window_NewSkillType.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    if (index == this.index()) {
        this.drawCursorBitmap(rect, 0)
    } else {
        this.drawCursorBitmap(rect, 1)
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.contents.fontSize = 20;
    if (index == this.index()) {
        this.changeTextColor('#ffffff');
        this.contents.outlineColor = '#dfcfa1';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor('#976f41');
        this.contents.outlineColor = '#976f41';
        this.contents.outlineWidth = 0.5;
    }
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
Window_NewSkillType.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_NewSkillType.prototype.numVisibleRows = function () {
    return 1;
};
Window_NewSkillType.prototype.drawBackgroundRect = function (rect) {
};
Window_NewSkillType.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y + 6;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_NewSkillType.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x + 3;
        const dy = rect.y;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
FlyCat.New_SceneMenu.Window_NewSkillType_select = Window_NewSkillType.prototype.select;
Window_NewSkillType.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_NewSkillType_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};
Window_NewSkillType.prototype.maxCols = function () {
    return 4;
};


function Window_NewSkillList() {
    this.initialize(...arguments);
}

Window_NewSkillList.prototype = Object.create(Window_SkillList.prototype);
Window_NewSkillList.prototype.constructor = Window_NewSkillList;

Window_NewSkillList.prototype.initialize = function (rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', '道具列表背景');
    this.createCursorSprite();
};
Window_NewSkillList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'addCursor');
    this._cursorSprites.scale.set(0.6);
    this._cursorSprites.setFrame(90, 0, 144, 96);
    this._clientArea.addChild(this._cursorSprites);
};
Window_NewSkillList.prototype.update = function () {
    Window_SkillList.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    }
};
FlyCat.New_SceneMenu.Window_NewSkillList_select = Window_NewSkillList.prototype.select;
Window_NewSkillList.prototype.select = function (index) {
    FlyCat.New_SceneMenu.Window_NewSkillList_select.call(this, index);
    if (index != this._lastIndex) {
        this.refresh();
        this._lastIndex = index;
    }
};

Window_NewSkillList.prototype.setActor = function (actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._loadingPictrue = false;
        this.scrollTo(0, 0);
    }
};

Window_NewSkillList.prototype.setStypeId = function (stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this._loadingPictrue = false;
        this.scrollTo(0, 0);
    }
};

Window_NewSkillList.prototype.maxCols = function () {
    return 2;
};
Window_NewSkillList.prototype.colSpacing = function () {
    return 16;
};

Window_NewSkillList.prototype.drawBackgroundRect = function (rect) {
};
Window_NewSkillList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0 && this.active) {
        this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x;
        this._cursorSprites.y = this._cursorSprite.y - 9;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_NewSkillList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = 0;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_NewSkillList.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        //  this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x + 16, rect.y, rect.width - costWidth, index);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        //  this.changePaintOpacity(1);
    }
};
Window_NewSkillList.prototype.drawItemName = function (item, x, y, width, index) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        var text = '';
        // if (index == this.index()) {
        //     if (!this.isEnabled(item)) {
        //         var text = '(无法使用)';
        //     }
        //     this.changeTextColor('#8c6d4c');
        //     this.contents.outlineColor = '#8c6d4c';
        //     this.contents.outlineWidth = 1;
        // } else
        if (!this.isEnabled(item)) {
            this.changeTextColor(ColorManager.textColor(10));//5.1
            this.contents.outlineColor = ColorManager.textColor(10);
            this.contents.outlineWidth = 3;
            var text = '(无法使用)';
        } else {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
        }
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name + text, x + textMargin, y, itemWidth);
    }
};
Window_NewSkillList.prototype.drawSkillCost = function (skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        //   this.changeTextColor(ColorManager.tpCostColor());
        this.drawText('消耗怒气：' + this._actor.skillTpCost(skill), x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
        //    this.changeTextColor(ColorManager.mpCostColor());
        this.drawText('消耗灵力：' + this._actor.skillMpCost(skill), x, y, width, "right");
    } else {
        this.drawText('无消耗', x, y, width, "right");
    }
};

Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel') {
        //wolfzq注释，不知道为啥要隐藏返回按钮，在不确定前先暂时不做变化。
        if (SceneManager._scene instanceof Scene_Status || SceneManager._scene instanceof Scene_Options
            || SceneManager._scene instanceof Scene_Item || SceneManager._scene instanceof Scene_File
            || SceneManager._scene instanceof Scene_Equip || SceneManager._scene instanceof Scene_Quest
            || SceneManager._scene instanceof Scene_LL_Pet || SceneManager._scene instanceof Scene_Skill
            || SceneManager._scene instanceof Scene_GameEnd || SceneManager._scene instanceof Scene_LL_SM
            || SceneManager._scene instanceof Scene_LL_HY || SceneManager._scene instanceof Scene_SM
            || SceneManager._scene instanceof Scene_Letter) {
            this.opacity = 0;
            return;
        }
    }
    this.opacity = this._pressed ? 255 : 192;
};

ColorManager.newParamchangeTextColor = function (change) {
    if (change > 0) {
        return '#de4b2e';
    } else if (change < 0) {
        return '#22b937';
    } else {
        return '#4e7574';
    }
};

function Window_MenuLLStates() {
    this.initialize(...arguments);
}

Window_MenuLLStates.prototype = Object.create(Window_Selectable.prototype);
Window_MenuLLStates.prototype.constructor = Window_MenuLLStates;

Window_MenuLLStates.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.refresh();
};

Window_MenuLLStates.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    if (this._list.length > 0) {
        this.drawAllItems();
    }
};

Window_MenuLLStates.prototype.makeItemList = function () {
    this._list = [];
    this._list = $gameParty.allMembers()[0].states();
};

Window_MenuLLStates.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.drawItemName(item, rect.x, rect.y, this.itemWidth());
    }
};

Window_MenuLLStates.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#4a6d6c';
        this.contents.outlineWidth = 0;
        this.contents.fontSize = 20;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y - 3, itemWidth);
    }
};

Window_MenuLLStates.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

Window_MenuLLStates.prototype.maxCols = function () {
    return 2;
};

Window_MenuLLStates.prototype.itemWidth = function () {
    return Math.floor(this.innerWidth / this.maxCols());
};

Window_MenuLLStates.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_MenuLLStates.prototype.numVisibleRows = function () {
    return 5;
};

Window_MenuLLStates.prototype.drawBackgroundRect = function (rect) {
};

Window_MenuLLStates.prototype.drawIcon = function (iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    const scw = pw * 0.78;
    const sch = ph * 0.78;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, scw, sch);
};