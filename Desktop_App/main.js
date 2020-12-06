
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    dialog
} = require('electron')
const path = require('path');
const fs = require('fs');
const child_process = require('child_process')
const spawn = child_process.spawn;

process.env.NODE_ENV = 'production'
// process.env.NODE_ENV = 'debug'

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1800,
        height: 900,
        webPreferences: {
            //    preload: path.join(__dirname, 'preload.js')
            nodeIntegration: true
        }
    })

    var dir = path.join(__dirname, 'main')


    mainWindow.loadFile(path.join(dir, 'index.html'))
    // mainWindow.loadFile(path.join(dir, 'source-selection.html'))

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function (e) {
        mainWindow = null;
        app.quit();
        // var choice = dialog.showMessageBox(this, {
        //     type: 'question',
        //     buttons: ['Yes', 'No'],
        //     title: 'Confirm',
        //     message: 'Are you sure you want to quit?'
        // });
        // if (choice == 1) {
        //     e.preventDefault();
        // }
    })

    var menu = Menu.buildFromTemplate(mainMenuTample);
    Menu.setApplicationMenu(menu);

    const pythonProcess = spawn('python', [py_file_path]);
    pythonProcess.stdout.on("data", (data) => {
        console.log("Python return : " + data);
    })
}

var user_file_path = path.join(__dirname, '/../user.json');
var login_file_path = path.join(__dirname, '/../login.json');
var tolerance_file_path = path.join(__dirname, '/../tolerance.json');
var img_file_path = path.join(__dirname, '/../pro-pic.jpg');
var database_path = path.join(__dirname, '/../../../database/Officer');
var py_file_path = path.join(__dirname, '/../../faceapp.py');
// var py_file_path = path.join(__dirname, '/../../ngif.exe')
// var py_file_path = 'C:\\Program Files (x86)\\NGIF\\Program Data\\NGIF_db.exe'

var username = ""
var tolerance = "";





// login
ipcMain.on("login", function (e, item) {
    // var login_file_path = path.join(__dirname, '/../user.json');
    var status = false;
    let login_details = JSON.parse(fs.readFileSync(login_file_path));
    let tolerance_details = JSON.parse(fs.readFileSync(tolerance_file_path));
    tolerance = tolerance_details.tolerance;
    if (login_details.username == item.username && login_details.password == item.password) {
        console.log("Password Match");
        status = true;
    }
    username = login_details.username
    mainWindow.webContents.send("login", status);


    // var command = '"' + py_file_path + '"';
    // child_process.exec(command, function (error, stdouthahah) {
    //     if (error) {
    //         console.log("error  " + error);
    //     }
    //     else {
    //         console.log("exe run");
    //     }
    // })
});

ipcMain.on("nav-info", function (e, item) {
    var nav_info = new Object();
    nav_info.img = img_file_path;
    nav_info.user = username;
    mainWindow.webContents.send("nav-info", nav_info);
})

ipcMain.on("update-tolerance", (e, item) => {
    console.log("tolerance : " + item);
    var tol = { "tolerance": item };
    fs.writeFile(tolerance_file_path, JSON.stringify(tol), err => {
        if (err) {
            console.log("Error writing", err);

            mainWindow.webContents.send("tolerance report", false)
            mainWindow.webContents.send("get-tolerance", tolerance);

        }
        else {
            console.log("write Success full");
            mainWindow.webContents.send("tolerance report", true);
            tolerance = item;
        }
    })
})

ipcMain.on("get-tolerance", (e, item) => {
    mainWindow.webContents.send("get-tolerance", tolerance);
})
ipcMain.on("get-tolerance-modal", (e, item) => {
    mainWindow.webContents.send("get-tolerance-modal", tolerance);
    mainWindow.webContents.send("get-tolerance-modal", tolerance);
})

ipcMain.on("user-details", function (e, item) {
    let user_details = JSON.parse(fs.readFileSync(user_file_path));
    console.log(user_details);
    // console.log(item);
    mainWindow.webContents.send("user-details", user_details);
})

ipcMain.on("update-profile", function (e, item) {
    // var user_file_path = path.join(__dirname, '/../user.json');
    console.log(item);
    fs.writeFile(user_file_path, JSON.stringify(item), err => {
        if (err) {
            console.log("Error writing", err);
            mainWindow.webContents.send("report", false)
        }
        else {
            console.log("write Success full");
            mainWindow.webContents.send("report", true);
        }
    })
})

ipcMain.on("change-user", function (err, item) {
    console.log(item);
    let login_details = JSON.parse(fs.readFileSync(login_file_path));
    login_details.username = item;
    console.log(login_details)
    fs.writeFile(login_file_path, JSON.stringify(login_details), err => {
        if (err) {
            console.log("Error writing", err);
            mainWindow.webContents.send("report-login", false)
        }
        else {
            console.log("write Success full");
            mainWindow.webContents.send("report-login", true);
            username = login_details.username
        }
    })


})
ipcMain.on("change-pass", function (err, item) {
    console.log(item);
    let login_details = JSON.parse(fs.readFileSync(login_file_path));
    if (item.current == login_details.password) {
        login_details.password = item.new;
        console.log(login_details)
        fs.writeFile(login_file_path, JSON.stringify(login_details), err => {
            if (err) {
                console.log("Error writing", err);
                mainWindow.webContents.send("report-login", false)
            }
            else {
                console.log("write Success full");
                mainWindow.webContents.send("report-login", true);
            }
        })
    }
    else {
        mainWindow.webContents.send("report-login", false);
    }


})

ipcMain.on("change-user-image", function (e, item) {

    // var user_image_path = path.join(__dirname, '/../pro-pic.jpg');
    // var user_image_path = "D:\\Work\\Prof Project\\NGIF\\Final v1\\App\\release-builds\\ngif-win32-ia32\\resources\\pro-pic.jpg";
    var user_image_path = img_file_path;

    dialog.showOpenDialog({ properties: ['openFile'] }, function (imagePath) {
        var image_path = imagePath[0];
        console.log(image_path);
        fs.copyFile(image_path, (user_image_path), (err) => {
            if (err) {
                console.log(error);
                mainWindow.webContents.send("image-report", false);
            }
            else {

                mainWindow.webContents.send("image-report", user_image_path);
            }

            // At that point, store some information like the file name for later use
        });

    });
});



ipcMain.on("open-explorer", function (e, item) {
    var command = ""
    if (process.env.SystemRoot) {
        command = path.join(process.env.SystemRoot, 'explorer.exe');
    } else {
        command = 'explorer.exe ';
    }
    command += ' /select,' + database_path;
    console.log(command);
    child_process.exec(command, function (hahah) {

    })
})


var test_pic = "";
var source_pic = "";
var match_pic = '';

// image work
ipcMain.on("imageUpload", function (e, item) {
    dialog.showOpenDialog({ properties: ['openFile'] }, function (imagePath) {
        if (item == "test") {
            test_pic = imagePath[0];
            console.log(test_pic);
            mainWindow.webContents.send('test_pic', test_pic);
        }
        else {
            source_pic = imagePath[0];
            mainWindow.webContents.send('source_pic', source_pic);
        }
    });
});

ipcMain.on('set-match-pic', function (e, item) {
    match_pic = item;
})

ipcMain.on('set-match-pic', function (e, item) {
    mainWindow.webContents.send('match-pic', match_pic);
})

ipcMain.on("get-test-pic", function (e, item) {
    mainWindow.webContents.send('test-pic', test_pic);
})

ipcMain.on("get-source-pic", function (e, item) {
    mainWindow.webContents.send('source-pic', source_pic);
})



ipcMain.on("analyze", function (e, item) {
    const { PythonShell } = require('python-shell');
    // var arg ;
    // if(item == "double"){
    //     arg = {"test": test_pic, "source":source_pic };
    // }
    // else{
    //     arg = {"test":test_pic};
    // }
    var options = {
        args: [test_pic]
    }
    PythonShell.run('faceapp.py', options, function (err, result) {
        // if (err) throw err;
        if (err) console.log(err);
        // swat("result");
        console.log(result);
        mainWindow.webContents.send('python-msg', result);
    })
})





// ipc

ipcMain.on('python-shell', function (e, item) {
    // console.log("requested");
    // storeImageFile();
    // console.log(dialog.showOpenDialog({ properties: ['openFile'] }));
    dialog.showOpenDialog({ properties: ['openFile'] }, function (imagePath) {
        // console.log(imagePath);
        // console.log(typeof (imagePath[0]));
        var filename = path.basename(imagePath[0]);
        // console.log('FIle name : ' + filename);
        fs.copyFile(imagePath[0], 'images/upload/' + filename, (err) => {
            if (err) throw err;
            console.log("FIle uploaded");
            const { PythonShell } = require('python-shell');
            var name = item;
            var options = {
                args: [name]
            }
            PythonShell.run('hello.py', options, function (err, result) {
                if (err) throw err;
                // swat("result");
                console.log(result);
                mainWindow.webContents.send('python-msg', result);
            })
        })
    });

});

ipcMain.on('file-upload-test', (e, item) => {
    console.log(item);
    var filename = path.basename(item);
    fs.copyFile(item, 'images/upload/' + filename, (err) => {
        if (err) throw err;
        console.log("FIle uploaded");
        const { PythonShell } = require('python-shell');
        var name = item;
        var options = {
            args: [name]
        }
        PythonShell.run('hello.py', options, function (err, result) {
            if (err) throw err;
            // swat("result");
            console.log(result);
            mainWindow.webContents.send('python-msg', result);
        })
    })
})



function storeImageFile() {

    const filePath = dialog.showOpenDialog({ properties: ['openFile'] });
    // const fileName = path.basename(filePath);
    console.log(filePath);

    // fs.copyFile(filePath, ("image.jpg"), (err) => {
    //     if (err) throw err;
    //     console.log('Image ' + fileName + ' stored.');

    //     // At that point, store some information like the file name for later use
    // });
}



app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

const mainMenuTample = [{
    // label: 'Menu',
    // submenu: [
    //     {
    //         role: 'reload'
    //     }, {
    //         label: 'Data',
    //         click() {
    //             data();
    //         }
    //     },
    //     {
    //         label: 'Exit',
    //         click() {
    //             app.quit();
    //         }
    //     }
    // ]
    role: 'reload'
}]


if (process.env.NODE_ENV !== 'production') {
    mainMenuTample.push({
        label: 'Development Tools',
        submenu: [

            {
                role: 'reload'
            }, {
                role: 'toggledevtools'
            }

        ]
    })
}