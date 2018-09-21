'use strict'

//connect to database antiXToDodb in WebSql
const db = openDatabase("antiXToDodb","1.0","db", 2097152);

db.transaction((tx) => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity, existence_days STRING);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TaskComments (date, task_id, comment);');
    // tx.executeSql('DROP TABLE Task;');
    // tx.executeSql('DROP TABLE TaskHistory;');
});

//emulation insertAfter from jquery
let insertAfter = (referenceNode, newNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

//help function that return current date or current date id 
let getCurrentDate = getDay => {
    const date = new Date();
    let dd = date.getDate(),
        mm = date.getMonth() + 1,
        yyyy = date.getFullYear();

    if(dd < 10) dd = '0' + dd;
    if(mm < 10) mm = '0' + mm;
    const today = `${dd}.${mm}.${yyyy}`;
    return (getDay === 'dayId') ? date.getDay().toString() : today;
};

//help function that calculates daily progress
let calcProgress = tasks => {
    let allTaskTimeToday = 0, perWidth = 0;
    for (let i = 0; i < tasks.length; i++) {
        allTaskTimeToday += (tasks.item(i).existence_days.toString().includes(getCurrentDate('dayId'))) ? parseInt(tasks.item(i).time) : 0;
    }
    for (let i = 0; i < tasks.length; i++) {
        perWidth += (tasks.item(i).doneStatus && tasks.item(i).existence_days.toString().includes(getCurrentDate('dayId'))) 
        ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;
    }
    return parseInt(perWidth);
};

//help function that converts minutes into hours and hours and minutes
let timeConverter = time => {
    let timeResult = (time < 60) ? time + " мин." :
    ((time % 60) == 0) ? time / 60 + " час." : ~~(time / 60) + "час. " + time % 60 + " мин.";
    return timeResult;
};

export {
    getCurrentDate as today, 
    timeConverter, 
    calcProgress,
    insertAfter, 
    db
};
