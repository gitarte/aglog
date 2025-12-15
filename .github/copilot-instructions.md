# aglog Development Guide

## Project Overview
aglog is a browser-based Cabrillo logger for amateur radio operators, designed as an alternative to DQRLOG. The application is a 100% vanilla JavaScript single-page application that runs entirely in the browser with no backend, using localStorage for persistence.

## Architecture

### Tech Stack
- **Frontend**: Pure vanilla JavaScript (no frameworks)
- **Storage**: Browser localStorage API for persistence
- **Deployment**: Static files - can be served from any web server or opened directly as file://
- **Export format**: Cabrillo (.cbr) text files

### Key Design Decisions
- No build process or bundling - direct HTML/CSS/JS files
- No backend/server required - all data stored client-side
- Automatic UTC timestamps from system clock (non-editable)
- CRUD operations: add, edit, delete QSO entries
- Export to downloadable .cbr file format

## Core Concepts

### Cabrillo Format
- Cabrillo is the standard interchange format for amateur radio contest logs
- Files use specific tags (START-OF-LOG, CALLSIGN, CONTEST, QSO records, etc.)
- QSO records follow strict field ordering: frequency, mode, date, time, sent info, received info
- Reference: https://wwrof.org/cabrillo/

### Ham Radio Logging Fundamentals
- **QSO (contact)**: The basic unit - includes callsign, frequency, mode, date/time, signal reports
- **Contests**: Competitive events with specific rules for scoring and exchange formats
- **ADIF**: Another common log format for general logging (may be needed for import/export)
- **Rig control**: Integration with radio transceivers via CAT (Computer Aided Transceiver) protocols

## Development Guidelines

### localStorage Management
- Store QSO entries as JSON array in localStorage key `aglog_entries`
- Each entry has unique ID (timestamp or UUID) for edit/delete operations
- Implement defensive coding - check localStorage availability and quota
- Parse/stringify carefully - handle corrupted data gracefully

### Form Input & Validation
- Validate callsign format (ITU: alphanumeric with at least one letter and one digit)
- Support standard modes: SSB, CW, RTTY, FT8, FT4
- Frequency input: validate band ranges (e.g., 14.000-14.350 MHz for 20m)
- Signal reports: validate format (599, 59, etc.)
- Preserve user's capitalization in callsigns

### Time Handling (Critical!)
- **Always use UTC** - convert from system time using `new Date().toISOString()`
- Timestamps are auto-generated and immutable (cannot be edited)
- Display format: YYYY-MM-DD HH:MM:SS UTC
- For Cabrillo export: format as YYYY-MM-DD HHMM (no separators in time)

### UI/UX Patterns
- Form at top, chronological log list below (newest first or oldest first - be consistent)
- Each entry row shows: timestamp, callsign, frequency, mode, RST sent/received, delete/edit buttons
- Edit: populate form with entry data, change "Add" button to "Update"
- Delete: prompt for confirmation to prevent accidents
- Clear all: require confirmation (this is destructive!)

### Cabrillo Export
- Generate valid Cabrillo format on save button click
- Use `Blob` and `URL.createObjectURL()` for download trigger
- Filename format: `log_YYYYMMDD_HHMMSS.cbr`
- Include required headers: START-OF-LOG, CALLSIGN, CONTEST, etc.
- QSO line format: `QSO: freq mo date time call-sent rst-sent call-rcvd rst-rcvd`

## File Structure
```
/
├── index.html      # Main HTML with form and log display
├── styles.css      # Styling for logger interface
├── app.js          # Core logic: localStorage, CRUD, export
├── README.md       # Usage documentation
└── .github/
    └── copilot-instructions.md
```

## Testing Checklist
- Test localStorage persistence across page reloads
- Verify Cabrillo export format against spec
- Test edit/delete operations
- Validate form inputs (callsigns, frequencies)
- Test "clear all" confirmation
- Check behavior when localStorage is full or disabled

## License
MIT License - see LICENSE file for full text.

---
*Note: This is an early-stage project. Update these instructions as the architecture and conventions solidify.*
