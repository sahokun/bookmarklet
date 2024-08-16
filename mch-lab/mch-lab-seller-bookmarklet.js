
javascript: (async function () {
    const EPSILON = 1e-10;
    const SCALE_FACTOR = 100;
    const SCALE_FACTOR_PERCENT = 1 / SCALE_FACTOR;
    const MAX_SCALE_FACTOR = 1000;
    const TOLERANCE_PERCENT = 0.001; // 0.1%
    const LOOP_LIMIT = 10;

    const prices = await $nuxt.$store.$laboratoryService.getAllTokenPrices();

    function getAmount(){
        const div = document.querySelector('div[data-v-2819963c].ammSwapModal__balance');
        const allP = div.querySelectorAll('p');

        const p = Array.from(allP).find(p => p.textContent.includes("所持量"));

        // 前提として、p要素はすでに取得済みであるとします。
        const textContent = p.textContent; 

        // 正規表現を使って数値部分を抽出
        const match = textContent.match(/[\d,]+(\.\d+)?/); // 小数点以下も考慮した正規表現

        if (!match) {

         throw new Error("数値が見つかりませんでした。");   
        }
        const number = parseFloat(match[0].replace(/,/g, ''));
        return number;
    }

    function setText(content) {
        const targetDiv = document.querySelector('.ammSwapModal__balance');

        const newPElement = document.createElement('p');
        newPElement.textContent = `最適売却量: ${content}`; 
        newPElement.classList.add('optimal-seller-amount'); 

        const existingPElement = targetDiv.querySelector('p.optimal-seller-amount');

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

    function getSellerPrice(prices, tokenId) {
        for (const item of prices.tokenPricesMap) {
            if (item[0] === tokenId) {
                return item[1].seller.price;
            }
        }
        return null;
    }

    async function findOptimalSaleAmount(materialId, requiredAmount) {
        console.log("素材ID", materialId, "希望売却素材量:", requiredAmount);

        // 現在レートの取得
        var initialPrice = getSellerPrice(prices, materialId);
        console.log("現在価格:", initialPrice);

        // 下限素材購入量の概算 = ((現在レート * 必要量) - 1) / 現在レート
        var lowerBound = Math.floor(((Math.floor(initialPrice * requiredAmount) -1) / initialPrice) * SCALE_FACTOR) / SCALE_FACTOR;
        if(lowerBound < 0) {
            lowerBound = 0;
        }
        console.log("下限素材購入量:", lowerBound);

        // 希望売却素材量での価格取得
        var maxEstimate = await $nuxt.$store.$laboratoryService.estimateSaleAmount(materialId, requiredAmount * MAX_SCALE_FACTOR);
        var targetPrice = maxEstimate.amount;
        if(targetPrice === 0){
            throw new Error('1GUMに満たないため売却できません');
        }
        console.log("目標価格:", targetPrice);

        var upperBound = requiredAmount;
        var i = 0;
        while (true) {
            console.log("ループ回数:", i + 1);
            console.log("上限:", upperBound, "下限:", lowerBound, "目標:", targetPrice);

            // 中間値の計算
            let mid = Math.ceil(((upperBound + lowerBound) / 2) * SCALE_FACTOR) / SCALE_FACTOR;
            console.log("中間値:", mid);

            // 中間値での価格取得
            let midEstimate = await $nuxt.$store.$laboratoryService.estimateSaleAmount(materialId, mid * MAX_SCALE_FACTOR);
            let midPrice = midEstimate.amount;
            console.log("中間値の価格:", midPrice);

            if (midPrice === targetPrice) {
                // 中間値の価格が目標価格と同じ場合、上限を更新
                upperBound = mid;
                console.log("midPrice === targetPrice");
                console.log(`upperBound${upperBound} = mid${mid}`);
            } else {
                // 中間値の価格が目標価格より低い場合、下限を更新
                console.log("midPrice < targetPrice");
                lowerBound = mid;
                console.log(`lowerBound${lowerBound} = mid${mid}`);
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

            if(i === LOOP_LIMIT - 1) {
                alert("ループ回数上限を超えました。");
                break;
            }
            i++;
        }

        // 最終的な売却可能量を返す
        console.log("売却可能量:", upperBound);
        return upperBound;
    }

    try {
        const material = getMaterial();
        const requiredAmount = parseFloat(getAmount());
        let optimalSaleAmount = await findOptimalSaleAmount(material.materialId, requiredAmount);
        setText(optimalSaleAmount);
        alert(`最適な売却量: ${optimalSaleAmount}`);
    } catch (e) {
        console.log(e);
        alert(`最適な売却量算出に失敗しました。\n\n${e.toString()}`);
    }
})();
