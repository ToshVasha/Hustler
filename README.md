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

The application comes with generated test data including:
- 100 users (mix of consumers and business users)
- 100 services across various categories
- 100 bookings with different statuses

To generate new test data:
```bash
cd Backend
python src/generate_test_data.py
```

## Testing the Integration

1. Start both the backend and frontend servers as described above
2. Open http://localhost:8081 in your browser
3. Log in with any email from the test data (password is not checked in demo)
4. Test the following features:
   - Browse services
   - Filter services by category
   - Create bookings
   - View bookings
   - Update booking statuses

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
