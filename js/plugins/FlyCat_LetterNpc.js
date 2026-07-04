//=============================================================================
// RPG Maker MZ - 书信NPC
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<书信NPC>
 * @author FlyCat
 * 
 * @param npcData
 * @text npc设置
 * @type struct<npcData>[]
 * @default
 * 
 * @command openLetterNpcWindow
 * @text 打开书信Npc系统
 * @desc 打开书信Npc系统
 * 
 * @command addNpc
 * @text 添加指定的NPC
 * @desc 添加指定的NPC
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text npc数据库Id
 * @desc npc数据库Id
 * 
 * @command removeNpc
 * @text 删除指定的NPC
 * @desc 删除指定的NPC
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text npc数据库Id
 * @desc npc数据库Id
 * 
 * @command addLoveValue
 * @text 指定NPC增减好友度
 * @desc 指定NPC增减好友度
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text npc数据库Id
 * @desc npc数据库Id
 * 
 * @arg value
 * @type string
 * @default 
 * @text 增减好感度数值
 * @desc 增减好感度数值
 * 
 * @command setText
 * @text Npc发送信息
 * @desc Npc发送信息
 *
 * @arg id
 * @type number
 * @min 1
 * @default 
 * @text npc数据库Id
 * @desc npc数据库Id
 * 
 * @arg text
 * @text 发送信息
 * @type string
 * @default 
 * 
 * @arg img
 * @text 图片
 * @require 1
 * @dir img/menu/
 * @type file
 * 
 * @arg max
 * @text 图片占用行数
 * @type number
 * @min 1
 * @default 3
 * 
 * @arg scaleX
 * @text 图片宽比例
 * @desc 0-1 0.5就是50%
 * @type string
 * @default 1
 * 
 * @arg scaleY
 * @text 图片高比例
 * @desc 0-1 0.5就是50%
 * @type string
 * @default 1
 * 
 * @command changeNpcType
 * @text 改变NPC关系
 * @desc 改变NPC关系
 * 
 * @arg id
 * @type number
 * @default 
 * @min 1
 * @text npc数据库Id
 * @desc npc数据库Id
 * 
 * @arg type
 * @text 转为指定关系
 * @type select
 * @option 普通
 * @value 0
 * @option 道侣
 * @value 1
 * @option 好友
 * @value 2
 * @option 敌对
 * @value 3
 * @default

 * @help
 * 脚本:
 * 获取好友度(id);
 * 加密有问题就用：getLoveValue(id);
 * 范例：getLoveValue(1); 获取1号npc好友度
 * 
 * 增减好友度(id, value); id是NpcId value是增减数值
 * 加密有问题就用：addLoveValue(id, value);
 * 范例：addLoveValue(1, 10); 1号npc好友度加10点
 * 
 * 改变关系(id, type); id是NpcId type是关系类型  0普通 1道侣 2好友 3敌对
 * 加密有问题就用：changeNpcType(id, type);
 * 范例：changeNpcType(1, 2); 将1号npc关系改为好友
 * 
 * 获取关系(id); id是NpcId
 * 加密有问题就用：getNpcType(id);
 * 范例：getNpcType(1); 获取1号Npc关系  返回值等于0就是普通 1就是道侣 2就是好友 3就是敌对
 * 
 * 插件指令：
 * 增减好友度
 * 修改npc关系
 * 
 * 新增：
 * 插件指令发送消息增加图片发送，可自定义大小，占用行数，可同话术一起发送。
 * 
 */
/*~struct~npcData:
@param name
@text Npc名字
@type string
@default

@param note
@text Npc简介
@type string
@default

@param action
@text 选项
@type string[]
@default 

@param level
@text NPC等级
@type number
@default 1

@param enemy
@text 敌群序号
@type number
@default 1

@param event
@text 双修公共事件
@type common_event
@default 1

@param img
@text Npc立绘
@require 1
@dir img/menu/
@type file 

@param type
@text 初始关系
@type select
@option 普通
@value 0
@option 道侣
@value 1
@option 好友
@value 2
@option 敌对
@value 3
@default

*/
'use strict';
var Imported = Imported || {};
Imported.FlyCat_LetterNpc = true;

var FlyCat = FlyCat || {};
FlyCat.LetterNpc = {};
FlyCat.LetterNpc.parameters = PluginManager.parameters('FlyCat_LetterNpc');
FlyCat.LetterNpc.npcData = JSON.parse(FlyCat.LetterNpc.parameters['npcData'] || '[]');


if (FlyCat.LetterNpc.npcData) {
    const max = FlyCat.LetterNpc.npcData.length;
    for (let i = 0; i < max; i++) {
        FlyCat.LetterNpc.npcData[i] = JSON.parse(FlyCat.LetterNpc.npcData[i])
        if (FlyCat.LetterNpc.npcData[i].action) {
            FlyCat.LetterNpc.npcData[i].action = JSON.parse(FlyCat.LetterNpc.npcData[i].action)
            for (let s = 0; s < FlyCat.LetterNpc.npcData[i].action.length; s++) {
                if (FlyCat.LetterNpc.npcData[i].action[s]) {
                    FlyCat.LetterNpc.npcData[i].action[s] = FlyCat.LetterNpc.npcData[i].action[s].split(',')
                };
            };
        } else {
            FlyCat.LetterNpc.npcData[i].action = [];
        }
    }
};

PluginManager.registerCommand('FlyCat_LetterNpc', 'openLetterNpcWindow', args => {
    SceneManager.push(Scene_LetterNpc);
});

PluginManager.registerCommand('FlyCat_LetterNpc', 'addNpc', args => {
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
    const id = Number(args.id) - 1;
    const npc = JsonEx.makeDeepCopy(FlyCat.LetterNpc.npcData[id]);
    npc.letterText = [];
    npc.loveValue = 0;
    npc.id = id;
    $gameSystem._LetterNpcData[id] = npc;
});

PluginManager.registerCommand('FlyCat_LetterNpc', 'removeNpc', args => {
    const id = Number(args.id) - 1;
    if ($gameSystem._LetterNpcData) {
        for (let i = 0; i < $gameSystem._LetterNpcData.length; i++) {
            if ($gameSystem._LetterNpcData[i] && $gameSystem._LetterNpcData[i].id == id) {
                $gameSystem._LetterNpcData[i] = null;
                break;
            };
        };
    };
});

function 获取关系(id) {
    if ($gameSystem._LetterNpcData[id - 1]) {
        return $gameSystem._LetterNpcData[id - 1].type;
    }
    return -1;
};
function getNpcType(id) {
    if ($gameSystem._LetterNpcData[id - 1]) {
        return $gameSystem._LetterNpcData[id - 1].type;
    }
    return -1;
};

PluginManager.registerCommand('FlyCat_LetterNpc', 'changeNpcType', args => {
    const id = args.id;
    const type = args.type;
    changeNpcType(id, type);
});
function changeNpcType(id, type) {
    var id = Number(id) - 1;
    var type = Number(type);
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
    if ($gameSystem._LetterNpcData[id]) {
        $gameSystem._LetterNpcData[id].type = type;
    }
};
function 改变关系(id, type) {
    var id = Number(id) - 1;
    var type = Number(type);
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
    if ($gameSystem._LetterNpcData[id]) {
        $gameSystem._LetterNpcData[id].type = type;
    }
};
PluginManager.registerCommand('FlyCat_LetterNpc', 'addLoveValue', args => {
    const id = Number(args.id) - 1;
    const value = Number(args.value);
    addLoveValue(id, value);
});
function addLoveValue(id, value) {
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
    if ($gameSystem._LetterNpcData[id]) {
        $gameSystem._LetterNpcData[id].loveValue += value;
    }
};
function 增减好友度(id, value) {
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
    if ($gameSystem._LetterNpcData[id - 1]) {
        $gameSystem._LetterNpcData[id - 1].loveValue += value;
    }
};
function getLoveValue(id) {
    if ($gameSystem._LetterNpcData[id - 1]) {
        return $gameSystem._LetterNpcData[id - 1].loveValue;
    }
    return 0;
};
function 获取好友度(id) {
    if ($gameSystem._LetterNpcData[id - 1]) {
        return $gameSystem._LetterNpcData[id - 1].loveValue;
    }
    return 0;
};
PluginManager.registerCommand('FlyCat_LetterNpc', 'setText', args => {
    const id = Number(args.id) - 1;
    const text = args.text;
    if ($gameSystem._LetterNpcData[id] && text) {
        $gameSystem.playLetterNpcMessage(text, $gameSystem._LetterNpcData[id], -1, args.img, Number(args.max), Number(args.scaleX), Number(args.scaleY));
        $gameParty.ssLetter(true);
        $gameTemp._setNpcName = $gameSystem._LetterNpcData[id].name;
        $gameTemp._setNpcText = true;
    }
});
Game_System.prototype.playLetterNpcMessage = function (message, item, type, img, max, scaleX, scaleY) {
    var htime = new Date();
    var hour = htime.getHours();   //时
    var min = htime.getMinutes();  //分
    var ss = htime.getSeconds();   //秒
    SoundManager.playLetterSe('Bell3');//播放音效
    var text = '';
    if (ss < 10) var text = '0';
    var time = hour + ':' + min + ':' + text + ss;
    if (type == 1) {
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  ' + message);
        SceneManager._scene._infoWindow.refresh(item);
    } else if (type == -1) {
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  \\C[14]' + message);
        if (img) {
            if (max) {
                var maxText = ' ' + max;
            } else {
                var maxText = ' ' + 3;
            }
            if (!scaleX) {
                var scaleX = ' ' + 1;
            } else {
                var scaleX = ' ' + scaleX;
            }
            if (!scaleY) {
                var scaleY = ' ' + 1;
            } else {
                var scaleY = ' ' + scaleY;
            }
            item.letterText.push('img ' + img + maxText + scaleX + scaleY);
        }
    }
    else {
        item.letterText.push('\\C[0]' + time + '\\C[3]' + '  ' + message);
        item.letterText.push('\\C[0]' + time + ' ' + item.name + ':  ' + $gameSystem.LetterNpcHd(message, item));
        SceneManager._scene._infoWindow.refresh(item);
    }
};
Game_System.prototype.LetterNpcHd = function (text, item) {//正常对话
    const name = item.name;
    if (name == '大师兄杜云') {//如果NPC姓名是虫子
        /* ['\n img 牛子 10 0.5 0.5'] \n 是换行  img就是图片的标志了  这里写img 就会判定为图片
          牛子就是图片名字 10就是占用行数 0.5是宽比 0.5是高比*/
        var data1 = ['看你牛子'];//你说的话术
        var data1_1 = ['\n img 牛子 10 0.5 0.5'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return data1_1[Math.floor((Math.random() * data1_1.length))];

        /*范例  SoundManager.playLetterSe('Bell3')  */
        //SoundManager.playLetterSe('Bell3');//播放音效
        var data1 = ['大师兄好'];//你说的话术
        var data1_1 = ['好\n\\C[14]测试第一行\n\\C[14]测试第二行\n\\C[14]测试第三行\\I[10]', '师妹好'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['大师兄好'];//你说的话术
        var data1_1 = ['无须多礼', '小师妹好', '月儿师妹...好'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['流云城城主府'];//你说的话术
        var data1_1 = ['进入流云城后一直向前走，走过河中小亭，继续前行\\C[14]看到一片竹林后继续前进就到城主府了。', '城主府每年12月可以进入，门口右边可以领任务。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['流云城琉璃塔'];//你说的话术
        var data1_1 = ['流云城琉璃塔在流云城右边的出口，走过小桥就可以到达。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['流云城琉璃村'];//你说的话术
        var data1_1 = ['琉璃村在琉璃岛野外右边山上右手边有个入口。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师兄真棒', '大师兄你比师傅更棒！', '大师兄你是宗门第一棒！'];//你说的话术
        var data1_1 = ['师妹，你是这样认为吗？', '师妹，你...', '师妹...月儿...你喜欢吗？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师兄我修炼遇到点问题今晚方便来帮我下吗？'];//你说的话术
        var data1_1 = ['师妹，是在等我吗？', '师妹，你想要什么？', '月儿...你'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师兄你有试过在水里做那种事吗？'];//你说的话术
        var data1_1 = ['师妹我等修仙之人，不能一天到晚沉迷欲望。', '师妹想要试试吗？', '月儿想要吗？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['技能点', '修炼感悟', '法则感悟', '规则感悟', '怎么有技能点'];//你说的话术
        var data1_1 = ['闭关打坐，但打坐只能一年一次。', '打怪物随机获得。', '城主府藏书阁一楼或者望月阁一楼'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];


        var data1 = ['今晚我洞府没设防师兄别让我等太久哦？'];//你说的话术
        var data1_1 = ['师妹，别这样...'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师兄师兄我新买的肚兜你要看看吗？'];//你说的话术
        var data1_1 = ['师妹穿什么都好看', '师妹，女孩子要矜持。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];


        var data1 = ['今天是我危险期不过是师兄的话也没关系呢。'];//你说的话术
        var data1_1 = ['师妹慎言', '师妹不要考验我'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['技能点', '修炼感悟', '法则感悟', '规则感悟', '怎么有技能点'];//你说的话术
        var data1_1 = ['闭关打坐，但打坐只能一年一次。', '打怪物随机获得。', '城主府藏书阁一楼或者望月阁一楼'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['你再说什么？', '我不知道你在说什么？', '你想干嘛？', '说人话！'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '师傅黄玉琉') {//如果NPC姓名是梦辰
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['你个老逼登', '老逼登你要爆装备了吗？', '你说我骂你？你心里没数吗？', '一决生死吧！'];//你说的话术
        var data1_1 = ['你找死', '孽徒', '我当初救你是我的错', '你造反了是吧？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师傅好', '师傅能教导一下我的修行吗？', '师傅我这里还有些不明白', '师傅还请教我更深的修行之道。'];//你说的话术
        var data1_1 = ['月儿，你真是越来越调皮了。', '为师正在修炼。', '月儿得多练练心，不可如此急躁。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['大师兄', '怎么看大师兄', '杜云', '我爱大师兄'];//你说的话术
        var data1_1 = ['杜云是一个不错的孩子，就是可惜了。', '嗯？杜云也不知道什么能走出来。', '月儿，修士要以修行为主。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['二师兄', '怎么看二师兄', '云飞扬', '我爱二师兄'];//你说的话术
        var data1_1 = ['飞扬啊，月儿你觉得如何呢？。', '飞扬，还需要多多历练。', '月儿得多练练心，不可如此急躁。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['聂敏', '怎么看师姐', '师姐', '我爱师姐', '我要和师姐双修'];//你说的话术
        var data1_1 = ['敏儿，唔...月儿还是多注意自己。', '月儿喜欢敏儿？', '月儿得多练练心，不可如此急躁。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师傅是不是隐瞒了什么？'];//你说的话术
        var data1_1 = ['月儿，为师会隐瞒你什么呢？你不要想太多。', '（一切都是为了宗门未来。）'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师傅当年皇宫那到底是什么？'];//你说的话术
        var data1_1 = ['月儿，当年那成大火来的蹊跷，我知你心里不舒服，但是也没办法。', '一切就是你看到的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['为了师傅我可以做任何事情。'];//你说的话术
        var data1_1 = ['月儿你这话让为师非常满意', '月儿真乖'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师傅你究竟在想什么？'];//你说的话术
        var data1_1 = ['我只想凌霄宫崛起，但是，一个人太少了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];


        /*以下是不满足上述条件的话术*/
        var data1 = ['你说的为师不是很懂。'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '二师兄云飞扬') {//如果NPC姓名是张三
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['二师兄好'];//你说的话术
        var data1_1 = ['嗯，小师妹，你看起来很有空。', '小师妹要是无聊可以来找师兄。', '小师妹好。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['二师兄你在干嘛？'];//你说的话术
        var data1_1 = ['我在研究人体，为什么有人有灵感有人却没有呢？', '人类的身体真让人着迷', '我在喝酒，你来吗？', '炼丹，师傅给的任务，你做完了？', '小师妹是想来找我吗？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['二师兄你有喜欢的人吗？'];//你说的话术
        var data1_1 = ['小师妹这样说是吃醋了吗？', '这个可是秘密。', '小师妹想要听什么样的回答呢？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['二师兄又要喝酒了？'];//你说的话术
        var data1_1 = ['酒可是好东西，小师妹，你以后会明白的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['二师兄你之前在哪里？'];//你说的话术
        var data1_1 = ['我在一个偏僻的小村子里，大家都很怕我，我也很烦恼，没想到会遇到师傅。\\C[14]离开那个村子，现在整个人都很好，好好修仙真不错。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['你可以再多数详细一点。', '怎么，是想我了？', '师妹，为什么不好好说话，是太喜欢我了吗？'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '师姐聂敏') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['师姐好'];//你说的话术
        var data1_1 = ['小师妹你来了。', '小师妹真的好漂亮。', '小师妹来师姐这里。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐在做什么？'];//你说的话术
        var data1_1 = ['我在做自己最喜欢的东西。', '山下的村民出事了，我再帮忙。', '小师妹也要一起吗？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐喜欢谁呢？'];//你说的话术
        var data1_1 = ['我喜欢的人啊是难以得到的人。', '呵呵，以后你会知道的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐这东西是大师兄送的。', '师姐二师兄找我喝酒。'];//你说的话术
        var data1_1 = ['是吗？师妹很喜欢这些东西吗？', '师妹，可以找我，我也能。', '师妹，师姐会送更好的给你。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐我一个人睡觉害怕。', '师姐你有在意的人吗？', '师姐我好像喜欢上谁了。'];//你说的话术
        var data1_1 = ['师妹，师姐永远在你身边。', '师妹，师妹... ..', '师妹是最好的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐你来自哪里？'];//你说的话术
        var data1_1 = ['我是一个孤儿，吃百家饭长大的，多愧师傅发现了我。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['师姐修炼了多久？'];//你说的话术
        var data1_1 = ['师姐也不记得了，蛮久了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['师妹再说一下吗，师姐好寂寞。', '师妹，慢慢来，师姐听着呢。'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '李爽') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        /*以下是不满足上述条件的话术*/
        var data1 = ['你再说什么？', '我不知道你在说什么？', '你想干嘛？', '说人话！'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '绫罗') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['你来自哪里？'];//你说的话术
        var data1_1 = ['我来自平行界面的未来，哪里都是凡人。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你来的地方是什么样的？'];//你说的话术
        var data1_1 = ['那里灵气稀薄，大家都是凡人，比起修仙更向往科技。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你可真可爱啥都敢想。'];//你说的话术
        var data1_1 = ['你们这的仙子没想到也是这等鸟样。', '那你连自己人都保护不了，有什么资格笑我。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['区区炼气期境，也想驱使我。'];//你说的话术
        var data1_1 = ['也好比你被天道驱使。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你想念故乡吗？'];//你说的话术
        var data1_1 = ['想，但是回不去。', '想，火锅、冰淇淋和各种零食。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你有想继续修仙吗？'];//你说的话术
        var data1_1 = ['修仙再好，也有有命，我灵根不是很好。', '修仙我想啊，但是，我更想回家。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['有事吗？', '我不知道', '啊对对对'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '周景初') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['今天又偷懒了吗'];//你说的话术
        var data1_1 = ['嘿嘿嘿，\n[1]也来一起吗？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你为什么这么喜欢吃甜点？'];//你说的话术
        var data1_1 = ['因为人生太苦了，只有甜点能欺骗内心，人生还是有点甜的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['我想你'];//你说的话术
        var data1_1 = ['我也想你', '你在哪里，我来找你'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你什么时候有空，想和你... ...'];//你说的话术
        var data1_1 = ['只要你想，我都有空。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['那个剑灵还好吗？'];//你说的话术
        var data1_1 = ['哎，它好唠叨啊。', '我在想他是不是太久没有遇到人了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['不理你了'];//你说的话术
        var data1_1 = ['我又错了什么吗？不要不理我。', '我也不理你了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['怎么了，有什么需要我的吗？', '这个我不知道', '别这样，我不是很喜欢'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '顾余生') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['真想离开你'];//你说的话术
        var data1_1 = ['呵呵，那我会杀了你，绝对绝对不要离开。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你真狠喜欢喜欢我妈？'];//你说的话术
        var data1_1 = ['喜欢，很喜欢你，但是，我更想看你崩溃的样子。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你真是大变态'];//你说的话术
        var data1_1 = ['对，但只对你变态', '请不要这样说我，不然我会更加变态'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['伤害我，会让你快乐吗？'];//你说的话术
        var data1_1 = ['是的，但只有我能伤害你。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['迟早我会杀了你'];//你说的话术
        var data1_1 = ['能被你杀死真是太好了。', '我只想死在你手上。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['我永远不会回来了'];//你说的话术
        var data1_1 = ['那我就先杀了你，再自杀，这样我们就永远在一起了', '我会一直跟着你，杀了你。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['你在哪里！！别躲着我！！', '你在问什么？', '不要离开我'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '韩羽') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['今天好想你'];//你说的话术
        var data1_1 = ['我也很想你'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你现在干什么？敲木鱼吗？'];//你说的话术
        var data1_1 = ['怎么会，我可是武僧，要修炼的。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['今天去秘境了，看到一个男人背影好像你'];//你说的话术
        var data1_1 = ['这么想我吗？', '我就来找你'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['一起去打邪修吧'];//你说的话术
        var data1_1 = ['好啊，一起除恶扬善'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['送你甜食要不要？'];//你说的话术
        var data1_1 = ['不要', '太甜了，还是小女生吃比价好'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你会永远在我身边吧？'];//你说的话术
        var data1_1 = ['当然，我对佛祖发誓', '那你也会吧？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['有事没看到', '要不问问佛祖？', '不清楚'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '王舒') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['你喜欢什么样的灵兽？'];//你说的话术
        var data1_1 = ['当然是强大的'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你会和灵兽做事吗？'];//你说的话术
        var data1_1 = ['当然，其实很舒服的'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['这个灵兽你喜欢吗？喜欢我就给你。'];//你说的话术
        var data1_1 = ['好啊，谢谢！~~'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['今天干什么？'];//你说的话术
        var data1_1 = ['依旧照顾我的灵兽，哦，还有修炼。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['这个灵果对你有用吗？'];//你说的话术
        var data1_1 = ['啊有用，谢谢了', '正好需要呢。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你好弱。'];//你说的话术
        var data1_1 = ['你才弱！'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];
        /*以下是不满足上述条件的话术*/
        var data1 = ['怎么了？', '不知啊', '再想想'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '顾星冉') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['灵兽宗很垃圾的。'];//你说的话术
        var data1_1 = ['凌霄宫又有多好，都没了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['有新出的妖兽消息吗？'];//你说的话术
        var data1_1 = ['暂时没有，你要不要来交配看看？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['不知道啦', '哎，别问啦', '你这什么脑袋？'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '赵明月') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['要不要一起出去玩？'];//你说的话术
        var data1_1 = ['好啊，等我一下'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['灵兽宗有什么好的，全靠灵兽。'];//你说的话术
        var data1_1 = ['凌霄宫还全靠嗑药'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['这个花很好看，送给你。'];//你说的话术
        var data1_1 = ['谢谢我很喜欢', '真香'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你喜欢什么灵兽？'];//你说的话术
        var data1_1 = ['什么我都喜欢，现在灵兽宗的灵兽太少了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['哈哈哈，你的衣服好难看。'];//你说的话术
        var data1_1 = ['你的也不怎样', '那你给我做一件？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['要不要去吃一顿？'];//你说的话术
        var data1_1 = ['好啊', '去哪里？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['不知道', '别问'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '李雨纹') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['哇，你看这个灵兽，超可爱。'];//你说的话术
        var data1_1 = ['确实'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['一起去秘境如何？'];//你说的话术
        var data1_1 = ['哪里秘境，我看看'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['有什么好的灵兽推荐？'];//你说的话术
        var data1_1 = ['白虎吧', '你适合找抗揍的灵兽'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['啊，灵兽宗还有什么灵兽？'];//你说的话术
        var data1_1 = ['不太多了'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['哈哈哈，今天再来切磋！'];//你说的话术
        var data1_1 = ['速来'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['我还是觉得打铁还是自身铁。'];//你说的话术
        var data1_1 = ['说的嗑药是什么很好的事？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['不知', '找别人问去'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '赵明月') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['要不要一起出去玩？'];//你说的话术
        var data1_1 = ['好啊，等我一下'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['灵兽宗有什么好的，全靠灵兽。'];//你说的话术
        var data1_1 = ['凌霄宫还全靠嗑药'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['这个花很好看，送给你。'];//你说的话术
        var data1_1 = ['谢谢我很喜欢', '真香'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['你喜欢什么灵兽？'];//你说的话术
        var data1_1 = ['什么我都喜欢，现在灵兽宗的灵兽太少了。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['哈哈哈，你的衣服好难看。'];//你说的话术
        var data1_1 = ['你的也不怎样', '那你给我做一件？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['要不要去吃一顿？'];//你说的话术
        var data1_1 = ['好啊', '去哪里？'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['不知道', '别问'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '墨轩') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['进入金丹期最好的修炼场所是琉璃塔？'];//你说的话术
        var data1_1 = ['是的，不仅可以修炼，还能获得很多材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['突破金丹期进入元婴期的丹方在哪里？'];//你说的话术
        var data1_1 = ['桃花村的道具店和望月阁的三楼都有丹方，还有材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['养魂草在哪里？'];//你说的话术
        var data1_1 = ['桃花村的道具店'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['每到境界需要突破的需要丹方在哪里？'];//你说的话术
        var data1_1 = ['大部分在望月阁就有，但炼虚后的需要去焚天域。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['化神期后哪里有更多的技能学习？'];//你说的话术
        var data1_1 = ['焚天域的修仙者联盟和黑市里的比武台。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['魔界可以做什么？'];//你说的话术
        var data1_1 = ['魔界可以购买一些合体期到大乘的丹方和材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['除了琉璃塔还有什么可以修炼的地方？'];//你说的话术
        var data1_1 = ['云霓大陆有五行秘境可以挑战，但最低需要元婴期。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['云霓大陆上的秘境可以获得什么？'];//你说的话术
        var data1_1 = ['根据不同属性，可以获得升级经验、炼丹材料、增加人物和灵兽属性的道具。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['为什么有些地方不能进入？'];//你说的话术
        var data1_1 = ['有些地方需要一定等级才会开放，当然要是剧情到了最后会全部开放。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['你很啰嗦', '本座不想说话'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];

    } else if (name == '墨轩（化龙）') {//如果NPC姓名是李四
        SoundManager.playLetterSe(/*文件名*/);//播放音效

        var data1 = ['进入金丹期最好的修炼场所是琉璃塔？'];//你说的话术
        var data1_1 = ['是的，不仅可以修炼，还能获得很多材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['突破金丹期进入元婴期的丹方在哪里？'];//你说的话术
        var data1_1 = ['桃花村的道具店和望月阁的三楼都有丹方，还有材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['养魂草在哪里？'];//你说的话术
        var data1_1 = ['桃花村的道具店'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['每到境界需要突破的需要丹方在哪里？'];//你说的话术
        var data1_1 = ['大部分在望月阁就有，但炼虚后的需要去焚天域。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['化神期后哪里有更多的技能学习？'];//你说的话术
        var data1_1 = ['焚天域的修仙者联盟和黑市里的比武台。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['魔界可以做什么？'];//你说的话术
        var data1_1 = ['魔界可以购买一些合体期到大乘的丹方和材料。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['除了琉璃塔还有什么可以修炼的地方？'];//你说的话术
        var data1_1 = ['云霓大陆有五行秘境可以挑战，但最低需要元婴期。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['云霓大陆上的秘境可以获得什么？'];//你说的话术
        var data1_1 = ['根据不同属性，可以获得升级经验、炼丹材料、增加人物和灵兽属性的道具。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        var data1 = ['为什么有些地方不能进入？'];//你说的话术
        var data1_1 = ['有些地方需要一定等级才会开放，当然要是剧情到了最后会全部开放。'];//NPC回复话术
        var include = data1.includes(text);
        if (include == true) return '\\C[14]' + data1_1[Math.floor((Math.random() * data1_1.length))];

        /*以下是不满足上述条件的话术*/
        var data1 = ['你很啰嗦', '本座不想说话'];//
        return '\\C[14]' + data1[Math.floor((Math.random() * data1.length))];
    }
}

SoundManager.playLetterSe = function (fileName) {
    if (!fileName) return;
    const se = {};
    se.name = fileName;
    se.pitch = 100;
    se.volume = 100;
    AudioManager.playSe(se);
};

Scene_Base.prototype.startLetterNpc = function () {
    if (!$gameSystem._LetterNpcData) {
        $gameSystem._LetterNpcData = [];
    };
};

FlyCat.LetterNpc.Scene_Map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function () {
    FlyCat.LetterNpc.Scene_Map_initialize.call(this);
    this.startLetterNpc();
};

function Scene_LetterNpc() {
    this.initialize(...arguments);
}

Scene_LetterNpc.prototype = Object.create(Scene_Letter.prototype);
Scene_LetterNpc.prototype.constructor = Scene_LetterNpc;

Scene_LetterNpc.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    $gameTemp._setNpcText = false;
    this._sceneType = 1;
    $gameParty.ssLetter(false);
    this.startLetterNpc();
    $gameSystem._letterButtonSs = false;
    this._lastIndex = null;
};
Scene_LetterNpc.prototype.createNpcInfoWindow = function () {
    const rect = this.npcInfoWindowRect();
    this._npcInfoWindow = new Window_NpcInfo(rect);
    this.addChild(this._npcInfoWindow);
};
Scene_LetterNpc.prototype.npcInfoWindowRect = function () {
    const ww = 944;
    const wh = 50;
    const wx = 300;
    const wy = 60;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LetterNpc.prototype.createtypeListWindow = function () {
    // const rect = this.typeListWindowRect();
    // this._typeListWindow = new Window_TypeListCommand(rect);
    // this._typeListWindow.setHandler('ok', this.onTypelist.bind(this));
    // this._typeListWindow.setHandler("cancel", this.cancelTypeList.bind(this));
    // this.addChild(this._typeListWindow);
    // this._typeListWindow.activate();
    // if (this._sceneType == 0) {
    //     this._typeListWindow.select(0);
    // } else {
    //     this._typeListWindow.select(1);
    // }
};
Scene_LetterNpc.prototype.createNpcTypeListWindow = function () {
    const rect = this.npcTypeListWindowRect();
    this._npcTypeListWindow = new Window_NpcTypeListCommand(rect);
    this._npcTypeListWindow.setHandler('ok', this.onNpcTypelist.bind(this));
    this._npcTypeListWindow.setHandler("cancel", this.cancelNpcTypeList.bind(this));
    this.addChild(this._npcTypeListWindow);
    // this._typeListWindow.deactivate();
    this._npcTypeListWindow.activate();
    this._npcTypeListWindow.select(0);
};
Scene_LetterNpc.prototype.onNpcTypelist = function () {
    if (this._chListWindow._list.length < 1) {
        SoundManager.playBuzzer();
        this._npcTypeListWindow.activate();
        return;
    }
    this._npcTypeListWindow.deactivate();
    this._chListWindow.activate();
    this._lastIndex = -1;
    this._chListWindow.select(0);
};
Scene_LetterNpc.prototype.cancelNpcTypeList = function () {
    // this._typeListWindow.activate();
    this._npcTypeListWindow.deactivate();
    this._npcTypeListWindow.deselect();
    this.popScene();//2023.9.23
};
Scene_LetterNpc.prototype.npcTypeListWindowRect = function () {
    const ww = 300;
    const wh = 50;
    const wx = 0;
    const wy = 60;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_LetterNpc.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createtypeListWindow();
    this.createNpcTypeListWindow();
    this.createChlidrenListWindow();
    this.createNpcInfoWindow();
    this.createBackWindow();
    this.createInfoWindow();
    this._childrenSprite = new Sprite();
    this.addChild(this._childrenSprite);
    this._childrenSprite.anchor.set(0.5);
    this._childrenSprite.x = 1087;
    this._childrenSprite.y = 348 + 55;
    this.createCommandWindow();
    this.createActionCommandWindow();
    // const width = 490;
    // const height = 140;
    // const x = 308;
    // const y = 503 + 55;
    // Graphics._addInput("text", x, y, width, height, 22);
    // Graphics._textarea.value = '再此输入内容';
};

Scene_LetterNpc.prototype.infoWindowRect = function () {
    const ww = 630;
    const wh = 440;
    const wx = 300;
    const wy = 55 + 55;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.createCommandWindow = function () {
    const rect = this.CommandWindowRect();
    this._commandWindow = new Window_LetterNpcCommand(rect);
    this._commandWindow.setHandler('ok', this.selectCommand.bind(this));
    this._commandWindow.setHandler("cancel", this.cancelCommand.bind(this));
    this.addChild(this._commandWindow);
};

Scene_LetterNpc.prototype.CommandWindowRect = function () {
    const ww = 630;
    const wh = 160;
    const wx = 300;
    const wy = 495 + 55;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.selectCommand = function () {
    const index = this._commandWindow.index();
    const indexs = this._chListWindow.index();
    const people = this._chListWindow._list[indexs];
    if (people) {
        if (index == 0) {
            this._commandWindow.deactivate();
            this._commandActionWindow.refresh(people);
            this._commandActionWindow.show();
            this._commandActionWindow.activate();
            this._commandActionWindow.select(0);
        } else if (index == 1) {
            const actor = $gameParty.allMembers()[0];
            const level = actor._level;
            const peopleLevel = Number(people.level);
            const levelX = Math.abs(peopleLevel - level);
            if (peopleLevel < level && levelX >= 10) {
                SoundManager.playBuzzer();
                this._commandWindow.activate();
                // alert('等级相差过多，无法切磋！');
            } else {
                const enemyId = Number(people.enemy);
                if (enemyId > 0) {
                    if ($dataTroops[enemyId]) {
                        BattleManager.setup(enemyId, false, true);
                        $gamePlayer.makeEncounterCount();
                        SceneManager.push(Scene_Battle);
                    };
                } else {
                    SoundManager.playBuzzer();
                    this._commandWindow.activate();
                }
            }
        } else if (index == 2) {
            var sexValue = $gameVariables.value(FlyCat.LL_SceneMenu.sexValue);
            if (sexValue >= 100) {
                $gameTemp.reserveCommonEvent(Number(people.event));
                this.popScene();
            } else {
                if (people.loveValue < 60) {
                    SoundManager.playBuzzer();
                    this._commandWindow.activate();
                    //  alert('无法双修！只有道侣才能做。');
                } else {
                    $gameTemp.reserveCommonEvent(Number(people.event));
                    this.popScene();
                }
            }
        } else {
            this.cancelCommand();
        }
    } else {
        SoundManager.playBuzzer();
        this._commandWindow.activate();
    }
};

Scene_LetterNpc.prototype.createActionCommandWindow = function () {
    const rect = this.CommandActionWindowRect();
    this._commandActionWindow = new Window_LetterNpcActionCommand(rect);
    this._commandActionWindow.setHandler('ok', this.selectAction.bind(this));
    this._commandActionWindow.setHandler("cancel", this.cancelAction.bind(this));
    this.addChild(this._commandActionWindow);
    this._commandActionWindow.hide();
    this._commandActionWindow.deactivate();
};

Scene_LetterNpc.prototype.selectAction = function () {
    const index = this._commandActionWindow.index();
    const meta = this._commandActionWindow._list[index];
    const text = meta[0];
    const value = Number(meta[1]);
    const indexs = this._chListWindow.index();
    const people = this._chListWindow._list[indexs];
    addLoveValue(people.id, value);
    $gameSystem.playLetterNpcMessage('我：' + text, people, 0)
    const pagination = Math.floor((people.letterText.length + 1) / 12);
    this._infoWindow.smoothScrollDown(pagination * 12);
    this._npcInfoWindow.refresh(people);
    this.cancelAction();
};

Scene_LetterNpc.prototype.cancelAction = function () {
    this._commandActionWindow.deactivate();
    this._commandActionWindow.hide();
    this._commandWindow.activate();
};

Scene_LetterNpc.prototype.CommandActionWindowRect = function () {
    const ww = 500;
    const wh = 210;
    const wx = Graphics.width / 2 - ww / 2;
    const wy = Graphics.height / 2 - wh / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_LetterNpc.prototype.cancelCommand = function () {
    this._commandWindow.deactivate();
    this._commandWindow.deselect();
    this._chListWindow.activate();
    //  Graphics._textarea.blur();
};

Scene_LetterNpc.prototype.cancelChildren = function () {
    this._chListWindow.deactivate();
    this._chListWindow.deselect();
    this._commandWindow.deactivate();
    this._npcTypeListWindow.activate();
};

Scene_LetterNpc.prototype.createChlidrenListWindow = function () {
    const rect = this.chListWindowRect();
    this._chListWindow = new Window_LetterNpcList(rect);
    this._chListWindow.setHandler("ok", this.okChildren.bind(this));
    this._chListWindow.setHandler("cancel", this.cancelChildren.bind(this));
    this.addChild(this._chListWindow);
    if (this._chListWindow._list && this._chListWindow._list.length > 0) {
        if ($gameTemp._setNpcName) {
            for (let i = 0; i < this._chListWindow._list.length; i++) {
                if (this._chListWindow._list[i].name == $gameTemp._setNpcName) {
                    this._chListWindow.select(i);
                    const pagination = Math.floor((i + 1) / 8);
                    this._chListWindow.smoothScrollDown(pagination * 8);
                    $gameTemp._setNpcName = null;
                    break;
                }
            }
        } else {
            this._chListWindow.select(0);
        }
        this._chListWindow.deactivate();
        //  this._typeListWindow.deactivate();
    } else {
        this._chListWindow.deactivate();
        this._chListWindow.deselect();
    }
};

Scene_LetterNpc.prototype.okChildren = function () {
    const index = this._chListWindow.index();
    const people = this._chListWindow._list[index];
    if (people) {
        // this._typeListWindow.deactivate();
        this._chListWindow.deactivate();
        this._infoWindow.refresh(people);
        this._commandWindow.activate();
        this._commandWindow.select(0);
    } else {
        this._chListWindow.activate();
        SoundManager.playBuzzer();
    }
};

// Scene_LetterNpc.prototype.selectCommand = function () {
//     const index = this._commandWindow.index();
//     if (index == 0) {
//         const text = Graphics._textarea.value;
//         const indexs = this._chListWindow.index();
//         const people = this._chListWindow._list[indexs];
//         $gameSystem.playLetterNpcMessage(text, people, 0)
//         this._commandWindow.activate();
//         Graphics._textarea.value = '';
//         const pagination = Math.floor((people.letterText.length + 1) / 12);
//         this._infoWindow.smoothScrollDown(pagination * 12);
//     } else {
//         this.cancelCommand();
//     }
// };

Scene_LetterNpc.prototype.createInfoWindow = function () {
    const rect = this.infoWindowRect();
    this._infoWindow = new Window_LetterNpcInfo(rect);
    this.addChild(this._infoWindow);
};
Scene_LetterNpc.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this);
    if (this._npcTypeListWindow) {
        const typeIndex = this._npcTypeListWindow.index();
        if (typeIndex >= 0 && this._lastNpcIndex != typeIndex) {
            this._chListWindow.refresh(typeIndex);
            this._lastNpcIndex = typeIndex;
        }
    }
    if (this._chListWindow) {
        const index = this._chListWindow.index();
        const people = this._chListWindow._list[index];
        if (people && this._lastIndex != index) {
            // const rate = Math.floor(Math.random() * (100 - 1) + 1);//1-100 概率
            // if (rate < 10) {//10%自动说话
            //     var text = $gameSystem.LetterPeopleLastText(people);
            //     $gameSystem.playLetterMessage(text[0], people, 1)
            //     if (text[1] && text[1].length > 0) {
            //         const item = text[1][Math.floor((Math.random() * text[1].length))];
            //         var text1 = '\\C[14]孩儿给母亲送了一些\\C[3]' + item.name + '\\C[14]希望母亲喜欢';
            //         $gameParty.gainItem(item, 1);//给予该物品1个
            //         $gameSystem.playLetterMessage(text1, people, 1);
            //     }
            // }
            this._npcInfoWindow.refresh(people);
            this._infoWindow.refresh(people);
            const pagination = Math.floor((people.letterText.length + 1) / 12);
            this._infoWindow.smoothScrollDown(pagination * 12);
            this._childrenSprite.bitmap = ImageManager.loadBitmap('img/menu/', people.img);
            this._lastIndex = index;
        } else if (!people) {
            this._childrenSprite.bitmap = '';
            this._npcInfoWindow.createContents();
            this._infoWindow.createContents();
        }
    }
};
function Window_LetterNpcList() {
    this.initialize(...arguments);
}

Window_LetterNpcList.prototype = Object.create(Window_Selectable.prototype);
Window_LetterNpcList.prototype.constructor = Window_LetterNpcList;

Window_LetterNpcList.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.activate();
};
Window_LetterNpcList.prototype.refresh = function (npcIndex) {
    this._npcIndex = npcIndex;
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 24;
    this._list = [];
    for (let i = 0; i < $gameSystem._LetterNpcData.length; i++) {
        if ($gameSystem._LetterNpcData[i] && $gameSystem._LetterNpcData[i].type == this._npcIndex)
            this._list.push($gameSystem._LetterNpcData[i]);
    }
    if (this._list.length > 0) {
        this.drawAllItems();
    } else {
        this.drawText('目前没有联系人', -10, this.height / 2 - 40, this.width, 'center')
        this.select(-1);
    }
};

Window_LetterNpcList.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const npc = this._list[index];
    if (npc) {
        this.drawText(npc.name, rect.x, rect.y, this.width, 'left')
    }
}

Window_LetterNpcList.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_LetterNpcList.prototype.maxCols = function () {
    return 1;
};

Window_LetterNpcList.prototype.numVisibleRows = function () {
    return 8;
};

Window_LetterNpcList.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

// Window_LetterNpcList.prototype.callHandler = function (symbol) {
//     if (symbol == "ok") {//&& Graphics._textarea._onWindow
//         AudioManager.stopSe();
//         this.activate();
//     }
//     else {
//         if (this.isHandled(symbol)) {
//             this._handlers[symbol]();
//         }
//     }
// };

Window_LetterNpcList.prototype.isOpenAndActive = function () {
    return this.isOpen() && this.visible && this.active //&& !Graphics._textarea._onWindow;
};

function Window_LetterNpcInfo() {
    this.initialize(...arguments);
}

Window_LetterNpcInfo.prototype = Object.create(Window_Selectable.prototype);
Window_LetterNpcInfo.prototype.constructor = Window_LetterNpcInfo;

Window_LetterNpcInfo.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
};
Window_LetterNpcInfo.prototype.drawBackgroundRect = function (rect) {
    // const c1 = ColorManager.itemBackColor1();
    // const c2 = ColorManager.itemBackColor2();
    // const x = rect.x;
    // const y = rect.y;
    // const w = rect.width;
    // const h = rect.height;
    // this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    // this.contentsBack.strokeRect(x, y, w, h, c1);
};
Window_LetterNpcInfo.prototype.drawNpcImg = function (bitmap, rect, scaleX, scaleY) {
    const pw = bitmap.width;
    const ph = bitmap.height;
    const dx = rect.x;
    const dy = rect.y;
    const sx = 0;
    const sy = 0;
    const scw = Math.floor(pw * scaleX);
    const sch = Math.floor(ph * scaleY);
    this.contents.blt(bitmap, sx, sy, pw, ph, dx, dy, scw, sch);
};
Window_LetterNpcInfo.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const message = this._list[index];
    if (message) {
        if (message.match(/img[ ](.*)/i)) {
            const meta = RegExp.$1.split(' ');
            const bitmap = ImageManager.loadBitmap('img/menu/', meta[0]);
            bitmap.addLoadListener(this.LoadNpcBitmap.bind(this, bitmap, index, meta));
        } else {
            this.drawTextEx(message, rect.x, rect.y, this.width)
        }
    };
};
Window_LetterNpcInfo.prototype.LoadNpcBitmap = function (bitmap, index, meta) {
    if (bitmap && bitmap.isReady()) {
        const rect = this.itemLineRect(index);
        const scaleX = meta[2];
        const scaleY = meta[3];
        this.drawNpcImg(bitmap, rect, scaleX, scaleY);
    }
};
Window_LetterNpcInfo.prototype.refresh = function (item) {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 18;
    this._item = item;
    this._list = [];
    var list = item.letterText;
    var newList = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i]) {
            const data = list[i].split('\n');
            for (let s = 0; s < data.length; s++) {
                newList.push(data[s]);
                if (data[s].match(/img[ ](.*)/i)) {
                    const meta = RegExp.$1.split(' ');
                    for (let s1 = 0; s1 < Number(meta[1]); s1++) {
                        newList.push(' ');
                    }
                }
            }
        }
    };
    this._list = newList;
    if (this._list.length >= 200) {
        this._list.splice(0, 1)
    }
    if (this._list.length > 0) {
        this.drawAllItems();
    };
};
Window_LetterNpcInfo.prototype.itemRect = function (index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight(index);
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * this.itemHeight() + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};
Window_LetterNpcInfo.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_LetterNpcInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.resetTextColor();
};
Window_LetterNpcInfo.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};
Window_LetterNpcInfo.prototype.maxCols = function () {
    return 1;
};
Window_LetterNpcInfo.prototype.numVisibleRows = function () {
    return 12;
};

function Window_NpcTypeListCommand() {
    this.initialize(...arguments);
}

Window_NpcTypeListCommand.prototype = Object.create(Window_Selectable.prototype);
Window_NpcTypeListCommand.prototype.constructor = Window_NpcTypeListCommand;

Window_NpcTypeListCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.opacity = 255;
    this.refresh();
};
Window_NpcTypeListCommand.prototype.refresh = function () {
    this.createContents();
    this._list = [];
    this._list = ['普通', '道侣', '好友', '敌对'];
    this.drawAllItems();
};
Window_NpcTypeListCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 20;
    const rect = this.itemLineRect(index);
    const type = this._list[index];
    if (type) {
        this.resetTextColor();
        this.drawText(type, rect.x, rect.y, this.itemWidth() - this.contents.fontSize - 3, 'center');
    };
};
Window_NpcTypeListCommand.prototype.maxCols = function () {
    return 4;
};
Window_NpcTypeListCommand.prototype.numVisibleRows = function () {
    return 1;
};
Window_NpcTypeListCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 1;
};
Window_NpcTypeListCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

function Window_NpcInfo() {
    this.initialize(...arguments);
}

Window_NpcInfo.prototype = Object.create(Window_Base.prototype);
Window_NpcInfo.prototype.constructor = Window_NpcInfo;

Window_NpcInfo.prototype.initialize = function (rect) {
    Window_Base.prototype.initialize.call(this, rect);
};
Window_NpcInfo.prototype.refresh = function (people) {
    this.contents.clear();
    this.contentsBack.clear();
    this.contents.fontSize = 24;
    const loveValue = people.loveValue || 0;
    const note = people.note || '';
    const name = people.name;
    if (loveValue == 0) {
        var c = '\\C[0]'
    } else if (loveValue > 0 && loveValue <= 30) {
        var c = '\\C[3]'
    } else if (loveValue > 30 && loveValue <= 60) {
        var c = '\\C[14]'
    } else if (loveValue > 60) {
        var c = '\\C[10]'
    } else if (loveValue < 0 && loveValue >= -60) {
        var c = '\\C[11]'
    } else if (loveValue < -60) {
        var c = '\\C[27]'
    }
    this.drawTextEx('\\C[0]姓名：\\C[14]' + name + '  \\C[0]好友度：' + c + loveValue + '  \\C[0]简介：\\C[14]' + note, 0, -1, this.width)
};
Window_NpcInfo.prototype.resetFontSettings = function () {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = 20;
    this.resetTextColor();
};

function Window_LetterNpcCommand() {
    this.initialize(...arguments);
}

Window_LetterNpcCommand.prototype = Object.create(Window_Selectable.prototype);
Window_LetterNpcCommand.prototype.constructor = Window_LetterNpcCommand;

Window_LetterNpcCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.opacity = 255;
    this.refresh();
};

Window_LetterNpcCommand.prototype.refresh = function () {
    this.createContents();
    this._list = [];
    this._list = ['打招呼', '切磋', '双修'];
    this.drawAllItems();
};

Window_LetterNpcCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 26;
    const rect = this.itemLineRect(index);
    const type = this._list[index];
    if (type) {
        this.resetTextColor();
        this.drawText(type, rect.x, rect.y, this.itemWidth() - this.contents.fontSize, 'center');
    };
};

Window_LetterNpcCommand.prototype.maxCols = function () {
    return 3;
};

Window_LetterNpcCommand.prototype.numVisibleRows = function () {
    return 1;
};

Window_LetterNpcCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_LetterNpcCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

function Window_LetterNpcActionCommand() {
    this.initialize(...arguments);
}

Window_LetterNpcActionCommand.prototype = Object.create(Window_Selectable.prototype);
Window_LetterNpcActionCommand.prototype.constructor = Window_LetterNpcActionCommand;

Window_LetterNpcActionCommand.prototype.initialize = function (rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._list = [];
    this.opacity = 255;
    //  this.refresh();
};

Window_LetterNpcActionCommand.prototype.refresh = function (people) {
    this._actor = people;
    this.createContents();
    const list = this._actor.action;
    const addList = [];
    while (addList.length < 3) {
        var item = list[Math.floor(Math.random() * list.length)]
        if (!addList.includes(item)) {
            addList.push(item);
        };
    }
    this._list = addList;
    this.drawAllItems();
};

Window_LetterNpcActionCommand.prototype.drawItem = function (index) {
    this.contents.fontSize = 26;
    const rect = this.itemLineRect(index);
    const type = this._list[index][0];
    if (type) {
        this.resetTextColor();
        this.drawText(type, rect.x, rect.y, this.itemWidth() - this.contents.fontSize, 'center');
    };
};

Window_LetterNpcActionCommand.prototype.maxCols = function () {
    return 1;
};

Window_LetterNpcActionCommand.prototype.numVisibleRows = function () {
    return 3;
};

Window_LetterNpcActionCommand.prototype.maxItems = function () {
    return this._list ? this._list.length : 0;
};

Window_LetterNpcActionCommand.prototype.itemHeight = function () {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};