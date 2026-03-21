javascript:(function() {
    // イーサリアムアドレスの入力を求めるプロンプト
    var address = prompt("イーサリアムアドレスを入力してください:");

    // アドレスの存在確認と形式の検証（0xで始まる40文字の16進数）
    if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
        // 有効なアドレスの場合、LocalStorageに保存
        window.localStorage.setItem("ethAddress", address);
        
        // 現在の年を取得
        var currentYear = new Date().getFullYear();
        
        // デフォルトの日付範囲を設定（今年の1月1日～翌年1月1日）
        var defaultStartDate = "12/31/" + (currentYear - 1);
        var defaultEndDate = "1/1/" + (currentYear + 1);
        
        // 開始日を入力
        var startDate = prompt(
            "開始日を入力してください（MM/DD/YYYY形式）:",
            defaultStartDate
        );
        
        // 終了日を入力
        var endDate = prompt(
            "終了日を入力してください（MM/DD/YYYY形式）:",
            defaultEndDate
        );
        
        // 日付が入力された場合は保存
        if (startDate && endDate) {
            window.localStorage.setItem("ethStartDate", startDate);
            window.localStorage.setItem("ethEndDate", endDate);
            alert("アドレスと日付範囲が保存されました:\nアドレス: " + address + "\n期間: " + startDate + " - " + endDate);
        } else {
            alert("アドレスのみ保存されました: " + address + "\n日付は設定されませんでした。");
        }
    } else {
        // 無効なアドレスの場合、エラーメッセージを表示
        alert("無効なイーサリアムアドレスです。0xで始まる42文字の16進数を入力してください。");
    }
})();