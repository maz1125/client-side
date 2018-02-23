(function($){
  
  /**
   * 
   * @param {!string} suggestJsonPath
   * @param {?number} opt_suggestionLength
   * @param {?string} opt_globalSearchSelector
   * @returns
   */
  GlobalSearch = function(suggestJsonPath, opt_suggestionLength, opt_globalSearchSelector){
    ResourceLoader.loadJson(suggestJsonPath).then(function(json){
      if (!json['dictionary']) {
        console.error('json does not have "dictionary" property.');
        return;
      }
      if (!json['searchResult']) {
        console.error('json does not have "searchResult" property.');
        return;
      }
      this.parse_(json);
    }.bind(this));
    
    this.suggestionLength_ = opt_suggestionLength || 8;
    this.selector_ = opt_globalSearchSelector || '.global-search';
    this.listenEvent_();
  };
  
  GlobalSearch.EventType = {
    CHANGE_SEARCH_RESULT: 'global-search:change-search-result',
    SEARCH_UNMATCH_WORD: 'global-search:search-unmatch-word'
  };

  GlobalSearch.prototype.originalInput_ = '';
  GlobalSearch.prototype.selector_ = '';
  GlobalSearch.prototype.predictions_ = [];
  GlobalSearch.prototype.searchResults_ = [];
  
  GlobalSearch.prototype.getEventTarget = function() {
    return $(document.body);
  };

  GlobalSearch.prototype.changeSearchResult = function(htmlPath, opt_jsonPath) {
    var arg = {};
    arg.htmlPath = htmlPath;
    arg.jsonPath = opt_jsonPath;
    return this.changeResult_(arg);
  };

  GlobalSearch.prototype.parse_ = function(json) {
    $.each(json['dictionary'], function(idx, obj) {
      var key = obj['word'];
      var value = obj['input'];
      this.predictions_.push({'applied':key, "prediction":key});
      $.each(value, function(i, v) {
        this.predictions_.push({'applied':v, "prediction":key});
      }.bind(this));
    }.bind(this));
    $.each(json['searchResult'], function(idx, obj) {
      obj['text'] = this.normalizeSpace_(obj['text']);
      this.searchResults_.push(obj);
    }.bind(this));
  };

  GlobalSearch.prototype.listenEvent_ = function() {
    var $eventTarget = this.getEventTarget();
    $eventTarget.on('input', '.search-input', this.onTypeAhead_.bind(this));
    $eventTarget.on('focus', '.search-input', this.onFocus_.bind(this));
    $eventTarget.on('keydown', '.search-input', this.onKeydown_.bind(this));
    $eventTarget.on('mousemove', '.global-suggestion-item', this.onMousemove_.bind(this));
    $eventTarget.on('click', '.back-btn', this.onClickBackBtn_.bind(this));
    $eventTarget.on('click', '.global-suggestion-item', this.onClickSuggest_.bind(this));
    $eventTarget.on('click', this.onClickBody_.bind(this));
  };
  
  GlobalSearch.prototype.onFocus_ = function(e) {
    AnimationFunction.fadeout($('.title-area'));
    var $bodyArea = $('.body-area');
    if ($('.global-search-result-screen').length > 0) {
      var inputting = $(this.selector_).find('.search-input').val();
      this.suggest_(inputting);
      return;
    }
    $(this.selector_).find('.back-btn').addClass('active');
    var $searchResultArea = $('<div class="global-search-result-screen"><div class="margin-adjuster"></div><div class="search-result"></div></div>');
    AnimationFunction.fadeout($bodyArea).then(function($elm) {
      $elm.hide();
      $elm.after($searchResultArea);
      AnimationFunction.fadein($searchResultArea);
    });
  };
  
  GlobalSearch.prototype.onClickBackBtn_ = function(e) {
    AnimationFunction.fadein($('.title-area'));
    var $searchResultArea = $('.global-search-result-screen');
    var $bodyArea = $('.body-area');
    $bodyArea.show();
    this.disposeSuggest_();
    $(this.selector_).find('.search-input').val('');
    AnimationFunction.fadeout($searchResultArea).then(function($elm) {
      $elm.after($bodyArea);
      $elm.remove();
      AnimationFunction.fadein($bodyArea);
    });
    $(this.selector_).find('.back-btn').removeClass('active');
  };
  
  GlobalSearch.prototype.onClickSuggest_ = function(e) {
    var $target = $(e.currentTarget);
    var text = $target.text();
    $(this.selector_).find('.search-input').val(text);
    this.originalInput_ = text;
    
    var searchResult = this.findSearchResultData_(text);
    this.changeResult_(searchResult);
    this.disposeSuggest_();
  };
  
  GlobalSearch.prototype.onClickBody_ = function(e) {
    var $target = $(e.target);
    if ($target.hasClass('search-input')) {
      return;
    }
    if ($target.hasClass('back-btn')) {
      return;
    }
    if ($target.hasClass('global-suggestion-item')) {
      return;
    }
    this.disposeSuggest_();
  };
  
  GlobalSearch.prototype.onKeydown_ = function(e) {
    var adj;
    switch(e.key) {
    case 'ArrowUp':
      adj = -1;
      break;
    case 'ArrowDown':
      adj = 1;
      break;
    case 'Enter':
      this.fix_();
      return;
    default:
      return;
    }
    var $element = $(this.selector_);
    var $items = $element.find('.global-suggestion-item');
    var $selecting = $element.find('.selecting');
    var currentIndex;
    if ($selecting.length === 0) {
      currentIndex = -1;
    } else {
      currentIndex = Number($selecting.attr('data-index'));
    }
    var index = currentIndex + adj;
    this.moveSelecting_(index, $items);
    
    var $movedSelecting = $element.find('.selecting');
    var searchResult = this.findSearchResultData_($movedSelecting.text());
    this.changeResult_(searchResult);

    e.preventDefault();
    e.stopPropagation();
  };
  
  GlobalSearch.prototype.onMousemove_ = function(e) {
    var $target = $(e.currentTarget);
    if ($target.hasClass('selecting')) {
      return;
    }
    var $items = $(this.selector_).find('.global-suggestion-item');
    $items.removeClass('selecting');
    $target.addClass('selecting');
  };
  
  GlobalSearch.prototype.onTypeAhead_ = function(e) {
    var inputting = $(e.target).val();
    this.originalInput_ = inputting;
    if (this.normalizeSpace_(inputting).split(' ').length === 1) {
      this.suggest_(inputting);
    } else {
      this.chainSuggest_(inputting);
    }
  };
  
  GlobalSearch.prototype.suggest_ = function(src) {
    if (!src) {
      this.disposeSuggest_();
      return;
    }

    var predictWords = this.searchPredictions_(src);
    this.updateSuggestions_(predictWords);
  };
  
  GlobalSearch.prototype.searchPredictions_ = function(src) {
    var predictWords = [];
    $.each(this.predictions_, function(idx, value) {
      if (value['applied'].indexOf(src) !== 0) {
        return;
      }
      if (predictWords.indexOf(value['prediction']) >= 0) {
        return;
      }
      predictWords.push(value['prediction']);
    });
    return predictWords;
  };
  
  GlobalSearch.prototype.chainSuggest_ = function(inputting) {
    var normalizedInputting = this.normalizeSpace_(inputting);
    var lastIndex = normalizedInputting.lastIndexOf(' ');
    var src = inputting.substring(lastIndex+1, inputting.length);
    
    var fixedInputting = normalizedInputting.substring(0, lastIndex);
    var predictContexts = [];
    if (src.length === 0) {
      $.each(this.searchResults_, function(i, searchResult) {
        var normalizedSearchResultText = this.normalizeSpace_(searchResult['text']);
        if (normalizedSearchResultText.indexOf(fixedInputting) !== 0) {
          return;
        }
        if (normalizedInputting.split(' ').length !== normalizedSearchResultText.split(' ').length) {
          return;
        }
        predictContexts.push(normalizedSearchResultText);
      }.bind(this));
    } else {
      var predictWords = this.searchPredictions_(src);
      $.each(predictWords, function(i, word) {
        predictContexts.push(fixedInputting + ' ' + word);
      });
    }
    this.updateSuggestions_(predictContexts);
  };
  
  GlobalSearch.prototype.updateSuggestions_ = function(predictWords) {
    if (predictWords.length === 0) {
      this.disposeSuggest_();
    } else {
      this.renderSuggest_(predictWords);
    }
  };

  GlobalSearch.prototype.changeResult_ = function(searchResult) {
    var $defer = $.Deferred();
    var htmlPromise = ResourceLoader.loadHtml(searchResult['htmlPath']);
    var jsonPromise = ResourceLoader.loadJson(searchResult['jsonPath']);
    $.when(htmlPromise, jsonPromise).then(function(html, json) {
      var bindedHtml = Hogan.compile(html).render(json);
      var $from = $('.global-search-result-screen .search-result');
      var $to = $('<div>'+bindedHtml+'</div>').find('.search-result');
      if ($to.length <= 0) {
        throw 'search result fragment should contain "search-result" class.';
      }
      AnimationFunction.replaceWithFade($from, $to).then(function() {
        this.getEventTarget().trigger(GlobalSearch.EventType.CHANGE_SEARCH_RESULT, searchResult);
        $defer.resolve();
      }.bind(this));
    }.bind(this))
    return $defer.promise();
  };
  
  GlobalSearch.prototype.findSearchResultData_ = function(searchtext) {
    var result = null;
    $.each(this.searchResults_, function(i, r) {
      if (searchtext === r['text']) {
        result = r;
      }
    }.bind(this));
    return result;
  };
  
  GlobalSearch.prototype.moveSelecting_ = function(index, opt_items) {
    var $input = $(this.selector_).find('.search-input');
    var $items = opt_items || $input.parent().find('.global-suggestion-item');
    $items.removeClass('selecting');
    if (index < -1) {
      index = index + $items.length + 1;
    } else if (index >= $items.length) {
      index = index - $items.length - 1;
    }
    if (index === -1) {
      $input.val(this.originalInput_);
    } else {
      $.each($items, function(i, item) {
        var $item = $(item);
        var dataIdx = Number($item.attr('data-index'));
        if (index === dataIdx) {
          $item.addClass('selecting');
          $input.val($item.text());
        }
      });
    }
  };
  
  GlobalSearch.prototype.fix_ = function() {
    var $input = $(this.selector_).find('.search-input');
    this.originalInput_ = $input.val();
    if (!this.originalInput_) {
      return;
    }
    $input.blur();
    if (this.isOpenSuggestions()) {
      this.disposeSuggest_();
    } else {
      this.getEventTarget().trigger(GlobalSearch.EventType.SEARCH_UNMATCH_WORD, this.originalInput_);
    }
  };
  
  GlobalSearch.prototype.renderSuggest_ = function(predictWords) {
    var $inputArea = $(this.selector_).find('.search-input-area');
    var $suggestionBox = $inputArea.find('.global-suggestion-box');
    var predictionsHtml = '<ul class="global-suggestions">';
    $.each(predictWords, function(idx, word){
      if (idx > this.suggestionLength_ - 1) {
        return;
      }
      predictionsHtml += '<li class="global-suggestion-item" data-index="'+idx+'">'+word+'</li>';
    }.bind(this));
    predictionsHtml += '</ul>';
    if ($suggestionBox.length === 0) {
      $inputArea.append(this.createSuggestionDom_(predictionsHtml));
    } else {
      this.disposeSuggest_($inputArea);
      $suggestionBox.append(predictionsHtml);
    }
    
    var margin = Math.max(0, ((predictWords.length * 36) - 12));
    $('.global-search-result-screen').find('.margin-adjuster').css('margin', margin+'px');
  };
  
  GlobalSearch.prototype.disposeSuggest_ = function(opt_element) {
    var $inputArea = opt_element || $(this.selector_).find('.search-input-area');
    var $suggestionBox = $inputArea.find('.global-suggestion-box');
    if (this.isOpenSuggestions($inputArea)) {
      $suggestionBox.children().remove();
    }
    $('.global-search-result-screen').find('.margin-adjuster').css('margin', '0');
  };
  
  GlobalSearch.prototype.isOpenSuggestions = function(opt_element) {
    var $inputArea = opt_element || $(this.selector_).find('.search-input-area');
    var $suggestionBox = $inputArea.find('.global-suggestion-box');
    return $suggestionBox.children().length > 0;
  };
  
  GlobalSearch.prototype.createSuggestionDom_ = function(predictionsHtml) {
    return '<div class="global-suggestion-box">'+predictionsHtml+'</div>';
  };
  
  GlobalSearch.prototype.normalizeSpace_ = function(str) {
    return str.replace(/　/g, ' ');
  };
}(jQuery));