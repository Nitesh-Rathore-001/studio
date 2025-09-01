# **App Name**: TicTac Infinity

## Core Features:

- Game Mode Selection: Allow users to choose between Customizable Tic Tac Toe and Ultimate Tic Tac Toe game modes.
- Customizable Grid Setup: Enable users to adjust grid size and win condition via sliders (Normal Mode).
- Real-time Gameplay Synchronization: Keep all gameplay displays syncronized via the provided Realtime Listeners, Firebase Auth (anonymous mode) for assigning players.
- Turn Management: Control whose turn it is and relay that status on each client
- Win Condition Validation: Check the grid at the end of each turn and update player score if the game has been won.
- Move Tracking: Maintain the status of the last turn, so it may be undone or redone

## Style Guidelines:

- Primary color: Vibrant purple (#9F5BBA) to bring high energy and draw the users eye to main controls and key info.
- Background color: Light neutral gray (#F0F2F5) to let the vibrant primary stand out.
- Accent color: Electric blue (#7DF9FF) to complement the purple.
- Body and headline font: 'Inter', a sans-serif font, will convey a modern and objective aesthetic. Note: currently only Google Fonts are supported.
- Use clean, minimalist icons for game controls and status indicators.
- Implement a responsive, mobile-first layout optimized for various screen sizes.
- Apply subtle animations like scaling and fading effects for X/O placements to enhance the user experience.