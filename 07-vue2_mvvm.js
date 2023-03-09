function Vue(options = {}) {
  this.$options = options
  let data = this._data = options.data

  observe(data)

  for(let key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get() {
        return data[key]
      },
      set(newVal) {
        if(data[key] === newVal) return 
        data[key] = newVal
      }
    })
  }
  
  initComputed.call(this)

  new Compile(options.el, this)
}

function Observe(data) {
  let dep = new Dep()
  for(let key in data) {
    let value = data[key]
    observe(value)

    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        Dep.target && dep.addSub(Dep.target)

        return value
      },
      set(newVal) {
        if(value === newVal) return 

        value = newVal

        observe(newVal)

        dep.notify()
      }
    })
  }
}

function observe(data) {
  if(typeof data !== 'object') return 
  new Observe(data)
}

function Compile(el, vm) {
  let app = document.querySelector(el)
  let fragment = document.createDocumentFragment()
  let reg = /\{\{\s*(\S*)\s*\}\}/g

  while(first = app.firstChild) {
    fragment.appendChild(first)
  }

  replace(fragment)

  function replace(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      if(node.nodeType === 3 && reg.test(node.textContent)) {
        let arr = RegExp.$1.split('.')
        let val = vm
        let text = node.textContent
        arr.forEach(key => val = val[key])

        node.textContent = node.textContent.replace(reg, val)

        new Watcher(vm, RegExp.$1, function(newVal) {
          node.textContent = text.replace(reg, newVal)  // 这里要拿到修改后的新数据
        })
      }
  
      if(node.nodeType === 1) {
        Array.from(node.attributes).forEach(item => {
          if(item.name === 'v-model') {
            let arr = item.textContent.split('.')
            let val = vm

            arr.forEach((key, index) => {
              if(index === arr.length - 1) {
                new Watcher(vm, item.textContent, function(newVal) {
                  node.value = val[key]
                })
                return node.value = val[key]
              }
              val = val[key]
            })

            node.addEventListener('input', e => {
              let val = vm
              arr.forEach((key, index) => {
                if(index === arr.length - 1) {
                  return val[key] = e.target.value
                }
                val = val[key]
              })
            })
            
          }
        })
      }

      if(node.childNodes) {
        replace(node)
      }
    })
  }

  app.append(fragment)
}

function Dep() {
  this.list = []
}

Dep.prototype.addSub = function(sub) {
  this.list.push(sub)
}

Dep.prototype.notify = function() {
  this.list.forEach(sub => {
    sub.update()
  })
}

function Watcher(vm, expression, fn) {
  this.vm = vm
  this.expression = expression
  this.fn = fn

  Dep.target = this
  let val = vm
  expression.split('.').forEach(key => val[key])
  Dep.target = null
}

Watcher.prototype.update = function() {
  let val = this.vm
  this.expression.split('.').forEach(key => val = val[key])

  this.fn(val)
}

function initComputed() {
  let computed = this.$options.computed
  Object.keys(computed).forEach(key => {
    console.log(this, key)
    Object.defineProperty(this, key, {
      get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
      set() {}
    })
  })
}
