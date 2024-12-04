
//Scroll to whatever id
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

//Hide&show navbar when scrolling
let lastScrollTop = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
        // Show navbar when reached bottom
        if (!navbar.classList.contains('showNav')) {
            navbar.classList.remove('hideNav');
            void navbar.offsetWidth; 
            navbar.classList.add('showNav');
        }
    } else if (scrollTop > lastScrollTop) {
        // Hide navbar when scrolling down
        if (!navbar.classList.contains('hideNav')) {
            navbar.classList.remove('showNav');
            void navbar.offsetWidth; 
            navbar.classList.add('hideNav');
        }
    } else {
        // Show navbar when scrolling up
        if (!navbar.classList.contains('showNav')) {
            navbar.classList.remove('hideNav');
            void navbar.offsetWidth; 
            navbar.classList.add('showNav');
        }
    }

    lastScrollTop = scrollTop;
});



//Debounce function to limit the rate of calling a function
function debounce(func, delay) {
    let inDebounce;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
}

// Make the card insert to the iframe
    document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const projectScreen = document.getElementById("projects");
    const explanationScreen = document.getElementById("explanation");

    
    const debouncedScrollToSection = debounce(scrollToSection, 150);

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            projectScreen.classList.add("showSection");
            explanationScreen.classList.add("showSection");
            debouncedScrollToSection("projects");
            card.classList.add("fly");
            setTimeout(() => {
                card.classList.remove("fly");
            }, 1000);
        });
    });


    const explanations = {
        card1: "<h1>Spring is Coming</h1> <h4>Controlls:</h4> <p>Drag unit on board to deploy, defend the road!</p>",
        card2: "<h1>Hero</h1> <h4>Controlls:</h4> <p>Space & C to fire, use mouse to control, M to choose a control mode using mouse or keyboard (more challenge to beat to boss!)</p>",
        card3: "<h1>PathER</h1> <h4>Controlls:</h4> <p>WASD to move, left click to attack.</p> <h4>Information: </h4> <p>This demo of PathER is a 2D roguelike RPG game where the player will be able to choose their own path, with every play through will have a different experience. The game will have four different classes for players to pick, fighting against monsters and progressively getting stronger after defeating more monsters and bosses. The project is made by two men, a coder, and an artist and it is still a work in progress and will be updated constantly.</p> <h4>Author:</h4><p>Lixiao Kuang, Yitao Xie</p>" 
    };

    function updateExplanation(cardId) {
        const explanationDiv = document.getElementById("explanation");
        explanationDiv.innerHTML = explanations[cardId];
    }

    const card1 = document.getElementById("card1");
    card1.addEventListener("click", () => {
        var iframe = document.getElementById('gameWindow');
        var newSrc = "https://snowey1110.github.io/385TeamProject/Final%20Project/webGL/Final/";
        iframe.src = newSrc;
        updateExplanation('card1');
    });

    const card2 = document.getElementById("card2");
    card2.addEventListener("click", () => {
        var iframe = document.getElementById('gameWindow');
        var newSrc = "https://snowey1110.github.io/CSS385/Next%20Generation%20Hero/webGL/";
        iframe.src = newSrc;
        updateExplanation('card2');
    });

    const card3 = document.getElementById("card3");
    card3.addEventListener("click", () => {
        var iframe = document.getElementById('gameWindow');
        var newSrc = "https://snowey1110.github.io/ProjectPathER/WebGL/";
        iframe.src = newSrc;
        updateExplanation('card3');
    });
});


//Animate the card showing once user can see it
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    })
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));