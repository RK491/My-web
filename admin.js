let currentLinks = [];

// On Load
document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in (simple session check)
    if(sessionStorage.getItem('adminAuth')) {
        showDashboard();
    }
});

async function login() {
    const password = document.getElementById('admin-password').value;
    if(!password) return;

    // We verify password by attempting to fetch data with a "fake" update 
    // or just storing it in session for this simple demo.
    // For better security, we store it and send it with the save request.
    sessionStorage.setItem('adminAuth', password);
    showDashboard();
}

function logout() {
    sessionStorage.removeItem('adminAuth');
    location.reload();
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    loadAdminData();
}

async function loadAdminData() {
    const response = await fetch('/api/data');
    const data = await response.json();

    // Fill Profile Inputs
    document.getElementById('edit-name').value = data.profile.name;
    document.getElementById('edit-bio').value = data.profile.bio;
    document.getElementById('edit-image').value = data.profile.imageUrl;

    // Fill Links
    currentLinks = data.links || [];
    renderLinkInputs();
}

function renderLinkInputs() {
    const container = document.getElementById('links-list');
    container.innerHTML = '';

    currentLinks.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <input type="text" placeholder="Title (e.g. GitHub)" value="${link.title}" onchange="updateLink(${index}, 'title', this.value)">
            <input type="text" placeholder="URL" value="${link.url}" onchange="updateLink(${index}, 'url', this.value)">
            <input type="text" placeholder="Color Hex (optional)" value="${link.color || ''}" onchange="updateLink(${index}, 'color', this.value)">
            <button class="remove-btn" onclick="removeLink(${index})">Remove</button>
        `;
        container.appendChild(div);
    });
}

function addLinkInput() {
    currentLinks.push({ title: '', url: '', color: '#333' });
    renderLinkInputs();
}

function removeLink(index) {
    currentLinks.splice(index, 1);
    renderLinkInputs();
}

function updateLink(index, field, value) {
    currentLinks[index][field] = value;
}

async function saveChanges() {
    const password = sessionStorage.getItem('adminAuth');
    
    const payload = {
        password: password,
        profile: {
            name: document.getElementById('edit-name').value,
            bio: document.getElementById('edit-bio').value,
            imageUrl: document.getElementById('edit-image').value
        },
        links: currentLinks
    };

    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const msgEl = document.getElementById('save-msg');
        
        if (result.success) {
            msgEl.textContent = "Saved successfully!";
            msgEl.className = "success";
        } else {
            msgEl.textContent = "Error: " + result.message;
            msgEl.className = "error";
            if(result.message === 'Invalid Password') logout();
        }
    } catch (err) {
        console.error(err);
    }
}
