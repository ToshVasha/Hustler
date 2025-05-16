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

## Backend Integration

### API Configuration

1. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

2. **API Client Setup**
   The project uses Axios for API calls. Configure the API client in `src/lib/api.ts`:
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
     headers: {
       'Content-Type': 'application/json',
     },
   });

   // Add request interceptor for authentication
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;
   ```

### Authentication Integration

1. **Login/Register Flow**
   - Implement JWT token storage
   - Add token refresh mechanism
   - Handle authentication state in UserContext

2. **Protected Routes**
   - Use authentication middleware
   - Implement route guards
   - Handle unauthorized access

### Service Management

1. **API Endpoints**
   ```typescript
   // Service endpoints
   GET    /api/services          // List services
   POST   /api/services          // Create service
   GET    /api/services/:id      // Get service details
   PUT    /api/services/:id      // Update service
   DELETE /api/services/:id      // Delete service
   ```

2. **Service Context Integration**
   - Replace mock data with API calls
   - Implement real-time updates
   - Add error handling

### User Management

1. **Provider Endpoints**
   ```typescript
   // Provider endpoints
   GET    /api/providers         // List providers
   POST   /api/providers         // Register provider
   GET    /api/providers/:id     // Get provider details
   PUT    /api/providers/:id     // Update provider
   ```

2. **Consumer Endpoints**
   ```typescript
   // Consumer endpoints
   GET    /api/consumers         // List consumers
   POST   /api/consumers         // Register consumer
   GET    /api/consumers/:id     // Get consumer details
   PUT    /api/consumers/:id     // Update consumer
   ```

### Booking System

1. **Booking Endpoints**
   ```typescript
   // Booking endpoints
   POST   /api/bookings          // Create booking
   GET    /api/bookings          // List bookings
   GET    /api/bookings/:id      // Get booking details
   PUT    /api/bookings/:id      // Update booking status
   ```

2. **Payment Integration**
   - Implement Stripe payment flow
   - Handle payment webhooks
   - Manage payment status

### Messaging System

1. **Chat Endpoints**
   ```typescript
   // Chat endpoints
   GET    /api/chats            // List chats
   POST   /api/chats            // Create chat
   GET    /api/chats/:id        // Get chat messages
   POST   /api/chats/:id/messages // Send message
   ```

2. **Real-time Updates**
   - Implement WebSocket connection
   - Handle message notifications
   - Manage chat state

### Search and Filtering

1. **Search Endpoints**
   ```typescript
   // Search endpoints
   GET    /api/search           // Search services
   GET    /api/search/providers // Search providers
   GET    /api/search/location  // Search by location
   ```

2. **Filter Implementation**
   - Add filter parameters
   - Handle pagination
   - Implement sorting

### File Upload

1. **Upload Endpoints**
   ```typescript
   // Upload endpoints
   POST   /api/upload/image     // Upload image
   POST   /api/upload/document  // Upload document
   ```

2. **File Management**
   - Handle file size limits
   - Implement file type validation
   - Manage storage cleanup

### Error Handling

1. **Global Error Handler**
   ```typescript
   // Add to api.ts
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       // Handle different error types
       if (error.response?.status === 401) {
         // Handle unauthorized
       } else if (error.response?.status === 404) {
         // Handle not found
       }
       return Promise.reject(error);
     }
   );
   ```

2. **Error Types**
   - Network errors
   - Authentication errors
   - Validation errors
   - Server errors

### Security Measures

1. **API Security**
   - Implement CORS
   - Add rate limiting
   - Use HTTPS
   - Validate requests

2. **Data Protection**
   - Encrypt sensitive data
   - Sanitize user input
   - Implement CSRF protection

### Testing

1. **API Testing**
   ```bash
   # Run API tests
   npm run test:api
   ```

2. **Integration Testing**
   ```bash
   # Run integration tests
   npm run test:integration
   ```

### Monitoring

1. **Error Tracking**
   - Implement error logging
   - Set up monitoring
   - Configure alerts

2. **Performance Monitoring**
   - Track API response times
   - Monitor resource usage
   - Set up analytics

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
