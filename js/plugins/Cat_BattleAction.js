//=============================================================================
// RPG Maker MZ - 多段攻击
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cat-<多段攻击/升级>
 * @author Cat
 * @help
 * 技能备注：
 * <多段时间:30,60,90>
 * 随机延迟只在随机目标的技能使用，默认为900毫秒
 * <随机延迟:x>
 */
'use strict';
var Imported = Imported || {};
Imported.Cat_BattleAction = true;

var Cat = Cat || {};
Cat.BattleAction = {};
Cat.BattleAction.parameters = PluginManager.parameters('Cat_BattleAction');

Cat.BattleAction.old_BattleManager_initMembers = BattleManager.initMembers;
BattleManager.initMembers = function () {
    Cat.BattleAction.old_BattleManager_initMembers.call(this);
    this._skillDamageCounts = 0;
    this._skillDamageType = false;
}

Cat.BattleAction.old_BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function () {
    Cat.BattleAction.old_BattleManager_startAction.call(this);
    this.startSkillDamage();
};

BattleManager.startSkillDamage = function () {
    const subject = this._subject;
    const action = subject.currentAction();
    const targets = action.makeTargets();

    $gameTemp._skillDamage = 0;
    $gameTemp._skillDamageCounts = 0;
    $gameTemp._skillDamageTime = [];
    this._skillDamageType = false;
    if (action._item && action._item._dataClass == "skill") {
        const skill = $dataSkills[Number(action._item._itemId)];
        if (skill && skill.meta.多段时间) {
            const a = action.subject();
            const b = targets[0];
            const v = $gameVariables._data;
            const sign = [3, 4].includes(skill.damage.type) ? -1 : 1;
            const value = Math.max(eval(skill.damage.formula), 0) * sign;
            $gameTemp._skillDamage = isNaN(value) ? 0 : value;
            $gameTemp._skillDamageTime = skill.meta.多段时间.split(',');
            $gameTemp._skillRandomTime = skill.meta.随机延迟 ? Number(skill.meta.随机延迟) : 900;
            if (action.isForRandom()) {
                $gameTemp._randomSkill = action.numTargets();
            } else {
                $gameTemp._randomSkill = 0;
            }
            this._skillDamageType = true;
        }
    }
};

BattleManager.updatePhase = function (timeActive) {
    switch (this._phase) {
        case "start":
            this.updateStart();
            break;
        case "turn":
            this.updateTurn(timeActive);
            break;
        case "action":
            if (!this._skillDamageType) {
                this.updateAction();
            } else if (this._skillDamageType) {

            } else {
                this._phase = "turnEnd";
            }
            break;
        case "turnEnd":
            this._skillDamageType = false;
            this.updateTurnEnd();
            break;
        case "battleEnd":
            this.updateBattleEnd();
            break;
    }
};

Cat.BattleAction.old_BattleManager_update = BattleManager.update;
BattleManager.update = function (timeActive) {
    this.effectSkillDamage();
    Cat.BattleAction.old_BattleManager_update.call(this, timeActive);
};

function hasDuplicates(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                return true;
            }
        }
    }
    return false;
}

function delayedExecution(i, subject, target) {
    setTimeout(function () {
        BattleManager.invokeAction(subject, target);
    }, i * $gameTemp._skillRandomTime);
}

BattleManager.effectSkillDamage = function () {
    if (!this._tempTarget) {
        this._tempTarget = [];
    }
    if (this._skillDamageType && this._subject) {
        this._skillDamageCounts++;
        if (this._skillDamageCounts == Number($gameTemp._skillDamageTime[$gameTemp._skillDamageCounts])) {
            this._skillDamageCounts = 0;
            $gameTemp._skillDamageCounts++;
            // if (this._targets.length > 1) {
            //     const targetList = this._targets;
            //     targetList.forEach(targets => {
            //         this.invokeAction(this._subject, targets);
            //     });
            // } else if (this._targets.length == 1) {
            //     if (!$gameTemp._catTargets) {
            //         $gameTemp._catTargets = this._targets.shift();
            // }
            if ($gameTemp._randomSkill > 0) {
                for (let i = 0; i < this._targets.length; i++) {
                    if (!this._tempTarget[i]) {
                        this._tempTarget[i] = this._targets[i];
                    }
                }
                if (hasDuplicates(this._tempTarget)) {
                    for (let s = 0; s < this._tempTarget.length; s++) {
                        delayedExecution(s, this._subject, this._tempTarget[s])
                    }
                } else {
                    for (let s = 0; s < this._tempTarget.length; s++) {
                        this.invokeAction(this._subject, this._tempTarget[s])
                    }
                }

            } else {
                this.updateAction();
            }
            //  this.invokeAction(this._subject, $gameTemp._catTargets);
            //}
            if ($gameTemp._skillDamageCounts == $gameTemp._skillDamageTime.length) {
                $gameTemp._skillDamageCounts = 0;
                this._skillDamageCounts = 0;
                // $gameTemp._catTargets = null;
                this._targets = [];
                if (this._targets.length == 0) {
                    this._tempTarget = [];
                    $gameTemp._skillDamage = 0;
                    $gameTemp._skillDamageTime = [];
                    this._skillDamageType = false;
                    //this._phase = "turnEnd";
                    if (this._subject) {
                        this.endAction();
                    } else {
                        this._phase = "turn";
                    }
                };
            }
        }
    }
};
