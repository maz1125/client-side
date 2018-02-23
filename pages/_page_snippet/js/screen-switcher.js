(function($){
  
  ScreenSwitcher = function(inst) {
    inst = inst || {};
    this.sideMenu_ = inst['SideMenu'] || !!window.SideMenu ? new SideMenu() : null;
    this.contents_ = inst['PortalContents1'] || !!window.PortalContents1 ? new PortalContents1() : null;
    this.input_ = inst['Input'] || !!window.Input ? new Input() : null;
    this.confirm_ = inst['Confirm'] || !!window.Confirm ? new Confirm() : null;
    this.finish_ = inst['Finish'] || !!window.Finish ? new Finish() : null;
  };
  
  ScreenSwitcher.prototype.currentInstance_ = null;
  
  ScreenSwitcher.prototype.enter_ = function(instance) {
    if (!!instance.enterDocument) {
      instance.enterDocument();
      this.currentInstance_ = instance;
    }
  };
  
  ScreenSwitcher.prototype.exit_ = function() {
    if (!!this.currentInstance_) {
      this.currentInstance_.exitDocument();
    }
  };

  ScreenSwitcher.prototype.pageChange_ = function(url, toSelector, fromSelector, opt_noAnimation, opt_jsonPath, opt_animationFunc) {
    var defer = $.Deferred();
    if (!url) {
      return defer.resolve().promise();
    }
    if ($(toSelector).length > 0) {
      return defer.resolve().promise();
    }
    $.when(ResourceLoader.loadHtml(url), ResourceLoader.loadJson(opt_jsonPath)).then(function(html, json) {
      var $from = $($(fromSelector).children()[0]);
      var $to = $('<div>' + Hogan.compile(html).render(json) + '</div>').find(toSelector);
      if (opt_noAnimation) {
        $from.parent().html($to);
        defer.resolve();
      } else if (opt_animationFunc) {
        var d = opt_animationFunc($from, $to);
        if (d && d.then) {
          d.then(function() {
            defer.resolve();
          });
        } else {
          defer.resolve();
        }
      } else {
        AnimationFunction.replaceWithFade($from, $to).then(function(){
          defer.resolve();
        });
      }
    });
    return defer.promise();
  };
  
  ScreenSwitcher.prototype.headerChange_ = function(id, opt_json) {
    var defer = $.Deferred();
    ResourceLoader.loadHtml('template/headers.html').then(function(html) {
      var $newHd = $(html).find('#'+id);
      var $headerArea = $('.header-area');
      AnimationFunction.fadeout($headerArea).then(function() {
        var html = opt_json ? Hogan.compile($newHd.html()).render(opt_json) : $newHd.html();
        $headerArea.html(html);
        AnimationFunction.fadein($headerArea);
        defer.resolve();
      });
    });
    return defer.promise();
  };
  
  ScreenSwitcher.prototype.portalContents1 = function(opt_anim) {
    var noAnimation = opt_anim === false;
    var defer = $.Deferred();
    var headerPromise = this.headerChange_('default-header');
    var pagePromise = this.pageChange_('template/portal-contents1.html', '.portal-contents1-root', '.main-content-area', noAnimation, 'json/contents.json', opt_anim)
    $.when(headerPromise, pagePromise).then(function() {
      $('.main-content-area').removeClass('full-screen');
      this.exit_();
      this.enter_(this.contents_);
      this.contents_.on(PortalContents1.EventType.SOME_EVENT, this.onSomeEvent_.bind(this));
      defer.resolve();
    }.bind(this));
    return defer.promise();
  };
  
  ScreenSwitcher.prototype.onSomeEvent_ = function(e) {
    // do something
  };
  
  ScreenSwitcher.prototype.input = function(opt_anim) {
    var noAnimation = opt_anim === false;
    var defer = $.Deferred();
    var headerPromise = this.headerChange_('input-header');
    var pagePromise = this.pageChange_('template/input.html', '.input-root', '.main-content-area', noAnimation, 'json/input.json', opt_anim);
    $.when(headerPromise, pagePromise).then(function() {
      $('.main-content-area').addClass('full-screen');
      this.exit_();
      this.enter_(this.input_);
      this.input_.on(Input.EventType.GO_TO_CONFIRM, this.onGoToConfirm_.bind(this));
      defer.resolve();
    }.bind(this));
    return defer.promise();
  };
  
  ScreenSwitcher.prototype.onGoToConfirm_ = function(e, data) {
    this.confirm(data.element);
  };
  
  ScreenSwitcher.prototype.confirm = function(element) {
    var defer = $.Deferred();
    var $element = $(element);
    AnimationFunction.fadeout($element).then(function() {
      this.exit_();
      this.enter_(this.confirm_);
      this.confirm_.on(Confirm.EventType.GO_TO_FINISH, this.onGoToFinish_.bind(this));
      
      AnimationFunction.fadein($element).then(function() {
        defer.resolve();
      });
    }.bind(this));
    
    return defer.promise();
  };
  
  ScreenSwitcher.prototype.onGoToFinish_ = function(e) {
    this.finish();
  };
  
  ScreenSwitcher.prototype.finish = function() {
    var defer = $.Deferred();
    this.pageChange_('template/finish.html', '.finish-root', '.main-content-area').then(function() {
      $('.main-content-area').addClass('full-screen');
      this.exit_();
      this.enter_(this.finish_);
      defer.resolve();
    }.bind(this));
    return defer.promise();
  };
  
}(jQuery));