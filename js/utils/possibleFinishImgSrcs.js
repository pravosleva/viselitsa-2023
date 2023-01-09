window.possibleFinishImgSrcs = {
  success: [
    'images/final/success-1-dicaprio.webp',
    'images/final/success-2-dicaprio.gif',
    'images/final/success-3-lock-stock-and-two-smoking-barrels.gif',
  ],
  fail: [
    'images/final/fail-1-dicaprio.png',
    'images/final/fail-2-carrey.jpeg',
    'images/final/fail-3-scrubs.jpeg',
    'images/final/fail-4-carrey.webp',
    'images/final/fail-5-pulp-fiction.jpg',
    'images/final/fail-6-from-dusk-till-dawn.jpg',
    'images/final/fail-7-lock-stock-and-two-smoking-barrels.jpeg',
    'images/final/fail-8-in-bruges.jpg',
    'images/final/fail-9-boondock-saints.jpg',
    'images/final/fail-10-boondock-saints.webp',
  ],
}

window.getRandomImgSrc = ({ type }) => {
  if (!type || !possibleFinishImgSrcs[type]) throw new Error(`Типа картинок ${type} не существует`)

  const arr = possibleFinishImgSrcs[type]

  return arr[Math.floor(Math.random() * arr.length)]
}
