/*
 Copyright 2016
 Pilyugin Alexey

 This file is part of Voice ART.

 Voice ART is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Voice ART is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Voice ART.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import AbstractFieldAdapter from './abstract-field-adapter';
import ItemEvent from './../common/item/item-event';


const FIELD_SELECTOR = `input`;
var $ = jQuery;

export default class CxpFitbAdapter extends AbstractFieldAdapter {

    /** @inheritdoc */
    _initHook() {
        super._initHook();
        this.inputElement = this.domElement.matches(FIELD_SELECTOR) ? this.domElement : this.domElement.querySelector(FIELD_SELECTOR);
        this.paletteIsUsed = this.inputElement.matches('.mtqengine-symbolic, .ci-mathml-mathml');
        this.displayElement = this.paletteIsUsed ? this.inputElement.parentNode.querySelector('.math-palette-field') : this.inputElement;
    }

    /** @inheritdoc */
    addFocusEmission() {
        if (this.paletteIsUsed) {
            var textarea = this.displayElement.querySelector('textarea');
            if (!textarea)
                return;
            textarea.addEventListener('focus', () => {
                this.emit(ItemEvent.FIELD_FOCUSED);
            });
        }
        else {
            this.inputElement.addEventListener('focus', () => {
                this.emit(ItemEvent.FIELD_FOCUSED);
            });
        }
    }

    /** @inheritdoc */
    buildModel() {
        if (!this._model) {
            this._model = {
                subtype: this.paletteIsUsed ? 'math' : 'text'
            };
        }
        return this._model;
    }

    /** @inheritdoc */
    clear() {
        this.setState('');
    }

    /** @inheritdoc */
    focus() {
        if (this.paletteIsUsed) {
            var downEvent = document.createEvent('MouseEvents');
            downEvent.initEvent('click', true, true);
            this.displayElement.dispatchEvent(downEvent);
        }
        else {
            this.inputElement.focus();
        }
    }

    /** @inheritdoc */
    getState() {
        //todo: convert to speech
        return this.paletteIsUsed ? $(this.displayElement).palette('mathml') : this.inputElement.value;
    }

    /** @inheritdoc */
    setState(state) {
        if (this.paletteIsUsed) {
            $(this.displayElement).palette('mathml', state);
        }
        else {
            this.inputElement.value = state;
        }
    }

};