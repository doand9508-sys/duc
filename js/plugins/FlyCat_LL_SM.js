//=============================================================================
// RPG Maker MZ - 琉璃岛私密日记
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<琉璃岛私密日记>
 * @author FlyCat
 * 
 * @param zuiText
 * @text 嘴巴每级描述
 * @type string[]
 * 
 * @param kouText
 * @text 嘴巴每级描述
 * @type string[]
 * 
 * @param piText
 * @text 屁股每级描述
 * @type string[]
 * 
 * @param xueText
 * @text 穴每级描述
 * @type string[]
 * 
 * @param smPicture
 * @text 私密菜单立绘
 * @require 1
 * @dir img/menu/
 * @type file
 * 
 * @param mouthValue
 * @text 嘴巴开发度系统变量选择
 * @desc 嘴巴开发度系统变量选择
 * @type variable
 * 
 * @param thoraxValue
 * @text 胸部开发度系统变量选择
 * @desc 胸部开发度系统变量选择
 * @type variable
 * 
 * @param vaginaValue
 * @text 小穴开发度系统变量选择
 * @desc 小穴开发度系统变量选择
 * @type variable
 * 
 * @param bunsValue
 * @text 股开发度系统变量选择
 * @desc 股开发度系统变量选择
 * @type variable
 * 
 * @param peopleHValue
 * @text 自慰次数
 * @desc 自慰次数
 * @type variable
 * 
 * @param plantHValue
 * @text 被人类骚扰
 * @desc 被人类骚扰
 * @type variable
 * 
 * @param yzHValue
 * @text 被怪物骚扰次数
 * @desc 被怪物骚扰次数
 * @type variable
 * 
 * @param childrenValue
 * @text 双修次数系统变量选择
 * @desc 双修次数系统变量选择
 * @type variable
 * 
 * @param boyValue
 * @text 人类孩子数量系统变量选择
 * @desc 人类孩子数量系统变量选择
 * @type variable
 * 
 * @param girlValue
 * @text 怪兽孩子数量系统变量选择
 * @desc 怪兽孩子数量系统变量选择
 * @type variable
 * 
 * @param qjValue
 * @text 强奸次数
 * @desc 强奸次数
 * @type variable
 * 
 * @param ljValue
 * @text 轮奸次数
 * @desc 轮奸次数
 * @type variable
 * 
 * @param sjValue
 * @text 兽交次数
 * @desc 兽交次数
 * @type variable
 * 
 * @param hyValue
 * @text 怀孕次数
 * @desc 怀孕次数
 * @type variable
 * @help
 * ==============================使用说明================================
 * 在img文件夹下新建menu文件，所有立绘需要放到这里
 * 在插件设置内设置私密菜单立绘
 * 在插件设置内设置嘴巴开发度系统变量
 * 在插件设置内设置胸部开发度系统变量
 * 在插件设置内设置小穴开发度系统变量
 * 在插件设置内设置股开发度系统变量
 * 在插件设置内设置人类H次数
 * 在插件设置内设置植物H次数
 * 在插件设置内设置异种H次数
 * 在插件设置内设置孩子数量
 * 在插件设置内设置男孩子数量
 * 在插件设置内设置女孩子数量
 * ======================================================================
 */
'use strict';
var Imported = Imported || {};
Imported.FlyCat_LL_SM = true;

var FlyCat = FlyCat || {};
FlyCat.LL_Sm = {};
FlyCat.LL_Sm.parameters = PluginManager.parameters('FlyCat_LL_SM');
FlyCat.LL_Sm.smPicture = String(FlyCat.LL_Sm.parameters['smPicture']);
FlyCat.LL_Sm.mouthValue = Number(FlyCat.LL_Sm.parameters['mouthValue'] || 0);
FlyCat.LL_Sm.thoraxValue = Number(FlyCat.LL_Sm.parameters['thoraxValue'] || 0);
FlyCat.LL_Sm.vaginaValue = Number(FlyCat.LL_Sm.parameters['vaginaValue'] || 0);
FlyCat.LL_Sm.bunsValue = Number(FlyCat.LL_Sm.parameters['bunsValue'] || 0);
FlyCat.LL_Sm.peopleHValue = Number(FlyCat.LL_Sm.parameters['peopleHValue'] || 0);
FlyCat.LL_Sm.plantHValue = Number(FlyCat.LL_Sm.parameters['plantHValue'] || 0);
FlyCat.LL_Sm.yzHValue = Number(FlyCat.LL_Sm.parameters['yzHValue'] || 0);
FlyCat.LL_Sm.childrenValue = Number(FlyCat.LL_Sm.parameters['childrenValue'] || 0);
FlyCat.LL_Sm.boyValue = Number(FlyCat.LL_Sm.parameters['boyValue'] || 0);
FlyCat.LL_Sm.girlValue = Number(FlyCat.LL_Sm.parameters['girlValue'] || 0);

FlyCat.LL_Sm.zuiText = eval(FlyCat.LL_Sm.parameters['zuiText']) || [];
FlyCat.LL_Sm.kouText = eval(FlyCat.LL_Sm.parameters['kouText']) || [];
FlyCat.LL_Sm.piText = eval(FlyCat.LL_Sm.parameters['piText']) || [];
FlyCat.LL_Sm.xueText = eval(FlyCat.LL_Sm.parameters['xueText']) || [];

FlyCat.LL_Sm.qjValue = Number(FlyCat.LL_Sm.parameters['qjValue'] || 0);
FlyCat.LL_Sm.ljValue = Number(FlyCat.LL_Sm.parameters['ljValue'] || 0);
FlyCat.LL_Sm.sjValue = Number(FlyCat.LL_Sm.parameters['sjValue'] || 0);
FlyCat.LL_Sm.hyValue = Number(FlyCat.LL_Sm.parameters['hyValue'] || 0);

function Scene_LL_SM() {
    this.initialize(...arguments);
}

Scene_LL_SM.prototype = Object.create(Scene_MenuBase.prototype);
Scene_LL_SM.prototype.constructor = Scene_LL_SM;

Scene_LL_SM.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};
Scene_LL_SM.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createTimeWindow();
    this.createStatusWindow();
    this.createSmSptrie();
    this.createL2dSprite();
};
Scene_LL_SM.prototype.createL2dSprite = function () {
    $gameTemp._smLive2dSprite = null;
    $gameTemp._smLive2dSprite = new Sprite();
    this.addChild($gameTemp._smLive2dSprite);
    $gameTemp._smLive2dSprite.addChild(new Sprite_Live2D_Sm(0))
    $gameTemp._smLive2dSprite._live2d = new Game_Live2D();
    $gameTemp._smLive2dSprite.x = 870;
    $gameTemp._smLive2dSprite.y = 47;

    const mouthValue = $gameVariables.value(FlyCat.LL_Sm.mouthValue);
    const thoraxValue = $gameVariables.value(FlyCat.LL_Sm.thoraxValue);
    const vaginaValue = $gameVariables.value(FlyCat.LL_Sm.vaginaValue);
    const bunsValue = $gameVariables.value(FlyCat.LL_Sm.bunsValue);
    const zValue = mouthValue + thoraxValue + vaginaValue + bunsValue;
    if (zValue < 800) {
        var name = 'simi_2'
    } else if (zValue < 1500) {
        var name = 'simi_1'
    } else {
        var name = 'simi'
    }
    $gameTemp._smLive2dSprite._live2d.setModel(name);
    $gameTemp._smLive2dSprite._live2d.setAnimation(0, 'idle');
    $gameTemp._smLive2dSprite.scale.set(0.3);
};
Scene_LL_SM.prototype.createStatusWindow = function () {
    const rect = this.statusWindowRect();
    this._statusLLWindow = new Window_MenuLLStatus(rect);
    this.addChild(this._statusLLWindow);
};
Scene_LL_SM.prototype.statusWindowRect = function () {
    const ww = 800;
    const wh = 700;
    const wx = 180;
    const wy = 70;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LL_SM.prototype.onHyBook = function () {
    SceneManager.push(Scene_LL_HyBook);
};
Scene_LL_SM.prototype.createSmSptrie = function () {
    this._smSptries = [];
    for (let i = 0; i < 4; i++) {
        this._smSptries[i] = new Sprite_Sm();
        this._smSptries[i]._typeId = i;
        this.addChild(this._smSptries[i]);
        this.smValue(i);
    };
};
Scene_LL_SM.prototype.smValue = function (i) {
    switch (i) {
        case 0:
            const mouthValue = $gameVariables.value(FlyCat.LL_Sm.mouthValue) || 0;
            var id = this.smValueImg(mouthValue);
            this._smSptries[i].setup(id);
            this._smSptries[i].x = 640;
            this._smSptries[i].y = 140;
            this._smSptries[i].bitmap = ImageManager.loadBitmap('img/menu/', 'zui' + id);
            break;
        case 1:
            const thoraxValue = $gameVariables.value(FlyCat.LL_Sm.thoraxValue) || 0;
            var id = this.smValueImg(thoraxValue);
            this._smSptries[i].setup(id);
            this._smSptries[i].x = 640;
            this._smSptries[i].y = 260;
            this._smSptries[i].bitmap = ImageManager.loadBitmap('img/menu/', 'xiong' + id);
            break;
        case 2:
            const vaginaValue = $gameVariables.value(FlyCat.LL_Sm.vaginaValue) || 0;
            var id = this.smValueImg(vaginaValue);
            this._smSptries[i].setup(id);
            this._smSptries[i].x = 640;
            this._smSptries[i].y = 380;
            this._smSptries[i].bitmap = ImageManager.loadBitmap('img/menu/', 'xue' + id);
            break;
        case 3:
            const bunsValue = $gameVariables.value(FlyCat.LL_Sm.bunsValue) || 0;
            var id = this.smValueImg(bunsValue);
            this._smSptries[i].setup(id);
            this._smSptries[i].x = 640;
            this._smSptries[i].y = 500;
            this._smSptries[i].bitmap = ImageManager.loadBitmap('img/menu/', 'pi' + id);
            break;
    }
}
Scene_LL_SM.prototype.smValueImg = function (number) {
    if (number < 300) return 1;
    if (number < 600) return 2;
    return 3;
};


function Sprite_Sm() {
    this.initialize(...arguments);
}

Sprite_Sm.prototype = Object.create(Sprite.prototype);
Sprite_Sm.prototype.constructor = Sprite_Sm;

Sprite_Sm.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.createBackSprite();
    this.createBitmap();
    this.createValueSprite();
};
Sprite_Sm.prototype.initMembers = function () {
    this._typeId = -1;
    this._value = 0;
};
Sprite_Sm.prototype.createBitmap = function () {
    const width = 270;
    const height = 40;
    this._valueBitmap = new Bitmap(width, height);
};
Sprite_Sm.prototype.createBackSprite = function () {
    this._backSprite = new Sprite();
    this.addChild(this._backSprite);
    this._backSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'smbq');
    this._backSprite.x = 37;
    this._backSprite.y = 86;
};
Sprite_Sm.prototype.createValueSprite = function () {
    this._valueSprite = new Sprite();
    this.addChild(this._valueSprite);
    this._valueSprite.x = 37;
    this._valueSprite.y = 86;
};
Sprite_Sm.prototype.destroy = function (options) {
    this._valueBitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};
Sprite_Sm.prototype.setup = function (value) {
    this.setupLabelFont();
    this._value = value - 1;
    if (this._typeId == 0) {
        var data = FlyCat.LL_Sm.zuiText;
    } else if (this._typeId == 1) {
        var data = FlyCat.LL_Sm.kouText;
    }
    else if (this._typeId == 2) {
        var data = FlyCat.LL_Sm.piText;
    }
    else if (this._typeId == 3) {
        var data = FlyCat.LL_Sm.xueText;
    }
    var text = data[this._value];
    this._valueBitmap.drawText(text, 0, 0, 250, 28, 'right');
    this._valueBitmap.addLoadListener(this.BitmapLoad.bind(this));
};
Sprite_Sm.prototype.setupLabelFont = function () {
    this._valueBitmap.fontFace = $gameSystem.mainFontFace();
    this._valueBitmap.fontSize = 20;
    this._valueBitmap.textColor = '#fffdfd';
    this._valueBitmap.outlineColor = '#bb5d5e';
    this._valueBitmap.outlineWidth = 3;
};
Sprite_Sm.prototype.BitmapLoad = function (bitmapLoaded) {
    if (this._valueBitmap && this._valueBitmap.isReady()) {
        this._valueSprite.bitmap = this._valueBitmap;
    }
};

class Sprite_Live2D_Sm extends Sprite {
    constructor(...args) {
        super();
        this._pictureId = typeof args[0] == 'number' ? args[0] : 0;
        this._live2d = args[0] instanceof Game_Live2D ? args[0] : null;
        this._isRestore = false;
        this.init();
    }

    init() {
        this.removeChild(this._data);
        this._data = null;
        this._model = '';
        this._track = {};
        this._timeScale = 1;
        this._weight = [];
        this._mix = {};
        this._autoEyeBlink = null;
        this._expression = '';
        this._customExpression = null;
        this._color = {};
        this._mosaic = {};
        this._offset = null;
        this._scale = null;
    }

    live2d() {
        if (this._live2d) {
            return this._live2d;
        }
        let picture = $gameTemp._smLive2dSprite;
        return picture ? picture._live2d : null;
    }

    update() {
        let live2d = this.live2d();
        this.updateModel(live2d);

        if (this._data) {
            this.updateAutoEyeBlink(live2d);
            this.updateColor(live2d);
            this.updateMosaic(live2d);
            this.updateOffset(live2d);
            this.updateScale(live2d);
            this.updateVisible(live2d);
            if (!this._isRestore) {
                this.updateTimeScale(live2d);
                this.updateWeight(live2d);
                this.updateMix(live2d);
                this.updateExpression(live2d);
                this.updateCustomExpression(live2d);
                this.updateAnimation(live2d);
                this.snapshot(live2d);
            } else {
                this.restore(live2d);
            }
        }
        super.update();
    }

    updateModel(live2d) {
        if (live2d) {
            if (live2d.model != this._model) {
                this.init();
                let model = live2d.model.replace(/_\d+$/, '');
                if (model) {
                    let fullName = Game_Live2D.fullName(model);
                    let data = Game_Live2D.live2dData()[fullName];
                    if (data && data.loading == 0) {
                        this._data = new PIXI.Live2D(data);
                        this._data.animation.addListener('start', this.onStart.bind(this));
                        this._data.animation.addListener('end', this.onEnd.bind(this));
                        this.addChild(this._data);
                        if (live2d.snapshot) {
                            this._isRestore = true;
                        }
                    } else if (fullName in Game_Live2D.live2dData() == false) {
                        throw Error(`'${model}' is unknown model.`);
                    }
                }
                if (!model || this._data) {
                    this._model = live2d.model;
                }
            }
        } else if (this._model) {
            this.init();
        }
    }

    updateTimeScale(live2d) {
        if (live2d.timeScale == this._timeScale) return;
        this._timeScale = live2d.timeScale;
        this._data.animation.setTimeScale(this._timeScale);
    }

    updateWeight(live2d) {
        if (live2d.weight == this._weight) return;
        this._weight = live2d.weight;
        this._weight.forEach((value, index) => {
            this._data.animation.setWeight(index, value);
        });
    }

    updateMix(live2d) {
        if (live2d.mix == this._mix) return;
        for (let key in live2d.mix) {
            if (live2d.mix[key] != this._mix[key]) {
                let time = live2d.mix[key];
                if (key == '/default/') {
                    this._data.animation.setDefaultMix(time);
                } else {
                    let [from, to] = key.split('/');
                    this._data.animation.setMix(from, to, time);
                }
            }
        }
        for (let key in this._mix) {
            if (key in live2d.mix == false) {
                if (key == '/default/') {
                    this._data.animation.setDefaultMix(0);
                } else {
                    let [from, to] = key.split('/');
                    this._data.animation.setMix(from, to, 0);
                }
            }
        }
        this._mix = live2d.mix;
    }

    updateAutoEyeBlink(live2d) {
        if (live2d.autoEyeBlink == this._autoEyeBlink) return;
        this._autoEyeBlink = live2d.autoEyeBlink;
        this._data.animation.setAutoEyeBlink(this._autoEyeBlink.enabled, this._autoEyeBlink.options);
    }

    updateExpression(live2d) {
        if (live2d.expression == this._expression) return;
        this._expression = live2d.expression;
        if (this._expression) {
            this._data.direction.setExpression(this._expression);
        } else {
            this._data.direction.clearExpression();
        }
    }

    updateCustomExpression(live2d) {
        if (live2d.customExpression == this._customExpression) return;
        this._customExpression = live2d.customExpression;
        if (this._customExpression) {
            this._data.direction.setCustomExpression(this._customExpression);
        }
    }

    updateColor(live2d) {
        if (live2d.color == this._color) return;
        for (let id in live2d.color) {
            if (live2d.color[id] != this._color[id]) {
                let color = live2d.color[id];
                let filter = new PIXI.filters.ColorMatrixFilter();
                filter.matrix = [
                    color[0], 0, 0, 0, 0,
                    0, color[1], 0, 0, 0,
                    0, 0, color[2], 0, 0,
                    0, 0, 0, color[3], 0
                ];
                let target = (id == '/default/') ? this._data : this.getArtMesh(id);
                let filters = (target.filters || []).filter(filter => {
                    return filter instanceof PIXI.filters.ColorMatrixFilter == false;
                });
                filters.push(filter);
                target.filters = filters;
            }
        }
        for (let id in this._color) {
            if (id in live2d.color == false) {
                let target = (id == '/default/') ? this._data : this.getArtMesh(id);
                let filters = (target.filters || []).filter(filter => {
                    return filter instanceof PIXI.filters.ColorMatrixFilter == false;
                });
                target.filters = filters.length > 0 ? filters : null;
            }
        }
        this._color = live2d.color;
    }

    updateMosaic(live2d) {
        if (live2d.mosaic == this._mosaic) return;
        for (let id in live2d.mosaic) {
            if (live2d.mosaic[id] != this._mosaic[id]) {
                let size = live2d.mosaic[id];
                let filter = new MosaicFilter(size);
                let target = (id == '/default/') ? this._data : this.getArtMesh(id);
                let filters = (target.filters || []).filter(filter => {
                    return filter instanceof MosaicFilter == false;
                });
                filters.push(filter);
                target.filters = filters;
            }
        }
        for (let id in this._mosaic) {
            if (id in live2d.mosaic == false) {
                let target = (id == '/default/') ? this._data : this.getArtMesh(id);
                let filters = (target.filters || []).filter(filter => {
                    return filter instanceof MosaicFilter == false;
                });
                target.filters = filters.length > 0 ? filters : null;
            }
        }
        this._mosaic = live2d.mosaic;
    }

    updateOffset(live2d) {
        if (live2d.offset == this._offset) return;
        this._offset = live2d.offset;
        this.x = this._offset.x;
        this.y = this._offset.y;
    }

    updateScale(live2d) {
        if (live2d.scale == this._scale) return;
        this._scale = live2d.scale;
        this.scale.x = this._scale.x;
        this.scale.y = this._scale.y;
    }

    updateVisible(live2d) {
        this.visible = live2d.visible;
    }

    updateAnimation(live2d) {
        if (live2d.track == this._track) return;
        for (let id in live2d.track) {
            if (live2d.track[id] != this._track[id]) {
                let track = live2d.track[id];
                if (track.clear) {
                    this._data.animation.clearAnimation(Number(id), track.mixTime);
                    continue;
                }
                let list = [];
                let loop = track.continuance != 'none';
                for (let animation of track.list) {
                    for (let j = 0; j < animation.times; j++) {
                        list.push(animation);
                    }
                }
                if (track.order == 'shuffle') {
                    let _list = [...list];
                    list = [];
                    while (_list.length > 0) {
                        let index = Math.floor(Math.random() * _list.length);
                        list.push(_list.splice(index, 1)[0]);
                    }
                } else if (track.order == 'random') {
                    let index = Math.floor(Math.random() * list.length);
                    list = [list[index]];
                }
                list.forEach((animation, index) => {
                    let entry;
                    if (index == 0 && track.interrupt) {
                        entry = this._data.animation.setAnimation(Number(id), animation.name, loop);
                    } else {
                        entry = this._data.animation.addAnimation(Number(id), animation.name, loop);
                    }
                    entry.timeScale = animation.timeScale;
                    entry.weight = animation.weight;
                });
            }
        }
        this._track = live2d.track;
    }

    getArtMesh(id) {
        let index = this._data.model.drawables.ids.indexOf(id);
        return this._data._meshes[index];
    }

    onStart(trackInfo) {
        if (trackInfo.track.entries.length == 1) {
            this.resetAnimation(trackInfo.index);
        }
    }

    onEnd(trackInfo) {
        this.onStart(trackInfo);
    }

    resetAnimation(index) {
        let live2d = this.live2d();
        if (live2d && live2d.track[index]) {
            if (live2d.track[index] == this._track[index]) {
                if (this._track[index].continuance == 'reset') {
                    live2d.track[index].interrupt = false;
                    this._track = { ...this._track };
                    this._track[index] = null;
                }
            }
        }
    }

    snapshot(live2d) {
        live2d.snapshot = this._data.snapshot();
    }

    restore(live2d) {
        this._data.restore(live2d.snapshot);
        this._timeScale = live2d.timeScale;
        this._weight = live2d.weight;
        this._mix = live2d.mix;
        this._expression = live2d.expression;
        this._track = live2d.track;
        this._isRestore = false;
    }
}