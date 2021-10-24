(function (window) {
  function CheckUtil () {}
  CheckUtil.prototype = {
    // 用户名校验
    userPattern: /^[a-zA-Z0-9_-]{2,16}$/,
    // 字符为8个字符
    eightString: /^[A-Za-z0-9]{8}$/,
    // 波特率校验（0~500000）
    canBaudRate: /^[0-9]$|^[1-9]\d{1,4}$|^[1-5]\d{1,5}$/,
    // 检测是不是英文和数字
    isEnglistNumberReg: /^[A-Za-z0-9]*$/,
    // 密码校验
    pattern: /^[\S]{4,16}$/,
    // 是不是邮箱
    isEmail: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    // 是不是数字
    isNumberReg: /^(-)?\d+(\.\d+)?$/,
    isNumber: function (rule, value, callback) {
      var reg = /^(-)?\d+(\.\d+)?$/
      if (reg.test(value)) {
        callback && callback()
      } else {
        callback && callback(new Error('请输入数字值'))
      }
    },
    // 是不是正整数
    isPositiveIntegerReg: /^[1-9]\d*$/,
    // 含0正整数
    isNaturalNum: /^(0|[1-9][0-9]*)$/,
    // 检测是不是中文
    isChineseReg: /^[\u4e00-\u9fa5]+$/,
    isChinese: function (rule, value, callback) {
      var reg = /^[\u4e00-\u9fa5]+$/
      if (reg.test(value)) {
        callback && callback()
      } else {
        callback && callback(new Error('请输入正确姓名'))
      }
    },
    // 检测是不是数字或者大写字母
    isEnglistNebReg: /^[A-Z0-9]+$/,
    // 检测是不是英文
    isEnglistReg: /^[a-zA-Z]+$/,
    isEnglish: function (rule, value, callback) {
      var reg = /^[a-zA-Z]+$/
      if (reg.test(value)) {
        callback && callback()
      } else {
        callback && callback(new Error('请输入英文'))
      }
    },
    // 检测是不是手机号码
    isPhoneReg: /^1[3456789]\d{9}$/,
    isPhone: function (rule, value, callback) {
      var reg = /^1[3456789]\d{9}$/
      if (reg.test(value)) {
        callback && callback()
      } else {
        callback && callback(new Error('请输入正确的手机号码'))
      }
    },
    // 检测空值
    isSpaceReg: /^\s*$/,
    isSpace: function (rule, value, callback) {
      var reg = /^\s*$/
      if (reg.test(value)) {
        callback && callback(new Error('内容不能为空'))
      } else {
        callback && callback()
      }
    },
    // vin码城市编号（17位数字或字母）
    vinPattern: /^(?=^.*?[A-Z])(?=^.*?\d)^(.{17})$/,
    // 车牌号
    vehicleNoPattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}([A-Z0-9]{5}|[A-Z0-9]{4})[A-Z0-9挂学警港澳]{1}$/,
    // 是不是英文和斜杠
    isEnglistRegSlash: /^[\/a-zA-Z0-9]+$/
  }
  window._check = new CheckUtil()
  return window._check
})(window)
