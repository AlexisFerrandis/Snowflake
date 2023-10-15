import React from 'react';
import KeyboardMenu from '../../player_inputs/KeyboardMenu';

export default class ReplacementMenu extends React.Component {
    // eslint-disable-next-line react/prop-types
    constructor({ replacements, onComplete }) {
        super(replacements);

        this.replacements = replacements;
        this.onComplete = onComplete;
    }

    decide() {
        this.menuSubmit(this.replacements[0]);
    }

    menuSubmit(replacement) {
        this.keyboardMenu?.end();
        this.onComplete(replacement);
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(
            this.replacements.map((c) => {
                return {
                    label: c.name,
                    description: c.description,
                    handler: () => {
                        this.menuSubmit(c);
                    },
                };
            })
        );
    }

    init(container) {
        if (this.replacements[0].isPlayerControlled) {
            this.showMenu(container);
        } else {
            this.decide();
        }
    }
}