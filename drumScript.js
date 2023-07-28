document.querySelectorAll(".drum-pad").forEach(function (pad) {
  pad.addEventListener("click", function () {
    var audioId = pad.textContent.trim();
    document.getElementById(audioId).play();
  });
});
