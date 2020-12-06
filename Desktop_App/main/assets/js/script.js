
var toleranceValues = [
    "0.40",
    "0.41",
    "0.42",
    "0.43",
    "0.44",
    "0.45",
    "0.46",
    "0.47",
    "0.48",
    "0.49",
    "0.50",
    "0.51",
    "0.52",
    "0.53",
    "0.54",
    "0.55"
]

function alert(text) {
    console.log(text);
    // text += ".";
    $("#alert-modal-text").html(text);
    // document.getElementById("alert-modal-text").innerHTML = text;
    $("#alertModal").modal("show");
}

$("#update-tolerance").click(function () {
    ipcRenderer.send("get-tolerance-modal", "");
})

$("#tolerance-update-btn").click(function () {
    var tolerance = $("#toleranceInput").children("option:selected").val();
    console.log("tolerance " + tolerance);
    ipcRenderer.send("update-tolerance", tolerance);
})

ipcRenderer.on("get-tolerance-modal", (e, item) => {
    var ht = "";
    toleranceValues.forEach((each) => {
        if (each == item) {
            ht += "<option selected>" + each + "</option>";
        }
        else {
            ht += "<option>" + each + "</option>";
        }
        $("#toleranceInput").html(ht);
        $("#tolerance-modal").modal("show");
    })
})

ipcRenderer.on("tolerance report", (e, item) => {
    if (item) {
        alert("Update Successfull");

    }
    else {
        alert("Update Error");
    }
})
$(document).click((e) => {
    let e_class = e.target.className;
    let e_id = e.target.id;
    // console.log(e.target)
    let menu_show_state = $("#menu-show").css("display")
    // console.log(menu_show_state)
    if (menu_show_state == 'block' && e_class != 'nav-icon' && e_id != 'username') {
        if (e_class != 'nav-icon' && e_id != 'username'){
            count += 1
        }
        
        // console.log(`${e.target} ---- ${e_class} ---- ${e_id}`)
        $("#menu-show").css("display", "none")
    }
})


