javascript: (function () {
  async function processMaterialList() {
    const materialList = document.querySelector('.craftMaterialList');
    const materialItems = materialList.querySelectorAll('.materialItem');

    const results = [];
    let totalEstimate = 0;
    for (const item of materialItems) {
      const imgSrc = item.querySelector('img').src;
      const materialId = imgSrc.match(/\/(\d+)\./)[1];

      const requiredAmountElements = item.querySelectorAll('div.amountArea');
      const requiredAmountElement = requiredAmountElements[0].querySelector('.amount');
      const requiredAmount = parseInt(requiredAmountElement.textContent.replace(/,/g, ''), 10);

      const currentAmountElement = requiredAmountElements[1].querySelector('.amount.hasNotRequiredAmount');
      const currentAmount = parseInt(currentAmountElement.textContent.replace(/,/g, ''), 10);

      const shortage = requiredAmount - currentAmount;
      if (shortage > 0) {
        const purchaseEstimate = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, shortage * 1000);
        totalEstimate += purchaseEstimate.amount;
        results.push(`素材ID: ${materialId}, 必要数: ${shortage}, 購入概算額: ${purchaseEstimate.amount}`);
      }
    }

    if (results.length > 0) {
      alert(results.join('\n') + `\n\n合計購入概算額: ${totalEstimate}`);
    } else {
      alert('必要な素材はすべて所持しています。');
    }
  }

  try {
    processMaterialList();
  } catch (e) {
    console.log(e);
    alert(`素材購入金額算出に失敗しました。\n\n${e.toString()}`);
  }
})();
