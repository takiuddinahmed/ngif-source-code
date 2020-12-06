const electron = require('electron');
const {
    ipcRenderer
} = electron;

var image_src;

ipcRenderer.on("python-msg", function (e, item) {
    // alert(item);
    console.log('image result: ' + item)
    var html;
    if (item == '0000') {
        html = '<h3 class="text-center text-warning"> Not Found </h3>';
    }
    else {
        html = '<img src="images/data/' + item + '" class="img-thumbnail img-show" alt="result">';
    }
    $('#result').html(html);

});

document.getElementById('image-check-btn').addEventListener('click', function (event) {
    event.preventDefault();
    ipcRenderer.send("file-upload-test", image_src);
});


function upload_image() {
    var up_image = document.getElementById("")
}

// function check_image() {
//     ipcRenderer.send("python-shell", name);

// }


function getName() {
    var name = document.getElementById("name").value;
    ipcRenderer.send("python-shell", name);
}

$('input[type=file]').change(function () {
    image_src = this.files[0].path;
    console.log(image_src);
});

$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});