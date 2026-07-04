//=============================================================================
// RPG Maker MZ - SkillProficiency
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<SkillProficiency>
 * @author Cat
 * 
 * @param value
 * @type number
 * @default 50
 * @min 1
 * @text 技能升级熟练度
 * @desc
 * 
 * @command addSkillProficiency
 * @text 增加指定技能熟练度
 * @desc 增加指定技能熟练度
 * 
 * @arg id
 * @type skill
 * @default 
 * @min 1
 * @text 技能id
 * @desc 
 * 
 * @arg value
 * @type number
 * @default 
 * @min 1
 * @text 增加熟练度数值
 * @desc 
 * 
 * @help
 * 技能备注：
 * <技能升级:id>//id为技能进阶后的技能id
 * <技能熟练度:X>
 * 
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_SkillProficiency = true;

var Cat = Cat || {};
Cat.SkillProficiency = {};
Cat.SkillProficiency.parameters = PluginManager.parameters('Cat_SkillProficiency');
Cat.SkillProficiency.value = Number(Cat.SkillProficiency.parameters['value']) || 50;

PluginManager.registerCommand('Cat_SkillProficiency', 'addSkillProficiency', args => {
    const skillId = Number(args.id);
    const value = Number(args.value);
    $gameSystem.startSkillProficiency();
    if ($gameSystem._skillProficiency[skillId]) {
        $gameSystem._skillProficiency[skillId]._value += value;
        if ($gameSystem._skillProficiency[skillId]._value >= $gameSystem._skillProficiency[skillId]._maxValue) {
            $gameSystem._skillProficiency[skillId]._value = 0;
            const learnSkill = $gameSystem._skillProficiency[skillId]._skillId;
            $gameParty.allMembers()[0].learnSkill(learnSkill);
            $gameParty.allMembers()[0].forgetSkill(skillId);
            SoundManager.playUseItem();
        }
    };
});

Cat.SkillProficiency.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
    Cat.SkillProficiency.Game_System_initialize.call(this);
    this._skillProficiency = [];
    this.startSkillProficiency();
};

Game_System.prototype.startSkillProficiency = function () {
    for (let index = 1; index < $dataSkills.length; index++) {
        if ($dataSkills[index].meta.技能升级) {
            const skillId = Number($dataSkills[index].meta.技能升级);
            if (!this._skillProficiency[index]) {
                this._skillProficiency[index] = {};
                this._skillProficiency[index]._value = 0;
                this._skillProficiency[index]._skillId = skillId;
                if ($dataSkills[index].meta.技能熟练度) {
                    this._skillProficiency[index]._maxValue = Number($dataSkills[index].meta.技能熟练度);
                } else {
                    this._skillProficiency[index]._maxValue = Cat.SkillProficiency.value;
                }
            }
        };
    }
};

Cat.SkillProficiency.Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
Game_Action.prototype.applyItemUserEffect = function (target) {
    Cat.SkillProficiency.Game_Action_applyItemUserEffect.call(this, target);
    if (this.subject().isActor() && this.isSkill()) {
        const skill = this.item();
        $gameSystem.startSkillProficiency();
        if ($gameSystem._skillProficiency[skill.id]) {
            $gameSystem._skillProficiency[skill.id]._value++;
            if ($gameSystem._skillProficiency[skill.id]._value >= $gameSystem._skillProficiency[skill.id]._maxValue) {
                $gameSystem._skillProficiency[skill.id]._value = 0;
                const learnSkill = $gameSystem._skillProficiency[skill.id]._skillId;
                this.subject().learnSkill(learnSkill);
                this.subject().forgetSkill(skill.id);
                SoundManager.playUseItem();
            }
        };
    };
};

Window_NewSkillList.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.drawCursorBitmap(rect);
        this.contents.fontSize = 20;
        this.drawItemName(skill, rect.x + 30, rect.y, rect.width - costWidth, index);
        if ($gameSystem._skillProficiency[skill.id]) {
            this.contents.FillRect(rect.x + 10, rect.y + 37, 201, 6, '#b4b0af');
            this.contents.FillRect(rect.x + 11, rect.y + 38, $gameSystem._skillProficiency[skill.id]._value / $gameSystem._skillProficiency[skill.id]._maxValue * 200, 4, '#31f851');
        };
        this.contents.fontSize = 18;
        this.drawSkillCost(skill, rect.x, rect.y + 16, rect.width - 50);
    }
};

Window_BattleSkill.prototype.drawItem = function (index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(skill));
        this.changeTextColor('#462a39');
        //  this.contents.outlineColor = '#462a39';
        this.contents.outlineWidth = 1;
        this.drawItemName(skill, rect.x + 4, rect.y, rect.width - costWidth);
        if ($gameSystem._skillProficiency[skill.id]) {
            this.contents.FillRect(rect.x + 16, rect.y + 31, 201, 6, '#b4b0af');
            this.contents.FillRect(rect.x + 17, rect.y + 32, $gameSystem._skillProficiency[skill.id]._value / $gameSystem._skillProficiency[skill.id]._maxValue * 200, 4, '#31f851');
        };
        this.drawSkillCost(skill, rect.x - 2, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};