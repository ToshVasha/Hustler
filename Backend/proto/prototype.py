from datetime import date
from typing import Tuple, List

'''
This initial prototype provides the basic context of the classes and how they will interact with each other.
It outlines the foundational architecture for the platform: representations for users (consumers and providers), 
services, requests, transactions, reviews, and notifications. 
Each class in the prototype models a key entity and demonstrates SOME relationships and operations relevant to the application.
'''

class Service:
    """
    Represents a service that can be offered by a provider

    Args:
        serviceId (str): unique identifier for the service
        serviceType (str): type of service (e.g., plumbing, cleaning)
        desc (str): description of the service
        price (Tuple[float, float]): price range (min, max)
    """
    def __init__(self, serviceId: str, serviceType: str = "", desc: str = "", price: Tuple[float, float] = (0.0, 0.0)):
        self.serviceId: str = None
        self.serviceType: str = serviceType
        self.datePosted: date = date.today()
        self.desc: str = desc
        self.completion: bool = False
        self.price: Tuple[float, float] = None

    def setServiceType(self, serviceType: str):
        self.serviceType = serviceType

    def setDescription(self, description: str):
        self.description = description

    def setPrice(self, minPrice: float, maxPrice: float):
        """
        Sets the price range for the service

        Args:
            minPrice (float): minimum price
            maxPrice (float): maximum price
        """
        self.price = (minPrice, maxPrice)

    def getServiceId(self):
        return self.serviceId

    def getServiceType(self):
        return self.serviceType

    def getDatePosted(self):
        return self.datePosted

    def getDesc(self):
        return self.desc

    def getCompletion(self):
        return self.completion

    def updateCompletion(self, completed: bool):
        """
        Updates the completion status of the service

        Args:
            completed (bool): whether the service has been completed
        """
        self.completion = completed

    def confirmPayment(self):
        """
        Confirms that payment has been made
        """
        print("Payment confirmed.")

class User:
    """
    Base class representing a user of the platform

    Args:
        userId (str): unique ID of the user
        name (str): user's full name
        email (str): email address
    """
    def __init__(self, userId: str, name: str, email: str):
        self.userId = userId
        self.name = name
        self.email = email
        self.notifications: List[Notification] = []

    def sendNotification(self, message: str):
        """
        Sends a notification to the user

        Args:
            message (str): the notification message
        """
        notif = Notification(self.userId, message)
        self.notifications.append(notif)
        print(f"Notification sent to {self.name}: {message}")

class Consumer(User):
    """
    Represents a consumer who can request services
    """
    def __init__(self, userId: str, name: str, email: str):
        super().__init__(userId, name, email)
        self.requests: List[ServiceRequest] = []

class Provider(User):
    """
    Represents a provider who can offer services

    Args:
        servicesOffered (List[Service]): list of services provided
        reviews (List[Review]): reviews received from consumers
    """
    def __init__(self, userId: str, name: str, email: str):
        super().__init__(userId, name, email)
        self.servicesOffered: List[Service] = []
        self.reviews: List[Review] = []

class Transaction:
    """
    Represents a transaction for a completed service

    Args:
        transactionId (str): unique transaction ID
        service (Service): service involved
        consumer (Consumer): consumer making the payment
        provider (Provider): provider receiving the payment
        amount (float): amount paid
    """
    def __init__(self, transactionId: str, service: Service, consumer: Consumer, provider: Provider, amount: float):
        self.transactionId = transactionId
        self.service = service
        self.consumer = consumer
        self.provider = provider
        self.amount = amount
        self.date = date.today()
        self.status = "Pending"

    def completeTransaction(self):
        """
        Marks the transaction as completed and updates the service status
        """
        self.status = "Completed"
        self.service.updateCompletion(True)
        print(f"Transaction {self.transactionId} completed.")

class ServiceRequest:
    """
    Represents a request made by a consumer for a specific service

    Args:
        requestId (str): unique request ID
        consumer (Consumer): requesting user
        service (Service): service being requested
        description (str): additional message or context
    """
    def __init__(self, requestId: str, consumer: Consumer, service: Service, description: str):
        self.requestId = requestId
        self.consumer = consumer
        self.service = service
        self.description = description
        self.status = "Open"

    def updateStatus(self, status: str):
        """
        Updates the status of the service request

        Args:
            status (str): new status (e.g., Accepted, Rejected)
        """
        self.status = status
        print(f"Service Request {self.requestId} updated to {status}")

class Review:
    """
    Represents a consumer review of a provider

    Args:
        reviewer (User): the user who wrote the review
        provider (Provider): the provider being reviewed
        rating (int): rating score out of 5
        comment (str): feedback content
    """
    def __init__(self, reviewer: User, provider: Provider, rating: int, comment: str):
        self.reviewer = reviewer
        self.provider = provider
        self.rating = rating
        self.comment = comment
        self.date = date.today()

class Notification:
    """
    Represents a notification message sent to a user

    Args:
        userId (str): ID of the user receiving the notification
        message (str): notification content
    """
    def __init__(self, userId: str, message: str):
        self.userId = userId
        self.message = message
        self.date = date.today()

class Report:
    """
    Utility class for generating reports
    """
    @staticmethod
    def generateProviderReport(provider: Provider):
        """
        Prints a report summarizing a provider's services and reviews

        Args:
            provider (Provider): the provider
        """
        print(f"Report for Provider: {provider.name}")
        print(f"Services Offered: {len(provider.servicesOffered)}")
        print(f"Reviews Received: {len(provider.reviews)}")
        avgRating = (
            sum([r.rating for r in provider.reviews]) / len(provider.reviews)
            if provider.reviews else 0
        )
        print(f"Average Rating: {avgRating:.1f}")

#-----------------------------------------------------------------------------------
#       EXAMPLES
#-----------------------------------------------------------------------------------
if __name__ == "__main__":
    consumer = Consumer("C001", "Alice", "alice@example.com")
    provider = Provider("P001", "Bob", "bob@example.com")

    service = Service("S001", "Plumbing", "general plumbing issues", (50.0, 100.0))
    provider.servicesOffered.append(service)

    request = ServiceRequest("R001", consumer, service, "Urgent repair needed")
    consumer.requests.append(request)

    request.updateStatus("Accepted")
    transaction = Transaction("T001", service, consumer, provider, 75.0)
    transaction.completeTransaction()

    review = Review(consumer, provider, 5, "Excellent service!")
    provider.reviews.append(review)

    provider.sendNotification("You have a new review.")

    print('')
    Report.generateProviderReport(provider)
