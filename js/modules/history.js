'use strict'

import { db } from './task';

let getCarrentDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;
    today = dd + '.' + mm + '.' + yyyy;
    return today;
}

class TaskHistory {
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
                        getCarrentDate(), this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), this.getProgress(tasks)]);
                });
            }
        })
        .catch(error => {
            console.log(error); // Error: Not Found
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
                    this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), this.getProgress(tasks), getCarrentDate()]);
            });
        })
        .catch(error => {
            console.log(error); // Error: Not Found
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
        new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM TaskHistory WHERE date!=?',[getCarrentDate()], (sqlTransaction, sqlResultSet) => 
                    resolve(sqlResultSet.rows), reject);
            });
        }).then(history => {
            if(history.length) {
                let pastTasks = (Object.values(history));
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
        })
        .catch(error => {
            console.log(error); // Error: Not Found
        });
    }

    getProgress(tasks) {
        let allTaskTimeToday = 0, perWidth = 0;
        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}
        for (let i = 0; i < tasks.length; i++) {
            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
        }
        return parseInt(perWidth);
    }
}
export {getCarrentDate, TaskHistory};
export default TaskHistory;