# Chess Frontend

A modern, real-time multiplayer chess application built with Next.js 15, featuring interactive gameplay, live timers, and seamless user experience.

## ✨ Features

- **Real-time Multiplayer Chess**: Play chess with friends or other players online
- **Interactive Chess Board**: Smooth drag-and-drop piece movement with visual feedback
- **Live Game Timer**: Configurable time controls for competitive play
- **Move History**: Track all moves made during the game
- **Game Room System**: Join specific game rooms using room IDs
- **Sound Effects**: Audio feedback for moves and game events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful interface with shadcn/ui components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chess-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) with Radix UI
- **Chess Logic**: [chess.js](https://github.com/jhlywa/chess.js)
- **Chess Board**: [react-chessboard](https://github.com/Clariity/react-chessboard)
- **Real-time Communication**: Socket.IO

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── game/[roomId]/     # Dynamic game room pages
│   └── play/              # Game lobby/setup
├── components/            # Reusable React components
│   ├── chess/            # Chess-specific components
│   ├── navbar/           # Navigation components
│   ├── pages/            # Page-level components
│   └── ui/               # shadcn/ui components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Helper utilities
```

## 🎮 How to Play

1. **Start a Game**: Navigate to the play page to create or join a game
2. **Join a Room**: Use a room ID to join a specific game
3. **Make Moves**: Click and drag pieces or click to select and move
4. **Track Progress**: Monitor your time and review move history
5. **Game Controls**: Use resign, offer draw, or other game controls as needed
