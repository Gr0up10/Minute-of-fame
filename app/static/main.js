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
        diff =  isLeftArrow ? scroll - 200: scroll + 200,
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
