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
      $("#now-singing").html(_data.value);
      list.push(_data);
      addList(_data, "list");
    } else {
      if (editType == "list") {
        list[_index].value = $("#song").val();
        updateList(list[_index], _index);
      }
      state = "add";
    }
    $("#song").val("");
  }
});
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};
$("#song-list").sortable({
  group: "list-song",
  onEnd: function (evt) {
    console.log(evt.oldDraggableIndex, evt.newDraggableIndex);
    list.move(evt.oldDraggableIndex, evt.newDraggableIndex);
    console.log(list);
  },
});
$(".list-container")
  .on("mouseenter", ".s-container", function () {
    $(this).find(".btn-action").css({
      "margin-left": "10px",
      "margin-top": "6px",

      opacity: 1,
      transition: "0.5s",
      "z-index": "99999",
    });
  })
  .on("mouseleave", ".s-container", function () {
    $(this)
      .find(".btn-action")
      .css({ "margin-left": "-20px", opacity: "0", "z-index": "-9999" });
  });
$("#header")
  .on("mouseenter", "#container-input", function () {
    console.log("masukk");
  })
  .on("mouseleave", function () {
    console.log("keluar");
  });
function updateList(data, index) {
  if (editType == "list") {
    let selected = $("#song-list").children().eq(index);
    selected.children().eq(0).find(".title").html(data.value);
  }
}
function addList(data, type) {
  if (type == "list") {
    $("#song-list").append(
      `<div class='s-container' type="list"><div class="parent-title"><div class="title ">${data.value}</div></div><button onclick="edit(${data.id}, 'list')"class="btn btn-action btn-light  action"><i class="icon-pencil"></i></button><button onclick="deleteSong(${data.id}, 'list')"class="btn btn-light btn-action  action"><i class="icon-eraser"></i></button><button onclick="play(${data.id})"class="btn btn-action btn-light  action"><i class="icon-play"></i></button></div>`
    );
  }
}

function play(id) {
  var index = list.findIndex(function (data) {
    return data.id == id;
  });
  $("#now-singing").html(list[index].value);
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

  $(".parent-input #song").focus();
}
function deleteSong(id, type) {
  if (type == "list") {
    var index = list.findIndex(function (data) {
      return data.id == id;
    });
    $("#song-list ").children().eq(index).remove();
    list.splice(index, 1);
  }
}
