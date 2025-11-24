const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Data storage
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        return { users: [], messages: [] };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Create user
app.post('/api/users', (req, res) => {
    const { username } = req.body;
    
    if (!username || username.length < 3) {
        return res.status(400).json({ error: 'Usuario debe tener al menos 3 caracteres' });
    }
    
    const data = loadData();
    
    if (data.users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Usuario ya existe' });
    }
    
    data.users.push({ username, createdAt: new Date().toISOString() });
    saveData(data);
    
    res.json({ success: true, username });
});

// Send message
app.post('/api/messages', (req, res) => {
    const { recipient, message } = req.body;
    
    if (!recipient || !message) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    
    const data = loadData();
    
    if (!data.users.find(u => u.username === recipient)) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    data.messages.push({
        id: Date.now(),
        recipient,
        message,
        timestamp: new Date().toISOString()
    });
    
    saveData(data);
    
    res.json({ success: true });
});

// Get messages
app.get('/api/messages/:username', (req, res) => {
    const { username } = req.params;
    const data = loadData();
    
    const messages = data.messages
        .filter(m => m.recipient === username)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ messages });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
