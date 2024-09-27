javascript: (function () {
  const state = window.__NUXT__.state;
  const skills = state.skill.masters;
  const extensions = state.extension.masters;
  const heroes = state.hero.masters;

  function getSkillIds(skillNames) {
    return skillNames.map((name) => {
      const skill = skills.find(
        (s) => s.name.ja === name || s.name.en === name
      );
      const extension = extensions.find((e) => e.active === skill.skillId);
      return [
        extension?.extensionType ?? skill.skillId,
        extension ? "extension" : "heroSkill",
      ];
    });
  }

  function getAttackOrder(skillIds) {
    let extensionCount = 0;
    return skillIds.map(([_, type]) =>
      type === "heroSkill" ? 0 : ++extensionCount
    );
  }

  function pushStore(resultString) {
    window.mchsim_teamcode_list = window.mchsim_teamcode_list || [];
    window.mchsim_teamcode_list.push(resultString);
  }

  function writeClipboard() {
    const list = window.mchsim_teamcode_list;
    const lastThreeCodes = list.slice(-3);
    const resultToCopy = JSON.stringify(lastThreeCodes).replace(/"/g, "");

    if (list.length < 3) {
      alert(
        `${list.length}つ目のコードを記憶しました。\n\n${list[list.length - 1]}`
      );
    } else {
      navigator.clipboard
        .writeText(resultToCopy)
        .then(() =>
          alert(
            `チームコードをクリップボードにコピーしました！\n\n${resultToCopy}`
          )
        )
        .catch((err) => alert(err));
    }
  }

  function validate(resultArray) {
    resultArray.forEach((arr, i) => {
      if (arr.length === 0) {
        throw new Error(
          ["passive skill", "active skill", "hero", "stats", "order"][i] +
            " error"
        );
      }
    });
  }

  function getHeroIdFromSrc(src) {
    const match = src.match(/\/([^\/]+)\.png$/);
    return parseInt(match[1]);
  }

  function getStatsFromList(paramsList) {
    const stats = {};
    paramsList.forEach((item) => {
      const statName = item.querySelector("h4").textContent;
      const value = parseInt(
        item.querySelector("span:first-child").textContent,
        10
      );
      stats[statName] = value;
    });
    return stats;
  }

  function getSkillNamesFromElements(elements) {
    return Array.from(elements)
      .map((el) => el.textContent)
      .slice(0, 3);
  }

  function getResultArray(skillIds, heroId, stats) {
    const heroSkillId = skillIds.find(([_, type]) => type === "heroSkill")[0];
    const extensionIds = skillIds
      .filter(([_, type]) => type === "extension")
      .map(([id]) => id);
    const attackOrder = getAttackOrder(skillIds);
    return [
      heroSkillId,
      extensionIds,
      heroId,
      [stats["HP"], stats["PHY"], stats["INT"], stats["AGI"]],
      attackOrder,
    ];
  }

  try {
    const currentUrl = window.location.href;
    let resultArray;
    if (
      /https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?battles\//.test(
        currentUrl
      )
    ) {
      const imgTag =
        document.querySelector(".unit__heroImage--original img") ||
        document.querySelector(".unit__heroImage img");
      const heroId = getHeroIdFromSrc(imgTag.src);
      const skillNames = getSkillNamesFromElements(
        document.querySelectorAll(
          ".unit__skills.unit__section .unit__section__activeSkileName"
        )
      );
      const skillIds = getSkillIds(skillNames);
      const stats = getStatsFromList(document.querySelectorAll("ul.params li"));
      resultArray = getResultArray(skillIds, heroId, stats);

      validate(resultArray);
      const resultString = JSON.stringify(resultArray);
      console.log(resultString);
      pushStore(resultString);
      writeClipboard();
    } else if (
      /https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+\/\d+\?/.test(
        currentUrl
      )
    ) {
      const passiveSkillName = document
        .querySelector(".skills .skill.passiveSkill h4 span")
        ?.textContent.trim();
      const heroId = heroes.find(
        (h) =>
          h.passive ===
          skills.find(
            (s) =>
              s.name.ja === passiveSkillName || s.name.en === passiveSkillName
          )?.skillId
      )?.heroType;
      const skillNames = getSkillNamesFromElements(
        document.querySelectorAll(".skills .skills .skill.activeSkill h4 span")
      ).filter(Boolean);
      const skillIds = getSkillIds(skillNames);
      const stats = {};
      document.querySelectorAll("div.status.unitEditorPage").forEach((item) => {
        stats[item.querySelector("p:first-child").textContent] = parseInt(
          item.querySelector("p:nth-child(2)").textContent,
          10
        );
      });
      resultArray = getResultArray(skillIds, heroId, stats);

      validate(resultArray);
      const resultString = JSON.stringify(resultArray);
      console.log(resultString);
      pushStore(resultString);
      writeClipboard();
    } else if (
      /https:\/\/www\.mycryptoheroes\.net\/(?:[a-z]{2}\/)?templates\/duel\/\d+/.test(
        currentUrl
      )
    ) {
      document
        .querySelectorAll(".teamPage__team.team > ol > li")
        .forEach((item) => {
          const passiveSkillName = item.querySelector(
            ".team__skills p > span"
          ).textContent;
          const heroId = heroes.find(
            (h) =>
              h.passive ===
              skills.find(
                (s) =>
                  s.name.ja === passiveSkillName ||
                  s.name.en === passiveSkillName
              )?.skillId
          )?.heroType;
          const skillNames = Array.from(
            item.querySelectorAll(".team__skills ol > li span")
          )
            .map((span) => span.textContent)
            .filter(Boolean);
          const skillIds = getSkillIds(skillNames);
          const stats = {};
          const paramsDiv = item.querySelector("div.team__statuses");
          ["HP", "PHY", "INT", "AGI"].forEach((stat, i) => {
            stats[stat] = parseInt(
              paramsDiv.querySelector(
                `div.team__status:nth-child(${i + 1}) > p`
              ).textContent,
              10
            );
          });
          resultArray = getResultArray(skillIds, heroId, stats);
          validate(resultArray);
          const resultString = JSON.stringify(resultArray);
          console.log(resultString);
          pushStore(resultString);
        });

      writeClipboard();
    } else {
      alert("このページではチームコードを取得できません。");
      return;
    }
  } catch (e) {
    console.log(e);
    alert(`チームコードの取得に失敗しました。\n\n${e.toString()}`);
  }
})();
