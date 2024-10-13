let goalD;
let goalRel;
let sum;
function updateOnEvent() {
  goalRel = (+sum / +goalD) * 0x64;
  $(".text").text("{cur}" + +sum.toFixed(0x2));
  if (goalRel >= 0x64) {
    goalRel = 0x64;
  }
  $(".hor .prog").css("width", "calc(" + goalRel + "% - 28px)");
  $(".vert .prog, .vertleft .prog").css(
    "height",
    "calc(" + goalRel + "% - 10px)"
  );
}
document.addEventListener("goalLoad", function (_0x1c36bc) {
  let _0x2d09cd = "{titleFontName}";
  _0x2d09cd = _0x2d09cd.split(" ").join("+");
  let _0x281c47 = document.createElement("style");
  $(_0x281c47).html(
    "<style>\n@import url('https://fonts.googleapis.com/css2?family=" +
      _0x2d09cd +
      ":wght@400;500;600;700&display=swap');\n</style>"
  );
  $(_0x281c47).prependTo($("body"));
  let _0x217aba = _0x1c36bc.detail.title;
  $(".t025").text(_0x217aba);
  goalD = +_0x1c36bc.detail.amount.target;
  sum = +_0x1c36bc.detail.amount.current;
  $(".gsp").text(goalD);
  updateOnEvent();
});
document.addEventListener("goalEvent", function (_0x2cb495) {
  goalD = +_0x2cb495.detail.amount.target;
  sum = +_0x2cb495.detail.amount.current;
  updateOnEvent();
});
