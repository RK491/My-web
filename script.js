document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});

async function loadProfileData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();

        renderProfile(data.profile);
        renderLinks(data.links);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderProfile(profile) {
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-bio').textContent = profile.bio;
    document.getElementById('profile-img').src = profile.imageUrl;
}

function renderLinks(links) {
    const container = document.getElementById('links-container');
    container.innerHTML = ''; // Clear existing

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'link-card';
        a.target = '_blank';
        
        // Determine icon based on title (simple logic)
        let iconClass = 'fas fa-link';
        if(link.title.toLowerCase().includes('github')) iconClass = 'fab fa-github';
        if(link.title.toLowerCase().includes('linkedin')) iconClass = 'fab fa-linkedin';
        if(link.title.toLowerCase().includes('twitter')) iconClass = 'fab fa-twitter';
        if(link.title.toLowerCase().includes('insta')) iconClass = 'fab fa-instagram';
        if(link.title.toLowerCase().includes('email')) iconClass = 'fas fa-envelope';

        a.innerHTML = `
            <i class="${iconClass}" style="color: ${link.color || '#000'}"></i>
            <span>${link.title}</span>
        `;
        container.appendChild(a);
    });
}
