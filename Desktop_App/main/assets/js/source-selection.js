const electron = require('electron');
const {
    ipcRenderer
} = electron;


var selected = "";

$("#back-btn").click(function (e) {
    window.location = "dashboard.html";
})




$("#double-photo").click(function () {
    // console.log("click")
    if (selected == "photo") {
        $("#test-pic").css("display", "none");
        selected = "";
    }
    else {
        selected = "photo";
        $("#test-pic").css("display", "block");
        $("#source-pic").css("display", "none");
    }
});

$("#database").click(function () {
    // console.log("click")
    if (selected == "database") {
        $("#source-pic").css("display", "none");
        selected = "";
    }
    else {
        selected = "database";
        $("#source-pic").css("display", "block");
        $("#test-pic").css("display", "none");
    }
});

$("#next-btn").click(function (e) {
    e.preventDefault();
    if (selected == "") {
        alert("Plz select an option");
    }
    else {
        // ipcRenderer.send("set-source", selected);
        if (selected == "database") {
            window.location = "analyzeDatabase.html";
        }
        else {
            window.location = "analyzeFromPhoto.html";
        }
    }
});



// ipcRenderer.on("source_status", function (e, item) {
//     // console.log(item);
//     window.location = "analyze.html";
// });

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