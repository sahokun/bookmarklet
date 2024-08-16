
javascript: (async function () {
    const EPSILON = 1e-10;
    const SCALE_FACTOR = 100;
    const SCALE_FACTOR_PERCENT = 1 / SCALE_FACTOR;
    const MAX_SCALE_FACTOR = 1000;
    const TOLERANCE_PERCENT = 0.001; // 0.1%
    const LOOP_LIMIT = 20;

    const prices = await $nuxt.$store.$laboratoryService.getAllTokenPrices();

    function setText(content) {
        const targetDiv = document.querySelector('.ammSwapModal__balance');

        const newPElement = document.createElement('p');
        newPElement.textContent = `最適購入量: ${content}`; 
        newPElement.classList.add('optimal-purchase-amount'); 

        const existingPElement = targetDiv.querySelector('p.optimal-purchase-amount');

        if (existingPElement) {
            existingPElement.textContent = newPElement.textContent;
        } else {
            targetDiv.prepend(newPElement); 
        }
    }

    function getMaterial() {
        // class="ammSwapModal__token" の div を取得
        const targetDiv = document.querySelector('.ammSwapModal__token');
        if (!targetDiv) {
            throw new Error('素材が見つかりませんでした。');
        }
        // img の src からファイル名を取得し、3桁の数字部分を抽出
        const imgSrc = targetDiv.querySelector('img').src;
        const filenameMatch = imgSrc.match(/\/(\d{3})\./);
        const filenameNumber = filenameMatch ? filenameMatch[1] : null;

        // p の文字を取得
        const pText = targetDiv.querySelector('p').textContent;

        console.log("3桁数字:", filenameNumber);
        console.log("p の文字:", pText);

        return { materialId: parseInt(filenameNumber), materialName: pText };
    }

    function getBuyerPrice(prices, tokenId) {
        for (const item of prices.tokenPricesMap) {
            if (item[0] === tokenId) {
                return item[1].buyer.price;
            }
        }
        return null;
    }

    async function findOptimalPurchaseAmount(materialId, requiredAmount) {
        console.log("素材ID", materialId, "希望購入素材量:", requiredAmount);

        // 現在レートの取得
        var initialPrice = getBuyerPrice(prices, materialId);
        console.log("現在価格:", initialPrice);

        // 上限素材購入量の概算 = ((現在レート * 必要量) + 1) / 現在レート
        var upperBound = Math.ceil(((Math.ceil(initialPrice * requiredAmount) + 1) / initialPrice) * SCALE_FACTOR) / SCALE_FACTOR;
        console.log("上限素材購入量:", upperBound);

        // 希望購入素材量での価格取得
        var minEstimate = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, requiredAmount * MAX_SCALE_FACTOR);
        var targetPrice = minEstimate.amount;
        console.log("目標価格:", targetPrice);

        var lowerBound = requiredAmount;

        // ループは20回まで
        for (let i = 0; i < LOOP_LIMIT; i++) {
            console.log("ループ回数:", i + 1);
            console.log("下限:", lowerBound, "上限:", upperBound, "目標:", targetPrice);

            // 中間値の計算
            let mid = Math.ceil(((lowerBound + upperBound) / 2) * SCALE_FACTOR) / SCALE_FACTOR;
            console.log("中間値:", mid);

            // 中間値での価格取得
            let midEstimate = await $nuxt.$store.$laboratoryService.estimatePurchaseAmount(materialId, mid * MAX_SCALE_FACTOR);
            let midPrice = midEstimate.amount;
            console.log("中間値の価格:", midPrice);

            if (midPrice === targetPrice) {
                // 中間値の価格が目標価格と同じ場合、下限を更新
                lowerBound = mid;
                console.log("midPrice === targetPrice");
                console.log(`lowerBound${lowerBound} = mid${mid}`);
            } else {
                // 中間値の価格が目標価格より高い場合、上限を更新
                console.log("midPrice > targetPrice");
                upperBound = mid;
                console.log(`upperBound${upperBound} = mid${mid}`);
            }

            // 下限と上限が隣り合った場合、ループ終了
            let tolerance = Math.ceil(mid * TOLERANCE_PERCENT * MAX_SCALE_FACTOR) / MAX_SCALE_FACTOR;
            console.log(`tolerance: ${tolerance}`);
            console.log(`(upperBound - lowerBound): ${upperBound - lowerBound}, (0.01 + tolerance + EPSILON): ${(SCALE_FACTOR_PERCENT + tolerance + EPSILON)}`);
            console.log(((upperBound - lowerBound) <= (SCALE_FACTOR_PERCENT + tolerance + EPSILON)));
            if (upperBound - lowerBound <= SCALE_FACTOR_PERCENT + tolerance + EPSILON) {
                console.log(`下限と上限が隣り合った場合、ループ終了`);
                break;
            }
        }

        // 最終的な購入可能量を返す
        console.log("購入可能量:", lowerBound);
        return lowerBound;
    }

    try {
        const material = getMaterial();

        const inputValue = prompt(`${material.materialName} 希望購入量を入力してください:`);

        // 入力値が数値であるか確認
        if (isNaN(inputValue)) {
            throw new Error("isNaN");
        }

        const requiredAmount = parseFloat(inputValue);
        let optimalPurchaseAmount = await findOptimalPurchaseAmount(material.materialId, requiredAmount);
        setText(optimalPurchaseAmount);
        alert(`最適な購入量: ${optimalPurchaseAmount}`);
    } catch (e) {
        console.log(e);
        alert(`最適な購入量算出に失敗しました。\n\n${e.toString()}`);
    }
})();
