// 身份证格式校验
export const checkIdCard = function(id) {
  function normalId(id) {
    // 15位：年份只有后两位，没有校验码
    if (id.length === 15) {
      const id17 = id.substring(0, 6) + '19' + id.substring(6)
      return id17 + getCode(id17)
    }

    return id
  }

  function checkAddress(id) {
    // 省级校验
    const re = /^1[1-5]|2[123]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|81|82$/;
    return re.test(id.substring(0, 2));
  }

  function checkBirth(str) {
    // 生日校验 小于当前日期，并且日期合法
    const now = new Date();
    const [_, year, month, day] = /(\d{4})(\d{2})(\d{2})/.exec(str)
    const realDate = new Date(+year, +month - 1, +day)
    const realYear = realDate.getFullYear()
    const realMonth = realDate.getMonth() + 1
    const realDay = realDate.getDate()

    return (
      realDate < now &&
      +year === realYear &&
      +month === realMonth &&
      +day === realDay
    )
  }
  
  // 每一位的加权数
  const powerMap = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 余数对应的最后一位校验码
  const codeMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  // 计算正确的校验码
  function getCode(str) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += +str[i] * powerMap[i];
    }
    return codeMap[sum % 11];
  }

  // 对比校验码
  function checkCode(id) {
    const rightCode = getCode(id)
    return id.slice(-1) === rightCode
  }

  const cardId = normalId(id)

  return checkAddress(cardId) && checkBirth(cardId.substring(6, 14)) && checkCode(cardId)
}


// #ifdef H5
// 截取视频第一帧
//     地址   第几帧
// Get("url", 10).then(
// getimg => {
// 	this.img = getimg
// })
export default function(url, Time = 1) {
	return new Promise((a, b) => {
			var video;
			var scale = 1;
			var initialize = function() {
				video = document.createElement('video');
				
				video.src = url
				console.log(123123,url)
				video.addEventListener('loadeddata', function() {
					console.log(1123123213)
					video.currentTime = Time;
					setTimeout(function() {
						console.log(123123)
						captureImage()
					}, 1000)
				});
			};
			var captureImage = function() {
				var canvas = document.createElement("canvas");
			
				canvas.width = video.videoWidth * scale;
				canvas.height = video.videoHeight * scale;
				canvas.getContext('2d').drawImage(video, 0, 0,);
				let src = canvas.toDataURL("image/png");
				console.log(123123, src)
				a(src)
			};
			initialize();
	
	})
}
// #endif