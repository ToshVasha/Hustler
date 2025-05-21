import random
import string
import json
from datetime import datetime, timedelta
import uuid

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def generate_random_email():
    domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    username = generate_random_string(8)
    domain = random.choice(domains)
    return f"{username}@{domain}"

def generate_random_phone():
    return f"+1{random.randint(1000000000, 9999999999)}"

def generate_random_location():
    cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
    return random.choice(cities)

def generate_users(count=100):
    users = []
    for _ in range(count):
        user_type = random.choice(['consumer', 'business'])
        user = {
            'id': str(uuid.uuid4()),
            'email': generate_random_email(),
            'name': f"User {generate_random_string(5)}",
            'type': user_type,
            'phone': generate_random_phone(),
            'location': generate_random_location()
        }
        users.append(user)
    return users

def generate_services(count=100, providers=None):
    if not providers:
        providers = [user['id'] for user in generate_users(50) if user['type'] == 'business']
    
    categories = ['Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Gardening', 'Moving', 'Cooking', 'Tutoring', 'Fitness']
    services = []
    
    for _ in range(count):
        service = {
            'id': str(uuid.uuid4()),
            'name': f"{random.choice(categories)} Service {generate_random_string(4)}",
            'description': f"Professional {random.choice(categories).lower()} service with {random.randint(1, 20)} years of experience.",
            'price': round(random.uniform(20.0, 500.0), 2),
            'provider_id': random.choice(providers),
            'category': random.choice(categories),
            'image_url': f"https://picsum.photos/400/300?random={random.randint(1, 1000)}",
            'rating': round(random.uniform(1.0, 5.0), 1)
        }
        services.append(service)
    return services

def generate_bookings(count=100, services=None, consumers=None):
    if not services:
        services = generate_services(50)
    if not consumers:
        consumers = [user['id'] for user in generate_users(50) if user['type'] == 'consumer']
    
    statuses = ['pending', 'confirmed', 'completed', 'cancelled']
    bookings = []
    
    for _ in range(count):
        service = random.choice(services)
        date = (datetime.now() + timedelta(days=random.randint(-30, 30))).strftime('%Y-%m-%d')
        time = f"{random.randint(9, 17)}:00"
        
        booking = {
            'id': str(uuid.uuid4()),
            'service_id': service['id'],
            'consumer_id': random.choice(consumers),
            'provider_id': service['provider_id'],
            'date': date,
            'time': time,
            'status': random.choice(statuses),
            'price': service['price']
        }
        bookings.append(booking)
    return bookings

def save_test_data():
    users = generate_users(100)
    services = generate_services(100, [user['id'] for user in users if user['type'] == 'business'])
    bookings = generate_bookings(100, services, [user['id'] for user in users if user['type'] == 'consumer'])
    
    data = {
        'users': users,
        'services': services,
        'bookings': bookings
    }
    
    with open('test_data.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    save_test_data()
    print("Test data generated successfully!") 