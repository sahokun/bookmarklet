javascript: (async function () {
  const materialIdPrefixMap = new Map([
    ["101", "鉄"],
    ["102", "銅"],
    ["103", "亜鉛"],
    ["111", "クロム"],
    ["112", "チタン"],
    ["113", "タングステン"],
    ["201", "アクアマリン"],
    ["202", "インカローズ"],
    ["203", "トパーズ"],
    ["204", "ペリドット"],
    ["205", "オニキス"],
    ["206", "アメジスト"],
    ["207", "ジェイド"],
    ["208", "ラピスラズリ"],
    ["209", "ガーネット"],
    ["31", "イフリート"],
    ["32", "リヴァイアサン"],
    ["33", "ティアマト"],
    ["34", "ガルーダ"],
    ["401", "エンブレム"],
    ["501", "ゴールドダスト"],
  ]);

  function getName() {
    const topAreaDiv = document.querySelector('.craftExtensionModal__topArea');
    const itemNameElement = topAreaDiv.querySelector('.name p'); 
    const itemName = itemNameElement.textContent;

    return itemName;
  }

  async function processMaterialList() {
    const extensionName = getName();
    const materialList = document.querySelector('.craftMaterialList');
    const materialItems = materialList.querySelectorAll('.materialItem');

    const results = [];
    let totalEstimateRequired = 0;
    let totalEstimateShortage = 0;
    for (const item of materialItems) {
      const imgSrc = item.querySelector('img').src;
      const materialId = imgSrc.match(/\/(\d+)\./)[1];
      let materialName = materialId;
      for (const [prefix, name] of materialIdPrefixMap) {
        if (materialId.startsWith(prefix)) {
          materialName = name;
          if (prefix.length === 2) {
            materialName += materialId.slice(-1); 
          }
          break;
        }
      }

      const requiredAmountElements = item.querySelectorAll('div.amountArea');

      const requiredAmountElement = requiredAmountElements[0].querySelector('.amount');
      const requiredAmount = parseInt(requiredAmountElement.textContent.replace(/,/g, ''), 10);

      const currentAmountElement = requiredAmountElements[1].querySelector('.amount');
      const currentAmount = parseInt(currentAmountElement.textContent.replace(/,/g, ''), 10);

      const shortage = requiredAmount - currentAmount;
      if (shortage > 0) {
        const purchaseEstimateRequired = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, requiredAmount * 1000);
        totalEstimateRequired += purchaseEstimateRequired.amount;
        const purchaseEstimateShortage = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, shortage * 1000);
        totalEstimateShortage += purchaseEstimateShortage.amount;
        results.push(`${materialName}, 不足数: ${shortage}(${purchaseEstimateShortage.amount}GUM), 必要数: ${requiredAmount}(${purchaseEstimateRequired.amount}GUM)`);
      }
    }

    if (results.length > 0) {
      alert(`${extensionName}\n\n${results.join('\n')}\n\n不足分額: ${totalEstimateShortage}GUM, 総額: ${totalEstimateRequired}GUM`);
    } else {
      alert('必要な素材はすべて所持しています。');
    }
  }

  try {
    await processMaterialList();
  } catch (e) {
    console.log(e);
    alert(`素材購入金額算出に失敗しました。\n\n${e.toString()}`);
  }
})();
