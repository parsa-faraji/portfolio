/**
 * Main Application Logic
 * Loads profile.json and populates all sections
 */

(function () {
    'use strict';

    const $ = (id) => document.getElementById(id);

    async function loadProfile() {
        try {
            const res = await fetch('data/profile.json');
            if (!res.ok) throw new Error('Failed to load profile');
            return await res.json();
        } catch (err) {
            console.error('Error loading profile:', err);
            return null;
        }
    }

    function populateHero(p) {
        const brand = $('nav-brand');
        if (brand) brand.textContent = p.name.split(' ')[0];
        if ($('hero-name')) $('hero-name').textContent = p.name;
        if ($('hero-title')) $('hero-title').textContent = p.title;
        if ($('hero-tagline')) $('hero-tagline').textContent = p.tagline;

        const ghUrl = 'https://github.com/' + p.github.username;
        if ($('github-link')) $('github-link').href = ghUrl;
        if ($('linkedin-link')) $('linkedin-link').href = p.linkedin;
        if ($('resume-link')) $('resume-link').href = p.resumeUrl;
    }

    function populateAbout(p) {
        if ($('bio')) $('bio').textContent = p.bio;

        const container = $('skills-container');
        if (!container) return;

        container.innerHTML = Object.entries(p.skills).map(([group, skills]) => `
            <div class="skill-group fade-in">
                <h3>${group}</h3>
                <div class="skill-tags">
                    ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    function renderTimeline(containerId, items) {
        const el = $(containerId);
        if (!el || !items) return;

        el.innerHTML = items.map(item => `
            <div class="timeline-item fade-in">
                <div class="timeline-header">
                    <h3 class="timeline-role">${item.role || item.name}</h3>
                    <span class="timeline-date">${item.startDate} \u2013 ${item.endDate}</span>
                </div>
                ${item.company ? `<p class="timeline-company">${item.company}</p>` : ''}
                <ul class="timeline-bullets">
                    ${item.bullets.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    function populateEducation(p) {
        const el = $('education-grid');
        if (!el || !p.education) return;

        el.innerHTML = p.education.map(edu => {
            const details = [];
            if (edu.honors) details.push(...edu.honors);
            if (edu.coursework) details.push('Coursework: ' + edu.coursework.join(', '));

            return `
                <div class="education-card fade-in">
                    <div class="education-header">
                        <h3 class="education-school">${edu.school}</h3>
                        ${edu.gpa ? `<span class="education-gpa">GPA: ${edu.gpa}</span>` : ''}
                    </div>
                    <p class="education-degree">${edu.degree}</p>
                    <p class="education-date">${edu.startDate} \u2013 ${edu.endDate}</p>
                    ${details.length > 0 ? `
                        <ul class="education-details">
                            ${details.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    function populateContact(p) {
        const ghUrl = 'https://github.com/' + p.github.username;
        if ($('email-link')) $('email-link').href = 'mailto:' + p.email;
        if ($('contact-linkedin')) $('contact-linkedin').href = p.linkedin;
        if ($('contact-github')) $('contact-github').href = ghUrl;
        if ($('footer-name')) $('footer-name').textContent = p.name;
    }

    function loadProjects(p) {
        if (!p.github || !p.github.username) return;
        GitHubAPI.renderProjects('projects-grid', p.github.username, {
            excludeOrgs: p.github.excludeOrgs,
            excludeForks: p.github.excludeForks,
            whitelist: p.github.whitelist || [],
            maxRepos: 12
        });
    }

    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    function initMobileNav() {
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('active');
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = document.querySelector('.navbar').offsetHeight;
                    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
                }
            });
        });
    }

    async function init() {
        if ($('current-year')) $('current-year').textContent = new Date().getFullYear();

        initMobileNav();
        initSmoothScroll();

        const profile = await loadProfile();
        if (!profile) return;

        populateHero(profile);
        populateAbout(profile);
        renderTimeline('experience-timeline', profile.experience);
        renderTimeline('leadership-timeline', profile.projectsAndLeadership);
        populateEducation(profile);
        populateContact(profile);
        loadProjects(profile);

        document.title = profile.name + ' | Portfolio';

        setTimeout(initScrollAnimations, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
