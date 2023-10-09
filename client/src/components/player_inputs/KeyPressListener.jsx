import React from 'react';

export default class KeyPressListener extends React.Component {
    constructor(keyCode, callback) {
        super(keyCode)
        let keySafe = true;

        this.keydownFunction = function (e) {
            if (e.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };

        this.keyupFunction = function (e) {
            if (e.code === keyCode) {
                keySafe = true;
            }
        };

        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
    }

    unbind() {
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFunction);
    }
}