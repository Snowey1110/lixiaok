const translate = document.querySelectorAll(".translate");
const big_title = document.querySelector(".big-title");
const header = document.querySelector("header");
const shadows = document.querySelectorAll(".shadow");
const contents = document.querySelectorAll(".content");
const sections = document.querySelectorAll("section");
const image_containers = document.querySelectorAll(".imgContainer");
const opacityElements = document.querySelectorAll(".opacity");
const borders = document.querySelectorAll(".border");

let header_height = header.offsetHeight;

window.addEventListener('scroll', () => {
    let scroll = window.pageYOffset;

    translate.forEach(element => {
        let speed = element.dataset.speed;
        let opacity = 1 - scroll / (header_height / (speed < 0 ? -speed : speed));
        element.style.transform = `translateY(${scroll * speed}px)`;
        element.style.opacity = opacity < 0 ? 0 : opacity;
    });

    opacityElements.forEach(element => {
        const section = element.closest('section');
        let sectionY = section.getBoundingClientRect();
        element.style.opacity = (scroll - sectionY.top + window.innerHeight) / (window.innerHeight + section.offsetHeight);
    });

    big_title.style.opacity = -scroll / (header_height / 2) + 1;

    //if I want shadow as going down deeper
    // shadows.forEach(shadow => {
    //     shadow.style.height = `${scroll * 0.5 + 300}px`;
    // });
    

    contents.forEach(content => {
        const section = content.closest('section');
        let sectionY = section.getBoundingClientRect();
        content.style.transform = `translateY(${(scroll - sectionY.top) / section.offsetHeight * 50 - 50}px)`;
    });

    image_containers.forEach(image_container => {
        const section = image_container.closest('section');
        let sectionY = section.getBoundingClientRect();
        image_container.style.transform = `translateY(${(scroll - sectionY.top) / section.offsetHeight * -50 + 50}px)`;
    });

    //border below title that animates extending when scrolling down
    borders.forEach(border => {
        const section = border.closest('section');
        let sectionY = section.getBoundingClientRect();
        border.style.width = `${(scroll - sectionY.top + window.innerHeight) / (window.innerHeight + section.offsetHeight) * 30}%`;
    });
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}


//Card clicking listener
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", () => {

            scrollToSection("bottom");
        });
    });

    function updateExperience(titleText, competencies, textContent, imgSrc) {
        const title = document.getElementById("ExperienceTitle");
        const text = document.getElementById("ExperienceText");
        const img = document.getElementById("ExperienceImage");
        title.innerHTML = titleText;
        title.innerHTML += "<h5>" + competencies + "</h5>"
        text.innerHTML = textContent;
        img.src = imgSrc;
    }

    const card1 = document.getElementById("card1");
    card1.addEventListener("click", () => {
        updateExperience("Software Engineering Studio", "Communication, Fairness, Flexibility", "As a software engineer group, my role was to group manage the team, since at that moment in my life I was not excellent at coding just yet, I teamed up with 3 other introverted software engineers and I was the only one who stood up front to take the lead and manage the team. As the team manager, my role is to keep communication between the group and assign them with appropriate amount of work, and manage the time that works the most efficiently for the team. We would just meet up either in person or create a Zoom meeting like this and I would just use the whiteboard to analyze each spring what could be better and to plan our objectives for the next sprint. We have an Azure DevOps server setup for the class, to keep track of our work and have a Kanban board, retrospective, queries, and many more tools to work just like working in the industry. The learning curve of the class is rough since it was my first time getting introduced to the tool, I got behind in the class at one point and had to work extra hard just to get back on track. After persistent efforts and perseverance, I made it back on track and finished the class thanks to the help of communication with my team and professor, it taught me a valuable lesson on how to be a great leader even if you are not an expert in every field.", "images/390Pic.png");
    });

    const card2 = document.getElementById("card2");
    card2.addEventListener("click", () => {
        updateExperience("Practicum In Community Service Activity", "Service, Listening, Inclusion", "As part of my leadership minor, I completed community service at Cleveland High School in Seattle, assisting students with coding and Unity game creation. This role allowed me to support the community by alleviating the workload of school staff and directly contributing to students' education. I gained valuable teaching experience and learned the importance of clear communication and adaptability. This experience not only enhanced my leadership skills but also underscored the impact of dedicated community service.", "images/401Pic.jpg");
    });

    const card3 = document.getElementById("card3");
    card3.addEventListener("click", () => {
        updateExperience("Introduction To Game Development", "Creativity, Collaboration, Fun", "This class was a highlight of my university experience, fulfilling my childhood dream of coding games. It emphasized Creativity, Collaboration, and Fun as we first completed Unity practice assignments and then teamed up to create a major project. I was so enthusiastic that I went above and beyond in my assignments, resulting in projects more complex than required (You can view my game on the home page). Our team effort culminated in a collaborative game, for which I created a trailer. This class not only solidified my Unity fundamentals but also prepared me for utilizing these skills in my upcoming capstone project.", "images/385Pic.png");

    });

    const card4 = document.getElementById("card4");
    card4.addEventListener("click", () => {
        updateExperience("Applied Computing Capstone", "Independence, Challenge", "In my capstone course for my major, I am leveraging the Unity skills I acquired in game development to create a 2D roguelike RPG game. Unlike previous collaborative projects, this capstone emphasizes independence and challenge, requiring me to single-handedly explore and implement game mechanics to ensure the game is engaging. This solo endeavor pushes me to research and resolve technical issues on my own, a stark contrast to the simpler mechanics of my previous classes. During the implementation of the project, I encountered numerous technical difficulties, but with the support of professors and librarians, I learned to navigate and overcome these challenges and gathered a significant amount of experience. ", "images/496Pic.png");

    });

    const card5 = document.getElementById("card5");
    card5.addEventListener("click", () => {
        updateExperience("Applied Algorithmics", "Problem Solving, Resiliency, Synthesis", "During my deep dives into this algorithms and data structures class, I cultivated proficiency in Python, problem-solving, and analytical abilities. I integrated mathematical principles into programming and learned various sorting algoithmns and applying them on pen and paper exercises, which greatly benifited my problem solving skill shaping me into a better coder.", "images/340Pic.png");
    });

    const card6 = document.getElementById("card6");
    card6.addEventListener("click", () => {
        updateExperience("Hardware And Operating Systems", "Self-development, Problem solving, Analysis", "CSS 421 is undoubtedly one of the toughest classes I've mastered. Over a 10-week span, we covered a wide range of topics including Intro to Computer Systems, HW and OS, Number and Logic, Computer Arithmetic, Assembler, Processor, Memory, Exceptions, Processes, Virtual Memory, System I/O, File Systems, Network Programming, Threads, and Synchronization. We delved into the hardware level of computer systems, analyzing code at the bit level to understand how machines interpret and process information. This class covered the broadest array of topics compared to any other, requiring me to study exceptionally hard and research more about every topic online to grasp the material and succeed.", "images/421Pic.jpg");
    });

    const card7 = document.getElementById("card7");
    card7.addEventListener("click", () => {
        updateExperience("UDub Minecraft", "Fairness, Friendship, Learning, Service", "As a Vice-President of UDub Minecraft, a Minecraft club community in the University of Washington Seattle has over 2000 members. My task is to operate the server and make sure everyone of all backgrounds is treated with fairness and respect. We accept contracts from companies like APICAT to maintain funding to run our servers so that everyone can expand their limitless creativity for free, I have led multiple large-scale events within the community to practice my skill of leadership and also as the basic club operation activity.", "images/udub.jpg");
    });

    const card8 = document.getElementById("card8");
    card8.addEventListener("click", () => {
        updateExperience("House of Wisdom", "Idea generation, Motivation, Mentoring", "As a mentor in the House of Wisdom, the non-profit tutoring organization. I guide students in elementary school on math. I tutor students by giving examples guiding them to the right mindset for solving problems, and motivating them to have a growth mindset ensuring every student gets a positive learning experience.", "images/how.jpg");
    });

    const card9 = document.getElementById("card9");
    card9.addEventListener("click", () => {
        updateExperience("Tech Academy", "Patience Respect, Motivation", "As a part of the teaching team at Tech Academy, my task is to teach elementary students how to code, 3D modeling, Robotics... etc STEM topics. Guiding the students to build creatively not only increases their skill of problem-solving, also it can often surprises us with some new ideas that we have never thought about.", "images/tech.png");
    });

    const card10 = document.getElementById("card10");
    card10.addEventListener("click", () => {
        updateExperience("Cleveland High School", "Patience, Respect", "As a teaching assistant at Cleveland High School, I played a role in educating students on the fundamentals and advanced concepts of coding, focusing on Java and Unity programming. I gave students examples of problems and guided the ones who were stuck on how to analyze problems and break them down.", "images/Cleveland.jpg");
    });

    const card11 = document.getElementById("card11");
    card11.addEventListener("click", () => {
        updateExperience("Outdoor activities", "Communication Adventure", "One of my greatest hobbies is exploring nature, watching the incredible views either by snowboarding on the peak of mountains or wakeboarding in the middle of a lake to enjoy acceleration. I love sports related to balance or fast motion such as rollerskating, badminton, and kendo. When I come to fully focus and leave everything else behind giving me great satisfaction and it is one of the primary ways for me to relax.", "images/wakeboard.png");
    });

    const card12 = document.getElementById("card12");
    card12.addEventListener("click", () => {
        updateExperience("Coding", "Learning, Innovation, Intelligence", "Coding has always been the only skill that I am trying my best to focus on, out of all other subjects I love coding because as long as I read patiently and break the problem down, everything makes sense. It is also my best tool because it is the only way for me to create something using the academic skills that I have been focusing on for half of my life. Doing projects with others and being able to commit one of my special efforts that no one else can replicate made me feel helpful and gave me satisfaction in return. ", "images/coding2.jpg");
    });


    
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    })
});

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else{
            entry.target.classList.remove('show');
        }
    })
});

const hiddenElements = document.querySelectorAll('.hiddenOnce, .hiddenLeftOnce, .hiddenRightOnce');
const hiddenElements2 = document.querySelectorAll('.hiddenAll, .hiddenLeftAll, .hiddenRightAll');

hiddenElements.forEach((el) => observer.observe(el));
hiddenElements2.forEach((el) => observer2.observe(el));