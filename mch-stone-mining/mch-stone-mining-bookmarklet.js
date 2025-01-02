javascript: (async function () {
  try {
    const cp =
      await window.$nuxt.$store.$cryptoniumService.getMyCachedCryptoTickets();
    const maxMiningCount = Math.floor(cp / 1000);

    const miningCount = prompt(
      `マイニング回数を入力してください（最大: ${maxMiningCount}）：`,
      "100"
    );

    if (!miningCount) {
      alert("キャンセルされました");
      return;
    }

    const count = parseInt(miningCount, 10);
    if (isNaN(count) || count <= 0 || count > maxMiningCount) {
      alert("有効な数値を入力してください");
      return;
    }

    const materialCounts = {};
    let lv4Count = 0;
    let lv5Count = 0;

    for (let i = 0; i < count; i += 100) {
      const batchCount = Math.min(100, count - i);
      const result =
        await window.$nuxt.$store.$materialService.drawMagicStoneLots(
          0,
          batchCount
        );
      console.log(`マイニング結果 (${i + 1} - ${i + batchCount}):`, result);

      result.lotteryResultsList.forEach((item) => {
        const type = item.materialType;
        materialCounts[type] = (materialCounts[type] || 0) + 1;

        // 魔石の判定（31x, 32x, 33x, 34x）
        const typeNum = parseInt(type, 10);
        if (typeNum >= 310 && typeNum <= 345) {
          const lastDigit = typeNum % 10;
          if (lastDigit === 4) lv4Count++;
          if (lastDigit === 5) lv5Count++;
        }
      });
    }

    // 魔石のみを抽出して表示用に整形
    const magicStones = Object.entries(materialCounts)
      .filter(([type]) => /^3[1-4][1-5]$/.test(type))
      .sort(([a], [b]) => a - b)
      .map(([type, count]) => {
        const summonName = {
          31: "イフリート",
          32: "リヴァイアサン",
          33: "ティアマト",
          34: "ガルーダ",
        }[type.slice(0, 2)];
        const level = `Lv${type.slice(2)}`;
        return `${summonName}${level}: ${count}個`;
      })
      .join("\n");

    const resultMessage =
      `${count}回のマイニング結果\n\n` +
      `【魔石Lv4】${lv4Count}個\n` +
      `【魔石Lv5】${lv5Count}個\n\n` +
      `【詳細】\n${magicStones || "なし"}`;

    console.log(resultMessage);
    alert(resultMessage);
  } catch (e) {
    console.error("マイニングエラー:", e);
    alert(`マイニングに失敗しました。\n\n${e.toString()}`);
  }
})();
