'use strict'

import TaskHistory  from './history';
import { today, timeConverter } from './helpers';

const history = new TaskHistory();
const db = openDatabase("antiXToDodb","1.0","db", 2097152);

class Task {
    constructor() {
        this.date = today;

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
        const taskList = document.getElementById("task-list");
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
            this.showProgressLine();
        })
        .catch(error => {
            console.log(error); // Error: Not Found
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

    showProgressLine() {
        let perWidthResult = 0;
        this.tasks.then(updatedTasks => {
            perWidthResult = this.getProgress(updatedTasks);
            let progId = document.getElementById("progId");
            let allWidth = parseInt(progId.style.width);
            let progress = setInterval(() => {
                if (allWidth === perWidthResult) {
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
        });
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

export {db, Task};
export default Task;