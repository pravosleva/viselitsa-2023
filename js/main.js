const initialState = {
  possibleItems: [],
  activeItem: null,
  isCanvasOpened: false,
  isCreateNewItemBtnEnabled: false,
}
const state = createProxiedState({
  initialState,
  opts: {
    set(_target, path, value, _receiver) {
      switch (path.join('.')) {
        case 'activeItem':
          // console.log(`activeItem -> ${JSON.stringify(value)}`)
          break
        case 'possibleItems':
          // console.log(`possibleItems -> ${JSON.stringify(value)}`)
          window.localStorage.setItem('savedPossibleItemsJSON', JSON.stringify(value))
          document.getElementById('possible-itens-counter').innerHTML = value.length

          document.getElementById('btnGenarateId').classList.toggle('sp-none', value.length === 0)

          if (value.length === 0) {
            window.alert('Слова закончились!')
            location.reload()
          }
          break
        case 'isCanvasOpened':
          if (!!value) {
            document.getElementById('canvas-wrapper-toggler').innerHTML = 'Close'
            document.getElementById('canvas-wrapper').classList.toggle('opened', true)
          } else {
            document.getElementById('canvas-wrapper-toggler').innerHTML = 'Open'
            document.getElementById('canvas-wrapper').classList.toggle('opened', false)
          }
          break
        case 'isCreateNewItemBtnEnabled':
          // console.log(`isCreateNewItemBtnEnabled -> ${value}`)
          // if (!!value) document.getElementById('create-new-item-btn').classList.toggle('sp-none', false)
          // else document.getElementById('create-new-item-btn').classList.toggle('sp-none', true)
          break
        default:
          break
      }
    },

    deleteProperty(_target, path) {
      throw new Error(`Cant delete prop ${path.join('.')}`)
    },
  },
})

let alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
let task = ''; //rename
let arrayAlphabet = [];
let alphabetTemplate = document.getElementById('alphabetId');
let scores = 0;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let audioSuccess = new Audio('audio/success.mp3');
let audioFail = new Audio('audio/fail.mp3');

document.getElementById('scores').innerHTML = scores + '/8';
document.getElementById('scoresField').classList.add('scoresNotVisible');

let arrayOfTask = [];

const initPossibleItemsFromLSOrCustom = () => {
  try {
    takeFromLS({
      fieldName: 'savedPossibleItemsJSON',
      defaultValue: [],
      cb: {
        onError: (e) => {
          console.log('onError')
          console.log(e)
          state.isCreateNewItemBtnEnabled = true
          setTimeout(() => document.getElementById('create-new-item-btn').dispatchEvent(new Event('click')))
        },
        onDefault: () => {
          console.log('onDefault')
          state.isCreateNewItemBtnEnabled = true
          setTimeout(() => document.getElementById('create-new-item-btn').dispatchEvent(new Event('click')))
        },
        onSuccess: (items) => {
          console.log('onSuccess')
          state.possibleItems = items
        }
      },
      dataValidation: (json) => Array.isArray(json) && json.length > 0 && json.every(item => !!item?.answer)
    })
  } catch (err) {
    console.error(err)
    state.possibleItems = arrayOfTask
  }
}
// NOTE: Ask load remote items or take from localStorage?
const init = ({
  onError
}) => {
  Swal.fire({
    title: 'Загрузить слова?',
    showDenyButton: true,
    denyButtonText: 'Нет, использовать свои',
    confirmButtonText: 'Загрузить из Google Sheets',
    allowOutsideClick: false,
    confirmButtonColor: 'var(--color-blue)',
    showCancelButton: false,
    customClass: {
      container: 'backdrop-blur',
    },
  }).then(({
    isConfirmed,
    isDenied,
  }) => {
    switch (true) {
      case isConfirmed:
        window.httpClient.getItems({
          limit: 200
        })
          .then((json) => {
            if (!!json?.items && Array.isArray(json.items) && json.items.length > 0 && json.items.every(item => !!item?.answer)) {
              const getNormalizedItems = (itemsArr) => itemsArr.reduce((acc, cur) => {
                const newItem = { answer: cur.answer.toUpperCase() }
                if (!!cur.question) newItem.question = cur.question
                return [...acc, newItem]
              }, [])
              const normalizedItems = getNormalizedItems(json.items)
              if (normalizedItems.length === 0) onError(new Error('Empty normalizedItems'))
              else state.possibleItems = normalizedItems
            } else {
              onError(new Error(`Incorrect data.items: ${typeof json.items}`))
            }
          })
          .catch((err) => {
            console.warn(err)
            onError(err)
          })
        break
      case isDenied:
        initPossibleItemsFromLSOrCustom()
        break
      default: break
    }
  })
}
init({
  onError: (err) => {
    Swal.fire({
      icon: 'error',
      tite: 'ERR',
      text: err?.message || 'No err.message',
      allowOutsideClick: false,
      confirmButtonColor: 'var(--color-blue)',
      customClass: {
        container: 'backdrop-blur',
      },
    })
      .then(() => {
        initPossibleItemsFromLSOrCustom()
      })
  }
})

document.getElementById("btnGenarateId").addEventListener("click", () => {
    state.isCanvasOpened = false
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

    const _arrayOfTask = state.possibleItems
    task = _arrayOfTask[Math.floor(Math.random() * _arrayOfTask.length)];

    state.activeItem = task
    if (!task) return
    if (!!task.question) document.getElementById("fieldForQuestion").innerHTML = task.question
    else document.getElementById("fieldForQuestion").innerHTML = "Нет подсказки ¯\\_(ツ)_/¯"

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
                    ctx.lineWidth = 2;
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
                    document.getElementById("end-img-fail").setAttribute('src', getRandomImgSrc({ type: 'fail' }))
                    try {
                      document.getElementsByClassName('letters').setAttribute('disabled', 'disabled');
                      document.getElementsByClassName('lettersDefault').setAttribute('disabled', 'disabled');
                    } catch (err) {
                      console.log(err)
                    }
                    break;
            }
            if (!state.isCanvasOpened)
              document.getElementById('canvas-wrapper-toggler').dispatchEvent(new Event("click"));
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
            document.getElementById("end-img-success").setAttribute('src', getRandomImgSrc({ type: 'success' }))
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

document.getElementById('canvas-wrapper-toggler').addEventListener('click', () => {
  state.isCanvasOpened = !state.isCanvasOpened
})

document.getElementById('reset-items-btn').addEventListener('click', () => {
  Swal.fire({
    title: `Удалить все слова (${state.possibleItems.length} шт.) из памяти браузера?`,
    showDenyButton: true,
    denyButtonText: 'No',
    confirmButtonText: 'Yes',
    allowOutsideClick: false,
    confirmButtonColor: 'var(--color-blue)',
    showCancelButton: false,
    customClass: {
      container: 'backdrop-blur',
    },
  }).then(({
    isConfirmed,
    isDenied,
  }) => {
    switch (true) {
      case isConfirmed:
        state.possibleItems = []
        break
      case isDenied:
        break
      default: break
    }
  })
})

document.getElementById('create-new-item-btn').addEventListener('click', () => {

  const runCreateNew = () => {
    const currentItems = state.possibleItems
    Swal.fire({
      input: 'text',
      title: 'Word',
      inputValue: '',
      allowOutsideClick: false,
      confirmButtonText: 'Next ➜',
      confirmButtonColor: 'var(--color-blue)',
      showCancelButton: currentItems.length > 0,
      customClass: {
        container: 'backdrop-blur',
      },
      inputValidator: (value) => {
        switch (true) {
          case !value:
            return 'You have to write something!'
          case !value.match(/[а-яА-ЯёЁ/]+$/):
            return 'Russian only, plz'
          default:
            return false
        }
      },
    })
    .then(({ value: word }) => {
      Swal.fire({
        input: 'text',
        title: 'Question (optional)',
        inputValue: '',
        allowOutsideClick: false,
        confirmButtonText: 'Next ➜',
        confirmButtonColor: 'var(--color-blue)',
        showCancelButton: false,
        customClass: {
          container: 'backdrop-blur',
        },
      })
      .then(({
        value: question,
        isConfirmed,
        // isDenied, isDismissed,
      }) => {
        const modifiedWord = word.toUpperCase()
        if (isConfirmed) {
          const newItems = []

          if (currentItems.length > 0) {
            let alreadyExists = false
            for (const item of currentItems) {
              if (item.answer.toUpperCase() === modifiedWord) {
                console.log('- case 1')
                const newItem = { answer: modifiedWord }
                if (!!question) newItem.question = question
    
                newItems.push(newItem)
                alreadyExists = true
              } else {
                console.log('- case 2')
                const newItem = { answer: item.answer }
                if (!!item.question) newItem.question = item.question
    
                newItems.push(newItem)
              }
            }
            if (!alreadyExists) {
              const newItem = { answer: modifiedWord }
              if (!!question) newItem.question = question
              newItems.push(newItem)
            }
          } else {
            const newItem = { answer: modifiedWord }
            if (!!question) newItem.question = question
            newItems.push(newItem)
          }

          state.possibleItems = newItems

          Swal.fire({
            title: 'Еще слово?',
            showDenyButton: true,
            denyButtonText: 'No',
            confirmButtonText: 'Yes',
            allowOutsideClick: false,
            confirmButtonColor: 'var(--color-blue)',
            showCancelButton: false,
            customClass: {
              container: 'backdrop-blur',
            },
          }).then(({
            isConfirmed,
            isDenied,
          }) => {
            switch (true) {
              case isConfirmed:
                runCreateNew()
                break
              case isDenied:
                break
              default: break
            }
          })
        }
      })
    })
  }
  runCreateNew()
})

function selectWrongLetter(indexLetter) {
    audioFail.load();
    audioFail.play();
    document.getElementById(indexLetter).className = 'selectWrongLetter';
    setTimeout(() => {
      document.getElementById(indexLetter).className = 'letters afterSelectedWrongLetter';
    }, 500);

}

function selectRightLetter(indexLetter) {
    audioSuccess.load();
    audioSuccess.play();
    document.getElementById(indexLetter).className = 'selectRightLetter';
    setTimeout(() => {
      document.getElementById(indexLetter).className = 'letters afterSelectedRightLetter'
    }, 500);
}

function generateNewWordAfterGameOver() {
    document.getElementById("btnGenarateId").dispatchEvent(new Event("click"));
    document.getElementById('GameOverPopUp').style.display = 'none';
    document.getElementById('popUpOverlay').style.display = 'none';

}

function generateNewWordAfterPlayerWin() {
    if (!!state.activeItem) {
      // NOTE: Удалим его из выбора
      state.possibleItems = state.possibleItems.filter(item => item.answer !== state.activeItem.answer)
    }
    document.getElementById("btnGenarateId").dispatchEvent(new Event("click"));
    document.getElementById('popUpWin').style.display = 'none';
    document.getElementById('popUpOverlay').style.display = 'none';
}

function changeStyleBtnGenerate() {
    //todo:replace by static object
    document.getElementById("btnGenarateId").style.top = '85%';
    document.getElementById("btnGenarateId").style.background = 'transparent';
    document.getElementById("btnGenarateId").style.color = '#00b7fc';
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
