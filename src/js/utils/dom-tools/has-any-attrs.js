const hasClassName = (elm, className) => !!elm.classList && elm.classList.contains(className)
window.hasClassName = hasClassName

const hasClassNames = (elm, classNames, excludeClassNames) => {
  let detectedCounter = 0

  classNames.forEach((cn) => {
    let shouldBeExcepted = false

    if (!!excludeClassNames) {
      excludeClassNames.forEach((ecn) => {
        if (hasClassName(elm, ecn)) shouldBeExcepted = true
      })
    }

    if (shouldBeExcepted) {
      // Nothing...
    } else {
      if (hasClassName(elm, cn) && !shouldBeExcepted) {
        detectedCounter += 1
        // console.log('DETECTED:', cn, 'IN', elm.classList)
      }
    }
  })

  return !!elm.classList && detectedCounter === classNames.length
}
window.hasClassNames = hasClassNames

const hasClassNamesInChilds = (elm, classNames) => {
  const mainWrapper = elm
  let _hasClassNames = false

  for (let child = mainWrapper.firstChild; !!child; child = child.nextSibling) {
    try {
      _hasClassNames = hasClassNames(child, classNames)
    } catch (err) {
      console.log(err)
    }
  }
  return _hasClassNames
}
