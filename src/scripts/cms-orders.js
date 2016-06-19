/**
 * Created by meng on 16/6/17.
 */

"use strict";

$(function() {
  $(".cms-delegation-order-confirm").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/delegation/confirm/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });

  $(".cms-delegation-order-cancel").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/delegation/cancel/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });
  
  $(".cms-daily-order-confirm").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/daily/confirm/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });

  $(".cms-daily-order-cancel").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/daily/cancel/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });

  $(".cms-apartment-order-confirm").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/apartment/confirm/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });

  $(".cms-apartment-order-cancel").click(function(e) {
    let orderId = $(this).attr('data-id');
    $.post('/cms/orders/apartment/cancel/' + orderId, {}, function(result) {
      if (result.error) {
        $.flash(result.error.message);
      } else {
        $('#status-' + orderId).text(result.order.status);
      }
    });
  });

});

