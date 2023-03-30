class MyPromise {
  constructor(executor) {
    // 初始化promise的数据和状态
    this.initValue()
    // 修改resolve和reject的this
    this.initBind()

    // 构造函数内抛出异常，直接执行 catch
    try {
      executor(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  initValue() {
    this.PromiseState = "pendding"
    this.PromiseResult = null

    // 创建两个容器，存放函数
    this.onResolveArr = []
    this.onRejectArr = []
  }

  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(value) {
    if (this.PromiseState !== "pendding") {
      return
    }
    this.PromiseState = "resolved"
    this.PromiseResult = value

    // 状态发生改变说明定时器到时间了, 容器里有函数, 调用函数
    if (this.onResolveArr.length) {
      this.onResolveArr.shift()(this.PromiseResult)
    }
  }

  reject(reason) {
    if (this.PromiseState !== "pendding") {
      return
    }
    this.PromiseState = "rejected"
    this.PromiseResult = reason

    // 状态发生改变说明定时器到时间了, 容器里有函数, 调用函数
    if (this.onRejectArr.length) {
      this.onRejectArr.shift()(this.PromiseResult)
    }
  }
}

// then 接受两个回调函数 onResolve成功  onRejct失败
MyPromise.prototype.then = function (onResolve, onReject) {
  // then接收两个函数，所以需要校验下
  // 1. 传递的是函数 则正常使用
  // 2. 传递的不是函数 则修改成函数
  onResolve = typeof onResolve === "function" ? onResolve : (val) => val
  onReject = typeof onReject === "function" ? onReject : (reason) => {throw reason}

  let thenPromise = new MyPromise((resolve, reject) => {
    const resolvePromise = (cb) => {
      // 加一个定时器,别介意苦笑😂
      // 这样就会等待同步执行完, 再执行微任务 then
      setTimeout(() => {
        try {
          let result = cb(this.PromiseResult)
          // 说明返回的是一个Promise对象
          if (result instanceof MyPromise) {
            // 到底是成功还是失败，得交给then
            result.then(resolve, reject)
          } else {
            // 其他值 当成成功处理
            resolve(result)
          }
        } catch (err) {
          // 捕获代码的异常
          reject(err)
          throw new Error(err)
        }
      })
    }

    if (this.PromiseState === "resolved") {
      resolvePromise(onResolve)
    } else if (this.PromiseState === "rejected") {
      resolvePromise(onReject)
    } else if (this.PromiseState === "pendding") {
      // 说明可能有定时器,把方法存放起来，等待之后调用
      this.onResolveArr.push(onResolve.bind(this))
      this.onRejectArr.push(onReject.bind(this))
    }
  })

  // then的返回值是一个promise, 解决了链式调用问题
  return thenPromise
}
