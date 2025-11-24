// API Base URL
const API_URL = 'http://localhost:3000/api';

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Character counter
const messageText = document.getElementById('messageText');
const charCount = document.getElementById('charCount');

messageText?.addEventListener('input', () => {
    charCount.textContent = messageText.value.length;
});

// Create Link
document.getElementById('createLink')?.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showNotification('Por favor ingresa un nombre de usuario', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const link = `${window.location.origin}/ngl-clone/?user=${username}`;
            document.getElementById('generatedLink').textContent = link;
            document.getElementById('linkResult').classList.remove('hidden');
            showNotification('Link creado exitosamente', 'success');
        } else {
            showNotification(data.error || 'Error al crear el link', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión con el servidor', 'error');
    }
});

// Copy Link
document.getElementById('copyLink')?.addEventListener('click', () => {
    const link = document.getElementById('generatedLink').textContent;
    navigator.clipboard.writeText(link);
    showNotification('Link copiado al portapapeles', 'success');
});

// Send Message
document.getElementById('sendMessage')?.addEventListener('click', async () => {
    const recipient = document.getElementById('recipientUsername').value.trim();
    const message = document.getElementById('messageText').value.trim();
    
    if (!recipient || !message) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Mensaje enviado anónimamente', 'success');
            document.getElementById('messageText').value = '';
            charCount.textContent = '0';
        } else {
            showNotification(data.error || 'Error al enviar el mensaje', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión con el servidor', 'error');
    }
});

// View Messages
document.getElementById('viewMessages')?.addEventListener('click', async () => {
    const username = document.getElementById('viewUsername').value.trim();
    
    if (!username) {
        showNotification('Por favor ingresa tu nombre de usuario', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/messages/${username}`);
        const data = await response.json();
        
        if (response.ok) {
            displayMessages(data.messages);
        } else {
            showNotification(data.error || 'Error al cargar mensajes', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión con el servidor', 'error');
    }
});

// Display messages
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<div class="empty-state">No tienes mensajes aún 📭</div>';
        return;
    }
    
    messagesList.innerHTML = messages.map(msg => `
        <div class="message-item">
            <div class="message-text">${escapeHtml(msg.message)}</div>
            <div class="message-date">${new Date(msg.timestamp).toLocaleString('es-ES')}</div>
        </div>
    `).join('');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Check URL params for direct user link
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    
    if (user) {
        document.querySelector('[data-tab="send"]').click();
        document.getElementById('recipientUsername').value = user;
    }
});
