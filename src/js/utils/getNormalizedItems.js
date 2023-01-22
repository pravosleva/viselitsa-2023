const getNormalizedItems = ({ itemsArr, validateItem }) => itemsArr.reduce((acc, cur) => {
  const newItem = { answer: cur.answer.toUpperCase() }
  if (!!cur.question) newItem.question = cur.question

  if (validateItem(cur)) return [...acc, newItem]
  else return acc
}, [])

window.getNormalizedItems = getNormalizedItems
