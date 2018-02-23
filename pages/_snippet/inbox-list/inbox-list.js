(function($){

  InboxList = function(opt_isExpandMode, opt_scrollContainerSelector){
    this.$element_;
    this.isExpandDetailType_ = !!opt_isExpandMode;
    this.scrollContainerSelector_ = opt_scrollContainerSelector || '.main-contents';
  };
  
  InboxList.EventType = {
    ROW_SELECTED : 'row-selected'
  };
  
  /**
   * @param opt_parentSelector
   */
  InboxList.prototype.enterDocument = function(opt_parentSelector) {
    this.$element_ = $(opt_parentSelector || 'body').find('.inbox-list');
    if (this.isExpandDetailType_) {
      InboxBehavior.attachFixHeader(this.$element_.parents(this.scrollContainerSelector_), $('.header-area'));
    }
    this.bindEvents_();
  };
  
  InboxList.prototype.exitDocument = function() {
    this.unbindEvents_();
  };
  
  InboxList.prototype.getEventTarget = function() {
    if (!this.$element_) {
      throw 'call after InboxList#enterDocument.';
    }
    return this.$element_;
  };
  
  InboxList.prototype.bindEvents_ = function() {
    this.$element_.on('click', '.inbox-list-content-list-row', this.onClickRow_.bind(this));
  };
  
  InboxList.prototype.unbindEvents_ = function() {
    this.$element_.off();
  };

  InboxList.prototype.onClickRow_ = function(e) {
    var $target = $(e.target);
    if ($target.hasClass('action-icons-column') || $target.parents('.action-icons-column').length > 0) {
      this.onClickActionBtn_(e);
    } else if (this.isExpandDetailType_) {
      this.openDetail_($(e.currentTarget));
    } else {
      var data = {};
      data.originalEvent = e;
      data.id = $target.attr('data-val');
      this.$element_.trigger(InboxList.EventType.ROW_SELECTED, data);
    }
  };
  
  InboxList.prototype.isOpenedDetail_ = function() {
    return this.$element_.find('.inbox-detail').size() > 0;
  };

  InboxList.prototype.onClickDetailTitle_ = function(e) {
    this.closeDetail_();
  };
  
  InboxList.prototype.openDetail_ = function($target) {
    var url = $target.attr('data-url');
    var closePromise = this.isOpenedDetail_() ? this.closeDetail_(false) : $.Deferred().resolve().promise();
    closePromise.then(function() {
      return $.when(ResourceLoader.loadHtml(url), $.Deferred().resolve($target).promise())
    }).then(this.showDetailInner_.bind(this));
  };
  
  InboxList.prototype.showDetailInner_ = function(html, $target) {
    this.$element_.find('.after-detail-part').append($target.nextAll());
    $target.addClass('inbox-detail-source');
    $target.hide();
    this.$element_.find('.before-detail-part').after(html);

    var $inboxDetail = this.$element_.find('.inbox-detail');
    InboxBehavior.openDetail($inboxDetail);
    $inboxDetail.on('click', '.inbox-detail-title', this.onClickDetailTitle_.bind(this));
  };
  
  InboxList.prototype.closeDetail_ = function(withAnimation) {
    var $detail = this.$element_.find('.inbox-detail');
    var promise = InboxBehavior.closeDetail($detail, withAnimation === false ? false : true);
    return promise.then(function() {
      var $source = this.$element_.find('.inbox-detail-source');
      $source.after(this.$element_.find('.after-detail-part').children());
      $source.removeClass('inbox-detail-source');
      $source.show();
    }.bind(this));
  };

  InboxList.prototype.onClickActionBtn_ = function(e) {
    var actionTop = $(e.currentTarget).offset().top + 39;
    var $actionMenu = this.$element_.find('.action-menu');
    var $row = $(e.currentTarget).closest('.inbox-list-content-list-row');
    this.toggleActionMenu_($actionMenu, $row);
    $($actionMenu).css('top', actionTop + 'px');
  };
  
  InboxList.prototype.toggleActionMenu_ = function($actionMenu, $row){
    if ($actionMenu.is(':visible')) {
      $actionMenu.hide();
      $row.removeClass('active');
    } else {
      $actionMenu.show();
      $row.addClass('active');
    }
  };

}(jQuery));