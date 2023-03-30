class Dep {
  constructor() {
    this.list = []
  }

  addList(sub) {
    this.list.push(sub)
  }

  notify() {
    this.list.forEach(sub => {
      sub.update()
    })
  }
}

class Watcher {
  constructor(fn) {
    this.fn = fn
  }

  update() {
    this.fn()
  }
}

let watcher = new Watcher(function() {
  console.log(1)
})

let dep = new Dep()
dep.addList(watcher)
dep.addList(watcher)
dep.addList(watcher)

dep.notify()