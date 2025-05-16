# Hustlr Card Verse

A modern service marketplace platform connecting service providers with consumers in Australia.

## Features

- **Service Management**
  - Browse and search services
  - Detailed service listings
  - Provider profiles and portfolios
  - Real-time availability

- **Booking System**
  - Easy scheduling
  - Multiple payment methods
  - Booking history
  - Service tracking

- **User Management**
  - Provider and Consumer profiles
  - Rating and review system
  - Messaging system
  - Notification center

- **Business Tools**
  - Provider dashboard
  - Service analytics
  - Payment management
  - Portfolio management

## Tech Stack

- **Frontend**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI

- **State Management**
  - React Context API
  - Custom hooks

- **Development Tools**
  - ESLint
  - Prettier
  - TypeScript
  - Git

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ToshVasha/Hustler.git
   cd Hustler
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=your_api_url
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── config/        # Configuration files
└── lib/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Workflow

1. Create a new branch for each feature/fix
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation
5. Create a pull request
6. Get code review
7. Merge after approval

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Lint**: Checks code style and formatting
- **Type Check**: Verifies TypeScript types
- **Test**: Runs unit and integration tests
- **Build**: Creates production build
- **Deploy**: Deploys to staging/production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

ToshVasha - [@ToshVasha](https://github.com/ToshVasha)

Project Link: [https://github.com/ToshVasha/Hustler](https://github.com/ToshVasha/Hustler)
