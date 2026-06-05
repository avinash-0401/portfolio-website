document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Sticky Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Drawer Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
            });
        });
    }

    // Smooth scroll offset adjustments and active class tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const scrollActive = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // Match offset with navbar padding
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollActive);

    // Typing Animation Effect
    const words = ["Software Developer", "Full Stack Developer", "Machine Learning Enthusiast"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.querySelector('.typing-text');

    const typeEffect = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before typing next word
        }

        setTimeout(typeEffect, typeSpeed);
    };

    if (typingSpan) {
        typeEffect();
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm && formFeedback && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button during load animation
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            const btnSpan = submitBtn.querySelector('span');
            const originalText = btnSpan.textContent;
            btnSpan.textContent = 'Sending Message...';
            
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple validation check
            if (!name || !email || !subject || !message) {
                formFeedback.textContent = 'Please fill out all fields.';
                formFeedback.classList.add('error');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                btnSpan.textContent = originalText;
                return;
            }

            // Configuration: Enter your Formspree URL OR Web3Forms Access Key to receive real emails in your Gmail
            const formspreeUrl = "YOUR_FORMSPREE_URL_HERE"; // e.g., "https://formspree.io/f/your_form_id"
            const web3FormsAccessKey = "d9b8b801-fcd4-4556-a46e-d5023513d4cc"; // e.g., "your-web3forms-key"

            if (formspreeUrl !== "YOUR_FORMSPREE_URL_HERE") {
                // Real submission using Formspree
                fetch(formspreeUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                })
                .then(async (response) => {
                    if (response.ok) {
                        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                        formFeedback.classList.add('success');
                        contactForm.reset();
                    } else {
                        const json = await response.json();
                        formFeedback.textContent = json.error || "Failed to send message via Formspree.";
                        formFeedback.classList.add('error');
                    }
                })
                .catch(() => {
                    formFeedback.textContent = "Network error. Please check your connection and try again.";
                    formFeedback.classList.add('error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    btnSpan.textContent = originalText;
                });
            } else if (web3FormsAccessKey !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
                // Real submission to Gmail using Web3Forms
                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: web3FormsAccessKey,
                        name: name,
                        email: email,
                        subject: `${subject} (from Portfolio Website)`,
                        message: message
                    })
                })
                .then(async (response) => {
                    const json = await response.json();
                    if (response.status === 200) {
                        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                        formFeedback.classList.add('success');
                        contactForm.reset();
                    } else {
                        formFeedback.textContent = json.message || "Failed to send message.";
                        formFeedback.classList.add('error');
                    }
                })
                .catch(() => {
                    formFeedback.textContent = "Network error. Please check your connection and try again.";
                    formFeedback.classList.add('error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    btnSpan.textContent = originalText;
                });
            } else {
                // Fallback: Simulate submission for testing when no key is entered
                setTimeout(() => {
                    formFeedback.textContent = `Thank you, ${name}! (Simulation Mode) Your message has been simulated successfully. To receive real emails, set up your Formspree URL or Web3Forms Key in script.js.`;
                    formFeedback.classList.add('success');
                    
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    btnSpan.textContent = originalText;
                }, 1200);
            }
        });
    }
});
