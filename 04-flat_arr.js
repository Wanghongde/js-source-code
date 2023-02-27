let axios = require('axios')

let fn = async () => {
  let {data: {data: {results} }} = await axios.get('http://geek.itheima.net/v1_0/articles?channel_id=0&timestamp=1654835148606') 

  let arr = results.map(item => {
    return item.cover.images ? item.cover.images : []
  }).flat()

  console.log(arr)
}

fn()
