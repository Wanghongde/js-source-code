let imgList = [] 
let delay = null

function _delay() {
  if(delay) clearTimeout(delay)
  
  delay = setTimeout(() => {
    _loadImg()
    delay = null
  }, 200)
}

function _isShow(el){
  let coords = el.getBoundingClientRect()  // 提供了元素的大小及其相对于视口的位置

  // document.documentElement.clientHeight 视口的高度
  // coords.top  元素上边距离页面上边的距离
  let flag = coords.top <= document.documentElement.clientHeight  // flag:true 说明元素将要出现到页面可视区

  return flag
}

function _loadImg(){
  for(let i = 0,len = imgList.length; i < len; i++){
    if(_isShow(imgList[i])){
      imgList[i].src = imgList[i].getAttribute('data-src')
      imgList.splice(i, 1)
    }
  }
}

function imgLoad(selector){
  _selector = selector || '.imgLazyLoad'

  let nodes = document.querySelectorAll(_selector)

  imgList = Array.apply(null, nodes)
  
  window.addEventListener('scroll', _delay, false)
}

imgLoad('.imgLazyLoad')