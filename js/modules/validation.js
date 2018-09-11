"use strict";

import { insertAfter } from './helpers';

const _checkEmptyFilds = Symbol('_checkEmptyFilds');
const _checkFullFilds = Symbol('_checkFullFilds');
const _renderErrors = Symbol('_renderErrors');

class Validation {
    constructor (form) {
        this.form = form;
        this.arrValidRool = ['area', 'time'];
        this.statusBed = 0;
    }

    [_renderErrors] (status, fild, typeErr, messageForFull) {
        if(status === 'add') {
            let message = "Поле не должно быть пустым.";
            let p = document.createElement('p');
            p.innerText = (typeErr === 'full') ? messageForFull : message;
            p.classList.add('err');

            let fragment = document.createDocumentFragment();
            fild.classList.add('bad-valid');
            fragment.appendChild(p);
            insertAfter(fild, fragment);
        }
        else if(status === 'remove') {
            fild.classList.remove('bad-valid');
            this.statusValid = true;
            if(fild.nextSibling.nodeName !== '#text'){
                fild.nextSibling.remove();
            }
        }
    }

    [_checkEmptyFilds] (filds) {
        let tUnit = filds.find(elem => elem.dataset.valid === 'time-unit');
        let validRool = this.arrValidRool;
        let alredyValidate = false;

        filds.map(item => {
            alredyValidate = (item.classList.value.indexOf('bad-valid') > -1);
            if(validRool.includes(item.dataset.valid) && item.value === '' && !alredyValidate) {
                this[_renderErrors] ('add', item, 'empty');
            } 
            else if(validRool.includes(item.dataset.valid) && item.value !== '' && alredyValidate) {
                this[_renderErrors] ('remove', item);
                this[_checkFullFilds](item, tUnit.value);
            } 
            else if(validRool.includes(item.dataset.valid) && item.value !== '') {
                this[_checkFullFilds](item, tUnit.value);
            }

            this.statusBed += (item.classList.value.indexOf('bad-valid') > -1) ? 1 : 0;
        });
    }

    [_checkFullFilds] (fild, timeUnit) {
        switch(fild.dataset.valid) {
            case this.arrValidRool[0] : {
                if(fild.value.length > 255) 
                    this[_renderErrors] ('add', fild, 'full', 'Не больше 255 символов.');

                else {
                    this[_renderErrors] ('remove', fild);
                }
                break; 
            }
            case this.arrValidRool[1] : { 
                let tU = timeUnit;
                let intFilVal = parseInt(fild.value);
                if(!fild.value.match(/^\d+/))
                    this[_renderErrors] ('add', fild, 'full', 'Допустимы только цифры.');

                else if(intFilVal < 1 && tU === '1')
                    this[_renderErrors] ('add', fild, 'full', 'Не меньше одной минуты.');
                
                else if(intFilVal <= 0 && tU === '2')
                    this[_renderErrors] ('add', fild, 'full', 'Вы уже ее выполнели!');
                
                else if((intFilVal > 22 && tU === '2') || (intFilVal > 1320 && tU === '1'))
                    this[_renderErrors] ('add', fild, 'full', 'Возможен летальный исход!');

                else {
                    this[_renderErrors] ('remove', fild);
                }
                break; 
            }
        }
    }

    get validate () {
        let validateFilds = this.form.querySelectorAll(".valid");
        validateFilds = Array.from(validateFilds);
        this[_checkEmptyFilds](validateFilds);
        let resultStatus = (this.statusBed === 0) ? true : false;
        
        return resultStatus;
    }
}

export default Validation;