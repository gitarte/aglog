#!/bin/bash
# aglog - Local Development Server Launcher

PORT=8000
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "================================================"
echo "  aglog - Cabrillo Logger"
echo "================================================"
echo ""

cd "$APP_DIR"

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use."
    echo "   Trying to find an available port..."
    PORT=$((PORT + 1))
    while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
        PORT=$((PORT + 1))
    done
    echo "✓  Using port $PORT instead"
    echo ""
fi

# Try Python 3 first, then Python 2, then Node.js
if command -v python3 &> /dev/null; then
    echo "🚀 Starting server with Python 3..."
    echo "📡 Open your browser to: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "🚀 Starting server with Python 2..."
    echo "📡 Open your browser to: http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer $PORT
elif command -v node &> /dev/null; then
    if command -v npx &> /dev/null; then
        echo "🚀 Starting server with Node.js..."
        echo "📡 Open your browser to: http://localhost:$PORT"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        npx --yes http-server -p $PORT
    else
        echo "❌ npx not found. Please install Node.js with npm."
        exit 1
    fi
else
    echo "❌ No suitable web server found."
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3 (recommended): sudo apt install python3"
    echo "  - Python 2: sudo apt install python"
    echo "  - Node.js: sudo apt install nodejs npm"
    echo ""
    echo "Alternatively, open index.html directly in your browser:"
    echo "  xdg-open $APP_DIR/index.html"
    exit 1
fi
