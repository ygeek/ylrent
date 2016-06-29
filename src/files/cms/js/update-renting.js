/**
 * Created by meng on 16/6/29.
 */

"use strict";

$(function() {
  $("#cms-update-renting-status").click(function(e) {
    try {
      layer.msg('更新中，时间较长，请耐心等待...', {icon: 16,shade: 0.4,time:3600000});
    } catch (e) {
      console.log(e);
    }
    $.post('/cms/apartment/status/update/', {}, function(result) {
      try {
        layer.closeAll();
        if (result.error) {
          $.flash(result.error);
        } else {
          $.flash('更新成功');
        }
      } catch (e) {
        console.log(e);
      }
      location.href = location.href;
    });
  });
});
