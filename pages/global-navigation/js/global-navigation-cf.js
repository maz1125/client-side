var photo_src;
var user_name;
var isShown = false;
$('#nav-user-img').on('click', function() {
  if(isShown === false) {
    $('#global-navi-user-popover').show();
    $('#global-navi-user-popover').animate({
      opacity:1,
      left : '-248',
      top : '51'
    }, 300, function(){
      $('#global-navi-user-popover').addClass('wap-popover-shown');
    });
    $('#wap-popover-arrow-bottom-user').show();
    $('#wap-popover-arrow-bottom-user').addClass('wap-popover-arrow-bottom-shown');
    photo_src = $('#nav-user-img').attr('src');
    $('.global-navi-user-info-img').attr('src', photo_src);
    user_name = JSON.parse(window.localStorage.getItem('userdata'))['username'];
    $('.global-navi-user-info-instant-name').text(user_name);
    isShown = true;
  } else {
    $('#global-navi-user-popover').animate({
      opacity:0,
      left : '-248',
      top : '51'
    }, 300, function(){
      $('#global-navi-user-popover').removeClass('wap-popover-shown');
      $('#global-navi-user-popover').hide();
    });
    $('#wap-popover-arrow-bottom-user').hide();
    $('#wap-popover-arrow-bottom-user').removeClass('wap-popover-arrow-bottom-shown');
    isShown = false;
  }
});
/*$(document).ready(function setGlobalNaviTitle() {
  var globalNaviTitle = $("#header-title-menu").text();
  var globalNaviTitle2 = $("h3:first").text();
  if(globalNaviTitle.length !== 0) {
    $("#global-navi-title").text(globalNaviTitle);
  } else if(globalNaviTitle2.length !== 0) {
    if(globalNaviTitle2.match("インスタレポート")) {
      $("#global-navi-title").text("インスタレポート");
    } else {
      $("#global-navi-title").text(globalNaviTitle2);
    }
  }
  
});*/