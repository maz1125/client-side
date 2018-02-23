(function($){
  
  AnimationFunction = {};
  
  var time = 150;
  
  AnimationFunction.switchWithFade = function($from, $to, opt_toggleHeader, opt_toggleSidemenu) {
    var defer = $.Deferred();
    var $body = $('.page-body');
    var $sidemenu = $('.side-menu');
    
    $from.addClass('animation-fade-from');
    $to.addClass('animation-fade-to');
    $from.after($to);
    if (opt_toggleSidemenu) {
      if ($body.hasClass('side-menu-less')) {
        $sidemenu.show();
      }
      setTimeout(function(){
        $body.toggleClass('side-menu-less');
      }, 0);
    }
    
    $from.addClass('animating');
    setTimeout(function(){
      $from.hide();
      $to.show();
      $to.addClass('animating');
      
      if (opt_toggleHeader) {
        $body.toggleClass('header-less');
      }
      if (opt_toggleSidemenu) {
        if ($body.hasClass('side-menu-less')) {
          $sidemenu.hide();
        }
      }
      setTimeout(function(){
        $from.removeClass('animation-fade-from');
        $from.removeClass('animating');
        $to.removeClass('animation-fade-to');
        $to.removeClass('animating');
        $from.remove();
        defer.resolve($from);
      }, time);
    }, time);
    return defer.promise();
  };
  
  AnimationFunction.replaceWithFade = function($from, $to) {
    var defer = $.Deferred();
    $from.addClass('animation-fade-from');
    $to.addClass('animation-fade-to');
    $from.after($to);
    
    $from.addClass('animating');
    setTimeout(function(){
      $from.remove();
      $to.show();
      $to.addClass('animating');
      
      setTimeout(function(){
        $to.removeClass('animation-fade-to');
        $to.removeClass('animating');
        defer.resolve();
      }, time);
    }, time);
    return defer.promise();
  };
  
  AnimationFunction.replaceWithSlide = function($from, $to, isRightDirection) {
    var defer = $.Deferred();
    var direction = isRightDirection ? 'right' : 'left';
    $from.addClass('animation-slide-'+direction+'-from');
    $to.addClass('animation-slide-'+direction+'-to');
    $from.after($to);
    
    var $parent = $from.parent();
    $parent.addClass('animation-slide-parent');
    setTimeout(function() {
      $from.addClass('animating');
      $to.addClass('animating');

      setTimeout(function(){
        $from.remove();
        $to.show();
        
        $to.removeClass('animation-slide-'+direction+'-to');
        $to.removeClass('animating');
        $parent.removeClass('animation-slide-parent');
        defer.resolve();
      }, time * 2);
    }, 0);
    return defer.promise();
  };
  
  AnimationFunction.fadeout = function($element) {
    var defer = $.Deferred();
    if ($element.hasClass('animation-fadein')) {
      $element.removeClass('animating');
      setTimeout(function(){
        $element.removeClass('animation-fadein');
        defer.resolve($element);
      }, time * 2);
    } else {
      $element.addClass('animation-fadeout');
      
      setTimeout(function() {
        $element.addClass('animating');
        setTimeout(function(){
          defer.resolve($element);
        }, time * 2);
      }, 0);
    }
    return defer.promise();
  };
  
  AnimationFunction.fadein = function($element) {
    var defer = $.Deferred();
    if ($element.hasClass('animation-fadeout')) {
      $element.removeClass('animating');
      setTimeout(function(){
        $element.removeClass('animation-fadeout');
        defer.resolve($element);
      }, time * 2);
    } else {
      $element.addClass('animation-fadein');
      
      setTimeout(function() {
        $element.addClass('animating');
        setTimeout(function(){
          defer.resolve($element);
        }, time * 2);
      }, 0);
    }
    return defer.promise();
  };
  
}(jQuery));