jQuery.noConflict();



(function($) {
  
  $(function() {
    // Set up the "play" buttons for each runnable code example.
    $('.runnable').each(function() {
      var code = this;
      var $buttonWrapper = $('<div class="button-wrapper"></div>');
      $(code).before($buttonWrapper);
      var $button = $('<div class="run" title="Run"></div>');
      $button.click(function(){ eval($(code).text()); });
      $buttonWrapper.append($button);
    });
  });
  
})(jQuery);
