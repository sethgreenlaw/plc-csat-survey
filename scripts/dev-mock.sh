#!/bin/bash
# Run frontend and backend with mock data (no database required)

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting development servers with mock data...${NC}"
echo -e "${GREEN}Backend:${NC}  http://localhost:3000"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo ""

# Export mock data mode
export USE_MOCK_DATA=true

# Store PIDs for cleanup
BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
    echo ""
    echo -e "${BLUE}Shutting down servers...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# Set up trap for clean shutdown
trap cleanup SIGINT SIGTERM

# Start backend in background
cd packages/backend
bun --env-file=../../.env run dev &
BACKEND_PID=$!
cd ../..

# Give backend a moment to start
sleep 1

# Start frontend in foreground
cd packages/frontend
bun run dev &
FRONTEND_PID=$!
cd ../..

# Wait for both processes
wait
