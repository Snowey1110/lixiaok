document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.style.opacity = '1';
      });
    }, 90);
  });