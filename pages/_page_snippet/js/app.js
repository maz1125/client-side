/*
 * 各画面のJSの形式がそろっていると一括での修正がやりやすくなります。 新しく画面を作る場合はこの形式でやってください。sato_hi
 */
(function($) {
  $.widget('wap.application',// ここは変えないでください。この名前であることを前提として勝手に初期化処理を蹴っています。
  $.wap.abstractApp,// ここは継承元です。必要に応じて継承元を用意できます。
  {
    _buildPage : function() {
      // 何か要素を作ってappendしたり、モックに必要なオブジェクトをnewしたりといった類のことをここでします。
      // 状態はthisに持っておくことができます。ここでのthisはグローバルに公開されているappとイコールです。
      
      LazyLoad.addCallBack(function() {
        this.sideMenu_ = !!window.SideMenu ? new SideMenu() : null;
        
        var instances = {};
        instances['SideMenu'] = this.sideMenu_;
        this.screenSwitcher_ = new ScreenSwitcher(instances);
        
        var queryParam = FRONTMOCK.QueryParam.getParam();
        
        if (!!queryParam.appId) {
          this.screenSwitcher_.input();
        } else {
          this.screenSwitcher_.portalContents1();
        }

      }.bind(this));
    },

    _bindEvent : function() {
      // _buildPageでthisに入れていたものはここで使えます。

      LazyLoad.addCallBack(function() {

        if (!!this.sideMenu_) {
          this.sideMenu_.bindEvents();
          
          this.sideMenu_.getElement().on(SideMenu.EventType.CHANGE_MENU, function(e, val) {          
            switch(val) {
            default:
              break;
            }
          }.bind(this));
        }

      }.bind(this));
      
     
      
      
    }
  });
}(jQuery));
