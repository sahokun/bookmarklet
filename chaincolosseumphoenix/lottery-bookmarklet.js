javascript: (function () {
    let count = 0;

    function clickButtons() {
        console.log("clickButtons()");
        if (count >= 20) {
            return; // 20回ループしたら終了
        }

        var button1 = document.querySelector('.btn-submit');
        if (button1) {
            button1.click();
            count++;

            // button2 が現れるのを監視
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        var button2 = document.querySelector('.btn-share');
                        if (button2) {
                            button2.click();
                            observer.disconnect(); // 監視を停止

                            // lottery-info内のclass="value"のdivの中身をチェック
                            var valueDivs = document.querySelectorAll('.lottery-info .value');
                            for (var i = 0; i < valueDivs.length; i++) {
                                if (valueDivs[i].textContent.trim() === '20/20') {
                                    console.log("20/20");
                                    return; // 20/20になったら終了
                                }
                            }

                            setTimeout(clickButtons, 1000); // 1秒後に次のループ
                        }
                    }
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    console.log("start");
    clickButtons(); // 最初のループを開始
    console.log("end");
})();