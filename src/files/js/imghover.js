/**
 * Created by meng on 16/5/31.
 */

$('.imghover').hover(
  function() {
    $(this).fadeTo( 'fast', '0.7');
  },
  function() {
    $(this).fadeTo( 'fast', '1');
  }
);