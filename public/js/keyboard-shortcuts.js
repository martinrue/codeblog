$(function() {
  var keysPressed = '';
  var timer = 0;

  var goToPost = function() {
    var index = parseInt(keysPressed);
    keysPressed = '';

    if (index) {
      var post = $('.post-container:eq(' + (--index) + ')');
      if (post.length) $('html, body').animate({scrollTop: post.offset().top}, 200);
    }
  };

  $('body').keydown(function(e) {
    if (timer) clearTimeout(timer);
    keysPressed += String.fromCharCode(e.which);
    timer = setTimeout(goToPost, 400);
  });
});
