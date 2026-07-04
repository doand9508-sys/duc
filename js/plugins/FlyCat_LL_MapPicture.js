
//=============================================================================
// RPG Maker MZ - 地图立绘
//=============================================================================

/*:
 * @target MZ
 * @plugindesc v1.0.0 FlyCat-<地图立绘>
 * @author FlyCat
 *
 * @param equipVariable
 * @text 衣服透明度变量
 * @desc 衣服透明度变量
 * @type variable
 * 
 * @param pictureAnchor
 * @text 立绘锚点
 * @desc 立绘锚点
 * @type string
 * @default 1
 * @desc 0为左上角，0.5为中，1为右下脚
 * 
 * @param pictureX
 * @text 地图立绘X
 * @desc 地图立绘X
 * @type number
 * @default 1270
 * @desc 锚点为0时780,
 * 为1时1270
 * 
 * @param pictureY
 * @text 地图立绘Y
 * @desc 地图立绘Y
 * @type number
 * @default 720
 * @desc 锚点为0时46
 * 为1时720
 * 
 * @param peopleStateZd
 * @text 地图控制立绘遮罩
 * @require 1
 * @dir img/menu/
 * @type file
 *
 *
 * @param peopleStateBz
 * @text 地图白浊立绘遮罩
 * @require 1
 * @dir img/menu/
 * @type file
 *
 * @param peopleStateFq
 * @text 地图发情立绘遮罩
 * @require 1
 * @dir img/menu/
 * @type file
 * 
 * @param peopleStateYw
 * @text 地图淫文立绘遮罩
 * @require 1
 * @dir img/menu/
 * @type file
 * 
 * @param hair
 * @text 裸体头发立绘遮罩
 * @require 1
 * @dir img/menu/
 * @type file
 * 
 * @command hideMapCg
 * @text 隐藏/打开地图立绘
 * @desc 隐藏/打开地图立绘
 * 
 * @arg type
 * @type boolean
 * @on 开启
 * @off 关闭
 * @default
 * @text 开启/关闭
 * @desc 
 * 
 * @help
 * ==============================使用说明===============================
 * 地图备注：<地图立绘背景:X>
 * 对话框中写：\Face[X]  X为表情id
 * =====================================================================
*/
'use strict';
var Imported = Imported || {};
Imported.FlyCat_LL_MapPicture = true;

var FlyCat = FlyCat || {};
FlyCat.LL_MapPicture = {};
FlyCat.LL_MapPicture.parameters = PluginManager.parameters('FlyCat_LL_MapPicture');
FlyCat.LL_MapPicture.faceVariable = Number(FlyCat.LL_MapPicture.parameters['faceVariable']);
FlyCat.LL_MapPicture.peopleStateZd = String(FlyCat.LL_MapPicture.parameters['peopleStateZd']);
// FlyCat.LL_MapPicture.peopleStateZz = String(FlyCat.LL_MapPicture.parameters['peopleStateZz']);
FlyCat.LL_MapPicture.peopleStateBz = String(FlyCat.LL_MapPicture.parameters['peopleStateBz']);
FlyCat.LL_MapPicture.peopleStateFq = String(FlyCat.LL_MapPicture.parameters['peopleStateFq']);
FlyCat.LL_MapPicture.peopleStateYw = String(FlyCat.LL_MapPicture.parameters['peopleStateYw']);
FlyCat.LL_MapPicture.hair = String(FlyCat.LL_MapPicture.parameters['hair']);
FlyCat.LL_MapPicture.pictureY = Number(FlyCat.LL_MapPicture.parameters['pictureY'] || 720);
FlyCat.LL_MapPicture.pictureX = Number(FlyCat.LL_MapPicture.parameters['pictureX'] || 1270);
FlyCat.LL_MapPicture.pictureAnchor = Number(FlyCat.LL_MapPicture.parameters['pictureAnchor'] || 1);
FlyCat.LL_MapPicture.equipVariable = Number(FlyCat.LL_MapPicture.parameters['equipVariable']);


PluginManager.registerCommand('FlyCat_LL_MapPicture', 'hideMapCg', args => {
    $gameSystem._mapCgVisible = eval(args.type);
    ConfigManager.HideMapCg = eval(args.type);
});

FlyCat.LL_MapPicture.Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer
Scene_Map.prototype.createWindowLayer = function () {
    if ($gameSystem._mapCgVisible == undefined) {
        $gameSystem._mapCgVisible = false;
        ConfigManager.HideMapCg = false;
    }
    this._mapBackSprite = new Sprite();//地图背景
    this.addChild(this._mapBackSprite);
    const mapMeta = $dataMap.meta.地图立绘背景 ? $dataMap.meta.地图立绘背景 : null;
    if (mapMeta) {
        this._mapBackSprite.bitmap = ImageManager.loadBitmap('img/menu/', mapMeta);
    }
    const x = FlyCat.LL_MapPicture.pictureX;//1270;//780
    const y = FlyCat.LL_MapPicture.pictureY;//720;//46
    const achor = Number(FlyCat.LL_MapPicture.pictureAnchor);
    var StateValue = $gameVariables.value(FlyCat.LL_SceneMenu.peopleStateVariable || 0);
    /* 2025.2.12
    this._mapMainSprite = new Sprite();//主体
     this.addChild(this._mapMainSprite);
     this._mapMainSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_SceneMenu.sceneMapPicture);
     this._mapMainSprite.x = x;
     this._mapMainSprite.y = y;
     this._mapMainSprite.anchor.set(achor);
 
     this._mapMainFairSprite = new Sprite();//头发
     this.addChild(this._mapMainFairSprite);
     if (!$gameSystem._mapActorFairPicture) {
         $gameSystem._mapActorFairPicture = FlyCat.LL_MapPicture.hair;
     }
     this._mapMainFairSprite.bitmap = ImageManager.loadBitmap('img/menu/', $gameSystem._mapActorFairPicture);
     this._mapMainFairSprite.x = x;
     this._mapMainFairSprite.y = y;
     this._mapMainFairSprite.anchor.set(achor);
     this._mapMainFairSprite.hide();
     */
    // this._mapStateSprite = new Sprite();//状态
    // this.addChild(this._mapStateSprite);
    // this._mapStateSprite.x = x;
    // this._mapStateSprite.y = y;
    // this._mapStateSprite.anchor.set(achor);

    // this._mapStateSprite.bitmap = '';
    // if (StateValue == 1) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZd);
    // if (StateValue == 2) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZz);
    // if (StateValue == 3) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateBz);
    // if (StateValue == 4) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateFq);

    /* 2025.2.12
      this._actorYwSprite = new Sprite();//淫文
      this.addChild(this._actorYwSprite)
      this._actorYwSprite.x = x;
      this._actorYwSprite.y = y;
      this._actorYwSprite.anchor.set(achor);
      if ($gameSwitches.value(FlyCat.LL_SceneMenu.ywSwitch)) {
          this._actorYwSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateYw);
      } else {
          this._actorYwSprite.bitmap = '';
      }
  
      this._actorBzSprite = new Sprite();//白浊
      this.addChild(this._actorBzSprite)
      this._actorBzSprite.x = x;
      this._actorBzSprite.y = y;
      this._actorBzSprite.anchor.set(achor);
      if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {
          this._actorBzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateBz);
      } else {
          this._actorBzSprite.bitmap = '';
      }
  
      this._mapArmorSprite = new Sprite();//衣服
      this.addChild(this._mapArmorSprite);
      var img = '';
      if ($gameSystem._mapActorPicture) var img = $gameSystem._mapActorPicture;
      this._mapArmorSprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
      this._mapArmorSprite.x = x;
      this._mapArmorSprite.y = y;
      this._mapArmorSprite.anchor.set(achor);
      const eop = $gameVariables.value(FlyCat.LL_MapPicture.equipVariable);
      this._mapArmorSprite.opacity = eop;
  
      this._mapFaceSprite = new Sprite();//表情
      this.addChild(this._mapFaceSprite);
  
      if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
          this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ3-1');
      } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.lzSwitch)) {
          this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ2-1');
      } else {
          this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ1-1');
      }
      this._mapFaceSprite.x = x;
      this._mapFaceSprite.y = y;
      this._mapFaceSprite.anchor.set(achor);
      $gameSystem._tempFaceName = '对话立绘-表情1';
      this._tempFaceNameCounts = 1;
      this._tempFaceCounts = 0;
      this._tempFaceSpeed = 5;
      this._tempFaceRandom = false;
      this._tempFaceCounts_1 = 0;
      */
    // this._actorFqSprite = new Sprite();//发情
    // this.addChild(this._actorFqSprite)
    // this._actorFqSprite.anchor.set(achor);
    // this._actorFqSprite.x = x;
    // this._actorFqSprite.y = y;
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
    //     this._actorFqSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateFq);
    // } else {
    //     this._actorFqSprite.bitmap = '';
    // }

    // this._actorKzSprite = new Sprite();//控制
    // this.addChild(this._actorKzSprite)
    // this._actorKzSprite.anchor.set(achor);
    // this._actorKzSprite.x = x;
    // this._actorKzSprite.y = y;
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) {
    //     this._actorKzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZd);
    // } else {
    //     this._actorKzSprite.bitmap = '';
    // }

    /*2022.06.01*/
    /* 2025.2.12
  this._actorHySprite = new Sprite();//怀孕
  this.addChild(this._actorHySprite)
  this._actorHySprite.anchor.set(achor);
  this._actorHySprite.x = x;
  this._actorHySprite.y = y;

  this._actorHySprite_1 = new Sprite();//怀孕肚子
  this.addChild(this._actorHySprite_1)
  this._actorHySprite_1.anchor.set(achor);
  this._actorHySprite_1.x = x;
  this._actorHySprite_1.y = y;
  if ($gameSystem._hyCgVisible == undefined) {
      $gameSystem._hyCgVisible = true;
      ConfigManager.HideHyCg = true;
  };
  if ($gameSystem._hyCgVisible == false || $gameSystem._hyCgVisible == true) {
      this._actorHySprite_1.visible = $gameSystem._hyCgVisible;
  }

  if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
      var img = '';
      var img_1 = '';
      if ($gameVariables.value(10) >= 3 && $gameVariables.value(10) < 5) {
          var img = '怀孕状态1';
          var img_1 = '三个月';
      } else if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 9) {
          var img = '怀孕状态2';
      } else if ($gameVariables.value(10) >= 9) {
          var img = '怀孕状态3';
          var img_1 = '九个月';
      } else {
          var img_1 = '一个月';
      }
      if ($gameVariables.value(10) >= 5 && $gameVariables.value(10) < 7) {
          var img_1 = '五个月';
      } else if ($gameVariables.value(10) >= 7 && $gameVariables.value(10) < 9) {
          var img_1 = '七个月';
      }
      this._actorHySprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
      this._actorHySprite_1.bitmap = ImageManager.loadBitmap('img/menu/', img_1);
  } else {
      this._actorHySprite.bitmap = '';
      this._actorHySprite_1.bitmap = '';
  }
 
  this._lastMapFaceId = 0;
  this._lastMapArmorImg = '';
  this._lastStateBitmap = '';

  if ($gameSystem._mapCgVisible == false || $gameSystem._mapCgVisible == true) {
      this._mapFaceSprite.visible = $gameSystem._mapCgVisible;
      this._mapArmorSprite.visible = $gameSystem._mapCgVisible;
      this._mapMainSprite.visible = $gameSystem._mapCgVisible;
      //this._mapStateSprite.visible = $gameSystem._mapCgVisible;
      this._actorBzSprite.visible = $gameSystem._mapCgVisible;
      // this._actorFqSprite.visible = $gameSystem._mapCgVisible;
      //  this._actorKzSprite.visible = $gameSystem._mapCgVisible;
      this._actorHySprite.visible = $gameSystem._mapCgVisible;//怀孕
      this._actorYwSprite.visible = $gameSystem._mapCgVisible;//淫文
      this._mapMainFairSprite.visible = $gameSystem._mapCgVisible;
      this._mapBackSprite.visible = $gameSystem._mapCgVisible;

      if ($gameSystem._mapCgVisible == false) {
          this._actorHySprite_1.visible = $gameSystem._mapCgVisible;
      }
  };
  */
    FlyCat.LL_MapPicture.Scene_Map_createWindowLayer.call(this);
};

FlyCat.LL_MapPicture.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function () {
    FlyCat.LL_MapPicture.Scene_Map_update.call(this);
    /*表情*/
    /* 2025.2.12
  if (this._mapFaceSprite && $gameSystem._tempFaceName == '对话立绘-表情1') {
      this._tempFaceCounts++;
      if (!this._tempFaceRandom) {
          if (this._tempFaceCounts >= this._tempFaceSpeed) {
              //  this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/', '眼睛动态' + this._tempFaceNameCounts);
              if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
                  var fileName = 'YJBQ3-' + this._tempFaceNameCounts;
                  // this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ3-' + this._tempFaceNameCounts);
              } else if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) {
                  var fileName = 'YJBQ2-' + this._tempFaceNameCounts;
                  //  this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ2-' + this._tempFaceNameCounts);
              } else {
                  var fileName = 'YJBQ1-' + this._tempFaceNameCounts;
                  // this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', 'YJBQ1-' + this._tempFaceNameCounts);
              }
              this._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/eyes/', fileName);
              this._tempFaceNameCounts++;
              if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {
                  if (this._tempFaceNameCounts > 9) {
                      this._tempFaceNameCounts = 1;
                      const speed = Math.floor(Math.random() * 600);
                      this._tempFaceSpeed = speed < 120 ? 120 : speed;
                      this._tempFaceRandom = true;
                  }
              } else {
                  if (this._tempFaceNameCounts > 11) {
                      this._tempFaceNameCounts = 1;
                      const speed = Math.floor(Math.random() * 600);
                      this._tempFaceSpeed = speed < 120 ? 120 : speed;
                      this._tempFaceRandom = true;
                  }
              }
              this._tempFaceCounts = 0;
              // this._tempFaceNameCounts++;
              // if (this._tempFaceNameCounts > 5) {
              //     this._tempFaceNameCounts = 1;
              //     const speed = Math.floor(Math.random() * 600);
              //     this._tempFaceSpeed = speed < 120 ? 120 : speed;
              //     this._tempFaceRandom = true;
              // }
              // this._tempFaceCounts = 0;
          }
      } else {
          if (this._tempFaceCounts >= this._tempFaceSpeed) {
              this._tempFaceSpeed = 5;
              this._tempFaceCounts = 0;
              this._tempFaceRandom = false;
          }
      }
  };
  if (this._mapFaceSprite && $gameSystem._tempFaceName == '其他') {
      this._tempFaceCounts_1++;
      if (this._tempFaceCounts_1 >= 60) {
          this._tempFaceNameCounts = 1;
          $gameSystem._tempFaceName = '对话立绘-表情1';
          this._tempFaceCounts_1 = 0;
      }

  }
  */
    /*状态*/
    // if (FlyCat.LL_SceneMenu.peopleStateVariable) {
    //     var StateValue = $gameVariables.value(FlyCat.LL_SceneMenu.peopleStateVariable);
    // }
    // else {
    //     var StateValue = 0;
    // }
    // if (StateValue == 0) this._mapStateSprite.bitmap = '';
    // if (this._mapStateSprite && StateValue > 0) {
    //     if (StateValue == 1) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZd);
    //     if (StateValue == 2) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZz);
    //     if (StateValue == 3) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateBz);
    //     if (StateValue == 4) this._mapStateSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateFq);
    // }
    /* 2025.2.12
  if ($gameSwitches.value(FlyCat.LL_SceneMenu.bzSwitch)) {//白浊
      this._actorBzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateBz);
  } else {
      this._actorBzSprite.bitmap = '';
  }
  */
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.fqSwitch)) {//发情
    //     this._actorFqSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateFq);
    // } else {
    //     this._actorFqSprite.bitmap = '';
    // }
    // if ($gameSwitches.value(FlyCat.LL_SceneMenu.kzSwitch)) {//控制
    //     this._actorKzSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateZd);
    // } else {
    //     this._actorKzSprite.bitmap = '';
    // }
    /* 2025.2.12
  if ($gameSwitches.value(FlyCat.LL_SceneMenu.ywSwitch)) {//淫文
      this._actorYwSprite.bitmap = ImageManager.loadBitmap('img/menu/', FlyCat.LL_MapPicture.peopleStateYw);
  } else {
      this._actorYwSprite.bitmap = '';
  }
  */
    /*2022.06.01*/
    /* 2025.2.12
  if ($gameSwitches.value(FlyCat.LL_SceneMenu.huaiyunSwitch)) {
      const month = Number(FlyCat.LL_SceneMenu.hyMmonthVariable);
      var img = '';
      var img_1 = '';
      if ($gameVariables.value(month) >= 3 && $gameVariables.value(month) < 5) {
          var img = '怀孕状态1';
          var img_1 = '三个月';
      } else if ($gameVariables.value(month) >= 5 && $gameVariables.value(month) < 9) {
          var img = '怀孕状态2';
      } else if ($gameVariables.value(month) >= 9) {
          var img = '怀孕状态3';
          var img_1 = '九个月';
      } else {
          var img_1 = '一个月';
      }
      if ($gameVariables.value(month) >= 5 && $gameVariables.value(month) < 7) {
          var img_1 = '五个月';
      } else if ($gameVariables.value(month) >= 7 && $gameVariables.value(month) < 9) {
          var img_1 = '七个月';
      }
      this._actorHySprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
      this._actorHySprite_1.bitmap = ImageManager.loadBitmap('img/menu/', img_1);
  } else {
      this._actorHySprite.bitmap = '';
      this._actorHySprite_1.bitmap = '';
  }
  */
    /*衣服*/
    /* 2025.2.12
  if ($gameSystem._mapActorPicture && this._lastMapArmorImg != $gameSystem._mapActorPicture) {
      var img = $gameSystem._mapActorPicture;
      this._mapArmorSprite.bitmap = ImageManager.loadBitmap('img/menu/', img);
      this._lastMapArmorImg = img;
  }
  if ($gameSystem._mapActorPicture == '') {
      this._mapArmorSprite.bitmap = $gameSystem._mapActorPicture;
      this._lastMapArmorImg = '';
  }
  if (this._mapArmorSprite) {
      const eop = $gameVariables.value(FlyCat.LL_MapPicture.equipVariable);
      this._mapArmorSprite.opacity = eop;
  };
  if (this._mapMainFairSprite) this._mapMainFairSprite.bitmap = ImageManager.loadBitmap('img/menu/', $gameSystem._mapActorFairPicture);
 */
    /*呼吸*/
    /* 2025.2.12
  if (this._mapFaceSprite && this._mapArmorSprite && this._mapMainSprite) {
      this._breatheCount++;
      if (this._breatheCount < 61) {
          this._mapFaceSprite.scale.y += 0.0001;
          this._mapArmorSprite.scale.y += 0.0001;
          this._mapMainSprite.scale.y += 0.0001;
          this._actorBzSprite.scale.y += 0.0001;
          //  this._actorFqSprite.scale.y += 0.0001;
          //  this._actorKzSprite.scale.y += 0.0001;
          this._actorYwSprite.scale.y += 0.0001;
          this._actorHySprite.scale.y += 0.0001;
          this._actorHySprite_1.scale.y += 0.0001;
          this._mapMainFairSprite.scale.y += 0.0001;
          // this._mapStateSprite.scale.y += 0.0002;
      }
      else if (this._breatheCount > 60 && this._breatheCount <= 120) {
          this._mapFaceSprite.scale.y -= 0.0001;
          this._mapArmorSprite.scale.y -= 0.0001;
          this._mapMainSprite.scale.y -= 0.0001;
          this._actorBzSprite.scale.y -= 0.0001;
          // this._actorFqSprite.scale.y -= 0.0001;
          //  this._actorKzSprite.scale.y -= 0.0001;
          this._actorYwSprite.scale.y -= 0.0001;
          this._actorHySprite.scale.y -= 0.0001;
          this._actorHySprite_1.scale.y -= 0.0001;
          this._mapMainFairSprite.scale.y -= 0.0001;
          //  this._mapStateSprite.scale.y -= 0.0002;
      }
      else {
          this._breatheCount = 0;
          this._mapFaceSprite.scale.y = 1;
          this._mapArmorSprite.scale.y = 1;
          this._mapMainSprite.scale.y = 1;
          this._actorBzSprite.scale.y = 1;
          //   this._actorFqSprite.scale.y = 1;
          //  this._actorKzSprite.scale.y = 1;
          this._actorYwSprite.scale.y = 1;
          this._actorHySprite.scale.y = 1;
          this._actorHySprite_1.scale.y = 1;
          this._mapMainFairSprite.scale.y = 1;
          // this._mapStateSprite.scale.y = 1;
      };
  };
  */
    /*隐藏*/
    /* 2025.2.12
  if ($gameSystem._hyCgVisible == false || $gameSystem._hyCgVisible == true) {
      this._actorHySprite_1.visible = $gameSystem._hyCgVisible;
  }
  if ($gameSystem._mapCgVisible == false || $gameSystem._mapCgVisible == true) {
      this._mapMainFairSprite.visible = $gameSystem._mapCgVisible;
      this._mapFaceSprite.visible = $gameSystem._mapCgVisible;
      this._mapArmorSprite.visible = $gameSystem._mapCgVisible;
      this._mapMainSprite.visible = $gameSystem._mapCgVisible;
      //  this._mapStateSprite.visible = $gameSystem._mapCgVisible;
      this._actorBzSprite.visible = $gameSystem._mapCgVisible;
      //  this._actorFqSprite.visible = $gameSystem._mapCgVisible;
      //   this._actorKzSprite.visible = $gameSystem._mapCgVisible;
      this._actorYwSprite.visible = $gameSystem._mapCgVisible;
      this._mapBackSprite.visible = $gameSystem._mapCgVisible;
      this._actorHySprite.visible = $gameSystem._mapCgVisible;
      if ($gameSystem._mapCgVisible == false) {
          this._actorHySprite_1.visible = $gameSystem._mapCgVisible;
      }
  }
  const actor = $gameParty.allMembers()[0];
  // if (actor) {
  //     const armor = $dataArmors[actor._equips[1]._itemId];
  //     if (armor) {
  //         const value = $gameParty.gainItemDurability(armor);
  //         const hzList = armor.meta.行走图换装.split(',');
  //         if (value >= 100) {
  //             actor.setCharacterImage('$N-8', 0);
  //             if ($gameSystem._mapCgVisible == false) {
  //                 //    this._mapMainFairSprite.visible = $gameSystem._mapCgVisible;
  //             } else {
  //                 //    this._mapMainFairSprite.show();
  //             }
  //         } else {
  //             //  this._mapMainFairSprite.hide();
  //             if (hzList.length >= 2) {
  //                 const hzImg = hzList[0];
  //                 const hzIndex = hzList[1];
  //                 actor.setCharacterImage(hzImg, hzIndex);
  //             } else {
  //                 const hzImg = hzList[0];
  //                 actor.setCharacterImage(hzImg, 0);
  //             }
  //         }
  //     } else {
  //         actor.setCharacterImage(actor._lastCharacterName, actor._lastCharacterIndex);
  //     }
  // }
  if ($gameSystem._mapCgVisible == false) {
      this._mapMainFairSprite.visible = $gameSystem._mapCgVisible;
  };
  */
};
FlyCat.LL_SceneMenu.Window_Message_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function () {
    if (SceneManager._scene instanceof Scene_Map) {
        const faceEye = $gameMessage.allText().match(/\\Face\[(\w+)\]/);
        if (faceEye) {
            const faceId = faceEye[1];
            //  SceneManager._scene._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/', '对话立绘-表情' + faceId);
            if (!$gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
                var text = 'b1-'
            } else {
                var text = 'b2-'
            }
            SceneManager._scene._mapMainBaseSprite._forList[1].bitmap = ImageManager.loadPictureLayer(text + faceId);
            $gameSystem._tempFaceName = '其他';
        }
    }
    FlyCat.LL_SceneMenu.Window_Message_startMessage.call(this)
};
FlyCat.LL_SceneMenu.Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function (text) {
    text = text.replace(/\\Face\[(\w+)\]/gi, "");
    return FlyCat.LL_SceneMenu.Window_Base_convertEscapeCharacters.call(this, text);
};
FlyCat.LL_SceneMenu.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function () {
    FlyCat.LL_SceneMenu.Window_Message_terminateMessage.call(this);
    if (SceneManager._scene instanceof Scene_Map) {
        //   SceneManager._scene._mapFaceSprite.bitmap = ImageManager.loadBitmap('img/menu/', '对话立绘-表情1');
        if (!$gameSwitches.value(Cat.PictureLayer.rmSwitch)) {
            var text = 'b1-1'
        } else {
            var text = 'b2-1'
        }
        SceneManager._scene._mapMainBaseSprite._forList[1].bitmap = ImageManager.loadPictureLayer(text);
        $gameSystem._tempFaceName = '对话立绘-表情1';
    };
};