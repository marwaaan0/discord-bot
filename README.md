# Probot Clone

A clone of the Probot Discord bot website with both frontend and backend functionality.

## Features

- Modern, responsive design
- Advanced animations and interactions
- Discord bot integration
- User authentication
- Premium features system
- Moderation commands
- Economy system
- Leveling system

## Technologies Used

### Frontend
- HTML5
- CSS3 with modern features
- JavaScript (ES6+)
- GSAP for animations
- Three.js for 3D particles
- AOS for scroll animations

### Backend
- Node.js
- Express.js
- Discord.js
- MongoDB
- JWT for authentication

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   PORT=3000
   MONGODB_URI=your_mongodb_uri_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. For development with hot reload:
   ```bash
   npm run dev
   ```

## Discord Bot Commands

- `!help` - Show available commands
- `!ping` - Check bot latency
- `!stats` - Show bot statistics
- `!ban @user` - Ban a user (requires permissions)
- `!kick @user` - Kick a user (requires permissions)

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes only. All rights belong to their respective owners.
