# Service Booking Platform

A full-stack service booking platform that connects service providers with consumers.

## Features

- User authentication (consumers and business users)
- Service listing and management
- Booking system
- Real-time messaging
- Reviews and ratings
- Service categories
- Provider profiles
- Consumer profiles

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data fetching
- Axios for API calls

### Backend
- FastAPI (Python)
- Pydantic for data validation
- Uvicorn for ASGI server

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd service-booking-platform
```

2. Install backend dependencies:
```bash
cd Backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ..
npm install
```

4. Generate test data:
```bash
cd Backend
python src/generate_test_data.py
```

### Running the Application

1. Start the backend server:
```bash
cd Backend
python src/Main.py
```
The backend server will run on http://localhost:8000

2. Start the frontend development server:
```bash
cd ..
npm run dev
```
The frontend will run on http://localhost:8081 (or another port if 8081 is in use)

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Services
- GET `/api/services` - List all services
- GET `/api/services/{service_id}` - Get service details
- POST `/api/services` - Create new service

### Bookings
- GET `/api/bookings` - List user's bookings
- POST `/api/bookings` - Create new booking
- PUT `/api/bookings/{booking_id}` - Update booking status

## Test Data

The application comes with two pre-configured accounts for testing:

1. Service Provider Account:
   - Email: provider@hustler.com
   - Password: provider123
   - Features:
     - Pre-configured service listings
     - Existing bookings
     - Customer reviews
     - Business profile

2. Consumer Account:
   - Email: consumer@hustler.com
   - Password: consumer123
   - Features:
     - Booking history
     - Saved services
     - Provider reviews
     - Personal profile

Additional users can be created through the signup process. Each new user will start with a fresh account.

To generate new test data:
```bash
cd Backend
python src/generate_test_data.py
```

## Testing the Integration

1. Start both the backend and frontend servers as described above
2. Open http://localhost:8081 in your browser
3. Log in with one of the pre-configured accounts:
   - Service Provider: provider@hustler.com / provider123
   - Consumer: consumer@hustler.com / consumer123
4. Test the following features:

For Service Providers:
- View and manage service listings
- Check booking requests
- View customer reviews
- Update business profile
- Manage service availability

For Consumers:
- Browse available services
- Book services
- View booking history
- Leave reviews
- Update personal profile

## Development

### Backend Development
- The backend uses FastAPI for high performance and easy API development
- Models are defined using Pydantic for automatic validation
- CORS is configured to allow frontend development server
- Test data is stored in JSON format for easy modification

### Frontend Development
- React components are organized by feature
- TypeScript interfaces match backend models
- API client handles all backend communication
- React Query manages server state
- Protected routes handle authentication

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

ToshVasha - [@ToshVasha](https://github.com/ToshVasha)

Project Link: [https://github.com/ToshVasha/Hustler](https://github.com/ToshVasha/Hustler)

## Integration Testing

To verify that the backend and frontend are properly integrated:

1. Start the Backend Server:
```bash
cd Backend
python src/Main.py
```
The backend should start on http://localhost:8000

2. Start the Frontend Server:
```bash
npm run dev
```
The frontend should start on http://localhost:8081 (or another port if 8081 is in use)

3. Test API Endpoints:
```bash
# Test root endpoint
curl http://localhost:8000/

# Test services endpoint
curl http://localhost:8000/api/services
```

4. Verify Frontend-Backend Integration:
- Open http://localhost:8081 in your browser
- Log in with one of the pre-configured accounts:
  - Service Provider: provider@hustler.com / provider123
  - Consumer: consumer@hustler.com / consumer123
- Verify that:
  - Service providers see their existing services and bookings
  - Consumers see their booking history and saved services
  - All data is properly loaded from the backend
  - Real-time updates work for new bookings and messages

5. Common Issues:
- If you see "Address already in use" error for the backend, kill the existing process:
  ```bash
  lsof -i :8000
  kill -9 <PID>
  ```
- If the frontend can't connect to the backend, check:
  - Backend is running on port 8000
  - CORS is properly configured
  - API client is using the correct base URL

6. Monitoring:
- Backend logs will show in the terminal where you started the server
- Frontend logs can be viewed in the browser's developer tools
- Network requests can be monitored in the browser's Network tab
