'use strict'
 $(function(){
    $(".dropdown-item").click(function(){
    $("#dropdownMenuLink").text($(this).text());
    $('.dropdown-item.active').removeClass("active")
    $(this).toggleClass('active');
   });

});

$('#loginModal').on('hidden.bs.modal', function (event) {
    error('login-warning', '500px', '450px');
})


$(".login-input").change(function(event){
    this.style.color = 'white';
});
$(".textarea-report").change(function(event){
    this.style.color = 'white';
});
$(".textarea-start").change(function(event){
    this.style.color = 'white';
});
//If you want to call error - use this func, also removes error.
//name - name of error div
//h - new height
//def - default height
function error(name, h, def){
    var content = document.getElementsByClassName('modal-content');
    console.log(getComputedStyle(content[0]).height);

    if (document.getElementById(name).classList.contains('d-none')){
        content[0].style.height = h;
    } else{
        content[0].style.height = def;
    }
    document.getElementById(name).classList.toggle('d-none');
}