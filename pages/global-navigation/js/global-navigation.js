goog.require('wap.sre.screenshot.ScreenShot');

(function($) {
  $(window).load(init);
  window.Navigation = window.Navigation || {};
  window.Navigation.goHome = function() {
    if (!!window.top) {
      window.top.location = '../../pages/home/home.html';
    } else {
      window.location = '../../pages/home/home.html';
    }
  };

  function init() {
    mountHomeLink();
    var screenShot = new wap.sre.screenshot.ScreenShot();
    screenShot.render(goog.dom.getElement('global-screenshot'));
  }

  // chat with tagging sample
  function chatTagging() {
    if (typeof wap === 'undefined')
      return;

    $
        .extend(
            neonChat,
            {
              submitMessageAs : function(usr, msg) {
                var id = this.$current_user.uniqueId().attr('id');
                if (this.isOpen && this.$current_user) {
                  this.pushMessage(id, msg.replace(/<.*?>/g, ''), usr, new Date());
                  this.renderMessages(id);
                  // ここでtag付加(成熟したらrenderMessagesに乗せること)
                  neonChat.addZangyoTag(id);
                }
              },
              addZangyoTag : function(current_user_id) {
                // tagを作成する。tagはメッセージではなく、$current_userにひもづく。
                $tag = $('<span>タグ：<div class="badge badge-roundless"><span href="#" class="color-white">残業<i class="wap-icon-close"></i></span></div></span><span style="margin-left:10px;">操作：<a href="../attendance/analysis-afterhourswork-submit.html?first=true" class="link">延長申請に追加</a></span>');
                // tagをつけるメッセージは最後のやつ
                var msgs = this.chat_history[current_user_id].messages;
                var msg = msgs[msgs.length - 1];
                $('.tags.last').append($tag);
              }
            });
  }
  // chat with tagging sample end

  function mountHomeLink() {
    $("a.nav-link-home").click(function() {
      window.Navigation.goHome();
    });
  }

}(jQuery));