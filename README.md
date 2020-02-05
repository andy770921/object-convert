# 使用手冊

1. Installation:
   `npm i`
2. 使用 `setJson` 函數創造商店的物件，代入 config ，並將物件存入常數 `shop` 中，如 `const shop = setJson(shopConfig);`
3. 此物件有 `.init` 方法，呼叫後可以抓到 API 並重組 JSON，可透過 `.finalJson` 得到 final JSON，如下使用

```js
const shopConfig = {
  shopId: 12345,
  domainName: 'http://example.com/'
};
const shop = setJson(shopConfig);
shop.init()
    .then(finalJson => console.log('final JSON: ', JSON.stringify(finalJson)))
    .catch(err => console.log(`oops! there is an error: ${err}`));
```

# 其他操作

1. 取得全部的 API ，可使用 `.getAPI()` 方法

```js
(function() {
  const shopConfig = {
    shopId: 12345,
    domainName: 'http://example.com/'
  };
  const shop = setJson(shopConfig);
  shop
    .getAPI()
    .then(previousJson => console.log('get previousJson', previousJson))
    .catch(err => console.log(`oops! there is an error: ${err}`));
})();
```

2. 取得 Previous JSON 物件，可用 `.previousJson`
3. 取得 Final JSON 檔，可用 `.finalJson`
