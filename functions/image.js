const { SINGLE_IMG } = require('./constant');
const { convertImgUrl } = require('./lib');
const { setProductArea } = require('./product');

module.exports = {
  createImageObj: element => {
    const generalInfo = element.Data.map(el => {
      return {
        title: el.Title,
        link: el.Link,
        order: el.Order,
        imgUrl: convertImgUrl(el.PicturePath.FullUrl)
      };
    });
    switch (element.Code) {
      case 'MobileHome_SpImage':
        return { type: SINGLE_IMG, sequence: 1, generalInfo: generalInfo[0] };
      case 'MobileHome_SpBanner':
        return { type: SINGLE_IMG, sequence: 2, generalInfoList: generalInfo };
      default:
        return;
    }
  },
  // 以下為加在原型上的方法，this 是用建構函數建立出來的 instance
  setImageArea(paraList) {
    const organizedParaList = [];
    if (Array.isArray(paraList)) {
      paraList
        .sort((a, b) => a.sequence - b.sequence)
        .forEach(element => {
          if (!element.generalInfoList) {
            organizedParaList.push(element);
          } else if (Array.isArray(element.generalInfoList)) {
            element.generalInfoList
              .sort((a, b) => a.order - b.order)
              .forEach((el, i) => {
                organizedParaList.push({
                  type: SINGLE_IMG,
                  sequence: 2 + i,
                  generalInfo: el
                });
              });
          }
        });
    } else if (typeof paraList === 'object') {
      paraList.generalInfoList
        .sort((a, b) => a.order - b.order)
        .forEach((el, i) => {
          organizedParaList.push({
            type: SINGLE_IMG,
            sequence: 2 + i,
            generalInfo: el
          });
        });
    }
    return setProductArea.call(this, organizedParaList);
  }
};
