(function($){
  
  PortalContents1 = function(){
    this.$element_;
    this.events_ = [];
  };
  
  PortalContents1.EventType = {
    SOME_EVENT : 'some-event'
  };
  
  PortalContents1.prototype.getElement = function() {
    return this.$element_;
  };

  PortalContents1.prototype.enterDocument = function() {
    this.$element_ = $('.contents-root');
    this.bindEvents_();
    
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.on.apply(this.$element_, args);
      }.bind(this));
    }
  };
  
  PortalContents1.prototype.exitDocument = function() {
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
  
  PortalContents1.prototype.on = function() {
    eventtype = arguments[0];
    listener = arguments[1];
    if (this.$element_) {
      this.$element_.on(eventtype, listener);
    } else {
      this.events_.push(arguments);
    }
  };
  
  PortalContents1.prototype.bindEvents_ = function() {
    
  };
  
  PortalContents1.prototype.unbindEvents_ = function() {
    
  };
  
}(jQuery));