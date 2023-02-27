class MyInterceptors {
  constructor() {
    this.handleList = []
  }

  use(resolved, rejected) {
    this.handleList.push({
      resolved,
      rejected
    })
  }
}

class MyAxios {
  constructor() {
    this.interceptors = {
      request: new MyInterceptors,
      response: new MyInterceptors
    }
  }
  request(config) {
    let chain = [this.sendRequset.bind(this, config), undefined]

    this.interceptors.request.handleList.forEach(item => {
      chain.unshift(item.resolved, item.rejected)
    })

    this.interceptors.response.handleList.forEach(item => {
      chain.push(item.resolved, item.rejected)
    })

    let promiseObj = Promise.resolve(config)

    while(chain.length > 0) {
      promiseObj = promiseObj.then(chain.shift(), chain.shift())
    }

    return promiseObj
  }
  sendRequset(config) {
    return new Promise((resolve, reject) => {
      const {method = 'GET', url = '', data = {}} = config

      let xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.send(data)

      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
          resolve({
            status: 200,
            data: JSON.parse(xhr.responseText),
            statusText: 'OK'
          })
        }
      }
    })
  }
}

let methodsList = ['get', 'delete', 'head', 'options', 'put', 'post', 'patch']

methodsList.forEach(method => {
  MyAxios.prototype[method] = function(...args) {
    if(['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)) {
      return this.request({
        method: method,
        url: args[0]
      })
    } else {
      return this.request({
        method: method,
        url: args[0],
        data: args[1] || {}
      })
    }
  }
})

function extendFn(target, source, context) {
  for(let key in source) {
    if(source.hasOwnProperty(key)) {
      if(typeof source[key] === 'function') {
        target[key] = source[key].bind(context)
      } else {
        target[key] = source[key]
      }
    }
  }
}

function CreateMyAxiosFn() {
  let axios = new MyAxios()

  let request = axios.request.bind(axios)

  extendFn(request, MyAxios.prototype, axios)
  extendFn(request, axios)

  return request
}

const myAxios = CreateMyAxiosFn()
