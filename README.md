# Hustlr Card Verse

A modern service marketplace platform built with React, TypeScript, and Tailwind CSS.

## Project Setup

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Development Setup
```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd hustlr-card-verse

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Backend Integration

The frontend is designed to work with a RESTful API backend. Configure the API endpoints in the following files:

1. `src/config/api.ts` - API base URL and endpoints
2. `src/contexts/AuthContext.tsx` - Authentication endpoints
3. `src/contexts/ServiceContext.tsx` - Service-related endpoints

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=your_backend_api_url
VITE_AUTH_TOKEN_KEY=your_auth_token_key
```

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

1. Build the project:
```sh
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting provider.

## Custom Domain Setup

1. Configure your domain's DNS settings to point to your hosting provider
2. Set up SSL certificates for secure HTTPS connections
3. Configure your hosting provider to serve the SPA correctly
