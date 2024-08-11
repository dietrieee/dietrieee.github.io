var list = [];
var state = "add";
var _index = 0;
$("#song").keypress(function (e) {
  if (e.which == 13) {
    if (state == "add") {
      const uuid = new Date();
      let _data = { id: uuid.getTime(), value: $("#song").val() };
      if (list.length == 0) {
        list.push(_data);
      } else {
        list.unshift(_data);
      }
      console.log(list);

      addList();
    } else {
      // console.log("Editing", list[_index]);

      list[_index].value = $("#song").val();
      console.log($("#song-list .parent-list").eq(_index));

      state = "add";
      updateList();
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
  onEnd: function (/**Event*/ evt) {
    console.log(evt.oldDraggableIndex + 1, evt.newDraggableIndex + 1);
    list.move(evt.oldDraggableIndex + 1, evt.newDraggableIndex + 1);
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

function updateList() {
  $("#song-list").empty();

  for (let i = list.length - 1; i >= 0; i--) {
    console.log(i);

    let indexInArray = list[i].id;
    let valueOfElement = list[i].value;

    if (i == 0) {
      $("#now-singing-list .parent-title-now-singing .title-now-singing").html(
        valueOfElement
      );
    }
    if (i > 0) {
      $("#song-list")
        .prepend(` <div class='s-container'> <div class="parent-title"><div  class="title ">${valueOfElement}</div></div> <button onclick="edit(${indexInArray})" class="btn btn-action btn-light  action"> <i class="icon-pencil"></i>
    </button><button onclick="deleteSong(${indexInArray})" class="btn btn-light btn-action  action"> <i class="icon-eraser"></i>
    </button> </div>`);
    }
  }

  // $.each(list, function (indexInArray, valueOfElement) {});
  console.log(list);
}
function addList() {
  // $('#song-list').empty()
  let index = 0;
  let value = list[index].value;
  if (list.length == 1) {
    $("#now-singing-list").append(
      `<div class="parent-title-now-singing"><div  class="title-now-singing ">${value}</div></div>`
    );
  } else {
    $("#now-singing-list .parent-title-now-singing .title-now-singing").html(
      value
    );
  }
  // console.log(_index);
  if (list.length > 1) {
    $("#song-list")
      .prepend(` <div class='s-container'> <div class="parent-title"><div  class="title ">${list[1].value}</div></div> <button onclick="edit(${list[1].id})" class="btn btn-action btn-light  action"> <i class="icon-pencil"></i>
    </button><button onclick="deleteSong(${list[1].id})" class="btn btn-light btn-action  action"> <i class="icon-eraser"></i>
    </button> </div>`);
  }
}
function edit(id) {
  var index = list.findIndex(function (data) {
    return data.id == id;
  });
  _index = index;
  state = "edit";

  $("#song").val(list[index].value);
  $(".parent-input").css({
    "margin-top": "48px",
    opacity: 1,
    transition: "0.5s",
    "z-index": "-9999",
  });
  $(".parent-input #song").focus();
}
function deleteSong(id) {
  var index = list.findIndex(function (data) {
    return data.id == id;
  });

  // console.log(list);
  if (index == list.length - 1) {
    $("#now-singing-list .parent-list").eq(index).remove();
  } else {
    $("#song-list .parent-list").eq(index).remove();
  }
  list.splice(index, 1);
  updateList();
}
