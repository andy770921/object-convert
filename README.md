# 使用手冊

1. Installation:
   `npm i`
2. 使用 `setJson` 函數創造商店的物件，代入 config ，並將物件存入常數 `shop` 中，如 `const shop = setJson(shopConfig);`
3. 此物件有 `.init` 方法，此方法為 Promise ，執行後可以抓 API 並重組 JSON，並 resolve 重組後的 JSON 出來，如下使用

```js
const shopConfig = {
  shopId: 12345,
  domainName: 'http://example.com/'
};
const shop = setJson(shopConfig);
shop.init()
    .then(jsonAfterBuild => console.log('final JSON: ', JSON.stringify(jsonAfterBuild)))
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
    .then(jsonFromApi => console.log('get previous Json from API', jsonFromApi))
    .catch(err => console.log(`oops! there is an error: ${err}`));
})();
```

2. 取得 Previous JSON 物件，也可在 `.getAPI()` 或 `.init()` 的 Promise 執行完後，用 `.previousJson` 取得。如 `shop.previousJson`
3. 取得 Final JSON 物件，也可在 `.init()` 的 Promise 執行完後，用 `.finalJson` 取得。如 `shop.finalJson`
