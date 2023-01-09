const takeFromLS = ({ fieldName, defaultValue, cb: { onError, onDefault, onSuccess }, dataValidation }) => {
  let result = defaultValue
  try {
    const _savedPossibleItems = window.localStorage.getItem(fieldName)

    if (!_savedPossibleItems) {
      onDefault()
      return
    }
  
    result = JSON.parse(_savedPossibleItems)

    if (dataValidation(result)) {
      onSuccess(result)
    } else {
      onDefault()
    }
  } catch (err) {
    onError(err)
  }
}

window.takeFromLS = takeFromLS
