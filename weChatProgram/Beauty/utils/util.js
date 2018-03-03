function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatPostTime(date) {               //计算时间经过状态
  var currdate = new Date();
  var currseconds = Math.floor(currdate.getTime() / 1000);
  var seconds = Math.floor(date.getTime() / 1000);
  var diff = currseconds - seconds;
  if (diff <= 60) {
    return "刚刚";
  } else if (diff <= 60 * 60) {
    return Math.floor(diff / 60) + "分钟前";
  } else if (diff <= 24 * 60 * 60) {
    return Math.floor(diff / 3600) + "小时前";
  } else if (diff <= 48 * 60 * 60) {
    return "昨天";
  } else if (diff <= 30 * 24 * 60 * 60) {
    return Math.floor(diff / (24 * 3600)) + "天前";
  } else if (diff <= 365 * 24 * 60 * 60) {
    return Math.floor(diff / (30 * 24 * 3600)) + "个月前";
  } else {
    return currdate.getFullYear() - date.getFullYear() + "年前";
  }
}

function formatNumber(n) {                //个位数数字，在前面加0
  n = n.toString()
  return n[1] ? n : '0' + n
}

function extend(target) {                     //合并对象
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function quickSort(arr, isDesc) {
  //如果数组长度小于等于1无需判断直接返回即可  
  if (arr.length <= 1) {
    return arr;
  }
  var midIndex = Math.floor(arr.length / 2);//取基准点  
  var midIndexVal = arr.splice(midIndex, 1)[0];//取基准点的值,splice(index,1)函数可以返回数组中被删除的那个数arr[index+1]  
  var left = [];
  var right = [];
  //遍历数组，进行判断分配  
  for (var i = 0; i < arr.length; i++) {
    if (isDesc) {
      if (arr[i] > midIndexVal) {
        left.push(arr[i]);//比基准点大的放在左边数组  
      } else {
        right.push(arr[i]);//比基准点小的放在右边数组  
      }
    } else {
      if (arr[i] < midIndexVal) {
        left.push(arr[i]);//比基准点小的放在左边数组  
      } else {
        right.push(arr[i]);//比基准点大的放在右边数组  
      }
    }
    //console.log("第"+(++times)+"次排序后："+arr);  
  }
  //递归执行以上操作,对左右两个数组进行操作，直到数组长度为<=1；  
  return quickSort(left, isDesc).concat(midIndexVal, quickSort(right, isDesc));
};

// 转为unicode 编码  
function encodeUnicode(str) {
  var res = [];
  for (var i = 0; i < str.length; i++) {
    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return "\\u" + res.join("\\u");
}

// 解码  
function decodeUnicode(str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}

function getQueryString(name, source) {
  if (!source) return '';
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)', 'i'),
    r = source.match(reg)
  if (r != null) return unescape(r[2])
  return null
};

function getMoneyStr(cent) {
  var str = cent.toString();
  if (str.length == 1) {
    return '0.0' + str;
  } else if (str.length == 2) {
    return '0.' + str;
  } else {
    return str.substring(0, str.length - 2) + '.' + str.substring(str.length - 2);
  }
}

function sleep(n) {
  var start = new Date().getTime();
  while (true) if (new Date().getTime() - start > n) break;
}
//base64解码
function base64decode(str) {
  var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {

    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c1 == -1);
    if (c1 == -1)
      break;

    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c2 == -1);
    if (c2 == -1)
      break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)
        return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == -1);
    if (c3 == -1)
      break;
    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61)
        return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == -1);
    if (c4 == -1)
      break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}
function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

function isStringEmpty(_s) {
  if (typeof _s === 'undefined' || _s == null || _s == '') {
    return true;
  } else {
    return false;
  }
}
function validateMobile(_s) {
  var hkMobileRegex = /(^5|^6|^8|^9)[0-9]{7}$/;
  //var mainlandMobileRegex = /^1(3[0-9]|5[0-35-9]|8[0236-9]|14[57])[0-9]{8}$/;
  //弱化手机号码匹配,保证11位号码即可
  var mainlandMobileRegex = /^1[0-9]{10}$/;
  return mainlandMobileRegex.test(_s) || hkMobileRegex.test(_s);
}

// canvas画出圆角矩形
function drawRoundRect(cxt, x, y, width, height, radius) {
  cxt.beginPath();
  cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
  cxt.lineTo(width - radius + x, y);
  cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
  cxt.lineTo(width + x, height + y - radius);
  cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
  cxt.lineTo(radius + x, height + y);
  cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
  cxt.closePath();
}

module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  formatPostTime: formatPostTime,
  extend: extend,
  quickSort: quickSort,
  getQueryString: getQueryString,
  getMoneyStr: getMoneyStr,
  base64decode: base64decode,
  isStringEmpty: isStringEmpty,
  validateMobile: validateMobile,
  drawRoundRect: drawRoundRect
}
