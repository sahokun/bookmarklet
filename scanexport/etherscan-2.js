javascript:(function() {
    // 通知メッセージを表示する関数
    function showNotification(message, type) {
        var notification = document.createElement('div');
        notification.innerHTML = message.replace(/\n/g, '<br>');
        notification.style.cssText = 
            'position: fixed;' +
            'top: 20px;' +
            'right: 20px;' +
            'padding: 10px 20px;' +
            'background-color: ' + (type === 'error' ? '#ffcccc' : '#ccffcc') + ';' +
            'border-radius: 5px;' +
            'box-shadow: 0 2px 8px rgba(0,0,0,0.15);' +
            'z-index: 9999;' +
            'font-family: Arial, sans-serif;' +
            'font-size: 14px;' +
            'line-height: 1.5;';

        document.body.appendChild(notification);

        // 3秒後にフェードアウト
        setTimeout(function() {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // LocalStorageからイーサリアムアドレスを取得
    var ethAddress = window.localStorage.getItem('ethAddress');

    if (ethAddress) {
        // アドレス入力欄に値を設定
        var addressInput = document.getElementById('ContentPlaceHolder1_txtAddress');
        if (addressInput) {
            addressInput.value = ethAddress;
        }

        // 日付範囲を設定
        document.getElementById('ContentPlaceHolder1_txtstart_time').value = '12/31/2023';
        document.getElementById('ContentPlaceHolder1_txtstart_time2').value = '1/1/2025';

        // チェックボックスを設定
        ['ContentPlaceHolder1_chkWithTx', 'ContentPlaceHolder1_chkPrivateTag'].forEach(function(id) {
            var checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = true;
        });

        // 成功メッセージを表示
        showNotification(
            'フォームが入力されました。\nアドレス: ' + ethAddress + 
            '\n日付範囲: 12/31/2023 - 1/1/2025',
            'success'
        );
    } else {
        // エラーメッセージを表示
        showNotification(
            'イーサリアムアドレスが設定されていません。\n' +
            '先にアドレスセット用ブックマークレットを実行してください。',
            'error'
        );
    }
})();