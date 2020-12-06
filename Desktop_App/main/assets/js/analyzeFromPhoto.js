const electron = require('electron');
const {
    ipcRenderer
} = electron;

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

const url = 'http://localhost:5000/compare'

const test_histo_url = "http://localhost:5000/test_image"
const source_histo_url = "http://localhost:5000/source_image"

$(document).ready(function () {
    var test_pic = "";
    var source_pic = "";

    $("#test-btn").click(function (e) {
        console.log("test");
        e.preventDefault();
        ipcRenderer.send("imageUpload", "test");
    });

    $("#source-btn").click(function (e) {
        e.preventDefault();
        ipcRenderer.send("imageUpload", "source");
    });


    $("#back-btn").click(function (e) {
        window.location = "source-selection.html";
    });



    $("#analyze").click(function (e) {
        if (test_pic != '' && source_pic != '') {
            $('.container-fluid').css("display", "none");
            $('.loading-section').css("display", "block");
            var data = {
                'known': source_pic,
                'unknown': test_pic
            }
            e.preventDefault();
            console.log("click");
            $.post(url, data, function (data, status) {
                console.log(data + ' and status is ' + status);
                window.location = 'match-report-compare.html';
            })
        }
        else {
            alert("Please select image properly");
        }

    });

    ipcRenderer.on("test_pic", function (e, item) {
        console.log(item);
        if (item) {
            test_pic = item;
            $('#test-pic').attr("src", item);
            var data = {
                'test_image_request': item
            }
            $.post(test_histo_url, data, function (data, status) {
                console.log(" test histo : " + data);
                data = data.split(",");
                $("#test-histo-img").attr("src", data[0]);
                $("#test-size").html(data[1] + "x" + data[2]);
                $("#test-num").html(data[3]);
                $(".test-histo-section").css("visibility","visible");
            })
        }
    });

    ipcRenderer.on("source_pic", function (e, item) {
        if (item) {
            source_pic = item;
            $('#source-pic').attr("src", item);
            var data = {
                'source_image_request': item
            }
            $.post(source_histo_url, data, function (data, status) {
                console.log(" source histo : " + data);
                data = data.split(",");
                $("#source-histo-img").attr("src", data[0]);
                $("#source-size").html(data[1] + "x" + data[2]);
                $("#source-num").html(data[3]);
                $(".source-histo-section").css("visibility", "visible");
            })
        
        }
    });

    ipcRenderer.send("nav-info", "info");
    ipcRenderer.on("nav-info", function (e, item) {
        $("#user-image").attr("src", item.img);
        $("#username").html(item.user);
    })

})