# bookmarklet

## bookmarklet

```
javascript:(function(){function t(c){const b=window.__NUXT__.state.skill.masters,a=window.__NUXT__.state.extension.masters;return c.map(l=>{const m=b.find(g=>g.name.ja===l||g.name.en===l).skillId,h=a.find(g=>g.active===m);return[h?h.extensionType:m,h?"extension":"heroSkill"]})}function u(c){let b=0;return c.map(([,a])=>{if("heroSkill"===a)return 0;b++;return b})}function v(c){window.mchsim_teamcode_list=window.mchsim_teamcode_list||[];window.mchsim_teamcode_list.push(c)}function w(){var c=window.mchsim_teamcode_list.length;
if(3>c)alert(`${c}\u3064\u76ee\u306e\u30b3\u30fc\u30c9\u3092\u8a18\u61b6\u3057\u307e\u3057\u305f\u3002\n\n${window.mchsim_teamcode_list[c-1]}`);else{c=window.mchsim_teamcode_list.slice(-3);const b=JSON.stringify(c).replace(/"/g,"");navigator.clipboard.writeText(b).then(()=>alert(`\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u3092\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u306b\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01\n\n${b}`)).catch(a=>alert("\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u3078\u306e\u30b3\u30d4\u30fc\u306b\u5931\u6557\u3057\u307e\u3057\u305f: "+
a))}}function x(c){if(0===c[0].length)throw Error("passive skill error");if(0===c[1].length)throw Error("active skill error");if(0===c[2].length)throw Error("hero error");if(0===c[3].length)throw Error("stats error");if(0===c[4].length)throw Error("order error");}try{const c=window.location.href;if(/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?battles\//.test(c)){let b=document.querySelector(".unit__heroImage--original img");b||=document.querySelector(".unit__heroImage img");const a=b.getAttribute("src");
console.log(a);const l=a.match(/\/([^\/]+)\.png$/),m=parseInt(l[1]),h=Array.from(document.querySelectorAll(".unit__skills.unit__section .unit__section__activeSkileName")).map(k=>k.textContent);console.log(h);const g=t(h),f={};document.querySelectorAll("ul.params li").forEach(k=>{const p=k.querySelector("h4").textContent;k=parseInt(k.querySelector("span:first-child").textContent,10);f[p]=k});console.log(f);const d=g.find(([,k])=>"heroSkill"===k)[0],n=g.filter(([,k])=>"extension"===k).map(([k])=>k),
y=u(g),r=[d,n,m,[f.HP,f.PHY,f.INT,f.AGI],y];x(r);const q=JSON.stringify(r);console.log(q);v(q);w(q)}else if(/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+\/\d+\?/.test(c)){const b=document.querySelector(".skills"),a=b.querySelector(".skill.passiveSkill"),l=a?a.querySelector("h4 span").textContent.trim():null;console.log(l);const m=window.__NUXT__.state.skill.masters.find(e=>e.name.ja===l||e.name.en===l),h=window.__NUXT__.state.hero.masters.find(e=>e.passive===m.skillId).heroType,
g=b.querySelector(".skills").querySelectorAll(".skill.activeSkill"),f=Array.from(g).map(e=>(e=e.querySelector("h4 span"))?e.textContent.trim():null).filter(e=>null!==e);console.log(f);const d=t(f),n={};document.querySelectorAll("div.status.unitEditorPage").forEach(e=>{const z=e.querySelector("p:first-child").textContent;e=parseInt(e.querySelector("p:nth-child(2)").textContent,10);n[z]=e});console.log(n);const y=d.find(([,e])=>"heroSkill"===e)[0],r=d.filter(([,e])=>"extension"===e).map(([e])=>e),q=
u(d),k=[y,r,h,[n.HP,n.PHY,n.INT,n.AGI],q];x(k);const p=JSON.stringify(k);console.log(p);v(p);w(p)}else/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+/.test(c)?(document.querySelector(".teamPage__team.team > ol").querySelectorAll(":scope > li").forEach(b=>{var a=b.querySelector(".team__skills");const l=a.querySelector("p > span").textContent;console.log(l);const m=window.__NUXT__.state.skill.masters.find(d=>d.name.ja===l||d.name.en===l);var h=window.__NUXT__.state.hero.masters.find(d=>
d.passive===m.skillId).heroType;a=a.querySelectorAll("ol > li");a=Array.from(a).map(d=>{d=d.querySelector("span").textContent;console.log(d);return d}).filter(d=>null!==d);var g=t(a);a={};if(b instanceof Element){b=b.querySelector("div.team__statuses");var f=parseInt(b.querySelector("div.team__status:nth-child(1) > p").textContent,10);a.HP=f;f=parseInt(b.querySelector("div.team__status:nth-child(2) > p").textContent,10);a.PHY=f;f=parseInt(b.querySelector("div.team__status:nth-child(3) > p").textContent,
10);a.INT=f;b=parseInt(b.querySelector("div.team__status:nth-child(4) > p").textContent,10);a.AGI=b;console.log(a)}else throw Error("not Element");b=g.find(([,d])=>"heroSkill"===d)[0];f=g.filter(([,d])=>"extension"===d).map(([d])=>d);g=u(g);h=[b,f,h,[a.HP,a.PHY,a.INT,a.AGI],g];x(h);h=JSON.stringify(h);console.log(h);v(h)}),w()):(console.log("\u3053\u306e\u30da\u30fc\u30b8\u3067\u306f\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002"),alert("\u3053\u306e\u30da\u30fc\u30b8\u3067\u306f\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002"))}catch(c){console.log("\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002"),
console.log(c),alert(`\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\n\n${c.toString()}`)}})();
```

## 使い方

![01](./01.jpg)

![02](./02.jpg)

対応URL

- `https://www.mycryptoheroes.net/{xx/}battles/xxxxxxxx`
- `https://www.mycryptoheroes.net/{xx/}templates/duel/x?`
- `https://www.mycryptoheroes.net/{xx/}templates/duel/x/x?`


バトル画面の場合、EMAやオーラによる変化が含まれます。

![03](./03.jpg)

![04](./04.jpg)

![05](./05.jpg)

## CHANGELOG

2024/08/13 テンプレート画面(チーム画面)対応

2024/08/12 テンプレート画面(ヒーロー画面)対応

2024/08/08 英語対応

2024/08/08 初版

## 元コード

[mch-team-code-bookmarklet.js](./mch-team-code-bookmarklet.js)
