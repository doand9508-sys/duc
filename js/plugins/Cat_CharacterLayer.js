//=============================================================================
// RPG Maker MZ - CharacterLayer
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 <Cat-CharacterLayer>
 * @author Cat
 * 
 * @param backLayer
 * @text 本体后图层
 * @desc 本体后图层
 * @type nubmer
 * @default 10
 * 
 * @param forLayer
 * @text 本体前图层
 * @desc 本体前图层
 * @type nubmer
 * @default 11
 * 
 * @param layerBack
 * @text 本体背景分类设置
 * @desc 1号空白处为强制占用的后发
 * @type string[]
 * @default ["","法相环","飘带"]
 * 
 * @param layerFor
 * @text 本体前景分类设置
 * @desc 2号空白处为强制占用的表情
 * @type string[]
 * @default ["衣服","","头发","装饰品","侮辱文字装饰"]
 * 
 * @command openCharacterScene
 * @text 打开换装界面
 * @desc 打开换装界面
 * 
 * @command setForCharacter
 * @text 强制设置行走图前景图层
 * @desc 强制设置行走图前景图层
 * 
 * @arg layerId
 * @type number
 * @default 
 * @text 图层id
 * @desc 图层id
 * 
 * @arg actorId
 * @type actor
 * @default 1
 * @text 选择角色Id
 * @desc 选择角色Id
 * 
 * @arg itemId
 * @type item
 * @default 0
 * @text 衣服需要选择对应物品
 * @desc 衣服需要选择对应物品
 * 
 * @arg img
 * @text 行走图名称
 * @type string
 * 
 * @command setBackCharacter
 * @text 强制设置行走图背景图层
 * @desc 强制设置行走图背景图层
 * 
 * @arg layerId
 * @type number
 * @default 
 * @text 图层id
 * @desc 图层id
 * 
 * @arg actorId
 * @type actor
 * @default 1
 * @text 选择角色Id
 * @desc 选择角色Id
 * 
 * @arg img
 * @text 行走图名称
 * @type string
 * 
 * @command removeForCharacter
 * @text 强制删除行走图前景图层
 * @desc 强制删除行走图前景图层
 * 
 * @arg layerId
 * @type number
 * @default 
 * @text 图层id
 * @desc 图层id
 * 
 * @arg actorId
 * @type actor
 * @default 
 * @text 选择角色Id
 * @desc 选择角色Id
 * 
 * @command removeBackCharacter
 * @text 强制删除行走图背景图层
 * @desc 强制删除行走图背景图层
 * 
 * @arg layerId
 * @type number
 * @default 
 * @text 图层id
 * @desc 图层id
 * 
 * @arg actorId
 * @type actor
 * @default 
 * @text 选择角色Id
 * @desc 选择角色Id
 * 
 * @command characterVisible
 * @text 显示/隐藏行走图图层
 * @desc 显示/隐藏行走图图层
 * 
 * @arg actorId
 * @type actor
 * @default 1
 * @text 选择角色Id
 * @desc 选择角色Id
 * 
 * @arg visible
 * @type boolean
 * @on 显示
 * @off 隐藏
 * @default true
 * @text 显示/隐藏
 * @desc 显示/隐藏
 * 
 * @help
 * img/characters/characterLayer/
 * 注意：插件设置里的类型序号要跟下方备注的相同
 * 背景-1 后发(强制占用)
 * 前景-1 衣服
 * 前景-2 表情（强制占用）
 * 前景-3 头发
 * 有后发的范例：
 * <时装序列>
 * 背 1 $4h
 * 前 3 $4
 * </时装序列>
 * 没有后发的范例：
 * 立绘：
 * 背景-1法相
 * 背景-2后发（强制占用）
 * 前景-1表情（强制占用）
 * 前景-2头发
 * 前景-3淫文（强制占用）
 * 前景-4白灼（强制占用）
 * 前景-5衣服
 * 前景-6怀孕）（强制占用）
 * 前景-7怀孕肚子（强制占用）
 * <时装序列>
 * 背 1 
 * 前 3 $4
 * 立绘前 2 f1
 * 立绘背 2 f1h
 * </时装序列>
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_CharacterLayer = true;

var Cat = Cat || {};
Cat.CharacterLayer = {};
Cat.CharacterLayer.parameters = PluginManager.parameters('Cat_CharacterLayer');
Cat.CharacterLayer.backLayer = Number(Cat.CharacterLayer.parameters['backLayer'] || 10);
Cat.CharacterLayer.forLayer = Number(Cat.CharacterLayer.parameters['forLayer'] || 10);
Cat.CharacterLayer.layerBack = eval(Cat.CharacterLayer.parameters['layerBack'] || ["法相环", "飘带", "后发"]);
Cat.CharacterLayer.layerFor = eval(Cat.CharacterLayer.parameters['layerFor'] || ["装饰品", "侮辱文字装饰", "衣服", "表情", "前发"]);

ImageManager.loadCharacterLayer = function (filename) {
    return this.loadBitmap("img/characters/characterLayer/", filename);
};

PluginManager.registerCommand('Cat_CharacterLayer', 'openCharacterScene', args => {
    SceneManager.push(Scene_CharacterLayer);
});

PluginManager.registerCommand('Cat_CharacterLayer', 'setForCharacter', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    const itemId = Number(args.itemId)
    $gameActors.actor(actorId).setCharacterForLayer(layerId, img, itemId);
});

PluginManager.registerCommand('Cat_CharacterLayer', 'removeForCharacter', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).removeCharacterForLayer(layerId, img);
});

PluginManager.registerCommand('Cat_CharacterLayer', 'setBackCharacter', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).setCharacterBackLayer(layerId, img);
});

PluginManager.registerCommand('Cat_CharacterLayer', 'removeBackCharacter', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).removeCharacterBackLayer(layerId, img);
});

PluginManager.registerCommand('Cat_CharacterLayer', 'characterVisible', args => {
    const actorId = Number(args.actorId)
    const lock = eval(args.visible);
    $gameActors.actor(actorId)._characterVisible = lock;
});

Cat.CharacterLayer.Game_Party_changeEquipPicture = Game_Party.prototype.changeEquipPicture;
Game_Party.prototype.changeEquipPicture = function (item, actor) {
    Cat.CharacterLayer.Game_Party_changeEquipPicture.call(this, item, actor);
    actor.setCharacterImage('$newCharacterMain', 0);
};

Cat.CharacterLayer.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    Cat.CharacterLayer.Game_Actor_initMembers.call(this);
    this.equipForLayerStart();
    this.equipBackLayerStart();
    if (this._equipLayer == undefined) {
        this.equipLayerStart();
    };
    //this.getItemNote($dataItems[788], true);//默认788号物品战斗立绘
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

Game_Actor.prototype.equipForLayerStart = function () {
    if (this._equipLastForLayer == undefined) {
        this._equipLastForLayer = [];
        for (let i = 1; i < Cat.CharacterLayer.forLayer + 1; i++) {
            if (!this._equipLastForLayer[i]) {
                this._equipLastForLayer[i] = null;
            };
        };
    };
    if (this._equipForLayer == undefined) {
        this._equipForLayer = [];
        this._characterVisible = true;
        for (let i = 1; i < Cat.CharacterLayer.forLayer + 1; i++) {
            if (!this._equipForLayer[i]) {
                if (i == 3) {
                    this._equipForLayer[i] = '$f1';
                } else if (i == 1) {
                    this._equipForLayer[i] = '$y5';
                } else {
                    this._equipForLayer[i] = null;
                }
            };
        };
    };
};

Game_Actor.prototype.equipBackLayerStart = function () {
    if (this._equipLastBackLayer == undefined) {
        this._equipLastBackLayer = [];
        for (let i = 1; i < Cat.CharacterLayer.backLayer + 1; i++) {
            if (!this._equipLastBackLayer[i]) {
                this._equipLastBackLayer[i] = null;
            };
        };
    };
    if (this._equipBackLayer == undefined) {
        this._equipBackLayer = [];
        this._characterVisible = true;
        for (let i = 1; i < Cat.CharacterLayer.backLayer + 1; i++) {
            if (!this._equipBackLayer[i]) {
                if (i == 2) {
                    this._equipBackLayer[i] = '$f1h';
                } else {
                    this._equipBackLayer[i] = null;
                };
            };
        };
    };
};

Game_Actor.prototype.setCharacterForLayer = function (layerId, img, itemId) {
    this.equipForLayerStart();
    if (layerId > 0) {
        if (itemId && itemId > 0) {
            $gameTemp._selectTempEquipId = itemId;
        }
        this._equipForLayer[layerId] = img;
    };
};

Game_Actor.prototype.removeCharacterForLayer = function (layerId, img) {
    this.equipForLayerStart();
    if (layerId > 0) {
        this._equipForLayer[layerId] = null;
    };
};

Game_Actor.prototype.setCharacterBackLayer = function (layerId, img) {
    this.equipBackLayerStart();
    if (layerId > 0) {
        this._equipBackLayer[layerId] = img;
    };
};

Game_Actor.prototype.removeCharacterBackLayer = function (layerId, img) {
    this.equipBackLayerStart();
    if (layerId > 0) {
        this._equipBackLayer[layerId] = null;
    };
};

Spriteset_Map.prototype.createCharacters = function () {
    this._characterSprites = [];
    for (const event of $gameMap.events()) {
        this._characterSprites.push(new Sprite_Character(event));
    }
    for (const vehicle of $gameMap.vehicles()) {
        this._characterSprites.push(new Sprite_Character(vehicle));
    }
    for (const follower of $gamePlayer.followers().reverseData()) {
        this._characterSprites.push(new Sprite_Character(follower));
    }
    for (let i = 1; i < Cat.CharacterLayer.backLayer + 1; i++) {
        const characterSprite = new Sprite_Character_Back($gamePlayer, i);
        this._characterSprites.push(characterSprite);
    }
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (let i = 1; i < Cat.CharacterLayer.forLayer + 1; i++) {
        const characterSprite = new Sprite_Character_For($gamePlayer, i);
        this._characterSprites.push(characterSprite);
    }
    // this._characterSprites.push(new Sprite_Character_Base($gamePlayer));
    for (const sprite of this._characterSprites) {
        this._tilemap.addChild(sprite);
    }
};

Sprite_Balloon.prototype.updatePosition = function () {
    this.x = this._target.x;
    this.y = this._target.y - 48;
};

function Sprite_Character_ShowBase() {
    this.initialize(...arguments);
}

Sprite_Character_ShowBase.prototype = Object.create(Sprite.prototype);
Sprite_Character_ShowBase.prototype.constructor = Sprite_Character_ShowBase;

Sprite_Character_ShowBase.prototype.initialize = function (d) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(d);
    this.createBackSpriteCharacter(d);
    this.createSpriteCharacter(d);
    this.createForSpriteCharacter(d);
};

// Sprite_Character_ShowBase.prototype.update = function () {
//     Sprite.prototype.update.call(this);
//     this.updateVisibility();
// };

// Sprite_Character_ShowBase.prototype.updateVisibility = function () {
//     Sprite.prototype.updateVisibility.call(this);
//     if (this.isEmptyCharacter() || this._character.isTransparent()) {
//         this.visible = false;
//     }
// };

// Sprite_Character_ShowBase.prototype.isEmptyCharacter = function () {
//     return this._tileId === 0 && !this._characterName;
// };

Sprite_Character_ShowBase.prototype.initMembers = function (d) {
    this._z = 1;
    this._character = d;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._actor = $gameParty.allMembers()[0];
};

Sprite_Character_ShowBase.prototype.createSpriteCharacter = function (d) {
    this._characterSprite = new Sprite_Character_Animation(d);
    this._characterSprite.setFrame(0, 0, 0, 0);
    this.addChild(this._characterSprite);
};

Sprite_Character_ShowBase.prototype.createForSpriteCharacter = function (d) {
    for (let i = 1; i < Cat.CharacterLayer.forLayer + 1; i++) {
        const characterSprite = new Sprite_Character_Animation_For(i, d);
        characterSprite.setFrame(0, 0, 0, 0);
        this.addChild(characterSprite);
    }
};

Sprite_Character_ShowBase.prototype.createBackSpriteCharacter = function (d) {
    for (let i = 1; i < Cat.CharacterLayer.backLayer + 1; i++) {
        const characterSprite = new Sprite_Character_Animation_Back(i, d);
        characterSprite.setFrame(0, 0, 0, 0);
        this.addChild(characterSprite);
    }
};

function Sprite_Character_Base() {
    this.initialize(...arguments);
}

Sprite_Character_Base.prototype = Object.create(Sprite.prototype);
Sprite_Character_Base.prototype.constructor = Sprite_Character_Base;

Sprite_Character_Base.prototype.initialize = function (character) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);
    this.createBackSpriteCharacter();
    this.createSpriteCharacter();
    this.createForSpriteCharacter();
};

Sprite_Character_Base.prototype.isTile = function () {
    return this._character.isTile();
};

Sprite_Character_Base.prototype.isObjectCharacter = function () {
    return this._character.isObjectCharacter();
};

Sprite_Character_Base.prototype.checkCharacter = function (character) {
    return this._character === character;
};

Sprite_Character_Base.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    if (this._actor._characterVisible) {
        if (this._forList) {
            for (let index = 0; index < this._forList.length; index++) {
                const element = this._forList[index];
                if (element) {
                    element.visible = true;
                }
            }
        }
        if (this._backList) {
            for (let index = 0; index < this._backList.length; index++) {
                const element = this._backList[index];
                if (element) {
                    element.visible = true;
                }
            }
        }
    } else {
        if (this._forList) {
            for (let index = 0; index < this._forList.length; index++) {
                const element = this._forList[index];
                if (element) {
                    element.visible = false;
                }
            }
        }
        if (this._backList) {
            for (let index = 0; index < this._backList.length; index++) {
                const element = this._backList[index];
                if (element) {
                    element.visible = false;
                }
            }
        }
    }
    this.updateVisibility();
};


Sprite_Character_Base.prototype.updateVisibility = function () {
    Sprite.prototype.updateVisibility.call(this);
    if (this.isEmptyCharacter() || this._character.isTransparent()) {
        this.visible = false;
    }
};

Sprite_Character_Base.prototype.isEmptyCharacter = function () {
    return this._tileId === 0 && !this._characterName;
};

Sprite_Character_Base.prototype.initMembers = function () {
    this.z = 1;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
    this._forList = [];
    this._backList = [];
    this._actor = $gameParty.allMembers()[0];
};

Sprite_Character_Base.prototype.setCharacter = function (character) {
    this._character = character;
};

Sprite_Character_Base.prototype.createForSpriteCharacter = function () {
    for (let i = 1; i < Cat.CharacterLayer.forLayer + 1; i++) {
        const characterSprite = new Sprite_Character_For(this._character, i);
        this._forList[i] = characterSprite;
        this.addChild(characterSprite);
    }
};

Sprite_Character_Base.prototype.createBackSpriteCharacter = function () {
    for (let i = 1; i < Cat.CharacterLayer.backLayer + 1; i++) {
        const characterSprite = new Sprite_Character_Back(this._character, i);
        this._backList[i] = characterSprite;
        this.addChild(characterSprite);
    }
};

Sprite_Character_Base.prototype.createSpriteCharacter = function () {
    this._characterSprite = new Sprite_Character(this._character);
    this._characterSprite.setFrame(0, 0, 0, 0);
    this.addChild(this._characterSprite);
};

Cat.CharacterLayer.Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
Sprite_Character.prototype.initMembers = function () {
    Cat.CharacterLayer.Sprite_Character_initMembers.call(this);
    this._characterLayerActor = false;
};

function Sprite_Character_For() {
    this.initialize(...arguments);
}

Sprite_Character_For.prototype = Object.create(Sprite.prototype);
Sprite_Character_For.prototype.constructor = Sprite_Character_For;

Sprite_Character_For.prototype.initialize = function (character, id) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character, id);
    this.setFrame(0, 0, 0, 0);
};

Sprite_Character_For.prototype.initMembers = function () {
    this._forId = -1;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
    this._forImg = null;
};

Sprite_Character_For.prototype.setCharacter = function (character, id) {
    this._character = character;
    this._forId = id ? id : -1;
    this._actor = $gameParty.allMembers()[0];
    if (this._forId) {
        this._forImg = this._actor._equipForLayer[this._forId];
    }
};

Sprite_Character_For.prototype.checkCharacter = function (character) {
    return this._character === character;
};

Sprite_Character_For.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
    this.updateVisibility();
};

Sprite_Character_For.prototype.updateVisibility = function () {
    Sprite.prototype.updateVisibility.call(this);
    if (this.isEmptyCharacter() || this._character.isTransparent()) {
        this.visible = false;
    }
    if (this._character) {
        const x = this._character._x;
        const y = this._character._y;
        const value = $gameMap.regionId(x, y)
        if (value == FlyCat.AreaId.areaId && !$gamePlayer.isInVehicle()) {
            this.opacity = FlyCat.AreaId.opacity;
        }
    }
};

Sprite_Character_For.prototype.isTile = function () {
    return this._character.isTile();
};

Sprite_Character_For.prototype.isObjectCharacter = function () {
    return this._character.isObjectCharacter();
};

Sprite_Character_For.prototype.isEmptyCharacter = function () {
    return this._tileId === 0 && !this._characterName;
};

Sprite_Character_For.prototype.tilesetBitmap = function (tileId) {
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(tileId / 256);
    return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Character_For.prototype.updateBitmap = function () {
    if (this.isImageChanged()) {
        this._tilesetId = $gameMap.tilesetId();
        this._tileId = this._character.tileId();
        if (this._forId > 0) {
            if (this._forId == 1 && this._character && this._character instanceof Game_Player) {
                if ($gameParty.leader().isStateAffected(33)) {
                    //   console.log(this._actor._lastEquipForLayer)
                    if (!this._actor._lastEquipForLayer) {
                        this._actor._lastEquipForLayer = JsonEx.makeDeepCopy(this._actor._equipForLayer[this._forId]);
                    }
                    console.log(this._actor._lastEquipForLayer)
                    this._actor._equipForLayer[this._forId] = "";
                } else {
                    if (this._actor._lastEquipForLayer) {
                        //  console.log(this._actor._lastEquipForLayer)
                        if (this._actor._equipForLayer[this._forId] == "") {
                            this._actor._equipForLayer[this._forId] = this._actor._lastEquipForLayer;
                        }
                        //   console.log(this._actor._equipForLayer[this._forId])
                        this._actor._lastEquipForLayer = null;
                    }
                };
            }
            /*wolfzq修改机制，眼睛、头发和头合并在一起，红眼+v
            if (this._forId == 2) {
                if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
                    this._forImg = "$2";
                } else {
                    this._forImg = "$1";
                }
            } else {
                this._forImg = this._actor._equipForLayer[this._forId];
            }*/

            this._forImg = this._actor._equipForLayer[this._forId];
            if (this._forId == 3) {
                if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
                    this._forImg += "v";
                }
            }
        }
        this._characterName = this._forImg ? this._forImg : '' //this._character.characterName();
        this._characterIndex = this._character.characterIndex();
        if (this._tileId > 0) {
            this.setTileBitmap();
        } else {
            this.setCharacterBitmap();
        }
    }
};

Sprite_Character_For.prototype.isImageChanged = function () {
    return (
        this._tilesetId !== $gameMap.tilesetId() ||
        this._tileId !== this._character.tileId() ||
        this._forId >= 1
        // this._characterName !== this._character.characterName() ||
        // this._characterIndex !== this._character.characterIndex()
    );
};

Sprite_Character_For.prototype.setTileBitmap = function () {
    this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Character_For.prototype.setCharacterBitmap = function () {
    this.bitmap = ImageManager.loadCharacterLayer(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Character_For.prototype.updateFrame = function () {
    if (this._tileId > 0) {
        this.updateTileFrame();
    } else {
        this.updateCharacterFrame();
    }
};

Sprite_Character_For.prototype.updateTileFrame = function () {
    const tileId = this._tileId;
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_Character_For.prototype.updateCharacterFrame = function () {
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        const d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};

Sprite_Character_For.prototype.characterBlockX = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return (index % 4) * 3;
    }
};

Sprite_Character_For.prototype.characterBlockY = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};

Sprite_Character_For.prototype.characterPatternX = function () {
    return this._character.pattern();
};

Sprite_Character_For.prototype.characterPatternY = function () {
    return (this._character.direction() - 2) / 2;
};

Sprite_Character_For.prototype.patternWidth = function () {
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 12;
    }
};

Sprite_Character_For.prototype.patternHeight = function () {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};

Sprite_Character_For.prototype.updateHalfBodySprites = function () {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
        this._upperBody.blendMode = this.blendMode;
        this._lowerBody.blendMode = this.blendMode;
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};

Sprite_Character_For.prototype.createHalfBodySprites = function () {
    if (!this._upperBody) {
        this._upperBody = new Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};

Sprite_Character_For.prototype.updatePosition = function () {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};

Sprite_Character_For.prototype.updateOther = function () {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};

function Sprite_Character_Back() {
    this.initialize(...arguments);
}

Sprite_Character_Back.prototype = Object.create(Sprite.prototype);
Sprite_Character_Back.prototype.constructor = Sprite_Character_Back;

Sprite_Character_Back.prototype.initialize = function (character, id) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character, id);
    this.setFrame(0, 0, 0, 0);
};

Sprite_Character_Back.prototype.initMembers = function () {
    this._backId = -1;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
    this._backImg = null;
};

Sprite_Character_Back.prototype.setCharacter = function (character, id) {
    this._character = character;
    this._backId = id ? id : -1;
    this._actor = $gameParty.allMembers()[0];
    if (this._backId) {
        this._backImg = this._actor._equipBackLayer[this._backId];
    }
};

Sprite_Character_Back.prototype.checkCharacter = function (character) {
    return this._character === character;
};

Sprite_Character_Back.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
    this.updateVisibility();
};

Sprite_Character_Back.prototype.updateVisibility = function () {
    Sprite.prototype.updateVisibility.call(this);
    if (this.isEmptyCharacter() || this._character.isTransparent()) {
        this.visible = false;
    }
    if (this._character) {
        const x = this._character._x;
        const y = this._character._y;
        const value = $gameMap.regionId(x, y)
        if (value == FlyCat.AreaId.areaId && !$gamePlayer.isInVehicle()) {
            this.opacity = FlyCat.AreaId.opacity;
        }
    }
};

Sprite_Character_Back.prototype.isTile = function () {
    return this._character.isTile();
};

Sprite_Character_Back.prototype.isObjectCharacter = function () {
    return this._character.isObjectCharacter();
};

Sprite_Character_Back.prototype.isEmptyCharacter = function () {
    return this._tileId === 0 && !this._characterName;
};

Sprite_Character_Back.prototype.tilesetBitmap = function (tileId) {
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(tileId / 256);
    return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Character_Back.prototype.updateBitmap = function () {
    if (this.isImageChanged()) {
        this._tilesetId = $gameMap.tilesetId();
        this._tileId = this._character.tileId();
        if (this._backId) {
            this._backImg = this._actor._equipBackLayer[this._backId];
        }
        this._characterName = this._backImg ? this._backImg : '' //this._character.characterName();
        this._characterIndex = this._character.characterIndex();
        if (this._tileId > 0) {
            this.setTileBitmap();
        } else {
            this.setCharacterBitmap();
        }
    }
};

Sprite_Character_Back.prototype.isImageChanged = function () {
    return (
        this._tilesetId !== $gameMap.tilesetId() ||
        this._tileId !== this._character.tileId() ||
        this._backId >= 1
        // this._characterName !== this._character.characterName() ||
        // this._characterIndex !== this._character.characterIndex()
    );
};

Sprite_Character_Back.prototype.setTileBitmap = function () {
    this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Character_Back.prototype.setCharacterBitmap = function () {
    this.bitmap = ImageManager.loadCharacterLayer(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Character_Back.prototype.updateFrame = function () {
    if (this._tileId > 0) {
        this.updateTileFrame();
    } else {
        this.updateCharacterFrame();
    }
};

Sprite_Character_Back.prototype.updateTileFrame = function () {
    const tileId = this._tileId;
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_Character_Back.prototype.updateCharacterFrame = function () {
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        const d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};

Sprite_Character_Back.prototype.characterBlockX = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return (index % 4) * 3;
    }
};

Sprite_Character_Back.prototype.characterBlockY = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};

Sprite_Character_Back.prototype.characterPatternX = function () {
    return this._character.pattern();
};

Sprite_Character_Back.prototype.characterPatternY = function () {
    return (this._character.direction() - 2) / 2;
};

Sprite_Character_Back.prototype.patternWidth = function () {
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 12;
    }
};

Sprite_Character_Back.prototype.patternHeight = function () {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};

Sprite_Character_Back.prototype.updateHalfBodySprites = function () {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
        this._upperBody.blendMode = this.blendMode;
        this._lowerBody.blendMode = this.blendMode;
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};

Sprite_Character_Back.prototype.createHalfBodySprites = function () {
    if (!this._upperBody) {
        this._upperBody = new Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};

Sprite_Character_Back.prototype.updatePosition = function () {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};

Sprite_Character_Back.prototype.updateOther = function () {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};

Cat.CharacterLayer.Sprite_Button_updateOpacity = Sprite_Button.prototype.updateOpacity;
Sprite_Button.prototype.updateOpacity = function () {
    if (this._buttonType == 'cancel' && SceneManager._scene instanceof Scene_CharacterLayer) {
        this.opacity = 0;
    } else {
        Cat.CharacterLayer.Sprite_Button_updateOpacity.call(this);
    }
};
function Scene_CharacterLayer() {
    this.initialize(...arguments);
}

Scene_CharacterLayer.prototype = Object.create(Scene_MenuBase.prototype);
Scene_CharacterLayer.prototype.constructor = Scene_CharacterLayer;

Scene_CharacterLayer.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    ImageManager.loadCharacterLayer('characterLayerBack');
    ImageManager.loadCharacter('$newCharacterMain');
};

Scene_CharacterLayer.prototype.createCancelButton = function () {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 70;
    this._cancelButton.y = this.buttonY() + 40;
    this.addWindow(this._cancelButton);
    this._cancelButton.scale.set(1.2);
};

Scene_CharacterLayer.prototype.createBackground = function () {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(255);
    this._backGroundSprites = new Sprite();
    this.addChild(this._backGroundSprites);
    this._backGroundSprites.bitmap = ImageManager.loadCharacterLayer('characterLayerBack');
};

Scene_CharacterLayer.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._listTypeWindow && this._itemListWindow) {
        if (this._listTypeWindow.item()) {
            this._itemListWindow.refresh();
        }
    }
};

Scene_CharacterLayer.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createTimeWindow();
    this.createTypeListWindow();
    this.createItemListWindow();
    this.createActorSprite();
    this.createInfoWindow();
};

Scene_CharacterLayer.prototype.createInfoWindow = function () {
    const rect = this.infoWindowRect();
    this._infoWindow = new Window_CharacterLayerInfo(rect);
    this.addChild(this._infoWindow);
};

Scene_CharacterLayer.prototype.infoWindowRect = function () {
    const ww = Graphics.width;
    const wh = Graphics.height;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

// Cat.CharacterLayer.Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
// Sprite_Character.prototype.updatePosition = function () {
//     if (SceneManager._scene instanceof Scene_CharacterLayer) {
//         if (!this._character._layerType) {
//             Cat.CharacterLayer.Sprite_Character_updatePosition.call(this);
//         } else {
//             this._character.updateAnimation();
//             this._character._animationCount++;
//         };
//     } else {
//         Cat.CharacterLayer.Sprite_Character_updatePosition.call(this);
//     }
// };

Scene_CharacterLayer.prototype.createActorSprite = function () {
    this._baseActorSprite = new Sprite();
    this.addChild(this._baseActorSprite);
    this.refreshActorSprite();

    this._mapMainBaseSprite = new Sprite_Picture_ShowBase_X();
    this.addChild(this._mapMainBaseSprite);
    this._mapMainBaseSprite.x = 950;
    this._mapMainBaseSprite.y = 104;
    this._mapMainBaseSprite.scale.set(0.7);
    this._mapMainBaseSprite.anchor.x = 0.5;
    this._mapMainBaseSprite.anchor.y = 1;
    this._mapMainBaseSprite.visible = true;
};

Scene_CharacterLayer.prototype.refreshActorSprite = function () {
    if (this._actorSpriteList) {
        for (let s = 0; s < this._actorSpriteList.length; s++) {
            const sprite = this._actorSpriteList[s];
            if (sprite) {
                this._baseActorSprite.removeChild(sprite);
            }
        }
    }
    this._actorSpriteList = [];
    this._actorList = [];
    this._actor = $gameParty.allMembers()[0];
    for (let s = 0; s < 4; s++) {
        var actor = JsonEx.makeDeepCopy(this._actor);
        if (s == 0) {
            var x = 740;
            var y = 370;
        } else if (s == 1) {
            var x = 930;
            var y = 370;
        } else if (s == 2) {
            var x = 740;
            var y = 560;
        } else if (s == 3) {
            var x = 930;
            var y = 560;
        }
        var sprite = new Sprite_Character_ShowBase(s);
        sprite.x = x;
        sprite.y = y;
        sprite.scale.set(1.6);
        this._actorList[s] = actor;
        this._actorSpriteList[s] = sprite;
        this._baseActorSprite.addChild(sprite);
    }
};

Scene_CharacterLayer.prototype.createItemListWindow = function () {
    const rect = this.itemListWindowRect();
    this._itemListWindow = new Window_CharacterLayerItemList(rect);
    this._itemListWindow.setHandler('ok', this.onItem.bind(this));
    this._itemListWindow.setHandler('cancel', this.cancelItem.bind(this));
    this.addChild(this._itemListWindow);
    this._itemListWindow.deactivate();
    this._itemListWindow.deselect();
};

Scene_CharacterLayer.prototype.onItem = function () {
    if (!this._itemListWindow.item()) {
        SoundManager.playBuzzer();
        this._itemListWindow.activate();
        return;
    };
    const item = this._itemListWindow.item();
    const type = this._listTypeWindow.item();
    if (item.name == '清空') {
        $we.noCloth(type, true);
        SoundManager.playEquip();
        this._itemListWindow.activate();
        return;
    }
    $we.changeCloth(item, type, true);
    SoundManager.playEquip();
    $gamePlayer.refresh();
    //this.refreshActorSprite();
    this._itemListWindow.activate();
};

var _old_Wolfzq_Event_changeCloth = Wolfzq_Event.prototype.changeCloth;
Wolfzq_Event.prototype.changeCloth = function (item, type, save) {
    _old_Wolfzq_Event_changeCloth.call(this, item, type, save);
    const actor = $gameParty.allMembers()[0];
    if (type == '头饰') {
        actor._equipLayer[11] = null;
        actor.getItemNote(item, true)//战斗立绘对接
    };
};

var _old_Wolfzq_Event_noCloth = Wolfzq_Event.prototype.noCloth;
Wolfzq_Event.prototype.noCloth = function (type, save) {
    _old_Wolfzq_Event_noCloth.call(this, type, save)
    if (type == '头饰') {
        const actor = $gameParty.allMembers()[0];
        actor._equipLayer[11] = null;
    };
};

Scene_CharacterLayer.prototype.cancelItem = function () {
    this._itemListWindow.deactivate();
    this._itemListWindow.deselect();
    this._listTypeWindow.activate();
};

Scene_CharacterLayer.prototype.itemListWindowRect = function () {
    const ww = 246;
    const wh = 520;
    const wx = 378;
    const wy = 68;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CharacterLayer.prototype.createTimeWindow = function () {
    const rect = this.timesWindowRect();
    this._timeWindow = new Window_CharacterLayerTime(rect);
    this.addChild(this._timeWindow);
};

Scene_CharacterLayer.prototype.timesWindowRect = function () {
    const ww = 160;
    const wh = 130;
    const wx = 0;
    const wy = 204;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_CharacterLayer.prototype.createTypeListWindow = function () {
    const rect = this.listTypeWindowRect();
    this._listTypeWindow = new Window_CharacterLayerListType(rect);
    this._listTypeWindow.setHandler('ok', this.onListType.bind(this));
    this._listTypeWindow.setHandler('cancel', this.cancelScene.bind(this));
    this.addChild(this._listTypeWindow);
    this._listTypeWindow.activate();
    this._listTypeWindow.select(0);
};

Scene_CharacterLayer.prototype.onListType = function () {
    if (!this._listTypeWindow.item()) {
        SoundManager.playBuzzer();
        this._listTypeWindow.activate();
        return;
    };
    this._listTypeWindow.deactivate();
    this._itemListWindow.refresh();
    this._itemListWindow.activate();
    this._itemListWindow.select(0);
};

Scene_CharacterLayer.prototype.cancelScene = function () {
    this.popScene();
};

Scene_CharacterLayer.prototype.listTypeWindowRect = function () {
    const ww = 250;
    const wh = 320;
    const wx = 140;
    const wy = 68;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_CharacterLayerTime() {
    this.initialize(...arguments);
}

Window_CharacterLayerTime.prototype = Object.create(Window_Base.prototype);
Window_CharacterLayerTime.prototype.constructor = Window_CharacterLayerTime;

Window_CharacterLayerTime.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.refresh();
};

Window_CharacterLayerTime.prototype.refresh = function () {
    this.drawTimeText();
};

Window_CharacterLayerTime.prototype.drawTimeText = function () {
    this.contents.clear();
    this.contents.fontSize = 18;
    const year = $gameVariables.value(FlyCat.LL_SceneMenu.yearVariable);//$gameSystem._menuYear ? $gameSystem._menuYear : 0;
    const month = $gameVariables.value(FlyCat.LL_SceneMenu.monthVariable)//$gameSystem._menuMonth ? $gameSystem._menuMonth : 1;
    const weather = $gameSystem._menuWeather ? $gameSystem._menuWeather : '春';
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText("修仙纪元", 0, 6, this.width - 44, 'center');
    this.drawText(year + " 年 ", 0, 32, this.width - 44, 'center');
    this.drawText(month + "月（" + weather + '）', 5, 58, this.width - 44, 'center');
};

function Window_CharacterLayerListType() {
    this.initialize(...arguments);
}

Window_CharacterLayerListType.prototype = Object.create(Window_Selectable.prototype);
Window_CharacterLayerListType.prototype.constructor = Window_CharacterLayerListType;

Window_CharacterLayerListType.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadCharacterLayer('listBack');
    this.createCursorSprite();
};

Window_CharacterLayerListType.prototype.item = function () {
    return this._list[this.index()]
};

Window_CharacterLayerListType.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this._list = [];
    const list = Cat.CharacterLayer.layerBack.concat(Cat.CharacterLayer.layerFor);
    for (let s = 0; s < list.length; s++) {
        const element = list[s];
        if (element) {
            this._list.push(element);
        }
    }
    this.drawAllItems();
};

Window_CharacterLayerListType.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item, rect.x, rect.y + 6, rect.width, 'center');
    }
};

Window_CharacterLayerListType.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadCharacterLayer('cursor');;
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_CharacterLayerListType.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_CharacterLayerListType.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 6;
        this._cursorSprites.y = this._cursorSprite.y + 10;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_CharacterLayerListType.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y;
        const sx = 0;
        const sy = 0;
        const scw = pw * 0.8;
        const sch = ph * 0.8;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_CharacterLayerListType.prototype.maxCols = function () {
    return 1;
};

Window_CharacterLayerListType.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_CharacterLayerListType.prototype.numVisibleRows = function () {
    return 5;
};

Window_CharacterLayerListType.prototype.drawBackgroundRect = function (rect) {
};

Window_CharacterLayerListType.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

function Window_CharacterLayerItemList() {
    this.initialize(...arguments);
}

Window_CharacterLayerItemList.prototype = Object.create(Window_Selectable.prototype);
Window_CharacterLayerItemList.prototype.constructor = Window_CharacterLayerItemList;

Window_CharacterLayerItemList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.windowskin = ImageManager.loadSystem("Window20");
    this.opacity = 0;
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadCharacterLayer('listBack');
    this.createCursorSprite();
};

Window_CharacterLayerItemList.prototype.item = function () {
    return this._list[this.index()]
};

Window_CharacterLayerItemList.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    let items = $gameParty.items();
    let itemLength = items.length;
    this._list = [];
    this._list.push(
        {
            name: '清空'
        });
    if (SceneManager._scene._listTypeWindow.item()) {
        const item = SceneManager._scene._listTypeWindow.item();
        for (let s = 0; s < itemLength; s++) {
            if (items[s] && eval(String('items[s].meta.' + item))) {
                this._list.push(items[s]);
            };
        };
        this.drawAllItems();
    };
};

Window_CharacterLayerItemList.prototype.drawItem = function (index) {
    const item = this._list[index];
    if (item) {
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 24;
        this.changeTextColor('#462a39');
        this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawText(item.name, rect.x, rect.y + 6, rect.width, 'center');
    }
};

Window_CharacterLayerItemList.prototype.createCursorSprite = function () {
    this._cursorSprites = new Sprite();
    this.addChild(this._cursorSprites)
    this._cursorSprites.bitmap = ImageManager.loadCharacterLayer('cursor2');
    this._cursorSprites.scale.set(1);
    this._clientArea.addChild(this._cursorSprites);
};

Window_CharacterLayerItemList.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        this._loadingPictrue = true;
    };
};

Window_CharacterLayerItemList.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
    if (this.index() >= 0) {
        //    this._cursorSprites.alpha = this._makeCursorAlpha();;
        this._cursorSprites.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprites.x = this._cursorSprite.x + 6;
        this._cursorSprites.y = this._cursorSprite.y + 10;
    } else {
        this._cursorSprites.visible = false;
    }
};

Window_CharacterLayerItemList.prototype.drawCursorBitmap = function (rect) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height;
        const dx = rect.x;
        const dy = rect.y;
        const sx = 0;
        const sy = 0;
        const scw = pw * 0.8;
        const sch = ph * 0.8;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
    }
};

Window_CharacterLayerItemList.prototype.maxCols = function () {
    return 1;
};

Window_CharacterLayerItemList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_CharacterLayerItemList.prototype.numVisibleRows = function () {
    return 8;
};

Window_CharacterLayerItemList.prototype.drawBackgroundRect = function (rect) {
};

Window_CharacterLayerItemList.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};

function Sprite_Character_Animation() {
    this.initialize(...arguments);
}

Sprite_Character_Animation.prototype = Object.create(Sprite.prototype);
Sprite_Character_Animation.prototype.constructor = Sprite_Character_Animation;

Sprite_Character_Animation.prototype.initialize = function (d) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(d);
};

Sprite_Character_Animation.prototype.initMembers = function (d) {
    this._actor = $gameParty.allMembers()[0];
    this.updateConts = 0;
    this.updateConts_1 = 0;
    this.updateConts_2 = 0;
    this._charaterImg = ImageManager.loadCharacter(this._actor.characterName());
    const big = ImageManager.isBigCharacter(this._actor.characterName());
    this._big = big;
    this._characterIndex = 0;
    this._d = d;
    this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
};

Sprite_Character_Animation.prototype._onBitmapLoad = function () {
    if (this._charaterImg.isReady()) {
        this.bitmap = this._charaterImg;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.scale.set(2)
        this._imgwidth = this._charaterImg.width / (this._big ? 3 : 12);
        this._imgheight = this._charaterImg.height / (this._big ? 4 : 8);
        const n = 0;
        this._characterN = n;
        this.setFrame(((n % 4) * 3 + 1) * this._imgwidth, Math.floor(n / 4) * 4 * this._imgheight * (this._d + 1), this._imgwidth, this._imgheight);
    }
};

Sprite_Character_Animation.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.bitmap && this.bitmap.isReady()) {
        this.updateConts++;
        if (this.updateConts > 18) {
            this.updateConts = 0;
            var n = this._characterN;
            this.setFrame(((n % 4) * 3 + this.updateConts_1) * this._imgwidth, this._imgheight * this._d, this._imgwidth, this._imgheight);
            this.updateConts_1++;
            if (this.updateConts_2 == 1) {
                this.updateConts_1 = 0;
                this.updateConts_2 = 0;
            };
            if (this.updateConts_1 > 2 && this.updateConts_2 == 0) {
                this.updateConts_1 = 1;
                this.updateConts_2 = 1;
            };
        };
    };
};

function Sprite_Character_Animation_For() {
    this.initialize(...arguments);
}

Sprite_Character_Animation_For.prototype = Object.create(Sprite.prototype);
Sprite_Character_Animation_For.prototype.constructor = Sprite_Character_Animation_For;

Sprite_Character_Animation_For.prototype.initialize = function (i, d) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(i, d);
    this.setFrame(0, 0, 0, 0);
};

Sprite_Character_Animation_For.prototype.initMembers = function (i, d) {
    this._actor = $gameParty.allMembers()[0];
    this._forId = i;
    this._d = d;
    this.updateConts = 0;
    this.updateConts_1 = 0;
    this.updateConts_2 = 0;
    this._forImg = '';
    if (this._forId) {
        this._forImg = this._actor._equipForLayer[this._forId];
    }
    this._lastImg = this._forImg;
    this._charaterImg = ImageManager.loadCharacterLayer(this._forImg);
    const big = true;
    this._big = big;
    this._characterIndex = 0;
    this._d = d;
    this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
};

Sprite_Character_Animation_For.prototype._onBitmapLoad = function () {
    if (this._charaterImg.isReady()) {
        this.bitmap = this._charaterImg;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.scale.set(2)
        this._imgwidth = this._charaterImg.width / (this._big ? 3 : 12);
        this._imgheight = this._charaterImg.height / (this._big ? 4 : 8);
        const n = 0;
        this._characterN = n;
        this.setFrame(((n % 4) * 3 + 1) * this._imgwidth, this._imgheight * this._d, this._imgwidth, this._imgheight);
    }
};

Sprite_Character_Animation_For.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    if (this._forId > 0) {
        if (this._forId == 2) {
            if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
                this._forImg = "$2";
            } else {
                this._forImg = "$1";
            }
        } else {
            this._forImg = this._actor._equipForLayer[this._forId];
        }
    }
    if (!this._forImg) {
        this.hide();
    } else {
        this.show();
    }
    if (this._forImg && this._lastImg != this._forImg) {
        this._charaterImg = ImageManager.loadCharacterLayer(this._forImg);
        this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
        this._lastImg = this._forImg;
    }
    if (this.bitmap && this.bitmap.isReady()) {
        this.updateConts++;
        if (this.updateConts > 18) {
            this.updateConts = 0;
            var n = this._characterN;
            this.setFrame(((n % 4) * 3 + this.updateConts_1) * this._imgwidth, this._imgheight * this._d, this._imgwidth, this._imgheight);
            this.updateConts_1++;
            if (this.updateConts_2 == 1) {
                this.updateConts_1 = 0;
                this.updateConts_2 = 0;
            };
            if (this.updateConts_1 > 2 && this.updateConts_2 == 0) {
                this.updateConts_1 = 1;
                this.updateConts_2 = 1;
            };
        };
    };
};

function Sprite_Character_Animation_Back() {
    this.initialize(...arguments);
}

Sprite_Character_Animation_Back.prototype = Object.create(Sprite.prototype);
Sprite_Character_Animation_Back.prototype.constructor = Sprite_Character_Animation_Back;

Sprite_Character_Animation_Back.prototype.initialize = function (i, d) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(i, d);
    this.setFrame(0, 0, 0, 0);
};

Sprite_Character_Animation_Back.prototype.initMembers = function (i, d) {
    this._actor = $gameParty.allMembers()[0];
    this._forId = i;
    this._d = d;
    this.updateConts = 0;
    this.updateConts_1 = 0;
    this.updateConts_2 = 0;
    this._forImg = '';
    if (this._forId) {
        this._forImg = this._actor._equipBackLayer[this._forId];
    }
    this._lastImg = this._forImg;
    this._charaterImg = ImageManager.loadCharacterLayer(this._forImg);
    const big = true;
    this._big = big;
    this._characterIndex = 0;
    this._d = d;
    this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
};

Sprite_Character_Animation_Back.prototype._onBitmapLoad = function () {
    if (this._charaterImg.isReady()) {
        this.bitmap = this._charaterImg;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.scale.set(2)
        this._imgwidth = this._charaterImg.width / (this._big ? 3 : 12);
        this._imgheight = this._charaterImg.height / (this._big ? 4 : 8);
        const n = 0;
        this._characterN = n;
        this.setFrame(((n % 4) * 3 + 1) * this._imgwidth, this._imgheight * this._d, this._imgwidth, this._imgheight);
    }
};

Sprite_Character_Animation_Back.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    if (this._forId) {
        this._forImg = this._actor._equipBackLayer[this._forId];
    }
    if (!this._forImg) {
        this.hide();
    } else {
        this.show();
    }
    if (this._forImg && this._lastImg != this._forImg) {
        this._charaterImg = ImageManager.loadCharacterLayer(this._forImg);
        this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
        this._lastImg = this._forImg;
    }
    if (this.bitmap && this.bitmap.isReady()) {
        this.updateConts++;
        if (this.updateConts > 18) {
            this.updateConts = 0;
            var n = this._characterN;
            this.setFrame(((n % 4) * 3 + this.updateConts_1) * this._imgwidth, this._imgheight * this._d, this._imgwidth, this._imgheight);
            this.updateConts_1++;
            if (this.updateConts_2 == 1) {
                this.updateConts_1 = 0;
                this.updateConts_2 = 0;
            };
            if (this.updateConts_1 > 2 && this.updateConts_2 == 0) {
                this.updateConts_1 = 1;
                this.updateConts_2 = 1;
            };
        };
    };
};

function Window_CharacterLayerInfo() {
    this.initialize(...arguments);
};

Window_CharacterLayerInfo.prototype = Object.create(Window_Base.prototype);
Window_CharacterLayerInfo.prototype.constructor = Window_CharacterLayerInfo;

Window_CharacterLayerInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.refresh();
}

Window_CharacterLayerInfo.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 30;
    this.changeTextColor('#462a39');
    this.contents.outlineColor = '#462a39';
    this.contents.outlineWidth = 1;
    this.drawText('类型', 222, 10, this.width, 'left');
    this.drawText('列表', 460, 10, this.width, 'left');
    this.drawText('展示', 806, 115, this.width, 'left');
    this.drawText('前', 716, 170, this.width, 'left');
    this.drawText('右', 716, 360, this.width, 'left');
    this.drawText('左', 906, 170, this.width, 'left');
    this.drawText('后', 906, 360, this.width, 'left');
};