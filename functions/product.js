const { getCenterModuleIndex } = require('./moduleIndex');
const { SINGLE_IMG, THREE_IMG } = require('./constant');
const { convertImgUrl, generateShortKey } = require('./lib');

module.exports = {
  createProdObj: element => {
    const generalInfo = element.Data.map(el => {
      return {
        title: el.Title,
        link: el.Link,
        order: el.Order,
        imgUrl: convertImgUrl(el.PicturePath.FullUrl)
      };
    });
    switch (element.Code) {
      case 'MobileHome_SpThemeAAd':
        return { type: SINGLE_IMG, sequence: 1, generalInfo: generalInfo[0] };
      case 'MobileHome_SpThemeAPd':
        return { type: THREE_IMG, sequence: 2, generalInfoList: generalInfo };
      case 'MobileHome_SpThemeBAd':
        return { type: SINGLE_IMG, sequence: 3, generalInfo: generalInfo[0] };
      case 'MobileHome_SpThemeBPd':
        return { type: THREE_IMG, sequence: 4, generalInfoList: generalInfo };
      default:
        return;
    }
  },
  // 以下為加在原型上的方法，this 是用建構函數建立出來的 instance ，即 test.js 中的 finalCmsConfig 物件
  setProductArea(paraList = []) {
    let moduleInd = getCenterModuleIndex(this);
    const prodArea = paraList
      .sort((a, b) => a.sequence - b.sequence)
      .map(element => {
        switch (element.type) {
          case SINGLE_IMG: {
            const tenCharKeyList = [generateShortKey(10), generateShortKey(10)];
            const titleArea = {
              moduleIndex: ++moduleInd,
              attributes: {
                title: {
                  isTurnOn: false,
                  text: `${element.generalInfo.title}`
                },
                staticBannerA: {
                  materialId: 'brand001_image',
                  materialKey: `brand001_image-${tenCharKeyList[0]}`,
                  materialList: [
                    {
                      isEnableCompressMobile: false,
                      materialKey: `brand001_image-${tenCharKeyList[0]}`,
                      mobileImageInfo: {
                        height: 534
                      },
                      itemIndex: 0,
                      linkUrl: `${element.generalInfo.link}`,
                      imageUrlMobile: `${element.generalInfo.imgUrl}`,
                      itemKey: `${tenCharKeyList[1]}`
                    }
                  ]
                }
              },
              groupId: 'Banner',
              moduleKey: `${tenCharKeyList[0]}`
            };
            return titleArea;
          }
          case THREE_IMG: {
            const tenCharKeyList = [
              generateShortKey(10),
              generateShortKey(10),
              generateShortKey(10),
              generateShortKey(10)
            ];
            const sortedInfo = element.generalInfoList.sort((a, b) => a.order - b.order);
            const prodArea = {
              moduleIndex: ++moduleInd,
              attributes: {
                title: {
                  text: `${sortedInfo[0].title} ${sortedInfo[1].title} ${sortedInfo[2].title}`
                },
                staticBannerB: {
                  materialId: 'brand002_image',
                  materialKey: `brand002_image-${tenCharKeyList[0]}`,
                  materialList: [
                    {
                      isEnableCompressMobile: false,
                      materialKey: `brand002_image-${tenCharKeyList[0]}`,
                      mobileImageInfo: {
                        width: 400,
                        height: 400
                      },
                      itemIndex: 0,
                      linkUrl: `${sortedInfo[0].link}`,
                      imageUrlMobile: `${sortedInfo[0].imgUrl}`,
                      itemKey: `${tenCharKeyList[1]}`
                    },
                    {
                      materialKey: `brand002_image-${tenCharKeyList[0]}`,
                      mobileImageInfo: {
                        width: 400,
                        height: 400
                      },
                      itemIndex: 1,
                      linkUrl: `${sortedInfo[1].link}`,
                      imageUrlMobile: `${sortedInfo[1].imgUrl}`,
                      itemKey: `${tenCharKeyList[2]}`
                    },
                    {
                      materialKey: `brand002_image-${tenCharKeyList[0]}`,
                      mobileImageInfo: {
                        width: 400,
                        height: 400
                      },
                      itemIndex: 2,
                      linkUrl: `${sortedInfo[2].link}`,
                      imageUrlMobile: `${sortedInfo[2].imgUrl}`,
                      itemKey: `${tenCharKeyList[3]}`
                    }
                  ]
                }
              },
              groupId: 'Banner',
              moduleKey: `${tenCharKeyList[0]}`
            };
            return prodArea;
          }
          default:
            return;
        }
      });
    prodArea.forEach(element => this.themeConfig.construct.center.push(element));
    return this;
  }
};
