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
    try {
      console.log(`shop ID: ${this.shopId} - start fetching...`);
      const urlsDataPromise = [];
      const requestWithHeader = (url, key, value) => {
        const header = new fetch.Headers();
        header.append(key, value);
        return new fetch.Request(url, { method: 'GET', headers: header });
      };
      for (const apiType in urls) {
        const response = await fetch(
          apiType === 'urlOne'
            ? requestWithHeader(
                urls.urlOne,
                'conversion-access-token',
                'key-from-backend'
              )
            : urls[apiType]
        );
        if (response.status !== 200) {
          throw new Error(
            JSON.stringify({ code: response.status, text: response.statusText, apiName: apiType })
          );
        } else {
          urlsDataPromise.push(response.json());
        };
      }
      const urlsResult = await Promise.all(urlsDataPromise);
      urlsResult.forEach((apiData, i) => {
        previousJson[Object.keys(urls)[i]] = apiData;
      });
      console.log(`all done: ${Object.keys(previousJson)}`);
      return previousJson;
    } catch (error) {
      const { code, text, apiName } = JSON.parse(error.message);
      console.error(`fetch ${apiName} URL error: --- ${code} ${text} ---`);
      return Promise.reject(new Error('fetching API failed'));
    }
  };

  this.build = function() {
    finalJson
      .setCarouselArea(getCarouselPara(previousJson.urlOne))
      .setImageArea(getImagePara(previousJson.urlTwo))
      .setProductArea(getProdPara(previousJson.urlTwo))
      .resetFooterIndex();
  };

  this.init = async function() {
    try {
      if (this.shopId && this.domainName) {
        await this.getAPI();
        this.build();
        return finalJson;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

// 增加使用函數的方便性，呼叫 setJson 時，前面不用加 new 的字
function setJson(...args) {
  return new SetJson(...args);
}

(function() {
  const shop = setJson(shopConfig);
  shop.init()
      .then(finalJson => console.log('final JSON: ', JSON.stringify(finalJson)))
      .catch(err => console.error(`oops! there is an error: ${err}`));
})();
