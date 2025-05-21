from flask import Blueprint, render_template, request, redirect, url_for 
from models.Service import Service, addService, getAllServices
import uuid # unique ids

mainBlueprint = Blueprint('main', __name__)

@mainBlueprint.route('/')
def index():
    return render_template('index.html', services=getAllServices())

@mainBlueprint.route('/add', methods=['POST'])
def add_service():
    try:
        serviceType = request.form['serviceType']
        description = request.form['description']
        minPrice = float(request.form['minPrice'])
        maxPrice = float(request.form['maxPrice'])

        service = Service(serviceId=str(uuid.uuid4()), serviceType=serviceType, description=description, price=(minPrice, maxPrice))
        addService(service)
        return redirect(url_for('main.index'))
    except Exception as x:
        return f"Error: {x}", 400