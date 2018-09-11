"use strict";
if(window.openDatabase) {

    const db = openDatabase("antiXToDodb","1.0","db", 2097152);

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    const taskList = document.getElementById("task-list");

    let timeConverter = time => {
        let timeResult = (time < 60) ? time + " мин." :
        ((time % 60) == 0) ? time / 60 + " час." : ~~(time / 60) + "час. " + time % 60 + " мин.";
        return timeResult;
    };

    let insertAfter = (referenceNode, newNode) => {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    

    class Task {
        constructor(date) {
            this.date = date;

            this.updateStatusTask = this.updateStatusTask.bind(this);
            this.removeTask = this.removeTask.bind(this);
        }

        add(taskInfo) {
            let {date, text, time, eternity} = taskInfo;
            db.transaction(tx => {
                tx.executeSql('INSERT INTO Task (date, text, time, doneStatus, eternity) VALUES(?,?,?,?,?);', 
                [date, text, time, 0, eternity]);
                this.renderTaslList();
            });
        }

        get tasks() {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => 
                        resolve(sqlResultSet.rows), reject);
                });
            });
        }

        renderTaslList() {
            this.tasks.then(tasks => {
                if(tasks.length) {
                    taskList.innerHTML = '';
                    let tableFilds = Array.from(tasks);
                    let fragment = document.createDocumentFragment();
                    tableFilds.map(item => {
                        let html = document.createElement('span');
                        if(item.date != this.date) {
                            this.resetEternityTask(item.id, item.eternity);
                        }
                        html.innerHTML += `<div class="task-block" data-id="${item.id}">
                            <div class="task-status-block">
                                <div class="switch">
                                    <label>
                                        <input id="${item.id}" type="checkbox" class="task-status" ${item.doneStatus ? 'checked' : ''}>
                                        <span class="lever"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="rigth-task-info">
                                <div class="rigth-task-info-body">
                                    <div class="task-text">${item.text}</div>
                                    <div class="tasl-time">Время которое необходимо затратить: ${timeConverter(item.time)}</div>
                                </div>
                                <div class="rigth-task-info-tail">
                                    ${item.eternity ? '<span class="infin">&infin;</span>' : ''}
                                    <span data-id="${item.id}" class="removeTask">&times;</span>
                                </div>
                            </div>
                        </div>`;
                        fragment.appendChild(html);
    
                        let taskStatus = html.querySelector('.task-status'),
                            taskRemoveBtn = html.querySelector('.removeTask');
    
                        taskStatus.addEventListener('click', () => this.updateStatusTask(item.id) );
                        taskRemoveBtn.addEventListener('click', () => this.removeTask(item.id) );
                    });
                    taskList.appendChild(fragment);
                
                    history.addHistotyTasks(tasks);
                    history.updateHistotyTasks();
                } 
                else taskList.innerHTML = '';
                this.showProgressLine(tasks);
            });

        }

        updateStatusTask(id) {
            let checked = +event.path[0].checked;
            db.transaction(tx => {
                tx.executeSql('UPDATE Task SET doneStatus=?, date=? WHERE id=?', [checked, this.date, id]);
                this.showProgressLine();
                history.updateHistotyTasks();
            }); 
        }

        removeTask(id) {
            db.transaction(tx => {
                tx.executeSql('DELETE FROM Task WHERE id=?', [id]);
                this.renderTaslList();
            }); 
        }

        resetEternityTask(id, eternityStatus) {
            db.transaction(tx => {
                if(eternityStatus)
                    tx.executeSql('UPDATE Task SET doneStatus=? WHERE id=?', [0, id]);
                else 
                    tx.executeSql('DELETE FROM Task WHERE id=?', [id]);
            });
        }

        showProgressLine(tasks) {
            let perWidthResult = 0;
            if(!tasks) {
                this.tasks.then(updatedTasks => {
                    perWidthResult = this.getProgress(updatedTasks);
                });
            }
            else perWidthResult = this.getProgress(tasks);

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
        }

        getProgress(tasks) {
            let allTaskTimeToday = 0, perWidth = 0;
            for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}
            for (let i = 0; i < tasks.length; i++) {
                perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
            }
            return parseInt(perWidth);
        };
    }

    class TaskHistory extends Task {

        addHistotyTasks(tasks) {
            new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT date FROM TaskHistory', [], (sqlTransaction, sqlResultSet) => 
                    resolve(sqlResultSet.rows), reject);
                });
            }).then(data => {
                let lastDate = data[Object.keys(data)[Object.keys(data).length - 1]];
                if(data.length < 1 || lastDate != getCarrentDate()) {
                    db.transaction((tx) => {
                        tx.executeSql('INSERT INTO TaskHistory (date, id_arr_done, id_arr_fail, progress) VALUES(?,?,?,?);', [
                            getCarrentDate(), this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), super.getProgress(tasks)]);
                    });
                }
            });
        }

        updateHistotyTasks() {
            new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => 
                    resolve(sqlResultSet.rows), reject);
                });
            }).then(tasks => {
                db.transaction((tx) => {
                    tx.executeSql('UPDATE TaskHistory SET id_arr_done=?, id_arr_fail=?, progress=?  WHERE date=?', [
                        this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), super.getProgress(tasks), getCarrentDate()]);
                });
            });
        }

        getDoneOrFailtTasks(tasks, status) {
            let arrDoneString = '', arrFailString = '', result = '';
            for (let i = 0; i < tasks.length; i++) {
                if(tasks.item(i).doneStatus) {
                    arrDoneString += (arrDoneString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
                } else arrFailString += (arrFailString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
            }
            return result = (status === 'fail') ? arrFailString.toString() : arrDoneString.toString();
        }

        showHistoryTask () {
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
        }
    }

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

        makeValidation () {
            let validateFilds = this.form.querySelectorAll(".valid");
            validateFilds = Array.from(validateFilds);
            this[_checkEmptyFilds](validateFilds);
            let resultStatus = (this.statusBed === 0) ? true : false;
            
            return resultStatus;
        }
    }
    
    // END NEW VALIDATION CLASS

        let task = new Task(getCarrentDate());
        let history = new TaskHistory();
        history.showHistoryTask();

        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
            tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
            //tx.executeSql('DROP TABLE TaskHistory;');

            task.renderTaslList();
        });



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
                  eternityTask = document.getElementById("eternity").checked,
                  taskText = document.getElementById("task-text").value;

            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;

            let taskOption = {
                date: getCarrentDate(),
                text: taskText,
                time: taskTime,
                eternity: +eternityTask
            };

            task.add(taskOption);
        } else {
            //document.getElementById("addNewTask-form").classList.toggle("none");
        }
    };

} else alert('Ваш браузер НЕ підтримує openDatabase.');