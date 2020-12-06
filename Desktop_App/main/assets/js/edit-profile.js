const electron = require('electron');
const {
    ipcRenderer
} = electron;

$(document).ready(function () {
    console.log("starting")
    ipcRenderer.send("user-details", "user-details");

    ipcRenderer.on("user-details", function (e, item) {
        console.log(item.name);
        $("#first-name").val(item.firstName);
        $("#last-name").val(item.lastName);
        $("#email").val(item.email);
        $("#phone").val(item.phone);
        $("#dob").val(item.dob);
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

    $("#update-btn").click(function () {
        var item = new Object();
        item.firstName = $("#first-name").val();
        item.lastName = $("#last-name").val();
        item.email = $("#email").val();
        item.phone = $("#phone").val();
        item.dob = $("#dob").val();

        ipcRenderer.send("update-profile", item);
        console.log(item);
    });

    $("#change-image").click(function () {
        ipcRenderer.send("change-user-image", "change");
    })

    ipcRenderer.on("report", (err, item) => {
        console.log(item);
        if (item) {
            alert("Update Successful");
            window.location = "view-profile.html";
        }
        else {
            alert("Update Error. Please try again");
        }
    })
    ipcRenderer.on("report-login", (err, item) => {
        console.log(item);
        if (item) {
            alert("Update Successful");
            ipcRenderer.send("nav-info", "info");
        }
        else {
            alert("Update Error. Please try again");
        }
    })
    ipcRenderer.on("image-report", (err, item) => {
        console.log(item);
        if (item) {

            alert("Image Upload Successful");

            window.location = "view-profile.html";
        }
        else {
            alert("Image Update Error. Please try again");
        }
    })


    $("#update-user-btn").click(function () {
        console.log("Update Userbtn")
        $("#edit-username").val("");
        $("#edit-user-modal").modal("show");
    })

    $("#final-user-up-btn").click(function () {

        $("#edit-user-modal").modal("toggle");
        var user = $("#edit-username").val();
        console.log(user);
        if (user) {
            ipcRenderer.send("change-user", user);
        }
        else {
            alert("Input Error")
        }

    })
    $("#final-pass-up-btn").click(function () {
        $("#edit-pass-modal").modal("toggle");
        var pass = new Object()
        pass.current = $("#edit-current-password").val();
        pass.new = $("#edit-new-password").val();
        if (pass.current && pass.new) {
            ipcRenderer.send("change-pass", pass);
        }
        else {
            alert("Input Error")
        }


    })

    $("#update-pass-btn").click(function () {
        console.log("Update pass btn")
        $("#edit-current-password").val("");
        $("#edit-new-password").val("");
        $("#edit-pass-modal").modal("show");
    })

    ipcRenderer.send("nav-info", "info");
    ipcRenderer.on("nav-info", function (e, item) {
        $("#user-image").attr("src", item.img);
        $("#username").html(item.user);
        var u = 'url(' + item.img + ')';
        // $(".pro-pic-box").css('background-image', u)
         $("#edit-pro-pic").attr('src', item.img)

    })


})
