/* eslint-disable react/prop-types */
import React from 'react';
import "./submission-menu.scss"

import { moves } from "../../content/Moves"
// import { items } from "../../content/Items"
import KeyboardMenu from '../../player_inputs/KeyboardMenu';

export default class SubmissionMenu extends React.Component {
    constructor({ caster, enemy, onComplete, replacements }) { // items,
        super(onComplete);

        this.caster = caster;
        this.enemy = enemy;
        this.replacements = replacements;
        this.onComplete = onComplete;

        // let quantityMap = {};
        // items.forEach(item => {
        //     if (item.team === caster.team) {

        //         let existing = quantityMap[item.itemId];
        //         if (existing) {
        //             existing.quantity += 1;
        //         } else {
        //             quantityMap[item.itemId] = {
        //                 itemId: item.itemId,
        //                 quantity: 1,
        //                 instanceId: item.instanceId
        //             }
        //         }
        //     }
        // })
        // this.item = Object.values(quantityMap);
    }

    getPages() {
        const backOption = {
            label: "Retour",
            description: "Retour",
            id: "back",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root);
                const itemMenu = document.querySelector(".keyboard-menu");
                if (itemMenu) itemMenu.classList.remove("item-menu")
            },
        };

        return {
            root: [
                {
                    label: "ATTAQUE",
                    description: `Que dois faire ${this.caster.name}?`,
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().attacks);
                    },
                },
                {
                    label: "ACTIONS",
                    description: `Que voulez vous faire ?`,
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().actions);
                    },
                },
                // {
                //     label: "SAC",
                //     description: "Utiliser un objet.",
                //     handler: () => {
                //         const itemMenu = document.querySelector(".keyboard-menu");
                //         itemMenu.classList.add("item-menu")
                //         this.keyboardMenu.setOptions(this.getPages().items);
                //     },
                // },
                {
                    label: "COMPAGNON",
                    description: "Changer de compagnon.",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().replacements);
                    },
                },
                {
                    label: "FUITE",
                    description: "Essayer de quitter le combat.",
                    handler: () => {
                        this.runSubmit(this.enemy.id);
                    },
                },
            ],
            attacks: [
                ...this.caster.Moves.map((key) => {
                    const move = moves[key];
                    return {
                        label: move.name,
                        description: move.Description,
                        handler: () => {
                            this.menuSubmit(move);
                        },
                    };
                }),
                backOption,
            ],
            actions: [
                ...this.caster.Moves.map((key) => {
                    const move = moves[key];
                    return {
                        label: move.name,
                        description: move.Description,
                        handler: () => {
                            this.menuSubmit(move);
                        },
                    };
                }),
                backOption,
            ],
            // items: [
            //     ...this.item.map((i) => {
            //         const item = items[i.itemId];

            //         return {
            //             // img src : 
            //             label: item.name,
            //             description: item.Description,
            //             right: () => {
            //                 return "x" + i.quantity;
            //             },
            //             handler: () => {
            //                 this.menuSubmit(item, i.instanceId);
            //                 const itemMenu = document.querySelector(".keyboard-menu");
            //                 if (itemMenu) itemMenu.classList.remove("item-menu")
            //             },
            //         };
            //     }),
            //     backOption,
            // ],
            replacements: [
                ...this.replacements.map((replacement) => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                            this.menuSubmitReplacement(replacement);
                        },
                    };
                }),
                backOption,
            ],
        };
    }

    menuSubmitReplacement(replacement) {
        this.keyboardMenu?.end();
        this.onComplete({
            replacement
        })
    }

    menuSubmit(move, instanceId = null) {
        this.keyboardMenu?.end();
        this.onComplete({
            move,
            target: move.TargetType === "friendly" ? this.caster : this.enemy,
            instanceId,
        });
    }

    runSubmit(enemyId) {
        this.keyboardMenu?.end();
        this.onComplete({ enemyId });
    }

    // enemy choice 
    decide() {
        // let enemyChoice = Math.floor((Math.random() * this.caster.moves.length))
        // this.menuSubmit(moves[this.caster.moves[enemyChoice]]);
        this.onComplete({
            move: moves[this.caster.moves[0]],
            target: this.enemy,
        })
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.getPages().root)
    }

    init(container) {
        this.decide();

        // if (this.caster.isPlayerControlled) {
        //     this.showMenu(container)
        // } else {
        //     this.decide();
        // }
    }
}