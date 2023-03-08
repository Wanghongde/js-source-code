function Vue2(options = {}) {
  this.$options = options

  let data = this._data = this.$options.data

  observe(data)

  for(let key in data) {
    Object.defineProperty(this, key, {
      enumerable: true,
      get() {
        return data[key]
      },
      set(newVal) {
        data[key] = newVal
      }
    })
  }

  initComputed.call(this)

  new Compile(options.el, this) 
}

function Compile(el, vm) {
  let app = document.querySelector(el)

  let fragment = document.createDocumentFragment()

  while(child = app.firstChild) {
    fragment.appendChild(child)
  }

  function replace(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      let text = node.textContent
      let reg = /\{\{\s*(\S*)\s*\}\}/g

      if(node.nodeType === 3 && reg.test(text)) {
        let arr = RegExp.$1.split('.')
        let val = vm

        arr.forEach(key => {
          val = val[key]
        })

        new Watcher(vm, RegExp.$1, function(newVal) {
          node.textContent = text.replace(/\{\{\s*(.*)\s*\}\}/g, newVal)
        })

        node.textContent = node.textContent.replace(/\{\{\s*(.*)\s*\}\}/g, val)
      }

      if(node.nodeType === 1) {
        let nodeAttrs = node.attributes

        Array.from(nodeAttrs).forEach(attr => {
          if(attr.name.includes('v-model')) {
            node.value = vm[attr.value]

            new Watcher(vm, attr.value, function(newVal) {
              node.value = newVal
            })

            node.addEventListener('input', function(e) {
              vm[attr.value] = e.target.value
            })
          }
        })
       
      }

      if(node.childNodes) {
        replace(node)
      }

    })
  }

  replace(fragment)

  app.appendChild(fragment)
}

function Observe(data) {
  let dep = new Dep()

  for(let key in data) {
    let value = data[key]

    observe(value)
  
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        Dep.target && dep.addList(Dep.target)
        return value
      },
      set(newVal) {
        if(newVal === value) {
          return 
        }

        value = newVal
        observe(newVal)
        dep.notify()
      }
    })
  }
}

function observe(data) {
  if(typeof data !== 'object') return
  return new Observe(data)
}

function Dep() {
  this.list = []
}

Dep.prototype.addList = function(sub){
  this.list.push(sub)
}

Dep.prototype.notify = function() {
  this.list.forEach(sub => {
    sub.update()
  })
}

function Watcher(vm, exp, fn) {
  this.vm = vm
  this.exp = exp
  this.fn = fn

  Dep.target = this

  let val = vm
  let arr = exp.split('.')
  arr.forEach(key => {
    val = val[key]
  })

  Dep.target = null

}

Watcher.prototype.update = function(){
  let val = this.vm
  let arr = this.exp.split('.')

  arr.forEach(key => {
    val = val[key]
  })

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
