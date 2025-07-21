document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll animations
    const animatedElements = document.querySelectorAll('.teams-section, .games-section, .news-section, .about-us-section, .contact-section, .team-card, .news-card, .game-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // EmailJS Contact Form
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Replace with your EmailJS serviceID, templateID, and userID
            const serviceID = 'service_3pfah95';
            const templateID = 'template_rbp99rm';
            const userID = 'H4BhspzmOzGsY_HpT';

            emailjs.sendForm(serviceID, templateID, this, userID)
                .then(() => {
                    alert('Message sent successfully!');
                    contactForm.reset();
                }, (err) => {
                    alert(JSON.stringify(err));
                });
        });
    }

});


