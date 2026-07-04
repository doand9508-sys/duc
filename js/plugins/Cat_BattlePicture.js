//=============================================================================
// RPG Maker MV - Cat-BattlePicture
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<BattlePicture>
 * @author Cat
 * 
 * @param layer
 * @text 地图立绘图片层级数量
 * @desc 地图立绘图片层级数量
 * @type nubmer
 * @default 99
 * 
 * @command removeLayer
 * @text 清空图层
 * @desc
 * 
 * @arg id
 * @type number
 * @text 图层id
 * @desc 图层id
 * @default
 * 
 * @command changeLayer
 * @text 强制修改图层
 * @desc
 * 
 * @arg id
 * @type number
 * @text 图层id
 * @desc 图层id
 * @default
 * 
 * @arg name
 * @type string
 * @text 图片名（如果单张图片写全名选择不破损）
 * @desc 图片名（如果单张图片写全名选择不破损）
 * @default
 * 
 * @arg type
 * @type select
 * @text 是否增加破损
 * @desc 是否增加破损
 * @option 破损
 * @value 1
 * @option 不破损
 * @value 2
 *
 * @arg type1
 * @type select
 * @text 是否位通用图
 * @desc 是否位通用图
 * @option 通用
 * @value 1
 * @option 不通用
 * @value 2
 * 
 * @help
 * 显示部件 角色id 图层id 图片名前缀 是否破损 破损true/不破损false 通用（通用表示图片不受当前操作影响变化比如衣服本体）
 * 系统开关 开关id 打开        
 * 系统开关 开关id 关闭
 * 系统变量 变量id 加 数值
 * 系统变量 变量id 减 数值
 * 系统变量 变量id 等 数值
 * 范例：
 * <换装序列>
 * 显示部件 1 7 ZDLHYFXXFYS true  
 * 显示部件 1 3 ZDLHYFXXFZS true
 * 显示部件 1 9 ZDLHYFXXFPD true
 * 显示部件 1 5 ZDLHYFXXF1 false 通用
 * 显示部件 1 16 地图立绘修仙服 true 通用
 * 系统变量 1 加 20
 * 系统开关 1 打开
 * </换装序列>
 * 以下是默认图层，其中打钩的已经被强制修改，其他可自行发挥
 * 1-后发V 2-左手 V 3-左手衣服 4-身躯裸体V 5-身躯衣服 6-右手V 7-右手衣服 8-表情V 
 * 9-飘带 10-武器
 * 新：11-头饰 12-刘海V 13.白浊V
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_BattlePicture = true;

var Cat = Cat || {};
Cat.BattlePicture = {};
Cat.BattlePicture.parameters = PluginManager.parameters('Cat_BattlePicture');
Cat.BattlePicture.layer = Number(Cat.BattlePicture.parameters['layer']);


PluginManager.registerCommand('Cat_BattlePicture', 'changeLayer', args => {
    const id = Number(args.id);
    const name = String(args.name);
    const type = Number(args.type);
    const type1 = Number(args.type1);
    const actor = $gameParty.allMembers()[0];
    var ps = false;
    var ty = false;
    if (type == 1) {
        var ps = true;
    }
    if (type1 == 1) {
        var ty = true;
    }
    actor._equipLayer[id] = [name, ps, ty, true];
});

PluginManager.registerCommand('Cat_BattlePicture', 'removeLayer', args => {
    const id = Number(args.id);
    const actor = $gameParty.allMembers()[0];
    actor._equipLayer[id] = null;
});

Cat.BattlePicture.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    Cat.BattlePicture.Game_Actor_initMembers.call(this);
    this.equipLayerStart();
};

Game_Actor.prototype.equipLayerStart = function () {
    if (this._equipLayer == undefined) {
        this._equipLayer = [];
        this._equipArmorDurability = [];
        this._saveVariables = [];
        for (let i = 1; i < Cat.BattlePicture.layer + 1; i++) {
            if (!this._equipLayer[i]) {
                this._equipLayer[i] = null;
                if (i == 7 || i == 9 || i == 11 || i == 13) {
                    this._equipArmorDurability[i] = true;
                } else {
                    this._equipArmorDurability[i] = false;
                }
            };
        };
    };
};

Cat.BattlePicture.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    Cat.BattlePicture.Game_Actor_setup.call(this, actorId);
    const armor = this.equips()[1];
    if (armor && actorId == 1) {
        //this.getItemNote(armor, true);
        this.getItemNote($dataItems[788], true);//默认788号物品战斗立绘
        this.getItemNote($dataItems[814], true);//默认814号物品战斗立绘
    };
};

Cat.BattlePicture.Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
Game_Actor.prototype.changeEquip = function (slotId, item) {
    if (this._equipLayer == undefined) {
        this.equipLayerStart();
    };
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
        (!item || this.equipSlots()[slotId] === item.etypeId)
    ) {
        if (item) {
            if (this.equips()[slotId]) {
                this.getItemNote(this.equips()[slotId], false);
            }
            this.getItemNote(item, true);
        } else if (item == null && this.equips()[slotId]) {
            this.getItemNote(this.equips()[slotId], false);
        };
        this._equips[slotId].setObject(item);
        this.refresh();
        Cat.BattlePicture.Game_Actor_changeEquip.call(this, slotId, item);
    } else {
        Cat.BattlePicture.Game_Actor_changeEquip.call(this, slotId, item);
    }
};

Game_Actor.prototype.getItemNote = function (item, type) {
    if (item.note.match(/<换装序列>\n([\s\S]+?)\n<\/换装序列>/i)) {
        var data = RegExp.$1.split(/\n/);
        data.forEach(line => {
            if (line.match(/显示部件[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const actorId = Number(meta[0]);
                const equipId = Number(meta[1]);
                const equipName = String(meta[2]);
                const only = meta[3] ? eval(String(meta[3])) : false;
                const constraint = meta[4] == '通用' ? true : false;
                if (this._actorId == actorId) {
                    if (type == false) {
                        this._equipLayer[equipId] = null;
                    } else {
                        this._equipLayer[equipId] = [equipName, only, constraint, false];
                    }
                }
            } else if (line.match(/系统开关[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const value = Number(meta[0]);
                const lock = meta[1];
                if (lock == '打开') {
                    if (type == false) {
                        $gameSwitches.setValue(value, false);
                    } else {
                        $gameSwitches.setValue(value, true);
                    }
                } else {
                    if (type == false) {
                        $gameSwitches.setValue(value, true);
                    } else {
                        $gameSwitches.setValue(value, false);
                    };
                }
            } else if (line.match(/系统变量[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const id = Number(meta[0]);
                const lock = meta[1];
                const value = Number(meta[2]);
                if (lock == '加') {
                    if (type == false) {
                        const values = $gameVariables.value(id) - value;
                        $gameVariables.setValue(id, values);
                    } else {
                        const values = $gameVariables.value(id) + value;
                        $gameVariables.setValue(id, values);
                    }
                } else if (type == '减') {
                    if (type == false) {
                        const values = $gameVariables.value(id) + value;
                        $gameVariables.setValue(id, values);
                    } else {
                        const values = $gameVariables.value(id) - value;
                        $gameVariables.setValue(id, values);
                    }
                } else if (lock == '等') {
                    if (type == false) {
                        $gameVariables.setValue(id, this._saveVariables[id]);
                    } else {
                        this._saveVariables[id] = $gameVariables.value(id);
                        $gameVariables.setValue(id, value);
                    };
                }
            };
        });
    };
};

Cat.BattlePicture.Scene_Battle_initialize = Scene_Battle.prototype.initialize
Scene_Battle.prototype.initialize = function () {
    Cat.BattlePicture.Scene_Battle_initialize.call(this);
    FlyCat.LL_Battle._Scene_Battle = this;
    this._breatheBattleCount = 0;
    this._autoFaceCounts = 0;
    this._autoFaceRandom = false;
    this._autoFaceCounts_1 = 0;
    this._autoFaceSpeed = 10;
    this._autoFaceNameCounts = 0;
    this._beidacishu = 0;
    this._autoType = null;
    const actor = $gameParty.allMembers()[0]
    actor.equipLayerStart();
};

Scene_Battle.prototype.createPetSpriteset = function () {
    if (!$gameSystem._armorDurability) {
        $gameSystem._armorDurability = [];
        for (let i = 0; i < $dataArmors.length; i++) {
            $gameSystem._armorDurability[i] = 0;
            // if ($dataArmors[i] && $dataArmors[i].meta.菜单立绘换装) {
            //     $gameSystem._armorDurability[i] = 0;
            // }
            // else {
            //     $gameSystem._armorDurability[i] = null;
            // }
        };
    };
    const x = 1000;
    const y = 720;
    /*主体*/
    this._mainBattleSprite = new Sprite_BattlePicture();
    this.addChild(this._mainBattleSprite);
    this._mainBattleSprite.x = x;
    this._mainBattleSprite.y = y;
    /*临时*/
    $gameTemp._onCommanding = this._onCommanding;
    this.createPetHudSpriteset();
}

Scene_Battle.prototype.isActorStates = function (type) {
    this._autoType = type;
};

Cat.BattlePicture.Scene_Battle_commandAttack = Scene_Battle.prototype.commandAttack;
Scene_Battle.prototype.commandAttack = function () {
    if (BattleManager.actor()._actorId == 1) {
        $gameTemp._onCommanding = true;
        this.isActorStates('战斗');
    }
    Cat.BattlePicture.Scene_Battle_commandAttack.call(this)
};

Cat.BattlePicture.Scene_Battle_commandSkill = Scene_Battle.prototype.commandSkill
Scene_Battle.prototype.commandSkill = function () {
    if (BattleManager.actor()._actorId == 1) {
        $gameTemp._onCommanding = true;
        this.isActorStates('施法');
    }
    Cat.BattlePicture.Scene_Battle_commandSkill.call(this);
};

Cat.BattlePicture.Scene_Battle_commandGuard = Scene_Battle.prototype.commandGuard;
Scene_Battle.prototype.commandGuard = function () {
    if (BattleManager.actor()._actorId == 1) {
        $gameTemp._onCommanding = true;
        this.isActorStates('防御');
    }
    Cat.BattlePicture.Scene_Battle_commandGuard.call(this);
};

Scene_Battle.prototype.isHpBattleSprite = function () {
    this.isActorStates('待机');
};

Cat.BattlePicture.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function () {
    Cat.BattlePicture.Scene_Battle_update.call(this);
    if ($gameTemp._onCommanding == false) {
        this.isHpBattleSprite();
    }
    if (this._mainBattleSprite) {
        this._breatheBattleCount++;
        //  if (this._autoType == '待机') {
        if (this._breatheBattleCount < 61) {
            this._mainBattleSprite.scale.y += 0.0002;
        } else if (this._breatheBattleCount > 60 && this._breatheBattleCount <= 120) {
            this._mainBattleSprite.scale.y -= 0.0002;
        } else {
            this._mainBattleSprite.scale.y = 1;
            this._breatheBattleCount = 0;
        };
        // } else {
        //     if (this._breatheBattleCount < 61) {
        //         this._mainBattleSprite.scale.x += 0.0002;
        //     } else if (this._breatheBattleCount > 60 && this._breatheBattleCount <= 120) {
        //         this._mainBattleSprite.scale.x -= 0.0002;
        //     } else {
        //         this._mainBattleSprite.scale.x = 1;
        //         this._breatheBattleCount = 0;
        //     };
        // }

        //wolfzq追加，如果角色死亡，则
        var actor = this._mainBattleSprite._actor;
        if (actor) {
            if (actor.isDead()) {
                if (this._mainBattleSprite.opacity > 0) this._mainBattleSprite.opacity -= 5;
            } else {
                if (this._mainBattleSprite.opacity < 255) this._mainBattleSprite.opacity += 5;
            };
        }
    };
    const switchs = $gameSwitches.value(FlyCat.LL_Battle.actorPictureSwitch);
    if (switchs == false || switchs == true) {
        this._mainBattleSprite.visible = !switchs;
    }
};

function Sprite_BattlePicture() {
    this.initialize(...arguments);
}

Sprite_BattlePicture.prototype = Object.create(Sprite.prototype);
Sprite_BattlePicture.prototype.constructor = Sprite_BattlePicture;

Sprite_BattlePicture.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};
Sprite_BattlePicture.prototype.initMembers = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._actor = $gameParty.allMembers()[0];
    // this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHST');
    this.createEquipSprite();
};
Sprite_BattlePicture.prototype.createEquipSprite = function () {
    this._equipSprite = new Sprite();
    this.addChild(this._equipSprite);
    const eop = $gameVariables.value(FlyCat.LL_MapPicture.equipVariable);
    for (let i = 1; i < Cat.BattlePicture.layer; i++) {
        const sprite = new Sprite_EquipPicture();
        sprite._id = i;
        this._equipSprite.addChild(sprite);
        if (i == 3 || i == 5 || i == 7) {
            sprite.opacity = eop;
        }
    };
};

function Sprite_EquipPicture() {
    this.initialize(...arguments);
}

Sprite_EquipPicture.prototype = Object.create(Sprite.prototype);
Sprite_EquipPicture.prototype.constructor = Sprite_EquipPicture;

Sprite_EquipPicture.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_EquipPicture.prototype.initMembers = function () {
    this._id = -1;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._actor = $gameParty.allMembers()[0];
    this._data = null;
    this._autoFaceCounts = 0;
    this._autoFaceRandom = false;
    this._autoFaceCounts_1 = 0;
    this._autoFaceSpeed = 10;
    this._autoFaceNameCounts = 0;
    this._beidacishu = 0;
};

Sprite_EquipPicture.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    this.updateData();
    this.updateBitmap();
};

Sprite_EquipPicture.prototype.updateData = function () {
    if (this._actor) {
        const data = this._actor._equipLayer;
        this._data = data[this._id] ? data[this._id] : null;
    } else {
        this._data = null;
    };
};

Sprite_EquipPicture.prototype.getEquipArmorDurability = function () {
    const lock = this._actor._equipArmorDurability[this._id];
    return lock;
};

Sprite_EquipPicture.prototype.getAutoType = function () {
    const autoType = SceneManager._scene._autoType;
    var value = 0;
    if (autoType == '待机') {
        var value = 1;
    } else if (autoType == '战斗') {
        var value = 2;
    } else if (autoType == '施法') {
        var value = 4;
    } else if (autoType == '防御') {
        var value = 3;
    } else if (autoType == '被打') {
        var value = 5;
    }
    return value;
};

Sprite_EquipPicture.prototype.updateBitmap = function () {
    if (this._data) {
        const img = this._data[0];
        if (this._data[2] && img) {//通用
            if (this._data[1] == false) {//无耐久
                this.bitmap = ImageManager.loadBitmap('img/battleImg/', img);
            } else {//有耐久
                const durability = this.ItemDurability();
                if (durability != '') {
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', img + durability);
                } else {
                    this.bitmap = ImageManager.loadBitmap();
                }
            };
        } else {//非指定图层
            if (img && this.getAutoType() != 5) {//4种形态
                if (this.getAutoType() > 0 && this._data[1] == false) {//无耐久
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', img + this.getAutoType());
                } else if (this.getAutoType() > 0 && this._data[1] == true) {//有耐久
                    const durability = this.ItemDurability();
                    if (durability != '') {
                        this.bitmap = ImageManager.loadBitmap('img/battleImg/', img + this.getAutoType() + '-' + durability);
                    } else {
                        this.bitmap = ImageManager.loadBitmap();
                    }
                } else {//直接贴图
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', img);
                };
            };
        }
    } else {
        const value = this.getAutoType();
        if (this._id == 6) {//右手
            if (value != 5) {
                if (value > 0) {
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHYS' + value);
                } else {
                    this.bitmap = ImageManager.loadBitmap();
                }
            }
        } else if (this._id == 10) {//武器
            if (value != 5) {
                if (value > 0) {
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHWQ' + value);
                } else {
                    this.bitmap = ImageManager.loadBitmap();
                }
            };
        } else if (this._id == 2) {//左手
            if (value != 5) {
                if (value > 0) {
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHZS' + value);
                } else {
                    this.bitmap = ImageManager.loadBitmap();
                }
            };
        } else if (this._id == 4) {
            this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHST');
        } else if (this._id == 12) {//刘海
            this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHLH1');
        } else if (this._id == 1) {
            this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHHF1');
        } else if (this._id == 13) {
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
                if (value == 1) {//待机
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHJYDJ');
                } else if (value == 2) {//战斗
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHJYGJ');
                } else if (value == 4) {//施法
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHJYSF');
                } else if (value == 3) {//防御
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHJYFY');
                }
            };
        } else if (this._id == 8) {
            if (value == 2) {//战斗
                this._beidacishu = 0;
                this._autoFaceCounts = 0;
                this._autoFaceRandom = false;
                this._autoFaceCounts_1 = 0;
                this._autoFaceSpeed = 10;
                this._autoFaceNameCounts = 0;
                if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {//发情
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHBQFQ1');
                } else {
                    this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHBQZC1');
                }
            } else if (value == 5) {//被打
                this._autoFaceCounts = 0;
                this._autoFaceRandom = false;
                this._autoFaceCounts_1 = 0;
                this._autoFaceSpeed = 10;
                this._autoFaceNameCounts = 0;
                this.bitmap = ImageManager.loadBitmap('img/battleImg/', 'ZDLHBQAD');
                this._beidacishu++;
                if (this._beidacishu >= 30) {
                    this._beidacishu = 0;
                    this._autoType = '待机';
                }
            } else if (value == 1) {//待机
                this._beidacishu = 0;
                this._autoFaceCounts++;
                if (!this._autoFaceRandom) {
                    if (this._autoFaceCounts >= this._autoFaceSpeed) {
                        var picture = 'ZDLHBQZC';
                        if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
                            if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {//发情
                                var picture = 'ZDLHBQRMFQ';
                            } else {
                                var picture = 'ZDLHBQRM';
                            }
                        } else {
                            if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {//发情
                                var picture = 'ZDLHBQFQ';
                            }
                        }
                        var img = picture + (this._autoFaceNameCounts + 1);
                        this.bitmap = ImageManager.loadBitmap('img/battleImg/', img);
                        this._autoFaceNameCounts++;
                        if (this._autoFaceNameCounts > 4) {
                            this._autoFaceNameCounts = 0;
                            const speed = Math.floor(Math.random() * 600);
                            this._autoFaceSpeed = speed < 120 ? 120 : speed;
                            this._autoFaceRandom = true;
                        }
                        this._autoFaceCounts = 0;
                    }
                } else {
                    if (this._autoFaceCounts >= this._autoFaceSpeed) {
                        this._autoFaceSpeed = 10;
                        this._autoFaceCounts = 0;
                        this._autoFaceRandom = false;
                    }
                }
            };
        } else {
            this.bitmap = ImageManager.loadBitmap();
        }
    };
};

Sprite_EquipPicture.prototype.ItemDurability = function () {
    const actor = $gameParty.allMembers()[0];
    this._actorArmor = null;
    if (actor._equips[1]._itemId) {
        const armor = $dataArmors[actor._equips[1]._itemId];
        this._actorArmor = armor;
    }
    return $we.breakClothLv(this._actorArmor);
};