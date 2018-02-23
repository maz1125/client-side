(function($){
  
  SideMenu = function(){
    this.$element_ = $('.side-menu');
  };
  
  SideMenu.EventType = {
    CHANGE_MENU : 'changemenu'
  };
  
  SideMenu.prototype.getElement = function() {
    return this.$element_;
  };
  
  SideMenu.prototype.bindEvents = function() {
    this.$element_.on('click', '.side-menu-category', this.changeMenu_.bind(this));
  };
  
  SideMenu.prototype.changeMenu_ = function(e) {
    var $target = $(e.currentTarget);
    if ($target.hasClass('unselectable')) {
      return;
    }
    if ($target.hasClass('parent')) {
      return;
    }
    if ($target.hasClass('selected')) {
      return;
    }
    this.$element_.find('.side-menu-category').removeClass('selected');
    $target.addClass('selected');
    
    var val = $(e.currentTarget).attr('data-val');
    this.$element_.trigger(SideMenu.EventType.CHANGE_MENU, val);
  };
}(jQuery));