function bindTableSorting() {
  const table = $('table').stupidtable();

  table.on('aftertablesort', (event, data) => {
    const th = $(this).find('th');
    th.find('.arrow').remove();
    const dir = $.fn.stupidtable.dir;

    const arrow = data.direction === dir.ASC ? '&uarr;' : '&darr;';
    th.eq(data.column).prepend(`<span class="arrow">${arrow} </span>`);
  });

  $('tr').slice(1).click(() => {
    $('.awesome').removeClass('awesome');
    $(this).addClass('awesome');
  });
}

function autofocusSearch() {
  $('input#filterSearch').focus();
}

// function setNightmode() {
//   var themeOffset = document.cookie.indexOf('theme=');
//   var theme = document.cookie.substr(themeOffset).split(';')[0];
//   console.log(`currenttheme = ${theme}`);
//   document.cookie = "theme=dark; path=/";
// }

// const LogViewer = {
//   applyFilter: {
//
//   }
// }

$(document).ready(() => {
  bindTableSorting();
  autofocusSearch();
});
