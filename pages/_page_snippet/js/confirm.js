(function($){
  
  Confirm = function(){
    this.$element_;
    this.events_ = [];
  };
  
  Confirm.EventType = {
    GO_TO_FINISH : 'go-to-finish'
  };
  
  Confirm.prototype.getElement = function() {
    return this.$element_;
  };

  Confirm.prototype.enterDocument = function() {
    this.$element_ = $('.input-root');
    this.bindEvents_();

    this.$element_.addClass('readonly')
    this.$element_.find('.confirm-phase').removeClass('hidden');
    $('.header-area').find('.confirm-phase').removeClass('hidden');

    $('.main-contents').scrollTop(0);
    this.progressStepNavi_();
    
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.on.apply(this.$element_, args);
      }.bind(this));
    }
  };
  
  Confirm.prototype.exitDocument = function() {
    if (!this.$element_) {
      return;
    }
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.off.apply(this.$element_, args);
      }.bind(this));
      this.events_ = [];
    }
    $('.header-area').find('.confirm-phase').addClass('hidden');
    this.unbindEvents_();
    this.$element_ = null;
  };
  
  Confirm.prototype.on = function() {
    eventtype = arguments[0];
    listener = arguments[1];
    if (this.$element_) {
      this.$element_.on(eventtype, listener);
    } else {
      this.events_.push(arguments);
    }
  };
  
  Confirm.prototype.bindEvents_ = function() {
    var $header = $('.header-area');
    $header.on('click', '.finish-btn', this.onFinishClick_.bind(this));

    this.$element_.on('click', '.finish-btn', this.onFinishClick_.bind(this));
  };
  
  Confirm.prototype.unbindEvents_ = function() {
    this.$element_.off();
    
    var $header = $('.header-area');
    $header.off();
  };
  
  Confirm.prototype.onFinishClick_ = function(e) {
    this.$element_.trigger(Confirm.EventType.GO_TO_FINISH);
  };
  
  Confirm.prototype.progressStepNavi_ = function() {
    var $stepNavi = $('.header-area').find('.wap-stepNavi');
    $stepNavi.stepNavi('nextStep');
  };
}(jQuery));