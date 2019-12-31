function checkKeyThenGetReturn(element, filterKey, fn) {
  if (element.Data.length >= 1 && element.Code.slice(-8) !== 'Official') {
    if (typeof filterKey === 'string' && element.Code.slice(0, filterKey.length) === filterKey) {
      return fn(element);
    } else if (Array.isArray(filterKey)) {
      const processedList = [];
      filterKey.forEach(el => {
        if (element.Code.slice(0, el.length) === el) {
          processedList.push(fn(element));
        }
      });
      return processedList.length >= 1 ? processedList : 'NO_MATCH';
    }
  }
  return 'NO_MATCH';
}

module.exports = {
  // 亂數產生 key
  generateShortKey: length => {
    return Math.random()
      .toString(36)
      .substr(2, length);
  },
  // filterKey 可以是字串如 'MobileHome_SpTheme'，或是陣列如 ['MobileHome_SpImage', 'MobileHome_SpBanner']
  // fn 為找到符合的條件後，需要執行的函數
  getPara: (apiResponse, filterKey, fn) => {
    let paraList = [];
    if (apiResponse.ReturnCode === 'API0001') {
      apiResponse.Data.forEach(element => {
        const processedData = checkKeyThenGetReturn(element, filterKey, fn);
        if (processedData !== 'NO_MATCH') {
          paraList = Array.isArray(processedData)
            ? [...paraList, ...processedData]
            : [...paraList, processedData];
        }
      });
    }
    return paraList;
  },
  convertImgUrl: (smallSizeUrl = '//example.com') => {
    const largeSizeUrl = smallSizeUrl
      .split('/')
      .map(element => (element === 't' ? 'o' : element))
      .join('/');

    return `https:${largeSizeUrl}`;
  },
  convertImgWandH: ({ scrWidth, scrHeight, targerWidth }) => {
    const height = Math.round(
      (parseInt(scrHeight, 10) * parseInt(targerWidth, 10)) / parseInt(scrWidth, 10)
    );
    return { width: targerWidth, height };
  },
  bindTrailingArgs: (fn, ...boundArgs) => {
    return function(...args) {
      return fn(...args, ...boundArgs);
    };
  }
};

// bindTrailingArgs Example:
// var addThree = bindTrailingArgs(add, 3);
// addThree(1) // calls add(1, 3)
