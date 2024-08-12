javascript: (function () {
    function getSkillIds(skillNames) {
        const data = window.__NUXT__.state.skill.masters;
        const extensions = window.__NUXT__.state.extension.masters;
        const skillIds = skillNames.map(skillName => {
            const targetSkill = data.find(skill => skill.name.ja === skillName || skill.name.en === skillName);
            const skillId = targetSkill.skillId;
            const targetExtension = extensions.find(extension => extension.active === skillId);
            return [targetExtension ? targetExtension.extensionType : skillId, targetExtension ? "extension" : "heroSkill"];
        });
        return skillIds;
    }

    function getAttackOrder(skillIds) {
        let extensionCount = 0;
        const attackOrder = skillIds.map(([_, type]) => {
            if (type === "heroSkill") {
                return 0;
            } else {
                extensionCount++;
                return extensionCount;
            }
        });
        return attackOrder;
    }

    function writeClipboard(resultString) {
        window.mchsim_teamcode_list = window.mchsim_teamcode_list || [];
        window.mchsim_teamcode_list.push(resultString);

        const listLength = window.mchsim_teamcode_list.length;

        if (listLength < 3) {
            alert(`${listLength}つ目のコードを記憶しました。\n\n${resultString}`);
        } else {
            const lastThreeCodes = window.mchsim_teamcode_list.slice(-3);
            const resultToCopy = JSON.stringify(lastThreeCodes).replace(/"/g, '');

            navigator.clipboard.writeText(resultToCopy)
                .then(() => alert(`チームコードをクリップボードにコピーしました！\n\n${resultToCopy}`))
                .catch(err => alert("クリップボードへのコピーに失敗しました: " + err));
        }
    }

    try {
        const currentUrl = window.location.href;

        if (/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?battles\//.test(currentUrl)) {
            let imgTag = document.querySelector('.unit__heroImage--original img');
            if (!imgTag) {
                imgTag = document.querySelector('.unit__heroImage img');
            }
            const src = imgTag.getAttribute('src');
            const match = src.match(/\/([^\/]+)\.png$/);
            const heroId = parseInt(match[1]);

            const skillNames = Array.from(document.querySelectorAll('.unit__skills.unit__section .unit__section__activeSkileName')).map(element => element.textContent);
            const skillIds = getSkillIds(skillNames);

            const paramsList = document.querySelectorAll('ul.params li');
            const stats = {};
            paramsList.forEach(item => {
                const statName = item.querySelector('h4').textContent;
                const value = parseInt(item.querySelector('span:first-child').textContent, 10);
                stats[statName] = value;
            });

            const heroSkillId = skillIds.find(([_, type]) => type === "heroSkill")[0];
            const extensionIds = skillIds.filter(([_, type]) => type === "extension").map(([id]) => id);
            const attackOrder = getAttackOrder(skillIds);

            const resultArray = [
                heroSkillId,
                extensionIds,
                heroId,
                [stats["HP"], stats["PHY"], stats["INT"], stats["AGI"]],
                attackOrder
            ];

            const resultString = JSON.stringify(resultArray);
            console.log(resultString);

            writeClipboard(resultString);
        } else if (/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\//.test(currentUrl)) {
            const outerSkillsDiv = document.querySelector('.skills');

            const passiveSkillElement = outerSkillsDiv.querySelector('.skill.passiveSkill');
            const passiveSkillName = passiveSkillElement ? passiveSkillElement.querySelector('h4 span').textContent.trim() : null;

            const skill = window.__NUXT__.state.skill.masters.find(skill =>　skill.name.ja === passiveSkillName ||skill.name.en === passiveSkillName);
            const hero = window.__NUXT__.state.hero.masters.find(hero => hero.passive === skill.skillId);
            const heroId = hero.heroType;

            const innerSkillsDiv = outerSkillsDiv.querySelector('.skills');
            const elements = innerSkillsDiv.querySelectorAll('.skill.activeSkill');
            const skillNames = Array.from(elements).map(element => {
                const h4Element = element.querySelector('h4 span');
                return h4Element ? h4Element.textContent.trim() : null;
            }).filter(name => name !== null);
            const skillIds = getSkillIds(skillNames);

            const paramsList = document.querySelectorAll('div.status.unitEditorPage');
            const stats = {};
            paramsList.forEach(item => {
                const statName = item.querySelector('p:first-child').textContent;
                const value = parseInt(item.querySelector('p:nth-child(2)').textContent, 10);
                stats[statName] = value;
            });

            const heroSkillId = skillIds.find(([_, type]) => type === "heroSkill")[0];
            const extensionIds = skillIds.filter(([_, type]) => type === "extension").map(([id]) => id);
            const attackOrder = getAttackOrder(skillIds);

            const resultArray = [
                heroSkillId,
                extensionIds,
                heroId,
                [stats["HP"], stats["PHY"], stats["INT"], stats["AGI"]],
                attackOrder
            ];

            const resultString = JSON.stringify(resultArray);
            console.log(resultString);

            writeClipboard(resultString);
        } else {
            alert("このページではチームコードを取得できません。");
        }
    } catch (e) {
        alert(`チームコードの取得に失敗しました。\n\n${e.toString()}`)
    }
})();
