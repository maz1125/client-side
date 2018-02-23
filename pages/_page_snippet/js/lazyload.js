(function($){
  
  LazyLoad = {};
  
  var lazyLoadDefer = $.Deferred();
  var callbacksDefers = [];

  LazyLoad.addCallBack = function(func) {
    callbacksDefers.push(lazyLoadDefer.promise().then(func));
  };
  
  var scripts = [
/* コメントアウトされているpathを有効にするときは、HTMLに直接書かれているスクリプトタグを削除してください。 */
//    '../../common/neon/assets/js/bootstrap.min.js',
//    '../../common/neon/assets/js/joinable.min.js',
//    '../../common/neon/assets/js/resizeable.min.js',
//    '../../common/neon/assets/js/neon-api.min.js',
//    '../../common/neon/assets/js/neon-custom.min.js',
//    '../../common/js/common.js',
//    '../../common/js/components.min.js',
//    'js/animation-fx.js',
//    'js/side-menu.js',
//    'js/resource-loader.js',
//    'js/screen-switcher.js',
//    
//    // business-logic classes
//    'js/portal-contents1.js',
//    'js/input.js',
//    'js/confirm.js',
//    'js/finish.js'
  ];
  
  setTimeout(function() {
    var defers = [];
    $.each(scripts, function(i, script) {
      var defer = $.Deferred();
      $.getScript(script, function() {
        defer.resolve();
      })
      defers.push(defer.promise());
    });
    
    $.when.apply(null, defers).then(callCallbacks);
  }, 0);
  
  var callCallbacks = function() {
    lazyLoadDefer.resolve();
    $.when.apply(null, callbacksDefers).then(removeFakePicture);
  };
  
  var removeFakePicture = function() {
    setTimeout(function(){
      $('#normal-dummy').hide();
    }, 1000);
  };
  
}(jQuery));