/**
 * GitHub API Integration
 * Fetches and filters repositories from GitHub
 */

const GitHubAPI = {
    baseUrl: 'https://api.github.com',

    /**
     * Fetch repositories for a user
     * @param {string} username - GitHub username
     * @param {Object} options - Filter options
     * @returns {Promise<Array>} - Filtered repositories
     */
    async fetchRepos(username, options = {}) {
        const {
            excludeOrgs = true,
            excludeForks = true,
            whitelist = [],
            sortBy = 'updated',
            maxRepos = 12
        } = options;

        try {
            const response = await fetch(
                `${this.baseUrl}/users/${username}/repos?sort=${sortBy}&per_page=100`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            let repos = await response.json();

            // Apply filters
            repos = repos.filter(repo => {
                // Exclude forks if specified
                if (excludeForks && repo.fork) {
                    return false;
                }

                // Exclude org repos (where owner is not the user)
                if (excludeOrgs && repo.owner.login !== username) {
                    return false;
                }

                // If whitelist is provided and not empty, only include whitelisted repos
                if (whitelist.length > 0 && !whitelist.includes(repo.name)) {
                    return false;
                }

                return true;
            });

            // Sort by stars, then by updated date
            repos.sort((a, b) => {
                if (b.stargazers_count !== a.stargazers_count) {
                    return b.stargazers_count - a.stargazers_count;
                }
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

            // Limit number of repos
            return repos.slice(0, maxRepos);

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            throw error;
        }
    },

    /**
     * Get language color for display
     * @param {string} language - Programming language
     * @returns {string} - CSS class for language color
     */
    getLanguageClass(language) {
        if (!language) return 'lang-default';

        const langMap = {
            'JavaScript': 'lang-javascript',
            'TypeScript': 'lang-typescript',
            'Python': 'lang-python',
            'Java': 'lang-java',
            'Go': 'lang-go',
            'Rust': 'lang-rust',
            'C': 'lang-c',
            'C++': 'lang-cpp',
            'C#': 'lang-csharp',
            'Ruby': 'lang-ruby',
            'PHP': 'lang-php',
            'Swift': 'lang-swift',
            'Kotlin': 'lang-kotlin',
            'HTML': 'lang-html',
            'CSS': 'lang-css',
            'Shell': 'lang-shell',
            'Jupyter Notebook': 'lang-python'
        };

        return langMap[language] || 'lang-default';
    },

    /**
     * Create HTML for a project card
     * @param {Object} repo - Repository data
     * @returns {string} - HTML string
     */
    createProjectCard(repo) {
        const languageClass = this.getLanguageClass(repo.language);
        const description = repo.description || 'No description provided';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;

        return `
            <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-card fade-in">
                <div class="project-header">
                    <h3 class="project-name">${repo.name}</h3>
                    <svg class="project-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                    </svg>
                </div>
                <p class="project-description">${description}</p>
                <div class="project-meta">
                    ${repo.language ? `
                        <div class="project-language">
                            <span class="language-dot ${languageClass}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : '<div></div>'}
                    <div class="project-stats">
                        ${stars > 0 ? `
                            <span class="stat">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                                </svg>
                                ${stars}
                            </span>
                        ` : ''}
                        ${forks > 0 ? `
                            <span class="stat">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                                </svg>
                                ${forks}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </a>
        `;
    },

    /**
     * Render projects to the DOM
     * @param {string} containerId - Container element ID
     * @param {string} username - GitHub username
     * @param {Object} options - Filter options
     */
    async renderProjects(containerId, username, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const repos = await this.fetchRepos(username, options);

            if (repos.length === 0) {
                container.innerHTML = `
                    <div class="error-message">
                        <p>No repositories found.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = repos.map(repo => this.createProjectCard(repo)).join('');

            // Trigger fade-in animations
            setTimeout(() => {
                container.querySelectorAll('.fade-in').forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }, 100);

        } catch (error) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Unable to load projects from GitHub.</p>
                    <p>Please check back later or visit my <a href="https://github.com/${username}" target="_blank" rel="noopener">GitHub profile</a> directly.</p>
                </div>
            `;
        }
    }
};

// Export for use in main.js
window.GitHubAPI = GitHubAPI;
