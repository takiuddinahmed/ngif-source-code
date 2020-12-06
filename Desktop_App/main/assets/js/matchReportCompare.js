const electron = require('electron');
const {
    ipcRenderer
} = electron;

const url = 'http://localhost:5000/compare-result';


$(document).ready(function () {
    // var socket = io.connect('http://localhost:5000');

    var test_pic = "";

    ipcRenderer.send("get-test-pic", "to??");
    ipcRenderer.send("get-source-pic", "to??");

    ipcRenderer.on("test-pic", function (e, item) {
        console.log(item);
        $('#test-pic').attr("src", item);
    })
    ipcRenderer.on("source-pic", function (e, item) {
        console.log(item);
        $('#source-pic').attr("src", item);
    })

    var data = {
        'name': 'Hello'
    }
    var source_address = 'C:\\Users\\Takiuddin Ahmed\\Desktop\\Electron Based\\First-app\\database\\';
    $.post(url, data, function (data, status) {
        console.log(data);
        if (data == 'False') {
            $('.match-result-text').html("NO MATCH FOUND");
        }
        else if (data == 'True') {
            $('.match-result-text').html("MATCH FOUND");
            $('.match-result-text').css("background-color",'#3cb043');

        }
        console.log(data + ' and status is ' + status);
    })


    $("#back-btn").click(function (e) {
        window.location = "analyzeFromPhoto.html";
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
})
var count = 1;

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


ipcRenderer.send("nav-info", "info");
ipcRenderer.on("nav-info", function (e, item) {
    $("#user-image").attr("src", item.img);
    $("#username").html(item.user);
})

