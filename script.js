// Silversound — small 3D / animated touches, no dependencies.
(function () {
  // 3D tilt on cards, following the mouse.
  document.querySelectorAll('.tilt').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // Floating music notes in the hero.
  var hero = document.querySelector('.hero');
  if (hero) {
    var notes = ['♪', '♫', '♩', '♬'];
    for (var i = 0; i < 8; i++) {
      var n = document.createElement('span');
      n.textContent = notes[i % notes.length];
      n.style.cssText = 'position:absolute;font-size:' + (18 + (i % 3) * 8) + 'px;color:rgba(200,200,230,.5);left:' + (8 + i * 11) + '%;top:' + (20 + (i % 4) * 14) + '%;animation:floaty ' + (4 + (i % 3)) + 's ease-in-out infinite;animation-delay:' + (-i * 0.7) + 's;pointer-events:none;';
      hero.style.position = 'relative';
      hero.appendChild(n);
    }
  }
})();
