var nowSinging = [];

var list = [];
var state = "add";
var editType = "";
var _index = 0;
$("#song").keypress(function (e) {
  if (e.which == 13) {
    if (state == "add") {
      const uuid = new Date();
      let _data = { id: uuid.getTime(), value: $("#song").val() };

      let isEmpty =
        $("#now-singing-list").children().length == 0 ? true : false;
      if (isEmpty) {
        nowSinging.push(_data);
        addList(_data, "now-singing");
      } else {
        list.push(_data);
        addList(_data, "list");
      }

      // console.log(list);
    } else {
      // console.log("Editing", list[_index]);
      if (editType == "list") {
        list[_index].value = $("#song").val();
        updateList(list[_index], _index);
      } else {
        nowSinging[0].value = $("#song").val();
        updateList(nowSinging[0], 0);
      }
      // console.log($("#song-list .parent-list").eq(_index));

      state = "add";
      // console.log("Edited", list[_index]);
    }

    $("#song").val("");
  }
});

// Made by DIETRIEEE

// https://twitter.com/dietrieee
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

$("#song-list").sortable({
  group: "list-song",
  onEnd: function (/**Event*/ evt) {
    console.log(evt.oldDraggableIndex, evt.newDraggableIndex);
    list.move(evt.oldDraggableIndex, evt.newDraggableIndex);
    console.log(list);
  },
});

$(".list-container")
  .on("mouseenter", ".s-container", function () {
    $(this).find(".btn-action").css({
      "margin-left": "18px",
      opacity: 1,
      transition: "0.5s",
      "z-index": "99999",
    });
  })
  .on("mouseleave", ".s-container", function () {
    $(this).find(".btn-action").css({
      "margin-left": "-20px",
      opacity: "0",
      "z-index": "-9999",
    });
  });
$("#header")
  .on("mouseenter", "#container-input", function () {
    console.log("masukk");
    $(this).find(".parent-input").css({
      "margin-top": "48px",
      opacity: 1,
      transition: "0.5s",
      "z-index": "-9999",
    });
  })
  .on("mouseleave", function () {
    console.log("keluar");

    $(this).find(".parent-input").css({
      "margin-top": "-50px",
      opacity: "0",
    });
  });

function updateList(data, index) {
  if (editType == "list") {
    let selected = $("#song-list").children().eq(index);
    selected.children().eq(0).find(".title").html(data.value);
  } else {
    let selected = $("#now-singing-list").children().eq(0);
    selected.children().eq(0).find(".title-now-singing").html(data.value);
  }
}
function addList(data, type) {
  // $('#song-list').empty()

  if (type == "now-singing") {
    $("#now-singing-list").append(
      `<div class='s-container'> <div class="parent-title-now-singing"><div  class="title-now-singing ">${data.value}</div></div><button onclick="edit(${data.id}, 'now-singing')" class="btn btn-action btn-light  action"> <i class="icon-pencil"></i>
    </button><button onclick="deleteSong(${data.id}, 'now-singing')" class="btn btn-light btn-action  action"> <i class="icon-eraser"></i>
    </button> </div>`
    );
  }
  // console.log(_index);
  if (type == "list") {
    $("#song-list")
      .append(` <div class='s-container'> <div class="parent-title"><div  class="title ">${data.value}</div></div> <button onclick="edit(${data.id}, 'list')" class="btn btn-action btn-light  action"> <i class="icon-pencil"></i>
    </button><button onclick="deleteSong(${data.id}, 'list')" class="btn btn-light btn-action  action"> <i class="icon-eraser"></i>
    </button><button onclick="play(${data.id})" class="btn btn-action btn-light  action"> <i class="icon-play"></i>
    </button> </div>`);
  }
}

function play(id) {
  var index = list.findIndex(function (data) {
    return data.id == id;
  });
  // console.log(nowSinging);

  if (nowSinging.length == 0) {
    nowSinging.push(list[index]);
    addList(list[index], "now-singing");
  } else {
    nowSinging[0] = list[index];
    // console.log(data);

    $(".title-now-singing").html(nowSinging[0].value);
  }
}

function edit(id, type) {
  console.log(type, id);
  editType = type;
  if (type == "list") {
    var index = list.findIndex(function (data) {
      return data.id == id;
    });
    _index = index;
    $("#song").val(list[index].value);
  } else {
    _index = 0;
    $("#song").val(nowSinging[0].value);
  }
  state = "edit";

  $(".parent-input").css({
    "margin-top": "48px",
    opacity: 1,
    transition: "0.5s",
    "z-index": "-9999",
  });
  $(".parent-input #song").focus();
}
function deleteSong(id, type) {
  if (type == "list") {
    var index = list.findIndex(function (data) {
      return data.id == id;
    });
    $("#song-list ").children().eq(index).remove();

    list.splice(index, 1);
  } else {
    $("#now-singing-list ").children().eq(0).remove();
    nowSinging.splice(index, 1);
  }
}
