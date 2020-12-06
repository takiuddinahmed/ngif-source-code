const electron = require('electron');
const {
    ipcRenderer
} = electron;

$(document).ready(function () {
    console.log("starting")
    ipcRenderer.send("user-details", "user-details");

    ipcRenderer.on("user-details", function (e, item) {
        console.log(item.name);
        $("#first-name").html(item.firstName);
        $("#last-name").html(item.lastName);
        $("#email").html(item.email);
        $("#phone").html(item.phone);
        $("#dob").html(item.dob);
    })

    $("#back-btn").click(function (e) {
        // window.history.back();

        window.location = "dashboard.html";
    });


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
    $("#edit-profile").click(function(){
        window.location = "edit-profile.html";
    })

    ipcRenderer.send("nav-info", "info");
    ipcRenderer.on("nav-info", function (e, item) {
        $("#user-image").attr("src", item.img);
        $("#username").html(item.user);
        $("#pro-pic").attr("src",item.img);
    })

})
