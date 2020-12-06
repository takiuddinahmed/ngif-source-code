const electron = require('electron');
const {
    ipcRenderer
} = electron;

const url = 'http://localhost:5000/operation';
const url_total_file = 'http://localhost:5000/get_total_file';
const url_process = 'http://localhost:5000/get_progress';
// const url = 'http://10.29.202.245:5000/operation';
var count = 1;
var toleranceVal;

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
    var set_range_status = false;
    var total_file = 0;

    $("#test-btn").click(function (e) {
        console.log("test");
        e.preventDefault();
        ipcRenderer.send("imageUpload", "test");
    });


    $("#back-btn").click(function (e) {
        window.location = "source-selection.html";
    });

    $(".select-all").change(function () {
        console.log("select all");
        var all_options = document.getElementsByClassName("filt-check");
        if ($(this).is(':checked')) {
            for (var i = 0; i < all_options.length; i++) {
                all_options[i].checked = true;
            }
        }
        else {
            for (var i = 0; i < all_options.length; i++) {
                all_options[i].checked = false;
            }

        }
    })



    $("#analyze").click(function (e) {


        e.preventDefault();
        var filter = document.getElementsByClassName('filt-check');
        var filter_data = "";

        for (var i = 0; i < filter.length; i++) {
            if (filter[i].checked) {
                filter_data += filter[i].value;
                filter_data += ',';
            }
        }
        console.log(filter_data)
        var range_data = "NO";
        if (set_range_status) {
            range_data = String($("#init-range").val());
            range_data += '/';
            range_data += String($("#final-range").val());
        }

        console.log("range : " + range_data);



        var data = {
            "address": test_pic,
            "filters": filter_data,
            "ranges": range_data,
            "tolerance": toleranceVal
        }


        if (test_pic != "" && filter_data.length != 0) {

            $('.main-section').css("display", "none");
            $('.image-section').css("display", "none");
            $('.loading-section').css("display", "block");

            console.log("data : " + data);

            $.post(url_total_file, data, function (ret_data, status) {
                console.log(ret_data);
                total_file = parseInt(ret_data);
                var total_time = total_file * 1.2;
                total_time /= 60;
                var time_status = "";
                if (total_time < 0) {
                    time_status = "a few moment"
                }
                else {
                    total_time = Math.ceil(total_time)
                    time_status = total_time + " min";
                    if (total_time > 59) {
                        time_status = Math.floor(total_time / 60) + " hour " + total_time % 60 + " min";
                        if (total_time % 60 == 0) {
                            time_status = Math.floor(total_time / 60) + " hour ";

                        }

                    }
                }
                $("#time-remaining").html(time_status);
                var refresh_time = Math.floor(2000 * ((total_file / 100)));
                if (refresh_time < 5000) {
                    refresh_time = 5000;
                }
                $('.progress-bar').css("width", "1%");
                console.log(refresh_time);
                $.post(url, data, function (ret_data, status) {
                    console.log(ret_data + ' and status is ' + status);
                    window.location = 'match-report.html';
                });

                myVar = setInterval(function () {
                    $.post(url_process, data, function (ret_data, status) {
                        console.log("completed : " + ret_data);
                        var completed_file = parseInt(ret_data);
                        var progress = (completed_file * 100) / total_file;
                        progress = progress + '%'
                        console.log(progress);
                        $('.progress-bar').css("width", progress);
                        var remaining_file = total_file - completed_file;
                        remaining_file *= 1.2;
                        remaining_file /= 60;
                        var time_status = ""
                        if (remaining_file <= 1) {
                            time_status = "a few moment"
                        }
                        else {
                            total_time = Math.ceil(remaining_file)
                            time_status = total_time + " min";
                            if (total_time > 59) {
                                time_status = Math.floor(total_time / 60) + " hour " + total_time % 60 + " min";
                                if (total_time % 60 == 0) {
                                    time_status = Math.floor(total_time / 60) + " hour ";

                                }
                            }
                        }
                        $("#time-remaining").html(time_status);

                    });
                }, refresh_time);
            })




        }
        else {
            if (test_pic == "" && filter_data.length == 0) {
                alert("Please select image and filter option")
            }
            else if (test_pic == "") {
                alert("Please select image");
            }
            else {
                alert("Please select filter option");
            }

        }


    });

    ipcRenderer.on("test_pic", function (e, item) {
        console.log(item);
        if (item) {
            test_pic = item;
            $('#test-pic').attr("src", item);
            $('#test-pic').attr("src", item);
            var data = {
                'test_image_request': item
            }
            const test_histo_url = "http://localhost:5000/test_image";
            $.post(test_histo_url, data, function (data, status) {
                console.log(" test histo : " + data);
                data = data.split(",");
                $("#histo-img").attr("src", data[0]);
                $("#source-size").html(data[1] + "x" + data[2]);
                $("#source-num").html(data[3]);
                $(".image-details-section").css("visibility", "visible");
            })
        }

        console.log(typeof (item))
    });

    ipcRenderer.send("get-tolerance", "");
    ipcRenderer.on("get-tolerance", (e, item) => {
        toleranceVal = item;
        console.log("tolerance" + toleranceVal)
    })

    ipcRenderer.send("nav-info", "info");
    ipcRenderer.on("nav-info", function (e, item) {
        $("#user-image").attr("src", item.img);
        $("#username").html(item.user);
    })


    $(".range").click(function () {
        console.log("range click")
        if ($(this).is(':checked')) {
            $(".range-input-section").css("visibility", "visible");
            // $("#analyze").css("margin-top", "15px");
            set_range_status = true;
        }
        else {
            $(".range-input-section").css("visibility", "hidden");
            set_range_status = false;
            // $("#analyze").css("margin-top", "0px");
        }
    })












})


