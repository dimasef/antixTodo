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

    let getProgress = (tasks) => {
        let allTaskTimeToday = 0, perWidth = 0;
        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}
        for (let i = 0; i < tasks.length; i++) {
            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
        }
        return parseInt(perWidth);
    };

    let getDoneOrFailtTasks = (tasks, status) => {
        let arrDoneString = '', arrFailString = '', result;
        for (let i = 0; i < tasks.length; i++) {
            if(tasks.item(i).doneStatus) {
                arrDoneString += (arrDoneString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
            } else arrFailString += (arrFailString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;
        }
        return result = (status === 'fail') ? arrFailString : arrDoneString;
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

    let addHistotyTasks = (tasks) => {
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
                            <div class="task-text">${value.text}</div>
                            <span>Время которое необходимо затратить: ${value.time}</span>
                            <span data-id="${value.id}" class="removeTask">&times;</span>
                            ${value.eternity ? '<span class="infin">&infin;</span>' : ''}
                        </div>`;
                    }
                    let taskStatusInputs = document.querySelectorAll(".task-status");
                    let taskRemove = document.querySelectorAll(".removeTask");
                    taskStatusInputs.forEach((value) => {
                        value.onchange = () => {
                            db.transaction((tx) => {
                                tx.executeSql('UPDATE Task SET doneStatus=?, date=? WHERE id=?', [+value.checked, getCarrentDate(), value.id]);
                                showProgressLine(null, true);
                            }); 
                        }
                    });
                    taskRemove.forEach((value) => {
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
                    let pastTasks = sqlResultSet.rows;
                    const historyBlock = document.getElementById("history");
                    historyBlock.innerHTML = '';
                    for (let i = 0; i < pastTasks.length; i++) {
                        historyBlock.innerHTML += `<div class="history-day-block">
                            <div class="history-progress progress-${(pastTasks.item(i).progress == 0) ? 'empty' : 
                                (pastTasks.item(i).progress > 0 && pastTasks.item(i).progress <= 30) ? 'low' : 
                                (pastTasks.item(i).progress > 30 && pastTasks.item(i).progress <= 65) ? 'middle':
                                (pastTasks.item(i).progress > 65 && pastTasks.item(i).progress <= 99) ? 'good' : 'full'}">
                            </div>
                            <span>${pastTasks.item(i).date}</span>
                        </div>`;
                    }
                }
            });
        });
    })();

    let validateNewTastk = () => {
        const newTaskTest = document.getElementById("task-text").value,
            newTaskTime = document.getElementById("task-time").value,
            newTaskTimeUit = document.getElementById("task-time-unit").value;
        if (newTaskTest.length != 0 && newTaskTime.length != 0)
            return true;
        else return false;
    };

    btnNewTask.onclick = () => {
        const addNewTaskForm = document.getElementById("addNewTask-form");
        addNewTaskForm.classList.toggle("none");
    };

    addNewTask.onclick = () => {
        if(validateNewTastk()) {
            let taskTime = document.getElementById("task-time").value;
            const btnT = document.getElementById("task-time-unit"),
                  eternity = document.getElementById("eternity").checked,
                  addNewTaskForm = document.getElementById("addNewTask-form");

            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO Task (date, text, time, doneStatus, eternity) VALUES(?,?,?,?,?);', [getCarrentDate(), 
                    document.getElementById("task-text").value, taskTime, 0, +eternity]);
                addNewTask.dataset.id = addNewTaskForm.dataset.id++;
                showTakList();
            });
        } else {
            document.getElementById("addNewTask-form").classList.toggle("none");
        }
    };

} else alert('Ваш браузер НЕ підтримує openDatabase.');