import React from 'react';
import "./battle-event.scss"

import { wait } from '../../../Utils';

import TextMessage from "../../text/TextMessage"
import SubmissionMenu from '../menu/SubmissionMenu';
import { battleAnimations } from '../animations/BattleAnimations';

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
        // const { caster } = this.event;
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            // replacements: Object.values(this.battle.combatants).filter(c => {
            //     return c.id !== caster.id && c.team === caster.team && c.hp > 0
            // }),
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
            await wait(800)
            target.companionElement.classList.remove('battle-damage-blink');
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
        resolve();
    }

    animation(resolve) {
        const fcn = battleAnimations[this.event.animation];
        fcn(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}