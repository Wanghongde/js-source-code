// let list = ['a', 'b', 'c']

// list.forEach((item, index, arr) => {
//   console.log(item, index, arr)
// })

// Array.prototype.myForEach = function(cb) {
//   for(let i = 0; i < this.length; i++) {
//     cb(this[i], i, this)
//   }
// }

// list.myForEach((item, index, arr) => {
//   console.log(item, index, arr)
// })

// let list = ['a', 'b', 'c']

// let newList = list.map((item, index, arr) => {
//   console.log(item, index, arr)
//   return item + '!'
// })

// console.log(newList)

// Array.prototype.myMap = function(cb) {
//   let result = []

//   for(let i = 0; i < this.length; i++) {
//     result.push(cb(this[i], i, this))
//   }

//   return result
// }

// let newList2 = list.myMap((item, index, arr) => {
//   console.log(item, index, arr)
//   return item + '!'
// })

// console.log(newList2)

// let list = ['a', 'b', 'c']

// let newList = list.filter((item, index, arr) => {
//   console.log(item, index, arr)
//   return item === 'b'
// })

// console.log(newList)

// Array.prototype.myFilter = function(cb) {
//   let result = []

//   for(let i = 0; i < this.length; i++) {
//     cb(this[i], i, this) && result.push(this[i])
//   }

//   return result
// }

// let newList2 = list.myFilter((item, index, arr) => {
//   console.log(item, index, arr)
//   return item === 'b'
// })

// console.log(newList2)

// let list = ['a', 1, 'c']

// let newList = list.every((item, index, arr) => {
//   console.log(item, index, arr)
//   return typeof item === 'string'
// })

// console.log(newList)

// Array.prototype.myEvery = function(cb) {
//   for(let i = 0; i < this.length; i++) {
//     if(!cb(this[i], i, this)) {
//       return false
//     }
//   }

//   return true
// }

// let newList2 = list.myEvery((item, index, arr) => {
//   console.log(item, index, arr)
//   return typeof item === 'string'
// })

// console.log(newList2)

// let list = ['a', 'b', 'c']

// let newList = list.some((item, index, arr) => {
//   console.log(item, index, arr)
//   return typeof item === 'string'
// })

// console.log(newList)

// Array.prototype.mySome = function(cb) {
//   for(let i = 0; i < this.length; i++) {
//     if(cb(this[i], i, this)) {
//       return true
//     }
//   }

//   return false
// }

// let newList2 = list.mySome((item, index, arr) => {
//   console.log(item, index, arr)
//   return typeof item === 'number'
// })

// console.log(newList2)

let list = ['a', 'b', 'c']

let newList = list.reduce((pre, item, index, arr) => {
  console.log(pre, item, index, arr)

  return pre + item
}, '!')

console.log(newList)

let newList2 = list.reduce((pre, item, index, arr) => {
  console.log(pre, item, index, arr)

  return pre + item
})

console.log(newList2)

Array.prototype.myReduce = function(cb, initVal) {
  let result 
  let start = 0

  if(initVal) {
    result = initVal
  } else {
    result = this[0]
    start = 1
  }

  for(let i = start; i < this.length; i++) {
    result = cb(result, this[i], i, this)
  }

  return result
}

let newList3 = list.myReduce((pre, item, index, arr) => {
  console.log(pre, item, index, arr)

  return pre + item
}, '!')

console.log(newList3)

let newList4 = list.myReduce((pre, item, index, arr) => {
  console.log(pre, item, index, arr)

  return pre + item
})

console.log(newList4)

