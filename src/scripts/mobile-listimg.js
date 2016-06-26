/**
 * Created by meng on 16/6/26.
 */
"use strict";

function adjustListImageHeight() {
  $('.listimg').each(function() {
    $(this).css('height', $(this).width() / 1.8);
  });
}

adjustListImageHeight();
