var app = require("electron").remote;
const pathh = require("path");
var songDuration;
var current = "00:00.00";
var view = {};
var interv;
var lyrics = {};
var stt = "stopped";
var path = "contents" + "/";
var song = "";
var sect;

var isTrial = getUrlVars()["trial"];
$(document).ready(function () {
  $("#modal").hide();
  $.getJSON(path + "settings/settings.json", function (json) {
    // console.log(json);
    if (json.logo !== "") {
      $("#footer img").attr("src", path + json.logo);
    }
    $("body").css({ "font-family": json.font });
  });

  song = getUrlVars()["song"] + "/";
  $("#ps").hide();
  $("#uv").hide();
  $("#ul").hide();
  $.getJSON(path + "songlist/" + song + "song.json", function (json) {
    lyrics = json;
    load();
    // console.log(lyrics["lyrics"])
    // console.log(getClosest(Object.entries(lyrics["lyrics"]), "00:50.05"));
  });
});
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
function back() {
  // window.history.back();
  window.location.href = "list.html" + "?trial=" + isTrial;
}
function load() {
  if (lyrics != {}) {
    if (
      lyrics["data"]["backgroundImage"] !== "" &&
      lyrics["data"]["backgroundImage"]
    ) {
      $(".wrapper").css(
        "background-image",
        "url('" +
          path.replace(/\\/g, "/") +
          "songlist/" +
          song +
          lyrics["data"]["backgroundImage"] +
          "')"
      );
    } else {
      var bg = "white";
      if (
        lyrics["data"]["backgroundColor"] !== "" &&
        lyrics["data"]["backgroundColor"]
      ) {
        bg = lyrics["data"]["backgroundColor"];
      }
      $(".wrapper").css("background", bg);
    }
    // $(".wrapper").css('background-image','url('+path+json.graphic+')');?
    $("#backSong").attr(
      "src",
      path + "songlist/" + song + lyrics["data"]["backsong"]
    );
    $("#vocal").attr(
      "src",
      path + "songlist/" + song + lyrics["data"]["vocal"]
    );
    if (lyrics["data"]["vsource"] === undefined) {
      $("#vd").hide();
    } else {
      $("#vd").show();
    }

    // $("#pdfView embed").attr('src', path+"songlist/"+song+lyrics["data"]["pdf"]);
    songDuration = backSong.duration;
    dur = "";
    if (!isNaN(songDuration)) {
      if (songDuration / 60 > 1) {
        ct = parseInt(songDuration / 60);
        if (ct >= 10) {
          dur += ct + ":";
        } else {
          dur += "0" + ct + ":";
        }
        var cc = (songDuration - parseInt(songDuration / 60) * 60).toFixed(2);
        if (cc >= 10) {
          dur += cc;
        } else {
          dur += "0" + cc;
        }
      } else {
        dur += "00:";
        var cd = (songDuration - parseInt(songDuration / 60) * 60).toFixed(2);
        if (cd >= 10) {
          dur += cd;
        } else {
          dur += "0" + cd;
        }
      }
    } else {
      dur = lyrics["data"]["duration"];

      px = dur.split(":");
      p = 0;
      if (parseInt(px[0]) >= 1) {
        p = p + parseInt(px[0]) * 60;
        p = p + parseInt(px[1]);
      } else {
        p = p + parseInt(px[1]);
      }

      songDuration = p;
    }

    $("#duration").html(dur);

    $("#title").html(lyrics["data"]["title"]);
    $("#ttl").html(lyrics["data"]["title"]);
    $("#textView").css("text-align", lyrics["data"]["alignment"]);
    // $("#loading").hide();
    setTimeout(() => {
      $("#loading").hide();
    }, 500);
    $("#page").show();
    // $("#pdfView").hide();
    // $("#tx").hide();
  }
  $("#myRange").on("input", function () {
    var newval = $(this).val();
    var val = (newval / 1000) * songDuration;
    // pause();
    goTo(val);
  });

  document.getElementById("backSong").muted = true;
  check();
  var v1 = document.getElementById("backSong");
  var v2 = document.getElementById("vocal");
  $("#volume").val(v1.volume * 100);
  v2.volume = v1.volume;
}

// function pdfBtn(){
//     $("#pdfView").show();
// }
function go(pos) {
  var p = 0;
  var pxc;
  // check();
  if (pos == "next") {
    pxc = nsect;
  } else if (pos == "prev") {
    pxc = psect;
  } else {
    pxc = csect;
  }
  px = pxc.split(":");
  if (parseInt(px[0]) >= 1) {
    p = p + parseInt(px[0]) * 60;
    p = p + parseFloat(px[1]);
  } else {
    p = p + parseFloat(px[1]);
  }
  document.getElementById("backSong").currentTime = p;
  document.getElementById("vocal").currentTime = p;
  var c = "";
  var cu = p;
  if (cu / 60 >= 1) {
    cf = parseInt(cu / 60) + ":";
    if (cf >= 10) {
      c += cf;
    } else {
      c += "0" + cf;
    }
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  } else {
    c += "00:";
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  }
  current = c;
  setView(pxc);

  // console.log(p);
  // check();
  var sentences = getClosest(Object.entries(lyrics["lyrics"]), current);
  // console.log(lyrics["lyrics"][pxc]);
  var words = getClosest(
    Object.entries(lyrics["lyrics"][pxc]["lyrics"]),
    current
  );
  setActive(words);

  $("#timemil").html(current);
  // console.log(current);
  $("#time").html(current.substr(0, 5));
  $("#myRange").val((cu / songDuration) * 1000);
}
function goTo(position) {
  // px = position.split(":");
  p = position;
  // console.log(p);
  // if(parseInt(px[0]) >= 1){
  //     p = p + (parseInt(px[0])*60);
  //     p = p + (parseFloat(px[1]));
  // }else{
  //     p = p + (parseFloat(px[1]));
  // }
  document.getElementById("backSong").currentTime = p;
  document.getElementById("vocal").currentTime = p;
  var c = "";
  var cu = p;
  if (cu / 60 > 1) {
    c += parseInt(cu / 60) + ":";
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  } else {
    c += "00:";
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  }
  current = c;
  check();
  var sentences = getClosest(Object.entries(lyrics["lyrics"]), current);
  setView(sentences);

  var words = getClosest(
    Object.entries(lyrics["lyrics"][sentences]["lyrics"]),
    current
  );
  setActive(words);
}
function getClosest(array, value) {
  pxv = value.split(":");
  pv = 0;
  if (parseInt(pxv[0]) >= 1) {
    pv = pv + parseInt(pxv[0]) * 60;
    pv = pv + parseInt(pxv[1]);
  } else {
    pv = pv + parseInt(pxv[1]);
  }

  var closest;
  array.some(function (a) {
    px = a[0].split(":");
    p = 0;
    if (parseInt(px[0]) >= 1) {
      p = p + parseInt(px[0]) * 60;
      p = p + parseInt(px[1]);
    } else {
      p = p + parseInt(px[1]);
    }
    if (p >= pv) {
      return true;
    }
    closest = a[0];
  });
  return closest;
}

function setView(sentences) {
  // sentences = getClosestValue(Object.entries(lyrics["lyrics"], sentences));

  if (sentences in lyrics["lyrics"]) {
    const word = Object.entries(lyrics["lyrics"][sentences]["lyrics"]);
    if (word.length > 0) {
      view = lyrics["lyrics"][sentences]["lyrics"];
      var sentence = "";
      word.forEach((e) => {
        if (e[1] == "<br>") {
          sentence += "<br>";
        } else {
          // console.log(e[1]);
          if (e[1] == "." || e[1] == " .") {
            sentence +=
              "<span class='big' id=\"" +
              e[0].replace(":", "").replace(".", "") +
              '">' +
              e[1].replace(" ", "&nbsp;") +
              "</span>";
          } else {
            sentence +=
              '<span id="' +
              e[0].replace(":", "").replace(".", "") +
              '">' +
              e[1].replace(" ", "&nbsp;") +
              "</span>";
          }
        }
      });
      $("#lyric").html(sentence);
      $("#section").html(lyrics["lyrics"][sentences]["section"]);
      if (lyrics["lyrics"][sentences]["singer"] !== "") {
        $("#singer").html("" + lyrics["lyrics"][sentences]["singer"] + "");
      } else {
        $("#singer").html("");
      }
      // if(lyrics["lyrics"][sentences]["section"] !== ""){
      const secc = Object.entries(lyrics["lyrics"]);
      let ch = "p";
      secc.forEach((e) => {
        if (ch == "c" && e[1].section !== "") {
          nsect = e[0];
          ch = "";
        }
        if (e[0] == sentences) {
          ch = "c";
        }
        if (ch == "p" && e[1].section !== "") {
          psect = e[0];
        }
      });

      // console.log(psect,sentences,nsect)
      csect = sentences;

      // }
    }
  }
}
function setActive(words) {
  // var sentences = getClosest(Object.entries(lyrics["lyrics"]), words);
  // words = getClosest(Object.entries(view[sentences]), words);
  // console.log(view);
  // if(view != {}){
  if (words in view) {
    active = words;
    $("#lyric span").removeClass("active");
    $("#" + words.replace(":", "").replace(".", "")).addClass("active");
    $(".active").addClass("inactive");
  }
  // }
}

function check() {
  var c = "";
  var cu = document.getElementById("backSong").currentTime;
  if (cu / 60 >= 1) {
    cf = parseInt(cu / 60) + ":";
    if (cf >= 10) {
      c += cf;
    } else {
      c += "0" + cf;
    }
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  } else {
    c += "00:";
    var cc = (cu - parseInt(cu / 60) * 60).toFixed(2);
    if (cc >= 10) {
      c += cc;
    } else {
      c += "0" + cc;
    }
  }
  current = c;
  $("#timemil").html(current);
  $("#time").html(current.substr(0, 5));
  setView(current);
  console.log(current);
  setActive(current);
  // $("#progress").width((cu/songDuration*100)+"%");
  $("#myRange").val((cu / songDuration) * 1000);

  if ((cu / songDuration) * 100 >= 100) {
    stop();
  }
}
$("#volume").on("input", function () {
  var v = $("#volume").val();

  var v1 = document.getElementById("backSong");
  var v2 = document.getElementById("vocal");
  v1.volume = v / 100;
  v2.volume = v / 100;
});
function play() {
  document.getElementById("backSong").play();
  document.getElementById("vocal").play();
  interv = setInterval(check, 1);
  $("#ps").show();
  $("#pl").hide();
  stt == "playing";
}
function pause() {
  document.getElementById("backSong").pause();
  document.getElementById("vocal").pause();
  clearInterval(interv);
  $("#pl").show();
  $("#ps").hide();
  stt == "stopped";
}
function stop() {
  clearInterval(interv);
  document.getElementById("backSong").pause();
  document.getElementById("vocal").pause();
  $("#pl").show();
  $("#ps").hide();
  document.getElementById("backSong").currentTime = 0;
  document.getElementById("vocal").currentTime = 0;
  current = "00:00.00";
  check();
  stt == "stopped";
}
function muteVocal() {
  document.getElementById("vocal").muted = true;
  document.getElementById("backSong").muted = false;
  $("#uv").show();
  $("#mv").hide();
}
function unmuteVocal() {
  document.getElementById("vocal").muted = false;
  document.getElementById("backSong").muted = true;
  $("#mv").show();
  $("#uv").hide();
}
function muteLyric() {
  $("#lyric").hide();
  $("#lyricoff").show();
  $("#ul").show();
  $("#ml").hide();
  $("#singer").hide();
  $("#section").hide();
}
function unmuteLyric() {
  $("#lyric").show();
  $("#lyricoff").hide();
  $("#ml").show();
  $("#ul").hide();
  $("#singer").show();
  $("#section").show();
}
function pdfBtn() {
  const { BrowserWindow } = require("electron").remote;
  const PDFWindow = require("gr-pdf-window");
  const win = new BrowserWindow({ width: 800, height: 600 });
  PDFWindow.addSupport(win);
  win.loadURL(
    app.app.getAppPath() +
      "/" +
      path +
      "songlist/" +
      song +
      lyrics["data"]["pdf"]
  );
}
function videoBtn() {
  $("#modal").slideToggle();

  if (lyrics["data"]["vsource"] == "online") {
    $("#modal iframe").attr("src", lyrics["data"]["video"]);
    $("#modal video").hide();
  } else {
    $("#modal iframe").hide();
    $("#modal video").attr(
      "src",
      path + "songlist/" + song + lyrics["data"]["video"]
    );
  }
}
function close() {
  $("#modal").slideToggle();

  $("#modal video").attr("src", "");
  $("#modal iframe").attr("src", "");
  // var vid = document.getElementById("lc");
  // vid.pause();
}
