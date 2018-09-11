'use strict'

const db = openDatabase("antiXToDodb","1.0","db", 2097152);

/* 
    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
        tx.executeSql('DROP TABLE TaskHistory;');
    });
*/

let insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

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

export {
    getCarrentDate as today, 
    timeConverter, 
    insertAfter, 
    db
};
