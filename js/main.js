/**
 * Main Application Logic
 * Loads configuration and populates the portfolio
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        navBrand: document.getElementById('nav-brand'),
        heroName: document.getElementById('hero-name'),
        heroTitle: document.getElementById('hero-title'),
        heroTagline: document.getElementById('hero-tagline'),
        githubLink: document.getElementById('github-link'),
        linkedinLink: document.getElementById('linkedin-link'),
        bio: document.getElementById('bio'),
        skills: document.getElementById('skills'),
        experienceTimeline: document.getElementById('experience-timeline'),
        projectsGrid: document.getElementById('projects-grid'),
        educationGrid: document.getElementById('education-grid'),
        emailLink: document.getElementById('email-link'),
        contactLinkedin: document.getElementById('contact-linkedin'),
        contactGithub: document.getElementById('contact-github'),
        footerName: document.getElementById('footer-name'),
        currentYear: document.getElementById('current-year')
    };

    /**
     * Load profile configuration
     */
    async function loadProfile() {
        try {
            const response = await fetch('data/profile.json');
            if (!response.ok) {
                throw new Error('Failed to load profile');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading profile:', error);
            return null;
        }
    }

    /**
     * Populate hero section
     */
    function populateHero(profile) {
        if (elements.navBrand) elements.navBrand.textContent = profile.name.split(' ')[0];
        if (elements.heroName) elements.heroName.textContent = profile.name;
        if (elements.heroTitle) elements.heroTitle.textContent = profile.title;
        if (elements.heroTagline) elements.heroTagline.textContent = profile.tagline;

        // Set social links
        const githubUrl = `https://github.com/${profile.github.username}`;
        if (elements.githubLink) elements.githubLink.href = githubUrl;
        if (elements.linkedinLink) elements.linkedinLink.href = profile.linkedin;
    }

    /**
     * Populate about section
     */
    function populateAbout(profile) {
        if (elements.bio) elements.bio.textContent = profile.bio;

        if (elements.skills) {
            elements.skills.innerHTML = profile.skills.map(skill => `
                <div class="skill-tag">
                    <span>${skill}</span>
                </div>
            `).join('');
        }
    }

    /**
     * Populate experience section
     */
    function populateExperience(profile) {
        if (!elements.experienceTimeline || !profile.experience) return;

        elements.experienceTimeline.innerHTML = profile.experience.map(exp => `
            <div class="timeline-item fade-in">
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-role">${exp.role}</h3>
                        <span class="timeline-date">${exp.startDate} - ${exp.endDate}</span>
                    </div>
                    <p class="timeline-company">${exp.company}</p>
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
        `).join('');
    }

    /**
     * Populate education section
     */
    function populateEducation(profile) {
        if (!elements.educationGrid || !profile.education) return;

        elements.educationGrid.innerHTML = profile.education.map(edu => `
            <div class="education-card fade-in">
                <h3 class="education-school">${edu.school}</h3>
                <p class="education-degree">${edu.degree}</p>
                <p class="education-date">${edu.startDate} - ${edu.endDate}</p>
            </div>
        `).join('');
    }

    /**
     * Populate contact section
     */
    function populateContact(profile) {
        const githubUrl = `https://github.com/${profile.github.username}`;

        if (elements.emailLink) {
            elements.emailLink.href = `mailto:${profile.email}`;
        }
        if (elements.contactLinkedin) {
            elements.contactLinkedin.href = profile.linkedin;
        }
        if (elements.contactGithub) {
            elements.contactGithub.href = githubUrl;
        }
        if (elements.footerName) {
            elements.footerName.textContent = profile.name;
        }
    }

    /**
     * Load GitHub projects
     */
    function loadProjects(profile) {
        if (!profile.github || !profile.github.username) return;

        GitHubAPI.renderProjects('projects-grid', profile.github.username, {
            excludeOrgs: profile.github.excludeOrgs,
            excludeForks: profile.github.excludeForks,
            whitelist: profile.github.whitelist || [],
            maxRepos: 12
        });
    }

    /**
     * Initialize scroll animations
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Initialize mobile navigation
     */
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    /**
     * Initialize smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Update current year in footer
     */
    function updateYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }
    }

    /**
     * Initialize the application
     */
    async function init() {
        // Set current year
        updateYear();

        // Initialize UI components
        initMobileNav();
        initSmoothScroll();

        // Load and populate profile data
        const profile = await loadProfile();

        if (profile) {
            populateHero(profile);
            populateAbout(profile);
            populateExperience(profile);
            populateEducation(profile);
            populateContact(profile);
            loadProjects(profile);

            // Update page title
            document.title = `${profile.name} | Portfolio`;
        }

        // Initialize scroll animations after content is loaded
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
