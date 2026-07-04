//=============================================================================
// RPG Maker MZ - PictureLayer
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 <Cat-PictureLayer>
 * @author Cat
 * 
 * @param rmSwitch
 * @text 人物入魔状态开关
 * @desc 人物入魔状态开关
 * @type switch
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
 * @default 10
 * 
 * @param layerBack
 * @text 本体背景分类设置
 * @desc 2号空白处为强制占用的后发
 * @type string[]
 * @default ["法相",""]
 * 
 * @param layerFor
 * @text 本体前景分类设置
 * @desc 1表情3-4淫文白灼6怀孕7怀孕肚子
 * @type string[]
 * @default ["","头发","","","衣服","",""]
 * 
 * @command setForPicture
 * @text 强制设置立绘前景图层
 * @desc 强制设置立绘前景图层
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
 * @text 立绘前景名称
 * @type string
 * 
 * @command setBackPicture
 * @text 强制设置立绘背景图层
 * @desc 强制设置立绘背景图层
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
 * @command removeForPicture
 * @text 强制删除立绘前景图层
 * @desc 强制删除立绘前景图层
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
 * @command removeBackPicture
 * @text 强制删除立绘背景图层
 * @desc 强制删除立绘背景图层
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
 * @help
 * img/menu/newPictures/
 * 法相 后发 
 * 1.表情 2.头饰 3.头发 4.发饰 5.怀孕肚子 6.淫文 
 * 7.侮辱性文字 8.身体装饰 9.白浊 10.衣服 11.怀孕状态 
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_PictureLayer = true;

var Cat = Cat || {};
Cat.PictureLayer = {};
Cat.PictureLayer.parameters = PluginManager.parameters('Cat_PictureLayer');
Cat.PictureLayer.backLayer = Number(Cat.PictureLayer.parameters['backLayer'] || 10);
Cat.PictureLayer.forLayer = Number(Cat.PictureLayer.parameters['forLayer'] || 10);
Cat.PictureLayer.layerBack = eval(Cat.PictureLayer.parameters['layerBack'] || ["法相环", "飘带", "后发"]);
Cat.PictureLayer.layerFor = eval(Cat.PictureLayer.parameters['layerFor'] || ["装饰品", "侮辱文字装饰", "衣服", "表情", "前发"]);
Cat.PictureLayer.rmSwitch = Number(Cat.PictureLayer.parameters['rmSwitch']);

PluginManager.registerCommand('Cat_PictureLayer', 'setForPicture', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).setPictureForLayer(layerId, img);
});

PluginManager.registerCommand('Cat_PictureLayer', 'removeForPicture', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).removePictureForLayer(layerId, img);
});

PluginManager.registerCommand('Cat_PictureLayer', 'setBackPicture', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).setPictureBackLayer(layerId, img);
});

PluginManager.registerCommand('Cat_PictureLayer', 'removeBackPicture', args => {
    const actorId = Number(args.actorId)
    const img = String(args.img);
    const layerId = Number(args.layerId)
    $gameActors.actor(actorId).removePictureBackLayer(layerId, img);
});

ImageManager.loadPictureLayer = function (filename) {
    return this.loadBitmap("img/menu/newPictures/", filename);
};

Cat.PictureLayer.Window_Base_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
Window_Message.prototype.convertEscapeCharacters = function (text) {
    text = text.replace(/\\Face\[(\w+)\]/gi, "");
    return Cat.PictureLayer.Window_Base_convertEscapeCharacters.call(this, text);
};

Game_Actor.prototype.setPictureForLayer = function (layerId, img) {
    this.equipForLayerStart();
    if (layerId > 0) {
        this._equipForPictureLayer[layerId] = img;
    };
};

Game_Actor.prototype.removePictureForLayer = function (layerId, img) {
    this.equipForLayerStart();
    if (layerId > 0) {
        this._equipForPictureLayer[layerId] = null;
    };
};

Game_Actor.prototype.setPictureBackLayer = function (layerId, img) {
    this.equipBackLayerStart();
    if (layerId > 0) {
        this._equipBackPictureLayer[layerId] = img;
    };
};

Game_Actor.prototype.removePictureBackLayer = function (layerId, img) {
    this.equipBackLayerStart();
    if (layerId > 0) {
        this._equipBackPictureLayer[layerId] = null;
    };
};

Cat.PictureLayer.Game_Actor_equipForLayerStart = Game_Actor.prototype.equipForLayerStart;
Game_Actor.prototype.equipForLayerStart = function () {
    Cat.PictureLayer.Game_Actor_equipForLayerStart.call(this);
    if (this._equipForPictureLayer == undefined) {
        this._equipForPictureLayer = [];
        for (let i = 1; i < Cat.PictureLayer.forLayer + 1; i++) {
            if (!this._equipForPictureLayer[i]) {
                if (i == 3) {
                    this._equipForPictureLayer[i] = 'f1';
                } else if (i == 10) {
                    this._equipForPictureLayer[i] = 'y1';
                } else {
                    this._equipForPictureLayer[i] = null;
                };
            };
        };
    };
};

Cat.PictureLayer.Game_Actor_equipBackLayerStart = Game_Actor.prototype.equipBackLayerStart;
Game_Actor.prototype.equipBackLayerStart = function () {
    Cat.PictureLayer.Game_Actor_equipBackLayerStart.call(this);
    if (this._equipBackPictureLayer == undefined) {
        this._equipBackPictureLayer = [];
        for (let i = 1; i < Cat.PictureLayer.backLayer + 1; i++) {
            if (!this._equipBackPictureLayer[i]) {
                if (i == 2) {
                    this._equipBackPictureLayer[i] = 'f1h';
                } else {
                    this._equipBackPictureLayer[i] = null;
                };
            }
        }
    }
};

Cat.PictureLayer.Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer
Scene_Map.prototype.createWindowLayer = function () {
    this.createPictureLayer();
    Cat.PictureLayer.Scene_Map_createWindowLayer.call(this);
};

Scene_Map.prototype.createPictureLayer = function () {
    $gameSystem._tempFaceName = '对话立绘-表情1';
    const x = FlyCat.LL_MapPicture.pictureX;
    const y = FlyCat.LL_MapPicture.pictureY;
    this._mapMainBaseSprite = new Sprite_Picture_ShowBase();
    this.addChild(this._mapMainBaseSprite);
    this._mapMainBaseSprite.x = x / 2 + 164;
    this._mapMainBaseSprite.y = 0;
    this._mapMainBaseSprite.anchor.x = 0.5;
    this._mapMainBaseSprite.anchor.y = 1;
};

function Sprite_Picture_ShowBase() {
    this.initialize(...arguments);
}

Sprite_Picture_ShowBase.prototype = Object.create(Sprite.prototype);
Sprite_Picture_ShowBase.prototype.constructor = Sprite_Picture_ShowBase;

Sprite_Picture_ShowBase.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.hide()
    this._breatheCount = 0;
    this.initMembers();
    this.createBackSprite();
    this.createPictureSprite();
    this.createForSprite();
    //wolfzq修正错误的呼吸效果
    this._needSetBody = false;
};

Sprite_Picture_ShowBase.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this._mainSprite && this._mainSprite.bitmap && this._mainSprite.bitmap.isReady()) {
        if (!this._needSetBody) {
            this.children.forEach(child => {
                if (child instanceof Sprite) { child.anchor.y = 1; child.y += child.height; }
            })
            this._needSetBody = true;
        }
        this._breatheCount++;
        if (this._breatheCount < 61) {
            this.addChildScaleY(0.0001);
        } else if (this._breatheCount > 60) {
            if (this._breatheCount > 120) {
                this._breatheCount = 0;
                this.children.forEach(child => {
                    if (child instanceof Sprite) { child.scale.y = 1; }
                })
            } else {
                this.addChildScaleY(-0.0001);
            }
        }
    };
    if ($gameSystem._mapCgVisible == false || $gameSystem._mapCgVisible == true) {
        if (SceneManager._scene instanceof Scene_Map) {
            this.visible = $gameSystem._mapCgVisible;
        } else {
            this.show();
        }
    }
};

Sprite_Picture_ShowBase.prototype.addChildScaleY = function (val) {
    this.children.forEach(child => {
        if (child instanceof Sprite) { child.scale.y += val; }
    })
};

Sprite_Picture_ShowBase.prototype.initMembers = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._actor = $gameParty.allMembers()[0];
    this._forList = [];
    this._backList = [];
};

Sprite_Picture_ShowBase.prototype.createPictureSprite = function () {
    this._mainSprite = new Sprite();
    this._mainSprite.bitmap = ImageManager.loadPictureLayer("main");
    this.addChild(this._mainSprite);
};

Sprite_Picture_ShowBase.prototype.createBackSprite = function () {
    for (let i = 1; i < Cat.PictureLayer.backLayer + 1; i++) {
        const characterSprite = new Sprite_PictureBackLayer(i);
        characterSprite._forId = i;
        this.addChild(characterSprite);
        //characterSprite.setFrame(0, 0, 0, 0);
        this._backList[i] = characterSprite;
    }
};

Sprite_Picture_ShowBase.prototype.createForSprite = function () {
    for (let i = 1; i < Cat.PictureLayer.forLayer + 1; i++) {
        const characterSprite = new Sprite_PictureForLayer(i);
        //characterSprite.setFrame(0, 0, 0, 0);
        characterSprite._forId = i;
        this.addChild(characterSprite);
        this._forList[i] = characterSprite;
        if (i == 10) {
            const eop = $gameVariables.value(FlyCat.LL_MapPicture.equipVariable);
            characterSprite.opacity = eop;
        }
    }
};

function Sprite_PictureForLayer() {
    this.initialize(...arguments);
}

Sprite_PictureForLayer.prototype = Object.create(Sprite.prototype);
Sprite_PictureForLayer.prototype.constructor = Sprite_PictureForLayer;

Sprite_PictureForLayer.prototype.initialize = function (i) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(i);
};

Sprite_PictureForLayer.prototype.initMembers = function (i) {
    this._actor = $gameParty.allMembers()[0];
    this._tempFaceNameCounts = 1;
    this._tempFaceCounts = 0;
    this._tempFaceSpeed = 5;
    this._tempFaceRandom = false;
    this._tempFaceCounts_1 = 0;
    this._forId = i;
    this._forImg = '';
    if (this._forId > 0) {
        if (this._forId == 1) {//Face
            this.createFaceSprite();
        } else if (this._forId == 6) {//Yw
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.ywSwitch)) {
                this._forImg = 'yw';
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 9) {//Bz
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
                this._forImg = 'bz';
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 5) {//HyDz
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
                var img = '';
                if ($gameVariables.value(10) >= 3 && $gameVariables.value(10) < 5) {
                    var img = 'hyS1';
                } else if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 9) {
                    var img = 'hyS2';
                } else if ($gameVariables.value(10) >= 9) {
                    var img = 'hyS3';
                }
                this._forImg = img;
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 11) {//HyState
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
                var img = '';
                if ($gameVariables.value(10) >= 3 && $gameVariables.value(10) < 5) {
                    var img = 'hy3';
                } else if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 7) {
                    var img = 'hy5';
                } else if ($gameVariables.value(10) >= 7 && $gameVariables.value(10) < 9) {
                    var img = 'hy7';
                } else if ($gameVariables.value(10) >= 9) {
                    var img = 'hy9';
                } else {
                    var img = 'hy1';
                }
                this._forImg = img;
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 10) {
            const durability = this.ItemDurability();
            if (durability == '_3') {
                this.bitmap = ImageManager.loadPictureLayer('lt');
            } else {
                this._forImg = this._actor._equipForPictureLayer[this._forId];
                if (this._forImg) {
                    this.bitmap = ImageManager.loadPictureLayer(this._forImg + durability);
                } else {
                    this.bitmap = ImageManager.loadPictureLayer();
                }
            }
        } else {
            this._forImg = this._actor._equipForPictureLayer[this._forId];
            if (this._forImg) {
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        }
    }
};

Sprite_PictureForLayer.prototype.createFaceSprite = function () {
    if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
        if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
            this._forImg = 'b2-8'
        } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
            this._forImg = 'b2-10'
        } else {
            this._forImg = 'b2-1'
        }
    } else {
        if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
            this._forImg = 'b1-8'
        } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
            this._forImg = 'b1-10';
        } else {
            this._forImg = 'b1-1';
        }
    }
    if (this._forImg) {
        this.bitmap = ImageManager.loadPictureLayer(this._forImg);
    }
};

Sprite_PictureForLayer.prototype.updateFaceSrite = function () {
    if ($gameSystem._tempFaceName == '对话立绘-表情1') {
        if ($gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
                this._forImg = 'eyes4_' + this._tempFaceNameCounts;
            }
            else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
                this._forImg = 'eyes6_' + this._tempFaceNameCounts;
            }
            else {
                this._forImg = 'eyes3_' + this._tempFaceNameCounts;
            }
        } else {
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
                this._forImg = 'eyes2_' + this._tempFaceNameCounts;
            } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
                this._forImg = 'eyes5_' + this._tempFaceNameCounts;
            } else {
                this._forImg = 'eyes1_' + this._tempFaceNameCounts;
            }
        }
        this.bitmap = ImageManager.loadPictureLayer(this._forImg);
        this._tempFaceCounts++;
        if (!this._tempFaceRandom) {
            if (this._tempFaceCounts >= this._tempFaceSpeed) {
                this._tempFaceNameCounts++;
                if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
                    if (this._tempFaceNameCounts > 9) {
                        this._tempFaceNameCounts = 1;
                        const speed = Math.floor(Math.random() * 600);
                        this._tempFaceSpeed = speed < 120 ? 120 : speed;
                        this._tempFaceRandom = true;
                    }
                } else {
                    if (this._tempFaceNameCounts > 9) {
                        this._tempFaceNameCounts = 1;
                        const speed = Math.floor(Math.random() * 600);
                        this._tempFaceSpeed = speed < 120 ? 120 : speed;
                        this._tempFaceRandom = true;
                    }
                }
                this._tempFaceCounts = 0;
            }
        } else {
            if (this._tempFaceCounts >= this._tempFaceSpeed) {
                this._tempFaceSpeed = 5;
                this._tempFaceCounts = 0;
                this._tempFaceRandom = false;
            }
        }
    };
    if ($gameSystem._tempFaceName == '其他') {
        // this._tempFaceCounts_1++;
        // if (this._tempFaceCounts_1 >= 60) {
        //     this._tempFaceNameCounts = 1;
        //     $gameSystem._tempFaceName = '对话立绘-表情1';
        //     this._tempFaceCounts_1 = 0;
        // }
    }
};

Sprite_PictureForLayer.prototype.ItemDurability = function () {
    const actor = $gameParty.allMembers()[0];
    this._actorArmor = null;
    if (actor._equips[1]._itemId) {
        const armor = $dataArmors[actor._equips[1]._itemId];
        this._actorArmor = armor;
    }
    return $we.breakClothLv2(this._actorArmor);
};

Sprite_PictureForLayer.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    if (this._forId > 0) {
        if (this._forId == 1) {
            this.updateFaceSrite();
        } else if (this._forId == 6) {//Yw
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.ywSwitch)) {
                this._forImg = 'yw';
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 9) {//Bz
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
                this._forImg = 'bz';
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 5) {//HyDz
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
                var img = '';
                if ($gameVariables.value(10) >= 3 && $gameVariables.value(10) < 5) {
                    var img = 'hyS1';
                } else if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 9) {
                    var img = 'hyS2';
                } else if ($gameVariables.value(10) >= 9) {
                    var img = 'hyS3';
                }
                this._forImg = img;
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 11) {//HyState
            if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
                var img = '';
                if ($gameVariables.value(10) >= 3 && $gameVariables.value(10) < 5) {
                    var img = 'hy3';
                } else if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 7) {
                    var img = 'hy5';
                } else if ($gameVariables.value(10) >= 7 && $gameVariables.value(10) < 9) {
                    var img = 'hy7';
                } else if ($gameVariables.value(10) >= 9) {
                    var img = 'hy9';
                } else {
                    var img = 'hy1';
                }
                this._forImg = img;
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            } else {
                this.bitmap = ImageManager.loadPictureLayer();
            }
        } else if (this._forId == 10) {//衣服
            const durability = this.ItemDurability();
            if (durability == '_3') {
                this.bitmap = ImageManager.loadPictureLayer('lt');
            } else {
                this._forImg = this._actor._equipForPictureLayer[this._forId];
                if (this._forImg) {
                    this.bitmap = ImageManager.loadPictureLayer(this._forImg + durability);
                }
            }
        } else {

            this._forImg = this._actor._equipForPictureLayer[this._forId];
            // if (this._forImg && this._lastImg != this._forImg) {
            //     this._charaterImg = ImageManager.loadPictureLayer(this._forImg);
            //     this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
            //     this._lastImg = this._forImg;
            // }
            if (this._forImg) {
                this.bitmap = ImageManager.loadPictureLayer(this._forImg);
            }
        };
        if (this._forId == 11) {
            if ($gameSystem._hyCgVisible == false || $gameSystem._hyCgVisible == true) {
                this.visible = $gameSystem._hyCgVisible;
            }
        } else {
            if (!this._forImg) {
                this.hide();
            } else {
                this.show();
            }
        }
    }
};
function Sprite_PictureBackLayer() {
    this.initialize(...arguments);
}

Sprite_PictureBackLayer.prototype = Object.create(Sprite.prototype);
Sprite_PictureBackLayer.prototype.constructor = Sprite_PictureBackLayer;

Sprite_PictureBackLayer.prototype.initialize = function (i) {
    Sprite.prototype.initialize.call(this);
    this.initMembers(i);
};

Sprite_PictureBackLayer.prototype.initMembers = function (i) {
    this._actor = $gameParty.allMembers()[0];
    this._forId = i;
    this._forImg = '';
    if (this._forId > 0) {
        this._forImg = this._actor._equipBackPictureLayer[this._forId];
        if (this._forImg) {
            this.bitmap = ImageManager.loadPictureLayer(this._forImg);
        }
    }
    //this._lastImg = this._forImg;
    // this._charaterImg = ImageManager.loadPictureLayer(this._forImg);
    // this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
};

// Sprite_PictureBackLayer.prototype._onBitmapLoad = function () {
//     if (this._charaterImg && this._charaterImg.isReady()) {
//         this.bitmap = this._charaterImg;
//         this.anchor.x = 0.5;
//         this.anchor.y = 1;
//     }
// };

Sprite_PictureBackLayer.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this._actor = $gameParty.allMembers()[0];
    if (this._forId > 0) {
        this._forImg = this._actor._equipBackPictureLayer[this._forId];
        if (this._forImg) {
            this.bitmap = ImageManager.loadPictureLayer(this._forImg);
        }
        if (!this._forImg) {
            this.hide();
        } else {
            this.show();
        }
        // if (this._forImg && this._lastImg != this._forImg) {
        //     this._charaterImg = ImageManager.loadPictureLayer(this._forImg);
        //     this._charaterImg.addLoadListener(this._onBitmapLoad.bind(this));
        //     this._lastImg = this._forImg;
        // }
    }
};

function Sprite_Picture_ShowBase_X() {
    this.initialize(...arguments);
}

Sprite_Picture_ShowBase_X.prototype = Object.create(Sprite_Picture_ShowBase.prototype);
Sprite_Picture_ShowBase_X.prototype.constructor = Sprite_Picture_ShowBase_X;

Sprite_Picture_ShowBase_X.prototype.initialize = function () {
    Sprite_Picture_ShowBase.prototype.initialize.call(this);
};

Sprite_Picture_ShowBase_X.prototype.update = function () {
    Sprite.prototype.update.call(this);
    // if (this._mainSprite && this._mainSprite.bitmap && this._mainSprite.bitmap.isReady()) {
    //     this._breatheCount++;
    //     if (this._breatheCount < 61) {
    //         this.scale.y += 0.0001;
    //     } else if (this._breatheCount > 60 && this._breatheCount <= 120) {
    //         this.scale.y -= 0.0001;
    //     } else {
    //         this._breatheCount = 0;
    //         this.scale.y = 0.8;
    //     }
    // };
};