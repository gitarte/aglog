# aglog

A lightweight browser-based Cabrillo logger for amateur radio operators, designed as an alternative to DQRLOG. Built with 100% vanilla JavaScript, no frameworks, no backend - just open and log!

## Features

- **Pure Browser Application**: No installation, no backend, no build process - just open `index.html`
- **Cabrillo Export**: Generate valid Cabrillo (.cbr) files for contest submission
- **Local Storage**: All data persists in your browser's localStorage - survives page reloads
- **UTC Timestamps**: Automatic timestamp generation from system clock in UTC (non-editable)
- **Full CRUD Operations**: Add, edit, and delete QSO entries
- **Input Validation**: Validates callsigns, RST reports, and frequencies
- **Clean UI**: Modern, responsive interface for desktop and mobile

## Usage

### Quick Start

**Option 1: Use the launch script (recommended)**
```bash
./start.sh
```
The script will automatically:
- Find an available port (default 8000)
- Start a local web server (Python 3, Python 2, or Node.js)
- Display the URL to open in your browser

**Option 2: Open directly**
```bash
xdg-open index.html  # Linux
open index.html      # macOS
start index.html     # Windows
```

Once opened:
1. Start logging QSOs using the form at the top
2. View your log entries below the form
3. Export to Cabrillo format when ready to submit

### Logging a QSO

Fill in the required fields:
- **Callsign**: The station you contacted (e.g., W1AW)
- **Frequency**: In MHz (e.g., 14.250)
- **Mode**: SSB, CW, RTTY, FT8, FT4, PSK, or FM
- **RST Sent**: Signal report you sent (e.g., 599)
- **RST Received**: Signal report you received (e.g., 599)
- **Exchange** (optional): Contest exchange information
- **Notes** (optional): Additional notes about the contact

Click **Add QSO** to log the entry. The timestamp is automatically added in UTC.

### Editing Entries

- Click **Edit** on any QSO entry
- Modify the fields (except timestamp, which is locked)
- Click **Update QSO** to save changes
- Click **Cancel Edit** to discard changes

### Deleting Entries

- Click **Delete** on any QSO entry
- Confirm the deletion in the prompt

### Exporting to Cabrillo

1. Click **Save Cabrillo (.cbr)** button
2. File downloads as `log_YYYYMMDD_HHMMSS.cbr`
3. **Important**: Edit the `CALLSIGN:` line in the exported file with your actual callsign

### Clearing All Entries

- Click **Clear All Entries** button
- Confirm the action (this is permanent!)

## Technical Details

### File Structure

```
aglog/
├── index.html      # Main application HTML
├── styles.css      # Styling and layout
├── app.js          # Core JavaScript logic
├── README.md       # This file
└── LICENSE         # MIT License
```

### Data Storage

- QSO entries are stored in browser localStorage under key `aglog_entries`
- Data persists across browser sessions
- Export your log regularly as backup (localStorage can be cleared by browser)

### Cabrillo Format

Generated files include:
- Standard Cabrillo 3.0 headers
- QSO records with proper formatting
- Default values for contest categories (edit as needed)

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled and localStorage support.

## Development

This is a static web application with no build process:

```bash
# Clone the repository
git clone https://github.com/gitarte/aglog.git
cd aglog

# Start local development server
./start.sh
```

The `start.sh` script automatically detects and uses:
- Python 3 (preferred)
- Python 2 (fallback)
- Node.js with http-server (fallback)

Or manually serve with any web server:

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Customization

To customize for your station:
1. Edit `DEFAULT_CALLSIGN` in `app.js` (line 5) with your callsign
2. Modify contest categories in `generateCabrillo()` function as needed
3. Add additional fields to the form if required

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions welcome! Please feel free to submit pull requests or open issues.

## Acknowledgments

Inspired by DQRLOG and the amateur radio logging community. Built for contesters who want a simple, portable logging solution.

---

**73 de SP9AG**
