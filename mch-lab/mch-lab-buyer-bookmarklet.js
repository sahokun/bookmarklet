javascript: (async function () {
    const LOOP_LIMIT = 10; // ループ許容回数
    const TOLERANCE_PERCENT = 0.001; // 誤差許容 0.1%
    const SCALE_FACTOR = 100; // 計算有効桁数小数点以下二桁
    const SCALE_FACTOR_PERCENT = 1 / SCALE_FACTOR; // 計算有効桁数小数点以下二桁%

    const EPSILON = 1e-10; // IEEE754丸め誤差対策用
    const MAX_SCALE_FACTOR = 1000; // AMM有効桁数小数点以下三桁

    // レート一覧
    const TOKEN_PRICES = await window.$nuxt.$store.$laboratoryService.getAllTokenPrices();


    // 結果を画面出力
    function setText(content) {
        const targetDiv = document.querySelector('.ammSwapModal__balance');

        const newPElement = document.createElement('p');
        newPElement.textContent = `最適購入量 : ${content}`;
        newPElement.classList.add('optimal-purchase-amount');

        const existingPElement = targetDiv.querySelector('p.optimal-purchase-amount');

        if (existingPElement) {
            existingPElement.textContent = newPElement.textContent;
        } else {
            targetDiv.prepend(newPElement);
        }
    }

    // 対象素材取得
    function getMaterial() {
        const targetDiv = document.querySelector('.ammSwapModal__token');
        if (!targetDiv) {
            throw new Error('getMaterial');
        }

        // img の src からファイル名を取得し、3桁の数字部分を抽出->素材ID
        const imgSrc = targetDiv.querySelector('img').src;
        const filenameMatch = imgSrc.match(/\/(\d{3})\./);
        const materialId = filenameMatch ? filenameMatch[1] : null;

        // 名前の文字を取得
        const materialName = targetDiv.querySelector('p').textContent;

        // console.log("素材ID:", materialId, "素材名:", materialName);
        return { materialId: parseInt(materialId), materialName: materialName };
    }

    // レート一覧から指定素材の値を取得
    function getBuyerPrice(prices, tokenId) {
        for (const item of prices.tokenPricesMap) {
            if (item[0] === tokenId) {
                return item[1].buyer.price;
            }
        }
        return null;
    }

    // 最適購入量計算
    async function findOptimalPurchaseAmount(materialId, requiredAmount) {
        // console.log("素材ID", materialId, "希望購入素材量:", requiredAmount);

        // 現在レートの取得
        var initialPrice = getBuyerPrice(TOKEN_PRICES, materialId);
        // console.log("Current price:", initialPrice);

        // 上限素材購入量の概算 = ((現在レート * 必要量) + 1) / 現在レート
        var upperBound = Math.ceil(((Math.ceil(initialPrice * requiredAmount) + 1) / initialPrice) * SCALE_FACTOR) / SCALE_FACTOR;
        // console.log("Estimated upper bound:", upperBound);

        // 希望購入素材量での価格取得
        var minEstimate = await window.$nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, requiredAmount * MAX_SCALE_FACTOR);
        var targetPrice = minEstimate.amount;
        // console.log("目標価格:", targetPrice);

        var lowerBound = requiredAmount;
        var i = 0;
        while (true) {
            // console.log("Loop:", i + 1, "Lower bound:", lowerBound, "Upper bound:", upperBound, "Target:", targetPrice);

            // 中間値の計算
            let mid = Math.ceil(((lowerBound + upperBound) / 2) * SCALE_FACTOR) / SCALE_FACTOR;
            // 中間値での価格取得
            let midEstimate = await window.$nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, mid * MAX_SCALE_FACTOR);
            let midPrice = midEstimate.amount;
            // console.log("Mid:", mid, "Mid Price:", midPrice);

            if (midPrice === targetPrice) {
                // 中間値の価格が目標価格と同じ場合、下限を更新
                lowerBound = mid;
                // console.log(`raise the lower bound: ${mid}`);
            } else {
                // 中間値の価格が目標価格より高い場合、上限を更新
                upperBound = mid;
                // console.log(`lower the upper bound: ${mid}`);
            }

            // 下限と上限が隣り合った場合、ループ終了
            let toleranceAmount = mid * TOLERANCE_PERCENT;
            const toleranceAmountWithScale = Math.ceil((SCALE_FACTOR_PERCENT + toleranceAmount + EPSILON) * MAX_SCALE_FACTOR) / MAX_SCALE_FACTOR;
            const diff = Math.ceil(Math.abs(upperBound - lowerBound) * MAX_SCALE_FACTOR) / MAX_SCALE_FACTOR;
            // console.log(`Diff: ${diff}`, `Tolerance(${TOLERANCE_PERCENT * 100}%): ${toleranceAmountWithScale}`);
            if (diff <= toleranceAmountWithScale) {
                // console.log(`Within`);
                break;
            }

            // ループ回数
            if (i === LOOP_LIMIT - 1) {
                alert("ループ上限超過中断");
                break;
            }
            i++;
        }

        // 最終的な購入可能量を返す
        // console.log("購入可能量:", lowerBound);
        return lowerBound;
    }

    try {
        // 素材情報
        const material = getMaterial();
        // 購入量入力
        const inputValue = prompt(`${material.materialName} 希望購入量:`);
        if (isNaN(inputValue)) {
            throw new Error("isNaN");
        }
        const requiredAmount = parseFloat(inputValue);
        // 計算
        let optimalPurchaseAmount = await findOptimalPurchaseAmount(material.materialId, requiredAmount);
        // 出力
        setText(optimalPurchaseAmount);
        alert(`最適購入量: ${optimalPurchaseAmount}`);
    } catch (e) {
        console.log(e);
        alert(`失敗\n\n${e.toString()}`);
    }
})();
