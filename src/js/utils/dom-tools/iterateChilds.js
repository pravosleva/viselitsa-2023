const iterateChilds = ({ wrapper, condition, cbSuccess, log, logItem, errLogItem }) => {
  if (!!log && typeof log === 'function') log(wrapper)

  let c = 0
  for (let child = wrapper.firstChild; child !== null; child = child.nextSibling) {
    if (!!logItem && typeof logItem === 'function') logItem({ child, index: c })
    if (condition(child)) {
      cbSuccess(child)
      // if (child.childElementCount > 0)
      iterateChilds({ wrapper: child, condition, cbSuccess })
    } else {
      if (!!errLogItem) errLogItem({ child, index: c })
    }
    c += 1
  }
}

console.log('run 1')
window.iterateChilds = iterateChilds
