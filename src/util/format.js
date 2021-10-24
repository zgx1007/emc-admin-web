(function (window) {
  function FormatUtil () {}
  FormatUtil.prototype = {
    // 数组去重
    arrRemoveDuplicates: function (array) {
      var temp = [] // 一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) === -1) {
          temp.push(array[i])
        }
      }
      return temp
    },
    // data转换为年月日
    dataToYMD: function (strDate) {
      var date = new Date(strDate)
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    // 删除左右两端的空格
    trim: function (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    }
  }
  window._format = new FormatUtil()
  return window._format
})(window)
