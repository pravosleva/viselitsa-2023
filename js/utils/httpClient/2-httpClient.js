const baseAPIUrl = 'http://pravosleva.ru/express-helper/subprojects/gapi'
// const baseAPIUrl = 'http://localhost:5000/subprojects/gapi'

class Api {
  static instance
  getViselitsaItemsAbortController

  constructor() {
    this.api = this.api.bind(this)

    // -- NOTE: Controllers
    this.getViselitsaItemsAbortController = new AbortController()
    // --
  }

  static getInstance() {
    if (!Api.instance) Api.instance = new Api()

    return Api.instance
  }

  universalAxiosResponseHandler(validator) {
    return async (fetchRes) => {
      const result = await fetchRes.json()
      try {
        if (!validator(result)) {
          return { isOk: false, res: result }
        }
        return { isOk: true, res: result }
      } catch (err) {
        return { isOk: false, res: result || err, message: err.message || 'No err.message' }
      }
    }
  }

  // getErrorMsg(data: any) {
  //   return data?.message ? data?.message : 'Извините, что-то пошло не так'
  // }

  async api({
    url,
    data,
    method = 'POST',
    signal,
    noUrlPrefix = false,
    headers = {
      'Content-Type': 'application/json',
    },
  } /* : {
    url: string;
    data, //?: any;
    method, // ?: 'GET' | 'POST';
    signal: AbortController['signal'];
    noUrlPrefix?: boolean;
    headers?: any;
  } */) {
    const fetchOptions = {
      method,
      headers,
      signal,
    }
    if (!!data) fetchOptions.body = data

    const apiUrl = noUrlPrefix ? url : `${baseAPIUrl}${url}`
    const customFetchOpts = {
      method,
      url: apiUrl,
      mode: 'cors',
      delay: 3000,
      tries: 10,
      fetchOptions,
    }

    const result = await fetchRetry(customFetchOpts)
      .then(
        this.universalAxiosResponseHandler(({ ok }) => {
          return ok === true || ok === false // NOTE: API like smartprice
        })
      )
      .catch((err) => {
        return { isOk: false, message: err.message || 'No err.message', res: err }
      })

    return result.isOk ? Promise.resolve(result.res) : Promise.reject(result.res)
  }

  async getItems(body) {
    this.getViselitsaItemsAbortController.abort() // upload: custom abort before next req
    this.getViselitsaItemsAbortController = new AbortController()

    const data = await this.api({
      url: '/viselitsa-2023/get-items',
      method: 'POST',
      data: body,
      signal: this.getViselitsaItemsAbortController.signal,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'multipart/form-data',
        // 'X-CSRFToken': (window as any).CSRF_TOKEN,
      },
    })

    return data.ok ? Promise.resolve(data) : Promise.reject(data)
  }
}

window.httpClient = Api.getInstance()
