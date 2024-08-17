
javascript: (async function () {
    const LOOP_LIMIT = 10; // ループ許容回数
    const TOLERANCE_PERCENT = 0.001; // 誤差許容 0.1%
    const SCALE_FACTOR = 100; // 計算有効桁数小数点以下二桁
    const SCALE_FACTOR_PERCENT = 1 / SCALE_FACTOR; // 計算有効桁数小数点以下二桁%

    const EPSILON = 1e-10; // IEEE754丸め誤差対策用
    const MAX_SCALE_FACTOR = 1000; // AMM有効桁数小数点以下三桁

    // レート一覧
    const TOKEN_PRICES = await $nuxt.$store.$laboratoryService.getAllTokenPrices();


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
            throw new Error('素材が見つかりませんでした。');
        }

        // img の src からファイル名を取得し、3桁の数字部分を抽出->素材ID
        const imgSrc = targetDiv.querySelector('img').src;
        const filenameMatch = imgSrc.match(/\/(\d{3})\./);
        const materialId = filenameMatch ? filenameMatch[1] : null;

        // 名前の文字を取得
        const materialName = targetDiv.querySelector('p').textContent;

        console.log("素材ID:", materialId, "素材名:", materialName);
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
        console.log("素材ID", materialId, "希望購入素材量:", requiredAmount);

        // 現在レートの取得
        var initialPrice = getBuyerPrice(TOKEN_PRICES, materialId);
        console.log("現在価格:", initialPrice);

        // 上限素材購入量の概算 = ((現在レート * 必要量) + 1) / 現在レート
        var upperBound = Math.ceil(((Math.ceil(initialPrice * requiredAmount) + 1) / initialPrice) * SCALE_FACTOR) / SCALE_FACTOR;
        console.log("概算上限素材購入量:", upperBound);

        // 希望購入素材量での価格取得
        var minEstimate = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, requiredAmount * MAX_SCALE_FACTOR);
        var targetPrice = minEstimate.amount;
        console.log("目標価格:", targetPrice);

        var lowerBound = requiredAmount;
        var i = 0;
        while (true) {
            console.log("ループ回数:", i + 1, "下限:", lowerBound, "上限:", upperBound, "目標:", targetPrice);

            // 中間値の計算
            let mid = Math.ceil(((lowerBound + upperBound) / 2) * SCALE_FACTOR) / SCALE_FACTOR;
            // 中間値での価格取得
            let midEstimate = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, mid * MAX_SCALE_FACTOR);
            let midPrice = midEstimate.amount;
            console.log("中間値:", mid, "中間値の価格:", midPrice);

            if (midPrice === targetPrice) {
                // 中間値の価格が目標価格と同じ場合、下限を更新
                lowerBound = mid;
                console.log(`中間値の価格が目標価格と同じなので下限を上げます。下限: ${mid}`);
            } else {
                // 中間値の価格が目標価格より高い場合、上限を更新
                upperBound = mid;
                console.log(`中間値の価格が目標価格より高いので上限を下げます。上限: ${mid}`);
            }

            // 下限と上限が隣り合った場合、ループ終了
            let toleranceAmount = mid * TOLERANCE_PERCENT;
            const toleranceAmountWithScale = Math.ceil((SCALE_FACTOR_PERCENT + toleranceAmount + EPSILON) * MAX_SCALE_FACTOR) / MAX_SCALE_FACTOR;
            const diff = Math.ceil(Math.abs(upperBound - lowerBound) * MAX_SCALE_FACTOR) / MAX_SCALE_FACTOR;
            console.log(`計算量差分: ${diff}`, `許容誤差(${TOLERANCE_PERCENT * 100}%): ${toleranceAmountWithScale}`);
            if (diff <= toleranceAmountWithScale) {
                console.log(`許容誤差内になったため計算終了`);
                break;
            }

            // ループ回数
            if (i === LOOP_LIMIT - 1) {
                alert("ループ回数上限を超えました。");
                break;
            }
            i++;
        }

        // 最終的な購入可能量を返す
        console.log("購入可能量:", lowerBound);
        return lowerBound;
    }

    try {
        // 素材情報
        const material = getMaterial();
        // 購入量入力
        const inputValue = prompt(`${material.materialName} 希望購入量を入力してください:`);
        if (isNaN(inputValue)) {
            throw new Error("isNaN");
        }
        const requiredAmount = parseFloat(inputValue);
        // 計算
        let optimalPurchaseAmount = await findOptimalPurchaseAmount(material.materialId, requiredAmount);
        // 出力
        setText(optimalPurchaseAmount);
        alert(`最適な購入量: ${optimalPurchaseAmount}`);
    } catch (e) {
        console.log(e);
        alert(`最適な購入量算出に失敗しました。\n\n${e.toString()}`);
    }
})();
