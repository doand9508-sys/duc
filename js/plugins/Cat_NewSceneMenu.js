//=============================================================================
// RPG Maker MZ - Ui重置-场景
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<Ui重置-场景>
 * @author Cat
 * 
 * @param CommonId
 * @type common_event
 * @text 公共事件
 * @desc 呼叫菜单时执行的公共事件
 * @default 
 * 
 * @param dlSwitchId_3
 * @text 堕落值阶段3开关选择
 * @desc 堕落值阶段3开关选择
 * @type switch
 * 
 * @param dlSwitchId_4
 * @text 堕落值阶段4开关选择
 * @desc 堕落值阶段4开关选择
 * @type switch
 * 
 * @param letterSwitchId
 * @text NPC信件开关选择
 * @desc NPC信件开关选择
 * @type switch
 * 
 * @help
 * 呼叫的公共事件最后必须执行该脚本
 * $gameTemp._callCommanEvent = true;
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_NewSceneMenu = true;

var Cat = Cat || {};
Cat.NewSceneMenu = {};
Cat.NewSceneMenu.parameters = PluginManager.parameters('Cat_NewSceneMenu');
Cat.NewSceneMenu.CommonId = Number(Cat.NewSceneMenu.parameters['CommonId']);

Cat.NewSceneMenu.dlSwitchId_3 = Number(Cat.NewSceneMenu.parameters['dlSwitchId_3']);
Cat.NewSceneMenu.dlSwitchId_4 = Number(Cat.NewSceneMenu.parameters['dlSwitchId_4']);
Cat.NewSceneMenu.letterSwitchId = Number(Cat.NewSceneMenu.parameters['letterSwitchId']);

/*Game_System*/
Game_System.prototype.LLlevelName = function (level) {
    const levelName = FlyCat.LL_SceneMenu.levelNames;
    const max = levelName.length;
    for (let i = 0; i < max; i++) {
        if (level >= levelName[i].level) {
            return levelName[i].name;
        }
    };
    return String(level);
};

/*DataManager*/
DataManager.makeSavefileBitmap = function () {
    var bitmap = SceneManager.backgroundSaveBitmap();
    if (!bitmap) {
        return null;
    }
    var newBitmap = new Bitmap(384, 286);
    newBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newBitmap.width, newBitmap.height);
    return newBitmap;
};

/*Scene_Boot*/
// Scene_Boot.prototype.startNormalGame = function () {
//     this.checkPlayerLocation();
//     DataManager.setupNewGame();
//     SceneManager.goto(Scene_Map);
//     Window_TitleCommand.initCommandPosition();
// };

/*Scene_Menu*/
Scene_MenuBase.prototype.createActorsSprite = function () {
    if (SceneManager._scene instanceof Scene_Equip) {
        var x = 1000;
    } else {
        var x = 700;
    }
    var y = 720;
    const anchor = 1;
    this._mapMainBaseSprite = new Sprite_Picture_ShowBase();
    this.addChild(this._mapMainBaseSprite);
    this._mapMainBaseSprite.x = 155;
    this._mapMainBaseSprite.y = 0;
    this._mapMainBaseSprite.anchor.x = 0.5;
    this._mapMainBaseSprite.anchor.y = 1;
    /*主体立绘*/
    // this._actorMenuMainSprite = new Sprite();
    // this.addChild(this._actorMenuMainSprite)
    // this._actorMenuMainSprite.x = x;
    // this._actorMenuMainSprite.y = y;
    // this._actorMenuMainSprite.anchor.set(anchor);
    // this._actorMenuMainSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_SceneMenu.sceneMapPicture);//'女主立绘线稿上色'

    // this._mapMainFairSprite = new Sprite();//头发
    // this.addChild(this._mapMainFairSprite);
    // if (!$gameSystem._mapActorFairPicture) {
    //     $gameSystem._mapActorFairPicture = FlyCat.LL_MapPicture.hair;
    // }
    // this._mapMainFairSprite.bitmap = ImageManager.loadBitmap('img/menu/', $gameSystem._mapActorFairPicture);
    // this._mapMainFairSprite.x = x;
    // this._mapMainFairSprite.y = y;
    // this._mapMainFairSprite.anchor.set(anchor);

    // /*主体状态遮罩*/
    // this._actorYwSprite = new Sprite();//淫文
    // this.addChild(this._actorYwSprite)
    // this._actorYwSprite.x = x;
    // this._actorYwSprite.y = y;
    // this._actorYwSprite.anchor.set(anchor);
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.ywSwitch)) {
    //     this._actorYwSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateYw);
    // } else {
    //     this._actorYwSprite.bitmap = '';
    // }

    // this._actorBzSprite = new Sprite();//白浊
    // this.addChild(this._actorBzSprite)
    // this._actorBzSprite.x = x;
    // this._actorBzSprite.y = y;
    // this._actorBzSprite.anchor.set(anchor);
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
    //     this._actorBzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateBz);
    // } else {
    //     this._actorBzSprite.bitmap = '';
    // }
    // /*衣服*/
    // this._actorMenuSprite = new Sprite();
    // this.addChild(this._actorMenuSprite)
    // if ($gameSystem._menuActorPicture) {
    //     var img = $gameSystem._mapActorPicture;
    // }
    // else {
    //     var img = '';
    // }
    // this._actorMenuSprite.bitmap = ImageManager.loadBitmap('img/menu/', img)

    // this._actorMenuSprite.x = x;
    // this._actorMenuSprite.y = y;
    // this._actorMenuSprite.anchor.set(anchor);
    // this._breatheCount = 0;
    // const eop = $gameVariables.value(FlyCat.LL_MapPicture.equipVariable);
    // this._actorMenuSprite.opacity = eop;

    // this._mapFaceSprite = new Sprite();//表情
    // this.addChild(this._mapFaceSprite);
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
    //     this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ3-1');
    // } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
    //     this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ2-1');
    // } else {
    //     this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ1-1');
    // }
    // this._mapFaceSprite.x = x;
    // this._mapFaceSprite.y = y;
    // this._mapFaceSprite.anchor.set(anchor);
    // this._tempFaceNameCounts = 1;
    // this._tempFaceCounts = 0;
    // this._tempFaceSpeed = 5;
    // this._tempFaceRandom = false;

    // // this._actorFqSprite = new Sprite();//发情
    // // this.addChild(this._actorFqSprite)
    // // this._actorFqSprite.anchor.set(anchor);
    // // this._actorFqSprite.x = x;
    // // this._actorFqSprite.y = y;
    // // if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
    // //     this._actorFqSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateFq);
    // // } else {
    // //     this._actorFqSprite.bitmap = '';
    // // }

    // // this._actorKzSprite = new Sprite();//控制
    // // this.addChild(this._actorKzSprite)
    // // this._actorKzSprite.anchor.set(anchor);
    // // this._actorKzSprite.x = x;
    // // this._actorKzSprite.y = y;
    // // if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) {
    // //     this._actorKzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZd);
    // // } else {
    // //     this._actorKzSprite.bitmap = '';
    // // }

    // /*2022.06.01*/
    // this._actorHySprite = new Sprite();//怀孕
    // this.addChild(this._actorHySprite)
    // this._actorHySprite.anchor.set(anchor);
    // this._actorHySprite.x = x;
    // this._actorHySprite.y = y;

    // this._actorHySprite_1 = new Sprite();//怀孕肚子
    // this.addChild(this._actorHySprite_1)
    // this._actorHySprite_1.anchor.set(anchor);
    // this._actorHySprite_1.x = x - 40;
    // this._actorHySprite_1.y = y;

    // if ($gameSystem._hyCgVisible == false || $gameSystem._hyCgVisible == true) {
    //     this._actorHySprite_1.visible = $gameSystem._hyCgVisible;
    // }

    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
    //     const month = Number(FlyCat.LL_SceneMenu.hyMmonthVariable);
    //     var img = '';
    //     var img_1 = '';
    //     if ($gameVariables.value(month) >= 3 && $gameVariables.value(month) < 5) {
    //         var img = '怀孕状态1';
    //         var img_1 = '三个月';
    //     } else if ($gameVariables.value(month) >= 5 && $gameVariables.value(month) < 9) {
    //         var img = '怀孕状态2';
    //     } else if ($gameVariables.value(month) >= 9) {
    //         var img = '怀孕状态3';
    //         var img_1 = '九个月';
    //     } else {
    //         var img_1 = '一个月';
    //     }
    //     if ($gameVariables.value(month) >= 5 && $gameVariables.value(month) < 7) {
    //         var img_1 = '五个月';
    //     } else if ($gameVariables.value(month) >= 7 && $gameVariables.value(month) < 9) {
    //         var img_1 = '七个月';
    //     }
    //     this._actorHySprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
    //     this._actorHySprite_1.bitmap = ImageManager.loadBitmap('img/menu/', img_1);
    // } else {
    //     this._actorHySprite.bitmap = '';
    //     this._actorHySprite_1.bitmap = '';
    // }
};


Scene_MenuBase.prototype.createBackground = function () {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192);

    if (SceneManager._scene instanceof Scene_Title) {

    } else if (SceneManager._scene instanceof Scene_Options) {
        // this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
        // this._backgroundSprite.filters = [];
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/options/', '底板');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_Status) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/menu/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Item) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/item/', '底板');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_File) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/save/', '底板');
        this.addChild(this._backgroundSprite_new);
    } else if (SceneManager._scene instanceof Scene_Equip) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/equip/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Quest) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/任务玉简/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_Skill) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/skill/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_LetterNpc) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/cy/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_LL_Pet) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/lc/', '底板');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_GameEnd) {
        this._backgroundSprite.bitmap = SceneManager.backgroundOptionBitmap();
        this._backgroundSprite.filters = []; Scene_Gameover
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/menu/', 'gameOverBack');
        this.addChild(this._backgroundSprite_new);
    }
    else if (SceneManager._scene instanceof Scene_SM) {
        this._backgroundSprite_new = new Sprite();
        this._backgroundSprite_new.bitmap = ImageManager.loadBitmap('img/newUi/sm/', '底板');
        this.addChild(this._backgroundSprite_new);
    }

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
    commandWindow.setHandler("load", this.commandLoad.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cy", this.commandCy.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
    this.createGoldLsWindow();
};

Scene_MenuBase.prototype.commandSm = function () {
    if ($gameSwitches.value(FlyCat.LL_SceneMenu.smSwitchId) == false) {
        if (SceneManager._scene instanceof Scene_SM) {
            this._commandWindow.activate();
            return
        };
        SceneManager.push(Scene_SM);
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
    }
};

Scene_Menu.prototype.commandPet = function () {
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

Scene_Menu.prototype.commandSm = function () {
    if ($gameSwitches.value(FlyCat.LL_SceneMenu.smSwitchId) == false) {
        if (SceneManager._scene instanceof Scene_SM) {
            this._commandWindow.activate();
            return
        };
        SceneManager.push(Scene_SM);
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
    }
};

Scene_MenuBase.prototype.commandOptions = function () {
    if (SceneManager._scene instanceof Scene_Options) {
        this._optionsWindow.activate();
        return
    };
    SceneManager.snapOptionForBackground();
    SceneManager.push(Scene_Options);
};

Scene_MenuBase.prototype.commandCy = function () {
    if (SceneManager._scene instanceof Scene_LetterNpc) {
        this._npcTypeListWindow.activate();
        this._npcTypeListWindow.select(0);
        return
    };
    if ($gameSwitches.value(Number(Cat.NewSceneMenu.letterSwitchId))) {
        SceneManager.push(Scene_LetterNpc);
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
        return
    }
};

Scene_MenuBase.prototype.commandQuest = function () {
    if (SceneManager._scene instanceof Scene_Quest) {
        this._questTypeWindow.activate();
        this._questTypeWindow.select(0);
        return
    };
    SceneManager.push(Scene_Quest);
};

Scene_MenuBase.prototype.createGoldLsWindow = function () {
    const rect = this.GoldLsWindowRect();
    this._goldLsWindow = new Window_GoldLs(rect);
    this.addChild(this._goldLsWindow);
};

Scene_MenuBase.prototype.GoldLsWindowRect = function () {
    const ww = 500;
    const wh = 100;
    const wx = 500;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_MenuBase.prototype.commandItem = function () {
    if (SceneManager._scene instanceof Scene_Item) {
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
        return
    };
    SceneManager.push(Scene_Item);
};

Scene_MenuBase.prototype.commandLoad = function () {
    if (SceneManager._scene instanceof Scene_Load) {
        this._listWindow.activate();
        return
    };
    SceneManager.push(Scene_Load);
};

Scene_MenuBase.prototype.commandSave = function () {
    if (SceneManager._scene instanceof Scene_Save) {
        this._listWindow.activate();
        return
    };
    SceneManager.push(Scene_Save);
};

Scene_MenuBase.prototype.commandPersonal = function () {
    this.onPersonalOk();
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
                this._commandWindow.activate();
                this._commandWindow.select(0);
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
    const ww = 160;
    const wh = 560;
    const wx = Graphics.width - ww;
    const wy = 88;
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
    const wx = 0;
    const wy = 190;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_MenuBase.prototype.createhpMpWindow = function () {
    const rect = this.hpMpWindowRect();
    this._hpMpWindow = new Window_MenuHpMp(rect);
    this.addChild(this._hpMpWindow);
};

Scene_MenuBase.prototype.hpMpWindowRect = function () {
    const ww = Graphics.width;
    const wh = 200;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};


/*Scene_Map*/
// Scene_Map.prototype.callMenu = function () {
//     $gameTemp.reserveCommonEvent(Cat.NewSceneMenu.CommonId);
//     this.menuCalling = false;
// };

// var cat_old_Scene_Map_updateScene = Scene_Map.prototype.updateScene;
// Scene_Map.prototype.updateScene = function () {
//     cat_old_Scene_Map_updateScene.call(this);
//     if ($gameTemp._callCommanEvent) {
//         SceneManager.snapSaveForBackground()
//         SoundManager.playOk();
//         $gameTemp._callCommanEvent = false;
//         SceneManager.push(Scene_Status);
//         Window_MenuCommand.initCommandPosition();
//         $gameTemp.clearDestination();
//         this._mapNameWindow.hide();
//         this._waitCount = 2;
//     }
// };
/*Scene_Status*/
Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createActorsSprite();
    this.createTimeWindow();
    this.createCommandWindow();
    this.createStatusWindow();
};

Scene_Status.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};

Scene_Status.prototype.statusWindowRect = function () {
    const ww = 430;
    const wh = 560;
    const wx = 705;
    const wy = 90;
    return new Rectangle(wx, wy, ww, wh);
};

/*Scene_Item*/
Scene_Item.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createhpMpWindow();
    this.createTimeWindow();
    this.createCommandWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
    this._commandWindow.deactivate();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._itemWindow) this._itemWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_Item.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_ItemHelp(rect);
    this.addChild(this._helpWindow);
};

Scene_Item.prototype.helpWindowRect = function () {
    const wx = 170;
    const wy = 510;
    const ww = 910;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.hpMpWindowRect = function () {
    const ww = Graphics.width;
    const wh = 200;
    const wx = 150;
    const wy = 590;
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

Scene_Item.prototype.determineItem = function () {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    this.useItem();
    this.activateItemWindow();
    this._hpMpWindow.refresh();
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

Scene_Item.prototype.itemWindowRect = function () {
    const wx = 178 - 40;
    const wy = 194 + 10;
    const ww = 910;
    const wh = 306;
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

Scene_Item.prototype.cancelSceneItem = function () {
    // this._categoryWindow.deselect();
    // this._categoryWindow.deactivate();
    // this._commandWindow.activate();
    SceneManager.goto(Scene_Status)
};

Scene_Item.prototype.categoryWindowRect = function () {
    const wx = 205;
    const wy = 103;
    const ww = 850;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

/*Scene_File*/
Scene_File.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
    this.createTimeWindow();
    if (!$gameSystem._onCommandLoad) {
        this.createCommandWindow();
        this._commandWindow.deactivate();
    }
};

Scene_Load.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("load", this.commandLoad.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    commandWindow.setHandler("cy", this.commandCy.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
    this.createGoldLsWindow();
};

Scene_File.prototype.commandLoad = function () {
    if (SceneManager._scene instanceof Scene_Load) {
        this._listWindow.activate();
        return
    };
    SceneManager.push(Scene_Load);
};

Scene_File.prototype.commandSave = function () {
    if (SceneManager._scene instanceof Scene_Save) {
        this._listWindow.activate();
        return
    };
    SceneManager.push(Scene_Save);
};

Scene_File.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_NewSaveHelp(rect);
    this.addWindow(this._helpWindow);
    this._helpWindow.setText(this.helpWindowText());
};

Scene_File.prototype.helpWindowRect = function () {
    const wx = 162;
    const wy = 86;
    const ww = 943;
    const wh = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_File.prototype.createListWindow = function () {
    const rect = this.listWindowRect();
    this._listWindow = new Window_newSavefileList(rect);
    this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
    this._listWindow.setHandler("cancel", this.cancelSave.bind(this));
    this._listWindow.setMode(this.mode(), this.needsAutosave());
    this._listWindow.selectSavefile(this.firstSavefileId());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

Scene_File.prototype.cancelSave = function () {
    if ($gameSystem._onCommandLoad) {
        this.popScene();
    } else {
        SceneManager.goto(Scene_Status)
        this._commandWindow.activate();
    }
};

Scene_File.prototype.activateListWindow = function () {
    this._listWindow.activate();
};

Scene_File.prototype.listWindowRect = function () {
    const wx = 140;
    const wy = 156;
    const ww = 460;
    const wh = 470;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Save.prototype.helpWindowText = function () {
    return ' 保存进度 ';
};

Scene_Load.prototype.helpWindowText = function () {
    return ' 读取进度 ';
};

/*Scene_Skill*/
Scene_Skill.prototype.create = function () {
    Scene_ItemBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createItemWindow();
    this.createhpMpWindow();
    this.createActorWindow();
    this._commandWindow.deactivate();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._itemWindow) this._itemWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_Skill.prototype.createhpMpWindow = function () {
    const rect = this.hpMpWindowRect();
    this._hpMpWindow = new Window_MenuHpMp(rect);
    this.addChild(this._hpMpWindow);
};

Scene_Skill.prototype.hpMpWindowRect = function () {
    const ww = Graphics.width;
    const wh = 200;
    const wx = 180;
    const wy = 596;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.determineItem = function () {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    this.useItem();
    this.activateItemWindow();
    this._hpMpWindow.refresh();
};

Scene_Skill.prototype.useItem = function () {
    Scene_ItemBase.prototype.useItem.call(this);
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

Scene_Skill.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_NewSkillHelp(rect);
    this.addChild(this._helpWindow);
};

Scene_Skill.prototype.helpWindowRect = function () {
    const wx = 190;
    const wy = 530;
    const ww = 915;
    const wh = 96;
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
    // this._skillTypeWindow.deactivate();
    // this._skillTypeWindow.deselect();
    // this._commandWindow.activate();
    SceneManager.goto(Scene_Status);
};

Scene_Skill.prototype.skillTypeWindowRect = function () {
    const wx = 156;
    const wy = 84;
    const ww = 980;
    const wh = 100;
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
    const wx = 190;
    const wy = 164;
    const ww = 910;
    const wh = 350;
    return new Rectangle(wx, wy, ww, wh);
};

/*Scene_Equip*/
Scene_Equip.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createTimeWindow();
    this.createStatusWindow();
    this.createCommandWindow_X();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
    this._commandWindow_x.deactivate();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._slotWindow) this._slotWindow._miniInfoWindow = this._miniWindow;
        if (this._itemWindow) this._itemWindow._miniInfoWindow = this._miniWindow;
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
    if (this._itemWindow && this._itemWindow.active) {
        const index = this._itemWindow.index();
        const item = this._itemWindow.item(index);
        if (Imported.MiniInformationWindow && item) {
            this._itemWindow.setMiniWindow(item);
        }
    }
};

Scene_Equip.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_EquipStatus(rect);
    this.addChild(this._statusWindow);
};

Scene_Equip.prototype.statusWindowRect = function () {
    const ww = 288;
    const wh = 434;
    const wx = 810;
    const wy = 110;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.slotWindowRect = function () {
    const commandWindowRect = this.commandWindowRect();
    const wx = 180;
    const wy = 88;
    const ww = 320;
    const wh = 472;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createCommandWindow_X = function () {
    const rect = this.commandWindowRectX();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("load", this.commandLoad.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    commandWindow.setHandler("cy", this.commandCy.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow_x = commandWindow;
    this.createGoldLsWindow();
};

Scene_Equip.prototype.onPersonalOk = function () {
    switch (this._commandWindow_x.currentSymbol()) {
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
                this._commandWindow.activate();
                this._commandWindow.select(0);
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

Scene_Equip.prototype.commandWindowRectX = function () {
    const ww = 160;
    const wh = 560;
    const wx = Graphics.width - ww;
    const wy = 88;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createCommandWindow = function () {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_NewEquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.cancelEquip.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.commandClear = function () {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.cancelEquip = function () {
    // this._commandWindow.deactivate();
    // this._commandWindow_x.activate();
    SceneManager.goto(Scene_Status)
};

Scene_Equip.prototype.commandWindowRect = function () {
    const wx = 480;
    const wy = 96;
    const ww = 340;
    const wh = 130;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.refreshActor = function () {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Equip.prototype.createHelpWindow = function () {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_NewEquipHelp(rect);
    this.addChild(this._helpWindow);
};

Scene_Equip.prototype.helpWindowRect = function () {
    const wx = 194;
    const wy = 550;
    const ww = 915;
    const wh = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createItemWindow = function () {
    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/newUi/equip/', '装备底框');
    this._equipItemSprite.x = this._commandWindow.x + 10;
    this._equipItemSprite.y = this._commandWindow.y + 10;

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

Scene_Equip.prototype.itemWindowRect = function () {
    const wx = this._equipItemSprite.x - 10;
    const wy = this._equipItemSprite.y - 10;
    const ww = 320;
    const wh = 472;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.onSlotOk = function () {
    //   this._slotWindow.hide();
    this._equipItemSprite.show()
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
/*Scene_Options*/
Scene_Options.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    if ($gameSystem._onCommandLoad) {
        this._commandWindow.visible = false;
    } else {
        this._commandWindow.visible = true;
    }
    this.createTimeWindow();
    this.createOptionsWindow();
    this._commandWindow.deactivate();
};

Scene_Options.prototype.createOptionsWindow = function () {
    const rect = this.optionsWindowRect();
    this._optionsWindow = new Window_Options(rect);
    this._optionsWindow.setHandler("cancel", this.cancelSceneOptions.bind(this));
    this.addWindow(this._optionsWindow);
};

Scene_Options.prototype.optionsWindowRect = function () {
    const ww = 870;
    const wh = 400;
    const wx = 220;
    const wy = 160;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Options.prototype.cancelSceneOptions = function () {
    if ($gameSystem._onCommandLoad) {
        $gameSystem._onCommandLoad = false;
        $gameTemp.setTitleStatic(false);
        SceneManager.goto(Scene_LL_Title);
    } else {
        SceneManager.push(Scene_Status);
    }
    // this._optionsWindow.deactivate();
    // this._commandWindow.activate();
};

Scene_Options.prototype.maxCommands = function () {
    return 10;
};

/*Scene_LetterNpc*/
Scene_LetterNpc.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow_X();
    this._commandWindow_x.deactivate();
    this.createTimeWindow()
    this.createtypeListWindow();
    this.createNpcTypeListWindow();
    this.createChlidrenListWindow();
    this.createNpcInfoWindow();
    // this.createBackWindow();
    this.createInfoWindow();
    this.createCommandWindow();
    this._childrenSprite = new Sprite();
    this.addChild(this._childrenSprite);
    this._childrenSprite.anchor.set(0.5);
    this._childrenSprite.scale.x = 0.94;
    this._childrenSprite.scale.y = 0.86;
    this._childrenSprite.x = 972;
    this._childrenSprite.y = 366;
    this.createActionCommandWindow();
};

Scene_LetterNpc.prototype.CommandWindowRect = function () {
    const ww = 464;
    const wh = 96;
    const wx = 354;
    const wy = 530;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.infoWindowRect = function () {
    const ww = 480;
    const wh = 330;
    const wx = 340;
    const wy = 200;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.npcTypeListWindowRect = function () {
    const ww = 660;
    const wh = 80;
    const wx = 154;
    const wy = 80;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.chListWindowRect = function () {
    const ww = 174;
    const wh = 468;
    const wx = 164;
    const wy = 162;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.npcInfoWindowRect = function () {
    const ww = 466;
    const wh = 50;
    const wx = 350;
    const wy = 158;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.createCommandWindow_X = function () {
    const rect = this.commandWindowRectX();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("load", this.commandLoad.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("sm", this.commandSm.bind(this));
    commandWindow.setHandler("pet", this.commandPet.bind(this));
    commandWindow.setHandler("cancel", this.cancelCommandX.bind(this));
    commandWindow.setHandler("任务", this.commandQuest.bind(this));
    commandWindow.setHandler("cy", this.commandCy.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow_x = commandWindow;
    this.createGoldLsWindow();
};

Scene_LetterNpc.prototype.onPersonalOk = function () {
    switch (this._commandWindow_x.currentSymbol()) {
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
                this._commandWindow.activate();
                this._commandWindow.select(0);
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

Scene_LetterNpc.prototype.cancelCommandX = function () {
    SceneManager.goto(Scene_Map)
};

Scene_LetterNpc.prototype.commandWindowRectX = function () {
    const ww = 160;
    const wh = 560;
    const wx = Graphics.width - ww;
    const wy = 88;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.cancelNpcTypeList = function () {
    // this._npcTypeListWindow.deactivate();
    // this._npcTypeListWindow.deselect();
    // this._commandWindow_x.activate();
    SceneManager.goto(Scene_Status)

};

/*Scene_LL_Pet*/
Scene_LL_Pet.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    // this.createStatusWindow();
    this.petSprite();
    this.createPetListWindow();
    this.createPetCommandWindow();
    this.createPetParamWindow();
    this.createPetSkillWindow();
    this.createUseListWindow();
    this._commandWindow.deactivate();
    if (!$gameSystem._petActorList) {
        this._petListWindow.deactivate();
        this._commandWindow.activate();
    }
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._petUseListWindow) this._petUseListWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_LL_Pet.prototype.createPetSkillWindow = function () {
    const rect = this.petSkillWindowRect();
    this._skillWindow = new Window_PetSkill(rect);
    this.addChild(this._skillWindow);
};

Scene_LL_Pet.prototype.petSkillWindowRect = function () {
    const ww = 370;
    const wh = 170;
    const wx = this._statusWindow.x;
    const wy = this._statusWindow.y + 230;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.createPetParamWindow = function () {
    const rect = this.petParamWindowRect();
    this._statusWindow = new Window_PetParam(rect);
    this.addChild(this._statusWindow);
};

Scene_LL_Pet.prototype.petParamWindowRect = function () {
    const ww = 372;
    const wh = 226;
    const wx = 736;
    const wy = 240;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._petListWindow) {
        const index = this._petListWindow.index();
        let pet = this._petListWindow._list[index];
        if (pet) {
            pet = $dataActors[pet.id] || pet;
            if (this._statusWindow && this._skillWindow) {
                const actor = $gameActors.actor(pet.id);
                if (actor) {
                    this._statusWindow.refresh(actor);
                    this._skillWindow.refresh(actor);
                }
            }
            if (pet.meta.宠物立绘) {
                var img = pet.meta.宠物立绘;
            }
            else {
                var img = '';
            }
            if (img != this._lastImg) {
                this._petSprite.bitmap = ImageManager.loadBitmap('img/pet/', img);
                this._lastImg = img;
            }
            if (this._petInfoWindow) this._petInfoWindow.refresh(pet);
            if (this._petCommandWindow && this._lastPet != pet) {
                this._petCommandWindow.refresh();
                this._lastPet = pet;
            }
        };

    };
    if (this._petSprite && this._petSprite.bitmap) {
        this._breatheCount++;
        if (this._breatheCount < 61) {
            this._petSprite.scale.y += 0.0002;
            this._petSprite.scale.x += 0.0002;
        }
        else if (this._breatheCount > 60 && this._breatheCount <= 120) {
            this._petSprite.scale.y -= 0.0002;
            this._petSprite.scale.x -= 0.0002;
        }
        else {
            this._breatheCount = 0;
            this._petSprite.scale.set(0.8);
        }
    }
    if (this._petUseListWindow && this._petUseListWindow.active && this._petUseListWindow._list) {
        const index = this._petUseListWindow.index();
        const item = this._petUseListWindow._list[index];
        if (Imported.MiniInformationWindow && item) {
            this._petUseListWindow.setMiniWindow(item);
            this._petUseListWindow._miniInfoWindow.show();
        }
    }
}

Scene_LL_Pet.prototype.cancelUse = function () {
    // this._cancelButtonSprite.hide()
    this._equipItemSprite.hide();
    //this._equipItemBackSprite.hide();
    this._petUseListWindow.deactivate();
    this._petUseListWindow.hide();
    this._petCommandWindow.activate();
};

Scene_LL_Pet.prototype.createUseListWindow = function () {
    // this._equipItemBackSprite = new Sprite();
    // this.addChild(this._equipItemBackSprite);
    // this._equipItemBackSprite.hide();
    // this._equipItemBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', '遮罩');

    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/newUi/lc/', '列表背景');
    this._equipItemSprite.anchor.set(0.5);

    // this._cancelButtonSprite = new Sprite_CancelButton();
    // this.addChild(this._cancelButtonSprite);
    // this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    // this._cancelButtonSprite.scale.set(0.7);
    // this._cancelButtonSprite.setClickHandler(this.cancelUse.bind(this));
    // this._cancelButtonSprite.hide();

    const rect = this.petUseListWindowRect();
    this._petUseListWindow = new Window_PetUseList(rect);
    this._petUseListWindow.setHandler('ok', this.onUse.bind(this));
    this._petUseListWindow.setHandler('cancel', this.cancelUse.bind(this));
    this.addChild(this._petUseListWindow);
    this._petUseListWindow.deactivate();
    this._petUseListWindow.hide();

    // this._cancelButtonSprite.x = this._petUseListWindow.x + this._petUseListWindow.width - 23;
    // this._cancelButtonSprite.y = this._petUseListWindow.y - 16;

    this._equipItemSprite.x = this._petUseListWindow.x + 170;
    this._equipItemSprite.y = this._petUseListWindow.y + 228;
};

Scene_LL_Pet.prototype.onUse = function () {
    const indexs = this._petListWindow.index();
    const pet = this._petListWindow._list[indexs];
    const index = this._petCommandWindow.index();
    const item = this._petUseListWindow._list[this._petUseListWindow.index()];
    if (this._petUseListWindow._list.length < 1 || !item) {
        SoundManager.playBuzzer();
        this._petUseListWindow.activate();
        return;
    }
    if (index == 2) {
        $gameParty.setLastItem(item);
        this.useItem(pet, item);
        this._petUseListWindow.refresh();
        this._petUseListWindow.activate();
    } else if (index == 3) {
        this.onItemOk(pet, item);
    } else {
        this.cancelUse();
    }
};

Scene_LL_Pet.prototype.onItemOk = function (pet, item) {
    SoundManager.playEquip();
    if (item == '【卸下该装备】') {
        var item = null;
    }
    this.executeEquipChange(pet, item);
    this.cancelUse();
    this._petCommandWindow.refresh();
};

Scene_LL_Pet.prototype.executeEquipChange = function (pet, item) {
    //console.log(pet, item)
    const actor = $gameActors.actor(pet.id);
    const slotId = 7;
    actor.changeEquip(slotId, item);
};

Scene_LL_Pet.prototype.petUseListWindowRect = function () {
    const ww = 340;
    const wh = 450;
    const wx = (Graphics.width - ww) / 2;
    const wy = (Graphics.height - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.createPetCommandWindow = function () {
    const rect = this.petCommandWindowRect();
    this._petCommandWindow = new Window_NewPetCommand(rect);
    this._petCommandWindow.setHandler('ok', this.onCommand.bind(this));
    this._petCommandWindow.setHandler('cancel', this.cancelPetCommand.bind(this));
    this.addChild(this._petCommandWindow);
    this._petCommandWindow.deactivate();
};

Scene_LL_Pet.prototype.petCommandWindowRect = function () {
    const ww = 400;
    const wh = 130;
    const wx = 722;
    const wy = 100;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_Pet.prototype.onCommand = function () {
    const indexs = this._petListWindow.index();
    const pet = this._petListWindow._list[indexs];
    const index = this._petCommandWindow.index();
    switch (index) {
        case 0:
            this.removeAllPet();
            this.addPet();
            break;
        case 1:
            this.removePet();
            break;
        case 2:
            this._petUseListWindow.setActor(pet, 0);
            break;
        case 3:
            this._petUseListWindow.setActor(pet, 1);
            break;
        case 4:
            this.cancelPetCommand();
            break;
    }
};

Scene_LL_Pet.prototype.petSprite = function () {
    this._petSprite = new Sprite()
    this.addChild(this._petSprite)
    this._petSprite.anchor.x = 0.5;
    this._petSprite.anchor.y = 1;
    this._petSprite.scale.set(0.8);
    this._petSprite.x = 440;
    this._petSprite.y = 646;
    this._breatheCount = 0;
    this._lastImg = '';
};

Scene_LL_Pet.prototype.petListWindowRect = function () {
    const ww = 190;
    const wh = 214;
    const wx = 145;
    const wy = 90;
    return new Rectangle(wx, wy, ww, wh);
};

/*Scene_Battle*/
Scene_Battle.prototype.autoBattlePet = function () {
    const actor = BattleManager.actor();
    const rate = Math.floor((Math.random() * 100) + 1);
    const action = BattleManager.inputtingAction();
    const useSkill = actor._petUseSkills;
    //console.log('概率' + rate)
    if (rate < 60 && useSkill) {
        action.setSkill(useSkill.id);
        actor.setLastBattleSkill(useSkill);
        action.evaluate();
        //    console.log('使用技能' + useSkill.name)
    } else {
        const skills = JsonEx.makeDeepCopy(actor.skills());
        skills.push($dataSkills[124]);//P普攻
        const index = skills.indexOf(useSkill);
        if (index != -1) {
            skills.splice(index, 1);
        }
        var skill = skills[Math.floor((Math.random() * skills.length))];
        action.setSkill(skill.id);
        actor.setLastBattleSkill(skill);
        // console.log('行动', action)
        action.evaluate();
        // console.log('使用技能' + skill.name, skills)
    }
    actor.setAction(0, action);
    actor.setActionState("waiting");
    const pet = $gameParty.allMembers()[1].actor();
    const meta = pet.meta.宠物战斗立绘;
    if (meta) {
        const data = meta.split(',');
        this._battlePetMainSprite.bitmap = ImageManager.loadBitmap('img/pet/', data[0] + '_1');
    };
};

Scene_Battle.prototype.createPartyCommandWindow = function () {
    this._partyCommandBackSprite = null;
    this._partyCommandBackSprite = new Sprite();
    this._partyCommandBackSprite.hide();
    this._partyCommandBackSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', '底板');
    this._partyCommandBackSprite.anchor.set(0.5);
    this.addChild(this._partyCommandBackSprite);
    this._partyCommandBackSprite.x = Graphics.width / 2;
    this._partyCommandBackSprite.y = Graphics.height / 2;

    const rect = this.partyCommandWindowRect();
    const commandWindow = new Window_PartyCommand(rect);
    commandWindow.setHandler("fight", this.commandFight.bind(this));
    commandWindow.setHandler("escape", this.commandEscape.bind(this));
    commandWindow.deselect();
    this.addChild(commandWindow);
    this._partyCommandWindow = commandWindow;
};

Scene_Battle.prototype.partyCommandWindowRect = function () {
    const ww = 250;
    const wh = 250;
    const wx = Graphics.boxWidth / 2 - ww / 2 + 4;
    const wy = Graphics.boxHeight / 2 - wh / 2 + 10;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.updateStatusWindowPosition = function () {
    this._statusWindow.x = -1000;
    // if (!BattleManager.actor()) {
    //     // this._moveWindowDistances = -300;
    //     // this._moveWindowDistance += 10;
    //     // if (this._moveWindowDistance < 300) {
    //     //     this._statusWindow.move(- this._moveWindowDistance, this._statusWindow.y, this._statusWindow.width, this._statusWindow.height);
    //     // };
    //     this._statusWindow.x = -1000;
    // } else {
    //     this._moveWindowDistance = 0;
    //     if (this._statusWindow.x < -10) {
    //         this._moveWindowDistances += 10;
    //         this._statusWindow.move(this._moveWindowDistances, this._statusWindow.y, this._statusWindow.width, this._statusWindow.height);
    //     } else {
    //         this._statusWindow.x = -10;
    //     };
    // };
};

Scene_Battle.prototype.createActorCommandWindow = function () {
    this._actorCommandBackSprite = null;
    this._actorCommandBackSprite = new Sprite();
    this._actorCommandBackSprite.hide();
    this._actorCommandBackSprite.bitmap = ImageManager.loadBitmap('img/newUi/battle/', "底板1");
    this._actorCommandBackSprite.anchor.set(0.5);
    this.addChild(this._actorCommandBackSprite);
    this._actorCommandBackSprite.x = Graphics.width / 2;
    this._actorCommandBackSprite.y = Graphics.height / 2;

    const rect = this.actorCommandWindowRect();
    const commandWindow = new Window_ActorCommand(rect);
    commandWindow.setHandler("attack", this.commandAttack.bind(this));
    commandWindow.setHandler("skill", this.commandSkill.bind(this));
    commandWindow.setHandler("guard", this.commandGuard.bind(this));
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("cancel", this.commandCancel.bind(this));
    this.addChild(commandWindow);
    this._actorCommandWindow = commandWindow;
};

Scene_Battle.prototype.actorCommandWindowRect = function () {
    const ww = 250;
    const wh = 200;
    const wx = Graphics.boxWidth / 2 - ww / 2 + 4;
    const wy = Graphics.boxHeight / 2 - wh / 2 + 10;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createItemWindow = function () {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_BattleItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addChild(this._itemWindow);
};

Cat.NewSceneMenu.Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
Scene_Battle.prototype.onItemOk = function () {
    Cat.NewSceneMenu.Scene_Battle_onItemOk.call(this);
    this._onCommandItem = true;
    this._itemWindow.hide();
};

Cat.NewSceneMenu.Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
Scene_Battle.prototype.onSkillOk = function () {
    Cat.NewSceneMenu.Scene_Battle_onSkillOk.call(this);
    this._onCommandSkill = true;
    this._skillWindow.hide();
};

Cat.NewSceneMenu.Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
Scene_Battle.prototype.onSkillCancel = function () {
    Cat.NewSceneMenu.Scene_Battle_onSkillCancel.call(this);
};

Cat.NewSceneMenu.Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk
Scene_Battle.prototype.onActorOk = function () {
    if (this._onCommandSkill) {
        this._onCommandSkill = false;
    }
    Cat.NewSceneMenu.Scene_Battle_onActorOk.call(this);
};

Cat.NewSceneMenu.Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel
Scene_Battle.prototype.onActorCancel = function () {
    if (this._onCommandSkill) {
        this._skillWindow.show();
        this._onCommandSkill = false;
    }
    if (this._onCommandItem) {
        this._itemWindow.show();
        this._onCommandItem = false;
    }
    Cat.NewSceneMenu.Scene_Battle_onActorCancel.call(this);
};

Cat.NewSceneMenu.Scene_Battle_commandAttack = Scene_Battle.prototype.commandAttack;
Scene_Battle.prototype.commandAttack = function () {
    this._onCommandAttack = true;
    this._actorCommandWindow.hide();
    Cat.NewSceneMenu.Scene_Battle_commandAttack.call(this);
};

Cat.NewSceneMenu.Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
Scene_Battle.prototype.onEnemyOk = function () {
    if (this._onCommandAttack) {
        this._onCommandAttack = false;
    }
    if (this._onCommandSkill) {
        this._onCommandSkill = false;
    }
    if (this._onCommandItem) {
        this._onCommandItem = false;
    }
    Cat.NewSceneMenu.Scene_Battle_onEnemyOk.call(this);
};

Cat.NewSceneMenu.Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
Scene_Battle.prototype.onEnemyCancel = function () {
    if (this._onCommandAttack) {
        this._actorCommandWindow.show();
        this._onCommandAttack = false;
    }
    if (this._onCommandSkill) {
        this._skillWindow.show();
        this._onCommandSkill = false;
    }
    if (this._onCommandItem) {
        this._itemWindow.show();
        this._onCommandItem = false;
    }
    Cat.NewSceneMenu.Scene_Battle_onEnemyCancel.call(this);
};

Scene_Battle.prototype.createHelpWindow = function () {
    this._skillCommandBackSprite1 = null;
    this._skillCommandBackSprite1 = new Sprite();
    this._skillCommandBackSprite1.hide();
    this._skillCommandBackSprite1.bitmap = ImageManager.loadBitmap("");
    // this._skillCommandBackSprite.anchor.set(0.5);
    this.addChild(this._skillCommandBackSprite1);
    this._skillCommandBackSprite1.x = 0;
    this._skillCommandBackSprite1.y = -10;

    const rect = this.helpWindowRect();
    this._helpWindow = new Window_BattleHelp(rect);
    this._helpWindow.hide();
    this.addChild(this._helpWindow);
};

Scene_Battle.prototype.createSkillWindow = function () {
    this._skillCommandBackSprite = null;
    this._skillCommandBackSprite = new Sprite();
    this._skillCommandBackSprite.hide();
    this._skillCommandBackSprite.bitmap = ImageManager.loadBitmap('');
    // this._skillCommandBackSprite.anchor.set(0.5);
    this.addChild(this._skillCommandBackSprite);
    this._skillCommandBackSprite.x = 0;
    this._skillCommandBackSprite.y = -14;

    const rect = this.skillWindowRect();
    this._skillWindow = new Window_BattleSkill(rect);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
    this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
    this.addChild(this._skillWindow);
};

Scene_Battle.prototype.skillWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = this.windowAreaHeight() - 20;
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Cat.NewSceneMenu.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    Cat.NewSceneMenu.Scene_Battle_update.call(this);
    if (this._actorNewPictureSprtie && this._actorNewPictureSprtie.visible) {
        this._actorPicturebreatheCount++;
        if (this._actorPicturebreatheCount < 61) {
            this._actorNewPictureSprtie.scale.y += 0.0002;
            this._actorNewPictureSprtie.scale.x += 0.0002;
        }
        else if (this._actorPicturebreatheCount > 60 && this._actorPicturebreatheCount <= 120) {
            this._actorNewPictureSprtie.scale.y -= 0.0002;
            this._actorNewPictureSprtie.scale.x -= 0.0002;
        }
        else {
            this._actorPicturebreatheCount = 0;
            this._actorNewPictureSprtie.scale.set(1);
        }
    };
}

Scene_Battle.prototype.createDisplayVictoryWindow = function () {
    this.createBackGroundSprite();
    this.createNewActorPictureSprite();
    this.createVictorySatusWindow();
    this.createVictoryItemWindow();
    this.createVictoryActorWindow();
};

Scene_Battle.prototype.createBackGroundSprite = function () {
    this._backGroundSprtie = new Sprite()
    this.addChild(this._backGroundSprtie)
    this._backGroundSprtie.bitmap = ImageManager.loadBitmap('img/newUi/battleEnd/', '底板');
    this._backGroundSprtie.x = 0;
    this._backGroundSprtie.y = 0;
    this._backGroundSprtie.visible = false;
};

Scene_Battle.prototype.createNewActorPictureSprite = function () {
    this._actorNewPictureSprtie = new Sprite()
    this.addChild(this._actorNewPictureSprtie)
    this._actorNewPictureSprtie.bitmap = ImageManager.loadBitmap('img/newUi/battleEnd/', '立绘');
    this._actorNewPictureSprtie.x = 640;
    this._actorNewPictureSprtie.y = 720;
    this._actorNewPictureSprtie.anchor.x = 0.5;
    this._actorNewPictureSprtie.anchor.y = 1;
    this._actorNewPictureSprtie.visible = false;
    this._actorPicturebreatheCount = 0;
};

Scene_Battle.prototype.createVictoryActorWindow = function () {
    const rect = this.victoryActorRect();
    this._victoryActorWindow = new Window_VictoryActor(rect);
    this.addChild(this._victoryActorWindow);
    this._victoryActorWindow.hide();
    this._victoryActorWindow.close();
};

Scene_Battle.prototype.victoryActorRect = function () {
    const ww = 440;
    const wh = 310;
    const wx = 620 - 200;
    const wy = 110 - 10;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createVictorySatusWindow = function () {
    const rect = this.victorySatusRect();
    this._victorySatusWindow = new Window_VictorySatus(rect);
    this.addChild(this._victorySatusWindow);
    this._victorySatusWindow.hide();
    this._victorySatusWindow.close();
};

Scene_Battle.prototype.victorySatusRect = function () {
    const ww = 440;
    const wh = 200;
    const wx = 620 - 200;
    const wy = 386 - 6;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createVictoryItemWindow = function () {
    const rect = this.victoryItemRect();
    this._victoryItemWindow = new Window_VictoryItem(rect);
    this.addChild(this._victoryItemWindow);
    this._victoryItemWindow.hide();
    this._victoryItemWindow.close();
};
Scene_Battle.prototype.victoryItemRect = function () {
    const ww = 440;
    const wh = 150;
    const wx = 620 - 200;
    const wy = 470 - 10;
    return new Rectangle(wx, wy, ww, wh);
};

/*BattleManager.processVictory*/
BattleManager.processVictory = function () {
    if (!$gameSystem._battleEndSelect) {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        //console.log(this._rewards.items)
        this.displayVictoryMessage();
        this.gainExp();
        this.displayRewards();
        this.gainRewards();
    }
    if ($gameSystem._battleEndOk == true) {
        Cat.VictoryUi._Scene_Battle._backGroundSprtie.visible = false;
        Cat.VictoryUi._Scene_Battle._actorNewPictureSprtie.visible = false;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.close();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.hide();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.close();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.hide();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.close();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.hide();
        $gameSystem._battleEndSelect = false;
        this.endBattle(0);
    }
};

BattleManager.displayRewards = function () {
    if (Cat.VictoryUi._Scene_Battle) {
        Cat.VictoryUi._Scene_Battle._backGroundSprtie.visible = true;
        Cat.VictoryUi._Scene_Battle._actorNewPictureSprtie.visible = true;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.open();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow.show();
        Cat.VictoryUi._Scene_Battle._victorySatusWindow._gold = this._rewards.gold;
        Cat.VictoryUi._Scene_Battle._victorySatusWindow._exp = this._rewards.exp;
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.refresh(this._rewards.items);
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.open();
        Cat.VictoryUi._Scene_Battle._victoryItemWindow.show();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow._upLevel = this._upLevel;
        Cat.VictoryUi._Scene_Battle._victoryActorWindow._upActorLast = this._upActorLast;
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.open();
        Cat.VictoryUi._Scene_Battle._victoryActorWindow.show();
        $gameSystem._battleEndSelect = true;
    }
};

/*Sprite_SaveMap*/
function Sprite_SaveMap() {
    this.initialize(...arguments);
}
Sprite_SaveMap.prototype = Object.create(Sprite.prototype);
Sprite_SaveMap.prototype.constructor = Sprite_SaveMap;

Sprite_SaveMap.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._textSprite = new Sprite();
    this._textSprite.bitmap = new Bitmap(200, 100);
    this._textSprite.bitmap.fontSize = 22;
    this._textSprite.bitmap.textColor = '#462a39';
    this._textSprite.bitmap.outlineColor = '#462a39';
    this._textSprite.bitmap.outlineWidth = 1;
    this.addChild(this._textSprite);
    this._textSprite.x = 190;
    this._textSprite.y = 261;
};

Sprite_SaveMap.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._saveWindow && this._saveWindow.active) {
        this.setData();
    }
};

Sprite_SaveMap.prototype.setData = function () {
    const savefileId = this._saveWindow.savefileId();
    if (this._saveWindow && savefileId && DataManager._globalInfo[savefileId] && !DataManager._globalInfo[savefileId].snapUrl) return;
    const bitmap = this._saveWindow._loadSaveBitmap[savefileId];
    if (bitmap) {
        this.bitmap = bitmap;
        if (DataManager._globalInfo[savefileId]) {
            if (DataManager._globalInfo[savefileId].mapName) {
                var mapName = DataManager._globalInfo[savefileId].mapName;
                this._textSprite.bitmap.clear();
                this._textSprite.bitmap.drawText(mapName, 0, 0, 200, 100, "left");
            } else {
                DataManager._globalInfo[savefileId].mapName = '';
            }
        }
    };
};

Sprite_SaveMap.prototype.setWindow = function (saveWindow) {
    this._saveWindow = saveWindow;
};

