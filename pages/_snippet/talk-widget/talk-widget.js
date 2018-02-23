(function($) {

  TalkWidget = function(opt_numOfRoom){
    this.$element_;
    this.listeners_;
    this.numOfRoom_ = opt_numOfRoom;
    
    this.readTimingMinSec_;
    this.readTimingMaxSec_;
  };

  TalkWidget.CSS_CLASS = 'talk-widget';

  TalkWidget.prototype.render = function($container, dataPath) {
    ResourceLoader.loadJson(dataPath).then(function(data) {
      this.$element_ = $(this.createDom_(this.complete_(data)));
      $container.append(this.$element_);

      this.bindEvents_();

      this.listeners_ = data.listeners || [];
      this.numOfRoom_ = this.numOfRoom_ || data.numOfRoom || 2;
      this.readTimingMinSec_ = data.readTimingMinSec || 5;
      this.readTimingMaxSec_ = data.readTimingMaxSec || this.readTimingMinSec_;

      setTimeout(function() {
        this.$element_.removeClass('opacity0');
      }.bind(this));

      this.tryFireListener_();
    }.bind(this));
  };
  
  TalkWidget.prototype.createDom_ = function(data) {
    data.isEmpty = !data.talks || data.talks.length === 0;
    var html = '<div class="' + TalkWidget.CSS_CLASS + ' opacity0">';
    html += '<div class="talk-widget-conversation">' + TalkWidget.TALKS_TEMPLATE_HTML_; 
    html += '{{#isEmpty}}<div class="talk-empty-pict"><i class="wap-icon-comment icon-size-64"></i><span class="font-size-ll">コメントはまだありません</span></div>';
    html += '<div class="read-count invisible text-light"><span class="read-count-num">0</span><span>人が既読</span></div>{{/isEmpty}}';
    html += '{{^isEmpty}}<div class="read-count invisible text-light"><span class="read-count-num">{{talks.length}}</span><span>人が既読</span></div>{{/isEmpty}}';
    html += '</div>';
    html += '<div class="talk-widget-input"><i class="wap-icon-add icon-size-24 text-light"></i><i class="wap-icon-face-thanks icon-size-24 text-light"></i>';
    html += '<input class="talk-inputbox" placeholder="コメントを記入"><button class="btn btn-primary send-btn disabled">送信</button></div>';
    html += '</div>';
    return Hogan.compile(html).render(data);
  };

  TalkWidget.prototype.dispose = function() {
    this.unbindEvents_();
    if (!!this.$element_) {
      this.$element_.remove();
    }
  };

  TalkWidget.prototype.bindEvents_ = function() {
    this.$element_.on('click', '.send-btn', this.onClickSend_.bind(this));
    this.$element_.on('keydown', '.talk-inputbox', this.onKeydown_.bind(this));
    this.$element_.on('keyup', '.talk-inputbox', this.onKeyup_.bind(this));
  };

  TalkWidget.prototype.unbindEvents_ = function() {
    if (!!this.$element_) {
      this.$element_.off();
    }
  };
  
  TalkWidget.prototype.onClickSend_ = function(e) {
    this.send_();
  };
  
  TalkWidget.prototype.onKeydown_ = function(e) {
    switch(e.key) {
    case 'Enter':
      this.send_();
      break;
    default:
      break;
    }
  };
  
  TalkWidget.prototype.onKeyup_ = function(e) {
    var $sendBtn = this.$element_.find('.send-btn');
    if (!!$(e.currentTarget).val()) {
      $sendBtn.removeClass('disabled');
    } else {
      $sendBtn.addClass('disabled');
    }
  };
  
  TalkWidget.prototype.complete_ = function(data) {
    var dow = ['日','月','火','水','木','金','土'];
    $.each(data.talks || [], function(idx, d) {
      var date = new Date(d.date);
      d.dateCaption = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日(' + dow[date.getDay()] + ')';
    });
    return data;
  };
  
  TalkWidget.prototype.send_ = function() {
    var $input = this.$element_.find('.talk-inputbox');
    var comment = $input.val();
    if (!comment) {
      return;
    }
    $input.val('');
    this.appendComment_(comment);
  };
  
  TalkWidget.prototype.appendComment_ = function(comment, opt_username, opt_userimg) {
    var $conversation = this.$element_.find('.talk-widget-conversation');
    var dt = new Date();
    var date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    var content = {
      'isMe': !opt_username,
      'name': opt_username,
      'img': opt_userimg,
      'comment': comment,
      'time': dt.getHours() + ':' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes()
    };
    var todayTalk = this.searchTodayTalk_(date, $conversation);
    if (!!todayTalk) {
      var talkHtml = Hogan.compile(TalkWidget.CONTENT_TEMPLATE_HTML_).render(content);
      $(todayTalk).append(talkHtml);
    } else {
      var datum = {
        'talks': [{
          'date': date,
          'contents': [content]
        }]
      };
      var conversationHtml = Hogan.compile(TalkWidget.TALKS_TEMPLATE_HTML_).render(this.complete_(datum));
      $conversation.append(conversationHtml);
    }
    $conversation.scrollTop($conversation.height())
    this.tryFireListener_();
    this.fireReadReservation_(!opt_username);
    
    this.$element_.find('.talk-empty-pict').remove();
  };
  
  TalkWidget.prototype.searchTodayTalk_ = function(date, $conversation) {
    var result = null;
    $.each($conversation.children(), function(idx, conv) {
      var d = $(conv).attr('data-date');
      if (d === date) {
        result = conv;
      }
    });
    return result;
  };
  
  TalkWidget.prototype.tryFireListener_ = function() {
    var talksize = $('.unit-talk').length;
    var idx = 0;
    while (idx < this.listeners_.length) {
      var listener = this.listeners_[idx];
      if (listener.triggerLength <= talksize) {
        this.listeners_.splice(idx, 1);
        this.firePostReservation_(listener.content, listener.delaySeconds);
      } else {
        idx++;
      }
    }
  };

  TalkWidget.prototype.firePostReservation_ = function(content, delaySeconds) {
    setTimeout(function(){
      this.appendComment_(content.comment, content.name, content.img);
    }.bind(this), delaySeconds * 1000);
  };

  TalkWidget.prototype.fireReadReservation_ = function(isMe) {
    var $read = this.$element_.find('.read-count');
    var $count = $read.find('.read-count-num');
    $read.removeClass('me other');
    $read.addClass(isMe ? 'me' : 'other');
    $read.addClass('invisible');
    $count.text('0');
    // 最下部に付け替え
    $('.talk-widget-conversation').append($read);
    
    var reserveCount = this.numOfRoom_ - 1;
    var talksize = $('.unit-talk').length;
    if (!isMe) {
      // 自分以外の投稿は、即時に自分の既読を1件プラス
      this.addReadCount_(talksize, 0);
      reserveCount--;
    }
    if (reserveCount >= 1) {
      // 最小値で登録
      this.addReadCount_(talksize, this.readTimingMinSec_);
      reserveCount--;
    }
    if (reserveCount >= 1) {
      // 最大値で登録
      this.addReadCount_(talksize, this.readTimingMaxSec_);
      reserveCount--;
    }
    // 残りをランダム
    while(reserveCount > 0) {
      var min = this.readTimingMinSec_;
      var max = this.readTimingMaxSec_;
      var sec = Math.floor( Math.random() * (max + 1 - min)) + min;
      this.addReadCount_(talksize, sec);
      reserveCount--;
    }
  };
  
  TalkWidget.prototype.addReadCount_ = function(previousTalkSize, delaySec) {
    if (previousTalkSize !== $('.unit-talk').length) {
      // トークが増えている場合は既読を増やさない
      return;
    }
    var $read = this.$element_.find('.read-count');
    var $count = $read.find('.read-count-num');
    setTimeout(function() {
      var currentCnt = Number($count.text()) || 0;
      $count.text(++currentCnt);
      $read.removeClass('invisible');
    }, delaySec * 1000);
  };
  
  TalkWidget.CONTENT_TEMPLATE_HTML_ = '{{#isMe}}' +
      '<div class="unit-talk me">' +
      '<div class="talk-right"><div class="talk-comment"><span>{{comment}}</span></div></div>' +
      '</div>' + 
      '{{/isMe}}' +
      '{{^isMe}}' +
      '<div class="unit-talk others"><img class="img-48 img-circle" src="{{img}}"></img>' +
      '<div class="talk-right"><div class="speaker font-size-s text-light">{{name}}</div><div class="talk-comment"><span>{{comment}}</span></div>' +
      '</div>' +
      '</div>' + 
      '{{/isMe}}';
  
  TalkWidget.TALKS_TEMPLATE_HTML_ = '{{#talks}}<div class="day-talks" data-date="{{date}}">' +
      '<div class="talk-date text-light">{{dateCaption}}</div>' +
      '{{#contents}}' + 
      TalkWidget.CONTENT_TEMPLATE_HTML_ +
      '{{/contents}}' +
      '</div>{{/talks}}';

}(jQuery));
