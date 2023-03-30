function Person(uname, age) {
  this.uname = uname
  this.age = age
}

Person.prototype.sayHi = function() {
  console.log(`hello ${this.uname}, you ${this.age}!`)
}

let p = new Person('张三', 10)
console.log(p.uname)
p.sayHi()

// function createFactory(obj, ...rest) {
//   let newObj = Object.create(obj.prototype)

//   obj.apply(newObj, rest)

//   return newObj
// }

function createFactory() {
  let obj = new Object()

  let Constructor = [].shift.call(arguments)

  obj.__proto__ = Constructor.prototype

  Constructor.apply(obj, arguments)

  return obj
}

let p2 = createFactory(Person, '李四', 20)
console.log(p2)
p2.sayHi()
