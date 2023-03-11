jQuery(document).ready(function($) {
  // auto timer
  setTimeout(function() {
    $('#lab-slide-bottom-popup').modal('show');
  }, 5000); // optional - automatically opens in xxxx milliseconds

  $(document).ready(function() {
    $('.lab-slide-up').find('a').attr('data-toggle', 'modal');
    $('.lab-slide-up').find('a').attr('data-target', '#lab-slide-bottom-popup');
  });

});