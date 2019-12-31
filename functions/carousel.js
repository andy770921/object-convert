const { convertImgUrl, convertImgWandH, generateShortKey } = require('./lib');
module.exports = {
  createCarouselObj: element => {
    const CarouselList = element.Data.map(el => {
      return {
        link: el.Link,
        order: el.Order,
        imgUrl: convertImgUrl(el.PicturePath.FullUrl),
        imgSize: convertImgWandH({
          scrWidth: el.PicWidth,
          scrHeight: el.PicHeight,
          targerWidth: 1920
        })
      };
    });
    return CarouselList;
  },
  // 以下為加在原型上的方法
  setCarouselArea: function(paraList = []) {
    const tenCharKeyList = [generateShortKey(10), generateShortKey(10)];
    if (paraList.length >= 1) {
      const carouselTemplate = {
        materialId: 'brand002_carousel',
        materialKey: `brand002_carousel-${tenCharKeyList[0]}`,
        materialList: paraList.map(element => {
          return {
            materialKey: `brand002_carousel-${tenCharKeyList[0]}`,
            mobileImageInfo: {
              height: element.imgSize.height
            },
            itemIndex: element.order,
            linkUrl: element.link,
            imageUrlMobile: element.imgUrl,
            itemKey: `${tenCharKeyList[1]}`
          };
        })
      };
      this.themeConfig.construct.header[0] = carouselTemplate;
    }
    return this;
  }
};
