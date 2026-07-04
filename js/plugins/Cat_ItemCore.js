//=============================================================================
// RPG Maker MZ - 独立物品
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<独立物品>
 * @author Cat
 * 
 * @param itemStartId
 * @text 独立物品起始ID
 * @type number
 * @desc 独立道具的最大数量（默认1000）
 * @default 1000
 * 
 * @param maxItem
 * @text 独立道具数量
 * @type number
 * @min 0
 * @desc 独立道具的最大数量（默认0）
 * @default 0
 * 
 * @param maxWeapon
 * @text 独立武器数量
 * @type number
 * @min 0
 * @desc 独立武器的最大数量（默认0）
 * @default 0
 * 
 * @param maxArmor
 * @text 独立护甲数量
 * @type number
 * @min 0
 * @desc 独立护甲的最大数量（默认0）
 * @default 0
 * 
 * @param itemParamSwitch
 * @text 独立物品属性随机开关
 * @desc （默认：关闭）
 * @type boolean
 * @default false
 * 
 * @param itemParamValue
 * @text 独立物品属性随机数值设置
 * @type number
 * @min 0
 * @desc 独立物品属性随机数值设置
 * @default 0
 * 
 * @help
 * 物品/装备/武器 备注：
 * 非独立物品：
 * <noAlonItems>
 * <非独立物品>
 * 随机数值<randomNumber:x>
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_ItemCore = true;

var Cat = Cat || {};
Cat.ItemCore = {};
Cat.ItemCore.parameters = PluginManager.parameters('Cat_ItemCore');
Cat.ItemCore.AloneItemStartId = Number(Cat.ItemCore.parameters['itemStartId'] || 1000);
Cat.ItemCore.MaxAloneItems = Number(Cat.ItemCore.parameters['maxItem'] || 0);
Cat.ItemCore.MaxAloneWeapons = Number(Cat.ItemCore.parameters['maxWeapon'] || 0);
Cat.ItemCore.MaxAloneArmors = Number(Cat.ItemCore.parameters['maxArmor'] || 0);
Cat.ItemCore.RandomNumberSwitch = Cat.ItemCore.parameters['itemParamSwitch'] === 'true';
Cat.ItemCore.RandomNumber = Number(Cat.ItemCore.parameters['itemParamValue'] || 0);

Cat.ItemCore.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function () {
    Cat.ItemCore.DataManager_isDatabaseLoaded.call(this)
    if (!Cat.ItemCore.DataManager_isDatabaseLoaded.call(this)) return false;
    if (!Cat.ItemCore._loadAlone) {
        this.GetDataItemLength();
        this.ProcessingData($dataItems);
        this.ProcessingData($dataWeapons);
        this.ProcessingData($dataArmors);
        this.ProcessingData($dataSkills);
        Cat.ItemCore._loadAlone = true;
    }
    return true;
};

DataManager.ProcessingData = function (data) {
    if (data == $dataSkills) {
        for (let i = 1; i < data.length; i++) {
            const item = data[i];
            item.randomNumber = Cat.ItemCore.RandomNumber;
            item.color = 0;
            const note = item.meta;
            if (note.color) { item.color = Number(note.color); }
        }
    }
    else {
        for (let i = 1; i < data.length; i++) {
            const item = data[i];
            item.randomNumber = Cat.ItemCore.RandomNumber;
            item.color = 0;
            item.iconIndex;
            item.intensify = 0;
            item.prefix = "";
            item.noAlonItems = false;
            item._skillname = [];
            const note = item.meta;
            if (note.color) { item.color = Number(note.color); }
            if (note.noAlonItems || note.非独立物品) { item.noAlonItems = true; }
            if (note.randomNumber) {
                item.randomNumber = item.meta.randomNumber;
            }
            item._intensifyParam = [0, 0, 0, 0, 0, 0, 0, 0]
            if (note.强化属性) {
                const meta = note.强化属性.split(',');
                for (let i = 0; i < meta.length; i += 2) {
                    if (meta[i] >= 0) {
                        item._intensifyParam[Number(meta[i])] = Number(meta[i + 1]);
                    }
                }
            }
            DataManager.getIntensifyData(item);
        }
    }
};

DataManager.getIntensifyData = function (item) {
    item._intensifyLevelData = [];
    item._intensifyLevelGold = [];
    for (let i = 0; i < 10; i++) {
        item._intensifyLevelData[i] = [];
        item._intensifyLevelGold[i] = (i + 1) * 100;
    }
    if (item.note.match(/<强化材料>\n([\s\S]+?)\n<\/强化材料>/i)) {
        var data = RegExp.$1.split(/\n/);
        data.forEach(line => {
            if (line.match(/等级[ ](.*)/i)) {
                const meta = RegExp.$1.split(' ');
                const level = Number(meta[0]);
                const itemId_1 = meta[2] ? Number(meta[2]) : null;
                const itemNumber_1 = meta[3] ? Number(meta[3]) : null;
                const itemId_2 = meta[4] ? Number(meta[4]) : null;
                const itemNumber_2 = meta[5] ? Number(meta[5]) : null;
                if (itemId_2) {
                    item._intensifyLevelData[level - 1] = [[itemId_1, itemNumber_1], [itemId_2, itemNumber_2]]
                } else {
                    item._intensifyLevelData[level - 1] = [[itemId_1, itemNumber_1]];
                }
                if (meta[1]) {
                    const gold = Number(meta[1]);
                    item._intensifyLevelGold[level - 1] = gold;
                }
            }
        })
    };
};


DataManager.GetDataItemLength = function () {
    this._ItemsLength = $dataItems.length;
    this._WeaponsLength = $dataWeapons.length;
    this._ArmorsLength = $dataArmors.length;
};

DataManager.extractSaveContents = function (contents) {
    $gameSystem = contents.system;
    $gameScreen = contents.screen;
    $gameTimer = contents.timer;
    $gameSwitches = contents.switches;
    $gameVariables = contents.variables;
    $gameSelfSwitches = contents.selfSwitches;
    $gameActors = contents.actors;
    $gameParty = contents.party;
    $gameMap = contents.map;
    $gamePlayer = contents.player;
    this._aloneItems = contents.items || [];
    this._aloneWeapons = contents.weapons || [];
    this._aloneArmors = contents.armors || [];
    this.loadAloneItems();
};

DataManager.loadAloneItems = function () {
    if (Cat.ItemCore.MaxAloneItems > 0) {
        const independentItems = $dataItems.length - DataManager._ItemsLength;
        $dataItems.splice(DataManager._ItemsLength, independentItems);
        this.SetDataItemLength($dataItems);
        $dataItems = $dataItems.concat(this._aloneItems);
    }
    if (Cat.ItemCore.MaxAloneWeapons > 0) {
        const independentWeapon = $dataWeapons.length - DataManager._WeaponsLength;
        $dataWeapons.splice(DataManager._WeaponsLength, independentWeapon);
        this.SetDataItemLength($dataWeapons);
        $dataWeapons = $dataWeapons.concat(this._aloneWeapons);
    }
    if (Cat.ItemCore.MaxAloneArmors > 0) {
        const independentArmors = $dataArmors.length - DataManager._ArmorsLength;
        $dataArmors.splice(DataManager._ArmorsLength, independentArmors);
        this.SetDataItemLength($dataArmors);
        $dataArmors = $dataArmors.concat(this._aloneArmors);
    }
}

DataManager.SetDataItemLength = function (data) {
    for (; ;) {
        if (data.length > Cat.ItemCore.AloneItemStartId) break;
        data.push(null);
    }
}

Cat.ItemCore.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    Cat.ItemCore.DataManager_createGameObjects.call(this);
    this.createAloneObjects();
};

DataManager.createAloneObjects = function () {
    DataManager.createAloneItemArray();
    this.loadAloneItems();
}

DataManager.createAloneItemArray = function () {
    this._aloneItems = [];
    this._aloneWeapons = [];
    this._aloneArmors = [];
};

DataManager.makeSaveContents = function () {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    const contents = {};
    contents.system = $gameSystem;
    contents.screen = $gameScreen;
    contents.timer = $gameTimer;
    contents.switches = $gameSwitches;
    contents.variables = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors = $gameActors;
    contents.party = $gameParty;
    contents.map = $gameMap;
    contents.player = $gamePlayer;
    contents.items = this._aloneItems;
    contents.weapons = this._aloneWeapons;
    contents.armors = this._aloneArmors;
    return contents;
};

DataManager.isAloneItems = function (item) {
    if (!item) return false;//如果没有物品
    if (DataManager.isBattleTest()) return false;//如果战斗测试
    if (item.noAlonItems) return false;//如果是非独立物品
    if (DataManager.isItem(item)) return Cat.ItemCore.MaxAloneItems > 0;//如果是道具
    if (DataManager.isWeapon(item)) return Cat.ItemCore.MaxAloneWeapons > 0;//如果是武器
    if (DataManager.isArmor(item)) return Cat.ItemCore.MaxAloneArmors > 0;//如果是护甲
    return false;
};

DataManager.addNewItem = function (item) {
    if (!this.NewItemId(item)) return item;
    const newItem = JsonEx.makeDeepCopy(item);
    this.addNewAplonItem(item, newItem);
    return newItem;
};

DataManager.NewItemId = function (item) {
    if (!item) return false;
    if (item.baseItemId) return false;
    return item.id === this.getDataType(item).indexOf(item);
};

DataManager.getDataType = function (item) {
    if (!item) return [];
    if (DataManager.isItem(item)) return $dataItems;
    if (DataManager.isWeapon(item)) return $dataWeapons;
    if (DataManager.isArmor(item)) return $dataArmors;
    return [];
};

DataManager.addNewAplonItem = function (baseItem, newItem) {
    newItem.id = this.getDataType(baseItem).length;
    ItemManager.setNewAplonItem(baseItem, newItem);
    ItemManager.customizeNewIndependentItem(baseItem, newItem);
    this.getDataType(baseItem).push(newItem);
    this.getContainer(baseItem).push(newItem);
};

DataManager.getContainer = function (item) {
    if (!item) return [];
    if (DataManager.isItem(item)) return this._aloneItems;
    if (DataManager.isWeapon(item)) return this._aloneWeapons;
    if (DataManager.isArmor(item)) return this._aloneArmors;
    return [];
};

DataManager.removeAplonItem = function (item) {
    if (!item) return;
    if (this.AplonItemIsUsed(item)) return;
    const container = this.getContainer(item);
    const database = this.getDataType(item);
    const index = container.indexOf(item);
    container[index] = null;
    const index_1 = database.indexOf(item);
    database[index_1] = null;
};

DataManager.AplonItemIsUsed = function (item) {
    if ($gameParty.numItems(item) > 0) return false;
    for (var i = 0; i < $dataActors.length; ++i) {
        const actor = $gameActors.actor(i);
        if (!actor) continue;
        if (actor.equips().contains(item)) return true;
    }
    return false;
};

DataManager.getBaseItem = function (item) {
    if (!this.isAloneItems(item)) return item;
    if (!item.baseItemId) return item;
    var baseItemId = item.baseItemId;
    var baseItem = this.getDataType(item)[baseItemId];
    return baseItem;
};

function ItemManager() {
    throw new Error("This is a static class");
}

ItemManager.setNewAplonItem = function (baseItem, newItem) {
    newItem.baseItemId = baseItem.id;
    newItem.baseItemName = baseItem.name;
    newItem.baseItemPrice = baseItem.price;
    newItem.baseItemIconIndex = baseItem.iconIndex;
};

ItemManager.customizeNewIndependentItem = function (baseItem, newItem) {
    this.randomizeInitialItem(baseItem, newItem);
    this.updateItemName(newItem);
};

ItemManager.randomizeInitialItem = function (baseItem, newItem) {
    if (Cat.ItemCore.RandomNumberSwitch == false) { return; }
    if (DataManager.isItem(baseItem)) {
        this.randomizeInitialEffects(baseItem, newItem);
    }
    else {
        this.randomizeInitialStats(baseItem, newItem);
    }
};

ItemManager.randomizeInitialEffects = function (baseItem, newItem) {
    if (baseItem.randomNumber <= 0) return;
    var randomValue = baseItem.randomNumber * 2 + 1;
    var offset = baseItem.randomNumber;
    newItem.effects.forEach(function (effect) {
        if (effect.code === Game_Action.EFFECT_RECOVER_HP) {
            if (effect.value1 !== 0) {
                var boost = Math.floor(Math.random() * randomValue - offset);
                effect.value1 += boost * 0.01;
                effect.value1 = parseFloat(effect.value1.toFixed(2));
                effect.value1 = effect.value1.clamp(0, 1);
            }
            if (effect.value2 !== 0) {
                effect.value2 += Math.floor(Math.random() * randomValue - offset);
            }
        }
        if (effect.code === Game_Action.EFFECT_RECOVER_MP) {
            if (effect.value1 !== 0) {
                var boost = Math.floor(Math.random() * randomValue - offset);
                effect.value1 += boost * 0.01;
                effect.value1 = parseFloat(effect.value1.toFixed(2));
                effect.value1 = effect.value1.clamp(0, 1);
            }
            if (effect.value2 !== 0) {
                effect.value2 += Math.floor(Math.random() * randomValue - offset);
            }
        }
    }, this);
};

ItemManager.randomizeInitialStats = function (baseItem, newItem) {
    if (baseItem.randomNumber <= 0) return;
    var randomValue = baseItem.randomNumber * 2 + 1;
    var offset = baseItem.randomNumber;
    for (var i = 0; i < 8; ++i) {
        if (newItem.params[i] === 0) continue;
        newItem.params[i] += Math.floor(Math.random() * randomValue - offset);
        if (baseItem.params[i] >= 0) {
            newItem.params[i] = Math.max(newItem.params[i], 0);
        }
    }
};

ItemManager.updateItemName = function (item) {
    //////法宝系统///////
    const level = item.intensify;
    const Oldname = item.baseItemName;
    // if (item.prefix == undefined) {
    //     item.prefix = '';
    // }
    var prefix = item.prefix;
    //////法宝系统///////////
    item.name = prefix + Oldname;
};

ItemManager.updateBoostItemName = function (item) {
    const itemUpcounts = item.intensify;
    const Oldname = item.baseItemName;
    var max = 10;
    if (item.meta.强化上限) {
        var max = Number(item.meta.强化上限)
    }
    if (itemUpcounts >= max) {
        var text = 'Max';
    } else {
        var text = '+' + itemUpcounts;
    }
    item.name = Oldname + '(' + text + ')';
};

Cat.ItemCore.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function (actorId) {
    Cat.ItemCore.Game_Actor_setup.call(this, actorId);
    if ($gameTemp._initializeStartingMemberEquipment) return;
    this.intAloneEquips($dataActors[actorId].equips);
};

Game_Actor.prototype.intAloneEquips = function (equips) {
    var equips = this.ConvertEquips(equips);
    this.AloneEquips(equips);
    this.releaseUnequippableItems(true);
    this.recoverAll();
    this.refresh();
};

Game_Actor.prototype.ConvertEquips = function (equips) {
    const items = [];
    for (var i = 0; i < equips.length; ++i) {
        const equipId = equips[i];
        if (equipId <= 0) continue;
        const equipType = $dataSystem.equipTypes[i + 1];
        if (equipType === $dataSystem.equipTypes[1] ||
            (i === 1 && this.isDualWield())) {
            var equip = $dataWeapons[equipId];
        } else {
            var equip = $dataArmors[equipId];
        }
        items.push(equip);
    }
    return items;
};

Game_Actor.prototype.AloneEquips = function (equips) {
    const slots = this.equipSlots();
    const maxSlots = slots.length;
    this._equips = [];
    for (var i = 0; i < maxSlots; ++i) {
        this._equips[i] = new Game_Item();
    }
    for (var i = 0; i < maxSlots; ++i) {
        const slotType = slots[i];
        const equip = this.GetInitializeEquips(equips, slotType);
        if (DataManager.isAloneItems(equip) && this.canEquip(equip)) {
            const array = $gameParty.gainAplonItem(equip, 1)
            if (array instanceof Array) {
                var newItem = array[0];
                this.changeEquip(i, newItem);
            }
        } else if (this.canEquip(equip)) {
            this._equips[i].setObject(equip);
        }
    }
};

Game_Actor.prototype.GetInitializeEquips = function (equips, slotType) {
    var item = null;
    for (var i = 0; i < equips.length; ++i) {
        const equip = equips[i];
        if (!equip) continue;
        if (slotType === 1 && DataManager.isWeapon(equip)) {
            item = equip;
            break;
        } else if (equip.etypeId === slotType) {
            item = equip;
            break;
        }
    }
    if (item) equips[i] = null;
    return item;
};

Cat.ItemCore.Game_Actor_hasWeapon = Game_Actor.prototype.hasWeapon;
Game_Actor.prototype.hasWeapon = function (weapon) {
    if (this.hasBaseItem(weapon)) return true;
    return Cat.ItemCore.Game_Actor_hasWeapon.call(this, weapon);
};

Cat.ItemCore.Game_Actor_hasArmor = Game_Actor.prototype.hasArmor;
Game_Actor.prototype.hasArmor = function (armor) {
    if (this.hasBaseItem(armor)) return true;
    return Cat.ItemCore.Game_Actor_hasArmor.call(this, armor);
};

Game_Actor.prototype.hasBaseItem = function (baseItem) {
    if (!DataManager.isAloneItems(baseItem)) return false;
    var type = (DataManager.isWeapon(baseItem)) ? 'weapon' : 'armor';
    for (var i = 0; i < this.equips().length; ++i) {
        var equip = this.equips()[i];
        if (!equip) continue;
        if (!equip.baseItemId) continue;
        if (DataManager.isWeapon(equip) && type === 'weapon') {
            if (equip.baseItemId === baseItem.id) return true;
        } else if (DataManager.isArmor(equip) && type === 'armor') {
            if (equip.baseItemId === baseItem.id) return true;
        }
    }
    return false;
};

Cat.ItemCore.Game_Actor_changeEquipById = Game_Actor.prototype.changeEquipById;
Game_Actor.prototype.changeEquipById = function (etypeId, itemId) {
    if (itemId > 0) {
        var slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            var baseItem = $dataWeapons[itemId];
        } else {
            var baseItem = $dataArmors[itemId];
        }
        if (!$gameParty.hasItem(baseItem)) {
            $gameParty.gainItem(baseItem, 1);
        }
        if (DataManager.isAloneItems(baseItem)) {
            if (this.hasBaseItem(baseItem)) return;
            var item = $gameParty.getMatchingBaseItem(baseItem, false);
            if (item === null) {

                $gameParty.gainItem(baseItem, 1);

                item = $gameParty.getMatchingBaseItem(baseItem, false);
            }
            this.changeEquip(slotId, item);
            return;
        }
    }
    Cat.ItemCore.Game_Actor_changeEquipById.call(this, etypeId, itemId)
};

Game_Actor.prototype.unequipItem = function (item) {
    for (var i = 0; i < this.equips().length; ++i) {
        var equip = this.equips()[i];
        if (!equip) continue;
        if (equip !== item) continue;
        this.changeEquip(i, null);
    }
};

Cat.ItemCore.Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
Game_Party.prototype.setupStartingMembers = function () {
    Cat.ItemCore.Game_Party_setupStartingMembers.call(this);
    this.initActorEquips();
};

Game_Party.prototype.initActorEquips = function () {
    $gameTemp._initializeStartingMemberEquipment = true;
    for (var i = 0; i < $dataActors.length; ++i) {
        var actor = $gameActors.actor(i);
        if (actor) {
            var baseActor = $dataActors[i];
            actor.intAloneEquips(baseActor.equips);
        }
    }
    $gameTemp._initializeStartingMemberEquipment = undefined;
};


Cat.ItemCore.Game_Party_gainItem = Game_Party.prototype.gainItem;
Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
    if (DataManager.isAloneItems(item)) {
        this.gainAplonItem(item, amount, includeEquip);
    } else {
        Cat.ItemCore.Game_Party_gainItem.call(this, item, amount, includeEquip);
    }
};

Game_Party.prototype.gainAplonItem = function (item, amount, includeEquip) {
    var arr = [];
    if (amount > 0) {
        for (var i = 0; i < amount; ++i) {
            var newItem = DataManager.addNewItem(item);
            this.registerNewItem(item, newItem);
            arr.push(newItem);
        }
    } else if (amount < 0) {
        amount = Math.abs(amount);
        for (var i = 0; i < amount; ++i) {
            if (item.baseItemId) {
                this.removeAplonItem(item, includeEquip);
            } else if (DataManager.isAloneItems(item)) {
                var target = $gameParty.getMatchingBaseItem(item, includeEquip);
                if (target !== null) this.removeAplonItem(target, includeEquip);
            } else {
                this.removeBaseItem(item, includeEquip);
            }
        }
    }
    return arr;
};

Game_Party.prototype.removeBaseItem = function (item, includeEquip) {
    var container = this.itemContainer(item);
    container[item.id]--;
    if (container[item.id] <= 0) delete container[item.id];
    if (includeEquip) this.discardMembersEquip(item, -1);
};

Game_Party.prototype.removeAplonItem = function (item, includeEquip) {
    if (includeEquip && this.checkItemIsEquipped(item)) {
        for (var i = 1; i < $gameActors._data.length; ++i) {
            var actor = $gameActors.actor(i);
            if (!actor) continue;
            if (!actor.equips().contains(item)) continue;
            actor.unequipItem(item);
        }
    }
    var container = this.itemContainer(item);
    container[item.id] = 0;
    if (container[item.id] <= 0) delete container[item.id];
};

Game_Party.prototype.registerNewItem = function (baseItem, newItem) {
    var container = this.itemContainer(baseItem);
    if (container) {
        var lastNumber = this.numItems(newItem);
        container[newItem.id] = 1;
    }
};

Game_Party.prototype.getMatchingBaseItem = function (baseItem, equipped) {
    if (!baseItem) return null;
    if (DataManager.isItem(baseItem)) var group = this.items();
    if (DataManager.isWeapon(baseItem)) var group = this.weapons();
    if (DataManager.isArmor(baseItem)) var group = this.armors();
    if (equipped) {
        for (var a = 0; a < this.members().length; ++a) {
            var actor = this.members()[a];
            if (!actor) continue;
            if (DataManager.isWeapon(baseItem)) {
                group = group.concat(actor.weapons());
            } else if (DataManager.isArmor(baseItem)) {
                group = group.concat(actor.armors());
            }
        }
    }
    var baseItemId = baseItem.id;
    for (var i = 0; i < group.length; ++i) {
        var item = group[i];
        if (!item) continue;
        if (!item.baseItemId) continue;
        if (item.baseItemId !== baseItemId) continue;
        return item;
    }
    return null;
};

Game_Party.prototype.checkItemIsEquipped = function (item) {
    for (var i = 1; i < $gameActors._data.length; ++i) {
        var actor = $gameActors.actor(i);
        if (!actor) continue;
        if (actor.equips().contains(item)) return true;
    }
    return false;
};

Game_Party.prototype.getAloneItemTypeMax = function (item) {
    if (!item) return 0;
    if (DataManager.isItem(item)) return Cat.ItemCore.MaxAloneItems;
    if (DataManager.isWeapon(item)) return Cat.ItemCore.MaxAloneWeapons;
    if (DataManager.isArmor(item)) return Cat.ItemCore.MaxAloneArmors;
};

Game_Party.prototype.getAloneItemTypeCur = function (item) {
    if (!item) return 0;
    if (DataManager.isItem(item)) return this.items().length;
    if (DataManager.isWeapon(item)) return this.weapons().length;
    if (DataManager.isArmor(item)) return this.armors().length;
};

Cat.ItemCore.Game_Party_items = Game_Party.prototype.items;
Game_Party.prototype.items = function () {
    var results = Cat.ItemCore.Game_Party_items.call(this);
    results.sort(this.AloneItemSort);
    return results;
};

Cat.ItemCore.Game_Party_weapons = Game_Party.prototype.weapons;
Game_Party.prototype.weapons = function () {
    var results = Cat.ItemCore.Game_Party_weapons.call(this);
    results.sort(this.AloneItemSort);
    return results;
};

Cat.ItemCore.Game_Party_armors = Game_Party.prototype.armors;
Game_Party.prototype.armors = function () {
    var results = Cat.ItemCore.Game_Party_armors.call(this);
    results.sort(this.AloneItemSort);
    return results;
};

Game_Party.prototype.AloneItemSort = function (a, b) {
    var aa = (a.baseItemId) ? a.baseItemId : a.id;
    var bb = (b.baseItemId) ? b.baseItemId : b.id;
    if (aa < bb) return -1;
    if (aa >= bb) return 1;
    return 0;
};

Cat.ItemCore.Game_Party_hasItem = Game_Party.prototype.hasItem;
Game_Party.prototype.hasItem = function (item, includeEquip) {
    if (DataManager.isAloneItems(item)) {
        if (this.numIndependentItems(item) > 0) return true;
    }
    return Cat.ItemCore.Game_Party_hasItem.call(this, item, includeEquip);
};

Cat.ItemCore.Game_Party_isAnyMemberEquipped = Game_Party.prototype.isAnyMemberEquipped;
Game_Party.prototype.isAnyMemberEquipped = function (item) {
    if (DataManager.isAloneItems(item)) {
        for (var i = 0; i < this.members().length; ++i) {
            var actor = this.members()[i];
            if (!actor) continue;
            if (actor.hasBaseItem(item)) return true;
        }
    }
    return Cat.ItemCore.Game_Party_isAnyMemberEquipped.call(this, item);
};

Game_Party.prototype.numIndependentItems = function (baseItem) {
    var value = 0;
    if (!DataManager.isAloneItems(baseItem)) return this.numItems(baseItem);
    var id = baseItem.id;
    if (DataManager.isItem(baseItem)) var group = this.items();
    if (DataManager.isWeapon(baseItem)) var group = this.weapons();
    if (DataManager.isArmor(baseItem)) var group = this.armors();
    for (var i = 0; i < group.length; ++i) {
        var item = group[i];
        if (!item) continue;
        if (item.baseItemId && item.baseItemId === id) value += 1;
    }
    return value;
};

Game_Party.prototype.clearAllMatchingBaseItems = function (baseItem, equipped) {
    if (!Imported.YEP_ItemCore) return;
    for (; ;) {
        var item = this.getMatchingBaseItem(baseItem, equipped);
        if (item) {
            this.removeAplonItem(item, equipped);
            DataManager.removeAplonItem(item);
        } else {
            break;
        }
    }
};

Cat.ItemCore.Game_Interpreter_gameDataOperand = Game_Interpreter.prototype.gameDataOperand;
Game_Interpreter.prototype.gameDataOperand = function (type, param1, param2) {
    switch (type) {
        case 0:
            return $gameParty.numIndependentItems($dataItems[param1]);
            break;
        case 1:
            return $gameParty.numIndependentItems($dataWeapons[param1]);
            break;
        case 2:
            return $gameParty.numIndependentItems($dataArmors[param1]);
            break;
        default:
            return Cat.ItemCore.Game_Interpreter_gameDataOperand.call(this, type, param1, param2);
            break;
    }
};

Cat.ItemCore.Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
Window_ShopStatus.prototype.drawPossession = function (x, y) {
    if (DataManager.isAloneItems(this._item)) {
        return this.drawIndependentPossession(x, y);
    }
    Cat.ItemCore.Window_ShopStatus_drawPossession.call(this, x, y);
};

Window_ShopStatus.prototype.drawIndependentPossession = function (x, y) {
    var width = this.contents.width - this.itemPadding() - x;
    var baseItem = DataManager.getBaseItem(this._item);
    var value = $gameParty.numIndependentItems(baseItem);
    var possessionWidth = this.textWidth(value);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.possession, x, y, width - possessionWidth);
    this.resetTextColor();
    this.drawText(value, x, y, width, 'right');
};

Cat.ItemCore.Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
Window_ShopBuy.prototype.isEnabled = function (item) {
    if (DataManager.isAloneItems(item)) {
        var typeMax = $gameParty.getAloneItemTypeMax(item);
        var typeCur = $gameParty.getAloneItemTypeCur(item);
        if (typeCur >= typeMax) return false;
    }
    return Cat.ItemCore.Window_ShopBuy_isEnabled.call(this, item);
};


Cat.ItemCore.Scene_Equip_refreshActor = Scene_Equip.prototype.refreshActor;
Scene_Equip.prototype.refreshActor = function () {
    this.actor().releaseUnequippableItems();
    Cat.ItemCore.Scene_Equip_refreshActor.call(this);
};

Cat.ItemCore.Scene_Shop_doSell = Scene_Shop.prototype.doSell;
Scene_Shop.prototype.doSell = function (number) {
    Cat.ItemCore.Scene_Shop_doSell.call(this, number);
    if (!DataManager.isAloneItems(this._item)) return;
    DataManager.removeAplonItem(this._item);
};

