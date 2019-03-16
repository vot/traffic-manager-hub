$.fn.extend({
  animateCss: function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
  }
});

// $(e.target).animateCss('flash');

function bindTableSorting() {
  var table = $("table").stupidtable();

  table.on('aftertablesort', function (event, data) {
    var th = $(this).find('th');
    th.find('.arrow').remove();
    var dir = $.fn.stupidtable.dir;

    var arrow = data.direction === dir.ASC ? '&uarr;' : '&darr;';
    th.eq(data.column).prepend('<span class="arrow">' + arrow + ' </span>');
  });

  $('tr').slice(1).click(function(){
    $('.awesome').removeClass('awesome');
    $(this).addClass('awesome');
  });
}

function autofocusSearch() {
  $('input#filter').focus();
}

function setNightmode() {
  var themeOffset = document.cookie.indexOf('theme=');
  var theme = document.cookie.substr(themeOffset).split(';')[0];
  console.log(`currenttheme = ${theme}`);
  document.cookie = "theme=dark; path=/";
}

$(document).ready(function () {
  bindTableSorting();
  autofocusSearch();
});
