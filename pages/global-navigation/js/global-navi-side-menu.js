(function($) {
  
  function setHTML(){    
    $('body').append($('#global-side-menu-contents'));
    $('.sidebar-menu').remove();
    var hasApp = true;
    var userdata = JSON.parse(localStorage.getItem('userdata'));
    if(!!userdata){
      console.log('hasUserdata' + userdata);
      var keyBase = 'shortcutApp';
      for (var int = 1; hasApp; int++) {
        console.log('loop count ' + int);
        var key = keyBase + 'Title' + int;
        console.log('key is ' + key);
        var title = userdata[key];
        console.log('title is ' + title);
        if (!!title) {
          var link = userdata[keyBase + 'Link' + int];
          var $li = $('<li>',{'class':'global-side-menu-contents-list-item global-side-menu-contents-list-item-application', 'data-url':'link'})
              .append($('<div>', {'class':'global-side-menu-contents-list-item-label'})
              .append(title));
          console.log('append ' + title);
          $('#global-side-menu-contents-list').append($li);
        } else {
          hasApp = false;
        }
      }
    }
  };
  
  function bindEvent(){    
    $(document).on('click', '.sidebar-collapse-icon', showSideMenu_);
    $(document).on('click', '#global-side-menu-contents-modal', hideSideMenu_);
    $(document).on('click', '#global-side-menu-contents-list-toggle', hideSideMenu_);
    $(document).on('click', '.global-side-menu-contents-list-item', openPage_);
  };
  
  function showSideMenu_(){
    var $globalSideMenuContents = $('#global-side-menu-contents');
    var $globalSideMenuContentsModal = $('#global-side-menu-contents-modal');
    var $globalSideMenuContentsList = $('#global-side-menu-contents-list');
    
    $globalSideMenuContents.toggleClass("global-side-menu-contents-open");
    $globalSideMenuContentsModal.toggleClass('global-side-menu-contents-modal-open');
    $globalSideMenuContentsList.toggleClass('global-side-menu-contents-list-open');
    $globalSideMenuContentsList.focus();
  };
  
  function hideSideMenu_(){
    var $globalSideMenuContents = $('#global-side-menu-contents');
    var $globalSideMenuContentsModal = $('#global-side-menu-contents-modal');
    var $globalSideMenuContentsList = $('#global-side-menu-contents-list');
    
    $globalSideMenuContentsList.removeClass('global-side-menu-contents-list-open');
    $globalSideMenuContentsModal.removeClass('global-side-menu-contents-modal-open');
    setTimeout(function(){
      $globalSideMenuContents.removeClass("global-side-menu-contents-open");      
    }, 300);//wap.core.ui.Animation.getFadeDuration());
  };
  
  function openPage_(event){
    if (event.ctrlKey) {
      window.open($(event.currentTarget).data('url'), '_blank');
    } else {
      location.href = $(event.currentTarget).data('url');
    }
  };
  
  $(function() {
    setHTML();
    bindEvent();
  });

}(jQuery));