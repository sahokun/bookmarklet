# bookmarklet

## bookmarklet

```
javascript:(function(){var b=document.querySelector(".unit__heroImage--original img");b||=document.querySelector(".unit__heroImage img");b=b.getAttribute("src").match(/\/([^\/]+)\.png$/);b=parseInt(b[1]);var f=Array.from(document.querySelectorAll(".unit__skills.unit__section .unit__section__activeSkileName")).map(a=>a.textContent);const l=window.__NUXT__.state.skill.masters,m=window.__NUXT__.state.extension.masters;var d=f.map(a=>{const c=l.find(g=>g.name.ja===a).skillId,h=m.find(g=>g.active===
c);return[h?h.extensionType:c,h?"extension":"heroSkill"]});const e={};document.querySelectorAll("ul.params li").forEach(a=>{const c=a.querySelector("h4").textContent;a=parseInt(a.querySelector("span:first-child").textContent,10);e[c]=a});f=d.find(([,a])=>"heroSkill"===a)[0];const n=d.filter(([,a])=>"extension"===a).map(([a])=>a);let k=0;d=d.map(([,a])=>{if("heroSkill"===a)return 0;k++;return k});b=JSON.stringify([f,n,b,[e.HP,e.PHY,e.INT,e.AGI],d]);console.log(b);window.mchsim_teamcode_list=window.mchsim_teamcode_list||
[];window.mchsim_teamcode_list.push(b);b=window.mchsim_teamcode_list.length;if(3>b)alert(`${b}\u3064\u76ee\u306e\u30b3\u30fc\u30c9\u3092\u8a18\u61b6\u3057\u307e\u3057\u305f\u3002`);else{b=window.mchsim_teamcode_list.slice(-3);const a=JSON.stringify(b).replace(/"/g,"");navigator.clipboard.writeText(a).then(()=>alert("3\u3064\u306e\u30b3\u30fc\u30c9\u3092\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u306b\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01\n\n"+a)).catch(c=>alert("\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u3078\u306e\u30b3\u30d4\u30fc\u306b\u5931\u6557\u3057\u307e\u3057\u305f: "+
c))}})();
```

## 使い方

![01](./01.jpg)

![02](./02.jpg)

![03](./03.jpg)

![04](./04.jpg)

![05](./05.jpg)

## 元コード

```

javascript:(function() {
    let imgTag = document.querySelector('.unit__heroImage--original img');
    if (!imgTag) {
        imgTag = document.querySelector('.unit__heroImage img');
    }
    const src = imgTag.getAttribute('src');
    const match = src.match(/\/([^\/]+)\.png$/);
    const heroId = parseInt(match[1]);

    const skillNames = Array.from(document.querySelectorAll('.unit__skills.unit__section .unit__section__activeSkileName')).map(element => element.textContent);
    const data = window.__NUXT__.state.skill.masters;
    const extensions = window.__NUXT__.state.extension.masters;
    const skillIds = skillNames.map(skillName => {
        const targetSkill = data.find(skill => skill.name.ja === skillName);
        const skillId = targetSkill.skillId;
        const targetExtension = extensions.find(extension => extension.active === skillId);
        return [targetExtension ? targetExtension.extensionType : skillId, targetExtension ? "extension" : "heroSkill"];
    });

    const paramsList = document.querySelectorAll('ul.params li');
    const stats = {};
    paramsList.forEach(item => {
        const statName = item.querySelector('h4').textContent;
        const value = parseInt(item.querySelector('span:first-child').textContent, 10);
        stats[statName] = value;
    });

    const heroSkillId = skillIds.find(([_, type]) => type === "heroSkill")[0];
    const extensionIds = skillIds.filter(([_, type]) => type === "extension").map(([id]) => id);

    let extensionCount = 0; 
    const attackOrder = skillIds.map(([_, type]) => {
        if (type === "heroSkill") {
            return 0;
        } else {
            extensionCount++;
            return extensionCount;
        }
    });

    const resultArray = [
        heroSkillId,
        extensionIds,
        heroId,
        [stats["HP"], stats["PHY"], stats["INT"], stats["AGI"]],
        attackOrder
    ];

    const resultString = JSON.stringify(resultArray);
    console.log(resultString);

    window.mchsim_teamcode_list = window.mchsim_teamcode_list || [];
    window.mchsim_teamcode_list.push(resultString);

    const listLength = window.mchsim_teamcode_list.length;

    if (listLength < 3) {
        alert(`${listLength}つ目のコードを記憶しました。`);
    } else {
        const lastThreeCodes = window.mchsim_teamcode_list.slice(-3);
        const resultToCopy = JSON.stringify(lastThreeCodes).replace(/"/g, '');

        navigator.clipboard.writeText(resultToCopy)
            .then(() => alert("3つのコードをクリップボードにコピーしました！\n\n" + resultToCopy))
            .catch(err => alert("クリップボードへのコピーに失敗しました: " + err));
    }
})();
```

#