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
                    let progress = '', let = '', fail = '', successOrFailString = '';
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