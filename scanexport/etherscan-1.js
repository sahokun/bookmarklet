javascript:(function() {
    // イーサリアムアドレスの入力を求めるプロンプト
    var address = prompt("イーサリアムアドレスを入力してください:");

    // アドレスの存在確認と形式の検証（0xで始まる40文字の16進数）
    if (address && /^0x[a-fA-F0-9]{40}$/.test(address)) {
        // 有効なアドレスの場合、LocalStorageに保存
        window.localStorage.setItem("ethAddress", address);
        alert("アドレスが保存されました: " + address);
    } else {
        // 無効なアドレスの場合、エラーメッセージを表示
        alert("無効なイーサリアムアドレスです。0xで始まる42文字の16進数を入力してください。");
    }
})();