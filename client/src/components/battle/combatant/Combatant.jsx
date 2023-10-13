import React from 'react';
import "./combatant.scss"

import supportImg from "../../../assets/graphic/battle/battlebacks/field_base.png"

export default class Combatant extends React.Component {
    constructor(config, battle) {
        super(config)

        Object.keys(config).forEach(key => {
            this[key] = config[key]
        })

        // this.hp = typeof this.hp === "undefined" ? this.maxHp : this.hp;
        this.battle = battle;
    }

    get hpPercent() {
        const percent = (this.hp / this.maxHp) * 100;
        return percent > 0 ? percent : 0;
    }
    get xpPercent() {
        return (this.xp / this.maxXp) * 100;
    }
    get isActive() {
        return this.battle?.activeCombatants[this.team] === this.id;
    }
    get givesXp() {
        return this.level * this.BaseEXP;
    }

    createElement() {
        // display companion's info
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);

        this.hudElement.innerHTML = `
            <p class="combatant_name">${this.name}</p>
            <p class="combatant_status"></p>
            <p class="combatant_level">N.<span class="combatant-lvl"></span></p>

            <div class="life">
                <div class="life-container">
                    <p class="php">HP</p>
                    <div class="combatant_life-container"></div>
                </div>
                ${this.team === "player" ? `<p class="hp-number"></p>` : ""}
            </div>

            ${this.team === "player" ?
                `<div class="xp-container">
                    <p>EXP</p>
                    <div class="xpx">
                        <div class="combatant_xp-container"></div>
                    </div>
                </div>`
                : ""
            }
            
            <img src=${supportImg} class="support" alt="support" data-team=${this.team} />
            <img src="" class="combatant_icon"  alt="${this.name}" />
        `;

        this.hpFills = this.hudElement.querySelectorAll(".combatant_life-container");
        this.hpNumber = this.hudElement.querySelector(".hp-number");
        this.xpFills = this.hudElement.querySelectorAll(".combatant_xp-container");

        // display companion
        this.companionContainer = document.createElement("div")
        this.companionContainer.classList.add("companion-container")
        this.companionContainer.setAttribute("data-team", this.team);

        this.companionElement = document.createElement("img");
        this.companionElement.classList.add("companion");
        this.companionElement.setAttribute("src", this.imgSrc);
        this.companionElement.setAttribute("alt", this.name);
        this.companionElement.setAttribute("data-team", this.team);
    }

    update(changes = {}) {
        Object.keys(changes).forEach((key) => {
            this[key] = changes[key];
        });

        // update activ flag
        this.hudElement.setAttribute("data-active", this.isActive);
        this.companionElement.setAttribute("data-active", this.isActive);

        // update hp and xp
        if (this.hpNumber) {
            if (this.hp < 0) this.hp = 0;
            this.hpNumber.innerText = `${this.hp}/${this.maxHp}`;
        }
        this.hpFills.forEach((fill) => (fill.style.width = `${this.hpPercent}%`));
        this.xpFills.forEach((fill) => (fill.style.width = `${this.xpPercent}%`));

        if (this.hpPercent < 50) {
            this.hudElement.querySelector(".combatant_life-container").classList.add("half-life");
        }
        if (this.hpPercent < 7) {
            this.hudElement.querySelector(".combatant_life-container").classList.add("no-life");
        }
        if (this.hpPercent >= 50) {
            this.hudElement.querySelector(".combatant_life-container").classList.remove("half-life");
            this.hudElement.querySelector(".combatant_life-container").classList.remove("no-life");
        }

        // update lvl
        this.hudElement.querySelector(".combatant-lvl").innerText = this.level;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        container.appendChild(this.companionElement);

        this.update();
    }
}