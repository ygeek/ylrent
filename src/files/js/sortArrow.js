/**
 * Created by meng on 16/5/31.
 */

$("#current03").removeAttr('style');
var desc = $("#current03").attr('desc');
if (desc == 0) {
  $("#current03").attr('style', 'background:url(/img/icon20.png) 90% no-repeat #f6f6f6;');
} else {
  $("#current03").attr('style', 'background:url(/img/icon13.png) 90% no-repeat #f6f6f6;');
}