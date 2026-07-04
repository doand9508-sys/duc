//=============================================================================
// RPG Maker MZ - Children_X
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 Cat-<Children_X>
 * @author Cat
 * 
 * @param wsEvent
 * @text 喂食触发公共事件
 * @type common_event
 * @default
 * 
 * @param hdEvent
 * @text 互动陪伴触发公共事件
 * @type common_event
 * @default
 * 
 * @param chdEvent
 * @text 成年互动触发公共事件
 * @type common_event
 * @default
 * 
 * @param ywEvent
 * @text 游玩触发公共事件
 * @type common_event
 * @default
 * 
 * @param ssEvent
 * @text 私塾触发公共事件
 * @type common_event
 * @default
 * 
 * @param dgEvent
 * @text 打工触发公共事件
 * @type common_event
 * @default
 * 
 * @command endEvent
 * @text 结束公共事件
 * @desc 结束公共事件
 * 
 * @command addChild
 * @text 生孩子
 * @desc 生孩子
 * 
 * @command removeChild
 * @text 删除指定id孩子
 * @desc 删除指定id孩子
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text 孩子序号
 * @desc 孩子序号
 * 
 * @command openChildWindow
 * @text 打开孩子界面
 * @desc 打开孩子界面
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text 孩子序号
 * @desc 孩子序号
 * 
 * @command closeChildWindow
 * @text 关闭孩子界面
 * @desc 关闭孩子界面
 * 
 * @command hideChildWindow
 * @text 隐藏/显示孩子界面
 * @desc 隐藏/显示孩子界面
 * 
 * @arg type
 * @type boolean
 * @default 
 * @on 显示
 * @off 隐藏
 * @text 显示/隐藏
 * 
 * @help
 * 孩子数值序号：
 * 1.年龄 2.美貌 3.体力 4.好感度 
 * 5.根骨 6.福源 7.审美 8.悟性
 * 9.欲望 10.胸围 11.长短 12.美貌
 * 脚本：
 * 增减指定孩子属性(id,paramId,value)
 * 范例：
 * 增减指定孩子属性(1,2,30)//增加1号孩子2号属性30点，即增加美貌20点
 * 
 * 当前孩子数量();//获取当前孩子数量
 * 获取指定孩子年龄(id);
 * 获取指定孩子排行(id);
 * 获取指定孩子性格(id);
 * 获取指定孩子灵根(id);
 * 获取指定孩子外貌(id);
 * 获取指定孩子命根(id);//男
 * 获取指定孩子胸围(id);//女
 * 获取指定孩子体力(id);
 * 获取指定孩子好感度(id);
 * 获取指定孩子根骨(id);
 * 获取指定孩子福源(id);
 * 获取指定孩子审美(id);
 * 获取指定孩子美貌(id);
 * 获取指定孩子悟性(id);
 * 获取指定孩子欲望(id);
 * 获取指定孩子母亲评价(id);
 * 获取指定孩子喜欢物品(id);
 * 获取指定孩子讨厌物品(id);
 * 设置指定孩子对母亲评价(id, text);
 * 范例：设置指定孩子对母亲评价(1, '好妈妈')//设置1号孩子对妈妈评价为好妈妈
 * 设置指定孩子喜欢物品(id, item);
 * 范例： 设置指定孩子喜欢物品(1, '糖果');//设置1号孩子喜欢物品为糖果
 * 设置指定孩子讨厌物品(id, item);
 * 范例： 设置指定孩子喜欢物品(1, '糖果');//设置1号孩子讨厌物品为糖果
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_Children_X = true;

var FlyCat = FlyCat || {};
Cat.Children_X = {};
Cat.Children_X.parameters = PluginManager.parameters('Cat_Children_X');
Cat.Children_X.wsEvent = Number(Cat.Children_X.parameters['wsEvent']);
Cat.Children_X.hdEvent = Number(Cat.Children_X.parameters['hdEvent']);
Cat.Children_X.chdEvent = Number(Cat.Children_X.parameters['chdEvent']);
Cat.Children_X.ywEvent = Number(Cat.Children_X.parameters['ywEvent']);
Cat.Children_X.ssEvent = Number(Cat.Children_X.parameters['ssEvent']);
Cat.Children_X.dgEvent = Number(Cat.Children_X.parameters['dgEvent']);

PluginManager.registerCommand('Cat_Children_X', 'hideChildWindow', args => {
    const type = eval(args.type);
    SceneManager._scene.hideNewChildren(type);
});

PluginManager.registerCommand('Cat_Children_X', 'addChild', args => {
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    // if ($gameSystem._newChildData.length < 5) {
    const lingGen = ['金', '木', '水', '火', '土', '雷', '冰', '天'];
    const xingGe = ['开朗', '阴险', '色情', '忠诚'];
    const xingBie = ['男', '女'];
    const ziSe = ['丑陋无比', '平平无奇', '眉清目秀', '秀色可餐', '明眸皓齿', '出水芙蓉', '国色天香'];
    const children = {
        name: '', paihang: $gameSystem._newChildData.length + 1, year: 0,
        xingge: '', linggen: '', waimao: 0, changduan: 0, tili: 100,
        haogandu: 0, gengu: 0, fuyuan: 0, shenmei: 0, meimao: 0, wuxing: 0,
        yuwang: 0, pingjia: '无', item: '无', item2: '无', xiongwei: 0, xingbie: ''
    };
    children.name = $gameTemp._childrenName || '无名';
    children.linggen = lingGen[Math.floor((Math.random() * lingGen.length))];
    children.xingge = xingGe[Math.floor((Math.random() * xingGe.length))];
    children.xingbie = xingBie[Math.floor((Math.random() * xingBie.length))];
    children.waimao = Math.floor((Math.random() * 170) + 30);//外貌

    if (children.xingbie === '男') {
        children.changduan = Math.floor(Math.random() * 5)//0-5
    }
    else {
        children.changduan = null;
        children.xiongwei = Math.floor((Math.random() * 20) + 30)//30-50
    }

    children.gengu = Math.floor((Math.random() * 100) + 1);//根骨
    children.fuyuan = Math.floor((Math.random() * 50) + 1);//福源
    children.shenmei = Math.floor((Math.random() * 50) + 1);//审美
    children.wuxing = Math.floor((Math.random() * 50) + 1);//悟性
    children.yuwang = Math.floor((Math.random() * 50) + 1);//欲望

    if (children.waimao >= 0 && children.waimao <= 50) {
        children.ziSe = ziSe[0];
    }
    if (children.waimao > 51 && children.waimao <= 100) {
        children.ziSe = ziSe[1];
    }
    if (children.waimao > 100 && children.waimao <= 150) {
        children.ziSe = ziSe[2];
    }
    if (children.waimao > 150 && children.waimao <= 200) {
        children.ziSe = ziSe[3];
    }
    if (children.waimao > 250 && children.waimao <= 300) {
        children.ziSe = ziSe[4];
    }
    if (children.waimao > 350 && children.waimao <= 400) {
        children.ziSe = ziSe[5];
    }
    if (children.waimao > 450) children.ziSe = ziSe[6];
    for (let i = 0; i < 5; i++) {
        if (!$gameSystem._newChildData[i]) {
            $gameSystem._newChildData[i] = children;
            break;
        }
    }
    for (let i = 0; i < $gameSystem._newChildData.length; i++) {
        if ($gameSystem._newChildData[i]) {
            if (i == 0) {
                var actorId = 26;
            } else if (i == 1) {
                var actorId = 27;
            } else if (i == 2) {
                var actorId = 28;
            } else if (i == 3) {
                var actorId = 29;
            } else if (i == 4) {
                var actorId = 30;
            }
            $gameActors.actor(actorId).setName($gameSystem._newChildData[i].name);//将名字传给孩子角色
        };
    }
    //  }
});

PluginManager.registerCommand('Cat_Children_X', 'openChildWindow', args => {
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    const id = Number(args.id) - 1;
    SceneManager._scene.openNewChildren(id);
});

PluginManager.registerCommand('Cat_Children_X', 'removeChild', args => {
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    const id = Number(args.id) - 1;
    if ($gameSystem._newChildData[id]) {
        $gameSystem._newChildData[id] = null;
    }
});

PluginManager.registerCommand('Cat_Children_X', 'closeChildWindow', args => {
    SceneManager._scene.closeNewChildren();
});

PluginManager.registerCommand('Cat_Children_X', 'endEvent', args => {
    if (SceneManager._scene._newChildren.year < 6) {
        SceneManager._scene._newChildrenCommandWindow.activate();
    } else {
        SceneManager._scene._newChildrenCommandWindow.hide();
        SceneManager._scene._newChildrenCommandWindow.deactivate();
        SceneManager._scene._newChildrenCommandWindow_x.show();
        SceneManager._scene._newChildrenCommandWindow_x.activate();
    }
    SceneManager._scene._newChildBlackSprite.hide();
});

Cat.Children_X.Scene_Map_callMenu = Scene_Map.prototype.callMenu;
Scene_Map.prototype.callMenu = function () {
    if (this._newChildBackSprite.visible) { return false; }
    Cat.Children_X.Scene_Map_callMenu.call(this);
};

Cat.Children_X.Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function () {
    if (Cat.Children_X._sceneMap._newChildBackSprite.visible) {
        return false;
    } else {
        return Cat.Children_X.Game_Player_canMove.call(this);
    }
};

Cat.Children_X.Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function () {
    Cat.Children_X.Scene_Map_createSpriteset.call(this);
    Cat.Children_X._sceneMap = this;
    this.createNewChildrenWindow();
};

Cat.Children_X.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
    Cat.Children_X.Scene_Map_update.call(this);
    if (Cat.Children_X._sceneMap._newChildBackSprite.visible && this._newChildActorSprite
        && this._newChildActorSprite.visible) {
        var img = '';
        if (this._newChildren.year < 6) {
            if (this._newChildren.xingbie == '男') {
                var img = 'nanhai';
            } else {
                var img = 'nvhai';
            }
        } else if (this._newChildren.year < 14) {
            if (this._newChildren.xingge == '开朗') {
                var imgx = 'kl';
            } else if (this._newChildren.xingge == '色情') {
                var imgx = 'sq';
            } else if (this._newChildren.xingge == '阴险') {
                var imgx = 'yx';
            } else if (this._newChildren.xingge == '忠诚') {
                var imgx = 'zc';
            }
            if (this._newChildren.xingbie == '男') {
                var img = 'nant' + imgx;
            } else {
                var img = 'nvt' + imgx;
            }
        } else {
            if (this._newChildren.xingbie == '男') {
                if (this._newChildren.xingge == '开朗') {
                    var imgx = 'kl';
                } else if (this._newChildren.xingge == '色情') {
                    var imgx = 'sq';
                } else if (this._newChildren.xingge == '阴险') {
                    var imgx = 'yx';
                } else if (this._newChildren.xingge == '忠诚') {
                    var imgx = 'zc';
                }
                var img = 'cnan' + imgx;
            } else {
                var img = 'cnv' + imgx;
            }
        }
        this._newChildActorSprite.bitmap = ImageManager.loadBitmap('img/menu/', img);

    }
};
Scene_Map.prototype.openNewChildren = function (id) {
    this._openNewChilrenId = id;
    this._newChildren = $gameSystem._newChildData[this._openNewChilrenId];
    this._newChildrenInfoWindow.setData(this._newChildren);
    this._newChildBackSprite.show();
    this._newChildActorSprite.show();
    this._newChildrenInfoWindow.show();
    if (Imported.FlyCat_AutoLookNpc) {
        $gameSystem._lookNpcButtonVisible = false;
    };
    if (this._newChildren.year < 6) {
        this._newChildrenCommandWindow.show();
        this._newChildrenCommandWindow.activate();
    } else {
        this._newChildrenCommandWindow_x.show();
        this._newChildrenCommandWindow_x.activate();
    }
};

Scene_Map.prototype.hideNewChildren = function (type) {
    if (type == false) {
        this._newChildBackSprite.hide();
        this._newChildrenInfoWindow.hide();
        this._newChildActorSprite.hide();
        if (this._newChildBlackSprite.visible == true) {
            this._newChildBlackSprite._oldVisible = true;
            this._newChildBlackSprite.hide();
        }
        if (this._newChildren.year < 6) {
            this._newChildrenCommandWindow.hide();
        } else {
            this._newChildrenCommandWindow_x.hide();
        }
    } else {
        if (this._newChildBlackSprite._oldVisible) {
            this._newChildBlackSprite.show();
            this._newChildBlackSprite._oldVisible = false;
        }
        this._newChildBackSprite.show();
        this._newChildrenInfoWindow.show();
        this._newChildActorSprite.show();
        if (this._newChildren.year < 6) {
            this._newChildrenCommandWindow.show();
        } else {
            this._newChildrenCommandWindow_x.show();
        }
    }
};

Scene_Map.prototype.closeNewChildren = function () {
    this._newChildBackSprite.hide();
    this._newChildrenInfoWindow.hide();
    this._newChildActorSprite.hide();
    this._newChildrenCommandWindow.hide();
    this._newChildrenCommandWindow.deactivate();
    this._newChildrenCommandWindow_x.hide();
    this._newChildrenCommandWindow_x.deactivate();
    if (Imported.FlyCat_AutoLookNpc) {
        $gameSystem._lookNpcButtonVisible = true;
    };
};

Scene_Map.prototype.createNewChildrenWindow = function () {
    this.createNewChildrenBackWindow();
    this.createNewChildrenActorSprite();
    this.createNewChildrenBlackSprite();
    this.createNewChildrenCommandWindow();
};

Scene_Map.prototype.createNewChildrenCommandWindow = function () {
    const rect = this.newChildrenCommandWindowRect();
    this._newChildrenCommandWindow = new Window_NewChildrenCommand(rect);
    this._newChildrenCommandWindow.setHandler("ws", this.ws.bind(this));
    this._newChildrenCommandWindow.setHandler("hd", this.pb.bind(this));
    this._newChildrenCommandWindow.setHandler("lk", this.closeNewChildren.bind(this));
    this.addChild(this._newChildrenCommandWindow);
    this._newChildrenCommandWindow.hide();
    this._newChildrenCommandWindow.deactivate();

    const rect_x = this.newChildrenCommandWindowRect_X();
    this._newChildrenCommandWindow_x = new Window_NewChildrenCommand_X(rect_x);
    this._newChildrenCommandWindow_x.setHandler("ss", this.ss.bind(this));
    this._newChildrenCommandWindow_x.setHandler("yw", this.yw.bind(this));
    this._newChildrenCommandWindow_x.setHandler("dg", this.dg.bind(this));
    this._newChildrenCommandWindow_x.setHandler("hd", this.hd.bind(this));
    this._newChildrenCommandWindow_x.setHandler("lk", this.closeNewChildren.bind(this));
    this.addChild(this._newChildrenCommandWindow_x);
    this._newChildrenCommandWindow_x.hide();
    this._newChildrenCommandWindow_x.deactivate();
};

Scene_Map.prototype.ws = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.wsEvent))
};

Scene_Map.prototype.pb = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.hdEvent))
};

Scene_Map.prototype.ss = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.ssEvent))
};

Scene_Map.prototype.yw = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.ywEvent))
};

Scene_Map.prototype.dg = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.dgEvent))
};

Scene_Map.prototype.hd = function () {
    this._newChildBlackSprite.show();
    $gameTemp.reserveCommonEvent(Number(Cat.Children_X.chdEvent))
};

Scene_Map.prototype.newChildrenCommandWindowRect = function () {
    const ww = 360;
    const wh = 80;
    const wx = 664 + 80;
    const wy = 530;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Map.prototype.newChildrenCommandWindowRect_X = function () {
    const ww = 360;
    const wh = 120;
    const wx = 664 + 80;
    const wy = 510;
    return new Rectangle(wx, wy, ww, wh);
};


Scene_Map.prototype.createNewChildrenBlackSprite = function () {
    this._newChildBlackSprite = new Sprite();
    this.addChild(this._newChildBlackSprite);
    this._newChildBlackSprite._oldVisible = false;
    this._newChildBlackSprite.hide();
    this._newChildBlackSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'backLay');
};

Scene_Map.prototype.createNewChildrenActorSprite = function () {
    this._newChildActorSprite = new Sprite();
    this.addChild(this._newChildActorSprite);
    this._newChildActorSprite.anchor.set(0.5);
    this._newChildActorSprite.x = 384;
    this._newChildActorSprite.y = 350;
    this._newChildActorSprite.hide();
};

Scene_Map.prototype.createNewChildrenBackWindow = function () {
    this._newChildBackSprite = new Sprite();
    this.addChild(this._newChildBackSprite);
    this._newChildBackSprite.hide();
    this._newChildBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', '孩子新UI');

    this._newChildActorSprite = new Sprite();
    this.addChild(this._newChildActorSprite);

    const rect = this.newChildrenInfoWindowRect();
    this._newChildrenInfoWindow = new Window_NewChildrenInfo(rect);
    this.addChild(this._newChildrenInfoWindow);
    this._newChildrenInfoWindow.hide();
};

Scene_Map.prototype.newChildrenInfoWindowRect = function () {
    const ww = 1184;
    const wh = 624;
    const wx = 48;
    const wy = 48 + 60;
    return new Rectangle(wx, wy, ww, wh);
};

function Window_NewChildrenCommand() {
    this.initialize(...arguments);
}

Window_NewChildrenCommand.prototype = Object.create(Window_Command.prototype);
Window_NewChildrenCommand.prototype.constructor = Window_NewChildrenCommand;

Window_NewChildrenCommand.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_NewChildrenCommand.prototype.drawBackgroundRect = function (rect) {
    const c1 = ColorManager.itemBackColor1();
    const c2 = ColorManager.itemBackColor2();
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    // this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    // this.contentsBack.strokeRect(x, y, w, h, c1);
    this.contentsBack.strokeRect(x, y, w, h, '#763940');
};

Window_NewChildrenCommand.prototype.makeCommandList = function () {
    this.contents.fontSize = 20;
    this.addCommand('喂食', 'ws', true);
    this.addCommand('互动陪伴', 'hd', true);
    this.addCommand('离开', 'lk', true);
};

Window_NewChildrenCommand.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    //this.changePaintOpacity(this.isCommandEnabled(index));
    this.changeTextColor('#763940');
    this.contents.outlineColor = '#c2a29b';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 22;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_NewChildrenCommand.prototype.maxItems = function () {
    return 3;
};

Window_NewChildrenCommand.prototype.rowSpacing = function () {
    return 10;
};

Window_NewChildrenCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_NewChildrenCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewChildrenCommand.prototype.maxCols = function () {
    return 3;
};

function Window_NewChildrenCommand_X() {
    this.initialize(...arguments);
}

Window_NewChildrenCommand_X.prototype = Object.create(Window_Command.prototype);
Window_NewChildrenCommand_X.prototype.constructor = Window_NewChildrenCommand_X;

Window_NewChildrenCommand_X.prototype.initialize = function (rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.opacity = 0;
};

Window_NewChildrenCommand_X.prototype.drawBackgroundRect = function (rect) {
    const c1 = ColorManager.itemBackColor1();
    const c2 = ColorManager.itemBackColor2();
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    // this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    // this.contentsBack.strokeRect(x, y, w, h, c1);
    this.contentsBack.strokeRect(x, y, w, h, '#763940');
};

Window_NewChildrenCommand_X.prototype.makeCommandList = function () {
    this.contents.fontSize = 20;
    this.addCommand('上私塾', 'ss', true);
    this.addCommand('出去游玩', 'yw', true);
    this.addCommand('打工', 'dg', true);
    this.addCommand('互动', 'hd', true);
    this.addCommand('离开', 'lk', true);
};

Window_NewChildrenCommand_X.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    //this.changePaintOpacity(this.isCommandEnabled(index));
    this.changeTextColor('#763940');
    this.contents.outlineColor = '#c2a29b';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 22;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_NewChildrenCommand_X.prototype.maxItems = function () {
    return 5;
};

Window_NewChildrenCommand_X.prototype.rowSpacing = function () {
    return 10;
};

Window_NewChildrenCommand_X.prototype.numVisibleRows = function () {
    return 2;
};

Window_NewChildrenCommand_X.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_NewChildrenCommand_X.prototype.maxCols = function () {
    return 3;
};

function Window_NewChildrenInfo() {
    this.initialize(...arguments);
}

Window_NewChildrenInfo.prototype = Object.create(Window_Base.prototype);
Window_NewChildrenInfo.prototype.constructor = Window_NewChildrenInfo;

Window_NewChildrenInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._childrenData = null;
};

Window_NewChildrenInfo.prototype.setData = function (children) {
    this._childrenData = children;
};

Window_NewChildrenInfo.prototype.refresh = function () {
    this.createContents();
    this.resetTextColor();
    const x = 735;
    const y = 28;
    this.changeTextColor('#763940');
    this.contents.outlineColor = '#c2a29b';
    this.contents.outlineWidth = 1;
    this.contents.fontSize = 22;
    var ofy = 24;
    this.drawText("姓名: " + this._childrenData.name, x, y, this.width, 'left ');
    this.drawText("排行: " + this._childrenData.paihang, x + 150, y, this.width, 'left ');
    this.drawText("年龄: " + this._childrenData.year, x, y + ofy, this.width, 'left ');
    this.drawText("性格: " + this._childrenData.xingge, x + 150, y + ofy, this.width, 'left ');
    this.drawText("灵根资质: " + this._childrenData.linggen, x, y + ofy * 2, this.width, 'left ');
    this.drawText("外貌: " + this._childrenData.ziSe + '(' + this._childrenData.waimao + ')', x, y + ofy * 3, this.width, 'left ');
    if (this._childrenData.xingbie == '男') {
        this.drawText("命根长短: " + this._childrenData.changduan, x, y + ofy * 4, this.width, 'left ');
    } else {
        this.drawText("胸围: " + this._childrenData.xiongwei, x, y + ofy * 4, this.width, 'left ');
    }
    this.drawText("体力: " + this._childrenData.tili, x, y + ofy * 5, this.width, 'left ');
    this.drawText("好感度: " + this._childrenData.haogandu, x, y + ofy * 6, this.width, 'left ');

    this.drawText("根骨: " + this._childrenData.gengu, x, y + ofy * 8, this.width, 'left ');
    this.drawText("福源: " + this._childrenData.fuyuan, x + 150, y + ofy * 8, this.width, 'left ');
    this.drawText("审美: " + this._childrenData.shenmei, x, y + ofy * 9, this.width, 'left ');
    this.drawText("美貌: " + this._childrenData.meimao, x + 150, y + ofy * 9, this.width, 'left ');
    this.drawText("悟性: " + this._childrenData.wuxing, x, y + ofy * 10, this.width, 'left ');
    this.drawText("欲望: " + this._childrenData.yuwang, x + 150, y + ofy * 10, this.width, 'left ');

    this.drawText("对母亲评价: " + this._childrenData.pingjia, x, y + ofy * 12, this.width, 'left ');
    // this.drawText("喜欢物品: " + this._childrenData.item, x, y + ofy * 13, this.width, 'left ');
    // this.drawText("讨厌物品: " + this._childrenData.item2, x, y + ofy * 14, this.width, 'left ');
};

Window_NewChildrenInfo.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (this.visible && this._childrenData) {
        this.refresh();
    };
};

function 当前孩子数量() {
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    var number = 0;
    for (let i = 0; i < 5; i++) {
        if ($gameSystem._newChildData[i]) {
            number++;
        }
    }
    return number;
};

function 获取指定孩子性别(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].xingbie;
    }
    return 0;
};

function 获取指定孩子年龄(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].year;
    }
    return 0;
};

function 获取指定孩子排行(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].paihang;
    }
    return 0;
};

function 获取指定孩子性格(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].xingge;
    }
    return '无';
};

function 获取指定孩子灵根(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].linggen;
    }
    return '无';
};

function 获取指定孩子外貌(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].ziSe;
    }
    return '无';
};

function 获取指定孩子命根(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].changduan;
    }
    return 0;
};

function 获取指定孩子胸围(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].xiongwei;
    }
    return 0;
};

function 获取指定孩子体力(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].tili;
    }
    return 0;
};

function 获取指定孩子好感度(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].haogandu;
    }
    return 0;
};

function 获取指定孩子根骨(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].gengu;
    }
    return 0;
};

function 获取指定孩子福源(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].fuyuan;
    }
    return 0;
};

function 获取指定孩子审美(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].shenmei;
    }
    return 0;
};

function 获取指定孩子美貌(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].meimao;
    }
    return 0;
};

function 获取指定孩子悟性(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].wuxing;
    }
    return 0;
};

function 获取指定孩子欲望(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].yuwang;
    }
    return 0;
};

function 获取指定孩子母亲评价(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].pingjia;
    }
    return '无';
};

function 获取指定孩子喜欢物品(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].item;
    }
    return '无';
};

function 获取指定孩子讨厌物品(id) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        return $gameSystem._newChildData[id].item2;
    }
    return '无';
};

function 设置指定孩子对母亲评价(id, text) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        $gameSystem._newChildData[id].pingjia = text;
    }
};

function 设置指定孩子喜欢物品(id, item) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        $gameSystem._newChildData[id].item = item;
    }
};

function 设置指定孩子讨厌物品(id, item) {
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        $gameSystem._newChildData[id].item2 = item;
    }
};

function 增减指定孩子属性(id, paramId, value) {
    if (value == 0) return;
    var id = Number(id) - 1;
    if (!$gameSystem._newChildData) {
        $gameSystem._newChildData = [];
    };
    if ($gameSystem._newChildData[id]) {
        if (paramId == 1) {
            $gameSystem._newChildData[id].year += value;
        }
        if (paramId == 2) {
            $gameSystem._newChildData[id].waimao += value;
            const children = $gameSystem._newChildData[id];
            const ziSe = ['丑陋无比', '平平无奇', '眉清目秀', '秀色可餐', '明眸皓齿', '出水芙蓉', '国色天香'];
            if (children.waimao >= 0 && children.waimao <= 50) {
                children.ziSe = ziSe[0];
            }
            if (children.waimao > 51 && children.waimao <= 100) {
                children.ziSe = ziSe[1];
            }
            if (children.waimao > 100 && children.waimao <= 150) {
                children.ziSe = ziSe[2];
            }
            if (children.waimao > 150 && children.waimao <= 200) {
                children.ziSe = ziSe[3];
            }
            if (children.waimao > 250 && children.waimao <= 300) {
                children.ziSe = ziSe[4];
            }
            if (children.waimao > 350 && children.waimao <= 400) {
                children.ziSe = ziSe[5];
            }
            if (children.waimao > 450) {
                children.ziSe = ziSe[6];
            };
        }
        if (paramId == 3) {
            $gameSystem._newChildData[id].tili += value;
        }
        if (paramId == 4) {
            $gameSystem._newChildData[id].haogandu += value;
        }
        if (paramId == 5) {
            $gameSystem._newChildData[id].gengu += value;
        }
        if (paramId == 6) {
            $gameSystem._newChildData[id].fuyuan += value;
        }
        if (paramId == 7) {
            $gameSystem._newChildData[id].shenmei += value;
        }
        if (paramId == 8) {
            $gameSystem._newChildData[id].wuxing += value;
        }
        if (paramId == 9) {
            $gameSystem._newChildData[id].yuwang += value;
        }
        if (paramId == 10) {
            $gameSystem._newChildData[id].xiongwei += value;
        }
        if (paramId == 11) {
            $gameSystem._newChildData[id].changduan += value;
        }
        if (paramId == 12) {
            $gameSystem._newChildData[id].meimao += value;
        }
    }
};

Scene_Message.prototype.eventItemWindowRect = function () {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(4, true);
    const wx = 0;
    const wy = Graphics.height - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Window_EventItem.prototype.updatePlacement = function () {
    // if (this._messageWindow.y >= Graphics.boxHeight / 2) {
    //     this.y = 0;
    // } else {
    this.y = Graphics.boxHeight - this.height;
    // }
};

Window_EventItem.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if ($gameTemp._catItem) {
        this._data = $gameParty.allItems().filter(item => this.includes(item) && item.meta.赠送孩子);
    }
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_EventItem.prototype.onOk = function () {
    const item = this.item();
    const itemId = item ? item.id : 0;
    if ($gameTemp._catItem) {
        if (item.meta.赠送孩子) {
            const meta = item.meta.赠送孩子.split(',');
            for (let s = 0; s < meta.length; s += 2) {
                const paramId = Number(meta[s]);
                const value = Number(meta[s + 1]);
                const childrenId = $gameVariables.value(777);
                增减指定孩子属性(childrenId, paramId, value);
                const paramText = ['年龄', '外貌', '体力', '好感度', '根骨', '福源', '审美', '悟性', '欲望', '胸围', '长短', '美貌'];
                // console.log('孩子收到了你的礼物' + item.name + ',' + paramText[paramId - 1] + '属性' + '增加' + value + '点')
                // alert('孩子收到了你的礼物' + item.name + ',' + paramText[paramId - 1] + '属性' + '增加' + value + '点')
            }
            $gameParty.loseItem(item, 1);
        }

    } else {
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    }
    this._messageWindow.terminateMessage();
    this.close();
};