import React from 'react';

import "./battle-event.scss"

import { wait } from '../../../Utils';
import { battleAnimations } from '../animations/BattleAnimations';

import TextMessage from "../../text/TextMessage"
import SubmissionMenu from '../menu/SubmissionMenu';
import ReplacementMenu from '../menu/ReplacementMenu';


export default class BattleEvent extends React.Component {
    constructor(event, battle) {
        super(event)

        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {
        const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{MOVE}", this.event.move?.name);

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            },
        });
        message.init(this.battle.element);
    }


    submissionMenu(resolve) {
        const { caster } = this.event;
        const menu = new SubmissionMenu({
            caster: caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            replacements: Object.values(this.battle.combatants).filter(c => {
                return c.id !== caster.id && c.team === caster.team && c.hp > 0
            }),
            onComplete: submission => {
                resolve(submission)
            }
        });
        menu.init(this.battle.element);
    }

    async stateChange(resolve) {
        const { caster, target, damage, recover, status } = this.event; //, statsHandler, move
        let who = this.event.onCaster ? caster : target;
        let casterStat = this.event.onCaster ? target : caster;

        // damage
        if (damage) {
            let initialDamage = Math.floor((damage * casterStat.level / 20) + (casterStat.baseStats[1] / 10) - (who.baseStats[2] / 10) - 2);
            target.update({
                hp: target.hp - initialDamage,
            });
            target.companionElement.classList.add('battle-damage-blink');
        }

        // recover
        if (recover) {
            let newHp = who.hp + recover;
            if (newHp > who.maxHp) {
                newHp = who.maxHp
            }
            who.update({
                hp: newHp
            })
        }

        // status
        if (status) {
            // if ( randomFromArray(statusHandler.probability)) {
            who.update({ status: { ...status } })
            // } 
        }
        if (status === null) {
            who.update({ status: null, });
        }
        // update team
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        await wait(800)
        target.companionElement.classList.remove('battle-damage-blink');
        resolve();
    }

    replacementMenu(resolve) {
        const menu = new ReplacementMenu({
            replacements: Object.values(this.battle.combatants).filter(c => {
                return c.team === this.event.team && c.hp > 0
            }),
            onComplete: replacement => {
                resolve(replacement)
            }
        })
        menu.init(this.battle.element)
    }

    async replace(resolve) {
        const { replacement } = this.event;

        // clear out the old companion
        const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        this.battle.activeCombatants[replacement.team] = null;
        prevCombatant.update();
        await wait(800);

        // with the new companion
        this.battle.activeCombatants[replacement.team] = replacement.id;
        replacement.update();
        await wait(800);

        // update team
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        resolve();
    }

    giveXp(resolve) {
        let amount = this.event.xp;
        const { combatant } = this.event;
        const step = () => {
            if (amount > 0) {
                amount -= 1;
                combatant.xp += 1;

                // check if we've hit level up point
                if (combatant.xp === combatant.maxXp) {

                    combatant.xp = 0;
                    combatant.maxXp += 11 + (combatant.level * 2);
                    combatant.hp += 3;
                    combatant.maxHp += 3;
                    combatant.level += 1;
                }
                combatant.update();

                // speed of xp container
                setTimeout(() => {
                    requestAnimationFrame(step);
                }, 20)
                return;
            }
            resolve();
        };
        requestAnimationFrame(step);
    }

    animation(resolve) {
        const fcn = battleAnimations[this.event.animation];
        fcn(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}