const appName = "uk.co.rhythmstix.getstarted";
const app = require("electron").remote;
const path = require("path");
const fs = require("electron").remote.require("fs");
var licence = "";
var trial = 0;
let licenceValue = "";
let isTrialCode = "false";
if (!fs.existsSync(path.join(app.app.getPath("userData"), "licence"))) {
  fs.mkdirSync(path.join(app.app.getPath("userData"), "licence"));
}

// var encrypted = btoa("full|47yh8x1j|365|2020-07-10|2020-07-09");
// var encrypted = btoa("trial||30|2020-07-10|2020-07-09");
// var decrypted = atob(encrypted);
// console.log(encrypted);
// console.log(decrypted);

function checkLicence() {
  if (
    fs.existsSync(
      path.join(app.app.getPath("userData"), "licence", appName + ".txt")
    )
  ) {
    licence = atob(
      fs.readFileSync(
        path.join(app.app.getPath("userData"), "licence", appName + ".txt"),
        "utf8"
      )
    ).split("|");
    console.log(licence);
    if (licence.length != 1) {
      if (licence[0] == "trial") {
        if (new Date(licence[4]) >= new Date()) {
          licenceValue = "trial";
          trial = parseInt(
            (new Date(licence[4]) - new Date()) / (1000 * 60 * 60 * 24)
          );
        } else {
          licenceValue = "trial expired";
          trial = 0;
        }
      }
      if (licence[0] == "full") {
        if (new Date(licence[4]) >= new Date()) {
          licenceValue = "full";
          trial = 0;
        } else {
          licenceValue = "full expired";
          trial = 0;
        }
      }
    } else {
      licenceValue = "none";
      trial = 0;
    }
  } else {
    licenceValue = "none";
    trial = 0;
  }
}
$("#continue").hide();
checkLicence();
setTimeout(() => {
  console.log(trial, licenceValue);
  if (trial <= 0) {
    $("#trial").addClass("disabled");
    trial = 0;
  }
  switch (licenceValue) {
    case "full":
      window.location.href = "list.html?trial=false";
      break;
    case "full expired":
      $("#loading").hide();
      $("#expired").show();
      break;

    default:
      $("#loading").hide();
      break;
  }
  console.log(trial);
  $("#trial i").html(trial);
}, 1000);
function activate() {
  $("#expired").hide();
  $("#success").hide();
  $("#fail").hide();
  $("#progress").show();
  let code = $("input").val();
  $.post(
    "https://rhythmstix.co.uk/licences/check.php",
    {
      code: code,
      app_code: appName,
    },
    function (data) {
      $("#progress").hide();
      if (data !== "null") {
        let encrypted = "";
        let lc = JSON.parse(data);
        let dex = lc.expired_date;
        let dac = lc.applied_date;
        let ddu = lc.duration;
        if (dex !== null) {
          ddu = parseInt((new Date(dex) - new Date()) / (1000 * 60 * 60 * 24));
          encrypted = btoa(
            lc.type + "|" + lc.code + "|" + ddu + "|" + dac + "|" + dex + ""
          );
        } else {
          dac = new Date();
          dex = new Date(dac.setDate(dac.getDate() + ddu));
          encrypted = btoa(
            "" +
              lc.type +
              "|" +
              lc.code +
              "|" +
              ddu +
              "|" +
              dac +
              "|" +
              dex +
              ""
          );
        }
        if (lc.type == "trial") {
          isTrialCode = "true";
        }
        if (
          dex !== null &&
          parseInt(
            (new Date(dex) - new Date()) / (1000 * 60 * 60 * 24)
          ) > 0
        ) {
          $("input").hide();
          $("#validate").hide();
          $("#trial").hide();
          $("#continue").show();
          $("#success span").html(ddu);
          $("#success").show();
          fs.writeFileSync(
            path.join(app.app.getPath("userData"), "licence", appName + ".txt"),
            encrypted,
            "utf-8"
          );
        } else {
          $("#fail").show();
        }
      } else {
        $("#fail").show();
      }
    }
  );
}
function cnt() {
  window.location.href = "list.html?trial=" + isTrialCode;
}
function trial1() {
  if (licenceValue == "none") {
    let de = 0;
    let dd = new Date();
    let dd2 = new Date();
    let dd1 = new Date(dd2.setDate(dd2.getDate() + de));
    let encrypted = btoa(
      "trial|default|" +
        de +
        "|" +
        dd.getFullYear() +
        "-" +
        ("0" + (dd.getMonth() + 1)).slice(-2) +
        "-" +
        dd.getDate() +
        "|" +
        dd1.getFullYear() +
        "-" +
        ("0" + (dd1.getMonth() + 1)).slice(-2) +
        "-" +
        dd1.getDate() +
        ""
    );
    fs.writeFileSync(
      path.join(app.app.getPath("userData"), "licence", appName + ".txt"),
      encrypted,
      "utf-8"
    );
  }
  if (trial <= 0) {
    return;
  }
  window.location.href = "list.html?trial=true";
}
//   fs.writeFileSync(
//     path.join(app.app.getPath("userData"), "licence", "licence.txt"),
//     "the text to write in the file",
//     "utf-8"
//   );
//   console.log(
//     fs.readFileSync(
//       path.join(app.app.getPath("userData"), "licence", "licence.txt"),
//       "utf8"
//     )
//   );
// $("#loading").hide();
// $("#cancel").show();
// // destination.txt will be created or overwritten by default.

// manual = getUrlVars()["manual"];

// // console.log(path.join(app.app.getPath("userData"),"contents","settings","settings.json"));
// if(fs.existsSync(path.join(app.app.getPath("userData"),"contents","settings","settings.json"))){
//     if(manual == "true"){
//         setTimeout(() => {
//             $("#loading").hide();
//             $("#cancel").show();
//         }, 500);
//     }else{
//         window.location.href = "list.html";
//     }
// }else{
//     $("#loading").hide();
// }

// function getUrlVars() {
//     var vars = {};
//     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//         vars[key] = value;
//     });
//     return vars;
// }
// (function () {
//     function uncompress(ZIP_FILE_PATH, DESTINATION_PATH){
//         var unzipper = new DecompressZip(ZIP_FILE_PATH);
//         unzipper.on('error', function (err) {
//             console.log('Caught an error', err);
//             $("#fail").html('Caught an error <>br>'+ err);
//             $("#fail").show();
//         });
//         unzipper.on('extract', function (log) {
//             console.log('Finished extracting', log);
//             $("#success").show()
//             $("#select-file").hide()
//             $("#progress").hide();
//             $("#cancel").hide();
//             $("#continue").show();
//         });
//         unzipper.on('progress', function (fileIndex, fileCount) {
//             console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
//             $("#progress").show();
//             $("#select-file").hide();
//         });
//         unzipper.extract({
//             path: DESTINATION_PATH
//         });
//     }
//     document.getElementById("select-file").addEventListener("click", () => {
//         dialog.showOpenDialog({
//             title:"Select the .zip file to decompress",
//             filters: [
//                 {name: '.SLV Files', extensions: ['slv']},
//                 {name: 'All Files', extensions: ['*']}
//             ]
//         }).then(file => {
//             if(file.canceled === true){
//                 console.log("No file selected");
//                 return;
//             }else{
//                 // uncompress(file.filePaths[0], path.join(app.app.getPath("userData"),"contents"));
//                 coppy(file.filePaths[0], path.join(app.app.getPath("userData"),"contents"));

//             }
//         });
//     }, false);
//     function coppy(SOURCE, DESTINATION){
//         if(!fs.existsSync(DESTINATION)){
//             fs.mkdirSync(DESTINATION);
//             fs.copyFile(SOURCE, path.join(DESTINATION,"contents.zip"), (err) => {
//                 if (err) throw err;
//                 console.log('source.txt was copied to destination.txt');
//                 uncompress(path.join(DESTINATION,"contents.zip"), DESTINATION);
//             });
//         }else{
//             fs.copyFile(SOURCE, path.join(DESTINATION,"contents.zip"), (err) => {
//                 if (err) throw err;
//                 console.log('source.txt was copied to destination.txt');
//                 uncompress(path.join(DESTINATION,"contents.zip"), DESTINATION);
//             });
//         }
//     }
// })();

// window.location.href = "list.html";
