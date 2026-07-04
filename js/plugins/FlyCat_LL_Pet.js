//=============================================================================
// RPG Maker MZ - 琉璃岛宠物插件
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<琉璃岛宠物插件>
 * @author FlyCat
 * 
 * @command addPetActor
 * @text 添加宠物
 * @desc 添加宠物
 *
 * @arg actorId
 * @text 选择想要添加宠物
 * @type actor
 * 
 * @command upLevelPetActor
 * @text 选择进化宠物
 * @desc 选择进化宠物
 *
 * @arg actorId
 * @text 进化的宠物
 * @type actor
 * 
 * @arg actorUpId
 * @text 进化后的宠物
 * @type actor
 * 
 * @help
 * 2022.5.14
 * 1.药品备注：<宠物使用> 该物品可以让宠物使用
 * 2021.2.22
 * 1.UI布局处理
 * 2.可参战宠物为1只
 * 3.宠物装备只显示护甲
 * ==============================使用说明================================
 * 在img下创建pet文件夹
 * 宠物立绘放在img/pet下
 * 宠物最多参战2只
 * 宠物只能选择一个技能上场
 * ==============================角色备注================================
 * 在宠物角色备注中填写：
 * <颜色:x>   x为色号可改变宠物名字颜色
 * <宠物立绘:xxx> xxx为宠物立绘文件名
 * <宠物技能:x> 宠物可选择的技能Id
 * <宠物技能:x,x,x,x> 宠物可选择多个技能用‘,’号隔开
 * ==============================插件命令================================
 * 添加指定的宠物进入宠物窗口中
 * =====================================================================
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_LL_Pet = true;

var FlyCat = FlyCat || {};
FlyCat.LL_Pet = {};
FlyCat.LL_Pet.parameters = PluginManager.parameters('FlyCat_LL_Pet');

PluginManager.registerCommand('FlyCat_LL_Pet', 'addPetActor', args => {
    if (!$gameSystem._petActorList) {
        $gameSystem._petActorList = [];
    }
    const pet = $dataActors[args.actorId];
    const index = $gameSystem._petActorList.includes(pet);
    if (!index) {
        $gameSystem._petActorList.push(pet)
    }
});
PluginManager.registerCommand('FlyCat_LL_Pet', 'upLevelPetActor', args => {
    const petId = Number(args.actorId);
    $gameParty.removeActor(petId)
    for (let i = 0; i < $gameSystem._petActorList.length; i++) {
        if ($gameSystem._petActorList[i].id == petId) {
            $gameSystem._petActorList.splice(i, 1);
            break;
        }
    }
    const newpet = $dataActors[args.actorUpId];
    const index = $gameSystem._petActorList.includes(newpet);
    if (!index) {
        $gameSystem._petActorList.push(newpet);
    }
});
FlyCat.LL_Pet.Scene_Item_onActorOk = Scene_Item.prototype.onActorOk
Scene_Item.prototype.onActorOk = function () {
    if (this.item() && this.item().meta.指定角色) {
        const index = this._actorWindow.index();
        if (index >= 0) {
            const actor = this._actorWindow.actor(index);
            if (actor) {
                const actorId = Number(this.item().meta.指定角色);
                if (actor._actorId != actorId) {
                    SoundManager.playBuzzer();
                    return;
                }
            }

        }
    }
    FlyCat.LL_Pet.Scene_Item_onActorOk.call(this)
};


Game_Party.prototype.maxBattleMembers = function () {
    return 2;
};

function Scene_LL_Pet() {
    this.initialize(...arguments);
}

Scene_LL_Pet.prototype = Object.create(Scene_MenuBase.prototype);
Scene_LL_Pet.prototype.constructor = Scene_Menu;

Scene_LL_Pet.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    FlyCat.LL_Pet._Scene_LL_Pet = this;
};
Scene_LL_Pet.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    this.createStatusWindow();
    this.petSprite();
    this.createPetListWindow();
    this.createPetCommandWindow();
    this.createUseListWindow();
    this.createPetInfo();
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

Scene_LL_Pet.prototype.createUseListWindow = function () {
    this._equipItemBackSprite = new Sprite();
    this.addChild(this._equipItemBackSprite);
    this._equipItemBackSprite.hide();
    this._equipItemBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'zz');

    this._equipItemSprite = new Sprite();
    this.addChild(this._equipItemSprite);
    this._equipItemSprite.hide();
    this._equipItemSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');
    // this._equipItemSprite.anchor.set(0.5);

    this._cancelButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelButtonSprite);
    this._cancelButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelButtonSprite.scale.set(0.7);
    this._cancelButtonSprite.setClickHandler(this.cancelUse.bind(this));
    this._cancelButtonSprite.hide();

    const rect = this.petUseListWindowRect();
    this._petUseListWindow = new Window_PetUseList(rect);
    this._petUseListWindow.setHandler('ok', this.onUse.bind(this));
    this._petUseListWindow.setHandler('cancel', this.cancelUse.bind(this));
    this.addChild(this._petUseListWindow);
    this._petUseListWindow.deactivate();
    this._petUseListWindow.hide();

    this._cancelButtonSprite.x = this._petUseListWindow.x + this._petUseListWindow.width - 23;
    this._cancelButtonSprite.y = this._petUseListWindow.y - 16;

    this._equipItemSprite.x = this._petUseListWindow.x + 13;
    this._equipItemSprite.y = this._petUseListWindow.y + 5;
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
        this.okPetSkill(pet, item);
    } else {
        this.onItemOk(pet, item);
    }
};
Scene_LL_Pet.prototype.onItemOk = function (pet, item) {
    SoundManager.playEquip();
    this.executeEquipChange(pet, item);
    this.cancelUse();
};
Scene_LL_Pet.prototype.executeEquipChange = function (pet, item) {
    const actor = $gameActors.actor(pet.id);
    const slotId = 7;
    actor.changeEquip(slotId, item);
};
Scene_LL_Pet.prototype.okPetSkill = function (pet, item) {
    const actor = $gameActors.actor(pet.id);
    actor._skills = [];
    actor.learnSkill(item.id);
    SoundManager.playEquip();
    this.cancelUse();
};
Scene_LL_Pet.prototype.useItem = function (pet, item) {
    const actor = $gameActors.actor(pet.id);
    if (item && item.meta.指定角色) {
        const actorId = Number(item.meta.指定角色);
        if (actor._actorId != actorId) {
            SoundManager.playBuzzer();
            this._petUseListWindow.refresh();
            this._petUseListWindow.activate();
            return;
        }
    }
    const action = new Game_Action(actor);
    action.setItemObject(item);
    SoundManager.playUseItem();
    actor.useItem(item);
    this.applyItem(actor, item);
    this.checkCommonEvent();
    this.checkGameover();
};
Scene_LL_Pet.prototype.applyItem = function (actor, item) {
    const action = new Game_Action(actor);
    action.setItemObject(item);
    for (const target of this.itemTargetActors(actor, item)) {
        for (let i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }
    action.applyGlobal();
};
Scene_LL_Pet.prototype.itemTargetActors = function (actor, item) {
    const action = new Game_Action(actor);
    action.setItemObject(item);
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return actor;
    } else {
        return [actor];
    }
};
Scene_LL_Pet.prototype.checkCommonEvent = function () {
    if ($gameTemp.isCommonEventReserved()) {
        SceneManager.goto(Scene_Map);
    }
};
Scene_LL_Pet.prototype.cancelUse = function () {
    this._cancelButtonSprite.hide()
    this._equipItemSprite.hide();
    this._equipItemBackSprite.hide();
    this._petUseListWindow.deactivate();
    this._petUseListWindow.hide();
    this._petCommandWindow.activate();
};
Scene_LL_Pet.prototype.petUseListWindowRect = function () {
    const ww = 380;
    const wh = 450;
    const wx = (Graphics.width - ww) / 2;
    const wy = (Graphics.height - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LL_Pet.prototype.petSprite = function () {
    this._petSprite = new Sprite()
    this.addChild(this._petSprite)
    this._petSprite.anchor.x = 0.5;
    this._petSprite.anchor.y = 1;
    this._petSprite.scale.set(0.8);
    this._petSprite.x = 650;
    this._petSprite.y = 640;
    this._breatheCount = 0;
    this._lastImg = '';
};
Scene_LL_Pet.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._petListWindow) {
        const index = this._petListWindow.index();
        let pet = this._petListWindow._list[index];
        if (pet) {
            pet = $dataActors[pet.id] || pet;
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
Scene_LL_Pet.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_LL_Pet.prototype.statusWindowRect = function () {
    const ww = 1050;
    const wh = 400;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LL_Pet.prototype.createPetListWindow = function () {
    const rect = this.petListWindowRect();
    this._petListWindow = new Window_PetList(rect);
    this._petListWindow.setHandler('ok', this.onPet.bind(this));
    this._petListWindow.setHandler('cancel', this.cancelScenePet.bind(this));
    this.addChild(this._petListWindow);
    if ($gameSystem._petActorList) {
        this._petListWindow.select(0);
        this._petListWindow.activate();
    }
    this._petListWindow.activate();
};
Scene_LL_Pet.prototype.petListWindowRect = function () {
    const ww = 280;
    const wh = 420;
    const wx = 230;
    const wy = 166;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LL_Pet.prototype.onPet = function () {
    const index = this._petListWindow.index();
    const pet = this._petListWindow._list[index];
    if (!pet) {
        this._petListWindow.activate();
        SoundManager.playBuzzer();
        return;
    }
    this._petListWindow.deactivate();
    this._petCommandWindow.activate();
    this._petCommandWindow.select(0);
};
Scene_LL_Pet.prototype.cancelScenePet = function () {
    // this._petListWindow.deactivate();
    // this._commandWindow.activate();
    SceneManager.goto(Scene_Status)
};

Scene_LL_Pet.prototype.createPetCommandWindow = function () {
    const rect = this.petCommandWindowRect();
    this._petCommandWindow = new Window_PetCommand(rect);
    this._petCommandWindow.setHandler('ok', this.onCommand.bind(this));
    this._petCommandWindow.setHandler('cancel', this.cancelPetCommand.bind(this));
    this.addChild(this._petCommandWindow);
    this._petCommandWindow.deactivate();
    this.createCommandSprite();
};
/*创建按钮精灵*/
Scene_LL_Pet.prototype.createCommandSprite = function () {
    var x = 800;
    var y = 187;
    this._petButtonSprite = [];
    for (let i = 0; i < 5; i++) {
        if (i == 3) {
            y = 533;
        }
        this._petButtonSprite[i] = new Sprite_PetCommandButton();
        this.addChild(this._petButtonSprite[i]);
        this._petButtonSprite[i]._buttonId = i;
        this._petButtonSprite[i].bitmap = ImageManager.loadBitmap('img/menu/', "petCommand_" + i)
        //   this._petButtonSprite[i].anchor.set(0.5);
        this._petButtonSprite[i].x = x;
        this._petButtonSprite[i].y = y;
        y += 42;
    }
};
Scene_LL_Pet.prototype.petCommandWindowRect = function () {
    const ww = 280;
    const wh = 450;
    const wx = 2000;
    const wy = 166;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LL_Pet.prototype.cancelPetCommand = function () {
    this._petListWindow.activate();
    this._petCommandWindow.deactivate();
    this._petCommandWindow.deselect();
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
            this._petUseListWindow.setActor(pet, 2);
            break;
        case 4:
            this._petUseListWindow.setActor(pet, 1);
            break;
    }
};
Scene_LL_Pet.prototype.addPet = function () {
    const index = this._petListWindow.index();
    const pets = $gameSystem._petActorList[index];
    const pet = $gameActors.actor(pets.id);
    const actorList = $gameParty.allMembers();
    const actorIndex = actorList.indexOf(pet)
    const actorLength = $gameParty.allMembers().length;
    const maxActor = $gameParty.maxBattleMembers();
    if (actorLength < maxActor && actorIndex == -1) {
        $gameParty.addActor(pets.id)
        SoundManager.playEquip();
    }
    else {
        SoundManager.playBuzzer();
    }
    this._petCommandWindow.activate();
    this._petListWindow.refresh();
};
Scene_LL_Pet.prototype.removePet = function () {
    const index = this._petListWindow.index();
    const pets = $gameSystem._petActorList[index];
    const pet = $gameActors.actor(pets.id);
    const actorList = $gameParty.allMembers();
    const actorIndex = actorList.indexOf(pet)
    if (actorIndex == -1) {
        SoundManager.playBuzzer();
    }
    else {
        SoundManager.playEquip();
        $gameParty.removeActor(pets.id)
    }
    this._petCommandWindow.activate();
    this._petListWindow.refresh();
};

Scene_LL_Pet.prototype.removeAllPet = function () {
    const actorList = $gameParty.allMembers();
	const len = actorList.length;
	for (var i = 0; i < len; i++) {
		if (actorList[i].actorId() > 1) {
			$gameParty.removeActor(actorList[i].actorId());
		}
	}
};

Scene_LL_Pet.prototype.createPetInfo = function () {
    const rect = this.petInfoWindowRect();
    this._petInfoWindow = new Window_PetInfo(rect);
    this.addChild(this._petInfoWindow);
};

Scene_LL_Pet.prototype.petInfoWindowRect = function () {
    const ww = 280;
    const wh = 440;
    const wx = 940;
    const wy = 180;
    return new Rectangle(wx, wy, ww, wh);
};
/*宠物命令*/
function Window_PetCommand() {
    this.initialize(...arguments);
}

Window_PetCommand.prototype = Object.create(Window_Selectable.prototype);
Window_PetCommand.prototype.constructor = Window_PetCommand;

Window_PetCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};
Window_PetCommand.prototype.refresh = function () {
    this.contents.clear();
    this._list = ['参战', '休息', '投喂', '选择技能', '选择装备'];
    this.drawAllItems();
};
Window_PetCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const skill = this._list[index];
    if (skill) {
        this.drawText(skill, rect.x, rect.y, this.itemWidth(), 'center')
    }
}
Window_PetCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};
Window_PetCommand.prototype.maxCols = function () {
    return 1;
};
Window_PetCommand.prototype.numVisibleRows = function () {
    return 5;
};
Window_PetCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

///////////////////////////////////////宠物列表/////////////////////////////////
function Window_PetList() {
    this.initialize(...arguments);
}

Window_PetList.prototype = Object.create(Window_Selectable.prototype);
Window_PetList.prototype.constructor = Window_PetList;

Window_PetList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.opacity = 0;
    //  this.activate();
    this._loadingPictrue = false;
    this._loadBitmap = [];
    this._loadBitmap[0] = ImageManager.loadBitmap('img/menu/', '宠物列表背景图');
    this._loadBitmap[1] = ImageManager.loadBitmap('img/menu/', '宠物列表选择框');
    this.createCursorSprite();
};
Window_PetList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', '宠物列表选择框');
    this._clientArea.addChild(this._cursorSprites);
};
Window_PetList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this.updateLoading()) {
        this.refresh();
        if (this._list.length > 0) {
            this.select(0);
        } else {
            this.deselect();
        }
        this._loadingPictrue = true;
    }
};
Window_PetList.prototype.updateLoading = function () {
    for (let i = 0; i < this._loadBitmap.length; i++) {
        if (this._loadBitmap[i] && !this._loadBitmap[i].isReady()) {
            return false;
        }
    }
    return true;
}
Window_PetList.prototype.drawBackgroundRect = function (rect) {
};
Window_PetList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        this._cursorSprites.alpha = 1;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 3;
        this._cursorSprites.y = this._cursorSprite.y - 1;
    } else {
        this._cursorSprites.visible = false;
    }
};
Window_PetList.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap[0];
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x - 2;
        const dy = rect.y - 2;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};
Window_PetList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    this._list = $gameSystem._petActorList ? $gameSystem._petActorList : [];
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawText('未获得宠物', -10, this.height / 2 - 30, this.width, 'center')
    }
};
Window_PetList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    let pet = this._list[index];
    if (pet) {
        pet = $dataActors[pet.id] || pet;
        this.contents.fontSize = 18;
        if (index == this.index()) {
            this.drawCursorBitmap(rect, 1)
        } else {
            this.drawCursorBitmap(rect, 0)
        }
        const colorId = pet.meta.颜色 ? pet.meta.颜色 : 0;
        if (colorId == 0) {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
        } else {
            this.changeTextColor(ColorManager.textColor(Number(colorId)));
            this.contents.outlineColor = ColorManager.textColor(Number(colorId));
            this.contents.outlineWidth = 1;
        }
        this.drawText(pet.name, rect.x + 2, rect.y, this.width, 'left')
        const pets = $gameActors.actor(pet.id)
        const petIndex = $gameParty.allMembers().indexOf(pets);
        if (petIndex != -1) {
            var note = '[已参战]';
            this.changeTextColor('#ca850c');
            this.contents.outlineColor = '#e4c586';
            this.contents.outlineWidth = 1;
        }
        else {
            this.changeTextColor('#4e7574');
            this.contents.outlineColor = '#587c7a';
            this.contents.outlineWidth = 1;
            var note = '[休息]';
        }
        this.contents.fontSize = 16;
        this.drawText(note, rect.x - 2, rect.y, this.itemWidth() - 20, 'right')
        this.resetTextColor();
    }
}
Window_PetList.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};
Window_PetList.prototype.maxCols = function () {
    return 1;
};
Window_PetList.prototype.numVisibleRows = function () {
    return 8;
};
Window_PetList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
FlyCat.LL_Pet.Window_PetList_select = Window_PetList.prototype.select;
Window_PetList.prototype.select = function (index) {
    FlyCat.LL_Pet.Window_PetList_select.call(this, index)
    if (index != this.lastselect && this._loadingPictrue) {
        this.refresh();
        this.lastselect = index;
    }
};

////////////////////////宠物信息///////////////////////////
function Window_PetInfo() {
    this.initialize(...arguments);
}

Window_PetInfo.prototype = Object.create(Window_Base.prototype);
Window_PetInfo.prototype.constructor = Window_PetInfo;

Window_PetInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_PetInfo.prototype.refresh = function (actor) {
    this.contents.clear();
    this.resetTextColor();
    this.contents.fontSize = 20;
    const pet = $gameActors.actor(actor.id);
    var x = 0;
    var y = 0;
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#cbd6c9';
    this.contents.outlineWidth = 1;
    this.drawText(pet.name(), x + 80, y - 5, this.width, 'left')
    y += 30;
    this.changeTextColor('#4d9ac2');
    this.contents.outlineColor = '#b6d3d8';
    this.contents.outlineWidth = 1;

    for (let i = 0; i < 8; i++) {
        //  const text = TextManager.param(i);
        const value = pet.param(i);
        if (i == 0) {
            var value1 = pet.hp + '/';
        }
        else if (i == 1) {
            var value1 = pet.mp + '/';
        }
        else {
            var value1 = '';
        }
        this.drawText(value1 + value, x, y, this.width - 50, 'right')
        y += 32;
    }
    const equips = pet.equips();
    const item = equips[7];
    this.drawItemName(item, x + 100, y + 95, this.width);
    if (pet._skills.length > 0) {
        const skill = $dataSkills[Number(pet._skills[0])];
        this.drawItemName(skill, x + 100, y + 60, this.width);
    }
    this.resetTextColor();
};
Window_PetInfo.prototype.drawItemName = function (item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const textMargin = ImageManager.iconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.changeTextColor('#ca850c');
        this.contents.outlineColor = '#dfbd78';
        this.contents.outlineWidth = 1;
        this.contents.fontSize = 20;
        this.drawIcon(item.iconIndex, x, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};
Window_PetInfo.prototype.actorSlotName = function (actor, index) {
    const slots = actor.equipSlots();
    return $dataSystem.equipTypes[slots[index]];
};

/*选择列表*/
function Window_PetUseList() {
    this.initialize(...arguments);
}

Window_PetUseList.prototype = Object.create(Window_Selectable.prototype);
Window_PetUseList.prototype.constructor = Window_PetUseList;

Window_PetUseList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._type = -1;
    this.opacity = 0;
    this._loadingPictrue = true;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'xz_0');
    this.createCursorSprite();
};
Window_PetUseList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadBitmap('img/menu/', 'xz_2');
    this._clientArea.addChild(this._cursorSprites);
};
Window_PetUseList.prototype.update = function () {
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
};
Window_PetUseList.prototype.setActor = function (actor, type) {
    this._actor = $dataActors[actor.id] || actor;
    this._type = type;
    this._loadingPictrue = false;
    SceneManager._scene._cancelButtonSprite.show();
    SceneManager._scene._equipItemSprite.show();
    SceneManager._scene._equipItemBackSprite.show();
    this.activate();
};
Window_PetUseList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};
Window_PetUseList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    if (this._type == 0) {
        this._list = $gameParty.allItems().filter(item => item.meta.宠物使用);
    } else if (this._type == 1) {
        this._list = $gameParty.allItems().filter(item => item.atypeId == 7 && item.etypeId == 8);
    } else {
        if (this._actor.meta.宠物技能) {
            const meta = this._actor.meta.宠物技能.split(',');
            for (let i = 0; i < meta.length; i++) {
                const skill = $dataSkills[Number(meta[i])];
                if (skill) this._list.push(skill);
            }
        }
    }
    if (this._list.length > 0) {
        this.contents.fontSize = 20;
        this.drawAllItems();
    } else {
        this.contents.fontSize = 24;
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        if (this._type == 0) {
            this.drawText('没有可使用道具', -10, this.height / 2 - 30, this.width, 'center');
        }
        if (this._type == 1) {
            this.drawText('没有可装备驭灵环', -10, this.height / 2 - 30, this.width, 'center');
        }
        if (this._type == 2) {
            this.drawText('没有可装备技能', -10, this.height / 2 - 30, this.width, 'center');
        }
    };
};
Window_PetUseList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const item = this._list[index];
    if (item) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#587c7a';
        this.contents.outlineWidth = 1;
        this.drawCursorBitmap(rect)
        this.drawIcon(item.iconIndex, rect.x + 5, rect.y - 4)
        this.drawText(item.name, rect.x + 48, rect.y, this.width, 'left');
        if (!DataManager.isSkill(item)) {
            this.drawText("持有：", rect.x, rect.y, rect.width - this.textWidth("00"), "right");
            this.drawText($gameParty.numItems(item), rect.x, rect.y, rect.width, "right");
        }

    }
}
Window_PetUseList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};
Window_PetUseList.prototype.numVisibleRows = function () {
    return 8;
};
Window_PetUseList.prototype.lineHeight = function () {
    return 27;
};
Window_PetUseList.prototype.drawBackgroundRect = function (rect) {
};
Window_PetUseList.prototype._updateCursor = function () {
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
Window_PetUseList.prototype.drawCursorBitmap = function (rect) {
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


function Sprite_PetCommandButton() {
    this.initialize(...arguments);
}
Sprite_PetCommandButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_PetCommandButton.prototype.constructor = Sprite_PetCommandButton;

Sprite_PetCommandButton.prototype.initialize = function () {
    Sprite_Clickable.prototype.initialize.call(this);
    this._clickHandler = null;
    this._buttonId = -1;
};

Sprite_PetCommandButton.prototype.onClick = function () {
    if (SceneManager._scene._petCommandWindow.active) {
        SceneManager._scene._petCommandWindow.select(this._buttonId);
        SceneManager._scene._petCommandWindow.processOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Sprite_PetCommandButton.prototype.onMouseEnter = function () {
    if (SceneManager._scene._petCommandWindow.active) {
        SceneManager._scene._petCommandWindow.select(this._buttonId);
        SoundManager.playCursor();
        this._colorTone = [50, 50, 50, 0]
        this._updateColorFilter();
    };
};

Sprite_PetCommandButton.prototype.update = function () {
    Sprite_Clickable.prototype.update.call(this);
    const index = SceneManager._scene._petCommandWindow.index();
    if (index >= 0 && this._buttonId == index) {
        this._colorTone = [30, 30, 30, 0]
        this._updateColorFilter();
    } else {
        this._colorTone = [0, 0, 0, 0]
        this._updateColorFilter();
    }
};
Sprite_PetCommandButton.prototype.onMouseExit = function () {
    this._colorTone = [0, 0, 0, 0]
    this._updateColorFilter();
};
Sprite_PetCommandButton.prototype.setClickHandler = function (method) {
    this._clickHandler = method;
};