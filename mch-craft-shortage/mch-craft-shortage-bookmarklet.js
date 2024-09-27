/**
 * GUM計算ブックマークレット
 *
 * @概要
 * このスクリプトは、ゲーム内のクラフト画面で必要な素材と所持数を分析し、
 * 不足している素材の購入に必要なGUM（ゲーム内通貨）を計算します。
 *
 * @主な仕様
 * - 素材のIDと名前のマッピングを使用
 * - 必要な素材量と所持数を比較
 * - 不足している素材の購入に必要なGUMを計算
 * - 個別の素材処理で例外が発生した場合、エラーログを出力し「不明」と表示
 * - 結果をアラートで表示
 *
 * @制限事項
 * - ゲーム内の特定の画面（クラフト画面）でのみ動作します
 * - ゲームの仕様変更により動作しなくなる可能性があります
 *
 * @バージョン 2024-09-27-01
 */

javascript: (async function () {
  // 素材IDと名前のマッピング
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

  /**
   * アイテム名を取得する関数
   * @returns {string} アイテム名
   * @throws {Error} 要素が見つからない場合
   */
  function getItemName() {
    const topAreaDiv = document.querySelector(".craftExtensionModal__topArea");
    if (!topAreaDiv) throw new Error("トップエリアが見つかりません");

    const itemNameElement = topAreaDiv.querySelector(".name p");
    if (!itemNameElement) throw new Error("アイテム名要素が見つかりません");

    return itemNameElement.textContent;
  }

  /**
   * WeiをGUMに変換し、小数点以下2桁に制限する関数
   * @param {string} wei - 変換するWei値
   * @returns {number} GUM値（小数点以下2桁）
   */
  function weiToGUM(wei) {
    return Number((parseFloat(wei) / Math.pow(10, 18)).toFixed(2));
  }

  /**
   * 素材名を取得する関数
   * @param {string} materialId - 素材ID
   * @returns {string} 素材名
   */
  function getMaterialName(materialId) {
    for (const [prefix, name] of materialIdPrefixMap) {
      if (materialId.startsWith(prefix)) {
        return prefix.length === 2 ? name + materialId.slice(-1) : name;
      }
    }
    return materialId; // マッピングが見つからない場合はIDをそのまま返す
  }

  /**
   * 素材の購入見積もりを取得する関数
   * @param {string} materialId - 素材ID
   * @param {number} amount - 必要量
   * @returns {Promise<{wei: string}>} 購入見積もり結果
   */
  async function getPurchaseEstimate(materialId, amount) {
    return await window.$nuxt.$store.$laboratoryService.estimatePurchaseAmount(
      materialId,
      amount * 1000
    );
  }

  /**
   * 個別の素材アイテムを処理する関数
   * @param {Element} item - 素材アイテム要素
   * @returns {Promise<{materialName: string, shortage: number, shortageGUM: number, requiredAmount: number, requiredGUM: number}>}
   * @throws {Error} 処理中にエラーが発生した場合
   */
  async function processMaterialItem(item) {
    const imgSrc = item.querySelector("img").src;
    const materialId = imgSrc.match(/\/(\d+)\./)[1];
    const materialName = getMaterialName(materialId);

    const requiredAmountElements = item.querySelectorAll("div.amountArea");
    const requiredAmount = parseInt(
      requiredAmountElements[0]
        .querySelector(".amount")
        .textContent.replace(/,/g, ""),
      10
    );
    const currentAmount = parseInt(
      requiredAmountElements[1]
        .querySelector(".amount")
        .textContent.replace(/,/g, ""),
      10
    );

    const shortage = requiredAmount - currentAmount;
    if (shortage <= 0) return null;

    const purchaseEstimateRequired = await getPurchaseEstimate(
      materialId,
      requiredAmount
    );
    const purchaseEstimateShortage = await getPurchaseEstimate(
      materialId,
      shortage
    );

    return {
      materialName,
      shortage,
      shortageGUM: weiToGUM(purchaseEstimateShortage.wei),
      requiredAmount,
      requiredGUM: weiToGUM(purchaseEstimateRequired.wei),
    };
  }

  /**
   * 素材リストを処理する関数
   */
  async function processMaterialList() {
    const itemName = getItemName();
    const materialList = document.querySelector(".craftMaterialList");
    if (!materialList) throw new Error("素材リストが見つかりません");

    const materialItems = materialList.querySelectorAll(".materialItem");
    const results = [];
    let totalEstimateRequired = 0;
    let totalEstimateShortage = 0;

    for (const item of materialItems) {
      try {
        const result = await processMaterialItem(item);
        if (result) {
          totalEstimateRequired += result.requiredGUM;
          totalEstimateShortage += result.shortageGUM;
          results.push(
            `${result.materialName}, 不足数: ${
              result.shortage
            }(${result.shortageGUM.toFixed(2)}GUM), 必要数: ${
              result.requiredAmount
            }(${result.requiredGUM.toFixed(2)}GUM)`
          );
        }
      } catch (e) {
        console.error(`素材処理エラー (${item.querySelector("img").src}):`, e);
        results.push(
          `${item.querySelector("img").src.match(/\/(\d+)\./)[1]}, 不明`
        );
      }
    }

    if (results.length > 0) {
      alert(
        `${itemName}\n\n${results.join(
          "\n"
        )}\n\n不足分額: ${totalEstimateShortage.toFixed(
          2
        )}GUM, 総額: ${totalEstimateRequired.toFixed(2)}GUM`
      );
    } else {
      alert("必要な素材はすべて所持しています。");
    }
  }

  try {
    await processMaterialList();
  } catch (e) {
    console.error("素材購入金額算出エラー:", e);
    alert(`素材購入金額算出に失敗しました。\n\n${e.toString()}`);
  }
})();
