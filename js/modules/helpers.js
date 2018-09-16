'use strict'

const db = openDatabase("antiXToDodb","1.0","db", 2097152);

/* 
    db.transaction((tx) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
        tx.executeSql('DROP TABLE TaskHistory;');
    });
*/
db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity, existence_days STRING);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
    // tx.executeSql('DROP TABLE Task;');
    // tx.executeSql('DROP TABLE TaskHistory;');
});
let insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

let getCarrentDate = getDay => {
    let date = new Date();
    let dd = date.getDate(),
        mm = date.getMonth() + 1,
        yyyy = date.getFullYear();

    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;
    let today = dd + '.' + mm + '.' + yyyy;
    return (getDay === 'dayId') ? date.getDay().toString() : today;
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
