(function($){
  
  Input = function(){
    this.$element_;
    this.events_ = [];
  };
  
  Input.EventType = {
    GO_TO_CONFIRM : 'go-to-confirm'
  };
  
  Input.prototype.getElement = function() {
    return this.$element_;
  };

  Input.prototype.enterDocument = function() {
    this.$element_ = $('.input-root');
    
    this.setupStepNavi_();
    
    // instantiate single select
    this.$element_.find('.wap-single-select').singleSelect();
    
    this.bindEvents_();
    
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.on.apply(this.$element_, args);
      }.bind(this));
    }
  };
  
  Input.prototype.exitDocument = function() {
    if (!this.$element_) {
      return;
    }
    
    this.$element_.find('.input-phase').addClass('hidden');
    $('.header-area').find('.input-phase').addClass('hidden');
    
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.off.apply(this.$element_, args);
      }.bind(this));
      this.events_ = [];
    }
    this.unbindEvents_();
    this.$element_ = null;
  };
  
  Input.prototype.on = function() {
    eventtype = arguments[0];
    listener = arguments[1];
    if (this.$element_) {
      this.$element_.on(eventtype, listener);
    } else {
      this.events_.push(arguments);
    }
  };
  
  Input.prototype.bindEvents_ = function() {
    var $header = $('.header-area');
    $header.on('click', '.confirm-btn', this.onConfirmClick_.bind(this));

    this.$element_.on('click', '.confirm-btn', this.onConfirmClick_.bind(this));
  };
  
  Input.prototype.unbindEvents_ = function() {
    this.$element_.off();
    
    var $header = $('.header-area');
    $header.off();
  };
  
  Input.prototype.onConfirmClick_ = function(e) {
    var data = {};
    data.element = this.$element_;
    this.$element_.trigger(Input.EventType.GO_TO_CONFIRM, data);
  };
  
  Input.prototype.setupStepNavi_ = function() {
    var $stepNavi = $('.header-area').find('.wap-stepNavi');
    $stepNavi.stepNavi({});
    $stepNavi.removeClass('hidden');
  };
  
}(jQuery));