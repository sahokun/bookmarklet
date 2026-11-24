javascript: (async function () {
  try {
    // 生産種類の選択用プロンプト
    const craftType = prompt(
      "生産種類を選択してください（0: 魔法, 1: 搬送, 2: 具現）：",
      "0"
    );

    if (!craftType) {
      alert("キャンセルされました");
      return;
    }

    // 入力値の検証
    const type = parseInt(craftType, 10);
    if (isNaN(type) || type < 0 || type > 2) {
      alert("有効な生産種類を入力してください（0～2）");
      return;
    }

    // 数量入力用プロンプト
    const amount = prompt("生産数量を入力してください：", "1");

    if (!amount) {
      alert("キャンセルされました");
      return;
    }

    // 数量の検証
    const count = parseInt(amount, 10);
    if (isNaN(count) || count <= 0) {
      alert("有効な数値を入力してください");
      return;
    }

    // クラフト実行
    const result = await window.$nuxt.$store.$craftService.increaseAbility(
      type,
      count
    );
    console.log("生産結果:", result);

    // 生産種類の名前マッピング
    const typeNames = {
      0: "魔法",
      1: "搬送",
      2: "具現",
    };

    const resultMessage = `${typeNames[type]}を${count}回生産しました！`;
    console.log(resultMessage);
    alert(resultMessage);
  } catch (e) {
    console.error("生産エラー:", e);
    alert(`生産に失敗しました。\n\n${e.toString()}`);
  }
})();
