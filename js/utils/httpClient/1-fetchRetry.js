const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
/*
type TProps = {
  url: string;
  delay?: number;
  tries: number;
  fetchOptions: any;
}
*/

window.fetchRetry = function ({ url, delay = 1000, tries = 0, fetchOptions = {} }) {
  let __triesLeft = tries
  function onError(err) {
    __triesLeft = !!__triesLeft ? __triesLeft - 1 : 0

    if (!__triesLeft) throw err

    return wait(delay).then(() => fetchRetry({ url, delay, tries: __triesLeft, fetchOptions }))
  }
  return fetch(url, fetchOptions).catch(onError)
}
