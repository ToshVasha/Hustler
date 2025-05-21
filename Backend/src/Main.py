from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import json
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load test data
try:
    with open('test_data.json', 'r') as f:
        test_data = json.load(f)
        users = test_data['users']
        services = test_data['services']
        bookings = test_data['bookings']
except FileNotFoundError:
    print("Warning: test_data.json not found. Using empty data.")
    users = []
    services = []
    bookings = []

# Models
class User(BaseModel):
    id: str
    email: str
    name: str
    type: str  # "consumer" or "business"
    phone: Optional[str] = None
    location: Optional[str] = None

class Service(BaseModel):
    id: str
    name: str
    description: str
    price: float
    provider_id: str
    category: str
    image_url: Optional[str] = None
    rating: Optional[float] = None

class Booking(BaseModel):
    id: str
    service_id: str
    consumer_id: str
    provider_id: str
    date: str
    time: str
    status: str
    price: float

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the Service Booking API"}

@app.post("/api/auth/login")
async def login(email: str, password: str):
    # Find user by email
    user = next((u for u in users if u['email'] == email), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In a real app, we would verify the password here
    return {
        "token": "dummy_token",
        "user": {
            "id": user['id'],
            "email": user['email'],
            "name": user['name'],
            "type": user['type']
        }
    }

@app.get("/api/services")
async def get_services(category: Optional[str] = None, provider_id: Optional[str] = None):
    filtered_services = services
    
    if category:
        filtered_services = [s for s in filtered_services if s['category'].lower() == category.lower()]
    
    if provider_id:
        filtered_services = [s for s in filtered_services if s['provider_id'] == provider_id]
    
    return filtered_services

@app.get("/api/services/{service_id}")
async def get_service(service_id: str):
    service = next((s for s in services if s['id'] == service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@app.post("/api/services")
async def create_service(service: Service):
    services.append(service.dict())
    return service

@app.get("/api/bookings")
async def get_bookings(user_id: str, user_type: str):
    if user_type == 'consumer':
        user_bookings = [b for b in bookings if b['consumer_id'] == user_id]
    else:  # business user
        user_bookings = [b for b in bookings if b['provider_id'] == user_id]
    return user_bookings

@app.post("/api/bookings")
async def create_booking(booking: Booking):
    # Verify service exists
    service = next((s for s in services if s['id'] == booking.service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Verify consumer exists
    consumer = next((u for u in users if u['id'] == booking.consumer_id), None)
    if not consumer:
        raise HTTPException(status_code=404, detail="Consumer not found")
    
    # Verify provider exists
    provider = next((u for u in users if u['id'] == booking.provider_id), None)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    bookings.append(booking.dict())
    return booking

@app.put("/api/bookings/{booking_id}")
async def update_booking(booking_id: str, status: str):
    booking = next((b for b in bookings if b['id'] == booking_id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking['status'] = status
    return booking

if __name__ == "__main__":
    uvicorn.run("Main:app", host="0.0.0.0", port=8000, reload=True)
