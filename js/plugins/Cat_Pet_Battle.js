//=============================================================================
// RPG Maker MZ - 宠物系统扩展-战斗
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<宠物系统扩展-战斗>
 * @author Cat
 * @help
 * ==============================使用说明===============================
 * 偷窃技能公式：（强制占用变量20）
 * $gameVariables.setValue(20,[a,b._enemyId,80]);0; //80为成功概率
 * 执行公共事件：宠物偷盗
 * 公共事件内执行脚本：TheftItem();//偷取敌方物品
 * 
 * 宠物角色备注:
 * 立绘在img/pet/下
 * <宠物战斗立绘:文件名,x,y>
 * <宠物战斗立绘:HLN,0,100>  0是x位置，100是y
 * 
 * 战斗立绘图片名字后方加_1 就是攻击形态
 * 
 * 法宝图片都在img/fabao/下
 * 法宝备注：
 * <法宝立绘:文件名,X,Y,最大帧数>
 * ====================================================================
*/
'use strict';
var Imported = Imported || {};
Imported.Cat_Pet_Battle = true;

var Cat = Cat || {};
Cat.Pet_Battle = {};
Cat.Pet_Battle.parameters = PluginManager.parameters('Cat_Pet_Battle');


Cat.Pet_Battle.Scene_Battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function () {
    Cat.Pet_Battle.Scene_Battle_initialize.call(this);
    this._oldPetHp = -1;
    this._shakePetPower = 5;
    this._shakePetSpeed = 10;
    this._shakePetDuration = 0;
    this._shakePetDuration_1 = 0;
    this._breathePetCount = 0;
    this._oldPetHp = $gameParty.allMembers()[1] ? $gameParty.allMembers()[1].hp : 0;
};

Scene_Battle.prototype.createAnimationSprite = function () {
    const actor = $gameParty.allMembers()[0];
    const slot = actor._equips[5];
    if (slot && slot._dataClass == 'armor' && slot._itemId > 0) {
        const item = $dataArmors[slot._itemId];
        if (item && item.meta.法宝立绘) {
            const data = item.meta.法宝立绘.split(',');
            this._petCounts = 0;
            this._playAniCounts = 0;
            this._playAniCounts_1 = 0;
            this._maxPetCounts = Number(data[3])
            const img = data[0];
            this._cursorSprites = new Sprite();
            this.addChild(this._cursorSprites)
            this._cursorSprites.visible = false;
            this._cursorSprites.bitmap = ImageManager.loadBitmap('img/fabao/', img);
            this._cursorSprites.setFrame(0, 0, 192, 192);
            this._cursorSprites.anchor.set(0.5);
            this._cursorSprites.x = Number(data[1]);
            this._cursorSprites.y = Number(data[2]);
        }
    }
};

Cat.Pet_Battle.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    Cat.Pet_Battle.Scene_Battle_update.call(this);
    if (this._battlePetMainSprite) {
        this._breathePetCount++;
        if (this._breathePetCount < 61) {
            this._battlePetMainSprite.scale.y += 0.0002;
        } else if (this._breathePetCount > 60 && this._breathePetCount <= 120) {
            this._battlePetMainSprite.scale.y -= 0.0002;
        } else {
            this._breathePetCount = 0;
            this._battlePetMainSprite.scale.y = 1;
        }
        const pet = $gameParty.allMembers()[1];
        const hp = pet.hp;
        if (pet) {
            if (pet.isDead()) {
                if (this._battlePetMainSprite.opacity > 0) this._battlePetMainSprite.opacity -= 5;
            } else {
                if (this._battlePetMainSprite.opacity < 255) this._battlePetMainSprite.opacity += 5;
                if (hp != this._oldPetHp) {
                    if (this._shakePetDuration < 2) {
                        this._battlePetMainSprite.x += this._shakePetPower;
                    } else if (this._shakePetDuration < 6) {
                        this._battlePetMainSprite.x -= this._shakePetPower;
                    } else if (this._shakePetDuration < 8) {
                        this._battlePetMainSprite.x += this._shakePetPower;
                    }
                    this._shakePetDuration++;
                    if (this._shakePetDuration == 8) {
                        this._shakePetDuration_1++;
                        this._shakePetDuration = 0;
                    }
                    if (this._shakePetDuration_1 == 2) {
                        this._oldPetHp = hp;
                    }
                }
            };
        }
    };
    if (this._cursorSprites) {
        this._petCounts++;
        if (this._petCounts >= 4) {
            this._cursorSprites.visible = true;
            this._cursorSprites.setFrame(192 * this._playAniCounts, this._playAniCounts_1 * 192, 192, 192);
            this._playAniCounts++;
            if (this._playAniCounts > 4) {
                this._playAniCounts_1++;
                if (this._playAniCounts_1 >= (this._maxPetCounts / 5)) {
                    this._playAniCounts_1 = 0;
                }
                this._playAniCounts = 0;
            }
            this._petCounts = 0;
        }
    };
};
Cat.Pet_Battle.Scene_Battle_createPetHudSpriteset = Scene_Battle.prototype.createPetHudSpriteset;
Scene_Battle.prototype.createPetHudSpriteset = function () {
    /*宠物立绘*/
    if ($gameParty.allMembers()[1]) {
        const pet = $gameParty.allMembers()[1].actor();
        const meta = pet.meta.宠物战斗立绘;
        if (meta) {
            const data = meta.split(',');
            this._battlePetMainSprite = new Sprite();
            this.addChild(this._battlePetMainSprite);
            this._battlePetMainSprite.bitmap = ImageManager.loadBitmap('img/pet/', data[0]);
            this._battlePetMainSprite.anchor.x = 0.5;
            this._battlePetMainSprite.anchor.y = 1;
            this._battlePetMainSprite.x = Number(data[1]) + 330;
            this._battlePetMainSprite.y = Number(data[2]) + 640;
        };
    };
    Cat.Pet_Battle.Scene_Battle_createPetHudSpriteset.call(this);
    this.createAnimationSprite();
};

Scene_Battle.prototype.changeInputWindow = function () {
    this.hideSubInputWindows();
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            if (BattleManager.actor()._actorId == 1) {
                //    console.log('角色行动')
                this.startActorCommandSelection();
            } else {
                //    console.log('非角色行动')
                this._statusWindow.show();
                this._partyCommandWindow.close();
                this._actorCommandWindow.close();
                this.autoBattlePet();
                BattleManager.selectNextCommand();
            }
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};
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
        skills.push($dataSkills[114]);
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
Cat.Pet_Battle.Game_Action_updateLastTarget = Game_Action.prototype.updateLastTarget;
Game_Action.prototype.updateLastTarget = function (target) {
    if (this.subject().isActor() && this.subject()._actorId != 1 && $gameParty.inBattle()) {
        const pet = $gameParty.allMembers()[1].actor();
        const meta = pet.meta.宠物战斗立绘;
        if (meta) {
            const data = meta.split(',');
            SceneManager._scene._battlePetMainSprite.bitmap = ImageManager.loadBitmap('img/pet/', data[0]);
        };
    };
    Cat.Pet_Battle.Game_Action_updateLastTarget.call(this, target);
};


Cat.Pet_Battle.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function (actorId) {
    Cat.Pet_Battle.Game_Actor_initMembers.call(this, actorId);
    this._petUseSkills = null;
};

Scene_LL_Pet.prototype.okPetSkill = function (pet, item) {
    const actor = $gameActors.actor(pet.id);
    if (!actor._petUseSkills) {
        actor._petUseSkills = null;
    };
    actor._petUseSkills = item;
    this.cancelUse();
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
    if (pet._petUseSkills) {
        const skill = pet._petUseSkills;
        this.drawItemName(skill, x + 100, y + 60, this.width);
    }
    this.resetTextColor();
};
Window_PetUseList.prototype.refresh = function () {
    this.contents.clear();
    this._list = [];
    if (this._type == 0) {
        this._list = $gameParty.allItems().filter(item => item.meta.宠物使用);
    } else if (this._type == 1) {
        this._list = $gameParty.allItems().filter(item => item.atypeId == 7 && item.etypeId == 8);
    } else {
        const actor = $gameActors.actor(this._actor.id)
        const skills = actor._skills;
        for (let i = 0; i < skills.length; i++) {
            const skill = $dataSkills[Number(skills[i])];
            if (skill) {
                this._list.push(skill);
            };
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

function TheftItem() {
    if ($gameVariables.value(20)[1] > 0) {
        const itemRate = Math.floor((Math.random() * 100) + 1);
        if (itemRate <= $gameVariables.value(20)[2]) {
            const enemy = $dataEnemies[$gameVariables.value(20)[1]];
            if (enemy) {
                const dropItems = enemy.dropItems;
                if (dropItems.length > 0) {
                    const drop = dropItems[Math.floor((Math.random() * dropItems.length))];
                    if (drop) {
                        var item = null;
                        if (drop.kind == 1) {
                            var data = $dataItems;
                            var item = data[drop.dataId];
                        } else if (drop.kind == 2) {
                            var data = $dataWeapons;
                            var item = data[drop.dataId];
                        } else if (drop.kind == 3) {
                            var data = $dataArmors;
                            var item = data[drop.dataId];
                        }
                        if (item) {
                            $gameParty.gainItem(item, 1);
                            $gameMessage.setSpeakerName($gameVariables.value(20)[0].name());
                            $gameMessage.add('你成功从' + enemy.name + '身上偷到了\\I[' + item.iconIndex + ']' + item.name);
                        } else {
                            $gameMessage.setSpeakerName($gameVariables.value(20)[0].name());
                            $gameMessage.add('偷窃失败');
                        }
                    } else {
                        $gameMessage.setSpeakerName($gameVariables.value(20)[0].name());
                        $gameMessage.add('偷窃失败');
                    }
                } else {
                    $gameMessage.setSpeakerName($gameVariables.value(20)[0].name());
                    $gameMessage.add('没有可偷窃物品');
                }
            }
        } else {
            $gameMessage.setSpeakerName($gameVariables.value(20)[0].name());
            $gameMessage.add('偷窃失败');
        }
    };
};