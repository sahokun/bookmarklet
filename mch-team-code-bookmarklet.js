javascript: (function () {
    try {
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
            const targetSkill = data.find(skill => skill.name.ja === skillName || skill.name.en === skillName);
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
            alert(`${listLength}つ目のコードを記憶しました。\n\n${resultString}`);
        } else {
            const lastThreeCodes = window.mchsim_teamcode_list.slice(-3);
            const resultToCopy = JSON.stringify(lastThreeCodes).replace(/"/g, '');

            navigator.clipboard.writeText(resultToCopy)
                .then(() => alert(`チームコードをクリップボードにコピーしました！\n\n${resultToCopy}`))
                .catch(err => alert("クリップボードへのコピーに失敗しました: " + err));
        }
    } catch (e) {
        alert(`チームコードの取得に失敗しました。\n\n${e.toString()}`)
    }
})();