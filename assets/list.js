var app = require("electron").remote;
const pathh = require("path");
const { link } = require("fs");
var pth = "contents" + "/";
var url = "sing.html";
var url1 = "video.html";
var url2 = "slide.html";
var url3 = "page.html";
var shell = require("electron").shell;

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}
var isTrial = getUrlVars()["trial"];
$(document).ready(function () {
  var setting = "settings/settings.json";
  if (isTrial == "true") {
    setting = "settings/trial.json";
  }
  $.getJSON(pth + setting, function (json) {
    // console.log(json);
    $("#appName").html(json.appName);
    $("#slogan").html(json.slogan);
    $("#appName").css({
      "font-size": json.titleSize,
      "text-align": json.titleAlign,
      height: json.titleHeight,
      color: json.titleColor,
      "font-family": json.titleFont,
    });
    $("#slogan").css({
      "font-size": json.sloganSize,
      "text-align": json.sloganAlign,
      height: json.sloganHeight,
      color: json.sloganColor,
      "font-family": json.titleFont,
    });
    $("body").css({ "font-family": json.font });
    if (json.logo !== "") {
      $("#footer img").attr("src", pth + json.logo);
    }
    if (json.graphic !== "") {
      $("#graphic").css({
        "background-image":
          'url("' + (pth + json.graphic).replace(/\\/g, "/") + '")',
        opacity: json.backgroundOpacity,
        "background-size": "cover",
        "background-repeat": "no-repeat",
        "background-position": json.backgroundPosition,
        "background-color": json.backgroundColor,
      });
    } else if (json.video !== "") {
      $("#video").attr("src", pth + json.video);
    }

    $.getJSON(pth + json.songList, function (data) {
      setTimeout(() => {
        $("#loading").hide();
      }, 500);
      $("#list").html("");
      data.forEach((element) => {
        if (element.type == "lyrics") {
          $("#list").append(
            '<a href="' +
              url +
              "?song=" +
              element.url +
              "&trial=" +
              isTrial +
              '" style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "video") {
          $("#list").append(
            '<a href="' +
              url1 +
              "?song=" +
              element.url +
              "&trial=" +
              isTrial +
              '" style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "slides") {
          $("#list").append(
            '<a href="' +
              url2 +
              "?presentation=" +
              element.url +
              "&trial=" +
              isTrial +
              '"  style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "link") {
          $("#list").append(
            '<a href="javascript:void(0)" onclick="goToLink(\'' +
              element.url +
              '\')" style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "page") {
          $("#list").append(
            '<a href="' +
              url3 +
              "?iframe=" +
              encodeURIComponent(pth + element.url) +
              "&trial=" +
              isTrial +
              '"  style="margin-top:' +
              element.marginTop +
              ";margin-bottom:" +
              element.marginBottom +
              ';"><h2> ' +
              element.name +
              "</h2></a><br>"
          );
        } else if (element.type == "title") {
          $("#list").append(`<h1>${element.name}</h1>`);
        }
      });
      $("#list h2").css({
        "font-size": json.listSize,
        "text-align": json.listAlign,
        height: json.listHeight,
        color: json.listColor,
        "font-family": json.listFont,
      });
      $("#list h1").css({
        margin: "30px 0px 10px 0px",
        "text-align": json.listAlign,
        color: json.listColor,
        "font-family": json.listFont,
        "font-size": "3vh",
      });

      $("#list a").mouseenter(() => {
        document.getElementById("click1").play();
      });
      $("#list a").mouseleave(() => {
        let au = document.getElementById("click1");
        if (
          au.currentTime > 0 &&
          !au.paused &&
          !au.ended &&
          au.readyState > 2
        ) {
          au.pause();
          au.currentTime = 0;
        }
      });
      $("#list a").click((e) => {
        e.preventDefault();
        document.getElementById("click").play();
        setTimeout(() => {
          window.location.href = e.currentTarget.href;
        }, 200);
      });
    });
  });
});
function goToLink(u) {
  console.log(u);
  event.preventDefault();
  shell.openExternal(u);
}
// const { remote } = require('electron')
// const { Menu, MenuItem } = remote

// const menu = new Menu()
// menu.append(new MenuItem({ label: 'Update Content', click() { window.location.href = "index.html?manual=true"; } }))

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   menu.popup({ window: remote.getCurrentWindow() })
// }, false)
