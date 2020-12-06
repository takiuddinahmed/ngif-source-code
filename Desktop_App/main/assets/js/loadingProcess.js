

const url = 'http://localhost:5000/license';
const url_check = 'http://localhost:5000/';

var n = 1;

var data = {
    "lic": "hahaha"
}

$.post(url, data, function (data, status) {
    if (data != "Yes") {
        $(".main-section").css("display", "none");
        $(".license-section").css("display", "block");
    }
})
$.post(url_check, data, function (data, status) {
    
})
.fail(function(){
    $(".main-section").css("display", "none");
    $(".check-section").css("display", "block");
})


myVar = setInterval(function () {
    $('#' + n).html(
        '<img src="assets/img/select.png" alt="img" class="select">'
    )
    n = n + 1;
    if (n > 7) {
        $('#launch').css('display', 'block')
    }
}, 1000);


$('#launch').click(function () {
    window.location = 'dashboard.html'
})


