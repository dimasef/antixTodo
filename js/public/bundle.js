/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_task__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/task */ \"./js/modules/task.js\");\n/* harmony import */ var _modules_history__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/history */ \"./js/modules/history.js\");\n/* harmony import */ var _modules_validation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/validation */ \"./js/modules/validation.js\");\n/* harmony import */ var _modules_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/helpers */ \"./js/modules/helpers.js\");\n\n\n\n\n\n\n\nif(window.openDatabase) {\n\n    const btnNewTask = document.getElementById(\"show-addNewTask-form\");\n    const addNewTask = document.getElementById(\"add-new-task\");\n    \n    let task = new _modules_task__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    task.renderTaslList();\n\n    let history = new _modules_history__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n    history.showHistoryTask();\n\n    btnNewTask.addEventListener('click', () => {\n        const addNewTaskForm = document.getElementById(\"addNewTask-form\");\n        addNewTaskForm.classList.toggle(\"none\");\n    });\n\n    let addNewTaskForm = document.getElementById(\"addNewTask-form\");\n    addNewTask.addEventListener('click', () => {\n        event.preventDefault();\n        let validFormTask = new _modules_validation__WEBPACK_IMPORTED_MODULE_2__[\"default\"](addNewTaskForm);\n        \n        if(validFormTask.makeValidation()) {\n            let taskTime = document.getElementById(\"task-time\").value;\n            const btnT = document.getElementById(\"task-time-unit\"),\n                  eternityTask = document.getElementById(\"eternity\").checked,\n                  taskText = document.getElementById(\"task-text\").value;\n\n            taskTime = (btnT.options[btnT.selectedIndex].value === '1') ? taskTime : taskTime * 60;\n\n            let taskOption = {\n                date: _modules_helpers__WEBPACK_IMPORTED_MODULE_3__[\"today\"],\n                text: taskText,\n                time: taskTime,\n                eternity: +eternityTask\n            };\n\n            task.add(taskOption);\n            addNewTaskForm.classList.toggle(\"none\");\n        } \n    });\n\n\n} else alert('Ваш браузер НЕ підтримує openDatabase.');\n\n//# sourceURL=webpack:///./js/index.js?");

/***/ }),

/***/ "./js/modules/helpers.js":
/*!*******************************!*\
  !*** ./js/modules/helpers.js ***!
  \*******************************/
/*! exports provided: today, timeConverter, insertAfter, db */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"today\", function() { return getCarrentDate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"timeConverter\", function() { return timeConverter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"insertAfter\", function() { return insertAfter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"db\", function() { return db; });\n\n\nconst db = openDatabase(\"antiXToDodb\",\"1.0\",\"db\", 2097152);\n\n/* \n    db.transaction((tx) => {\n        tx.executeSql('CREATE TABLE IF NOT EXISTS Task (id INTEGER PRIMARY KEY AUTOINCREMENT, date, text, time, doneStatus, eternity);');\n        tx.executeSql('CREATE TABLE IF NOT EXISTS TaskHistory (date STRING PRIMARY KEY, id_arr_done STRING, id_arr_fail STRING, progress STRING);');\n        tx.executeSql('DROP TABLE TaskHistory;');\n    });\n*/\n\nlet insertAfter = (referenceNode, newNode) => {\n    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);\n};\n\nlet getCarrentDate = () => {\n    let today = new Date();\n    let dd = today.getDate();\n    let mm = today.getMonth() + 1;\n    let yyyy = today.getFullYear();\n    if(dd < 10) dd = '0' + dd;\n    if(mm < 10) mm = '0' + mm;\n    today = dd + '.' + mm + '.' + yyyy;\n    return today;\n};\n\nlet timeConverter = time => {\n    let timeResult = (time < 60) ? time + \" мин.\" :\n    ((time % 60) == 0) ? time / 60 + \" час.\" : ~~(time / 60) + \"час. \" + time % 60 + \" мин.\";\n    return timeResult;\n};\n\n\n\n\n//# sourceURL=webpack:///./js/modules/helpers.js?");

/***/ }),

/***/ "./js/modules/history.js":
/*!*******************************!*\
  !*** ./js/modules/history.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./js/modules/helpers.js\");\n\n\n\n\nclass TaskHistory {\n    addHistotyTasks(tasks) {\n        new Promise((resolve, reject) => {\n            _helpers__WEBPACK_IMPORTED_MODULE_0__[\"db\"].transaction((tx) => {\n                tx.executeSql('SELECT date FROM TaskHistory', [], (sqlTransaction, sqlResultSet) => \n                resolve(sqlResultSet.rows), reject);\n            });\n        }).then(data => {\n            let lastDate = data[Object.keys(data)[Object.keys(data).length - 1]];\n            if(data.length < 1 || lastDate != Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"today\"])()) {\n                _helpers__WEBPACK_IMPORTED_MODULE_0__[\"db\"].transaction((tx) => {\n                    tx.executeSql('INSERT INTO TaskHistory (date, id_arr_done, id_arr_fail, progress) VALUES(?,?,?,?);', [\n                        Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"today\"])(), this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), this.getProgress(tasks)]);\n                });\n            }\n        })\n        .catch(error => {\n            console.log(error); // Error\n        });\n    }\n    updateHistotyTasks() {\n        new Promise((resolve, reject) => {\n            _helpers__WEBPACK_IMPORTED_MODULE_0__[\"db\"].transaction((tx) => {\n                tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => \n                resolve(sqlResultSet.rows), reject);\n            });\n        }).then(tasks => {\n            _helpers__WEBPACK_IMPORTED_MODULE_0__[\"db\"].transaction((tx) => {\n                tx.executeSql('UPDATE TaskHistory SET id_arr_done=?, id_arr_fail=?, progress=?  WHERE date=?', [\n                    this.getDoneOrFailtTasks(tasks), this.getDoneOrFailtTasks(tasks, 'fail'), this.getProgress(tasks), Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"today\"])()]);\n            });\n        })\n        .catch(error => {\n            console.log(error); // Error\n        });\n    }\n\n    getDoneOrFailtTasks(tasks, status) {\n        let arrDoneString = '', arrFailString = '', result = '';\n        for (let i = 0; i < tasks.length; i++) {\n            if(tasks.item(i).doneStatus) {\n                arrDoneString += (arrDoneString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;\n            } else arrFailString += (arrFailString === '') ? tasks.item(i).id : ',' + tasks.item(i).id;\n        }\n        return result = (status === 'fail') ? arrFailString.toString() : arrDoneString.toString();\n    }\n\n    showHistoryTask () {\n        new Promise((resolve, reject) => {\n            _helpers__WEBPACK_IMPORTED_MODULE_0__[\"db\"].transaction((tx) => {\n                tx.executeSql('SELECT * FROM TaskHistory WHERE date!=?',[Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"today\"])()], (sqlTransaction, sqlResultSet) => \n                    resolve(sqlResultSet.rows), reject);\n            });\n        }).then(history => {\n            if(history.length) {\n                let pastTasks = (Object.values(history));\n                const historyBlock = document.getElementById(\"history\");\n                historyBlock.innerHTML = '';\n                let progress = '', success = '', fail = '', successOrFailString = '';\n                pastTasks.map(item => {\n                    success = item.id_arr_done.toString().split(',');\n                    fail = item.id_arr_fail.toString().split(',');\n                    success = (success.length > 1) ? success.length : (success[0] == '') ? 0 : 1; \n                    fail = (fail.length > 1) ? fail.length : (fail[0] == '') ? 0 : 1; \n                    successOrFailString = \"Выполнено \" + success + \" задач, невыполено \" + fail + \" задач.\";\n                    progress = (item.progress == 0) ? 'empty' : \n                        (item.progress > 0 && item.progress <= 30) ? 'low' : \n                        (item.progress > 30 && item.progress <= 65) ? 'middle':\n                        (item.progress > 65 && item.progress <= 99) ? 'good' : 'full';\n                    \n                    historyBlock.innerHTML += `<div class=\"history-day-block\">\n                        <div class=\"tooltipped history-progress progress-${progress}\" data-position=\"bottom\" \n                        data-tooltip=\"${successOrFailString}\">\n                            <span>${item.date}</span>\n                        </div>\n                    </div>`;\n                    \n                });\n                let instances = M.Tooltip.init(document.querySelectorAll('.tooltipped'));\n            }\n        })\n        .catch(error => {\n            console.log(error); // Error\n        });\n    }\n\n    getProgress(tasks) {\n        let allTaskTimeToday = 0, perWidth = 0;\n        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}\n        for (let i = 0; i < tasks.length; i++) {\n            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;\n        }\n        return parseInt(perWidth);\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (TaskHistory);\n\n//# sourceURL=webpack:///./js/modules/history.js?");

/***/ }),

/***/ "./js/modules/task.js":
/*!****************************!*\
  !*** ./js/modules/task.js ***!
  \****************************/
/*! exports provided: db, Task, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"db\", function() { return db; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Task\", function() { return Task; });\n/* harmony import */ var _history__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./history */ \"./js/modules/history.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"./js/modules/helpers.js\");\n\n\n\n\n\nconst history = new _history__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst db = openDatabase(\"antiXToDodb\",\"1.0\",\"db\", 2097152);\n\nclass Task {\n    constructor() {\n        this.date = _helpers__WEBPACK_IMPORTED_MODULE_1__[\"today\"];\n\n        this.updateStatusTask = this.updateStatusTask.bind(this);\n        this.removeTask = this.removeTask.bind(this);\n    }\n\n    add(taskInfo) {\n        let {date, text, time, eternity} = taskInfo;\n        db.transaction(tx => {\n            tx.executeSql('INSERT INTO Task (date, text, time, doneStatus, eternity) VALUES(?,?,?,?,?);', \n            [date, text, time, 0, eternity]);\n            this.renderTaslList();\n        });\n    }\n\n    get tasks() {\n        return new Promise((resolve, reject) => {\n            db.transaction(tx => {\n                tx.executeSql('SELECT * FROM Task',[], (sqlTransaction, sqlResultSet) => \n                    resolve(sqlResultSet.rows), reject);\n            });\n        });\n    }\n\n    renderTaslList() {\n        const taskList = document.getElementById(\"task-list\");\n        this.tasks.then(tasks => {\n            if(tasks.length) {\n                taskList.innerHTML = '';\n                let tableFilds = Array.from(tasks);\n                let fragment = document.createDocumentFragment();\n                tableFilds.map(item => {\n                    let html = document.createElement('span');\n                    if(item.date != this.date) {\n                        this.resetEternityTask(item.id, item.eternity);\n                    }\n                    html.innerHTML += `<div class=\"task-block\" data-id=\"${item.id}\">\n                        <div class=\"task-status-block\">\n                            <div class=\"switch\">\n                                <label>\n                                    <input id=\"${item.id}\" type=\"checkbox\" class=\"task-status\" ${item.doneStatus ? 'checked' : ''}>\n                                    <span class=\"lever\"></span>\n                                </label>\n                            </div>\n                        </div>\n                        <div class=\"rigth-task-info\">\n                            <div class=\"rigth-task-info-body\">\n                                <div class=\"task-text\">${item.text}</div>\n                                <div class=\"tasl-time\">Время которое необходимо затратить: ${Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"timeConverter\"])(item.time)}</div>\n                            </div>\n                            <div class=\"rigth-task-info-tail\">\n                                ${item.eternity ? '<span class=\"infin\">&infin;</span>' : ''}\n                                <span data-id=\"${item.id}\" class=\"removeTask\">&times;</span>\n                            </div>\n                        </div>\n                    </div>`;\n                    fragment.appendChild(html);\n\n                    let taskStatus = html.querySelector('.task-status'),\n                        taskRemoveBtn = html.querySelector('.removeTask');\n\n                    taskStatus.addEventListener('click', () => this.updateStatusTask(item.id) );\n                    taskRemoveBtn.addEventListener('click', () => this.removeTask(item.id) );\n                });\n                taskList.appendChild(fragment);\n            \n                history.addHistotyTasks(tasks);\n                history.updateHistotyTasks();\n            } \n            else taskList.innerHTML = '';\n            this.showProgressLine();\n        })\n        .catch(error => {\n            console.log(error); // Error: Not Found\n        });\n\n    }\n\n    updateStatusTask(id) {\n        let checked = +event.path[0].checked;\n        db.transaction(tx => {\n            tx.executeSql('UPDATE Task SET doneStatus=?, date=? WHERE id=?', [checked, this.date, id]);\n            this.showProgressLine();\n            history.updateHistotyTasks();\n        }); \n    }\n\n    removeTask(id) {\n        db.transaction(tx => {\n            tx.executeSql('DELETE FROM Task WHERE id=?', [id]);\n            this.renderTaslList();\n        }); \n    }\n\n    resetEternityTask(id, eternityStatus) {\n        db.transaction(tx => {\n            if(eternityStatus)\n                tx.executeSql('UPDATE Task SET doneStatus=? WHERE id=?', [0, id]);\n            else \n                tx.executeSql('DELETE FROM Task WHERE id=?', [id]);\n        });\n    }\n\n    showProgressLine() {\n        let perWidthResult = 0;\n        this.tasks.then(updatedTasks => {\n            perWidthResult = this.getProgress(updatedTasks);\n            let progId = document.getElementById(\"progId\");\n            let allWidth = parseInt(progId.style.width);\n            let progress = setInterval(() => {\n                if (allWidth === perWidthResult) {\n                    clearInterval(progress);\n                }\n                else if (allWidth < perWidthResult) {\n                    allWidth++;\n                    progId.style.width = allWidth + '%';\n                }\n                else if (allWidth > perWidthResult) {\n                    allWidth--;\n                    progId.style.width = allWidth + '%';\n                }\n            }, 5);\n        });\n    }\n\n    getProgress(tasks) {\n        let allTaskTimeToday = 0, perWidth = 0;\n        for (let i = 0; i < tasks.length; i++) {allTaskTimeToday += parseInt(tasks.item(i).time);}\n        for (let i = 0; i < tasks.length; i++) {\n            perWidth += (tasks.item(i).doneStatus) ? ((parseInt(tasks.item(i).time) * 100) / allTaskTimeToday) : 0;\n        }\n        return parseInt(perWidth);\n    };\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Task);\n\n//# sourceURL=webpack:///./js/modules/task.js?");

/***/ }),

/***/ "./js/modules/validation.js":
/*!**********************************!*\
  !*** ./js/modules/validation.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"./js/modules/helpers.js\");\n\n\n\n\nconst _checkEmptyFilds = Symbol('_checkEmptyFilds');\nconst _checkFullFilds = Symbol('_checkFullFilds');\nconst _renderErrors = Symbol('_renderErrors');\n\nclass Validation {\n    constructor (form) {\n        this.form = form;\n        this.arrValidRool = ['area', 'time'];\n        this.statusBed = 0;\n    }\n\n    [_renderErrors] (status, fild, typeErr, messageForFull) {\n        if(status === 'add') {\n            let message = \"Поле не должно быть пустым.\";\n            let p = document.createElement('p');\n            p.innerText = (typeErr === 'full') ? messageForFull : message;\n            p.classList.add('err');\n\n            let fragment = document.createDocumentFragment();\n            fild.classList.add('bad-valid');\n            fragment.appendChild(p);\n            Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"insertAfter\"])(fild, fragment);\n        }\n        else if(status === 'remove') {\n            fild.classList.remove('bad-valid');\n            this.statusValid = true;\n            if(fild.nextSibling.nodeName !== '#text'){\n                fild.nextSibling.remove();\n            }\n        }\n    }\n\n    [_checkEmptyFilds] (filds) {\n        let tUnit = filds.find(elem => elem.dataset.valid === 'time-unit');\n        let validRool = this.arrValidRool;\n        let alredyValidate = false;\n\n        filds.map(item => {\n            alredyValidate = (item.classList.value.indexOf('bad-valid') > -1);\n            if(validRool.includes(item.dataset.valid) && item.value === '' && !alredyValidate) {\n                this[_renderErrors] ('add', item, 'empty');\n            } \n            else if(validRool.includes(item.dataset.valid) && item.value !== '' && alredyValidate) {\n                this[_renderErrors] ('remove', item);\n                this[_checkFullFilds](item, tUnit.value);\n            } \n            else if(validRool.includes(item.dataset.valid) && item.value !== '') {\n                this[_checkFullFilds](item, tUnit.value);\n            }\n\n            this.statusBed += (item.classList.value.indexOf('bad-valid') > -1) ? 1 : 0;\n        });\n    }\n\n    [_checkFullFilds] (fild, timeUnit) {\n        switch(fild.dataset.valid) {\n            case this.arrValidRool[0] : {\n                if(fild.value.length > 255) \n                    this[_renderErrors] ('add', fild, 'full', 'Не больше 255 символов.');\n\n                else {\n                    this[_renderErrors] ('remove', fild);\n                }\n                break; \n            }\n            case this.arrValidRool[1] : { \n                let tU = timeUnit;\n                let intFilVal = parseInt(fild.value);\n                if(!fild.value.match(/^\\d+/))\n                    this[_renderErrors] ('add', fild, 'full', 'Допустимы только цифры.');\n\n                else if(intFilVal < 1 && tU === '1')\n                    this[_renderErrors] ('add', fild, 'full', 'Не меньше одной минуты.');\n                \n                else if(intFilVal <= 0 && tU === '2')\n                    this[_renderErrors] ('add', fild, 'full', 'Вы уже ее выполнели!');\n                \n                else if((intFilVal > 22 && tU === '2') || (intFilVal > 1320 && tU === '1'))\n                    this[_renderErrors] ('add', fild, 'full', 'Возможен летальный исход!');\n\n                else {\n                    this[_renderErrors] ('remove', fild);\n                }\n                break; \n            }\n        }\n    }\n\n    makeValidation () {\n        let validateFilds = this.form.querySelectorAll(\".valid\");\n        validateFilds = Array.from(validateFilds);\n        this[_checkEmptyFilds](validateFilds);\n        let resultStatus = (this.statusBed === 0) ? true : false;\n        \n        return resultStatus;\n    }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Validation);\n\n//# sourceURL=webpack:///./js/modules/validation.js?");

/***/ })

/******/ });