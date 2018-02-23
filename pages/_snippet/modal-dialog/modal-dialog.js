(function($){
  
  ModalDialog = function($element){
    this.$element_;
    this.htmlPath_;
    this.jsonPath_;
    this.size_ = ModalDialog.Size.MIDDLE;
    this.events_ = [];
  };
  
  ModalDialog.EventType = {
    SUBMIT:'submit'
  };
  
  ModalDialog.Size = {
    SMALL:'dialog-size-small',
    MIDDLE:'dialog-size-middle',
    LARGE:'dialog-size-large',
    XLARGE:'dialog-size-xlarge'
  };
  
  ModalDialog.prototype.createElement_ = function(){
    var $element = $('<div class="modal fade modal-dialog-base">'
        + '<div class="modal-dialog dialog-size">'
        + '<div class="modal-content"></div>'
        + '</div></div></div>');
    $('body').append($element);
    return $element;
  };
  
  ModalDialog.prototype.htmlPath = function(htmlPath) {
    this.htmlPath_ = htmlPath;
    return this;
  };

  ModalDialog.prototype.jsonPath = function(jsonPath) {
    this.jsonPath_ = jsonPath;
    return this;
  };

  /**
   * @param {ModalDialog.Size} size
   * @returns {ModalDialog}
   */
  ModalDialog.prototype.size = function(size) {
    this.size_ = size;
    return this;
  };
  
  ModalDialog.prototype.getElement = function() {
    return this.$element_;
  };
  
  ModalDialog.prototype.unbindEvents_ = function() {
    this.$element_.off();
  };
  
  ModalDialog.prototype.removeElement_ = function() {
    this.$element_.remove();
  };  
  
  ModalDialog.prototype.on = function() {
    eventtype = arguments[0];
    listener = arguments[1];
    if (this.$element_) {
      this.$element_.on(eventtype, listener);
    } else {
      this.events_.push(arguments);
    }
  };
  
  ModalDialog.prototype.build = function() {
    if (!this.htmlPath_) {
      throw '[ModalDialogBuildException] Html should be configured. call #htmlPath before #build.';
    }
    var defer = $.Deferred();
    var htmlPromise = ResourceLoader.loadHtml(this.htmlPath_);
    var jsonPromise = ResourceLoader.loadJson(this.jsonPath_);
    $.when(htmlPromise,jsonPromise).then(function(html,json) {
      $template = $(Hogan.compile(html).render(json)).find('.dialog-contents-top');
      this.show($template.html())
      defer.resolve(this);
    }.bind(this));
    return defer.promise();
  };
  
  ModalDialog.prototype.show = function(content) {
    this.$element_ = this.createElement_();
    this.$element_.find('.dialog-size').addClass(this.size_);
    this.$element_.modal('show');
    this.$element_.find('.modal-content').html(content);
    this.bindEvents_();
    
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.on.apply(this.$element_, args);
      }.bind(this));
    }
  };
  
  ModalDialog.prototype.hide = function() {
    this.unbindEvents_();
    this.$element_.modal('hide'); 
    if (this.events_.length > 0) {
      $.each(this.events_, function(idx, args) {
        this.$element_.off.apply(this.$element_, args);
      }.bind(this));
      this.events_ = [];
    }
    setTimeout(function(){
      this.removeElement_();
    }.bind(this),300);
  };
  
  ModalDialog.prototype.bindEvents_ = function() {
    this.$element_.on('hidden.bs.modal', this.$element_, this.hide.bind(this));
    this.$element_.on('click', '#submit', this.onClickSubmitBtn_.bind(this));
  };

  
  ModalDialog.prototype.onClickSubmitBtn_ = function() {
    this.$element_.trigger(ModalDialog.EventType.SUBMIT);
    this.hide();
  };
  
  
}(jQuery));
