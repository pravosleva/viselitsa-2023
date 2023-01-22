// -- PROTO
const arrayMethods = Object.getOwnPropertyNames(Array.prototype)
function attachArrayMethodsToNodeList(methodName) {
  if (methodName !== 'length') NodeList.prototype[methodName] = Array.prototype[methodName]
}
arrayMethods.forEach(attachArrayMethodsToNodeList)
// --
