const electron = require('electron');
const {
    ipcRenderer
} = electron;



$('.btn').click(function (e) {
    e.preventDefault();
    var username = $('#username').val();
    var pass = $('#password').val();

    // if (username == 'admin' && pass == 'admin') {
    //     window.location = "loadingProcess.html";
    // }
    // else {
    //     alert("Login Error");
    // }
    // window.location = "loadingProcess.html"
    var loginDetails = { username: username, password: pass };
    ipcRenderer.send("login", loginDetails);

})

ipcRenderer.on("login", function (e, item) {
    console.log(item);
    if (item) {
        window.location = "loadingProcess.html";
    }
    else {
        alert("Error Username or Password");
    }

})
