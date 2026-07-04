//=============================================================================
// RPG Maker MZ - Live2dCore
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<Live2dCore>
 * @author FlyCat
 * @base PictureLive2D.js
 * @help
 * 
 */

'use strict';
var Imported = Imported || {};
Imported.FlyCat_Live2dCore = true;

var FlyCat = FlyCat || {};
FlyCat.Live2dCore = {};
FlyCat.Live2dCore.parameters = PluginManager.parameters('FlyCat_Live2dCore');

Scene_LL_Title.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    // this._bg = new Sprite_TitleBg(this._isStatic);
    this.createLive2dBackGround();
    this._log = new Sprite_GameLogo(this._isStatic);
    //   this.addChild(this._bg);
    this.addChild(this._log);
    this.createCommandWindow();
    this.createMenuButtons();
    this.createEffectMask();
    this.createExitInquiry();
};
Scene_Title.prototype.playTitleMusic = function () {
    var name = $dataSystem.titleBgm;
    if (ConfigManager._saveVariables && ConfigManager._saveVariables[15]) {
        const value = Number(ConfigManager._saveVariables[15])
        if (value > 500) var name = {
            name: "1-FM02",
            pan: 0,
            pitch: 100,
            volume: 90,
        };
        if (value > 1000) var name = {
            name: "1-FM03",
            pan: 0,
            pitch: 100,
            volume: 90,
        };
    }
    AudioManager.playBgm(name);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};
Scene_LL_Title.prototype.startDisplyOther = function () {
    //  this._bg.startShow();
    $gameTemp._live2dSprite.visible = true;
    this._effectMask.start();
    this._commandWindow.show();
    this._commandWindow.activate();
    Scene_Title.prototype.playTitleMusic.call(this);
    this._flyPlayBg = true;
};
Scene_LL_Title.prototype.createLive2dBackGround = function () {
    $gameTemp._live2dSprite = new Sprite();
    this.addChild($gameTemp._live2dSprite);
    $gameTemp._live2dSprite.visible = false;
    $gameTemp._live2dSprite.addChild(new Sprite_Live2D_Title(0))
    $gameTemp._live2dSprite._live2d = new Game_Live2D();
    var name = 'fengmian';
    if (ConfigManager._saveVariables && ConfigManager._saveVariables[15]) {
        const value = Number(ConfigManager._saveVariables[15])
        if (value > 500) var name = 'fengmian_1';
        if (value > 1000) var name = 'fengmian_2';
    }
    $gameTemp._live2dSprite._live2d.setModel(name);
    $gameTemp._live2dSprite._live2d.setAnimation(0, 'idle');
    $gameTemp._live2dSprite.scale.set(0.33);
};
TitleMask_Item.prototype.initialize = function (type) {
    Sprite.prototype.initialize.call(this);// ImageManager.loadUi('花瓣')
    const s = Math.min(1, Math.random() + 0.4);
    this.anchor = new Point(0.5, 0.5);
    this.scale = new Point(s, s);
    this.setup();
};

class Sprite_Live2D_Title extends Sprite {
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
        let picture = $gameTemp._live2dSprite;
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

window.Sprite_Live2D = Sprite_Live2D;