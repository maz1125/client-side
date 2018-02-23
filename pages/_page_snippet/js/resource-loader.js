(function($){
  
  ResourceLoader = {};

  ResourceLoader.loadHtml = function(path) {
    var defer = $.Deferred();
    $.ajax({
      type : 'GET',
      dataType : 'html',
      url : path,
      async : true
    }).done(function(html) {
      defer.resolve(html);
    }).fail(function(err) {
      console.error(err);
      defer.reject(err);
    });
    return defer.promise();
  };
  
  ResourceLoader.loadJson = function(path) {
    var defer = $.Deferred();
    if (!path) {
      return defer.resolve({});
    }
    $.ajax({
      type : 'GET',
      dataType : 'json',
      url : path,
      async : true
    }).done(function(json) {
      defer.resolve(json);
    }).fail(function(err) {
      console.error(err);
      defer.reject(err);
    });
    return defer.promise({});
  };
}(jQuery));