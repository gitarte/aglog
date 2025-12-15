// aglog - Cabrillo Logger Application
// Pure vanilla JavaScript - no frameworks

// Constants
const STORAGE_KEY  = 'aglog_entries';
const SETTINGS_KEY = 'aglog_settings';

// State
let entries   = [];
let editingId = null;
let settings  = {};

// DOM Elements
let form, settingsForm, logContainer, submitBtn, cancelBtn, entryCountEl, utcClockEl;

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadSettings();
    loadEntries();
    renderLog();
    startClock();
    attachEventListeners();
    populateSettingsForm();
});

// Initialize DOM element references
function initializeElements() {
    form         = document.getElementById('qso-form');
    settingsForm = document.getElementById('settings-form');
    logContainer = document.getElementById('log-body');
    submitBtn    = document.getElementById('submit-btn');
    cancelBtn    = document.getElementById('cancel-btn');
    entryCountEl = document.getElementById('entry-count');
    utcClockEl   = document.getElementById('utc-clock');
}

// Attach event listeners
function attachEventListeners() {
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancelEdit);
    document.getElementById('save-btn').addEventListener('click', handleSaveCabrillo);
    document.getElementById('clear-btn').addEventListener('click', handleClearAll);
    document.getElementById('clear-settings-btn').addEventListener('click', handleClearSettings);
    document.getElementById('toggle-settings').addEventListener('click', toggleSettings);
    document.getElementById('save-settings-btn').addEventListener('click', handleSaveSettings);
}
// Start UTC clock
function startClock() {
    function updateClock() {
        const now = new Date();
        utcClockEl.textContent = `UTC: ${formatDateTimeDisplay(now)}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Load settings from localStorage
function loadSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        settings = stored ? JSON.parse(stored) : {};
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        settings = {};
    }
}

// Save settings to localStorage
function saveSettings() {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
        alert('Error saving settings.');
    }
}

// Load entries from localStorage
function loadEntries() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        entries = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading entries from localStorage:', error);
        entries = [];
        alert('Error loading saved log. Starting with empty log.');
    }
}

// Save entries to localStorage
function saveEntries() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.error('Error saving entries to localStorage:', error);
        alert('Error saving log. Check if localStorage is available and not full.');
    }
}

// Toggle settings form visibility
function toggleSettings() {
    const settingsForm = document.getElementById('settings-form');
    const toggleBtn = document.getElementById('toggle-settings');
    if (settingsForm.style.display === 'none') {
        settingsForm.style.display = 'block';
        toggleBtn.textContent = 'Ukryj ustawienia';
    } else {
        settingsForm.style.display = 'none';
        toggleBtn.textContent = 'Show Settings';
    }
}

// Populate settings form with current values
function populateSettingsForm() {
    document.getElementById('station-callsign').value = settings.stationCallsign || '';
    document.getElementById('contest-name').value     = settings.contestName     || '';
    document.getElementById('claimed-score').value    = settings.claimedScore    || '';
    document.getElementById('category').value         = settings.category        || '';
    document.getElementById('locator').value          = settings.locator         || '';
    document.getElementById('province').value         = settings.province        || '';
    document.getElementById('club').value             = settings.club            || '';
    document.getElementById('operators').value        = settings.operators       || '';
    document.getElementById('email').value            = settings.email           || '';
    document.getElementById('name').value             = settings.name            || '';
    document.getElementById('address-1').value        = settings.address1        || '';
    document.getElementById('address-2').value        = settings.address2        || '';
    document.getElementById('address-3').value        = settings.address3        || '';
}

// Handle save settings
function handleSaveSettings() {
    settings.stationCallsign = document.getElementById('station-callsign').value.trim().toUpperCase();
    settings.contestName = document.getElementById('contest-name').value.trim().toUpperCase();
    settings.claimedScore = parseInt(document.getElementById('claimed-score').value) || 0;
    settings.category = document.getElementById('category').value.trim().toUpperCase();
    settings.locator = document.getElementById('locator').value.trim().toUpperCase();
    settings.province = document.getElementById('province').value.trim().toUpperCase();
    settings.club = document.getElementById('club').value.trim().toUpperCase();
    settings.operators = document.getElementById('operators').value.trim().toUpperCase();
    settings.email = document.getElementById('email').value.trim().toUpperCase();
    settings.name = document.getElementById('name').value.trim().toUpperCase();
    settings.address1 = document.getElementById('address-1').value.trim().toUpperCase();
    settings.address2 = document.getElementById('address-2').value.trim().toUpperCase();
    settings.address3 = document.getElementById('address-3').value.trim().toUpperCase();
    
    saveSettings();
    alert('Settings saved successfully!');
}

// Handle form submission (add or update)
function handleFormSubmit(e) {
    e.preventDefault();

    const frequency     = document.getElementById('frequency').value.trim().toUpperCase();
    const mode          = document.getElementById('mode').value.trim().toUpperCase();
    const callsign      = document.getElementById('callsign').value.trim().toUpperCase();
    const rstReceived   = document.getElementById('rst-received').value.trim().toUpperCase();
    const groupReceived = document.getElementById('group-received').value.trim().toUpperCase();
    const rstSent       = document.getElementById('rst-sent').value.trim().toUpperCase();
    const groupSent     = document.getElementById('group-sent').value.trim().toUpperCase();
    
    // Validate callsign format
    if (!validateCallsign(callsign)) {
        alert('Invalid callsign format. Must contain letters and numbers.');
        return;
    }
    
    // Validate RST format
    if (!validateRST(rstSent) || !validateRST(rstReceived)) {
        alert('Invalid RST format. Use format like 599, 59, or 5NN.');
        return;
    }
    
    if (editingId) {
        // Update existing entry
        const entry = entries.find(e => e.id === editingId);
        if (entry) {
            entry.callsign = callsign;
            entry.frequency = frequency;
            entry.mode = mode;
            entry.rstSent = rstSent;
            entry.groupSent = groupSent;
            entry.rstReceived = rstReceived;
            entry.groupReceived = groupReceived;
        }
        exitEditMode();
    } else {
        // Add new entry
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            callsign,
            frequency,
            mode,
            rstSent,
            groupSent,
            rstReceived,
            groupReceived
        };
        entries.push(newEntry);
    }
    
    saveEntries();
    renderLog();
    form.reset();
}

// Validate callsign format
function validateCallsign(callsign) {
    // Basic ITU validation: must have letters and numbers
    const hasLetter = /[A-Za-z]/.test(callsign);
    const hasNumber = /[0-9]/.test(callsign);
    return hasLetter && hasNumber && callsign.length >= 3;
}

// Validate RST format
function validateRST(rst) {
    // Accept formats like: 599, 59, 5NN, etc.
    return /^[1-5][1-9N][1-9N]?$/.test(rst);
}

// Enter edit mode
function enterEditMode(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    editingId = id;
    document.getElementById('edit-id').value = id;
    document.getElementById('callsign').value = entry.callsign;
    document.getElementById('frequency').value = entry.frequency;
    document.getElementById('mode').value = entry.mode;
    document.getElementById('rst-sent').value = entry.rstSent;
    document.getElementById('group-sent').value = entry.groupSent;
    document.getElementById('rst-received').value = entry.rstReceived;
    document.getElementById('group-received').value = entry.groupReceived;
    
    submitBtn.textContent = 'Update QSO';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Exit edit mode
function exitEditMode() {
    editingId = null;
    document.getElementById('edit-id').value = '';
    submitBtn.textContent = 'Add QSO';
    cancelBtn.style.display = 'none';
}

// Handle cancel edit
function handleCancelEdit() {
    exitEditMode();
    form.reset();
}

// Delete entry
function deleteEntry(id) {
    if (!confirm('Delete this QSO entry?')) return;
    
    entries = entries.filter(e => e.id !== id);
    saveEntries();
    renderLog();
    
    // Exit edit mode if deleting the entry being edited
    if (editingId === id) {
        exitEditMode();
        form.reset();
    }
}

// Render log display
function renderLog() {
    if (Object.keys(settings).length === 0) {
        alert('Fullfill contest settings form!');
        return;
    }

    if (entries.length === 0) {
        logContainer.innerHTML = '<p class="empty-message">No QSOs logged yet. Start logging above!</p>';
        entryCountEl.textContent = '0 QSOs logged';
        return;
    }
    
    // Sort by timestamp, newest first
    const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // QSO lines
    logContainer.innerHTML = sortedEntries.map(entry => {
            const date = new Date(entry.timestamp);
            const freq = String(Math.round(entry.frequency * 1000));
            const mode = entry.mode;
            const cabrilloDate = formatCabrilloDate(date);
            const cabrilloTime = formatCabrilloTime(date)   ;
            const call1 = settings.stationCallsign;
            const rst1 = entry.rstSent;
            const group1 = entry.groupSent;
            const call2 = entry.callsign;
            const rst2 = entry.rstReceived;
            const group2 = entry.groupReceived;
                return `
                    <tr style="font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;">
                        <td>${freq}</td>
                        <td>${mode}</td>
                        <td>${cabrilloDate}</td>
                        <td>${cabrilloTime}</td>
                        <td>${call1}</td>
                        <td>${rst1}</td>
                        <td>${group1}</td>
                        <td>${call2}</td>
                        <td>${rst2}</td>
                        <td>${group2}</td>
                        <td><button class="btn btn-edit" style="width:60px;padding:4px 6px;font-size:0.85em;" onclick="enterEditMode(${entry.id})">Edit</button></td>
                        <td><button class="btn btn-delete" style="width:60px;padding:4px 6px;font-size:0.85em;" onclick="deleteEntry(${entry.id})">Delete</button></td>
                    </tr>
            `
        }
    ).join('');
    
    entryCountEl.textContent = `${entries.length} QSO${entries.length !== 1 ? 's' : ''} logged`;
}

// Format date/time for display
function formatDateTimeDisplay(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Format date for Cabrillo
function formatCabrilloDate(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format time for Cabrillo
function formatCabrilloTime(date) {
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}${minutes}`;
}

// Generate Cabrillo format content
function generateCabrillo() {
    const now = new Date();
    let cabrillo = [];
    
    // Header
    cabrillo.push('START-OF-LOG: 3.0');
    cabrillo.push(`CREATED-BY: aglog v1.0`);
    cabrillo.push(`CALLSIGN: ${settings.stationCallsign || ''}`);
    cabrillo.push(`CONTEST: ${settings.contestName || ''}`);
    cabrillo.push(`CATEGORY: ${settings.category || ''}`);
    cabrillo.push(`CLAIMED-SCORE: ${settings.claimedScore || ''}`);
    cabrillo.push(`LOCATOR: ${settings.locator || ''}`);
    cabrillo.push(`PROVINCE: ${settings.province || ''}`);
    cabrillo.push(`CLUB: ${settings.club || ''}`);
    cabrillo.push(`OPERATORS: ${settings.operators || ''}`);
    cabrillo.push(`EMAIL: ${settings.email || ''}`);
    cabrillo.push(`NAME: ${settings.name || ''}`);
    cabrillo.push(`ADDRESS: ${settings.address1 || ''}`);
    cabrillo.push(`ADDRESS: ${settings.address2 || ''}`);
    cabrillo.push(`ADDRESS: ${settings.address3 || ''}`);
    cabrillo.push('SOAPBOX:');
    
    // Sort entries by timestamp
    const sortedEntries = [...entries].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // QSO lines
    sortedEntries.forEach(entry => {
        const date         = new Date(entry.timestamp);
        const freq         = String(Math.round(entry.frequency * 1000));
        const mode         = entry.mode;
        const cabrilloDate = formatCabrilloDate(date);
        const cabrilloTime = formatCabrilloTime(date);
        const call1        = settings.stationCallsign;
        const rst1         = entry.rstSent;
        const group1       = entry.groupSent;
        const call2        = entry.callsign;
        const rst2         = entry.rstReceived;
        const group2       = entry.groupReceived;
        
        cabrillo.push(`QSO: ${freq} ${mode} ${cabrilloDate} ${cabrilloTime} ${call1} ${rst1} ${group1} ${call2} ${rst2} ${group2}`);
    });
    
    cabrillo.push('END-OF-LOG:');
    return cabrillo.join('\n');
}

// Handle save Cabrillo
function handleSaveCabrillo() {
    if (Object.keys(settings).length === 0) {
        alert('No Contest settings to export!');
        return;
    }
    
    if (entries.length === 0) {
        alert('No QSOs to export!');
        return;
    }
    
    const content = generateCabrillo();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '_');
    const filename = `log_${timestamp}.cbr`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Handle clear all entries
function handleClearAll() {
    if (entries.length === 0) {
        alert('Log is already empty!');
        return;
    }
    
    const count = entries.length;
    if (!confirm(`Delete all ${count} QSO entries? This cannot be undone!`)) {
        return;
    }
    
    entries = [];
    saveEntries();
    renderLog();
    exitEditMode();
    form.reset();
}

function handleClearSettings() {
    if (Object.keys(settings).length === 0) {
        alert('Settings are already empty!');
        return;
    }

    if (!confirm('Clear all contest settings? This cannot be undone!')) {
        return;
    }
    
    settings = {};
    saveSettings();
    populateSettingsForm();
    settingsForm.reset();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions available globally for inline onclick handlers
window.enterEditMode = enterEditMode;
window.deleteEntry = deleteEntry;
