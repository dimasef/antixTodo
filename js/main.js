"use strict";
if(window.openDatabase) {

    const db = openDatabase("antiXToDodb","1.0","db", 2097152);

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    const taskList = document.getElementById("task-list");

    (function(){
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
            tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
            //tx.executeSql('DROP TABLE DatesTaskDone;');
            showTakList();
        });
    })();
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    let getCarrentDate = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if(dd < 10) dd = '0' + dd;
        if(mm < 10) mm = '0' + mm;
        today = dd + '.' + mm + '.' + yyyy;
        return today;
    }; 

    let timeConverter = time => {
        let timeResult = (time < 60) ? time + " мин." :
        ((time % 60) == 0) ? time / 60 + " час." : ~~(time / 60) + "час. " + time % 60 + " мин.";
        return timeResult;
    };

    let getProgress = tasks => {
        let allTaskTimeToday = 0, perWidth = 0;
        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}
        for (let i = 0; i < tasks.length; i++) {
            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
        }
        return parseInt(perWidth);
    };

    let getDoneOrFailtTasks = (tasks, status) => {
        let arrDoneString = '', arrFailString = '', result = '';
        for (let i = 0; i < tasks.length; i++) {
            if(tasks.item(i).doneStatus) {
                arrDoneString += (arrDoneString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
            } else arrFailString += (arrFailString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
        }
        return result = (status === 'fail') ? arrFailString.toString() : arrDoneString.toString();
    };

    let showProgressLine = (tasks, reload) => {
        let perWidthResult = {};
        if(reload) {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => {
                    perWidthResult = getProgress(sqlResultSet.rows);
                });
            });
        }
        else perWidthResult = getProgress(tasks);
        let progId = document.getElementById("progId");
        let allWidth = parseInt(progId.style.width);
        let progress = setInterval(() => {
            if (allWidth == perWidthResult) {
                clearInterval(progress);
            }
            else if (allWidth < perWidthResult) {
                allWidth++;
                progId.style.width = allWidth + '%';
            }
            else if (allWidth > perWidthResult) {
                allWidth--;
                progId.style.width = allWidth + '%';
            }
        }, 5);
    };

    let taskReset = (id, eternityStatus) => {
        db.transaction((tx) => {
            if(eternityStatus)
                tx.executeSql('UPDATE Task SET doneStatus=? WHERE id=?', [0, id]);
            else 
                tx.executeSql('DELETE FROM Task WHERE id=?', [id]);
        });
    };

    let addHistotyTasks = tasks => {
        db.transaction((tx) => {
            tx.executeSql('SELECT date FROM TaskHistory', [], (sqlTransaction, sqlResultSet) => {
                let lastDate = sqlResultSet.rows[Object.keys(sqlResultSet.rows)[Object.keys(sqlResultSet.rows).length - 1]];
                if(sqlResultSet.rows.length < 1 || lastDate != getCarrentDate()) {
                    db.transaction((tx) => {
                        tx.executeSql('INSERT INTO TaskHistory (date, id_arr_done, id_arr_fail, progress) VALUES(?,?,?,?);', [getCarrentDate(),
                        getDoneOrFailtTasks(tasks), getDoneOrFailtTasks(tasks, 'fail'), getProgress(tasks)]);
                    });
                }
            });
        });
    };

    let updateHistotyTasks = () => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => {
                let tasks = sqlResultSet.rows;
                db.transaction((tx) => {
                    tx.executeSql('UPDATE TaskHistory SET id_arr_done=?, id_arr_fail=?, progress=?  WHERE date=?', [
                        getDoneOrFailtTasks(tasks), getDoneOrFailtTasks(tasks, 'fail'), getProgress(tasks), getCarrentDate()]);
                });
            });
        });
    };

    function showTakList () {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => {
                if(sqlResultSet.rows.length) {
                    let lastTask = sqlResultSet.rows[Object.keys(sqlResultSet.rows)[Object.keys(sqlResultSet.rows).length - 1]];
                    document.getElementById("addNewTask-form").dataset.id = ++lastTask.id;
                    let value;
                    taskList.innerHTML = '';
                    for (let i = 0; i < sqlResultSet.rows.length; i++) {
                        value = sqlResultSet.rows.item(i);
                        if(value.date != getCarrentDate()) {
                            taskReset(value.id, value.eternity);
                        }
                        taskList.innerHTML += `<div class="task-block" data-id="${value.id}">
                            <div class="task-status-block">
                                <div class="switch">
                                    <label>
                                        <input id="${value.id}" type="checkbox" class="task-status" ${value.doneStatus ? 'checked' : ''}>
                                        <span class="lever"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="rigth-task-info">
                                <div class="rigth-task-info-body">
                                    <div class="task-text">${value.text}</div>
                                    <div class="tasl-time">Время которое необходимо затратить: ${timeConverter(value.time)}</div>
                                </div>
                                <div class="rigth-task-info-tail">
                                    ${value.eternity ? '<span class="infin">&infin;</span>' : ''}
                                    <span data-id="${value.id}" class="removeTask">&times;</span>
                                </div>
                            </div>
                        </div>`;
                    }
                    let taskStatusInputs = document.querySelectorAll(".task-status");
                    let taskRemove = document.querySelectorAll(".removeTask");
                    taskStatusInputs.forEach(value => {
                        value.onchange = () => {
                            db.transaction((tx) => {
                                tx.executeSql('UPDATE Task SET doneStatus=?, date=? WHERE id=?', [+value.checked, getCarrentDate(), value.id]);
                                showProgressLine(null, true);
                                updateHistotyTasks();
                            }); 
                        }
                    });
                    taskRemove.forEach(value => {
                        value.onclick = () => {         
                            db.transaction((tx) => {
                                tx.executeSql('DELETE FROM Task WHERE id=?', [value.dataset.id]);
                                showTakList();
                            }); 
                        }
                    });
                    addHistotyTasks(sqlResultSet.rows);
                    updateHistotyTasks();
                }
                else taskList.innerHTML = '';
                showProgressLine(sqlResultSet.rows);
            }); 
        });
    }

    (function showHistoryTask () {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM TaskHistory WHERE date!=?',[getCarrentDate()], (sqlTransaction, sqlResultSet) => {
                if(sqlResultSet.rows.length) {
                    
                    let pastTasks = (Object.values(sqlResultSet.rows));
                    const historyBlock = document.getElementById("history");
                    historyBlock.innerHTML = '';
                    let progress = '', success = '', fail = '', successOrFailString = '';
                    pastTasks.forEach(item => {
                        success = item.id_arr_done.toString().split(',');
                        fail = item.id_arr_fail.toString().split(',');
                        success = (success.length > 1) ? success.length : (success[0] == '') ? 0 : 1; 
                        fail = (fail.length > 1) ? fail.length : (fail[0] == '') ? 0 : 1; 
                        successOrFailString = "Выполнено " + success + " задач, невыполено " + fail + " задач.";
                        progress = (item.progress == 0) ? 'empty' : 
                            (item.progress > 0 && item.progress <= 30) ? 'low' : 
                            (item.progress > 30 && item.progress <= 65) ? 'middle':
                            (item.progress > 65 && item.progress <= 99) ? 'good' : 'full';
                        
                        historyBlock.innerHTML += `<div class="history-day-block">
                            <div class="tooltipped history-progress progress-${progress}" data-position="bottom" 
                            data-tooltip="${successOrFailString}">
                                <span>${item.date}</span>
                            </div>
                        </div>`;
                        
                    });
                    let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));
                }
            });
        });
    })();

    // NEW VALIDATION CLASS
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
                    if(!fild.value.match(/^\d+/))
                        this[_renderErrors] ('add', fild, 'full', 'Допустимы только цифры.');

                    else if(parseInt(fild.value) < 1 && tU === '1')
                        this[_renderErrors] ('add', fild, 'full', 'Не меньше одной минуты.');
                    
                    else if(parseInt(fild.value) <= 0 && tU === '2')
                        this[_renderErrors] ('add', fild, 'full', 'Вы уже ее выполнели!');
                    
                    else if((parseInt(fild.value) > 22 && tU === '2') || (parseInt(fild.value) > 1320 && tU === '1'))
                        this[_renderErrors] ('add', fild, 'full', 'Возможен летальный исход!');

                    else {
                        this[_renderErrors] ('remove', fild);
                    }
                    break; 
                }
            }
        }

        makeValidation () {
            let validateFilds = this.form.querySelectorAll(".valid");
            validateFilds = Object.assign([], validateFilds);
            this[_checkEmptyFilds](validateFilds);
            let resultStatus = (this.statusBed === 0) ? true : false;
            
            return resultStatus;
        }
    }

    // END NEW VALIDATION CLASS

    btnNewTask.onclick = () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        addNewTaskForm.classList.toggle("none");
    };

    let addNewTaskForm = document.getElementById("addNewTask-form");
    
    addNewTask.onclick = event => {
        event.preventDefault();
        let validFormTask = new Validation(addNewTaskForm);
        
        if(validFormTask.makeValidation()) {
            let taskTime = document.getElementById("task-time").value;
            const btnT = document.getElementById("task-time-unit"),
                  eternity = document.getElementById("eternity").checked;

            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO Task (date, text, time, doneStatus, eternity) VALUES(?,?,?,?,?);', [getCarrentDate(), 
                    document.getElementById("task-text").value, taskTime, 0, +eternity]);
                addNewTask.dataset.id = addNewTaskForm.dataset.id++;
                showTakList();
            });
        } else {
            //document.getElementById("addNewTask-form").classList.toggle("none");
        }
    };

} else alert('Ваш браузер НЕ підтримує openDatabase.');