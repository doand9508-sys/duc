//=============================================================================
// RPG Maker MZ - 子嗣阁系统V2.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<子嗣阁系统V2.0.0>
 * @author Cat
 * @help
 */

'use strict';
var Imported = Imported || {};
Imported.Cat_HY = true;

var Cat = Cat || {};
Cat.Hy = {};
Cat.Hy.parameters = PluginManager.parameters('Cat_HY');

/*Game_System*/
Game_System.prototype.childrenWH = function (children) {//互动话术
    const year = children.xianLing;
    const haoGanDu = children.haoGanDu;
    if (year <= 6) {//如果年龄小于6岁
        if (haoGanDu <= 30) {//如果好感度小于等于30
            var message = ['哽咽', '呜呜呜', '哇呜', '哇哇~~', '嘤嘤嘤', '哼唧~~'];
        } else if (haoGanDu <= 70) {//如果好感度小于等于70
            var message = ['嘤嘤嘤', '咯咯咯', '哈哈', '喜~~喜欢', '妈..妈...', '饿饿~~', '妈~~~'];
        } else if (haoGanDu <= 100) {//如果好感度小于等于100
            var message = ['妈妈~~~', '母亲~~~', '饿饿~~~', '喝奶奶~~~', '奶奶~~奶奶~~', '喜欢妈...妈', '妈...妈...在...哪里...'];
        };
    } else if (year <= 12) {//如果年龄小于12岁
        if (haoGanDu <= 30) {//如果好感度小于等于30
            var message = ['母亲早', '我还不想睡', '不要', '不好吃', '我要糖葫芦', '放开我', '隔壁的二狗子好玩', '好像有人来了？', '母亲的窗口为什么总有人？', '我要阿欢姐姐'];
        } else if (haoGanDu <= 70) {//如果好感度小于等于70
            var message = ['母亲，陪陪我', '阿欢姐姐也在吗？', '母亲和阿欢姐姐好好啊', '那个黑衣服大叔好可怕母亲', '母亲抱抱', '母亲喜欢谁啊？'];
        } else if (haoGanDu <= 100) {//如果好感度小于等于100
            var message = ['母亲最喜欢我吧？', '母亲不要跟那个黑衣服大叔叔说话', '阿欢姐姐也少跟着母亲点', '母亲我一个人睡觉害怕', '母亲喜欢吃什么？', '母亲好辛苦', '我给母亲捏捏肩', '母亲爱你'];
        };
    } else if (year <= 18) {//如果年龄小于18岁
        if (haoGanDu <= 30) {//如果好感度小于等于30
            var message = ['母亲，不要指点我的生活', '母亲，我喜欢那样', '母亲，给我点私人空间', '我想找阿欢姐姐', '阿欢姐姐好温柔', '墨轩叔叔好厉害', '阿欢姐姐喜欢什么？'];
        } else if (haoGanDu <= 70) {//如果好感度小于等于70
            var message = ['母亲，您指点一下我', '母亲，教教我', '母亲，尝尝我做的', '母亲，我帮你按摩按摩', '母亲，这件衣服好适合你', '让阿欢姐姐帮也给母亲做衣服', '母亲最好了~~~'];
        } else if (haoGanDu <= 100) {//如果好感度小于等于100
            var message = ['母亲，不要离开我', '母亲我们会永远在一起吧', '母亲，我不想拜师', '母亲永远是我的就好了', '母亲的胸好大', '母亲好柔软', '母亲要一起洗澡吗'];
        };
    } else if (year <= 25) {//如果年龄小于25岁
        if (haoGanDu <= 30) {//如果好感度小于等于30
            var message = ['母亲我想拜师', '母亲，外面的世界是什么样的', '母亲我想要自由', '母亲，孩子也长大了', '阿欢姐姐好漂亮', '墨轩叔叔好沉稳', '我向往自由', '我要谈恋爱', '我还是一个人'];
        } else if (haoGanDu <= 70) {//如果好感度小于等于70
            var message = ['母亲，你会陪我一起去吧', '母亲，你还是那么好看', '母亲，能陪我聊聊天吗', '母亲还是家里好', '阿欢姐姐也挺好的', '母亲，别走'];
        } else if (haoGanDu <= 100) {//如果好感度小于等于100
            var message = ['母亲，好香啊', '母亲让人很舒服, 还能继续要吗？', '只有那个时刻最为真实', '和喜欢母亲那个表情', '母亲也喜欢吧', '母亲，母亲再多来一点', '哈~~~母亲~~~', '无法忘记母亲', '母亲让我好好抱抱你'];
        };
    } else {
        var message = ['母亲尝尝我酿的酒。', '我要长得及母亲一半就好了', '母亲这么好看，我都看不下去其他姑娘了。', '母亲真是越来越好看了。', '母亲多讲讲你以前的故事。', '母亲发钗别有韵味', '母亲这料子做成衣服肯定好看。', '母亲孩儿昨天被先生夸奖了。', '母亲孩儿做了桂花糕，您来尝尝。', '母亲早安', '母亲看看我给你买的新鲜玩意', '母亲，陪陪人家', '母亲孩儿有个小秘密要告诉你。'];
    };
    return '\\C[23]' + message[Math.floor((Math.random() * message.length))];
};

Game_System.prototype.addChildren = function () {
    this._children = { name: '', lingGen: '', xingGe: '', ziSe: '', xingBie: '', haoGanDu: '', xianLing: '', meiLi: '', wuXing: '', shenLi: '', fuYuan: '', xiongWei: '', changDuan: '', waiMao: '' };
    const lingGen = ['金', '木', '水', '火', '土', '雷', '冰', '天'];
    const xingGe = ['开朗', '阴险', '色情', '忠诚'];
    const xingBie = ['男', '女'];
    const boyPicture = FlyCat.LL_Hy.boyPicture;
    const girlPicture = FlyCat.LL_Hy.girlPicture;
    this._children.name = $gameTemp._childrenName || '无名';
    this._children.lingGen = lingGen[Math.floor((Math.random() * lingGen.length))];
    this._children.xingGe = xingGe[Math.floor((Math.random() * xingGe.length))];
    this._children.xingBie = xingBie[Math.floor((Math.random() * xingBie.length))];
    if (Imported.FlyCat_LL_SM) {
        if (this._children.xingBie == '男') {
            const number = $gameVariables.value(FlyCat.LL_Sm.boyValue) + 1;
            $gameVariables.setValue(FlyCat.LL_Sm.boyValue, number)
        } else {
            const number = $gameVariables.value(FlyCat.LL_Sm.girlValue) + 1;
            $gameVariables.setValue(FlyCat.LL_Sm.girlValue, number)
        }
    }
    this._children.haoGanDu = 0;
    this._children.xianLing = 0;
    this._children.waiMao = Math.floor((Math.random() * 170) + 30);//30-200
    this.setChildrenZiSe(this._children);
    this._children.meiLi = Math.floor((Math.random() * 100) + 0);//0-100
    this._children.wuXing = Math.floor((Math.random() * 50) + 0);//0-50
    this._children.shenLi = 100;
    this._children.maxTiLi = 500;
    this._children.fuYuan = Math.floor((Math.random() * 50) + 0);//0-50
    this._children.pyCounts = 0;
    //this._children.menPai = '无';
    if (this._children.xingBie === '男') {
        this._children.changDuan = Math.floor(Math.random() * 5)//0-5
        this._children.xiongWei = Math.floor((Math.random() * 20) + 20);//20-40
        this._children.picture = boyPicture[Math.floor((Math.random() * boyPicture.length))];
    }
    else {
        this._children.changDuan = null;
        this._children.xiongWei = Math.floor((Math.random() * 20) + 30)//30-50
        this._children.picture = girlPicture[Math.floor((Math.random() * girlPicture.length))];
    }
    this._ChildrenList.push(this._children);
};

Game_System.prototype.setChildrenZiSe = function (actor) {
    this._children = actor;
    const ziSe = ['丑陋无比', '平平无奇', '眉清目秀', '秀色可餐', '明眸皓齿', '出水芙蓉', '国色天香'];
    if (this._children.waiMao >= 0 && this._children.waiMao <= 50) {
        this._children.ziSe = ziSe[0];
    }
    if (this._children.waiMao > 51 && this._children.waiMao <= 100) {
        this._children.ziSe = ziSe[1];
    }
    if (this._children.waiMao > 100 && this._children.waiMao <= 150) {
        this._children.ziSe = ziSe[2];
    }
    if (this._children.waiMao > 150 && this._children.waiMao <= 200) {
        this._children.ziSe = ziSe[3];
    }
    if (this._children.waiMao > 250 && this._children.waiMao <= 300) {
        this._children.ziSe = ziSe[4];
    }
    if (this._children.waiMao > 350 && this._children.waiMao <= 400) {
        this._children.ziSe = ziSe[5];
    }
    if (this._children.waiMao > 450) this._children.ziSe = ziSe[6];
    // console.log(this._children)
};

/*Scene*/
Scene_LL_HY.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    if (!$gameSystem._ChildrenMessage) $gameSystem._ChildrenMessage = [];
    this.createChildrenInfo();
    this.createChlidrenMessageWindow();
    this.createChlidrenPyWindow();
    this.createChlidrenListWindow();
    this.createForGroundSprite();
    this.createChlidrenMenPaiWindow();
    this.createChlidrenItemWindow();
    this.createChlidrenPyWindow_new();
    this.createChlidrenDgWindow_new();
    this.createOkWindow();
    if (Imported.MiniInformationWindow) {
        this.createMiniWindow();
        if (this._childrenItemWindow) this._childrenItemWindow._miniInfoWindow = this._miniWindow;
    };
};

Scene_LL_HY.prototype.createChlidrenDgWindow_new = function () {
    this._cancelDgButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelDgButtonSprite);
    this._cancelDgButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelDgButtonSprite.setClickHandler(this.cancelChildrenDg.bind(this));
    this._cancelDgButtonSprite.hide();
    this._cancelDgButtonSprite.x = 813;
    this._cancelDgButtonSprite.y = 166;

    const rect = this.chlidrenMenPaiWindowRect();
    this._childrenDgWindow_new = new Window_ChildrenDg_new(rect);
    this._childrenDgWindow_new.setHandler("ok", this.okChildrenDg.bind(this));
    this._childrenDgWindow_new.setHandler("cancel", this.cancelChildrenDg.bind(this));
    this.addChild(this._childrenDgWindow_new);
    this._childrenDgWindow_new.hide();
    this._childrenDgWindow_new.deactivate();
};

Scene_LL_HY.prototype.okChildrenDg = function () {
    const index = this._chListWindow.index();
    this._children = this._chListWindow._list[index];
    this._hdType = 'new_dg';
    this._childrenPyWindow.deactivate();
    const list = ['流云城打工', '琉璃村打工', '皇城打工'];
    this._childrenOkWindow.refresh('new_dg', this._children, list[this._childrenDgWindow_new.index()]);
    this._childrenDgWindow_new.hide();
    this._childrenDgWindow_new.deactivate();
    this._dgcjBackGroundSprite.hide();
    this._cancelDgButtonSprite.hide();
    this._childrenOkWindow.show();
    this._childrenOkWindow.activate();
    this._itemBackGroundSprite_1.show();
};

Scene_LL_HY.prototype.cancelChildrenDg = function () {
    this._childrenPyWindow.activate();
    this._childrenDgWindow_new.hide();
    this._childrenDgWindow_new.deactivate();
    this._forgroundSprite_new.hide();
    this._dgcjBackGroundSprite.hide();
    this._itemBackGroundSprite_1.hide();
    this._cancelDgButtonSprite.hide();
};


Scene_LL_HY.prototype.createChlidrenPyWindow_new = function () {
    this._cancelPyButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelPyButtonSprite);
    this._cancelPyButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelPyButtonSprite.setClickHandler(this.cancelChildrenPy.bind(this));
    this._cancelPyButtonSprite.hide();
    this._cancelPyButtonSprite.x = 813;
    this._cancelPyButtonSprite.y = 166;

    const rect = this.chlidrenMenPaiWindowRect();
    this._childrenPyWindow_new = new Window_ChildrenPy_new(rect);
    this._childrenPyWindow_new.setHandler("ok", this.okChildrenPy.bind(this));
    this._childrenPyWindow_new.setHandler("cancel", this.cancelChildrenPy.bind(this));
    this.addChild(this._childrenPyWindow_new);
    this._childrenPyWindow_new.hide();
    this._childrenPyWindow_new.deactivate();
};

Scene_LL_HY.prototype.okChildrenPy = function () {
    const index = this._chListWindow.index();
    this._children = this._chListWindow._list[index];
    this._hdType = 'new_py';
    this._childrenPyWindow.deactivate();
    const list = ['上私塾', '锻炼身体', '技艺学习', '外出游玩', '陪伴'];
    this._childrenOkWindow.refresh('new_py', this._children, list[this._childrenPyWindow_new.index()]);
    this._childrenPyWindow_new.hide();
    this._childrenPyWindow_new.deactivate();
    this._itemBackGroundSprite_2.hide();
    this._cancelPyButtonSprite.hide();
    this._childrenOkWindow.show();
    this._childrenOkWindow.activate();
    this._itemBackGroundSprite_1.show();
};

Scene_LL_HY.prototype.cancelChildrenPy = function () {
    this._childrenPyWindow.activate();
    this._childrenPyWindow_new.hide();
    this._childrenPyWindow_new.deactivate();
    this._forgroundSprite_new.hide();
    this._itemBackGroundSprite_2.hide();
    this._cancelPyButtonSprite.hide();
};

Scene_LL_HY.prototype.createChlidrenMenPaiWindow = function () {
    this._menPaiBackGroundSprite = new Sprite();
    this.addChild(this._menPaiBackGroundSprite);
    this._menPaiBackGroundSprite.hide();
    this._menPaiBackGroundSprite.bitmap = ImageManager.loadBitmap('img/menu/', "门派背景");

    this._menPaiBackGroundSprite_2 = new Sprite();
    this.addChild(this._menPaiBackGroundSprite_2);
    this._menPaiBackGroundSprite_2.hide();
    this._menPaiBackGroundSprite_2.bitmap = ImageManager.loadBitmap('img/menu/', "门派背景2");

    this._dgcjBackGroundSprite = new Sprite();
    this.addChild(this._dgcjBackGroundSprite);
    this._dgcjBackGroundSprite.hide();
    this._dgcjBackGroundSprite.bitmap = ImageManager.loadBitmap('img/menu/', "dgback");

    this._sxBackGroundSprite = new Sprite();
    this.addChild(this._sxBackGroundSprite);
    this._sxBackGroundSprite.hide();
    this._sxBackGroundSprite.bitmap = ImageManager.loadBitmap('img/menu/', "sxback");

    this._itemBackGroundSprite = new Sprite();
    this.addChild(this._itemBackGroundSprite);
    this._itemBackGroundSprite.hide();
    this._itemBackGroundSprite.bitmap = ImageManager.loadBitmap('img/menu/', "twback");

    this._itemBackGroundSprite_1 = new Sprite();
    this.addChild(this._itemBackGroundSprite_1);
    this._itemBackGroundSprite_1.hide();
    this._itemBackGroundSprite_1.bitmap = ImageManager.loadBitmap('img/menu/', "pydjback");

    this._itemBackGroundSprite_2 = new Sprite();
    this.addChild(this._itemBackGroundSprite_2);
    this._itemBackGroundSprite_2.hide();
    this._itemBackGroundSprite_2.bitmap = ImageManager.loadBitmap('img/menu/', "pyback");

    this._cancelMenPaiButtonSprite = new Sprite_CancelButton();
    this.addChild(this._cancelMenPaiButtonSprite);
    this._cancelMenPaiButtonSprite.bitmap = ImageManager.loadBitmap('img/menu/', 'closeButton');
    this._cancelMenPaiButtonSprite.setClickHandler(this.cancelChildrenMenPai.bind(this));
    this._cancelMenPaiButtonSprite.hide();
    this._cancelMenPaiButtonSprite.x = 813;
    this._cancelMenPaiButtonSprite.y = 166;

    const rect = this.chlidrenMenPaiWindowRect();
    this._childrenMenPaiWindow = new Window_ChildrenMenPai(rect);
    this._childrenMenPaiWindow.setHandler("ok", this.okChildrenMenPai.bind(this));
    this._childrenMenPaiWindow.setHandler("cancel", this.cancelChildrenMenPai.bind(this));
    this.addChild(this._childrenMenPaiWindow);
    this._childrenMenPaiWindow.hide();
    this._childrenMenPaiWindow.deactivate();
};

Scene_LL_HY.prototype.QdChildrenHd = function () {//确定互动
    this._dgcjBackGroundSprite.hide();
    this._sxBackGroundSprite.hide();
    this._menPaiBackGroundSprite_2.hide();
    this._forgroundSprite_new.hide();
    this._itemBackGroundSprite_1.hide();
    this._cancelItemButtonSprite.hide();
    if (this._hdType === 'MC') {//打工
        const meiLi = Number(this._children.meiLi);
        const tiLi = Number(this._children.shenLi);
        if (meiLi >= 120 && tiLi >= 10) {
            this._children.shenLi -= 10;
            SoundManager.playUseItem();
            this._childrenInfoWindow.refresh(this._children);
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenMC());
            const itemId = FlyCat.LL_Hy.workReward[Math.floor((Math.random() * FlyCat.LL_Hy.workReward.length))];
            const item = $dataItems[itemId];
            $gameParty.gainItem(item, 1);
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]打工获得物品\\C[3]' + item.name);

        } else {
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你当前的状态不适合打工');
            SoundManager.playBuzzer();
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
        }
    } else if (this._hdType === 'new_dg') {//新打工
        const tiLi = Number(this._children.shenLi);
        const list = ['流云城打工', '琉璃村打工', '皇城打工'];
        const type = list[this._childrenDgWindow_new.index()];
        if (type) {
            var goldItem = $dataItems[FlyCat.LL_SceneMenu.goldItem]
            if (type == '流云城打工') {
                if (tiLi < 50) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足50点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 50;
                    const number = Math.floor((Math.random() * 350) + 150)
                    $gameParty.gainItem(goldItem, number)
                    $gameSystem.playChildrenMessage('\\C[0]系统: 流云城打工后\\C[10]体力-50，\\C[14]灵石+' + number);
                }
            } else if (type == '琉璃村打工') {
                if (tiLi < 30) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足30点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 30;
                    const number = Math.floor((Math.random() * 150) + 50)
                    $gameParty.gainItem(goldItem, number)
                    $gameSystem.playChildrenMessage('\\C[0]系统: 琉璃村打工后\\C[10]体力-30，\\C[14]灵石+' + number);
                }
            } else if (type == '皇城打工') {
                if (tiLi < 20) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足20点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 20;
                    const number = Math.floor((Math.random() * 7000) + 3000);
                    $gameParty.gainGold(number);
                    $gameSystem.playChildrenMessage('\\C[0]系统: 皇城打工后\\C[10]体力-20，\\C[14]银两+' + number);
                }
            }
            this._children.pyCounts += 2;
            if (this._children.pyCounts == 12) {
                this._children.pyCounts = 0;
                this._children.xianLing++;
            }
            this._childrenInfoWindow.refresh(this._children);
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            /*新增2021.12.2*/
            if (this._children.xianLing >= 25) {
                this.YqChildren('maxYear');
            }
        };
    }
    else if (this._hdType === 'new_py') {//新培养
        const tiLi = Number(this._children.shenLi);
        const list = ['上私塾', '锻炼身体', '技艺学习', '外出游玩', '陪伴'];
        const type = list[this._childrenPyWindow_new.index()];
        if (type) {
            if (type == '上私塾') {
                if (tiLi < 30) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足30点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 30;
                    this._children.wuXing += 5;
                    $gameSystem.playChildrenMessage('\\C[0]系统: 上私塾后\\C[10]体力-30，\\C[14]悟性+5');
                }
            } else if (type == '锻炼身体') {
                if (tiLi < 30) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足30点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 30;
                    this._children.maxTiLi += 5;
                    $gameSystem.playChildrenMessage('\\C[0]系统: 锻炼身体后\\C[10]体力-30，\\C[14]体力上限+5');
                }
            } else if (type == '技艺学习') {
                if (tiLi < 30) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足30点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 30;
                    this._children.meiLi += 5;
                    $gameSystem.playChildrenMessage('\\C[0]系统: 学习技艺后\\C[10]体力-30，\\C[14]技艺+5');
                }
            } else if (type == '外出游玩') {
                if (tiLi < 20) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足20点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 20;
                    this._children.fuYuan += 5;
                    $gameSystem.playChildrenMessage('\\C[0]系统: 外出游玩后\\C[10]体力-30，\\C[14]福源+5');
                }
            } else if (type == '陪伴') {
                if (tiLi < 10) {
                    $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的体力不足10点');
                    SoundManager.playBuzzer();
                } else {
                    SoundManager.playUseItem();
                    this._children.shenLi -= 10;
                    this._children.haoGanDu += 5;
                    $gameSystem.playChildrenMessage('\\C[0]系统: 陪伴后\\C[10]体力-10，\\C[14]好感度+5');
                }
            };
            this._children.pyCounts += 2;
            if (this._children.pyCounts == 12) {
                this._children.pyCounts = 0;
                this._children.xianLing++;
            }
            this._childrenInfoWindow.refresh(this._children);
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            /*新增2021.12.2*/
            if (this._children.xianLing >= 25) {
                this.YqChildren('maxYear');
            }
        };
    }
    else if (this._hdType === 'SX') {//双修
        const haoGanDu = Number(this._children.haoGanDu);
        const tiLi = Number(this._children.shenLi);
        const xianLing = Number(this._children.xianLing);
        if (haoGanDu >= 50 && tiLi >= 20 && xianLing >= 18) {
            this._children.shenLi -= 20;
            SoundManager.playUseItem();
            this._childrenInfoWindow.refresh(this._children);
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenSX());
            const itemId = FlyCat.LL_Hy.sxReward[Math.floor((Math.random() * FlyCat.LL_Hy.sxReward.length))];
            const item = $dataItems[itemId];
            $gameParty.gainItem(item, 1);
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]双修获得物品\\C[3]' + item.name);
            if (FlyCat.LL_Hy.nameVariable) $gameVariables.setValue(Number(FlyCat.LL_Hy.nameVariable), this._children.name);
            if (FlyCat.LL_Hy.xbVariable) $gameVariables.setValue(Number(FlyCat.LL_Hy.xbVariable), this._children.xingBie);
            if (FlyCat.LL_Hy.xgVariable) $gameVariables.setValue(Number(FlyCat.LL_Hy.xgVariable), this._children.xingGe);
            $gameTemp.reserveCommonEvent(Number(FlyCat.LL_Hy.sxEvent))
            this.popScene();

        } else {
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你当前的状态不适合双修或仙龄不足18岁');
            SoundManager.playBuzzer();
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
        }
    }
    else if (this._hdType === 'Item' && this._item) {//培养
        SoundManager.playUseItem();
        // const itemRate = Math.floor((Math.random() * 100) + 1);
        // if (itemRate < 10) {
        //     $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenPyXh());
        //     $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + this._children.name + '非常喜欢这个物品！');
        //     this._children.haoGanDu += 2;
        //     if (this._children.haoGanDu >= 100) {
        //         this._children.haoGanDu = 100;
        //         var text = '好感值已经无法提升了。';
        //     } else {
        //         var text = '好感值增加\\C[3]2\\C[14]点';
        //     }
        //     $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + this._children.name + text);
        //     this.addChildrenItemParam(1);
        // }
        // else if (itemRate < 50) {
        //     $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenPyBwbh());
        //     $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + this._children.name + '对这个物品不温不火！');
        //     this._children.haoGanDu += 1;
        //     if (this._children.haoGanDu >= 100) {
        //         this._children.haoGanDu = 100;
        //         var text = '好感值已经无法提升了。';
        //     } else {
        //         var text = '好感值增加\\C[3]2\\C[14]点';
        //     }
        //     $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + this._children.name + text);
        //     this.addChildrenItemParam(2);
        // } else {
        //     $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenPyBxh());
        //     $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + this._children.name + '极其讨厌这个物品！但还是收下了！');
        //     this.addChildrenItemParam(3);
        // };
        this.addChildrenItemParam(1);
        $gameParty.loseItem(this._item, 1);
        $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]失去物品\\C[3]' + this._item.name);
        this._children.pyCounts += 2;
        if (this._children.pyCounts == 12) {
            this._children.pyCounts = 0;
            this._children.xianLing++;
        }
        this._childrenInfoWindow.refresh(this._children);
        this._childrenPyWindow.activate();
        this._childrenOkWindow.hide();
        this._childrenOkWindow.deactivate();
        /*新增2021.12.2*/
        if (this._children.xianLing >= 25) {
            this.YqChildren('maxYear');
        }
    }
    else if (this._hdType === 'CJ') {//出嫁
        const meiLi = Number(this._children.meiLi);
        const xianLing = Number(this._children.xianLing);
        if (xianLing >= 18) {
            SoundManager.playUseItem();
            $gameSystem.playChildrenMessage(this._children.name + ': ' + $gameSystem.childrenCj());
            const x = Math.floor(meiLi / 50) < 1 ? 1 : Math.floor(meiLi / 50);
            for (let i = 0; i < x; i++) {
                const itemId = FlyCat.LL_Hy.cjReward[Math.floor((Math.random() * FlyCat.LL_Hy.cjReward.length))];
                const item = $dataItems[itemId];
                $gameParty.gainItem(item, 1);
                $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]出嫁获得物品\\C[3]' + item.name);
            };
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            this.YqChildren('Cj');
        } else {
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你当前的状态不适合出嫁');
            SoundManager.playBuzzer();
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
        }
    }
    else if (this._hdType === 'BS') {//拜师
        const menPaiId = $gameTemp._menPaiId;
        if (menPaiId == 1) var mp = '外门弟子';
        if (menPaiId == 2) var mp = '内门弟子';
        if (menPaiId == 3) var mp = '真传弟子';
        const menPai = this._menPai;
        if (menPaiId > 0) {
            SoundManager.playUseItem();
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[3]' + this._children.name + '\\C[14]加入了\\C[3]' + menPai + '\\C[14]成为了\\C[3]' + mp);
            var itemList = [];
            if (menPai === '欢喜宗') var itemList = eval('FlyCat.LL_Hy.hxzReward_' + menPaiId);
            const itemId = itemList[Math.floor((Math.random() * itemList.length))];
            const item = $dataItems[itemId];
            if (item) {
                $gameParty.gainItem(item, 1);
                $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]拜师获得物品\\C[3]' + item.name);
            }
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
            this.YqChildren('Bs');
        } else {
            $gameSystem.playChildrenMessage('\\C[0]系统: \\C[10]你的资质不够无法拜入宗门');
            SoundManager.playBuzzer();
            this._childrenPyWindow.activate();
            this._childrenOkWindow.hide();
            this._childrenOkWindow.deactivate();
        }
    }
};

Scene_LL_HY.prototype.addChildrenItemParam = function (type) {
    if (this._item && this._item.meta.培养) {
        const itemMeta = this._item.meta.培养.split(',');
        var text = '';
        if (itemMeta[0] == '仙龄') {
            this._children.xianLing += Number(itemMeta[1]);
            var text = this._children.name + '服用了' + this._item.name + '仙龄增加\\C[3]' + Number(itemMeta[1]) + '\\C[14]岁';
        }
        if (itemMeta[0] == '外貌') {
            if (this._children.waiMao >= 500) {
                this._children.waiMao = 500;
                var text = '已经达到国色天香的容貌，无法提升了。';
            } else {
                this._children.waiMao += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '外貌值增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            }
            $gameSystem.setChildrenZiSe(this._children);
        }
        if (itemMeta[0] == '技艺') {
            if (this._children.meiLi >= 500) {
                this._children.meiLi = 500;
                var text = '技艺已臻至神境，无法提升了。';
            } else {
                this._children.meiLi += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '技艺值增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        }
        if (itemMeta[0] == '悟性') {
            if (this._children.wuXing >= 500) {
                this._children.wuXing = 500;
                var text = '悟性已通天彻地，无法提升了。';
            } else {
                this._children.wuXing += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '悟性值增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        }
        if (itemMeta[0] == '体力') {
            if (this._children.shenLi >= this._children.maxTiLi) {
                this._children.shenLi = 500;
                var text = '体力已满，无法增加。';
            } else {
                this._children.shenLi += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '体力值增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            }
        }
        if (itemMeta[0] == '福源') {
            if (this._children.fuYuan >= 500) {
                this._children.fuYuan = 500;
                var text = '福源已震动天地，无法提升了。';
            } else {
                this._children.fuYuan += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '福源值增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        }
        if (itemMeta[0] == '胸围' && this._children.xingBie == '女') {
            if (this._children.xiongWei >= 200) {
                this._children.xiongWei = 200;
                var text = '作为女生胸已经很大了，无法再次提升！';
            } else {
                this._children.xiongWei += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '胸围增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        } else if (itemMeta[0] == '胸围' && this._children.xingBie == '男') {
            if (this._children.xiongWei >= 100) {
                this._children.xiongWei = 100;
                var text = '作为男生胸已经很大了，无法再次提升！';
            } else {
                this._children.xiongWei += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '胸围增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        }
        if (itemMeta[0] == '长短' && this._children.xingBie == '男') {
            if (this._children.changDuan >= 50) {
                this._children.changDuan = 50;
                var text = '你的阳物太长了，无法再次提升！';
            } else {
                this._children.changDuan += Number(itemMeta[type]);
                var text = this._children.name + '服用了' + this._item.name + '长短增加\\C[3]' + Number(itemMeta[type]) + '\\C[14]点';
            };
        } else if (itemMeta[0] == '长短' && this._children.xingBie == '女') {
            var text = '女孩子哪来的小鸡鸡，胡闹！';
        }
        $gameSystem.playChildrenMessage('\\C[0]系统: \\C[14]' + text);
    }
};

/*Command_Window*/
Scene_LL_HY.prototype.createChlidrenPyWindow = function () {
    const rect = this.chlidrenPyWindowRect();
    this._childrenPyWindow = new Window_ChildrenPy(rect);
    this._childrenPyWindow.setHandler("PY", this.PyChildren.bind(this));
    this._childrenPyWindow.setHandler("BS", this.BsChildren.bind(this));
    this._childrenPyWindow.setHandler("MC", this.McChildren.bind(this));
    this._childrenPyWindow.setHandler("SX", this.SxChildren.bind(this));
    this._childrenPyWindow.setHandler("YQ", this.YqChildren.bind(this));
    this._childrenPyWindow.setHandler("TW", this.ItemChildren.bind(this));
    this._childrenPyWindow.setHandler("cancel", this.cancelPy.bind(this));
    this.addChild(this._childrenPyWindow);
    this._childrenPyWindow.select(-1);
    this._childrenPyWindow.deactivate();
    this.createCommandSprite();
};

Scene_LL_HY.prototype.McChildren = function () {
    this._childrenPyWindow.deactivate();
    this._childrenDgWindow_new.refresh();
    this._childrenDgWindow_new.show();
    this._childrenDgWindow_new.activate();
    this._forgroundSprite_new.show();
    this._dgcjBackGroundSprite.show();
    this._cancelDgButtonSprite.show();
};

Scene_LL_HY.prototype.PyChildren = function () {
    this._childrenPyWindow.deactivate();
    this._childrenPyWindow_new.refresh();
    this._childrenPyWindow_new.show();
    this._childrenPyWindow_new.activate();
    this._forgroundSprite_new.show();
    this._itemBackGroundSprite_2.show();
    this._cancelPyButtonSprite.show();
};

Scene_LL_HY.prototype.ItemChildren = function () {//培养
    this._childrenPyWindow.deactivate();
    this._childrenItemWindow.refresh();
    this._childrenItemWindow.show();
    this._childrenItemWindow.activate();
    this._forgroundSprite_new.show();
    this._itemBackGroundSprite.show();
    this._cancelItemButtonSprite.show();
};

Scene_LL_HY.prototype.createCommandSprite = function () {
    var x = 965;
    var y = 140;
    this._hyButtonSprite = [];
    for (let i = 0; i < 6; i++) {
        if (i == 2 || i == 4 || i == 6) {
            y += 52;
        }
        if (i == 1 || i == 3 || i == 5) {
            x = 1085;
        } else {
            var x = 965;
        }
        this._hyButtonSprite[i] = new Sprite_HYCommandButton();
        this.addChild(this._hyButtonSprite[i]);
        this._hyButtonSprite[i]._buttonId = i;
        this._hyButtonSprite[i].bitmap = ImageManager.loadBitmap('img/menu/', "nhy_button_" + i)
        this._hyButtonSprite[i].x = x;
        this._hyButtonSprite[i].y = y;
    }
};

Window_ChildrenPy.prototype.makeCommandList = function () {
    this.contents.fontSize = 20;
    this.addCommand('培养', 'PY', true);
    this.addCommand('投喂', 'TW', true);
    this.addCommand('拜师', 'BS', true);
    this.addCommand('打工', 'MC', true);
    this.addCommand('双修', 'SX', true);
    this.addCommand('遗弃', 'YQ', true);
};

Window_ChildrenPy.prototype.maxItems = function () {
    return 6;
};

function Window_ChildrenDg_new() {
    this.initialize(...arguments);
}

Window_ChildrenDg_new.prototype = Object.create(Window_Selectable.prototype);
Window_ChildrenDg_new.prototype.constructor = Window_ChildrenDg_new;

Window_ChildrenDg_new.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'hymplb');
    this.opacity = 0;
};

Cat.Hy.Window_ChildrenDg_new_resetFontSettings = Window_ChildrenDg_new.prototype.resetFontSettings;
Window_ChildrenDg_new.prototype.resetFontSettings = function () {
    Cat.Hy.Window_ChildrenDg_new_resetFontSettings.call(this);
    this.contents.fontSize = 20;
};

Window_ChildrenDg_new.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        if (this._list && this._list.length > 0) {
            this.select(0);
        } else {
            this.select(-1);
        }
        this._loadingPictrue = true;
    }
};

Window_ChildrenDg_new.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_ChildrenDg_new.prototype.drawBackgroundRect = function (rect) {
};

Window_ChildrenDg_new.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

Window_ChildrenDg_new.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 20;
    this._list = ['\\C[0]流云城打工  \\C[14]获得150-300灵石  \\C[10]体力-50', '\\C[0]琉璃村打工 \\C[14]获得50-200灵石  \\C[10]体力-30',
        '\\C[0]皇城打工获得 \\C[14]3000-10000银两  \\C[10]体力-20'];
    if (this._list.length > 0) {
        this.drawAllItems();
    };
};

Window_ChildrenDg_new.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const menPai = this._list[index];
    if (menPai) {
        if (index == this.index()) {
            this.drawCursorBitmap(rect, 1)
        } else {
            this.drawCursorBitmap(rect, 0)
        }
        this.drawTextEx(menPai, rect.x, rect.y, this.width);
    }
};

Window_ChildrenDg_new.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#adbeb4';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 1;
    }
};

Window_ChildrenDg_new.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_ChildrenDg_new.prototype.maxCols = function () {
    return 1;
};

Window_ChildrenDg_new.prototype.numVisibleRows = function () {
    return 6;
};

Window_ChildrenDg_new.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

FlyCat.LL_Hy.Window_ChildrenDg_new_select = Window_ChildrenDg_new.prototype.select;
Window_ChildrenDg_new.prototype.select = function (index) {
    FlyCat.LL_Hy.Window_ChildrenDg_new_select.call(this, index)
    if (index >= 0 && index < this.maxItems() && index != this.lastselect) {
        this.refresh();
        this.lastselect = index;
    }
};

function Window_ChildrenPy_new() {
    this.initialize(...arguments);
}

Window_ChildrenPy_new.prototype = Object.create(Window_Selectable.prototype);
Window_ChildrenPy_new.prototype.constructor = Window_ChildrenPy_new;

Window_ChildrenPy_new.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._loadingPictrue = false;
    this._loadBitmap = ImageManager.loadBitmap('img/menu/', 'hymplb');
    this.opacity = 0;
};

Cat.Hy.Window_ChildrenPy_new_resetFontSettings = Window_ChildrenPy_new.prototype.resetFontSettings;
Window_ChildrenPy_new.prototype.resetFontSettings = function () {
    Cat.Hy.Window_ChildrenPy_new_resetFontSettings.call(this);
    this.contents.fontSize = 20;
};

Window_ChildrenPy_new.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    if (!this._loadingPictrue && this._loadBitmap && this._loadBitmap.isReady()) {
        this.refresh();
        if (this._list && this._list.length > 0) {
            this.select(0);
        } else {
            this.select(-1);
        }
        this._loadingPictrue = true;
    }
};

Window_ChildrenPy_new.prototype.drawCursorBitmap = function (rect, type) {
    const bitmap = this._loadBitmap;
    if (bitmap) {
        const pw = bitmap.width;
        const ph = bitmap.height / 2;
        const dx = rect.x - 10;
        const dy = rect.y - 4;
        const sx = 0;
        const sy = type * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy);
    }
};

Window_ChildrenPy_new.prototype.drawBackgroundRect = function (rect) {
};

Window_ChildrenPy_new.prototype._updateCursor = function () {
    this._cursorSprite.alpha = 0;
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

Window_ChildrenPy_new.prototype.refresh = function () {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 20;
    this._list = ['\\C[0]上私塾  \\C[14]悟性+5  \\C[10]体力-30', '\\C[0]锻炼身体  \\C[14]体力上限+5  \\C[10]体力-30', '\\C[0]技艺学习  \\C[14]技艺+5  \\C[10]体力-30'
        , '\\C[0]外出游玩  \\C[14]福源+5  \\C[10]体力-20', '\\C[0]陪伴  \\C[14]好感+5  \\C[10]体力-10'];
    if (this._list.length > 0) {
        this.drawAllItems();
    };
};

Window_ChildrenPy_new.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const menPai = this._list[index];
    if (menPai) {
        if (index == this.index()) {
            this.drawCursorBitmap(rect, 1)
        } else {
            this.drawCursorBitmap(rect, 0)
        }
        this.drawTextEx(menPai, rect.x, rect.y, this.width);
    }
};

Window_ChildrenPy_new.prototype.processColorChange = function (colorIndex) {
    if (colorIndex == 0) {
        this.changeTextColor('#4e7574');
        this.contents.outlineColor = '#adbeb4';
        this.contents.outlineWidth = 1;
    } else {
        this.changeTextColor(ColorManager.textColor(colorIndex));
        this.contents.outlineColor = this.contents.textColor;
        this.contents.outlineWidth = 1;
    }
};

Window_ChildrenPy_new.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_ChildrenPy_new.prototype.maxCols = function () {
    return 1;
};

Window_ChildrenPy_new.prototype.numVisibleRows = function () {
    return 6;
};

Window_ChildrenPy_new.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

FlyCat.LL_Hy.Window_ChildrenPy_new_select = Window_ChildrenPy_new.prototype.select;
Window_ChildrenPy_new.prototype.select = function (index) {
    FlyCat.LL_Hy.Window_ChildrenPy_new_select.call(this, index)
    if (index >= 0 && index < this.maxItems() && index != this.lastselect) {
        this.refresh();
        this.lastselect = index;
    }
};

Window_ChildrenOk.prototype.drawTextType = function () {
    //   this.drawBack(0, 0, this.width, this._drawBackHeight);
    const tili = Number(this._children.shenLi);
    const meili = Number(this._children.meiLi);
    const haogandu = Number(this._children.haoGanDu);
    const xianLing = Number(this._children.xianLing);
    var text = '';
    var text1 = '';
    var text2 = '';
    if (this._hdType === 'MC') {
        if (tili < 10) var text = '\\C[10]（体力值不够）';
        if (meili < 120) var text1 = '\\C[10]（技艺值不够）';
        this.drawTextEx('\\C[14]打工需要技艺值\\C[3]120\\C[14]点', 2, 90 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]打工需消耗体力值\\C[3]10\\C[14]点', 2, 114 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]当前技艺值: \\C[3]' + meili + '\\C[0]' + text1, 2, 138 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]当前体力值: \\C[3]' + tili + '\\C[0]' + text, 2, 162 + 46, this.width, 'left')
    }
    else if (this._hdType === 'SX') {
        if (xianLing < 18) var text2 = '\\C[10]（仙龄不足18岁）';
        if (haogandu < 90) var text1 = '\\C[10]（好感度不够）';
        if (tili < 20) var text = '\\C[10]（体力值不够）'
        this.drawTextEx('\\C[14]需要仙龄:\\C[3]18\\C[14]岁\\C[0]' + text2, 2, 136 + 2, this.width, 'left')
        this.drawTextEx('\\C[14]双修需要好感度\\C[3]90\\C[14]点', 2, 160 + 2, this.width, 'left')
        this.drawTextEx('\\C[14]双修需消耗体力值\\C[3]20\\C[14]点', 2, 184 + 2, this.width, 'left')
        this.drawTextEx('\\C[14]当前好感度: \\C[3]' + haogandu + '\\C[0]' + text1, 2, 208 + 2, this.width, 'left')
        this.drawTextEx('\\C[14]当前体力值: \\C[3]' + tili + '\\C[0]' + text, 2, 232 + 2, this.width, 'left')

    }
    else if (this._hdType === 'Item' && this._item) {
        const name = this._item.name;
        this.drawTextEx('\\C[14]是否将\\C[3]' + name + '\\C[14]给予' + this._children.name, 2, 136, this.width, 'left')
        this.drawTextEx('\\C[10]注意：给予物品后有概率增加孩子属性', 2, 160, this.width, 'left')
        this.drawTextEx('\\C[10]注意：给予的物品无法收回！', 2, 184, this.width, 'left')
    }
    else if (this._hdType === 'CJ') {
        if (xianLing < 18) var text1 = '\\C[10]（仙龄不足18岁）';
        this.drawTextEx('\\C[14]出嫁需要仙龄\\C[3]18\\C[14]岁', 2, 90 + 46, this.width, 'left')
        this.drawTextEx('\\C[10]注意：出嫁后孩子将消失', 2, 114 + 46, this.width, 'left')
        this.drawTextEx('\\C[10]注意：出嫁奖励每50技艺值增加1种', 2, 138 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]当前仙龄: \\C[3]' + xianLing + '\\C[0]' + text1, 2, 162 + 46, this.width, 'left')
    }
    else if (this._hdType === 'BS' && this._item) {
        // this.contents.fillRect(0, 97, this.width, 3, ColorManager.textColor(4));
        // this.contents.fillRect(0, 228, this.width, 3, ColorManager.textColor(4));
        // this.contents.fillRect(0, 363, this.width, 3, ColorManager.textColor(4));
        this.zongMen(this._item)
    } else if (this._hdType === 'new_py' && this._item) {
        if (this._item == '上私塾') {
            if (tili < 30) var text = '\\C[10]（体力值不够）'
            var value = 30;
        } else if (this._item == '锻炼身体') {
            if (tili < 30) var text = '\\C[10]（体力值不够）'
            var value = 30;
        } else if (this._item == '技艺学习') {
            if (tili < 30) var text = '\\C[10]（体力值不够）'
            var value = 30;
        } else if (this._item == '外出游玩') {
            if (tili < 20) var text = '\\C[10]（体力值不够）'
            var value = 20;
        } else if (this._item == '陪伴') {
            if (tili < 10) var text = '\\C[10]（体力值不够）'
            var value = 10;
        }
        this.drawTextEx('\\C[14]当前培养项目：' + this._item, 2, 90 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]所需体力值\\C[3]' + value + '\\C[14]点', 2, 114 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]当前体力值: \\C[3]' + tili + '\\C[0]' + text, 2, 138 + 46, this.width, 'left')
    } else if (this._hdType === 'new_dg' && this._item) {
        if (this._item == '流云城打工') {
            if (tili < 50) var text = '\\C[10]（体力值不够）'
            var value = 50;
        } else if (this._item == '琉璃村打工') {
            if (tili < 30) var text = '\\C[10]（体力值不够）'
            var value = 30;
        } else if (this._item == '皇城打工') {
            if (tili < 20) var text = '\\C[10]（体力值不够）'
            var value = 20;
        }
        this.drawTextEx('\\C[14]当前打工项目：' + this._item, 2, 90 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]所需体力值\\C[3]' + value + '\\C[14]点', 2, 114 + 46, this.width, 'left')
        this.drawTextEx('\\C[14]当前体力值: \\C[3]' + tili + '\\C[0]' + text, 2, 138 + 46, this.width, 'left')
    };
};

Window_ChildrenList.prototype.select = function (index) {
    this._index = index;
    this.refreshCursor();
    this.callUpdateHelp();
    if (index >= 0 && index < this.maxItems() && index != this.lastselect) {
        const children = this._list[index];
        if (this._childrenInfoWindow && children) {
            this._childrenInfoWindow.refresh(children);
            $gameSystem.playChildrenMessage(children.name + ': ' + $gameSystem.childrenWH(children));
            this.refresh();
            this.lastselect = index;
        }
    }
};

Window_ChildrenMessage.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 18;
    this.resetTextColor();
    this.changeTextColor('#4e7574');
    this.contents.outlineColor = '#587c7a';
    this.contents.outlineWidth = 1;
};

/*怪物孩子*/
// PluginManager.registerCommand('FlyCat_LL_HY', 'addChildren_enemy', args => {
//     if (!$gameSystem._ChildrenListEnemy) {
//         $gameSystem._ChildrenListEnemy = [];
//     }
//     if ($gameSystem._ChildrenListEnemy.length < 5) {
//         $gameSystem.addChildrenEnemy();
//     } else {
//         $gameMessage.add('已经没有精力养更多的孩子了！')
//     }
// });

// Game_System.prototype.addChildrenEnemy = function () {
//     this._children = { name: '', lingGen: '', xingGe: '', ziSe: '', xingBie: '', haoGanDu: '', xianLing: '', meiLi: '', wuXing: '', shenLi: '', fuYuan: '', xiongWei: '', changDuan: '', waiMao: '' };
//     const lingGen = ['金', '木', '水', '火', '土', '雷', '冰', '天'];
//     const xingGe = ['开朗', '阴险', '色情', '忠诚'];
//     const boyPicture = FlyCat.LL_Hy.boyPicture;
//     const girlPicture = FlyCat.LL_Hy.girlPicture;
//     this._children.name = $gameTemp._childrenName || '无名';
//     this._children.lingGen = lingGen[Math.floor((Math.random() * lingGen.length))];
//     this._children.xingGe = xingGe[Math.floor((Math.random() * xingGe.length))];
//     this._children.haoGanDu = 0;
//     this._children.xianLing = 0;
//     this._children.waiMao = Math.floor((Math.random() * 500) + 1);
//     this.setChildrenZiSe(this._children);
//     this._children.meiLi = Math.floor((Math.random() * 100) + 1);
//     this._children.wuXing = Math.floor((Math.random() * 80) + 1);
//     this._children.shenLi = Math.floor((Math.random() * 50) + 1);
//     this._children.fuYuan = Math.floor((Math.random() * 50) + 1);
//     this._children.pyCounts = 0;
//     //this._children.menPai = '无';
//     if (this._children.xingBie === '男') {
//         this._children.changDuan = Math.floor((Math.random() * 30) + 1)
//         this._children.xiongWei = null;
//         this._children.picture = boyPicture[Math.floor((Math.random() * boyPicture.length))];
//     }
//     else {
//         this._children.changDuan = null;
//         this._children.xiongWei = Math.floor((Math.random() * 300) + 1)
//         this._children.picture = girlPicture[Math.floor((Math.random() * girlPicture.length))];
//     }
//     this._ChildrenList.push(this._children);
// };