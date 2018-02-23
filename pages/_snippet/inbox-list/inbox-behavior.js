(function($){
  
  InboxBehavior = {};

  InboxBehavior.attachFixHeader = function($scrollRoot, $overwrap) {
    var topBorder = $overwrap.position().top + $overwrap.height();
    $scrollRoot.on('scroll', function(e) {
      var $target = $scrollRoot.find('.inbox-detail-title');
      var $detail = $('.inbox-detail');
      if ($detail.size() <= 0) {
        return;
      }
      var bottomBorder = $detail.position().top + $detail.height();
      if ($target.position().top < topBorder && !$target.hasClass('fixed')) {
        $target.addClass('fixed');
      } else if ($target.next().position().top > topBorder + $target.height() && $target.hasClass('fixed')) {
        $target.removeClass('fixed');
      }
    });
  };
  
  InboxBehavior.openDetail = function($detail) {
    $detail.find('.inbox-detail-title').nextAll().show();
    setTimeout(function(){
      $detail.addClass('open');
    }, 10);
  };
  
  InboxBehavior.closeDetail = function($detail, withAnimation) {
    var delay = withAnimation ? 150 : 0;
    var defer = $.Deferred();
    $detail.find('.inbox-detail-title').nextAll().hide();
    $detail.removeClass('open');
    setTimeout(function(){
      defer.resolve();
    }, delay);
    return defer.promise().then(function(){
      $detail.remove();
    });
  };
}(jQuery));