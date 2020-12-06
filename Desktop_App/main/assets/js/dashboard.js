const electron = require('electron');
const {
    ipcRenderer
} = electron;


$("#analyze").click(function () {
    window.location = "source-selection.html";
});

$("#profile").click(function () {
    window.location = "edit-profile.html";
});


$("#staff").click(function () {
    ipcRenderer.send("open-explorer", "haha");
})
$("#guide").click(function () {
    // ipcRenderer.send("open-explorer", "haha");
    window.location = "user-guide.html"
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
