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

    function pushStore(resultString) {
        window.mchsim_teamcode_list = window.mchsim_teamcode_list || [];
        window.mchsim_teamcode_list.push(resultString);
    }

    function writeClipboard() {
        const listLength = window.mchsim_teamcode_list.length;

        if (listLength < 3) {
            alert(`${listLength}つ目のコードを記憶しました。\n\n${window.mchsim_teamcode_list[listLength - 1]}`);
        } else {
            const lastThreeCodes = window.mchsim_teamcode_list.slice(-3);
            const resultToCopy = JSON.stringify(lastThreeCodes).replace(/"/g, '');

            navigator.clipboard.writeText(resultToCopy)
                .then(() => alert(`チームコードをクリップボードにコピーしました！\n\n${resultToCopy}`))
                .catch(err => alert("クリップボードへのコピーに失敗しました: " + err));
        }
    }

    function validate(resultArray) {
        if (resultArray[0].length === 0) {
            throw new Error("passive skill error");
        }
        if (resultArray[1].length === 0) {
            throw new Error("active skill error");
        }
        if (resultArray[2].length === 0) {
            throw new Error("hero error");
        }
        if (resultArray[3].length === 0) {
            throw new Error("stats error");
        }
        if (resultArray[4].length === 0) {
            throw new Error("order error");
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
            console.log(src);
            const match = src.match(/\/([^\/]+)\.png$/);
            const heroId = parseInt(match[1]);

            const skillNames = Array.from(document.querySelectorAll('.unit__skills.unit__section .unit__section__activeSkileName')).map(element => element.textContent);
            console.log(skillNames);
            const skillIds = getSkillIds(skillNames);

            const paramsList = document.querySelectorAll('ul.params li');
            const stats = {};
            paramsList.forEach(item => {
                const statName = item.querySelector('h4').textContent;
                const value = parseInt(item.querySelector('span:first-child').textContent, 10);
                stats[statName] = value;
            });
            console.log(stats);

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
            validate(resultArray);

            const resultString = JSON.stringify(resultArray);
            console.log(resultString);

            pushStore(resultString);
            writeClipboard(resultString);
        } else if (/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+\/\d+\?/.test(currentUrl)) {
            const outerSkillsDiv = document.querySelector('.skills');

            const passiveSkillElement = outerSkillsDiv.querySelector('.skill.passiveSkill');
            const passiveSkillName = passiveSkillElement ? passiveSkillElement.querySelector('h4 span').textContent.trim() : null;
            console.log(passiveSkillName);

            const skill = window.__NUXT__.state.skill.masters.find(skill => skill.name.ja === passiveSkillName || skill.name.en === passiveSkillName);
            const hero = window.__NUXT__.state.hero.masters.find(hero => hero.passive === skill.skillId);
            const heroId = hero.heroType;

            const innerSkillsDiv = outerSkillsDiv.querySelector('.skills');
            const elements = innerSkillsDiv.querySelectorAll('.skill.activeSkill');
            const skillNames = Array.from(elements).map(element => {
                const h4Element = element.querySelector('h4 span');
                return h4Element ? h4Element.textContent.trim() : null;
            }).filter(name => name !== null);
            console.log(skillNames);
            const skillIds = getSkillIds(skillNames);

            const paramsList = document.querySelectorAll('div.status.unitEditorPage');
            const stats = {};
            paramsList.forEach(item => {
                const statName = item.querySelector('p:first-child').textContent;
                const value = parseInt(item.querySelector('p:nth-child(2)').textContent, 10);
                stats[statName] = value;
            });
            console.log(stats);

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
            validate(resultArray);

            const resultString = JSON.stringify(resultArray);
            console.log(resultString);

            pushStore(resultString);
            writeClipboard(resultString);
        } else if (/https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+/.test(currentUrl)) {
            const teamList = document.querySelector('.teamPage__team.team > ol');
            const listItems = teamList.querySelectorAll(':scope > li');
            listItems.forEach((item) => {
                const skillsDiv = item.querySelector('.team__skills');

                const passiveSkillSpan = skillsDiv.querySelector('p > span');
                const passiveSkillName = passiveSkillSpan.textContent;
                console.log(passiveSkillName);

                const skill = window.__NUXT__.state.skill.masters.find(skill => skill.name.ja === passiveSkillName || skill.name.en === passiveSkillName);
                const hero = window.__NUXT__.state.hero.masters.find(hero => hero.passive === skill.skillId);
                const heroId = hero.heroType;

                const skillListItems = skillsDiv.querySelectorAll('ol > li');
                const skillNames = Array.from(skillListItems).map(skillItem => {
                    const activeSkillSpan = skillItem.querySelector('span');
                    const activeSkillName = activeSkillSpan.textContent;
                    console.log(activeSkillName);
                    return activeSkillName;
                }).filter(name => name !== null);
                const skillIds = getSkillIds(skillNames);

                const stats = {};
                if (item instanceof Element) {
                    const paramsDiv = item.querySelector('div.team__statuses');
                    const hp = parseInt(paramsDiv.querySelector('div.team__status:nth-child(1) > p').textContent, 10);
                    stats['HP'] = hp;
                    const phy = parseInt(paramsDiv.querySelector('div.team__status:nth-child(2) > p').textContent, 10);
                    stats['PHY'] = phy;
                    const int = parseInt(paramsDiv.querySelector('div.team__status:nth-child(3) > p').textContent, 10);
                    stats['INT'] = int;
                    const agi = parseInt(paramsDiv.querySelector('div.team__status:nth-child(4) > p').textContent, 10);
                    stats['AGI'] = agi;
                    console.log(stats);
                } else {
                    throw new Error("not Element");
                }

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
                validate(resultArray);

                const resultString = JSON.stringify(resultArray);
                console.log(resultString);

                pushStore(resultString);
            });
            writeClipboard();
        } else {
            console.log("このページではチームコードを取得できません。");
            alert("このページではチームコードを取得できません。");
        }
    } catch (e) {
        console.log(`チームコードの取得に失敗しました。`);
        console.log(e);
        alert(`チームコードの取得に失敗しました。\n\n${e.toString()}`)
    }
})();
