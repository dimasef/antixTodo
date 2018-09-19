'use strict'
import Task from './task';
import { db } from './helpers';

class TaskCommnets extends Task {
    constructor() {
        super();
    }

    checkComment(date, taskId) {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM TaskComments WHERE date=? AND task_id=?',[date, taskId], (sqlTransaction, sqlResultSet) => 
                    resolve(sqlResultSet.rows), reject);
            });
        });
    }

    init(commentInfo) {
        let {date, text, taskId} = commentInfo;
        this.checkComment(date, taskId).then(comments => {
            console.log(comments.length);
            if(comments.length === 0) {
                this.add(commentInfo);
            }
            else if(text === '') {
                this.delete(commentInfo);
            }
            else {
                this.update(commentInfo);
            }
        });
    }

    add(commentInfo) {
        let {date, text, taskId} = commentInfo;
        db.transaction(tx => {
            tx.executeSql('INSERT INTO TaskComments (date, task_id, comment) VALUES(?,?,?);', 
            [date, taskId, text]);
            M.toast({html: 'Комментарий добавлен!', displayLength: 1600, classes: 'antix-toast'});
        });
    }

    update(commentInfo) {
        let {date, text, taskId} = commentInfo;
        db.transaction(tx => {
            tx.executeSql('UPDATE TaskComments SET comment=? WHERE date=? AND task_id=?', 
            [text, date, taskId]);
            M.toast({html: 'Комментарий обновлен!', displayLength: 1600, classes: 'antix-toast'});
        });
    }

    delete(commentInfo) {
        let {date, taskId} = commentInfo;
        db.transaction(tx => {
            tx.executeSql('DELETE FROM TaskComments WHERE date=? AND task_id=?', 
            [date, taskId]);
            M.toast({html: 'Комментарий удален!', displayLength: 1600, classes: 'antix-toast-dangerous'});
        });
    }
}

export default TaskCommnets;