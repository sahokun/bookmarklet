# クラフト不足素材購入金額計算

## bookmarklet

```
javascript:(async function(){async function m(){var f=document.querySelector(".craftExtensionModal__topArea").querySelector(".name p").textContent;var c=document.querySelector(".craftMaterialList").querySelectorAll(".materialItem");const g=[];let h=0,k=0;for(const l of c){var b=l.querySelector("img").src.match(/\/(\d+)\./)[1];c=b;for(const [d,n]of p)if(b.startsWith(d)){c=n;2===d.length&&(c+=b.slice(-1));break}var a=l.querySelectorAll("div.amountArea"),e=a[0].querySelector(".amount");e=parseInt(e.textContent.replace(/,/g,
""),10);a=a[1].querySelector(".amount");a=parseInt(a.textContent.replace(/,/g,""),10);a=e-a;if(0<a){const d=await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(b,1E3*e);h+=d.amount;b=await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(b,1E3*a);k+=b.amount;g.push(`${c}, \u4e0d\u8db3\u6570: ${a}(${b.amount}GUM), \u5fc5\u8981\u6570: ${e}(${d.amount}GUM)`)}}0<g.length?alert(`${f}\n\n${g.join("\n")}\n\n\u4e0d\u8db3\u5206\u984d: ${k}GUM, \u7dcf\u984d: ${h}GUM`):alert("\u5fc5\u8981\u306a\u7d20\u6750\u306f\u3059\u3079\u3066\u6240\u6301\u3057\u3066\u3044\u307e\u3059\u3002")}
const p=new Map([["101","\u9244"],["102","\u9285"],["103","\u4e9c\u925b"],["111","\u30af\u30ed\u30e0"],["112","\u30c1\u30bf\u30f3"],["113","\u30bf\u30f3\u30b0\u30b9\u30c6\u30f3"],["201","\u30a2\u30af\u30a2\u30de\u30ea\u30f3"],["202","\u30a4\u30f3\u30ab\u30ed\u30fc\u30ba"],["203","\u30c8\u30d1\u30fc\u30ba"],["204","\u30da\u30ea\u30c9\u30c3\u30c8"],["205","\u30aa\u30cb\u30ad\u30b9"],["206","\u30a2\u30e1\u30b8\u30b9\u30c8"],["207","\u30b8\u30a7\u30a4\u30c9"],["208","\u30e9\u30d4\u30b9\u30e9\u30ba\u30ea"],
["209","\u30ac\u30fc\u30cd\u30c3\u30c8"],["31","\u30a4\u30d5\u30ea\u30fc\u30c8"],["32","\u30ea\u30f4\u30a1\u30a4\u30a2\u30b5\u30f3"],["33","\u30c6\u30a3\u30a2\u30de\u30c8"],["34","\u30ac\u30eb\u30fc\u30c0"],["401","\u30a8\u30f3\u30d6\u30ec\u30e0"],["501","\u30b4\u30fc\u30eb\u30c9\u30c0\u30b9\u30c8"]]);try{await m()}catch(f){console.log(f),alert(`\u7d20\u6750\u8cfc\u5165\u91d1\u984d\u7b97\u51fa\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\n\n${f.toString()}`)}})();
```

## 動作確認環境

- iOS Chrome
- Windows Chrome

## 使い方

- お気に入りにbookmarkletを登録
- クラフトの選択画面で実行

![01](./01.jpg)

## CHANGELOG

2024/08/16 表示内容拡充

2024/08/16 初版

## 元コード

[mch-craft-shortage-bookmarklet.js](./mch-craft-shortage-bookmarklet.js)