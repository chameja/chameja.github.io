// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                this.navMenu.classList.remove('active');
                this.hamburger.classList.remove('active');
            });
        });

        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.hamburger.classList.toggle('active');
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });

        // Active section highlighting
        window.addEventListener('scroll', () => {
            this.highlightActiveSection();
        });
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate skill bars
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkillBars(entry.target);
                    }
                }
            });
        }, this.observerOptions);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => this.observer.observe(el));
    }

    animateSkillBars(skillCategory) {
        const skillBars = skillCategory.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 200);
        });
    }
}

// Contact form validation and handling
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 3 characters long';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                }
                break;
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.style.borderColor = 'var(--accent-color)';
        }
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.style.display = 'none';
            field.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate all fields
        let isFormValid = true;
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Show loading state
        this.submitBtn.textContent = 'Sending...';
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateSubmission(data);

            // Show success message
            this.showSuccessMessage();
            this.form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            // Reset button state
            this.submitBtn.textContent = 'Send Message';
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    simulateSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form submission data:', data);
            setTimeout(resolve, 1500); // Simulate network delay
        });
    }

    showSuccessMessage() {
        // Create and show success modal
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
    <h2 style="color: var(--secondary-color); margin-bottom: 1rem;">Message Sent Successfully! 🎉</h2>
    <p>Thank you for reaching out! I'll get back to you within 24 hours.</p>
    <p style="margin-top: 1rem; color: var(--text-light);">I appreciate your interest and look forward to connecting with you.</p>
    `;

        modal.style.display = 'block';
    }

    showErrorMessage(message) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
    <h2 style="color: var(--accent-color); margin-bottom: 1rem;">Oops! Something went wrong 😕</h2>
    <p>${message}</p>
    <p style="margin-top: 1rem; color: var(--text-light);">You can also reach me directly at c.hameja@alustudent.com</p>
    `;

        modal.style.display = 'block';
    }
}

// Project modal functionality
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('modal-close');

        this.projectData = {
            ecommerce: {
                title: 'E-Commerce Platform',
                description: 'A comprehensive online shopping solution built for modern businesses.',
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filtering',
                    'Shopping cart and checkout process',
                    'Payment integration with Stripe',
                    'Order tracking and management',
                    'Admin dashboard for inventory management',
                    'Responsive design for all devices',
                    'Email notifications and confirmations'
                ],
                technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Cloudinary'],
                challenges: 'The main challenge was implementing a secure payment system while maintaining a smooth user experience. I solved this by integrating Stripe\'s latest APIs and implementing comprehensive error handling.',
                github: '#',
                demo: '#'
            },
            dashboard: {
                title: 'Analytics Dashboard',
                description: 'An interactive data visualization platform for business intelligence.',
                features: [
                    'Real-time data visualization with D3.js',
                    'Customizable chart types and layouts',
                    'Advanced filtering and date range selection',
                    'Data export functionality (PDF, CSV)',
                    'User role-based access control',
                    'Responsive grid system',
                    'Dark/light theme toggle',
                    'API integration for live data feeds'
                ],
                technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
                challenges: 'Handling large datasets efficiently while maintaining smooth interactions was crucial. I implemented virtual scrolling and data pagination to optimize performance.',
                github: '#',
                demo: '#'
            },
            mobile: {
                title: 'Task Management App',
                description: 'A cross-platform mobile application for team collaboration.',
                features: [
                    'Cross-platform compatibility (iOS/Android)',
                    'Real-time task synchronization',
                    'Push notifications for updates',
                    'Offline functionality with data sync',
                    'Team collaboration tools',
                    'File attachments and comments',
                    'Time tracking and reporting',
                    'Customizable project workflows'
                ],
                technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Expo', 'Async Storage'],
                challenges: 'Ensuring consistent performance across different devices and operating systems required extensive testing and optimization. I used React Native\'s platform-specific code when necessary.',
                github: '#',
                demo: '#'
            }
        };

        this.init();
    }

    init() {
        // Close modal functionality
        this.closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Project card click handlers
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectKey = card.getAttribute('data-project');
                this.openModal(projectKey);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal(projectKey) {
        const project = this.projectData[projectKey];
        if (!project) return;

        this.modalBody.innerHTML = this.generateModalContent(project);
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    generateModalContent(project) {
        return `
    <h2 style="color: var(--primary-color); margin-bottom: 1rem;">${project.title}</h2>
    <p style="font-size: 1.1rem; margin-bottom: 2rem; color: var(--text-light);">${project.description}</p>

    <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">Key Features</h3>
    <ul style="margin-bottom: 2rem; padding-left: 1.5rem;">
        ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
    </ul>

    <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">Technologies Used</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
    </div>

    <h3 style="color: var(--secondary-color); margin-bottom: 1rem;">Technical Challenges</h3>
    <p style="margin-bottom: 2rem; line-height: 1.6;">${project.challenges}</p>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="${project.github}" target="_blank" class="btn" style="text-decoration: none;">View on GitHub</a>
        <a href="${project.demo}" target="_blank" class="btn btn-secondary" style="text-decoration: none; background: var(--secondary-color); border-color: var(--secondary-color);">Live Demo</a>
    </div>
    `;
    }
}

// Utility functions
class Utils {
    static throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all classes
    new Navigation();
    new ScrollAnimations();
    new ContactForm();
    new ProjectModal();

    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // Performance optimization: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
