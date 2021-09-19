// // const requestURL = 'http://localhost:63342/script.js/index.html?_ijt=ku9abma2ulpe9ph00no415j0ne';
// // const xhr = new XMLHttpRequest();
// // xhr.open('GET', requestURL);
// // xhr.send();
// const mysql = require('mysql');
// const conn = mysql.createConnection({
//     host: "server.mysql.tools",
//     user: "root",
//     database: "test_database",
//     password: "XXXYYY"
// });
// conn.connect(function (err) {
//     if (err) {
//         return console.error("Ошибка: " + err.message);
//     }
//     else {
//         console.log("Подключение к серверу MySQL успешно установлено");
//     }
// });
//
// let query="SELECT * FROM user";
//
// conn.query(query, (err, result, field) =>{
//     console.log(err);
//     console.log(result);
//     // console.log(field);
// });

let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
let task = ''; //rename
let arrayAlphabet = [];
let alphabetTemplate = document.getElementById('alphabetId');
let scores = 0;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

document.getElementById('scores').innerHTML = scores + '/8';
document.getElementById('scoresField').classList.add('scoresNotVisible');


let arrayOfTask = [
    {question: "Живописная головоломка", answer: "ПАЗЛ"},
    {question: "Инструмент для рисования у кондитеров", answer: "ШПРИЦ"},
    {question: "Отсутствие сил", answer: "ИЗНЕМОЖЕНИЕ"},
    {question: "Геометрическая фигура", answer: "ПРИЗМА"},
    {question: "Сорт бактерий молока", answer: "БИФИДОБАКТЕРИЯ"},
    {question: "Раздел физики", answer: "ЭЛЕКТРОДИНАМИКА"},
    {question: "Цвет", answer: "СИРЕНЕВЫЙ"},
    {question: "Напиток", answer: "КЕФИР"},
    {question: "Фрукт", answer: "ЯБЛОКО"},
    {question: "Животное", answer: "КРОЛИК"},
    {question: "Марка автомобиля", answer: "ФОРД"},
    {question: "Город в России", answer: "ВЛАДИМИР"},
    {question: "День недели", answer: "СУББОТА"},
];


document.getElementById("btnGenarateId").addEventListener("click", () => {
    document.getElementById('scoresField').className = 'scoresVisible';
    scores = 0;
    clearContext();
    document.getElementById("scores").innerHTML = scores + '/8';
    document.getElementById('fieldForAnswer').className = 'wordWhenPlayerNotWin';
    document.getElementById("btnGenarateId").innerHTML = 'Сгенерировать новое слово';
    changeStyleBtnGenerate();
    document.getElementById('nameOfTheGame').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('exitButton').style.display = 'block';
    task = arrayOfTask[Math.floor(Math.random() * arrayOfTask.length)];
    document.getElementById("fieldForQuestion").innerHTML = task.question;

    document.getElementById("fieldForAnswer").innerHTML = "";
    for (let i = 0; i < task.answer.length; i++) {
        document.getElementById("fieldForAnswer").innerHTML +=
            "_";
    } //todo:replace with map()

    if (arrayAlphabet.length) {
        let a = Array.from(document.getElementsByClassName('letters'));
        console.log(a)
        a = a.map((el) => {
            el.className = 'lettersDefault';
            el.removeAttribute('disabled')
            console.log(el);
        })
        console.log(a)
        return;
    }
    arrayAlphabet = alphabet.split('');
    arrayAlphabet.forEach((element) => {
        generateApplication(element)
    });


});


function generateApplication(selectedLetter) {
    let indexLetter = arrayAlphabet.indexOf(selectedLetter);
    let newHTMLElement = `<button id = ${indexLetter} class = 'letters' >${selectedLetter.toUpperCase()}  </button>`;
    alphabetTemplate.insertAdjacentHTML('beforeend', newHTMLElement);
    checkExistsLetter(indexLetter, selectedLetter);
}

function checkExistsLetter(indexLetter, selectedLetter) {

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    let scale = window.devicePixelRatio;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    ctx.scale(scale, scale)

    document.getElementById(indexLetter).addEventListener("click", () => {
        const wordLikeArray = task.answer.split('');
        console.log(wordLikeArray);
        document.getElementById(indexLetter).setAttribute('disabled', 'true');
        console.log(document.getElementById(indexLetter));
        let fieldForAnswer = document.getElementById("fieldForAnswer").textContent.split('');
        let isLetterExits = wordLikeArray.some((letter) => selectedLetter.toUpperCase() === letter);
        if (!isLetterExits) {
            selectWrongLetter(indexLetter);
            document.getElementById("scores").innerHTML = ++scores + '/8';//todo: replace with string template

            switch (scores) {
                case 1:
                    ctx.lineWidth = 3;
                    ctx.moveTo(25, 450);
                    ctx.lineTo(75, 450);
                    ctx.moveTo(50, 450);
                    ctx.lineTo(50, 50);
                    ctx.lineTo(250, 50);
                    ctx.moveTo(120, 50);
                    ctx.lineTo(50, 120);
                    ctx.stroke();
                    break;
                case 2:
                    ctx.lineWidth = 1;
                    ctx.moveTo(250, 50);
                    ctx.lineTo(250, 120);
                    ctx.stroke();
                    break;
                case 3:
                    ctx.lineWidth = 2;
                    ctx.moveTo(245, 127);
                    ctx.lineTo(250, 132);

                    ctx.beginPath();
                    ctx.arc(250, 145, 25, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                case 4:
                    ctx.moveTo(250, 170);
                    ctx.lineTo(250, 280);
                    ctx.stroke();
                    break;
                case 5:
                    ctx.moveTo(250, 180);
                    ctx.lineTo(200, 240);
                    ctx.stroke();
                    break;
                case 6:
                    ctx.moveTo(250, 180);
                    ctx.lineTo(300, 240);
                    ctx.stroke();
                    break;
                case 7:
                    ctx.moveTo(250, 280);
                    ctx.lineTo(200, 340);
                    ctx.stroke();
                    break;
                case 8:
                    ctx.moveTo(250, 280);
                    ctx.lineTo(300, 340);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                    ctx.moveTo(243, 135);
                    ctx.lineTo(237, 145);
                    ctx.stroke();
                    ctx.moveTo(237, 135);
                    ctx.lineTo(243, 145);
                    ctx.stroke();
                    ctx.moveTo(263, 135);
                    ctx.lineTo(257, 145);
                    ctx.stroke();
                    ctx.moveTo(255, 135);
                    ctx.lineTo(265, 145);
                    ctx.stroke();
                    ctx.moveTo(256, 157);
                    ctx.lineTo(246, 160);
                    ctx.stroke();

                    document.getElementById('GameOverPopUp').style.display = 'block';// todo:if some not work -> must be deleted!!!!!!
                    document.getElementById('popUpOverlay').style.display = 'initial';// todo:if some not work -> must be deleted!!!!!!
                    document.getElementsByClassName('letters').setAttribute('disabled', 'disabled');
                    document.getElementsByClassName('lettersDefault').setAttribute('disabled', 'disabled');
                    break;
            }
            return;
        }
        let exitsLetters = wordLikeArray.map((letter, index) => {
            if (selectedLetter.toUpperCase() === letter) {
                selectRightLetter(indexLetter);
                return letter;

            }
            if (fieldForAnswer[index] !== '_') {
                return fieldForAnswer[index];
            }
            return '_';
        });

        let exitsLettersString = exitsLetters.join('');
        document.getElementById("fieldForAnswer").innerHTML = exitsLettersString;


        if (task.answer === exitsLettersString) {
            document.getElementById("fieldForAnswer").className = 'wordWhenPlayerWin'
            setTimeout(() => {
                document.getElementById('popUpWin').style.display = 'block';
                document.getElementById('popUpOverlay').style.display = 'initial';// todo:if some not work -> must be deleted!!!!!!
            }, 1000);
        }


    });

}

document.getElementById('newWordBtnWhenGameOver').addEventListener('click', () => {
    generateNewWordAfterGameOver();
    document.getElementById('popUpOverlay').style.display = 'none';
})

document.getElementById('escapeWhenGameOver').addEventListener('click', () => {
    location.reload();
})

document.getElementById('newWordBtnWhenPlayerWin').addEventListener('click', () => {
    generateNewWordAfterPlayerWin();
    document.getElementById('popUpOverlay').style.display = 'none';
})

document.getElementById('escapeWhenPlayerWin').addEventListener('click', () => {
    location.reload();
})

document.getElementById('exitButton').addEventListener('click', () => {
    location.reload();
})

function selectWrongLetter(indexLetter) {
    document.getElementById(indexLetter).className = 'selectWrongLetter';
    setTimeout(() => document.getElementById(indexLetter).className = 'letters afterSelectedWrongLetter', 500);
}

function selectRightLetter(indexLetter) {
    document.getElementById(indexLetter).className = 'selectRightLetter';
    setTimeout(() => document.getElementById(indexLetter).className = 'letters afterSelectedRightLetter', 500);
}

function generateNewWordAfterGameOver() {
    document.getElementById("btnGenarateId").dispatchEvent(new Event("click"));
    document.getElementById('GameOverPopUp').style.display = 'none';
    document.getElementById('popUpOverlay').style.display = 'none';

}

function generateNewWordAfterPlayerWin() {
    document.getElementById("btnGenarateId").dispatchEvent(new Event("click"));
    document.getElementById('popUpWin').style.display = 'none';
    document.getElementById('popUpOverlay').style.display = 'none';
}

//


function changeStyleBtnGenerate() {
    //todo:replace by static object
    document.getElementById("btnGenarateId").style.top = '85%';
    document.getElementById("btnGenarateId").style.background = 'transparent';
    document.getElementById("btnGenarateId").style.color = '#8460e7';
    document.getElementById("btnGenarateId").style.boxShadow = 'none';
    document.getElementById("btnGenarateId").style.fontSize = '30px'

}

function clearContext() {
    let ctx = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    let scale = window.devicePixelRatio;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    ctx.scale(scale, scale)
}
