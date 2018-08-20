"use strict";
if(window.openDatabase) {
    const db = openDatabase("antiXToDodb","1.0","db", 2097152);

    const btnNewTask = document.getElementById("show-addNewTask-form");
    const addNewTask = document.getElementById("add-new-task");
    const taskList = document.getElementById("task-list");

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

    let showProgressLine = (tasks) => {
        let allTaskTimeToday = 0, perWidth = 0, allWidth = 0;
        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}
        for (let i = 0; i < tasks.length; i++) {
            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
        }
        let progId = document.getElementById("progId");
        let progress = setInterval(() => {
            if (allWidth == parseInt(perWidth)) {
                clearInterval(progress);
            }
            else if (allWidth < parseInt(perWidth)) {
                allWidth++;
                progId.style.width = allWidth + '%';
            }
            else if (allWidth > perWidth) {
                allWidth--;
                progId.style.width = allWidth + '%';
            }
        }, 10);
    };
    let logTaskDoneFunc = (status, id) => {
        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM DatesTaskDone WHERE dateDone=?',[getCarrentDate()], (sqlTransaction, sqlResultSet) => {
                if(status) {
                    db.transaction((tx) => {
                        tx.executeSql('INSERT INTO DatesTaskDone (task_id, dateDone) VALUES(?,?);', [id, getCarrentDate()]);
                    });
                } else if(!status) {
                    db.transaction((tx) => {
                        tx.executeSql('DELETE FROM DatesTaskDone WHERE dateDone = ? AND task_id = ?;', [getCarrentDate(), id]);
                    });
                }
            });
        });
    };
  
    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DatesTaskDone (id INTEGER PRIMARY KEY AUTOINCREMENT, task_id, dateDone);');
        //tx.executeSql('DROP TABLE DatesTaskDone;');
        showTakList();
    });

    let taskReset = (id, eternityStatus) => {
        db.transaction((tx) => {
            if(value.eternity)
                tx.executeSql('UPDATE Task SET doneStatus=? WHERE id=?', [0, id]);
            else 
                tx.executeSql('DELETE FROM Task WHERE id=?', [id]);
        });
    };
    //функция вывода тасков 
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
                                <input id="${value.id}" type="checkbox" class="task-status" ${value.doneStatus ? 'checked' : ''}>
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
                                logTaskDoneFunc(value.checked, value.id);
                                showTakList();
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
                }
                else taskList.innerHTML = '';
                showProgressLine(sqlResultSet.rows);
            }); 
        });
    }

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