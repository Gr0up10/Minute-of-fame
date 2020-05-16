$(document).ready(function() {
 "use strict";
 Chart.defaults.global.defaultFontColor = "#75787c";
 var r = !0;
 //$(window).outerWidth() < 576 && (r = !1);
 var a = $("#lineCahrt"),
  o = (new Chart(a, {
   type: "line",
   options: {
    scales: {
     xAxes: [{
      display: !0,
      gridLines: {
       display: !1
      }
     }],
     yAxes: [{
      ticks: {
       max: 100,
       min: 0
      },
      display: !0,
      gridLines: {
       display: !1
      }
     }]
    },
    legend: {
     display: r
    }
   },
   data: {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [{
     label: "Likes",
     fill: !0,
     lineTension: .2,
     backgroundColor: "transparent",
     borderColor: "#1e7e34",
     pointBorderColor: "#1e7e34",
     pointHoverBackgroundColor: "#1e7e34",
     borderCapStyle: "butt",
     borderDash: [],
     borderDashOffset: 0,
     borderJoinStyle: "miter",
     borderWidth: 2,
     pointBackgroundColor: "#fff",
     pointBorderWidth: 5,
     pointHoverRadius: 5,
     pointHoverBorderColor: "#fff",
     pointHoverBorderWidth: 2,
     pointRadius: 1,
     pointHitRadius: 0,
     data: [30, 27, 45, 62, 53, 75, 56, 74, 87, 99],
     spanGaps: !1
    }, {
     label: "Dislikes",
     fill: !0,
     lineTension: .2,
     backgroundColor: "transparent",
     borderColor: "#bd2130",
     pointBorderColor: "#bd2130",
     pointHoverBackgroundColor: "#bd2130",
     borderCapStyle: "butt",
     borderDash: [],
     borderDashOffset: 0,
     borderJoinStyle: "miter",
     borderWidth: 2,
     pointBackgroundColor: "#fff",
     pointBorderWidth: 5,
     pointHoverRadius: 5,
     pointHoverBorderColor: "#fff",
     pointHoverBorderWidth: 2,
     pointRadius: 1,
     pointHitRadius: 10,
     data: [35, 25, 28, 15, 20, 12, 16, 3, 7, 2],
     spanGaps: !1
    },{
     label: "Views",
     fill: !0,
     lineTension: .2,
     backgroundColor: "transparent",
     borderColor: "#d4c074",
     pointBorderColor: "#d4c074",
     pointHoverBackgroundColor: "#d4c074",
     borderCapStyle: "butt",
     borderDash: [],
     borderDashOffset: 0,
     borderJoinStyle: "miter",
     borderWidth: 2,
     pointBackgroundColor: "#fff",
     pointBorderWidth: 5,
     pointHoverRadius: 5,
     pointHoverBorderColor: "#fff",
     pointHoverBorderWidth: 2,
     pointRadius: 1,
     pointHitRadius: 0,
     data: [60, 43, 47, 98, 78, 71, 34, 49, 85, 100],
     spanGaps: !1
    }]
   }
  }), $("#barChartExample1"));
});

$( document ).ready(function() {
    $("#view-text").click(function(){
  $("#view-text").addClass( "tab__a-border" );
  $("#fame-text").removeClass( "tab__a-border" );
  $("#view").addClass( "show" ).removeClass( "hide" );
  $("#fame").addClass( "hide" ).removeClass( "show" );
});
    $("#fame-text").click(function(){
  $("#fame-text").addClass( "tab__a-border" );
  $("#view-text").removeClass( "tab__a-border" );
  $("#fame").addClass( "show" ).removeClass( "hide" );
  $("#view").addClass( "hide" ).removeClass( "show" );
});
});
$( document ).ready(function() {
    $("#mview-text").click(function(){
  $("#mview-text").addClass( "tab__a-border" );
  $("#mfame-text").removeClass( "tab__a-border" );
  $("#view").addClass( "show" ).removeClass( "hide" );
  $("#fame").addClass( "hide" ).removeClass( "show" );
});
    $("#mfame-text").click(function(){
  $("#mfame-text").addClass( "tab__a-border" );
  $("#mview-text").removeClass( "tab__a-border" );
  $("#fame").addClass( "show" ).removeClass( "hide" );
  $("#view").addClass( "hide" ).removeClass( "show" );
});
});

$(document).ready( function() {
    $("#fl_inp").change(function(){
         var filename = $(this).val().replace(/.*\\/, "");
         $("#fl_nm").html(filename);
    });
});

$(document).ready( function() {

$('.queue-slider').on('click', function(e){
    var scroll =  $(".queue-slider__ul").scrollLeft(),
        $arrow = $(e.target).closest('.queue-slider__arrow'),
        isLeftArrow = $arrow.hasClass('queue-slider__arrow_left'),
        width = $(".queue-slider__ul__li").outerWidth(true),
        diff =  isLeftArrow ? scroll - width: scroll + width,
        $ul = $(".queue-slider__ul");

    $ul.scrollLeft(diff);
});
});

jQuery.validator.addMethod("vk", function(value, element) {
  return this.optional(element) || /^http:\/\/vk.com\/id/.test(value);
}, "Please enter the correct vk addres");

jQuery.validator.addMethod("facebook", function(value, element) {
  return this.optional(element) || /^http:\/\/www.facebook.com/.test(value);
}, "Please enter the correct facebook addres");

jQuery.validator.addMethod("twitter", function(value, element) {
  return this.optional(element) || /^http:\/\/twitter.com/.test(value); // twitter.com
}, "Please enter the correct twitter addres");

jQuery.validator.addMethod("youtube", function(value, element) {
  return this.optional(element) || /^http:\/\/www.youtube.com/.test(value);
}, "Please enter the correct youtube addres");

jQuery.validator.addMethod("instagram", function(value, element) {
  return this.optional(element) || /^http:\/\/www.instagram.com/.test(value);
}, "Please enter the correct instagram addres");

jQuery.validator.addMethod("ok", function(value, element) {
  return this.optional(element) || /^http:\/\/ok.ru/.test(value);
}, "Please enter the correct ok addres");

$(document).ready( function() {
    $("#myform").validate({
            rules: {
                email: {
                    email: true
                },
                name: {
                    required: true,
                    minlength: 2
                },
                vk: {
                    vk: true,
                },
                facebook: {
                    facebook: true,
                },
                twitter: {
                    twitter: true,
                },
                instagram: {
                    instagram: true,
                },
                youtube: {
                    youtube: true,
                },
                ok: {
                    ok: true,
                },
            }
        });
});
