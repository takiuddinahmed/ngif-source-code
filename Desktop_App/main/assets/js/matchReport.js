const electron = require('electron');
const {
    ipcRenderer
} = electron;

const url = 'http://localhost:5000/result';

var count = 1;
var idArray = [];

$(".nav-right").click(function () {
    console.log("menu click")
    // document.getElementById("menu-show").classList.toggle("menu-show-action");
    count += 1;
    if (count % 2 == 0) {
        $("#menu-show").css("display", "block")
    }
    else {
        $("#menu-show").css("display", "none")
    }
})


$(document).ready(function () {
    // var socket = io.connect('http://localhost:5000');

    var test_pic = "";

    ipcRenderer.send("get-test-pic", "to??");

    ipcRenderer.on("test-pic", function (e, item) {
        console.log(item);
        $('#test-pic').attr("src", item);
    })

    var data = {
        'name': 'Hello'
    }
    // var source_address = 'C:\\Users\\nasim\\OneDrive\\Desktop\\Demo\\database\\';
    $.post(url, data, function (data, status) {
        if (data.length <= 5) {
            $('.match-result-text').html("NO MATCH FOUND");
            $('#first-id').css("visibility", "hidden");
            // $('#source-pic').attr("src", "../assets/img/profile-avotor.jpg");
        }
        else {
            $('.match-result-text').html("MATCH FOUND");
            $('.match-result-text').css('background-color', '#3cb043');
            
            idArray = data.split(",");
            // var source_array = idArray.replace(/^.*[\\\/]/, '');

            if (idArray.length > 1) {
                $('.more-res').css("display", "block");
            }

            var first_id = idArray[0].replace(/^.*[\\\/]/, '');
            first_id = first_id.slice(0, first_id.length - 4);
            $('#source-pic').attr("src", idArray[0]);
            $('#view-image').attr("src", idArray[0]);
            // $('#id-no').html('O NO/ P NO : ' + );
            if (first_id.length < 7) {
                first_id = 'P No. ' + first_id;

            }
            else {
                first_id = 'O No. ' + first_id;
            }
            $('#first-id').html(first_id);
            ipcRenderer.send('set-match-pic', first_id);
        }
        console.log(data + ' and status is ' + status);
    })


    $("#more-res").click(function () {
        var html = "";
        console.log("length = " + idArray.length);
        for (var i = 0; i < idArray.length; i++) {
            var first_id = idArray[i].replace(/^.*[\\\/]/, '');
            first_id = first_id.slice(0, first_id.length - 4);
            if (first_id.length < 7) {
                first_id = 'P No. ' + first_id;

            }
            else {
                first_id = 'O No. ' + first_id;
            }
            html += '<div class="box-section more-box"><div class="box"><img src="' + idArray[i] + '" alt="logo" class="pic" id="source-pic"></div><button class="btn btn-light">' + first_id + '</button>';
            html += `<button class="btn btn-primary" onclick="viewImage('${idArray[i]}')">View</button></div></div>`

        }
        // html += '<div class="d-block" style="margin: 20px 20%"><button class="btn btn-danger" id="show-main-btn">Back</button></div>'
        $(".more-id").html(html);
        $(".more-id").css("display", "block");
        $(".main-section").css("display", "none");
        $("#show-main-btn").click(function () {

            $(".more-id").css("display", "none");
            $(".main-section").css("display", "block");
        })
    })




    $("#back-btn").click(function (e) {
        window.location = "analyzeDatabase.html";
    });



    $("#analyze").click(function (e) {

        // var dataJson = JSON.stringify(data);
        // console.log(dataJson);
        // var data = test_pic;
        e.preventDefault();
        console.log("click");

        $.post(url, data, function (data, status) {
            console.log(data + ' and status is ' + status);
        })


        // socket.send("Hello")
        // socket.emit('database', { data: 'I\'m connected!' });
        // socket.emit('database', { data: 'I\'m connected!' });
        // ipcRenderer.send("analyze", "double");


    });

    ipcRenderer.on("test_pic", function (e, item) {
        console.log(item);
        test_pic = item;
        console.log(typeof (item))
        $('#test-pic').attr("src", item);
    });



    // socket.on('connected', function (msg) {
    //     console.log(msg);
    // })

    // socket.on('result', function (msg) {
    //     console.log(msg);
    // })


    // $("#in-page-back").click(function () {
    //     $('.main-section').css("display", "block");
    //     $('.view-details').css("display", "none");
    // })

    // $('#details-btn').click(function () {
    //     $('.main-section').css("display", "none");
    //     $('.view-details').css("display", "block");
    // })

    ipcRenderer.send("nav-info", "info");
    ipcRenderer.on("nav-info", function (e, item) {
        $("#user-image").attr("src", item.img);
        $("#username").html(item.user);
    })
})


function viewImage(src){
    console.log(src)
    $('#source-pic').attr("src", src);
    $('#view-image').attr("src", src);
    // $('#id-no').html('O NO/ P NO : ' + );
    var first_id = src.replace(/^.*[\\\/]/, '');
    first_id = first_id.slice(0, first_id.length - 4);

    if (first_id.length < 7) {
        first_id = 'P No. ' + first_id;

    }
    else {
        first_id = 'O No. ' + first_id;
    }
    $('#first-id').html(first_id);
    $(".more-id").css("display", "none");
    $(".main-section").css("display", "block");
}

