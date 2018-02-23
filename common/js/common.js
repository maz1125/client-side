var FRONTMOCK = FRONTMOCK || {};
// @i18n モック用多言語化関連機能
// @Ajax Ajax通信
// @Dom DOM操作/走査
// @Util 便利関数群
// @UserData ログインユーザー
// @Notification 通知
// @LocalStorage LocalStrage利用
// @QueryParam クエリパラメータ取得
// @GlobalNavigation グローバルナビ
// @Today モック用現在日付取得

(function($, win) {
  FRONTMOCK.i18n = (function() {
    // ----------------------------------------------------------------------
    // date format functions
    // ----------------------------------------------------------------------
    /**
     * Get month, date and dayofweek string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "MM月DD日 (WW曜日)" in "ja" or "WW. MM DD" in "en".
     * @author tsujii_n
     */
    var _getDateStrMDW = _dateFormatterMaker({
      'en' : 'ddd MMM d',
      'ja' : 'M月d日(ddd)'
    });

    /**
     * Get year, month, date, hour, minute and second string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "YYYY年MM月DD日 HH時MM分SS秒" in "ja" or "MM DD YYYY HH:MM:SS" in "en".
     * @author tsujii_n
     */
    var _getDateStrYMDHMS = _dateFormatterMaker({
      'en' : "MMM d yyyy HH:mm:ss",
      'ja' : "yyyy年M月d日 HH時mm分ss秒"
    });

    /**
     * Get year, month and date string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "YYYY年MM月DD日" in "ja" or "MM DD YYYY" in "en".
     * @author tsujii_n
     */
    var _getDateStrYMDW = _dateFormatterMaker({
      'en' : "ddd MMM d yyyy",
      'ja' : "yyyy年M月d日(ddd)"
    });

    /**
     * Get year, month, date and dayofweek string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "YYYY年MM月DD日" in "ja" or "MM DD YYYY" in "en".
     * @author tsujii_n
     */
    var _getDateStrYMD = _dateFormatterMaker({
      'en' : "MMM d yyyy",
      'ja' : "yyyy年M月d日"
    });

    /**
     * Get AM/PM, hour and minute string.
     * 
     * this methods requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "午前/午後 HH:mm" in "ja" or "HH:mm AM/PM" in "en".
     * @author tsujii_n
     */
    var _getTimeStrAPHM = _dateFormatterMaker({
      'en' : 'h:mmtt',
      'ja' : 'tth:mm'
    });

    /**
     * Get hour and minute period string.
     * 
     * This method requires globalize.min.js.
     * 
     * @param {Date} date
     * @returns {String} "HH時間mm分" in "ja" or "HH h mm m" in "en".
     * @author tsujii_n
     */
    var _getTimePeriodStrHM = _dateFormatterMaker({
      'en' : "H'h' m'm'",
      'ja' : "H時間m分"
    });

    /**
     * Get month, date, dayofweek, hour and minutes string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "MM月DD日 (WW曜日) HH:mm" in "ja" or "WW. MM DD HH:mm" in "en".
     * @author tsujii_n
     */
    var _getTimeStrMDWHM = _dateFormatterMaker({
      'en' : 'ddd MMM d h:mmtt',
      'ja' : 'M月d日(ddd) H:mm'
    });

    /**
     * Get hour, minute and second string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "HH時MM分SS秒" in "ja" or "HH:MM:SS" in "en".
     * @author tsujii_n
     */
    var _getTimeStrHMS = _dateFormatterMaker({
      'en' : "HH:mm:ss",
      'ja' : "HH時mm分ss秒"
    });

    /**
     * Get hour and minute string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "HH:MM" in all locale
     * @author tsujii_n
     */
    var _getTimeStrH_M = _dateFormatterMaker({
      'en' : "HH:mm",
      'ja' : "HH:mm"
    });

    /**
     * Get hour and minute string.
     * 
     * This method requires globalize.min.js
     * 
     * @param {Date} date
     * @returns "HH:MM:SS" in all locale
     * @author tsujii_n
     */
    var _getTimeStrH_M_S = _dateFormatterMaker({
      'en' : "HH:mm:ss",
      'ja' : "HH:mm:ss"
    });

    // ----------------------------------------------------------------------
    // variables
    // ----------------------------------------------------------------------
    var _currentLang;
    var cache = {};

    // ----------------------------------------------------------------------
    // public members
    // ----------------------------------------------------------------------
    return {
      getCurrentLang : _getCurrentLang,
      getResource : _getResource,
      getTranslatedFileURL : _getTranslatedFileURL,
      getDateStrMDW : _getDateStrMDW,
      getDateStrYMDHMS : _getDateStrYMDHMS,
      getDateStrYMDW : _getDateStrYMDW,
      getDateStrYMD : _getDateStrYMD,
      getTimeStrAPHM : _getTimeStrAPHM,
      getTimePeriodStrHM : _getTimePeriodStrHM,
      getTimeStrMDWHM : _getTimeStrMDWHM,
      getTimeStrHMS : _getTimeStrHMS,
      getTimeStrH_M : _getTimeStrH_M,
      getTimeStrH_M_S : _getTimeStrH_M_S
    };

    function _getCurrentLang() {
      if (!_currentLang) {
        _currentLang = FRONTMOCK.Cookie.getCookies()['language'] || 'en';
      }
      return _currentLang;
    }

    /**
     * get resource of current langage. TODO cache on localStorage?
     * 
     * @param {String} resourceCode
     * @return {String}
     */
    function _getResource(resourceCode) {
      if (!resourceCode) {
        console.error(resourceCode + '');
      }
      if (!cache[_getCurrentLang()]) {
        var resourcePath = document.location.href.substr(0, document.location.href.lastIndexOf('/'))
            + '/localized/'
            + _getCurrentLang()
            + '.runtime.json';
        FRONTMOCK.Ajax.getJson(resourcePath, function(data) {
          cache[_getCurrentLang()] = data;
        });
        if (!cache[_getCurrentLang()]) {
          console
              .error('エラーが起きたかと思います。すみませんが、i18n.runtime.jsonは言語別のファイルにしてlocalizeフォルダ以下に配置してください(例：localize/en.runtime.json)。不明点があれば佐藤までお願いします。');
          console
              .error('i18n.runtime.json is deprecated. place runtime resources on localize folder (e.g. localize/en.runtime.json)');
          var resourcePath = document.location.href.substr(0, document.location.href.lastIndexOf('/'))
              + '/i18n.runtime.json';
          FRONTMOCK.Ajax.getJson(resourcePath, function(data) {
            cache[_getCurrentLang()] = data;
          });
        }
      }
      return cache[_getCurrentLang()][resourceCode];
    }

    /** http://hoge/huga/abc.html -> http://hoge/huga/abc.en.html (based on currentLang) */
    function _getTranslatedFileURL() {
      console.log('YAGNI?? If you want to use this method, please ask sato_hi to implement it or DIY.');
    }

    /**
     * Date formatter function maker.
     * 
     * @param {Object} formatMap Map which hold 'lang' : 'formatStr'.
     * @returns {Function} Format function which takes 1 argument (date).
     * @private
     */
    function _dateFormatterMaker(formatMap) {
      return function(date) {
        var lang = _getCurrentLang(), //
        format = formatMap[lang]; //

        if (undefined === format) {
          return Globalize.format(date, formatMap['en']);
        }

        return Globalize.format(date, format, lang);
      };
    }

  })();

  FRONTMOCK.Cookie = (function() {
    return {
      getCookies : _getCookies
    };
    function _getCookies() {
      var result = new Array();

      var allcookies = document.cookie;
      if (allcookies != '') {
        var cookies = allcookies.split(';');

        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].split('=');

          // クッキーの名前をキーとして 配列に追加する
          result[cookie[0].replace(/ /g, "")] = decodeURIComponent(cookie[1]);
        }
      }

      return result;
    }
  })();

  // @Ajax
  FRONTMOCK.Ajax = (function() {
    return {
      getHtml : _getHtml,
      getJson : _getJson
    };

    /**
     * placeholderに指定した要素（#が必要）の内部を、urlで指定したコンテンツで上書きします
     * 
     * @param placeholder '#grid-main'
     * @param url 'blank-page.html'
     * @param callback
     * @param beforeShow
     */
    function _getHtml(placeholder, url, callback, beforeShow) {
      var where = $(placeholder);
      $.ajax({
        url : url,
        dataType : 'html',
        error : function() {
          alert("FRONTMOCK.Ajax.getHtml - An error occoured!");
        },
        success : function(response) {
          if (_isfunc(beforeShow)) {
            beforeShow();
          }
          where.html(response);
          if (_isfunc(callback)) {
            callback();
          }
        }
      });
    }

    /**
     * urlで指定したデータをjson形式で返します
     * 
     * @param url 'COM_ICONID=CFM.CO.…&cont_kind=Co…&action_id=50&…'
     * @param callback
     * @param isAsync
     */
    function _getJson(url, callback, isAsync) {
      // var where = $( placeholder);
      isAsync = !!isAsync;
      $.ajax({
        url : url,
        dataType : 'json',
        error : function(jqXHR, textStatus, errorThrown) {
          alert("FRONTMOCK.Ajax.getJson - An error occoured!");
          console.log(errorThrown);
        },
        success : function(response) {
          if (_isfunc(callback)) {
            callback(response);
          }
          return response;
        },
        async : isAsync
      });
    }

    function _isfunc(arg) {
      return arg && (typeof (arg) == "function");
    }

  })();
  // @Ajax end.

  // @Dom
  FRONTMOCK.Dom = (function() {
    return {
      getSelectorOfAttr : _getSelectorOfAttr,
    };
    // ------------------------------------------------------------------------
    // function definitions
    // ------------------------------------------------------------------------

    /**
     * Get selector string of attribute.
     * 
     * @param {String} attribute
     * @param {String} opt_value.
     * @returns {String}
     */
    function _getSelectorOfAttr(attribute, opt_value) {
      if (FRONTMOCK.Util.isDefAndNotNull(opt_value)) {
        return '[' + attribute + '="' + opt_value + '"]';
      } else {
        return '[' + attribute + ']';
      }
    }
  }());

  // @DOM end

  // @Util
  FRONTMOCK.Util = (function() {
    // ------------------------------------------------------------------------
    // constants
    // ------------------------------------------------------------------------
    var TYPE_ARRAY = 'array', //
    TYPE_OBJECT = 'object', //
    TYPE_NUMBER = 'number', //
    TYPE_STRING = 'string'; //

    // ------------------------------------------------------------------------
    // public functions
    // ------------------------------------------------------------------------
    return {
      getTodayStr : _getTodayStr,
      getNowTimeStr : _getNowTimeStr,
      getShortNowTimeStr : _getShortNowTimeStr,
      getShortDateTime : _getShortDateTime,
      setToasterRibbon : _setToasterRibbon,
      lotateIcon : _lotateIcon,
      setScrollTop : _setScrollTop,
      scrollTo : _scrollTo,
      deepCopy : _deepCopy,
      isArray : _isArray,
      isNumber : _isNumber,
      isObject : _isObject,
      isString : _isString,
      isDef : _isDef,
      isNull : _isNull,
      isDefAndNotNull : _isDefAndNotNull,
      isArrayLike : _isArrayLike,
      isArrayEquals : _isArrayEquals,
      isArraySameContents : _isArraySameContents
    };

    // ------------------------------------------------------------------------
    // function definitions
    // ------------------------------------------------------------------------
    /**
     * 本日の文字列を YYYY年MM月DD日 の形式で返します
     */
    function _getTodayStr() {

      var today = new Date();
      var y = today.getFullYear();
      var m = today.getMonth() + 1;
      var d = today.getDate();

      return y + "年" + m + "月" + d + "日";
    }

    /**
     * 現在時刻を HH時MM分SS秒 の形式で返します
     */
    function _getNowTimeStr() {

      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();
      var s = now.getSeconds();

      return h + "時" + m + "分" + s + "秒";
    }

    /**
     * 現在時刻を HH時MM分 の形式で返します
     */
    function _getShortNowTimeStr() {

      var now = new Date();
      var h = now.getHours();
      var m = now.getMinutes();

      return h + "時" + m + "分";
    }

    /**
     * 現在日時を mm/DD(DDD) HH:MM の形式で返します
     */
    function _getShortDateTime() {

      var now = new Date();
      var mm = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();
      var m = now.getMinutes();

      var week = now.getDay();
      var yobi = new Array("日", "月", "火", "水", "木", "金", "土");

      return mm + '/' + d + '(' + yobi[week] + ') ' + h + ':' + m;
    }
    /**
     * 画面内にクリック可能な帯状の通知を表示します
     * 
     * @param elem jQueryのセレクタで指定
     * @param message
     * @param type //normal success warning error
     * @param callback
     */
    function _setToasterRibbon(elem, message, type, callback) {
      var typeClass = '';
      switch (type) {
      case 'success':
      case 'warning':
      case 'error':
        typeClass = 'toast-ribbon toast-' + type;
        break;
      default:
        typeClass = 'toast-ribbon toast';
        break;
      }

      $(elem).addClass(typeClass).text(message);
      $(elem).slideDown(500).off('click').on('click', function() {
        $(elem).hide();
        if (callback)
          callback();
      });
    }

    /**
     * 指定のアイコンをゆらします
     * 
     * @param elem jQueryのセレクタで指定
     */
    function _lotateIcon(elem) {
      $(elem).addClass('anim-ring');
      setTimeout(function() {
        $(elem).removeClass('anim-ring');
      }, 15000);
    }

    /**
     * スクロールするとトップへ戻るボタンを表示します
     * 
     * 画面内に以下が必要 <div id="page-top"> <i class="wap-icon-arrow-up"></i> </div>
     * 
     * 2014/04/18 佐藤廣 何もしなければ勝手にこの機能が付くようにしました。@see effect-buttons.js ここのコードは互換性のため残します。
     * なお、idがpage-topの要素が画面に含まれている場合は古いコードとみなしてなにもしないように記述しています。
     */
    function _setScrollTop() {
      // スクロールトップ
      $(document).scroll(function() {
        var that = $(this);
        if (that.scrollTop() > that.height() / 4 || that.scrollTop() > 1000) {
          $('#page-top').fadeIn();
        } else {
          $('#page-top').fadeOut();
        }
      });
      $('#page-top').click(function goPageTop(e) {
        $('html,body').animate({
          scrollTop : 0
        }, 'fast');
      });
    }

    /**
     * Scroll to show specified element.
     * 
     * @param {jQuery} $element
     * @param {boolean} isTop If true scroll to element top forcely.
     * @param {Number|Object} opt_offset Scroll offset which will use to avoid scroll top is hidden by navbar. Object of
     *          {top: offsetTop, bottom: offsetBottom} or number (offsetTop).
     * @param {String|Number} opt_duration {'slow'|'normal'|'fast'|milliseconds}.
     * @param {String} opt_easing Easing name.
     * @author tsujii_n
     */
    function _scrollTo($element, isTop, opt_offset, opt_duration, opt_easing) {
      var scrollTop = -1, //
      offsetTop = 0, offsetBottom = 0;

      if (_isObject(opt_offset)) {
        offsetTop = opt_offset.top;
        offsetBottom = opt_offset.bottom;
      } else if (_isNumber(opt_offset)) {
        offsetTop = opt_offset;
      }

      if (isTop) {
        scrollTop = $element.offset().top - offsetTop;

      } else {
        var $win = $(win), //
        winScrollTop = $win.scrollTop(), //
        winHeight = $win.height(), //
        elementTop = $element.offset().top, //
        elementHeight = $element.height(), //
        elementTopHidden = winScrollTop + offsetTop - elementTop, //
        elementBottomHidden = (elementTop + elementHeight) - (winScrollTop + winHeight - offsetBottom); //

        if (elementTopHidden > 0 || winHeight - offsetTop < elementHeight) {
          // scroll to show top of element
          if (offsetTop > elementTop) {
            scrollTop = 0;
          } else {
            scrollTop = elementTop - offsetTop;
          }

        } else if (elementBottomHidden > 0) {
          // scroll to show bottom of element
          scrollTop = elementTop + elementHeight - winHeight + offsetBottom;
        }
      }

      if (-1 === scrollTop) {
        return;
      }

      $('html,body').animate({
        scrollTop : scrollTop
      }, opt_duration, opt_easing);
    }

    /**
     * Deep copy any object.
     * 
     * @param {any} val Value to copy.
     * @returns {any} Deep copied value.
     * @author tsujii_n
     */
    function _deepCopy(val) {
      return JSON.parse(JSON.stringify(val));
    }

    /**
     * (predicate) Check if value is array.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is array.
     * @author tsujii_n
     */
    function _isArray(value) {
      var type = typeof (value);
      return (TYPE_ARRAY === type);
    }

    /**
     * (predicate) Check if value is number.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is number.
     * @author tsujii_n
     */
    function _isNumber(value) {
      var type = typeof (value);
      return (TYPE_NUMBER === type);
    }

    /**
     * (predicate) Check if value is object.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is object.
     * @author tsujii_n
     */
    function _isObject(value) {
      var type = typeof (value);
      return (TYPE_OBJECT === type);
    }

    /**
     * (predicate) Check if value is string.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is string.
     * @author tsujii_n
     */
    function _isString(value) {
      var type = typeof (value);
      return (TYPE_STRING === type);
    }

    /**
     * (predicate) Check if value is defined.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is defined.
     * @author tsujii_n
     */
    function _isDef(value, undef) {
      var type = typeof (value), undefType = typeof (undef);

      return (type !== undefType);
    }

    /**
     * (predicate) Check if value is null.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is null.
     * @author tsujii_n
     */
    function _isNull(value) {
      return (null === value);
    }

    /**
     * (predicate) Check if value is defined and not null.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is defined and not null.
     * @author tsujii_n
     */
    function _isDefAndNotNull(value, undef) {
      return _isDef(value) && !_isNull(value);
    }

    /**
     * (predicate) Check if value is array or like array.
     * 
     * @param {Any} value
     * @returns {boolean} true if value is array or like array.
     * @author tsujii_n
     */
    function _isArrayLike(value) {
      var type = typeof (value);
      return (TYPE_ARRAY === type || (TYPE_OBJECT === type && TYPE_NUMBER === typeof (value.length)));
    }

    /**
     * (predicate) Check if arrays have same contents in same order.
     * 
     * @param {Any} value
     * @returns {boolean} true if arrays have same contents in same order.
     * @author tsujii_n
     */
    function _isArrayEquals(arr1, arr2) {
      var i;

      if (!_isArrayLike(arr1) || !_isArrayLike(arr2)) {
        return false;
      }

      if (arr1.length !== arr2.length) {
        return false;
      }

      for (i = 0; i < arr1.length; ++i) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      return true;
    }

    /**
     * (predicate) Check if arrays have same contents.
     * 
     * @param {Any} value
     * @returns {boolean} true if arrays have same content.
     * @author tsujii_n
     */
    function _isArraySameContents(arr1, arr2) {
      var i, tmpArr1, tmpArr2;

      if (!_isArrayLike(arr1) || !_isArrayLike(arr2)) {
        return false;
      }

      if (arr1.length !== arr2.length) {
        return false;
      }

      tmpArr1 = arr1.slice(0);
      tmpArr1.sort();
      tmpArr2 = arr2.slice(0);
      tmpArr2.sort();

      for (i = 0; i < tmpArr1.length; ++i) {
        if (tmpArr1[i] !== tmpArr2[i]) {
          return false;
        }
      }

      return true;
    }

  })();
  // @Util end.

  // @UserData
  FRONTMOCK.UserData = (function() {
    var DEFAULT = {
      "loginId" : "1000",
      "username" : "荻野 寿晴",
      "usernameEn" : "Toshiharu Ogino",
      "userIconImg" : "img02.jpg",
      "backgroundImgCss" : 'url("../login/img/07.jpg") 0% 80% / 100%',
      "section" : "人事本部グローバル人事推進課",
      "role" : ""
    };
    var _isInitDone = false;
    return {
      init : _initIfNecessary,
      set : _set,
      get : _get,
      getName : _getName,
      getIcon : _getIcon,
      getDefaultUserData : function() {
        return DEFAULT;
      }
    };

    function _initIfNecessary() {
      if (_isInitDone)
        return;
      var lsData = FRONTMOCK.LocalStorage.get('userdata');
      var ssData = FRONTMOCK.SessionStorage.get('userdata');
      if (!lsData) {
        FRONTMOCK.LocalStorage.put('userdata', DEFAULT);
        FRONTMOCK.SessionStorage.put('userdata', DEFAULT);
      } else if (!ssData) {
        FRONTMOCK.SessionStorage.put('userdata', lsData);
      }
      _isInitDone = true;
    }

    /**
     * ログインユーザー情報をセットします ※必要に応じて情報は増やしていってください
     * 
     * @data{} username, usericon
     */
    function _set(data) {
      FRONTMOCK.LocalStorage.put('userdata', data);
      FRONTMOCK.SessionStorage.put('userdata', data);
    }

    /**
     * 総合的なログインユーザ情報を返します。user-data.jsの該当ユーザのオブジェクトに情報を追加すると、ここが返すオブジェクトにも追加されます。(ログイン画面を経た場合)
     * 
     * @return {object}
     */
    function _get() {
      _initIfNecessary();
      return FRONTMOCK.SessionStorage.get('userdata');
    }

    /**
     * ログインユーザー名を取得します
     */
    function _getName() {
      _initIfNecessary();
      var userData = FRONTMOCK.SessionStorage.get('userdata');
      if (userData.username_) {
        // 'username_' is only set by login.js and means login user id.
        return userData.username_;
      }
      if (userData.username && !userData.loginId) {
        // for backward compatibility. 'username' MEANT login user id. Now, username is the name of the user.
        return userData.username;
      }

      return userData.loginId || 'default';
    }

    /**
     * ユーザーのアイコン（自分で設定できる画像）を取得します
     */
    function _getIcon() {
      _initIfNecessary();
      var userData = FRONTMOCK.SessionStorage.get('userdata');
      if (userData.usericon && !userData.userIconImg)
        return userData.usericon;// for backward compatibility.
      return userData.userIconImg || 'headphone.jpg';
    }

  })();
  // @UserData end.

  // @Notification
  FRONTMOCK.Notification = (function() {
    return {
      loadNotification : _loadNotification, // 動かない sato_hi 0912
      addNotifications : _addNotifications, // これはcom.worksap.company.mock.websocket.notification.*あたりと通信する前提のメソッド
      sendNotification : _sendNotification,
      updateCount : _updateCount, // こいつは渡した件数の通りにバッチを更新する
      setCount : _setCount, // こいつはLocalStorage分のタスクの件数をセットする
      // getCount : _getCount,
      // setDataList : _setDataList,
      getDataList : _getDataList, // これが返してくるのはWebsocketとか関係ない、LocalStorageに入っている別形式のデータ。
      getDataCount : _getDataCount, // 同上
      isLocalStorageNotificationExists : _isLocalStorageNotificationExists,
      // removeDataList : _removeDataList,
      // addData : _addData,
      // clearNotification : _clearNotification,
      NOTIFY_LIST : _NOTIFY_LIST
    };

    function _NOTIFY_LIST() {
      return {
        notify : []
      };
    }

    /**
     * 画面描画時にデータをセットします
     */
    function _loadNotification() {
      var count, dataList = {};

      var appDemoUserName = $('#approval-demo-user-name').val();
      if (appDemoUserName === '100') {
        var count = Number(FRONTMOCK.LocalStorage.get('100-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('approval-notifyCnt'));
        var addList = FRONTMOCK.LocalStorage.get('approval-notification-list') || [];
        var notify = [];
        $.merge(notify, addList);
        $.merge(notify, FRONTMOCK.LocalStorage.get('100-notifyData').notify);
        dataList['notify'] = notify;
      } else if (appDemoUserName === '200') {
        count = Number(FRONTMOCK.LocalStorage.get('200-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('apply-notifyCnt'));
        var addList = FRONTMOCK.LocalStorage.get('apply-notification-list') || [];
        var notify = [];
        $.merge(notify, addList);
        $.merge(notify, FRONTMOCK.LocalStorage.get('200-notifyData').notify);
        dataList['notify'] = notify;
      } else {
        count = FRONTMOCK.LocalStorage.get(FRONTMOCK.UserData.getName() + '-notifyCnt');
        dataList = FRONTMOCK.Notification.getDataList();
      }

      var data = {
        cnt : count,
        data : dataList
      };
      setNotification(data);
    }

    function getWebSocketEraNotificationDataFrom(localStorageEraNotificationData) {
      var template = {
        notify : [
          {
            "id" : localStorageEraNotificationData.id,
            "link" : "window.open('" + localStorageEraNotificationData.detailPath + "')",
            "user" : localStorageEraNotificationData.user,
            "username" : localStorageEraNotificationData.username,
            "userimage" : localStorageEraNotificationData.userimage,
            "icon" : localStorageEraNotificationData.icon,
            "iconclass" : localStorageEraNotificationData.iconclass,
            "text" : localStorageEraNotificationData.text,
            "time" : localStorageEraNotificationData.time,
            "reply" : false,
            "actionButtons" : true,
            "action" : false,
            "reminderLater" : false
          }
        ]
      };
      return template;
    }

    /**
     * Add new notifications
     */
    function _addNotifications(notifications, onlyNew, notifications_are_of_local_storage_era) {
      var NOTIFICATION_TEMPLATE = '{{#notify}}'
          + '<li {{#id}}id="{{id}}"{{/id}}class="notify {{#middlePriority}}middle-priority{{/middlePriority}} {{#highPriority}}high-priority{{/highPriority}}">'
          + '  <a href="#" onclick="{{link}}">'
          + '    <span class="image">'
          + '      {{#user}}'
          + '      <img src="{{userimage}}" alt="" class="" style="width:44px;margin-top:0;"/>'
          + '      {{/user}}'
          + '      {{#icon}}'
          + '      <div class="icon img-circle alert-warning">'
          + '        <i style="font-size: 17px;" class="color-alert {{iconclass}}"></i>'
          + '      </div>'
          + '      {{/icon}}'
          + '    </span>'
          + '  '
          + '    <span class="line small" style="margin: 0;">'
          + '      <strong>{{username}}</strong>'
          + '      - {{time}}'
          + '    </span>'
          + '    '
          + '    <span class="desc">'
          + '      {{text}}'
          + '    </span>'
          + '  </a>'
          + ''
          + '  {{#reply}}'
          + '  <form role="form" class="form-horizontal" style="margin-bottom: 5px;">'
          + '  <div class="" data-controller="textField" data-field-id="sample1">'
          + '    <input type="text" class="form-control input-sm" placeholder="Reply" style="margin-left: 20px; width: 275px; display:inline-block">'
          + '    <button type="button" class="btn btn-default btn-sm" style="margin-right: 10px;">Reply</button>'
          + '  </div>'
          + '  </form>'
          + '  {{/reply}}'
          + '  {{#actionButtons}}'
          + '  <div style="text-align: right; margin-bottom: 5px; margin-right: 20px;">'
          + '    {{#action}}'
          + '    <button type="button" class="btn btn-default btn-sm">Accept</button>'
          + '    <button type="button" class="btn btn-default btn-sm">Decline</button>'
          + '    {{/action}}'
          + '    {{#reminderLater}}'
          + '    <div class="btn-group">'
          + '      <button type="button" class="btn btn-sm dropdown-toggle"'
          + '        data-toggle="dropdown-menu" href="javascript:;" onclick="$(this).parent().toggleClass(\'open\');">'
          + '          Reminder Later <span class="caret"></span>'
          + '      </button>'
          + '      <ul class="dropdown-menu" role="menu" style="width: 100px; background-color: #dddddd;">'
          + '        <li><a href="#">5 Minutes</a></li>'
          + '        <li><a href="#">10 Minutes</a></li>'
          + '        <li><a href="#">30 Minutes</a></li>'
          + '        <li><a href="#">1 Hour</a></li>'
          + '        <li><a href="#">2 Hours</a></li>'
          + '      </ul>'
          + '    </div>'
          + '    {{/reminderLater}}'
          + '  </div>'
          + '  {{/actionButtons}}'
          + '  {{#html}}{{{html}}}{{/html}}'
          + '</li>'
          + '{{/notify}}';
      var tmpl = Hogan.compile(NOTIFICATION_TEMPLATE);
      var hasImportantNotification = false;
      if (!notifications) {
        return;
      }
      for (var i = 0; i < notifications.length; i++) {
        var template;
        if (notifications_are_of_local_storage_era) {
          template = getWebSocketEraNotificationDataFrom(notifications[i]);
        } else {
          var time = _stringToDateTime(notifications[i].time);
          if (notifications[i].functionName !== '') {
            time = time + " @ " + notifications[i].functionName;
          }

          var template = {
            notify : [
              {
                "id" : notifications[i].id,
                "link" : "window.open('" + notifications[i].detailPath + "')",
                "user" : notifications[i].senderType == 1 ? false : true,
                "username" : notifications[i].sender,
                "userimage" : "../../common/images/user/" + notifications[i].photoId + ".jpg",
                "icon" : notifications[i].senderType == 1 ? true : false,
                "iconclass" : notifications[i].iconId,
                "text" : notifications[i].content,
                "time" : time,
                "reply" : false,
                "actionButtons" : true,
                "action" : false,
                "reminderLater" : true
              }
            ]
          };

          switch (notifications[i].priority) {
          case 2:
            template.notify[0].middlePriority = true;
            break;
          case 3:
            template.notify[0].highPriority = true;
            break;
          }

          var actionParams = $.parseJSON(notifications[i].actionParams);
          var actionType = notifications[i].actionType;
          if (actionType && actionParams && typeof (actionType) === 'string' && typeof (actionParams) === 'object') {
            if (actionType === 'meeting') {
              template.notify[0].action = true;
              // do something with params and bind some actions.
            } else if (actionType === "timeline") {
              template.notify[0].link = 'wap.mock.home.timeline.timelineComp.timeline("showTimeline", "'
                  + actionParams["secId"]
                  + '", "'
                  + actionParams["cardId"]
                  + '");return false;';
              onlyNew = false; // TODO Extention Later
              template.notify[0].reminderLater = false;
              hasImportantNotification = true;
            }

            if (onlyNew) {
              if (notifications[i].priority == 3) {
                $('#urgent-notification-dialog').modal('show');
                $('body').append($('#urgent-notification-dialog'));
                $('#urgent-notification-content').text(notifications[i].content);
                $('#btn-urgent-notification-ok').attr('onclick', "window.open('" + notifications[i].detailPath + "')");
              } else {
                var opts = {
                  position : "top-right"
                };
                wapToaster.info(notifications[i].content, notifications[i].sender, opts);
              }
            }
          }
        }
        $('#global-notification .dropdown-menu-list').prepend(tmpl.render(template));
      }

      var newCount = Number($('#global-notification .notification-badge').text()) + notifications.length;
      FRONTMOCK.Notification.updateCount(newCount);

      if (newCount > 0 && window.location.href.indexOf("home.html") > -1) {
        if (hasImportantNotification) {
          $("#global-notification").removeClass("has-notification has-important-notification");
          setTimeout(function() {
            $("#global-notification").addClass("has-important-notification");
            $('#popover-new-task').click();
          }, 100);
        } else {
          // 5回べるを揺らす。
          $("#global-notification").removeClass("has-notification has-important-notification");
          setTimeout(function() {
            $("#global-notification").addClass("has-notification");
          }, 100);
        }

      }
    }

    function _stringToDateTime(postdate) {
      // translate japanese
      var second = 1000;
      var minutes = second * 60;
      var hours = minutes * 60;
      var days = hours * 24;
      var months = days * 30;
      var twomonths = days * 365;
      var myDate = new Date(Date.parse(postdate));
      if (isNaN(myDate)) {
        return "Unknow time";
      }
      var nowtime = new Date();
      var longtime = nowtime.getTime() - myDate.getTime();
      var showtime = 0;
      if (longtime > days) {
        return myDate.toDateString();
      } else if (longtime > hours) {
        var count = Math.floor(longtime / hours);
        if (count == 1) {
          // return "1 hour before";
          return "1時間前";
        } else {
          // return count + 'hours before';
          return count + '時間前';
        }
      } else if (longtime > minutes) {
        var count = Math.floor(longtime / minutes);
        if (count == 1) {
          // return "1 minute before";
          return "1分前";
        } else {
          // return count + 'minutes before';
          return count + '分前';
        }
      } else {
        // return "Just now";
        return "たった今";
      }
    }

    function _updateCount(newCount) {
      $('#global-notification .notification-badge,#global-notification .new-cnt').text(newCount);

      if (newCount != 0) {
        $('#global-notification .dropdown-menu-list li.nothing-new').hide();
        $('#global-notification .notification-badge').show();
      } else {
        $('#global-notification .dropdown-menu-list li.nothing-new').show();
        $('#global-notification .notification-badge').hide();
      }
    }

    function _sendNotification(receiver, sender, senderType, content, detailPath, priority, photoId, iconId,
        functionName, actionType, actionParams, callback) {

      if (!actionType) {
        var actionType = '';
      }
      if (!actionParams) {
        var actionParams = '';
      }

      $.ajax({
        url : "../../data/notify/send",
        type : "post",
        async : false,
        data : {
          "receiver" : receiver,
          "sender" : sender,
          "senderType" : senderType,
          "content" : content,
          "detailPath" : detailPath,
          "priority" : priority,
          "photoId" : photoId,
          "iconId" : iconId,
          "functionName" : functionName,
          "actionType" : actionType,
          "actionParams" : JSON.stringify(actionParams)
        },
        success : function(resJSON) {
          if (callback && typeof (callback) === "function") {
            callback();
          }
        }
      });
    }

    /**
     * 通知の件数をセットします
     */
    function _setCount() {
      var cnt = 0;
      switch ($('#approval-demo-user-name').val()) {
      case '100':
        cnt = Number(FRONTMOCK.LocalStorage.get('100-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('approval-notifyCnt'))
        break;
      case '200':
        cnt = Number(FRONTMOCK.LocalStorage.get('200-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('apply-notifyCnt'));
        break;
      default:
        cnt = FRONTMOCK.LocalStorage.get(FRONTMOCK.UserData.getName() + '-notifyCnt');
      }
      if (cnt == null || cnt == 0) {
        cnt = 0;
        $('.notification-badge').hide();
      } else {
        $('.notification-badge').text(cnt).show();
      }
      var n_cnt = FRONTMOCK.Notification.getDataCount();
      $('#global-notification .new-cnt').text(n_cnt);
      $('.notifivation-tile .num').text(n_cnt);
      $('.notifivation-tile .num').attr('data-end', cnt);
    }

    /**
     * 通知データを取得します
     */
    function _getDataList(userName, data) {
      if (!userName)
        userName = FRONTMOCK.UserData.getName();
      var dataList = FRONTMOCK.LocalStorage.get(userName + '-notifyData');
      if (!dataList)
        return FRONTMOCK.Notification.NOTIFY_LIST();
      return dataList;
    }

    /**
     * 通知データを取得します
     */
    function _isLocalStorageNotificationExists(userName, data) {
      if (!userName)
        userName = FRONTMOCK.UserData.getName();
      var dataList = FRONTMOCK.LocalStorage.get(userName + '-notifyData');
      if (dataList == null)
        return false;
      return true;
    }

    /**
     * 通知データの件数を取得します
     */
    function _getDataCount() {
      switch ($('#approval-demo-user-name').val()) {
      case '100':
        return Number(FRONTMOCK.LocalStorage.get('100-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('approval-notifyCnt'));
      case '200':
        return Number(FRONTMOCK.LocalStorage.get('200-notifyCnt')) + Number(FRONTMOCK.LocalStorage.get('apply-notifyCnt'));
      default:
        var list = FRONTMOCK.Notification.getDataList();
        return list.notify.length;
      }
    }

  })();
  // @Notification end.

  // @LocalStorage & sessionStorage
  FRONTMOCK.LocalStorage = factory(win.localStorage);
  FRONTMOCK.SessionStorage = factory(win.sessionStorage);

  // ブラウザのローカルストレージ（ブラウザを閉じても残る・ウィンドウ間で共有される）と
  // セッションストレージ（ブラウザを閉じたら消える・タブ間で共有されない(ただし、window.openしたとき等は共有される)）に
  // 関わる機能を提供するオブジェクトを作るためのfactory
  function factory(storage) {
    return {
      put : _put,
      get : _get,
      remove : _remove,
      clear : _clear,
      query : _query
    };

    /**
     * - JSON.stringify: IE8，Firefox3.5，Safari4.0.2，Chrome2 以降
     * 
     * @param key [String] .
     * @param value [any] .
     */
    function _put(key, value) {
      value = (typeof value == 'object') ? JSON.stringify(value) : value;
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    }

    /**
     * - JSON.parse: IE8，Firefox3.5，Safari4.0.2，Chrome2 以降
     * 
     * @param key [String].
     * @return [any].
     */
    function _get(key) {
      var value;
      if (storage) {
        try {
          value = storage.getItem(key);
          return value && JSON.parse(storage.getItem(key));
        } catch (e) {
          return value;
        }
      }
      return value;
    }

    function _remove(key) {
      if (storage) {
        storage.removeItem(key);
        return;
      }
    }

    function _clear() {
      if (storage) {
        storage.clear();
        return;
      }
    }

    /**
     * Web Databaseに対しSQLを発行します
     * 
     * @param sql
     * @param args
     * @param success like function( tx, rs) {}
     * @param error
     */
    function _query(sql, args, success, error) {
      if (win.openDatabase) {
        var db = openDatabase('Cfw', '3.0', 'Cfw', 50 * 1024 * 1024);
        if (!db) {
          console.error('データベースストレージが使えません。');
        } else {
          db.transaction(function(tx) {
            tx.executeSql(sql, args, success, error);
          });
        }
      } else {
        console.error('データベースストレージはサポートされていません。');
      }
    }
  }
  ;
  // @LocalStorage end.

  // @QueryParam
  FRONTMOCK.QueryParam = (function() {
    return {
      getParam : _getParam
    };

    /**
     * クエリパラメータの取得
     */
    function _getParam() {
      var pStrArr = location.search.substring(1).split('&'), QUERY = {};
      for (var i = 0; i < pStrArr.length; i++) {
        var param = pStrArr[i].split('=');
        QUERY[param[0]] = param[1];
      }
      return QUERY;
    }

  })();

  /**
   * <p>
   * <h3>WebSocket APIs:</h3>
   * <ul>
   * <li>FRONTMOCK.WebSocketClient(): Constructor</li>
   * <li>FRONTMOCK.WebSocketClient.prototype.listen(callback)</li>
   * <li>FRONTMOCK.WebSocketClient.prototype.notify(callback)</li>
   * <li>FRONTMOCK.WebSocketClient.prototype.close()</li>
   * </ul>
   * </p>
   */
  FRONTMOCK.WebSocketClient = (function() {

    /**
     * @private
     */
    var Const_ = {
      WebSocketScheme : {
        http : 'ws',
        https : 'wss'
      },
      CommonMessageType : 'common-message'
    };

    /**
     * @public
     * @constructor
     */
    var WebSocketClient = function(opt_clientId) {

      /**
       * @type {WebSocket}
       */
      this.websocket_ = this.createSocket_();

      /**
       * @type {string}
       */
      this.clientId = opt_clientId ? opt_clientId : null;

      // Handler
      this.websocket_.onmessage = this.handleMessage.bind(this);

      /**
       * inner handler (for common purpose)
       * 
       * @type {function}
       */
      this.handlers_ = {};
    };

    /**
     * Listen to the event which is fired when #notify(obj) has called by other clients.
     * 
     * @see #notify
     * 
     * @public
     * @param {string} opt_type Notification type to listen to.
     * @param {function(obj)} callback A listener which should be called when the client has received the notification.
     */
    WebSocketClient.prototype.listen = function(opt_type, callback) {
      var type = opt_type ? opt_type : Const_.CommonMessageType;
      this.handlers_[type] = callback;
    };

    /**
     * Send message to other websocket clients which are listening to.
     * 
     * @public
     * @param {Object} obj JavaScript object to send to other clients.
     */
    WebSocketClient.prototype.notify = function(type, obj) {
      this.sendMessage(type ? type : Const_.CommonMessageType, obj);
    };

    WebSocketClient.prototype.listenDesktopNotif = function() {
      //
    };

    /**
     * @public
     */
    WebSocketClient.prototype.close = function() {
      this.websocket_.close();
    };

    /**
     * @protected
     * @param message
     */
    WebSocketClient.prototype.handleMessage = function(message) {
      var messagePayload = JSON.parse(message.data);

      var callbackListener = this.handlers_[messagePayload.type];
      if (callbackListener) {
        callbackListener(messagePayload.content);
      } else {
        // Ignore the message
      }
    };

    /**
     * @protected
     * 
     * @param content
     * @returns Notification object
     */
    WebSocketClient.prototype.sendMessage = function(messageType, object) {
      var payload = {
        type : messageType,
        content : object
      };
      var messagePayload = JSON.stringify(payload);
      if (this.websocket_.readyState == 1) {
        // Connected
        this.websocket_.send(messagePayload);
      } else if (this.websocket_.readyState == 0) {
        var me = this;
        // Connecting
        console.log('Wait untill websocket\'s state become connected');
        setTimeout(function() {
          me.sendMessage(messageType, object);
        }, 500);
      } else if (this.websocket_.readyState != 1) {
        // Closed
        console.log('Re create websocket');
        this.websocket_ = createSocket_();
        this.websocket_.onmessage = this.handleMessage_.bind(this);
        this.websocket_.send(messagePayload);
      }
    };

    /**
     * @private
     */
    WebSocketClient.prototype.createSocket_ = function() {
      var websocket = new WebSocket(createUrl_());

      var openHandler = function() {
        console.log('websocket opened by ' + (this.clientId_ ? this.clientId_ : 'Anonymous'));
      };
      websocket.onopen = openHandler.bind(this);

      var closeHandler = function() {
        console.log('websocket closed by ' + (this.clientId_ ? this.clientId_ : 'Anonymous'));
      };
      websocket.onclose = closeHandler.bind(this);

      return websocket;
    };

    function createUrl_() {
      var protocol = location.protocol.replace(/:$/, '');
      var host = location.hostname;
      var port = location.port;
      var contextRoot = location.pathname.split('/')[1];
      var webSocketScheme = Const_.WebSocketScheme[protocol];
      return webSocketScheme + '://' + host + ':' + port + '/' + contextRoot + '/' + 'common-websocket';
    }

    return WebSocketClient;
  })();

  win.half2Full = function(halfStr) {
    var ret = '';
    var length = halfStr.length;
    for (i = 0; i < length; i++) {
      var charCode = halfStr.charCodeAt(i);
      if (charCode >= 33 && charCode <= 270) {
        ret += String.fromCharCode(charCode + 65248);
      } else if (charCode == 32) {
        ret += String.fromCharCode(12288);
      }
    }
    return ret;
  };

  win.full2Half = function(fullStr) {
    var ret = '';
    var length = fullStr.length;
    for (i = 0; i < length; i++) {
      var charCode = fullStr.charCodeAt(i);
      if (charCode >= 33 + 65248 && charCode <= 270 + 65248) {
        ret += String.fromCharCode(charCode - 65248);
      } else if (charCode == 12288) {
        ret += String.fromCharCode(32);
      } else {
        ret += fullStr[i];
      }
    }
    return ret;
  }

  win.hira2Kata = function(hiragana) {
    return hiragana.replace(/[ぁ-ん]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
  }

  win.kata2Hira = function(katakana) {
    return katakana.replace(/[ァ-ン]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
  }

  var hebon = {
    '１' : '1',
    '２' : '2',
    '３' : '3',
    '４' : '4',
    '５' : '5',
    '６' : '6',
    '７' : '7',
    '８' : '8',
    '９' : '9',
    '０' : '0',
    '！' : '!',
    '”' : '"',
    '＃' : '#',
    '＄' : '$',
    '％' : '%',
    '＆' : '&',
    '’' : "'",
    '（' : '(',
    '）' : ')',
    '＝' : '=',
    '～' : '~',
    '｜' : '|',
    '＠' : '@',
    '‘' : '`',
    '＋' : '+',
    '＊' : '*',
    '；' : ";",
    '：' : ':',
    '＜' : '<',
    '＞' : '>',
    '、' : ',',
    '。' : '.',
    '／' : '/',
    '？' : '?',
    '＿' : '_',
    '・' : '･',
    '「' : '[',
    '」' : ']',
    '｛' : '{',
    '｝' : '}',
    '￥' : '\\',
    '＾' : '^',
    'ふぁ' : 'fua',
    'ふぃ' : 'fui',
    'ふぇ' : 'fue',
    'ふぉ' : 'fuo',
    'きゃ' : 'kya',
    'きゅ' : 'kyu',
    'きょ' : 'kyo',
    'しゃ' : 'sha',
    'しゅ' : 'shu',
    'しょ' : 'sho',
    'じぇ' : 'jie',
    'ちゃ' : 'cha',
    'ちゅ' : 'chu',
    'ちょ' : 'cho',
    'にゃ' : 'nya',
    'にゅ' : 'nyu',
    'にょ' : 'nyo',
    'ひゃ' : 'hya',
    'ひゅ' : 'hyu',
    'ひょ' : 'hyo',
    'みゃ' : 'mya',
    'みゅ' : 'myu',
    'みょ' : 'myo',
    'りゃ' : 'rya',
    'りゅ' : 'ryu',
    'りょ' : 'ryo',
    'ふゃ' : 'fya',
    'ふゅ' : 'fyu',
    'ふょ' : 'fyo',
    'ぴゃ' : 'pya',
    'ぴゅ' : 'pyu',
    'ぴょ' : 'pyo',
    'びゃ' : 'bya',
    'びゅ' : 'byu',
    'びょ' : 'byo',
    'ぢゃ' : 'dya',
    'ぢゅ' : 'dyu',
    'ぢょ' : 'dyo',
    'じゃ' : 'ja',
    'じゅ' : 'ju',
    'じょ' : 'jo',
    'ぎゃ' : 'gya',
    'ぎゅ' : 'gyu',
    'ぎょ' : 'gyo',
    'ぱ' : 'pa',
    'ぴ' : 'pi',
    'ぷ' : 'pu',
    'ぺ' : 'pe',
    'ぽ' : 'po',
    'ば' : 'ba',
    'び' : 'bi',
    'ぶ' : 'bu',
    'べ' : 'be',
    'ぼ' : 'bo',
    'だ' : 'da',
    'ぢ' : 'ji',
    'づ' : 'zu',
    'で' : 'de',
    'ど' : 'do',
    'ざ' : 'za',
    'じ' : 'ji',
    'ず' : 'zu',
    'ぜ' : 'ze',
    'ぞ' : 'zo',
    'が' : 'ga',
    'ぎ' : 'gi',
    'ぐ' : 'gu',
    'げ' : 'ge',
    'ご' : 'go',
    'わ' : 'wa',
    'ゐ' : 'i',
    'う' : 'u',
    'ゑ' : 'e',
    'を' : 'wo',
    'ら' : 'ra',
    'り' : 'ri',
    'る' : 'ru',
    'れ' : 're',
    'ろ' : 'ro',
    'や' : 'ya',
    'ゆ' : 'yu',
    'よ' : 'yo',
    'ま' : 'ma',
    'み' : 'mi',
    'む' : 'mu',
    'め' : 'me',
    'も' : 'mo',
    'は' : 'ha',
    'ひ' : 'hi',
    'ふ' : 'hu',
    'へ' : 'he',
    'ほ' : 'ho',
    'な' : 'na',
    'に' : 'ni',
    'ぬ' : 'nu',
    'ね' : 'ne',
    'の' : 'no',
    'た' : 'ta',
    'ち' : 'chi',
    'つ' : 'tsu',
    'て' : 'te',
    'と' : 'to',
    'さ' : 'sa',
    'し' : 'shi',
    'す' : 'su',
    'せ' : 'se',
    'そ' : 'so',
    'か' : 'ka',
    'き' : 'ki',
    'く' : 'ku',
    'け' : 'ke',
    'こ' : 'ko',
    'あ' : 'a',
    'い' : 'i',
    'う' : 'u',
    'え' : 'e',
    'お' : 'o',
    'ぁ' : 'a',
    'ぃ' : 'i',
    'ぅ' : 'u',
    'ぇ' : 'e',
    'ぉ' : 'o',
    'ゃ' : 'ya',
    'ゅ' : 'yu',
    'ょ' : 'yo',
    'ヶ' : 'ke',
    'ヵ' : 'ka',
    'ん' : 'n',
    'ー' : '-',
    '　' : ' ',
    'ヴ' : 'bu'
  };
  var kunrei = {
    '１' : '1',
    '２' : '2',
    '３' : '3',
    '４' : '4',
    '５' : '5',
    '６' : '6',
    '７' : '7',
    '８' : '8',
    '９' : '9',
    '０' : '0',
    '！' : '!',
    '”' : '"',
    '＃' : '#',
    '＄' : '$',
    '％' : '%',
    '＆' : '&',
    '’' : "'",
    '（' : '(',
    '）' : ')',
    '＝' : '=',
    '～' : '~',
    '｜' : '|',
    '＠' : '@',
    '‘' : '`',
    '＋' : '+',
    '＊' : '*',
    '；' : ";",
    '：' : ':',
    '＜' : '<',
    '＞' : '>',
    '、' : ',',
    '。' : '.',
    '／' : '/',
    '？' : '?',
    '＿' : '_',
    '・' : '･',
    '「' : '[',
    '」' : ']',
    '｛' : '{',
    '｝' : '}',
    '￥' : '\\',
    '＾' : '^',
    'ふぁ' : 'fa',
    'ふぃ' : 'fi',
    'ふぇ' : 'fe',
    'ふぉ' : 'fo',
    'きゃ' : 'kya',
    'きゅ' : 'kyu',
    'きょ' : 'kyo',
    'しゃ' : 'sya',
    'しゅ' : 'syu',
    'しょ' : 'syo',
    'ちゃ' : 'tya',
    'ちゅ' : 'tyu',
    'ちょ' : 'tyo',
    'にゃ' : 'nya',
    'にゅ' : 'nyu',
    'にょ' : 'nyo',
    'ひゃ' : 'hya',
    'ひゅ' : 'hyu',
    'ひょ' : 'hyo',
    'みゃ' : 'mya',
    'みゅ' : 'myu',
    'みょ' : 'myo',
    'りゃ' : 'rya',
    'りゅ' : 'ryu',
    'りょ' : 'ryo',
    'ふゃ' : 'fya',
    'ふゅ' : 'fyu',
    'ふょ' : 'fyo',
    'ぴゃ' : 'pya',
    'ぴゅ' : 'pyu',
    'ぴょ' : 'pyo',
    'びゃ' : 'bya',
    'びゅ' : 'byu',
    'びょ' : 'byo',
    'ぢゃ' : 'dya',
    'ぢゅ' : 'dyu',
    'ぢょ' : 'dyo',
    'じゃ' : 'zya',
    'じゅ' : 'zyu',
    'じょ' : 'zyo',
    'ぎゃ' : 'gya',
    'ぎゅ' : 'gyu',
    'ぎょ' : 'gyo',
    'ぱ' : 'pa',
    'ぴ' : 'pi',
    'ぷ' : 'pu',
    'ぺ' : 'pe',
    'ぽ' : 'po',
    'ば' : 'ba',
    'び' : 'bi',
    'ぶ' : 'bu',
    'べ' : 'be',
    'ぼ' : 'bo',
    'だ' : 'da',
    'ぢ' : 'di',
    'づ' : 'du',
    'で' : 'de',
    'ど' : 'do',
    'ざ' : 'za',
    'じ' : 'zi',
    'ず' : 'zu',
    'ぜ' : 'ze',
    'ぞ' : 'zo',
    'が' : 'ga',
    'ぎ' : 'gi',
    'ぐ' : 'gu',
    'げ' : 'ge',
    'ご' : 'go',
    'わ' : 'wa',
    'ゐ' : 'wi',
    'う' : 'wu',
    'ゑ' : 'we',
    'を' : 'wo',
    'ら' : 'ra',
    'り' : 'ri',
    'る' : 'ru',
    'れ' : 're',
    'ろ' : 'ro',
    'や' : 'ya',
    'ゆ' : 'yu',
    'よ' : 'yo',
    'ま' : 'ma',
    'み' : 'mi',
    'む' : 'mu',
    'め' : 'me',
    'も' : 'mo',
    'は' : 'ha',
    'ひ' : 'hi',
    'ふ' : 'hu',
    'へ' : 'he',
    'ほ' : 'ho',
    'な' : 'na',
    'に' : 'ni',
    'ぬ' : 'nu',
    'ね' : 'ne',
    'の' : 'no',
    'た' : 'ta',
    'ち' : 'ti',
    'つ' : 'tu',
    'て' : 'te',
    'と' : 'to',
    'さ' : 'sa',
    'し' : 'si',
    'す' : 'su',
    'せ' : 'se',
    'そ' : 'so',
    'か' : 'ka',
    'き' : 'ki',
    'く' : 'ku',
    'け' : 'ke',
    'こ' : 'ko',
    'あ' : 'a',
    'い' : 'i',
    'う' : 'u',
    'え' : 'e',
    'お' : 'o',
    'ぁ' : 'la',
    'ぃ' : 'li',
    'ぅ' : 'lu',
    'ぇ' : 'le',
    'ぉ' : 'lo',
    'ヶ' : 'ke',
    'ヵ' : 'ka',
    'ん' : 'n',
    'ー' : '-',
    '　' : ' '
  };

  win.hira2Roman = (function() {

    var reg_tu = /っ([bcdfghijklmnopqrstuvwyz])/gm;
    var reg_xtu = /っ/gm;
    var res = {};
    res.kunrei = function(str) {
      var pnt = 0;
      var max = str.length;
      var s, r;
      var txt = '';

      while (pnt <= max) {
        if (r = kunrei[str.substring(pnt, pnt + 2)]) {
          txt += r;
          pnt += 2;
        } else {
          txt += (r = kunrei[s = str.substring(pnt, pnt + 1)]) ? r : s;
          pnt += 1;
        }
      }
      txt = txt.replace(reg_tu, '$1$1');
      txt = txt.replace(reg_xtu, 'xtu');
      return txt;
    };

    res.hebon = function(str) {
      var pnt = 0;
      var max = str.length;
      var s, r;
      var txt = '';

      while (pnt <= max) {
        if (r = hebon[str.substring(pnt, pnt + 2)]) {
          txt += r;
          pnt += 2;
        } else {
          txt += (r = hebon[s = str.substring(pnt, pnt + 1)]) ? r : s;
          pnt += 1;
        }
      }
      txt = txt.replace(reg_tu, '$1$1');
      txt = txt.replace(reg_xtu, 'xtu');
      return txt;
    };
    return res;
  })();

  var oldNewKanjiMap = {
    "一" : "一",
    "丄" : "上",
    "丅" : "下",
    "万" : "万",
    "三" : "三",
    "上" : "上",
    "下" : "下",
    "与" : "与",
    "丑" : "丑",
    "丒" : "丑",
    "世" : "世",
    "丗" : "世",
    "丘" : "丘",
    "両" : "両",
    "丣" : "酉",
    "並" : "並",
    "丬" : "爿",
    "乑" : "衆",
    "乕" : "虎",
    "乗" : "乗",
    "乘" : "乗",
    "乱" : "乱",
    "乹" : "乾",
    "乾" : "乾",
    "亀" : "亀",
    "亁" : "乾",
    "亂" : "乱",
    "予" : "予",
    "争" : "争",
    "亊" : "事",
    "事" : "事",
    "二" : "二",
    "亖" : "四",
    "亘" : "亘",
    "亙" : "亘",
    "亜" : "亜",
    "亝" : "斉",
    "亞" : "亜",
    "亟" : "亟",
    "京" : "京",
    "亰" : "京",
    "仂" : "働",
    "仏" : "仏",
    "仐" : "傘",
    "仝" : "同",
    "仞" : "仞",
    "仭" : "仞",
    "仮" : "仮",
    "份" : "彬",
    "伇" : "役",
    "会" : "会",
    "伜" : "倅",
    "伝" : "伝",
    "伞" : "傘",
    "伫" : "佇",
    "伮" : "努",
    "伷" : "胄",
    "伸" : "伸",
    "佇" : "佇",
    "体" : "体",
    "余" : "余",
    "佛" : "仏",
    "佞" : "佞",
    "佪" : "徊",
    "併" : "併",
    "佷" : "很",
    "來" : "来",
    "侠" : "侠",
    "価" : "価",
    "侫" : "佞",
    "侭" : "侭",
    "侯" : "侯",
    "俎" : "俎",
    "俞" : "兪",
    "俠" : "侠",
    "俦" : "儔",
    "俩" : "倆",
    "俱" : "倶",
    "俻" : "備",
    "俽" : "欣",
    "倂" : "併",
    "倅" : "倅",
    "倆" : "倆",
    "倎" : "腆",
    "倏" : "倏",
    "倐" : "倏",
    "倶" : "倶",
    "倹" : "倹",
    "偀" : "英",
    "假" : "仮",
    "偬" : "偬",
    "偹" : "備",
    "偽" : "偽",
    "傑" : "傑",
    "傘" : "傘",
    "備" : "備",
    "傜" : "徭",
    "傯" : "偬",
    "傳" : "伝",
    "僃" : "備",
    "僈" : "慢",
    "僊" : "僊",
    "働" : "働",
    "僞" : "偽",
    "僡" : "恵",
    "僣" : "僭",
    "僭" : "僭",
    "僲" : "僊",
    "價" : "価",
    "儉" : "倹",
    "儔" : "儔",
    "儘" : "侭",
    "儛" : "舞",
    "光" : "光",
    "兊" : "兌",
    "兌" : "兌",
    "兎" : "兎",
    "児" : "児",
    "兒" : "児",
    "兔" : "兎",
    "党" : "党",
    "兜" : "兜",
    "兠" : "兜",
    "內" : "内",
    "兩" : "両",
    "兪" : "兪",
    "关" : "癸",
    "冄" : "冉",
    "内" : "内",
    "円" : "円",
    "冉" : "冉",
    "冊" : "冊",
    "册" : "冊",
    "冐" : "冒",
    "冒" : "冒",
    "冗" : "冗",
    "写" : "写",
    "冝" : "宜",
    "冤" : "冤",
    "冦" : "冦",
    "冨" : "富",
    "冩" : "写",
    "冪" : "冪",
    "冰" : "氷",
    "冱" : "冴",
    "冲" : "沖",
    "决" : "決",
    "冴" : "冴",
    "况" : "況",
    "冺" : "泯",
    "冽" : "冽",
    "凄" : "凄",
    "凅" : "凅",
    "凉" : "涼",
    "减" : "減",
    "凖" : "準",
    "凛" : "凛",
    "凜" : "凛",
    "凞" : "煕",
    "凡" : "凡",
    "凢" : "凡",
    "処" : "処",
    "凨" : "風",
    "凬" : "風",
    "凭" : "凭",
    "凮" : "風",
    "凴" : "凭",
    "函" : "函",
    "凾" : "函",
    "刁" : "寅",
    "刃" : "刃",
    "刄" : "刃",
    "刊" : "刊",
    "刋" : "刊",
    "別" : "別",
    "刦" : "劫",
    "刧" : "劫",
    "别" : "別",
    "刱" : "剏",
    "刹" : "刹",
    "刼" : "劫",
    "剋" : "剋",
    "前" : "前",
    "剎" : "刹",
    "剏" : "剏",
    "剙" : "剏",
    "剝" : "剥",
    "剣" : "剣",
    "剤" : "剤",
    "剥" : "剥",
    "剦" : "閹",
    "剩" : "剰",
    "剰" : "剰",
    "剱" : "剣",
    "剳" : "剳",
    "剹" : "戮",
    "劃" : "劃",
    "劄" : "剳",
    "劆" : "鎌",
    "劍" : "剣",
    "劎" : "剣",
    "劐" : "劃",
    "劑" : "剤",
    "劒" : "剣",
    "劔" : "剣",
    "努" : "努",
    "劫" : "劫",
    "励" : "励",
    "劲" : "勁",
    "劳" : "労",
    "労" : "労",
    "効" : "効",
    "势" : "勢",
    "勁" : "勁",
    "勅" : "勅",
    "勇" : "勇",
    "勈" : "勇",
    "勐" : "猛",
    "勑" : "勅",
    "勛" : "勲",
    "勞" : "労",
    "勢" : "勢",
    "勥" : "強",
    "勧" : "勧",
    "勲" : "勲",
    "勳" : "勲",
    "勵" : "励",
    "勸" : "勧",
    "匀" : "韻",
    "匆" : "匆",
    "匇" : "匆",
    "匊" : "掬",
    "匑" : "窮",
    "匝" : "匝",
    "匯" : "匯",
    "匲" : "匳",
    "匳" : "匳",
    "区" : "区",
    "医" : "医",
    "區" : "区",
    "卄" : "廿",
    "卆" : "卒",
    "卋" : "世",
    "卒" : "卒",
    "卓" : "卓",
    "協" : "協",
    "单" : "単",
    "単" : "単",
    "卛" : "率",
    "卝" : "艸",
    "卧" : "臥",
    "卮" : "卮",
    "卯" : "卯",
    "即" : "即",
    "却" : "却",
    "卷" : "巻",
    "卻" : "却",
    "卽" : "即",
    "厀" : "膝",
    "厖" : "厖",
    "原" : "原",
    "厠" : "厠",
    "厡" : "原",
    "厦" : "厦",
    "厨" : "厨",
    "厩" : "厩",
    "厮" : "厮",
    "厰" : "廠",
    "厳" : "厳",
    "厺" : "去",
    "去" : "去",
    "参" : "参",
    "參" : "参",
    "叄" : "参",
    "叅" : "参",
    "双" : "双",
    "収" : "収",
    "叏" : "夬",
    "叓" : "事",
    "叙" : "叙",
    "叞" : "尉",
    "叠" : "畳",
    "叡" : "叡",
    "叫" : "叫",
    "台" : "台",
    "叵" : "難",
    "号" : "号",
    "同" : "同",
    "吒" : "咤",
    "吞" : "呑",
    "吳" : "呉",
    "吴" : "呉",
    "吽" : "吽",
    "吿" : "告",
    "呉" : "呉",
    "告" : "告",
    "呌" : "叫",
    "呍" : "吽",
    "呑" : "呑",
    "呕" : "嘔",
    "呪" : "呪",
    "呱" : "呱",
    "咊" : "和",
    "和" : "和",
    "咏" : "詠",
    "咒" : "呪",
    "咜" : "咤",
    "咤" : "咤",
    "咯" : "喀",
    "哌" : "呱",
    "哥" : "歌",
    "哧" : "嚇",
    "哬" : "訶",
    "哲" : "哲",
    "唇" : "唇",
    "唈" : "邑",
    "唖" : "唖",
    "唘" : "啓",
    "啓" : "啓",
    "啔" : "啓",
    "啚" : "図",
    "啞" : "唖",
    "啟" : "啓",
    "喀" : "喀",
    "善" : "善",
    "喆" : "哲",
    "喜" : "喜",
    "單" : "単",
    "営" : "営",
    "嗅" : "嗅",
    "嗽" : "嗽",
    "嘔" : "嘔",
    "嘗" : "嘗",
    "嘘" : "嘘",
    "嘨" : "嘯",
    "嘩" : "嘩",
    "嘯" : "嘯",
    "嘱" : "嘱",
    "嘿" : "黙",
    "噐" : "器",
    "噓" : "嘘",
    "器" : "器",
    "噪" : "噪",
    "嚇" : "嚇",
    "嚏" : "嚔",
    "嚔" : "嚔",
    "嚞" : "哲",
    "嚢" : "嚢",
    "嚴" : "厳",
    "囊" : "嚢",
    "囍" : "喜",
    "囏" : "艱",
    "囑" : "嘱",
    "囓" : "囓",
    "囘" : "回",
    "囙" : "因",
    "四" : "四",
    "回" : "回",
    "因" : "因",
    "団" : "団",
    "囬" : "回",
    "囲" : "囲",
    "図" : "図",
    "囶" : "国",
    "囻" : "国",
    "国" : "国",
    "圀" : "国",
    "圈" : "圏",
    "國" : "国",
    "圍" : "囲",
    "圎" : "円",
    "圏" : "圏",
    "園" : "園",
    "圓" : "円",
    "圖" : "図",
    "圗" : "図",
    "團" : "団",
    "土" : "土",
    "圡" : "土",
    "圧" : "圧",
    "址" : "址",
    "坭" : "泥",
    "坵" : "丘",
    "垂" : "垂",
    "垖" : "堆",
    "垨" : "守",
    "埀" : "垂",
    "埑" : "哲",
    "埒" : "埒",
    "埓" : "埒",
    "埜" : "野",
    "埞" : "堤",
    "埦" : "碗",
    "執" : "執",
    "埼" : "埼",
    "堆" : "堆",
    "堕" : "堕",
    "堤" : "堤",
    "堦" : "階",
    "堯" : "尭",
    "堰" : "堰",
    "場" : "場",
    "堽" : "岡",
    "塁" : "塁",
    "塟" : "葬",
    "塡" : "填",
    "塩" : "塩",
    "填" : "填",
    "塲" : "場",
    "塹" : "塹",
    "墅" : "野",
    "増" : "増",
    "墙" : "墻",
    "增" : "増",
    "墮" : "堕",
    "墻" : "墻",
    "壃" : "疆",
    "壄" : "野",
    "壊" : "壊",
    "壌" : "壌",
    "壍" : "塹",
    "壐" : "璽",
    "壓" : "圧",
    "壘" : "塁",
    "壜" : "壜",
    "壞" : "壊",
    "壟" : "壟",
    "壠" : "壟",
    "壤" : "壌",
    "壬" : "閏",
    "壮" : "壮",
    "壯" : "壮",
    "声" : "声",
    "壱" : "壱",
    "売" : "売",
    "壳" : "殻",
    "壷" : "壷",
    "壹" : "壱",
    "壺" : "壷",
    "壻" : "婿",
    "壽" : "寿",
    "変" : "変",
    "夘" : "卯",
    "多" : "多",
    "夛" : "多",
    "夢" : "夢",
    "夣" : "夢",
    "夬" : "夬",
    "夲" : "本",
    "夹" : "夾",
    "夾" : "夾",
    "奁" : "匳",
    "奇" : "奇",
    "奈" : "奈",
    "奕" : "奕",
    "奘" : "奘",
    "奥" : "奥",
    "奧" : "奥",
    "奨" : "奨",
    "奩" : "匳",
    "奬" : "奨",
    "奸" : "奸",
    "妊" : "妊",
    "妍" : "妍",
    "妙" : "妙",
    "姉" : "姉",
    "姊" : "姉",
    "姙" : "妊",
    "姦" : "奸",
    "姧" : "奸",
    "姫" : "姫",
    "姬" : "姫",
    "姮" : "嫦",
    "姸" : "妍",
    "姻" : "姻",
    "娄" : "婁",
    "娛" : "娯",
    "娯" : "娯",
    "婁" : "婁",
    "婣" : "姻",
    "婬" : "淫",
    "婿" : "婿",
    "媿" : "愧",
    "嫋" : "嫋",
    "嫐" : "嬲",
    "嫦" : "嫦",
    "嫩" : "嫩",
    "嫰" : "嫩",
    "嫶" : "憔",
    "嫺" : "嫺",
    "嫻" : "嫺",
    "嬝" : "嫋",
    "嬢" : "嬢",
    "嬲" : "嬲",
    "孃" : "嬢",
    "学" : "学",
    "學" : "学",
    "宂" : "冗",
    "守" : "守",
    "宊" : "突",
    "宜" : "宜",
    "宝" : "宝",
    "実" : "実",
    "宷" : "審",
    "宼" : "冦",
    "寃" : "冤",
    "寅" : "寅",
    "寇" : "冦",
    "寉" : "鶴",
    "富" : "富",
    "寓" : "寓",
    "寚" : "宝",
    "寛" : "寛",
    "寜" : "寧",
    "寝" : "寝",
    "寢" : "寝",
    "實" : "実",
    "寧" : "寧",
    "審" : "審",
    "寫" : "写",
    "寬" : "寛",
    "寳" : "宝",
    "寶" : "宝",
    "対" : "対",
    "寿" : "寿",
    "専" : "専",
    "尅" : "剋",
    "将" : "将",
    "將" : "将",
    "專" : "専",
    "尉" : "尉",
    "對" : "対",
    "尓" : "爾",
    "尔" : "爾",
    "尙" : "尚",
    "尚" : "尚",
    "尟" : "尠",
    "尠" : "尠",
    "尢" : "尢",
    "尣" : "尢",
    "尩" : "尩",
    "尫" : "尩",
    "尭" : "尭",
    "尽" : "尽",
    "屆" : "届",
    "届" : "届",
    "屏" : "屏",
    "屛" : "屏",
    "属" : "属",
    "屡" : "屡",
    "屢" : "屡",
    "屬" : "属",
    "岈" : "谺",
    "岡" : "岡",
    "岳" : "岳",
    "峕" : "時",
    "峡" : "峡",
    "峦" : "巒",
    "峨" : "峨",
    "峩" : "峨",
    "峯" : "峰",
    "峰" : "峰",
    "島" : "島",
    "峽" : "峡",
    "崎" : "崎",
    "崐" : "崑",
    "崑" : "崑",
    "崕" : "崖",
    "崖" : "崖",
    "崗" : "岡",
    "崘" : "崙",
    "崙" : "崙",
    "嵌" : "嵌",
    "嵓" : "巌",
    "嵗" : "歳",
    "嵜" : "崎",
    "嵯" : "嵯",
    "嵳" : "嵯",
    "嶋" : "島",
    "嶌" : "島",
    "嶢" : "嶢",
    "嶤" : "嶢",
    "嶽" : "岳",
    "巌" : "巌",
    "巒" : "巒",
    "巖" : "巌",
    "巢" : "巣",
    "巣" : "巣",
    "巵" : "卮",
    "巷" : "巷",
    "巻" : "巻",
    "帀" : "匝",
    "帋" : "紙",
    "帍" : "寅",
    "帒" : "袋",
    "帯" : "帯",
    "帰" : "帰",
    "帳" : "帳",
    "帶" : "帯",
    "幇" : "幇",
    "幌" : "幌",
    "幚" : "幇",
    "幣" : "幣",
    "幤" : "幣",
    "幫" : "幇",
    "年" : "年",
    "并" : "并",
    "幷" : "并",
    "幹" : "幹",
    "庁" : "庁",
    "広" : "広",
    "庄" : "荘",
    "庒" : "荘",
    "庙" : "廟",
    "庬" : "厖",
    "庵" : "庵",
    "庽" : "寓",
    "庿" : "廟",
    "廁" : "厠",
    "廃" : "廃",
    "廄" : "厩",
    "廈" : "厦",
    "廏" : "厩",
    "廐" : "厩",
    "廚" : "厨",
    "廝" : "厮",
    "廟" : "廟",
    "廠" : "廠",
    "廢" : "廃",
    "廣" : "広",
    "廰" : "庁",
    "廳" : "庁",
    "廸" : "廸",
    "廹" : "迫",
    "廻" : "廻",
    "廼" : "廼",
    "廽" : "廻",
    "廿" : "廿",
    "开" : "開",
    "弁" : "弁",
    "弃" : "棄",
    "弈" : "奕",
    "弉" : "奘",
    "弌" : "一",
    "弍" : "二",
    "弎" : "三",
    "弐" : "弐",
    "弥" : "弥",
    "弯" : "彎",
    "強" : "強",
    "强" : "強",
    "弻" : "弼",
    "弼" : "弼",
    "弾" : "弾",
    "彈" : "弾",
    "彌" : "弥",
    "彎" : "彎",
    "彐" : "彑",
    "彑" : "彑",
    "当" : "当",
    "彗" : "彗",
    "彜" : "彝",
    "彝" : "彝",
    "彥" : "彦",
    "彦" : "彦",
    "彬" : "彬",
    "役" : "役",
    "彿" : "彿",
    "往" : "往",
    "徃" : "往",
    "径" : "径",
    "徇" : "徇",
    "很" : "很",
    "徊" : "徊",
    "徏" : "陟",
    "徑" : "径",
    "従" : "従",
    "得" : "得",
    "從" : "従",
    "徭" : "徭",
    "徳" : "徳",
    "徴" : "徴",
    "徵" : "徴",
    "德" : "徳",
    "応" : "応",
    "忢" : "悟",
    "忩" : "怱",
    "忰" : "悴",
    "怪" : "怪",
    "怱" : "怱",
    "恆" : "恒",
    "恊" : "協",
    "恋" : "恋",
    "恒" : "恒",
    "恠" : "怪",
    "恡" : "悋",
    "恢" : "恢",
    "恥" : "恥",
    "恵" : "恵",
    "悅" : "悦",
    "悊" : "哲",
    "悋" : "悋",
    "悍" : "悍",
    "悟" : "悟",
    "悤" : "怱",
    "悦" : "悦",
    "悩" : "悩",
    "悪" : "悪",
    "悳" : "徳",
    "悴" : "悴",
    "惞" : "欣",
    "惠" : "恵",
    "惡" : "悪",
    "惧" : "惧",
    "惨" : "惨",
    "惮" : "憚",
    "惱" : "悩",
    "愠" : "慍",
    "愧" : "愧",
    "愨" : "愨",
    "愸" : "整",
    "愼" : "慎",
    "慍" : "慍",
    "慎" : "慎",
    "慘" : "惨",
    "慙" : "慙",
    "慚" : "慙",
    "慢" : "慢",
    "慤" : "愨",
    "慭" : "憖",
    "慿" : "憑",
    "憇" : "憩",
    "憍" : "驕",
    "憑" : "憑",
    "憓" : "恵",
    "憔" : "憔",
    "憖" : "憖",
    "憗" : "憖",
    "憘" : "喜",
    "憙" : "喜",
    "憚" : "憚",
    "憩" : "憩",
    "應" : "応",
    "懐" : "懐",
    "懑" : "懣",
    "懣" : "懣",
    "懴" : "懺",
    "懷" : "懐",
    "懺" : "懺",
    "懼" : "惧",
    "戀" : "恋",
    "戛" : "戛",
    "戝" : "財",
    "戞" : "戛",
    "戦" : "戦",
    "戮" : "戮",
    "戯" : "戯",
    "戰" : "戦",
    "戱" : "戯",
    "戲" : "戯",
    "払" : "払",
    "扠" : "扠",
    "扨" : "扠",
    "扵" : "於",
    "承" : "承",
    "抅" : "拘",
    "抜" : "抜",
    "択" : "択",
    "抬" : "擡",
    "拂" : "払",
    "担" : "担",
    "拔" : "抜",
    "拘" : "拘",
    "拜" : "拝",
    "拝" : "拝",
    "拠" : "拠",
    "拡" : "拡",
    "挍" : "校",
    "挙" : "挙",
    "挛" : "攣",
    "挟" : "挟",
    "挾" : "挟",
    "挿" : "挿",
    "捏" : "捏",
    "捜" : "捜",
    "捿" : "棲",
    "掬" : "掬",
    "掴" : "掴",
    "掻" : "掻",
    "揑" : "捏",
    "插" : "挿",
    "揷" : "挿",
    "揺" : "揺",
    "搔" : "掻",
    "搖" : "揺",
    "搜" : "捜",
    "搥" : "槌",
    "携" : "携",
    "摂" : "摂",
    "摑" : "掴",
    "撃" : "撃",
    "撲" : "撲",
    "撹" : "撹",
    "撿" : "検",
    "擇" : "択",
    "擈" : "撲",
    "擊" : "撃",
    "擔" : "担",
    "擕" : "携",
    "據" : "拠",
    "擡" : "擡",
    "擥" : "攬",
    "擧" : "挙",
    "擴" : "拡",
    "擷" : "襭",
    "攅" : "攅",
    "攜" : "携",
    "攝" : "摂",
    "攢" : "攅",
    "攣" : "攣",
    "攪" : "撹",
    "攫" : "攫",
    "攬" : "攬",
    "收" : "収",
    "敇" : "策",
    "效" : "効",
    "敍" : "叙",
    "敎" : "教",
    "敕" : "勅",
    "敗" : "敗",
    "敘" : "叙",
    "教" : "教",
    "数" : "数",
    "整" : "整",
    "敷" : "敷",
    "數" : "数",
    "敺" : "駆",
    "斅" : "学",
    "斆" : "学",
    "斈" : "学",
    "斉" : "斉",
    "斊" : "斉",
    "斌" : "彬",
    "斎" : "斎",
    "斗" : "斗",
    "斟" : "斟",
    "断" : "断",
    "斷" : "断",
    "於" : "於",
    "斾" : "旆",
    "旆" : "旆",
    "旉" : "敷",
    "旗" : "旗",
    "旙" : "旛",
    "旛" : "旛",
    "无" : "無",
    "既" : "既",
    "旣" : "既",
    "旧" : "旧",
    "旪" : "協",
    "时" : "時",
    "昇" : "昇",
    "明" : "明",
    "昏" : "昏",
    "映" : "映",
    "昬" : "昏",
    "是" : "是",
    "昰" : "是",
    "昼" : "昼",
    "昿" : "曠",
    "時" : "時",
    "晃" : "晃",
    "晄" : "晃",
    "晈" : "皎",
    "晉" : "晋",
    "晋" : "晋",
    "晒" : "晒",
    "晚" : "晩",
    "晝" : "昼",
    "晢" : "晢",
    "晣" : "晢",
    "晥" : "皖",
    "晩" : "晩",
    "普" : "普",
    "晴" : "晴",
    "暁" : "暁",
    "暎" : "映",
    "暒" : "晴",
    "暜" : "普",
    "暦" : "暦",
    "暫" : "暫",
    "暸" : "瞭",
    "暿" : "熹",
    "曆" : "暦",
    "曉" : "暁",
    "曠" : "曠",
    "曬" : "晒",
    "曳" : "曳",
    "曵" : "曳",
    "曹" : "曹",
    "曺" : "曹",
    "曻" : "昇",
    "曽" : "曽",
    "曾" : "曽",
    "會" : "会",
    "朖" : "朗",
    "朗" : "朗",
    "朙" : "明",
    "朞" : "期",
    "期" : "期",
    "本" : "本",
    "朵" : "朶",
    "朶" : "朶",
    "杉" : "杉",
    "杍" : "李",
    "李" : "李",
    "条" : "条",
    "杤" : "栃",
    "来" : "来",
    "杦" : "杉",
    "杯" : "杯",
    "杰" : "傑",
    "松" : "松",
    "枀" : "松",
    "枏" : "楠",
    "枓" : "斗",
    "枞" : "樅",
    "枡" : "桝",
    "枢" : "枢",
    "枦" : "櫨",
    "枩" : "松",
    "枽" : "桑",
    "柁" : "舵",
    "柏" : "柏",
    "柗" : "松",
    "柟" : "楠",
    "柰" : "奈",
    "柳" : "柳",
    "柵" : "柵",
    "柹" : "柿",
    "柿" : "柿",
    "栁" : "柳",
    "栃" : "栃",
    "栄" : "栄",
    "栅" : "柵",
    "栖" : "棲",
    "校" : "校",
    "栢" : "柏",
    "栰" : "筏",
    "栾" : "欒",
    "案" : "案",
    "桉" : "案",
    "桌" : "卓",
    "桑" : "桑",
    "桒" : "桑",
    "桜" : "桜",
    "桝" : "桝",
    "桟" : "桟",
    "档" : "档",
    "桥" : "橋",
    "桧" : "桧",
    "桮" : "杯",
    "桺" : "柳",
    "梅" : "梅",
    "條" : "条",
    "梥" : "松",
    "梦" : "夢",
    "梨" : "梨",
    "梼" : "梼",
    "棂" : "櫺",
    "棃" : "梨",
    "棄" : "棄",
    "棊" : "棋",
    "棋" : "棋",
    "棕" : "棕",
    "棧" : "桟",
    "棲" : "棲",
    "椗" : "碇",
    "椙" : "杉",
    "検" : "検",
    "椢" : "椢",
    "椶" : "棕",
    "椻" : "堰",
    "楕" : "楕",
    "楠" : "楠",
    "楫" : "楫",
    "楳" : "梅",
    "楼" : "楼",
    "楽" : "楽",
    "概" : "概",
    "榖" : "穀",
    "榦" : "幹",
    "榮" : "栄",
    "榴" : "榴",
    "槀" : "槁",
    "槁" : "槁",
    "槇" : "槙",
    "槌" : "槌",
    "槗" : "橋",
    "様" : "様",
    "槙" : "槙",
    "槞" : "槞",
    "槩" : "概",
    "槪" : "概",
    "槶" : "椢",
    "槼" : "規",
    "樂" : "楽",
    "樅" : "樅",
    "樒" : "樒",
    "樓" : "楼",
    "樞" : "枢",
    "樣" : "様",
    "権" : "権",
    "横" : "横",
    "樻" : "櫃",
    "橊" : "榴",
    "橋" : "橋",
    "橢" : "楕",
    "橫" : "横",
    "橱" : "厨",
    "檔" : "档",
    "檗" : "檗",
    "檜" : "桧",
    "檝" : "楫",
    "檢" : "検",
    "檪" : "櫟",
    "檮" : "梼",
    "櫁" : "樒",
    "櫃" : "櫃",
    "櫟" : "櫟",
    "櫨" : "櫨",
    "櫳" : "槞",
    "櫸" : "欅",
    "櫺" : "櫺",
    "櫻" : "桜",
    "欅" : "欅",
    "權" : "権",
    "欒" : "欒",
    "欝" : "欝",
    "欞" : "櫺",
    "欠" : "欠",
    "欣" : "欣",
    "欤" : "歟",
    "欧" : "欧",
    "欵" : "款",
    "欶" : "勅",
    "款" : "款",
    "歀" : "款",
    "歌" : "歌",
    "歐" : "欧",
    "歓" : "歓",
    "歟" : "歟",
    "歡" : "歓",
    "步" : "歩",
    "歩" : "歩",
    "歬" : "前",
    "歯" : "歯",
    "歲" : "歳",
    "歳" : "歳",
    "歴" : "歴",
    "歷" : "歴",
    "歸" : "帰",
    "歿" : "歿",
    "殁" : "歿",
    "残" : "残",
    "殘" : "残",
    "殱" : "殲",
    "殲" : "殲",
    "殴" : "殴",
    "殺" : "殺",
    "殻" : "殻",
    "殼" : "殻",
    "毀" : "毀",
    "毁" : "毀",
    "毆" : "殴",
    "毎" : "毎",
    "每" : "毎",
    "毓" : "育",
    "毗" : "毘",
    "毘" : "毘",
    "毟" : "毟",
    "毡" : "氈",
    "毮" : "毟",
    "氈" : "氈",
    "氊" : "氈",
    "気" : "気",
    "氣" : "気",
    "水" : "水",
    "氷" : "氷",
    "氺" : "水",
    "汙" : "汚",
    "汚" : "汚",
    "汳" : "汳",
    "汴" : "汳",
    "汹" : "洶",
    "決" : "決",
    "沈" : "沈",
    "沉" : "沈",
    "沍" : "冴",
    "沒" : "没",
    "沖" : "沖",
    "没" : "没",
    "沢" : "沢",
    "況" : "況",
    "法" : "法",
    "泥" : "泥",
    "泪" : "涙",
    "泯" : "泯",
    "洌" : "冽",
    "洶" : "洶",
    "浄" : "浄",
    "浅" : "浅",
    "浜" : "浜",
    "浩" : "浩",
    "涁" : "滲",
    "涉" : "渉",
    "涌" : "湧",
    "涙" : "涙",
    "涛" : "涛",
    "涜" : "涜",
    "涸" : "凅",
    "涼" : "涼",
    "淂" : "得",
    "淒" : "凄",
    "淨" : "浄",
    "淫" : "淫",
    "淳" : "淳",
    "淵" : "淵",
    "淸" : "清",
    "淺" : "浅",
    "清" : "清",
    "済" : "済",
    "渉" : "渉",
    "渊" : "淵",
    "渋" : "渋",
    "渓" : "渓",
    "渕" : "淵",
    "渗" : "滲",
    "減" : "減",
    "温" : "温",
    "湌" : "餐",
    "湧" : "湧",
    "湻" : "淳",
    "湾" : "湾",
    "湿" : "湿",
    "満" : "満",
    "溌" : "溌",
    "準" : "準",
    "溜" : "溜",
    "溪" : "渓",
    "溫" : "温",
    "溯" : "遡",
    "溼" : "湿",
    "滙" : "匯",
    "滚" : "滾",
    "滛" : "淫",
    "滝" : "滝",
    "滞" : "滞",
    "滯" : "滞",
    "滲" : "滲",
    "滾" : "滾",
    "滿" : "満",
    "漥" : "窪",
    "漫" : "漫",
    "潄" : "嗽",
    "潅" : "潅",
    "潑" : "溌",
    "潛" : "潜",
    "潜" : "潜",
    "潟" : "潟",
    "潴" : "瀦",
    "潸" : "潸",
    "澀" : "渋",
    "澁" : "渋",
    "澂" : "澄",
    "澄" : "澄",
    "澑" : "溜",
    "澔" : "浩",
    "澘" : "潸",
    "澙" : "潟",
    "澚" : "澳",
    "澤" : "沢",
    "澳" : "澳",
    "澷" : "漫",
    "濕" : "湿",
    "濟" : "済",
    "濤" : "涛",
    "濱" : "浜",
    "濳" : "潜",
    "濵" : "浜",
    "濶" : "闊",
    "瀆" : "涜",
    "瀦" : "瀦",
    "瀧" : "滝",
    "瀨" : "瀬",
    "瀬" : "瀬",
    "灋" : "法",
    "灌" : "潅",
    "灣" : "湾",
    "灮" : "光",
    "灯" : "灯",
    "灵" : "霊",
    "灶" : "竃",
    "災" : "災",
    "灾" : "災",
    "炉" : "炉",
    "炗" : "光",
    "炯" : "炯",
    "点" : "点",
    "為" : "為",
    "烖" : "災",
    "烟" : "煙",
    "烣" : "恢",
    "烬" : "燼",
    "烱" : "炯",
    "烽" : "烽",
    "焃" : "赫",
    "焇" : "銷",
    "焏" : "亟",
    "焔" : "焔",
    "無" : "無",
    "焰" : "焔",
    "焼" : "焼",
    "煅" : "鍛",
    "煑" : "煮",
    "煕" : "煕",
    "煙" : "煙",
    "煞" : "殺",
    "照" : "照",
    "煮" : "煮",
    "熈" : "煕",
    "熏" : "熏",
    "熙" : "煕",
    "熢" : "烽",
    "熳" : "漫",
    "熹" : "熹",
    "熺" : "熹",
    "燈" : "灯",
    "燒" : "焼",
    "營" : "営",
    "燮" : "燮",
    "燻" : "熏",
    "燼" : "燼",
    "燿" : "耀",
    "爀" : "赫",
    "爐" : "炉",
    "爕" : "燮",
    "爭" : "争",
    "爲" : "為",
    "爴" : "攫",
    "爼" : "俎",
    "爾" : "爾",
    "爿" : "爿",
    "牆" : "墻",
    "牎" : "窓",
    "牕" : "窓",
    "牢" : "牢",
    "犁" : "犂",
    "犂" : "犂",
    "犟" : "強",
    "犠" : "犠",
    "犧" : "犠",
    "犱" : "執",
    "犲" : "犲",
    "状" : "状",
    "狀" : "状",
    "狊" : "臭",
    "狌" : "猩",
    "狢" : "狢",
    "狥" : "徇",
    "独" : "独",
    "狭" : "狭",
    "狸" : "狸",
    "狹" : "狭",
    "猂" : "悍",
    "猊" : "猊",
    "猛" : "猛",
    "猟" : "猟",
    "猩" : "猩",
    "猪" : "猪",
    "献" : "献",
    "猯" : "猯",
    "獎" : "奨",
    "獏" : "獏",
    "獣" : "獣",
    "獨" : "独",
    "獵" : "猟",
    "獸" : "獣",
    "獻" : "献",
    "玅" : "妙",
    "率" : "率",
    "玳" : "玳",
    "玺" : "璽",
    "珍" : "珍",
    "珎" : "珍",
    "珡" : "琴",
    "珤" : "宝",
    "珱" : "瓔",
    "琅" : "琅",
    "琴" : "琴",
    "琹" : "琴",
    "瑇" : "玳",
    "瑙" : "瑙",
    "瑠" : "瑠",
    "瑤" : "瑶",
    "瑯" : "琅",
    "瑶" : "瑶",
    "璢" : "瑠",
    "璽" : "璽",
    "瓔" : "瓔",
    "瓣" : "弁",
    "瓫" : "盆",
    "瓯" : "甌",
    "瓶" : "瓶",
    "甁" : "瓶",
    "甇" : "罌",
    "甌" : "甌",
    "甞" : "嘗",
    "產" : "産",
    "産" : "産",
    "甪" : "角",
    "町" : "町",
    "画" : "画",
    "甼" : "町",
    "畄" : "留",
    "畆" : "畝",
    "畊" : "耕",
    "界" : "界",
    "畍" : "界",
    "畒" : "畝",
    "留" : "留",
    "畝" : "畝",
    "略" : "略",
    "畧" : "略",
    "畫" : "画",
    "畬" : "畭",
    "畭" : "畭",
    "畱" : "留",
    "畲" : "畭",
    "畳" : "畳",
    "畴" : "疇",
    "畵" : "画",
    "當" : "当",
    "畺" : "疆",
    "疂" : "畳",
    "疅" : "疆",
    "疆" : "疆",
    "疇" : "疇",
    "疉" : "畳",
    "疊" : "畳",
    "疎" : "疎",
    "疣" : "疣",
    "痩" : "痩",
    "痴" : "痴",
    "瘂" : "唖",
    "瘉" : "癒",
    "瘘" : "瘻",
    "瘤" : "瘤",
    "瘦" : "痩",
    "瘻" : "瘻",
    "癅" : "瘤",
    "癇" : "癇",
    "癎" : "癇",
    "癒" : "癒",
    "癡" : "痴",
    "癸" : "癸",
    "発" : "発",
    "發" : "発",
    "皃" : "貌",
    "皈" : "帰",
    "皋" : "皐",
    "皎" : "皎",
    "皐" : "皐",
    "皖" : "皖",
    "皷" : "鼓",
    "皸" : "皸",
    "皹" : "皸",
    "盃" : "杯",
    "盆" : "盆",
    "盖" : "蓋",
    "盗" : "盗",
    "盜" : "盗",
    "盡" : "尽",
    "盪" : "盪",
    "眂" : "視",
    "県" : "県",
    "眎" : "視",
    "眞" : "真",
    "真" : "真",
    "眡" : "視",
    "眥" : "眥",
    "眦" : "眥",
    "眷" : "眷",
    "眾" : "衆",
    "睠" : "眷",
    "睿" : "叡",
    "瞠" : "瞠",
    "瞩" : "矚",
    "瞪" : "瞠",
    "瞭" : "瞭",
    "瞰" : "瞰",
    "瞾" : "照",
    "矙" : "瞰",
    "矚" : "矚",
    "矢" : "矢",
    "矤" : "矧",
    "矦" : "侯",
    "矧" : "矧",
    "砕" : "砕",
    "砺" : "砺",
    "砿" : "砿",
    "碇" : "碇",
    "碍" : "碍",
    "碎" : "砕",
    "碕" : "埼",
    "碗" : "碗",
    "碯" : "瑙",
    "碱" : "鹸",
    "礙" : "碍",
    "礦" : "砿",
    "礪" : "砺",
    "示" : "示",
    "礻" : "示",
    "礼" : "礼",
    "祕" : "秘",
    "祢" : "祢",
    "祷" : "祷",
    "祿" : "禄",
    "禀" : "稟",
    "禄" : "禄",
    "禅" : "禅",
    "禒" : "禄",
    "禪" : "禅",
    "禮" : "礼",
    "禰" : "祢",
    "禱" : "祷",
    "秇" : "芸",
    "秊" : "年",
    "秋" : "秋",
    "秌" : "秋",
    "秔" : "粳",
    "秘" : "秘",
    "称" : "称",
    "稁" : "稿",
    "稅" : "税",
    "稉" : "粳",
    "税" : "税",
    "稗" : "稗",
    "稚" : "稚",
    "稟" : "稟",
    "稱" : "称",
    "稲" : "稲",
    "稸" : "蓄",
    "稺" : "稚",
    "稻" : "稲",
    "稾" : "稿",
    "稿" : "稿",
    "穀" : "穀",
    "穂" : "穂",
    "穉" : "稚",
    "穎" : "穎",
    "穏" : "穏",
    "穐" : "秋",
    "穗" : "穂",
    "穣" : "穣",
    "穩" : "穏",
    "穪" : "称",
    "穰" : "穣",
    "穷" : "窮",
    "突" : "突",
    "窂" : "牢",
    "窃" : "窃",
    "窓" : "窓",
    "窗" : "窓",
    "窪" : "窪",
    "窮" : "窮",
    "窯" : "窯",
    "窰" : "窯",
    "窻" : "窓",
    "竃" : "竃",
    "竆" : "窮",
    "竈" : "竃",
    "竊" : "窃",
    "竒" : "奇",
    "竗" : "妙",
    "竜" : "竜",
    "竝" : "並",
    "竞" : "競",
    "竪" : "竪",
    "競" : "競",
    "竸" : "競",
    "竻" : "筋",
    "笀" : "芒",
    "笄" : "笄",
    "笇" : "算",
    "笋" : "筍",
    "笌" : "芽",
    "笔" : "筆",
    "笗" : "苳",
    "笶" : "矢",
    "筆" : "筆",
    "筋" : "筋",
    "筍" : "筍",
    "筏" : "筏",
    "筐" : "筐",
    "筓" : "笄",
    "策" : "策",
    "筝" : "箏",
    "筭" : "算",
    "筱" : "篠",
    "筹" : "籌",
    "筺" : "筐",
    "箆" : "箆",
    "箏" : "箏",
    "算" : "算",
    "箚" : "剳",
    "箪" : "箪",
    "箰" : "筍",
    "節" : "節",
    "篏" : "嵌",
    "篠" : "篠",
    "篦" : "箆",
    "篭" : "篭",
    "簑" : "蓑",
    "簔" : "蓑",
    "簞" : "箪",
    "簡" : "簡",
    "簱" : "旗",
    "籌" : "籌",
    "籏" : "旗",
    "籐" : "籐",
    "籔" : "薮",
    "籖" : "籤",
    "籘" : "籐",
    "籠" : "篭",
    "籤" : "籤",
    "类" : "類",
    "粋" : "粋",
    "粛" : "粛",
    "粥" : "粥",
    "粮" : "糧",
    "粳" : "粳",
    "粹" : "粋",
    "粽" : "粽",
    "糆" : "麺",
    "糓" : "穀",
    "糧" : "糧",
    "糭" : "粽",
    "糸" : "糸",
    "糺" : "糾",
    "糾" : "糾",
    "紘" : "紘",
    "紙" : "紙",
    "累" : "累",
    "絅" : "絅",
    "絆" : "絆",
    "絋" : "絋",
    "経" : "経",
    "絕" : "絶",
    "絖" : "絋",
    "絛" : "絛",
    "絝" : "袴",
    "統" : "統",
    "絲" : "糸",
    "絵" : "絵",
    "絶" : "絶",
    "綂" : "統",
    "綋" : "紘",
    "經" : "経",
    "綗" : "絅",
    "継" : "継",
    "続" : "続",
    "綠" : "緑",
    "綫" : "線",
    "綳" : "繃",
    "総" : "総",
    "緑" : "緑",
    "緒" : "緒",
    "緕" : "纃",
    "緖" : "緒",
    "線" : "線",
    "緣" : "縁",
    "緥" : "褓",
    "緫" : "総",
    "縁" : "縁",
    "縂" : "総",
    "縄" : "縄",
    "縣" : "県",
    "縦" : "縦",
    "縧" : "絛",
    "縨" : "幌",
    "縱" : "縦",
    "縲" : "累",
    "總" : "総",
    "繃" : "繃",
    "繈" : "繦",
    "繊" : "繊",
    "繋" : "繋",
    "繍" : "繍",
    "繡" : "繍",
    "繦" : "繦",
    "繩" : "縄",
    "繪" : "絵",
    "繫" : "繋",
    "繼" : "継",
    "纃" : "纃",
    "纉" : "纉",
    "纊" : "絋",
    "續" : "続",
    "纎" : "繊",
    "纏" : "纏",
    "纒" : "纏",
    "纖" : "繊",
    "纘" : "纉",
    "缶" : "缶",
    "缺" : "欠",
    "缻" : "缶",
    "缼" : "欠",
    "缽" : "鉢",
    "罌" : "罌",
    "罎" : "壜",
    "罐" : "缶",
    "网" : "网",
    "罒" : "网",
    "罓" : "网",
    "罰" : "罰",
    "罵" : "罵",
    "罸" : "罰",
    "羃" : "冪",
    "羇" : "羈",
    "羈" : "羈",
    "羕" : "承",
    "羡" : "羨",
    "羣" : "群",
    "群" : "群",
    "羨" : "羨",
    "羪" : "養",
    "羮" : "羹",
    "羹" : "羹",
    "翆" : "翠",
    "翠" : "翠",
    "翻" : "翻",
    "耀" : "耀",
    "耊" : "耋",
    "耋" : "耋",
    "耕" : "耕",
    "耻" : "恥",
    "耽" : "耽",
    "聟" : "婿",
    "聡" : "聡",
    "聦" : "聡",
    "聨" : "聯",
    "聪" : "聡",
    "聯" : "聯",
    "聰" : "聡",
    "聲" : "声",
    "聴" : "聴",
    "職" : "職",
    "聽" : "聴",
    "肅" : "粛",
    "肇" : "肇",
    "肈" : "肇",
    "股" : "股",
    "肤" : "膚",
    "肧" : "胚",
    "肬" : "疣",
    "育" : "育",
    "胄" : "胄",
    "胆" : "胆",
    "胚" : "胚",
    "胷" : "胸",
    "胸" : "胸",
    "胼" : "胼",
    "脃" : "脆",
    "脆" : "脆",
    "脈" : "脈",
    "脉" : "脈",
    "脍" : "膾",
    "脚" : "脚",
    "脣" : "唇",
    "脫" : "脱",
    "脱" : "脱",
    "脳" : "脳",
    "脵" : "股",
    "脾" : "脾",
    "腁" : "胼",
    "腆" : "腆",
    "腗" : "脾",
    "腟" : "膣",
    "腦" : "脳",
    "腭" : "齶",
    "腳" : "脚",
    "腸" : "腸",
    "膂" : "膂",
    "膄" : "痩",
    "膐" : "膂",
    "膓" : "腸",
    "膚" : "膚",
    "膝" : "膝",
    "膣" : "膣",
    "膳" : "膳",
    "膸" : "髄",
    "膽" : "胆",
    "膾" : "膾",
    "臈" : "臘",
    "臓" : "臓",
    "臘" : "臘",
    "臟" : "臓",
    "臤" : "賢",
    "臥" : "臥",
    "臭" : "臭",
    "臯" : "皐",
    "臺" : "台",
    "與" : "与",
    "舉" : "挙",
    "舊" : "旧",
    "舋" : "釁",
    "舍" : "舎",
    "舎" : "舎",
    "舖" : "舗",
    "舗" : "舗",
    "舘" : "館",
    "舞" : "舞",
    "舩" : "船",
    "舮" : "艫",
    "舵" : "舵",
    "船" : "船",
    "艫" : "艫",
    "艱" : "艱",
    "艶" : "艶",
    "艷" : "艶",
    "艸" : "艸",
    "芒" : "芒",
    "芦" : "芦",
    "花" : "花",
    "芲" : "花",
    "芸" : "芸",
    "芻" : "芻",
    "芽" : "芽",
    "苑" : "園",
    "苡" : "苡",
    "苢" : "苡",
    "英" : "英",
    "苳" : "苳",
    "苺" : "苺",
    "茎" : "茎",
    "茘" : "茘",
    "荆" : "荊",
    "荊" : "荊",
    "荔" : "茘",
    "荘" : "荘",
    "荚" : "莢",
    "莅" : "莅",
    "莊" : "荘",
    "莓" : "苺",
    "莖" : "茎",
    "莢" : "莢",
    "莭" : "節",
    "莱" : "莱",
    "莵" : "兎",
    "菴" : "庵",
    "萊" : "莱",
    "萌" : "萌",
    "萕" : "薺",
    "萠" : "萌",
    "萬" : "万",
    "萱" : "萱",
    "萼" : "萼",
    "葊" : "庵",
    "葢" : "蓋",
    "葬" : "葬",
    "蒋" : "蒋",
    "蒞" : "莅",
    "蒭" : "芻",
    "蓄" : "蓄",
    "蓋" : "蓋",
    "蓑" : "蓑",
    "蔣" : "蒋",
    "蔧" : "彗",
    "蔴" : "麻",
    "蔵" : "蔵",
    "蔾" : "藜",
    "蕊" : "蕊",
    "蕋" : "蕊",
    "蕚" : "萼",
    "蕰" : "蘊",
    "蕳" : "簡",
    "蕿" : "萱",
    "薀" : "蘊",
    "薗" : "園",
    "薫" : "薫",
    "薬" : "薬",
    "薭" : "稗",
    "薮" : "薮",
    "薰" : "薫",
    "薺" : "薺",
    "藏" : "蔵",
    "藜" : "藜",
    "藝" : "芸",
    "藥" : "薬",
    "藪" : "薮",
    "藳" : "稿",
    "藴" : "蘊",
    "蘂" : "蕊",
    "蘃" : "蕊",
    "蘆" : "芦",
    "蘇" : "蘇",
    "蘊" : "蘊",
    "蘐" : "萱",
    "蘓" : "蘇",
    "蘗" : "檗",
    "蘯" : "盪",
    "虎" : "虎",
    "處" : "処",
    "虗" : "虚",
    "虚" : "虚",
    "虛" : "虚",
    "號" : "号",
    "虫" : "虫",
    "虱" : "虱",
    "虵" : "蛇",
    "虽" : "雖",
    "蚉" : "蚊",
    "蚊" : "蚊",
    "蚋" : "蚋",
    "蚕" : "蚕",
    "蛇" : "蛇",
    "蛍" : "蛍",
    "蛎" : "蛎",
    "蛛" : "蛛",
    "蛮" : "蛮",
    "蛽" : "貝",
    "蜂" : "蜂",
    "蜹" : "蚋",
    "蝇" : "蝿",
    "蝉" : "蝉",
    "蝋" : "蝋",
    "蝨" : "虱",
    "蝼" : "螻",
    "蝿" : "蝿",
    "螘" : "蟻",
    "螙" : "蠹",
    "螡" : "蚊",
    "螢" : "蛍",
    "螻" : "螻",
    "蟁" : "蚊",
    "蟆" : "蟇",
    "蟇" : "蟇",
    "蟒" : "蠎",
    "蟬" : "蝉",
    "蟲" : "虫",
    "蟵" : "蛛",
    "蟹" : "蟹",
    "蟻" : "蟻",
    "蠅" : "蝿",
    "蠎" : "蠎",
    "蠏" : "蟹",
    "蠟" : "蝋",
    "蠣" : "蛎",
    "蠧" : "蠹",
    "蠭" : "蜂",
    "蠶" : "蚕",
    "蠹" : "蠹",
    "蠻" : "蛮",
    "衂" : "衄",
    "衄" : "衄",
    "衅" : "釁",
    "衆" : "衆",
    "衇" : "脈",
    "衖" : "巷",
    "衘" : "銜",
    "衛" : "衛",
    "衞" : "衛",
    "衟" : "道",
    "衮" : "袞",
    "衽" : "衽",
    "袋" : "袋",
    "袞" : "袞",
    "袴" : "袴",
    "袵" : "衽",
    "装" : "装",
    "裆" : "襠",
    "裏" : "裏",
    "裙" : "裙",
    "裝" : "装",
    "裠" : "裙",
    "裡" : "裏",
    "裴" : "裴",
    "裵" : "裴",
    "裸" : "裸",
    "褒" : "褒",
    "褓" : "褓",
    "褝" : "襌",
    "襃" : "褒",
    "襌" : "襌",
    "襍" : "雑",
    "襠" : "襠",
    "襪" : "襪",
    "襭" : "襭",
    "襾" : "襾",
    "覀" : "襾",
    "覇" : "覇",
    "覊" : "羈",
    "規" : "規",
    "覓" : "覓",
    "覔" : "覓",
    "視" : "視",
    "覚" : "覚",
    "覧" : "覧",
    "観" : "観",
    "覺" : "覚",
    "覽" : "覧",
    "觀" : "観",
    "角" : "角",
    "觔" : "筋",
    "解" : "解",
    "触" : "触",
    "觧" : "解",
    "觸" : "触",
    "訳" : "訳",
    "訶" : "訶",
    "訷" : "伸",
    "証" : "証",
    "詠" : "詠",
    "誉" : "誉",
    "說" : "説",
    "説" : "説",
    "読" : "読",
    "諌" : "諌",
    "諡" : "謚",
    "諩" : "譜",
    "諫" : "諌",
    "諬" : "啓",
    "謌" : "歌",
    "謚" : "謚",
    "謠" : "謡",
    "謡" : "謡",
    "謫" : "謫",
    "譁" : "嘩",
    "證" : "証",
    "譖" : "譖",
    "譛" : "譖",
    "譜" : "譜",
    "譟" : "噪",
    "譯" : "訳",
    "譱" : "善",
    "譲" : "譲",
    "譽" : "誉",
    "讀" : "読",
    "讁" : "謫",
    "讃" : "讃",
    "變" : "変",
    "讎" : "讐",
    "讐" : "讐",
    "讓" : "譲",
    "讚" : "讃",
    "谺" : "谺",
    "谿" : "渓",
    "豊" : "豊",
    "豎" : "竪",
    "豐" : "豊",
    "豓" : "艶",
    "豔" : "艶",
    "豫" : "予",
    "豬" : "猪",
    "豺" : "犲",
    "豼" : "貔",
    "貂" : "貂",
    "貉" : "狢",
    "貌" : "貌",
    "貍" : "狸",
    "貎" : "猊",
    "貒" : "猯",
    "貔" : "貔",
    "貘" : "獏",
    "貝" : "貝",
    "財" : "財",
    "貭" : "質",
    "貮" : "弐",
    "貳" : "弐",
    "賍" : "贓",
    "賎" : "賎",
    "賓" : "賓",
    "賔" : "賓",
    "賛" : "賛",
    "賢" : "賢",
    "賣" : "売",
    "賤" : "賎",
    "質" : "質",
    "賫" : "齎",
    "賬" : "帳",
    "賴" : "頼",
    "賷" : "齎",
    "贁" : "敗",
    "贊" : "賛",
    "贓" : "贓",
    "贜" : "贓",
    "赫" : "赫",
    "走" : "走",
    "赱" : "走",
    "跡" : "跡",
    "践" : "践",
    "踈" : "疎",
    "踊" : "踊",
    "踌" : "躊",
    "踐" : "践",
    "踴" : "踊",
    "蹄" : "蹄",
    "蹏" : "蹄",
    "蹔" : "暫",
    "蹟" : "跡",
    "蹴" : "蹴",
    "蹵" : "蹴",
    "蹶" : "蹶",
    "蹷" : "蹶",
    "躊" : "躊",
    "躙" : "躙",
    "躪" : "躙",
    "躬" : "躬",
    "躭" : "耽",
    "躯" : "躯",
    "躰" : "体",
    "躳" : "躬",
    "躶" : "裸",
    "軀" : "躯",
    "軄" : "職",
    "軆" : "体",
    "転" : "転",
    "軣" : "轟",
    "軰" : "輩",
    "軽" : "軽",
    "輀" : "轜",
    "輌" : "輌",
    "輒" : "輙",
    "輕" : "軽",
    "輙" : "輙",
    "輛" : "輌",
    "輜" : "輜",
    "輩" : "輩",
    "輺" : "輜",
    "轄" : "轄",
    "轉" : "転",
    "轜" : "轜",
    "轟" : "轟",
    "辞" : "辞",
    "辢" : "辣",
    "辣" : "辣",
    "辧" : "弁",
    "辨" : "弁",
    "辭" : "辞",
    "辯" : "弁",
    "辺" : "辺",
    "迈" : "邁",
    "迥" : "迥",
    "迩" : "迩",
    "迪" : "廸",
    "迫" : "迫",
    "迯" : "逃",
    "迴" : "廻",
    "迹" : "跡",
    "迺" : "廼",
    "逃" : "逃",
    "逈" : "迥",
    "逎" : "遒",
    "逓" : "逓",
    "逕" : "径",
    "逹" : "達",
    "遅" : "遅",
    "遒" : "遒",
    "道" : "道",
    "達" : "達",
    "遙" : "遥",
    "遞" : "逓",
    "遡" : "遡",
    "遥" : "遥",
    "遲" : "遅",
    "邁" : "邁",
    "邇" : "迩",
    "邉" : "辺",
    "邊" : "辺",
    "邑" : "邑",
    "郎" : "郎",
    "郞" : "郎",
    "部" : "部",
    "郶" : "部",
    "郷" : "郷",
    "鄕" : "郷",
    "鄰" : "隣",
    "酉" : "酉",
    "酔" : "酔",
    "酙" : "斟",
    "酢" : "酢",
    "酧" : "酬",
    "酬" : "酬",
    "醇" : "醇",
    "醉" : "酔",
    "醋" : "酢",
    "醎" : "鹸",
    "醕" : "醇",
    "醗" : "醗",
    "醤" : "醤",
    "醫" : "医",
    "醬" : "醤",
    "醱" : "醗",
    "醸" : "醸",
    "釀" : "醸",
    "釁" : "釁",
    "釈" : "釈",
    "釋" : "釈",
    "野" : "野",
    "釜" : "釜",
    "釡" : "釜",
    "釼" : "剣",
    "鈆" : "鉛",
    "鈎" : "鈎",
    "鈩" : "鑪",
    "鈬" : "鐸",
    "鉄" : "鉄",
    "鉇" : "鉈",
    "鉈" : "鉈",
    "鉛" : "鉛",
    "鉢" : "鉢",
    "鉤" : "鈎",
    "鉱" : "鉱",
    "銕" : "鉄",
    "銜" : "銜",
    "銭" : "銭",
    "銷" : "銷",
    "鋪" : "舗",
    "鋳" : "鋳",
    "錄" : "録",
    "錙" : "錙",
    "錢" : "銭",
    "録" : "録",
    "鍛" : "鍛",
    "鍫" : "鍬",
    "鍬" : "鍬",
    "鍳" : "鑑",
    "鍿" : "錙",
    "鎋" : "轄",
    "鎌" : "鎌",
    "鎖" : "鎖",
    "鎭" : "鎮",
    "鎮" : "鎮",
    "鎻" : "鎖",
    "鏁" : "鎖",
    "鏥" : "鏥",
    "鏽" : "鏥",
    "鐡" : "鉄",
    "鐮" : "鎌",
    "鐵" : "鉄",
    "鐸" : "鐸",
    "鑄" : "鋳",
    "鑑" : "鑑",
    "鑒" : "鑑",
    "鑚" : "鑽",
    "鑛" : "鉱",
    "鑪" : "鑪",
    "鑽" : "鑽",
    "長" : "長",
    "镸" : "長",
    "閇" : "閉",
    "閉" : "閉",
    "開" : "開",
    "閏" : "閏",
    "閒" : "間",
    "間" : "間",
    "閙" : "閙",
    "閞" : "関",
    "閠" : "閏",
    "関" : "関",
    "閴" : "闃",
    "閹" : "閹",
    "闃" : "闃",
    "闊" : "闊",
    "闘" : "闘",
    "關" : "関",
    "阦" : "陽",
    "阯" : "址",
    "阳" : "陽",
    "阴" : "陰",
    "陀" : "陀",
    "陁" : "陀",
    "陜" : "陜",
    "陟" : "陟",
    "陥" : "陥",
    "陦" : "陦",
    "陰" : "陰",
    "陷" : "陥",
    "険" : "険",
    "陽" : "陽",
    "陿" : "陜",
    "隂" : "陰",
    "階" : "階",
    "随" : "随",
    "隝" : "島",
    "隠" : "隠",
    "隣" : "隣",
    "隨" : "随",
    "險" : "険",
    "隯" : "陦",
    "隱" : "隠",
    "隲" : "隲",
    "隷" : "隷",
    "隸" : "隷",
    "隽" : "雋",
    "雁" : "雁",
    "雋" : "雋",
    "雑" : "雑",
    "雖" : "雖",
    "雙" : "双",
    "雛" : "雛",
    "雜" : "雑",
    "雞" : "鶏",
    "難" : "難",
    "雷" : "雷",
    "霊" : "霊",
    "霛" : "霊",
    "霸" : "覇",
    "靁" : "雷",
    "靈" : "霊",
    "靍" : "鶴",
    "靎" : "鶴",
    "靏" : "鶴",
    "靑" : "青",
    "青" : "青",
    "静" : "静",
    "靜" : "静",
    "面" : "面",
    "靣" : "面",
    "靫" : "靭",
    "靭" : "靭",
    "靱" : "靭",
    "靴" : "靴",
    "靽" : "絆",
    "鞱" : "韜",
    "鞾" : "靴",
    "韈" : "襪",
    "韌" : "靭",
    "韜" : "韜",
    "韭" : "韮",
    "韮" : "韮",
    "韲" : "齏",
    "韵" : "韻",
    "韻" : "韻",
    "頚" : "頚",
    "頤" : "頤",
    "頥" : "頤",
    "頬" : "頬",
    "頰" : "頬",
    "頴" : "穎",
    "頸" : "頚",
    "頹" : "頽",
    "頼" : "頼",
    "頽" : "頽",
    "頾" : "髭",
    "顏" : "顔",
    "顔" : "顔",
    "顕" : "顕",
    "顚" : "顛",
    "顛" : "顛",
    "類" : "類",
    "顯" : "顕",
    "風" : "風",
    "颷" : "飆",
    "飃" : "飄",
    "飄" : "飄",
    "飆" : "飆",
    "飇" : "飆",
    "飈" : "飆",
    "飊" : "飆",
    "飜" : "翻",
    "飮" : "飲",
    "飯" : "飯",
    "飰" : "飯",
    "飲" : "飲",
    "飾" : "飾",
    "餅" : "餅",
    "養" : "養",
    "餐" : "餐",
    "餘" : "余",
    "餙" : "飾",
    "餝" : "飾",
    "餠" : "餅",
    "館" : "館",
    "饍" : "膳",
    "馱" : "駄",
    "馿" : "驢",
    "駄" : "駄",
    "駅" : "駅",
    "駆" : "駆",
    "駈" : "駆",
    "駡" : "罵",
    "駢" : "駢",
    "騈" : "駢",
    "騐" : "験",
    "騒" : "騒",
    "験" : "験",
    "騨" : "騨",
    "騭" : "隲",
    "騷" : "騒",
    "騾" : "騾",
    "驅" : "駆",
    "驒" : "騨",
    "驕" : "驕",
    "驗" : "験",
    "驘" : "騾",
    "驛" : "駅",
    "驢" : "驢",
    "骵" : "体",
    "髄" : "髄",
    "髓" : "髄",
    "體" : "体",
    "高" : "高",
    "髙" : "高",
    "髥" : "髯",
    "髩" : "鬢",
    "髪" : "髪",
    "髭" : "髭",
    "髮" : "髪",
    "髯" : "髯",
    "髴" : "彿",
    "鬂" : "鬢",
    "鬓" : "鬢",
    "鬢" : "鬢",
    "鬧" : "閙",
    "鬪" : "闘",
    "鬱" : "欝",
    "鬻" : "粥",
    "魚" : "魚",
    "魲" : "鱸",
    "魳" : "鰤",
    "鯵" : "鯵",
    "鰛" : "鰮",
    "鰤" : "鰤",
    "鰮" : "鰮",
    "鰺" : "鯵",
    "鱉" : "鼈",
    "鱸" : "鱸",
    "鱼" : "魚",
    "鳧" : "鳧",
    "鳫" : "雁",
    "鳬" : "鳧",
    "鳯" : "鳳",
    "鳳" : "鳳",
    "鴈" : "雁",
    "鴉" : "鴉",
    "鴎" : "鴎",
    "鴟" : "鴟",
    "鴬" : "鴬",
    "鵄" : "鴟",
    "鵝" : "鵝",
    "鵞" : "鵝",
    "鵶" : "鴉",
    "鵾" : "鶤",
    "鶇" : "鶇",
    "鶏" : "鶏",
    "鶤" : "鶤",
    "鶫" : "鶇",
    "鶯" : "鴬",
    "鶴" : "鶴",
    "鶵" : "雛",
    "鷄" : "鶏",
    "鷆" : "鷆",
    "鷏" : "鷆",
    "鷗" : "鴎",
    "鸎" : "鴬",
    "鹸" : "鹸",
    "鹹" : "鹸",
    "鹼" : "鹸",
    "鹽" : "塩",
    "麥" : "麦",
    "麦" : "麦",
    "麩" : "麩",
    "麪" : "麺",
    "麫" : "麺",
    "麬" : "麩",
    "麴" : "麹",
    "麵" : "麺",
    "麸" : "麩",
    "麹" : "麹",
    "麺" : "麺",
    "麻" : "麻",
    "麼" : "麼",
    "麽" : "麼",
    "黃" : "黄",
    "黄" : "黄",
    "黑" : "黒",
    "黒" : "黒",
    "默" : "黙",
    "黙" : "黙",
    "點" : "点",
    "黨" : "党",
    "鼈" : "鼈",
    "鼓" : "鼓",
    "鼔" : "鼓",
    "鼠" : "鼠",
    "鼡" : "鼠",
    "鼦" : "貂",
    "齅" : "嗅",
    "齊" : "斉",
    "齋" : "斎",
    "齎" : "齎",
    "齏" : "齏",
    "齒" : "歯",
    "齓" : "齔",
    "齔" : "齔",
    "齡" : "齢",
    "齢" : "齢",
    "齧" : "囓",
    "齶" : "齶",
    "龍" : "竜",
    "龜" : "亀",
    "龝" : "秋",
    "龟" : "亀",
    "﨑" : "崎"
  };

  win.oldToNew = function(str) {
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
      var charater = oldNewKanjiMap[str[i]];
      if (!!charater && charater != str[i]) {
        newStr += charater;
      } else {
        newStr += str[i];
      }
    }
    return newStr;
  };

  var half2FullKataMap = {
    "ｶﾞ" : "ガ",
    "ｷﾞ" : "ギ",
    "ｸﾞ" : "グ",
    "ｹﾞ" : "ゲ",
    "ｺﾞ" : "ゴ",
    "ｻﾞ" : "ザ",
    "ｼﾞ" : "ジ",
    "ｽﾞ" : "ズ",
    "ｾﾞ" : "ゼ",
    "ｿﾞ" : "ゾ",
    "ﾀﾞ" : "ダ",
    "ﾁﾞ" : "ヂ",
    "ﾂﾞ" : "ヅ",
    "ﾃﾞ" : "デ",
    "ﾄﾞ" : "ド",
    "ﾊﾞ" : "バ",
    "ﾊﾟ" : "パ",
    "ﾋﾞ" : "ビ",
    "ﾋﾟ" : "ピ",
    "ﾌﾞ" : "ブ",
    "ﾌﾟ" : "プ",
    "ﾍﾞ" : "ベ",
    "ﾍﾟ" : "ペ",
    "ﾎﾞ" : "ボ",
    "ﾎﾟ" : "ポ",
    "ｳﾞ" : "ヴ",
    "ｧ" : "ァ",
    "ｱ" : "ア",
    "ｨ" : "ィ",
    "ｲ" : "イ",
    "ｩ" : "ゥ",
    "ｳ" : "ウ",
    "ｪ" : "ェ",
    "ｴ" : "エ",
    "ｫ" : "ォ",
    "ｵ" : "オ",
    "ｶ" : "カ",
    "ｷ" : "キ",
    "ｸ" : "ク",
    "ｹ" : "ケ",
    "ｺ" : "コ",
    "ｻ" : "サ",
    "ｼ" : "シ",
    "ｽ" : "ス",
    "ｾ" : "セ",
    "ｿ" : "ソ",
    "ﾀ" : "タ",
    "ﾁ" : "チ",
    "ｯ" : "ッ",
    "ﾂ" : "ツ",
    "ﾃ" : "テ",
    "ﾄ" : "ト",
    "ﾅ" : "ナ",
    "ﾆ" : "ニ",
    "ﾇ" : "ヌ",
    "ﾈ" : "ネ",
    "ﾉ" : "ノ",
    "ﾊ" : "ハ",
    "ﾋ" : "ヒ",
    "ﾌ" : "フ",
    "ﾍ" : "ヘ",
    "ﾎ" : "ホ",
    "ﾏ" : "マ",
    "ﾐ" : "ミ",
    "ﾑ" : "ム",
    "ﾒ" : "メ",
    "ﾓ" : "モ",
    "ｬ" : "ャ",
    "ﾔ" : "ヤ",
    "ｭ" : "ュ",
    "ﾕ" : "ユ",
    "ｮ" : "ョ",
    "ﾖ" : "ヨ",
    "ﾗ" : "ラ",
    "ﾘ" : "リ",
    "ﾙ" : "ル",
    "ﾚ" : "レ",
    "ﾛ" : "ロ",
    "ﾜ" : "ワ",
    "ｦ" : "ヲ",
    "ﾝ" : "ン",
    "｡" : "。",
    "｢" : "「",
    "｣" : "」",
    "､" : "、",
    "･" : "・",
    "ｰ" : "ー",
    "ﾞ" : "゛",
    "ﾟ" : "゜"
  };
  var full2HalfKataMap = {
    "ガ" : "ｶﾞ",
    "ギ" : "ｷﾞ",
    "グ" : "ｸﾞ",
    "ゲ" : "ｹﾞ",
    "ゴ" : "ｺﾞ",
    "ザ" : "ｻﾞ",
    "ジ" : "ｼﾞ",
    "ズ" : "ｽﾞ",
    "ゼ" : "ｾﾞ",
    "ゾ" : "ｿﾞ",
    "ダ" : "ﾀﾞ",
    "ヂ" : "ﾁﾞ",
    "ヅ" : "ﾂﾞ",
    "デ" : "ﾃﾞ",
    "ド" : "ﾄﾞ",
    "バ" : "ﾊﾞ",
    "パ" : "ﾊﾟ",
    "ビ" : "ﾋﾞ",
    "ピ" : "ﾋﾟ",
    "ブ" : "ﾌﾞ",
    "プ" : "ﾌﾟ",
    "ベ" : "ﾍﾞ",
    "ペ" : "ﾍﾟ",
    "ボ" : "ﾎﾞ",
    "ポ" : "ﾎﾟ",
    "ヴ" : "ｳﾞ",
    "ァ" : "ｧ",
    "ア" : "ｱ",
    "ィ" : "ｨ",
    "イ" : "ｲ",
    "ゥ" : "ｩ",
    "ウ" : "ｳ",
    "ェ" : "ｪ",
    "エ" : "ｴ",
    "ォ" : "ｫ",
    "オ" : "ｵ",
    "カ" : "ｶ",
    "キ" : "ｷ",
    "ク" : "ｸ",
    "ケ" : "ｹ",
    "コ" : "ｺ",
    "サ" : "ｻ",
    "シ" : "ｼ",
    "ス" : "ｽ",
    "セ" : "ｾ",
    "ソ" : "ｿ",
    "タ" : "ﾀ",
    "チ" : "ﾁ",
    "ッ" : "ｯ",
    "ツ" : "ﾂ",
    "テ" : "ﾃ",
    "ト" : "ﾄ",
    "ナ" : "ﾅ",
    "ニ" : "ﾆ",
    "ヌ" : "ﾇ",
    "ネ" : "ﾈ",
    "ノ" : "ﾉ",
    "ハ" : "ﾊ",
    "ヒ" : "ﾋ",
    "フ" : "ﾌ",
    "ヘ" : "ﾍ",
    "ホ" : "ﾎ",
    "マ" : "ﾏ",
    "ミ" : "ﾐ",
    "ム" : "ﾑ",
    "メ" : "ﾒ",
    "モ" : "ﾓ",
    "ャ" : "ｬ",
    "ヤ" : "ﾔ",
    "ュ" : "ｭ",
    "ユ" : "ﾕ",
    "ョ" : "ｮ",
    "ヨ" : "ﾖ",
    "ラ" : "ﾗ",
    "リ" : "ﾘ",
    "ル" : "ﾙ",
    "レ" : "ﾚ",
    "ロ" : "ﾛ",
    "ワ" : "ﾜ",
    "ヲ" : "ｦ",
    "ン" : "ﾝ",
    "。" : "｡",
    "「" : "｢",
    "」" : "｣",
    "、" : "､",
    "・" : "･",
    "ー" : "ｰ",
    "゛" : "ﾞ",
    "゜" : "ﾟ"
  };
  win.half2FullKata = function(string) {
    var l = string.length;
    var result = "";
    for (var i = 0; i < l; i++) {
      var charater = string[i];
      if (charater.search(/[ｧ-ﾟｰ]/) == 0) {
        // 濁点などを先に判定
        var full = half2FullKataMap[charater + string[i + 1]];
        if (!!full) {
          i++;
        } else {
          full = half2FullKataMap[charater];
        }
        if (!!full) {
          result += full;
        } else {
          result += charater;
        }
      } else {
        result += charater;
      }
    }
    return result;
  };

  win.full2HalfKata = function(string) {
    var l = string.length;
    var result = "";
    for (var i = 0; i < l; i++) {
      var charater = string[i];
      var full = full2HalfKataMap[charater];
      if (!!full) {
        result += full;
      } else {
        result += charater;
      }
    }
    return result;
  };

  // @QueryParam end.

  // @GlobalNavigation
  FRONTMOCK.GlobalNavigation = (function() {
    return {
      initLocalStrage : _initLocalStrage,
      initNotification : _initNotification,
      bindNotificationActions : _bindNotificationActions,
      notify_markAllRead : _notify_markAllRead,
      notify_markRead : _notify_markRead,
      notify_addData : _notify_addData,
      chat_setNeonChat : _chat_setNeonChat
    };

    var _isNotificationInitDone = false;

    function _initLocalStrage() {
      FRONTMOCK.Ajax.getJson('../../pages/global-navigation/data/notification-data.json', function(data) {
        FRONTMOCK.LocalStorage.put('notify_cnt', data['notify_cnt']);
        FRONTMOCK.LocalStorage.put('notify_data', data);
      });
    }
    function _initNotification() {
      // set up connect
      var notificationWebSocketClient;
      try {
        goog.require('wap.common.websocket.power.Client');
        notificationWebSocketClient = wap.common.websocket.power.Client.instance();
      } catch (err) {
        console
            .log("You need to include google closure library and power socket library to support notifications and chat. Check 'Includes' part http://localhost:8080/company-FRONTMOCK-mock-front/samples/uimock/notification.html");
        return;
      }

      notificationWebSocketClient.addProcessor("notification", {
        onMessage : function(notificationWebsocketEnvelope) {
          var notifications = notificationWebsocketEnvelope.command.notifications;
          var onlyNew = notificationWebsocketEnvelope.onlyNew;

          if (!_isNotificationInitDone || onlyNew) {
            FRONTMOCK.Notification.addNotifications(notifications, onlyNew);
          }
          _isNotificationInitDone = true;
        },
        onOpen : function() {
          notificationWebSocketClient.send({
            "target" : "notification",
            "user" : FRONTMOCK.UserData.getName(),
            "command" : {
              "action" : "connect"
            }
          });
        }
      });
    }

    function _bindNotificationActions() {
      $(document).on('click', '.mark-all-read', function() {
        FRONTMOCK.GlobalNavigation.notify_markAllRead();
      });
      $(document).on('click', '#global-notification .notify > a', function() {
        FRONTMOCK.GlobalNavigation.notify_markRead($(this).closest('li'));
      });
      $(document).on('click', '#global-notification .btn-default', function(event) {
        FRONTMOCK.GlobalNavigation.notify_markRead($(this).closest('li'));
        event.stopPropagation();
        var opts = {
          position : "top-right"
        };
        wapToaster.info("Submit successfully", "Quick Response", opts);
      });
      $(document).on('click', '#global-notification .btn-group .dropdown-toggle', function(event) {
        event.stopPropagation();
      });
      $(document).on('click', '#global-notification .btn-group .dropdown-menu a', function(event) {
        FRONTMOCK.GlobalNavigation.notify_markRead($(this).parent().parent().closest('li'));
        event.stopPropagation();
      });

    }

    function _notify_markAllRead() {
      $('#global-notification .dropdown-menu-list .notify').each(function() {
        FRONTMOCK.GlobalNavigation.notify_markRead($(this));
      });
    }
    function _notify_markRead($target) {
      var id = $target.attr('id');

      $.ajax({
        url : "../../data/notify/read",
        type : "post",
        async : false,
        data : {
          "id" : id
        },
        success : function(resJSON) {
          var newCount = Number($('.notification-badge').text()) - 1;
          FRONTMOCK.Notification.updateCount(newCount);
          $target.remove();
        }
      });
    }
    function _notify_addData($data) {
      FRONTMOCK.Util.lotateIcon('#global-notification .wap-icon-bell');
      $('#global-notification .dropdown-menu-list li.nothing-new').hide();

      var notify_cnt = FRONTMOCK.LocalStorage.get('notify_cnt') + 1, notify_data = {}, notify_list = [], notify = FRONTMOCK.LocalStorage
          .get('notify_data')['notify'];
      FRONTMOCK.LocalStorage.put('notify_cnt', notify_cnt);
      $('#global-notification .notification-badge, #global-notification .new-cnt').text(notify_cnt);
      $('#global-notification .notification-badge').show();

      notify_list.push($data);
      for (var i = 0; i < notify.length; i++) {
        notify_list.push(notify[i]);
      }
      var temp = Hogan.compile($('#notification-template').text());
      $('#global-notification .dropdown-menu-list').prepend(temp.render({
        'notify' : $data
      }));
      notify_data['notify_cnt'] = notify_cnt;
      notify_data['notify'] = notify_list;
      FRONTMOCK.LocalStorage.put('notify_data', notify_data);

      // TODO HOME画面だったら、Portalのデータにも反映させる

    }
    function _chat_setNeonChat() {

      if (!wap || !wap.common || !wap.common.chat || !wap.common.chat.ChatManager) {
        return;
      }

      try {
        FRONTMOCK.chatManager = FRONTMOCK.chatManager || new wap.common.chat.ChatManager();
        var chatManager = FRONTMOCK.chatManager;

        $("chat-inner").html("");
        $a = $(".nav").find(".wap-icon-bubbles").parent();
        $a.unbind();

        var $div = $("#myMainPanel");
        if ($div.length == 0) {
          $div = $("<div id='myMainPanel' style='position:absolute; z-index:10000; top:50px; wdith:250px; height:80%; right:10px'></div>");
          $("body").append($div);

        }
        chatManager.renderMainPanel({
          embed : $div[0],
          me : [
            FRONTMOCK.UserData.getName(), "PlaceHolder Name", "PlaceHolder.jpg"
          ]
        });
        $div.addClass("chat-hidden");

        var count = 0;
        $a
            .click(function(event) {
              if (count == 0) {
                var $div = $("#myMainPanel");
                if ($div.length == 0) {
                  $div = $("<div id='myMainPanel' style='position:absolute; z-index:10000; top:50px; wdith:250px; height:80%; right:10px'></div>");
                  $("body").append($div);

                }
                chatManager.renderMainPanel({
                  embed : $div[0],
                  me : [
                    FRONTMOCK.UserData.getName(), "PlaceHolder Name", "PlaceHolder.jpg"
                  ]
                });
                $div.removeClass();
                $div.addClass("bounceInDown");
                $div.one("webkitAnimationEnd", function() {
                  $(this).removeClass("bounceInDown");
                });

              } else {

                var $div = $("#myMainPanel");
                if ($div.length == 0) {
                  $div = $("<div id='myMainPanel' style='position:absolute; z-index:10000; top:50px; wdith:250px; height:80%; right:10px'></div>");
                  $("body").append($div);

                }

                chatManager.renderMainPanel({
                  embed : $div[0],
                  me : [
                    FRONTMOCK.UserData.getName(), "PlaceHolder Name", "PlaceHolder.jpg"
                  ]
                });
                $div.removeClass();
                $div.addClass("moveOutUp");
              }
              count = 1 - count;
            });

      } catch (exception) {
        console.error("Need to include google closure library for initialize Chat function");

      }
    }
  })();
  // @GlobalNavigation end
	var _today = new Date("8 Jun 2015");
  FRONTMOCK.Today = (function() {
    return {
      getToday : _getToday
    };
    function _getToday() {
      return _today;
    }
  })();

  if (navigator.userAgent.indexOf('Macintosh') >= 0 && navigator.userAgent.indexOf('Macintosh') >= 0) {
    $(document.body).addClass('mac-chrome');
  }

  if (!FRONTMOCK.fontSizeAlterer) { // sometimes called twice?
    var fontSizeAlterer = (function() {
      var current = 0;
      var candidates = [
        'font12', 'font14', 'font16', 'font18'
      ];
      function setSize() {
        $(document.body).removeClass(candidates.join(' ')).addClass(candidates[current]);
      }
      return {
        up : function() {
          if (candidates[current + 1])
            current++;
          setSize();
        },
        down : function() {
          if (candidates[current - 1])
            current--;
          setSize();
        },
        set : function(zero_to_three) {
          current = zero_to_three;
          setSize();
        }
      }
    })();
    $(document).on('keydown', function(e) {
      if (!e.shiftKey || !e.ctrlKey)
        return;
      if (e.keyCode == 40) {
        fontSizeAlterer.down();
      } else if (e.keyCode == 38) {
        fontSizeAlterer.up();
      }
    });
    fontSizeAlterer.set(1);
    FRONTMOCK.fontSizeAlterer = fontSizeAlterer;
  }

  // window.addEventListener("storage",function(e){
  // if (e.key.indexOf('notify')) FRONTMOCK.Notification.setCount();
  // },false);

})(jQuery, window);
