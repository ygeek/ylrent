"use strict";

let wait = 60;

function time(o) {
  if (wait === 0) {
    o.removeAttribute("disabled");
    o.value = "获取验证码";
    wait = 60;
  } else {
    o.setAttribute("disabled", true);
    o.value = wait + "秒";
    wait--;
    setTimeout(function() {
      time(o);
    }, 1000);
  }
}

let sendButton = $("#sendButton");
sendButton.attr("disabled", false);

sendButton.on("click", function(){
  let mobile = $("#userField").val();
    $.ajax({
      type: 'post',
      url: '/user/requestsms/',
      data: 'mobile=' + mobile,
      dataType: 'json',
      success:function(data){
        if (data.code !== 0) {
          // TODO: 显示发送失败
        } else {
          time(this);
        }
      }
    });
});
