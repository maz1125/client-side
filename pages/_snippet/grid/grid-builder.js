(function($){

  GridBuilder = function() {
    this.columnPath_;
    this.optionPath_;
    this.dataPath_;
    
    this.suggestionData_ = [];
  };

  GridBuilder.prototype.columnPath = function(columnPath) {
    this.columnPath_ = columnPath;
    return this;
  };

  GridBuilder.prototype.optionPath = function(optionPath) {
    this.optionPath_ = optionPath;
    return this;
  };

  GridBuilder.prototype.dataPath = function(dataPath) {
    this.dataPath_ = dataPath;
    return this;
  };

  /**
   * @param {string} column column id
   * @param {string} dataPath suggestion data path for auto-complete
   * @param {string} opt_templateFunc suggestion layout function
   */
  GridBuilder.prototype.injectSuggestionData = function(column, dataPath, opt_templateFunc) {
    this.suggestionData_.push({
      'column': column,
      'dataPath': dataPath,
      'opt_templateFunc': opt_templateFunc
    });
    return this;
  };

  GridBuilder.prototype.build = function($container) {
    if ($container.height() <= 0) {
      throw '[GridBuildException] Grid container height should be specified.';
    }
    if (!this.columnPath_) {
      throw '[GridBuildException] Columns def should be configured. call #columnPath before #create.';
    }
    var defer = $.Deferred();
    var columnPromise = ResourceLoader.loadJson(this.columnPath_);
    var optionPromise = !!this.optionPath_ ? ResourceLoader.loadJson(this.optionPath_) : $.Deferred().resolve({}).promise();
    var dataPromise = !!this.dataPath_ ? ResourceLoader.loadJson(this.dataPath_) : $.Deferred().resolve([]).promise();
    $.when(columnPromise, optionPromise, dataPromise).then(function(columns, option, data) {
      var idCol;
      $.each(columns, function(idx, col) {
        if (col.isId) {
          idCol = col;
        }
      });
      if (!idCol) {
        defer.reject();
        throw '[GridBuildException] id-column does not exists. only one column should be assigned to id-column.';
      }

      var grid = new wap.fw.ui.SlickGrid.Grid(columns, option);
      grid.render($container.get(0));
      grid.setItems(data, idCol.id, true);
      
      $.each(this.suggestionData_, function(idx, conf) {
        this.bindSuggestionData_(grid, conf);
      }.bind(this));

      defer.resolve(grid);
    }.bind(this));
    return defer.promise();
  };

  GridBuilder.prototype.bindSuggestionData_ = function(grid, conf) {
    var column = conf.column;
    var colIdx = grid.getColumnIndex(column);
    var editor = grid.getEditor(null, colIdx);
    var name = 'grid_' + column;
    var autocompleteSetting = [{
      method : 'setDisplayKey',
      name : name,
      value : 'word'
    }];
    if (!!conf.opt_templateFunc) {
      autocompleteSetting.push({
        method : 'setTemplates',
        name : name,
        value : {
          suggestion : conf.opt_templateFunc
        }
      })
    }
    ResourceLoader.loadJson(conf.dataPath).then(function(data) {
      editor.setInitialize([{
        name : name,
        data : data
      }], {
        history : false,
        filter : null,
        autoComplete : autocompleteSetting
      });
    });
  };

}(jQuery));