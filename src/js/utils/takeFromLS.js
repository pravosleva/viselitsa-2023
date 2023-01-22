const takeFromLS = ({
  fieldName,
  defaultValue,
  cb: {
    onError,
    onDefault,
    onSuccess,
    onFinally,
  },
  dataValidation,
}) => {
  let result = defaultValue
  try {
    const _savedPossibleItems = window.localStorage.getItem(fieldName)

    if (!_savedPossibleItems) {
      if (!!onDefault && !onFinally) {
        onDefault()
        return
      }
    }
  
    result = JSON.parse(_savedPossibleItems)

    if (dataValidation(result)) {
      if (!!onSuccess) onSuccess(result)
    } else {
      if (!!onDefault) onDefault()
    }
  } catch (err) {
    if (!!onError) onError(err)
  }

  if (!!onFinally) onFinally(result)
}

window.takeFromLS = takeFromLS
