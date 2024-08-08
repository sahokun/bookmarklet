# bookmarklet

## bookmarklet

```
javascript:(function(){try{let e=document.querySelector(".unit__heroImage--original img");e||=document.querySelector(".unit__heroImage img");const m=e.getAttribute("src").match(/\/([^\/]+)\.png$/),n=parseInt(m[1]),p=Array.from(document.querySelectorAll(".unit__skills.unit__section .unit__section__activeSkileName")).map(a=>a.textContent),q=window.__NUXT__.state.skill.masters,r=window.__NUXT__.state.extension.masters,g=p.map(a=>{const b=q.find(f=>f.name.ja===a||f.name.en===a).skillId,c=r.find(f=>f.active===b);
return[c?c.extensionType:b,c?"extension":"heroSkill"]}),d={};document.querySelectorAll("ul.params li").forEach(a=>{const b=a.querySelector("h4").textContent;a=parseInt(a.querySelector("span:first-child").textContent,10);d[b]=a});const t=g.find(([,a])=>"heroSkill"===a)[0],u=g.filter(([,a])=>"extension"===a).map(([a])=>a);let k=0;const v=g.map(([,a])=>{if("heroSkill"===a)return 0;k++;return k}),h=JSON.stringify([t,u,n,[d.HP,d.PHY,d.INT,d.AGI],v]);console.log(h);window.mchsim_teamcode_list=window.mchsim_teamcode_list||
[];window.mchsim_teamcode_list.push(h);const l=window.mchsim_teamcode_list.length;if(3>l)alert(`${l}\u3064\u76ee\u306e\u30b3\u30fc\u30c9\u3092\u8a18\u61b6\u3057\u307e\u3057\u305f\u3002\n\n${h}`);else{const a=window.mchsim_teamcode_list.slice(-3),b=JSON.stringify(a).replace(/"/g,"");navigator.clipboard.writeText(b).then(()=>alert(`\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u3092\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u306b\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01\n\n${b}`)).catch(c=>alert("\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u3078\u306e\u30b3\u30d4\u30fc\u306b\u5931\u6557\u3057\u307e\u3057\u305f: "+
c))}}catch(e){alert(`\u30c1\u30fc\u30e0\u30b3\u30fc\u30c9\u306e\u53d6\u5f97\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002\n\n${e.toString()}`)}})();
```

## 使い方

![01](./01.jpg)

![02](./02.jpg)

![03](./03.jpg)

![04](./04.jpg)

![05](./05.jpg)

## 元コード

[mch-team-code-bookmarklet.js](./mch-team-code-bookmarklet.js)
