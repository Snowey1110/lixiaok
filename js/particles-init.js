particlesJS('particles-js',
    {
      "particles": {
        "number": {
          "value": 60,
          "density": { "enable": true, "value_area": 1000 }
        },
        "color": { "value": ["#00ffe7","#ff00c8", "#fff"] },
        "shape": {
          "type": "circle",
          "stroke": { "width": 0, "color": "#000000" },
          "polygon": { "nb_sides": 5 }
        },
        "opacity": {
          "value": 0.33,
          "random": true,
          "anim": { "enable": false }
        },
        "size": {
          "value": 4,
          "random": true,
          "anim": { "enable": false }
        },
        "line_linked": {
          "enable": true,
          "distance": 160,
          "color": "#00ffe7",
          "opacity": 0.23,
          "width": 1.8
        },
        "move": {
          "enable": true,
          "speed": 2.8,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": { "enable": false }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": false },
          "resize": true
        },
        "modes": {
          "grab": { "distance": 170, "line_linked": { "opacity": 0.46 } }
        }
      },
      "retina_detect": true
    }
  );