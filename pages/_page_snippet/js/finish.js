(function($){
  
  Finish = function(){
    this.$element_;
    this.events_ = [];
  };
  
  Finish.EventType = {
  };
  
  Finish.prototype.getElement = function() {
    return this.$element_;
  };

  Finish.prototype.enterDocument = function() {
    this.$element_ = $('.finish-root');
    this.bindEvents_();

    $('.header-area').find('.finish-phase').removeClass('hidden');
    
    this.progressStepNavi_();

    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.on.apply(this.$element_, args);
      }.bind(this));
    }
  };
  
  Finish.prototype.exitDocument = function() {
    if (!this.$element_) {
      return;
    }
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.off.apply(this.$element_, args);
      }.bind(this));
      this.events_ = [];
    }
    this.unbindEvents_();
    this.$element_ = null;
  };
  
  Finish.prototype.on = function() {
    eventtype = arguments[0];
    listener = arguments[1];
    if (this.$element_) {
      this.$element_.on(eventtype, listener);
    } else {
      this.events_.push(arguments);
    }
  };
  
  Finish.prototype.bindEvents_ = function() {
  };
  
  Finish.prototype.unbindEvents_ = function() {
  };
  
  Finish.prototype.progressStepNavi_ = function() {
    var $stepNavi = $('.header-area').find('.wap-stepNavi');
    $stepNavi.stepNavi('nextStep');
  };
  
}(jQuery));