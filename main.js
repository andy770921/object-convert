const fetch = require('node-fetch');
const { generateShortKey, getPara, bindTrailingArgs } = require('./functions/lib');
const { resetFooterIndex } = require('./functions/moduleIndex');
const { createProdObj, setProductArea } = require('./functions/product');
const { createImageObj, setImageArea } = require('./functions/image');
const { createCarouselObj, setCarouselArea } = require('./functions/carousel');

const shopConfig = {
  shopId: 12345,
  domainName: 'http://example.com/'
};

function jsonFormat({ shopId } = { shopId: null }) {
  const themeKey =
    `${generateShortKey(8)}-${generateShortKey(4)}-` +
    `${generateShortKey(4)}-${generateShortKey(4)}-${generateShortKey(12)}`;
  this.themeName = 'Previous JSON';
  this.themeId = themeKey;
  this.updateTime = Date.now();
  this.shopId = shopId;
  this.themeConfig = {
    construct: {
      header: [],
      right: [],
      footer: [],
      left: [],
      center: []
    },
    pageMetaData: {}
  };
  this.pageName = 'index';
}

// 將所有操作 JSON 的方法，加入 jsonFormat 原型
jsonFormat.prototype = {
  constructor: jsonFormat,
  setCarouselArea,
  setImageArea,
  setProductArea,
  resetFooterIndex
};
function SetJson(shopConfig = { shopId: null, domainName: null }) {
  // public variable
  this.shopId = shopConfig.shopId;
  this.domainName = shopConfig.domainName;

  // private variable
  const urls = {
    urlOne: `${this.domainName}exampleApi/${this.shopId}?v=0&shopId=${this.shopId}`,
    urlTwo: `${this.domainName}exampleApi/Two/Profile?shopId=${this.shopId}`
  };

  const previousJson = {};
  const finalJson = new jsonFormat({ shopId: this.shopId });

  // public read-only getters
  Object.defineProperty(this, 'previousJson', {
    get() {
      return previousJson;
    }
  });
  Object.defineProperty(this, 'finalJson', {
    get() {
      return finalJson;
    }
  });
  // private method
  const getProdPara = bindTrailingArgs(getPara, 'MobileHome_SpTheme', createProdObj);
  const getCarouselPara = bindTrailingArgs(getPara, 'MobileHome_SpCarousel', createCarouselObj);
  const getImagePara = bindTrailingArgs(
    getPara,
    ['MobileHome_SpImage', 'MobileHome_SpBanner'],
    createImageObj
  );

  // public method
  this.getAPI = async function() {
    for (const item in urls) {
      try {
        previousJson[item] = await fetch(urls[item]).then(res => (res.ok ? res.json() : null));
        console.log(`done: ${item}`);
      } catch (error) {
        console.log(`fetch error: ${error}`);
      }
    }
    return new Promise(resolve => resolve(previousJson));
  };

  this.build = function() {
    finalJson
      .setCarouselArea(getCarouselPara(previousJson.urlOne))
      .setImageArea(getImagePara(previousJson.urlOne))
      .setProductArea(getProdPara(previousJson.urlOne))
      .resetFooterIndex();
  };

  this.init = async function() {
    if (this.shopId && this.domainName) {
      await this.getAPI();
    }
    this.build();
  };
}

// 增加使用函數的方便性，呼叫 setJson 時，前面不用加 new 的字
function setJson(...args) {
  return new SetJson(...args);
}

(function() {
  const shop = setJson(shopConfig);
  shop.init().then(() => console.log('final JSON: ', JSON.stringify(shop.finalJson)));
})();
