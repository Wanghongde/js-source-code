function shallowClone(obj) {
  let newObj = {}

  for(let key in obj) {
    if(obj.hasOwnProperty(obj[key])) {
      newObj[key] = obj[key]
    }
  }

  return newObj
}

let obj2 = shallowClone(obj)

let obj = {
  a:{
    b:1
  }
}

function deepClone(obj) { 
  let cloneObj = {}
  
  for(let key in obj) {                 //遍历
    if(typeof obj[key] ==='object') { 
      cloneObj[key] = deepClone(obj[key])  //是对象就再次调用该函数递归
    } else {
      cloneObj[key] = obj[key]  //基本类型的话直接复制值
    }
  }
  return cloneObj
}

let obj3 = deepClone(obj)
