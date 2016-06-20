/**
 * Created by meng on 16/6/20.
 */

"use strict";

$(function() {
  $(".cms-apartment-leased").click(function(e) {
    let apartmentId = $(this).attr('data-id');
    $.post('/cms/apartment/rent/' + apartmentId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-leased-' + apartmentId).text('已租');
      }
    });
  });

  $(".cms-apartment-available").click(function(e) {
    let apartmentId = $(this).attr('data-id');
    $.post('/cms/apartment/available/' + apartmentId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-leased-' + apartmentId).text('未租');
      }
    });
  });
  
  $(".cms-apartment-recommend").click(function(e) {
    let apartmentId = $(this).attr('data-id');
    $.post('/cms/apartment/recommend/' + apartmentId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-recommend-' + apartmentId).text('已推荐');
      }
    }); 
  });
  
  $(".cms-apartment-unrecommend").click(function(e) {
    let apartmentId = $(this).attr('data-id');
    $.post('/cms/apartment/unrecommend/' + apartmentId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-recommend-' + apartmentId).text('未推荐');
      }
    }); 
  });

  $(".cms-daily-renting").click(function(e) {
    let dailyId = $(this).attr('data-id');
    $.post('/cms/daily/available/' + dailyId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-renting-' + dailyId).text('可租');
      }
    });
  });

  $(".cms-daily-disable").click(function(e) {
    let dailyId = $(this).attr('data-id');
    $.post('/cms/daily/rent/' + dailyId, {}, function(result) {
      if (result.error) {
        $.flash(result.error);
      } else {
        $('#status-renting-' + dailyId).text('下架');
      }
    });
  });
});