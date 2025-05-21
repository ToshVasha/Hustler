import re
import bcrypt
from datetime import datetime
from Review import Review
from Notification import Notification


class Account:
    """
    Represents a user account in the system.

    Attributes:
        accountId (str): unique identifier for the account.
        firstName (str): first name of the user.
        lastName (str): last name of the user.
        dob (datetime): date of birth.
        address (str): residential address.
        phoneNumber (str): contact phone number.
        email (str): email address of the user.
        username (str): account username.
        password (str): hashed password.
        communityRating (float): user community rating.
        notifications (list): list of Notification objects.
        reviews (list): list of Review objects.
    """

    def __init__(self, accountId: str, firstName: str, lastName: str, dob: datetime,
                 address: str, phoneNumber: str, email: str, username: str, password: str):
        self.__accountId = accountId
        self.__firstName = firstName
        self.__lastName = lastName
        self.__dob = dob
        self.__address = address
        self.__phoneNumber = phoneNumber
        self.__email = email
        self.__username = username
        self.__password = password
        self.__communityRating = 0.0
        self.__notifications = []
        self.__reviews = []

    # property read only
    @property
    def accountId(self) -> str:
        return self.__accountId

    @property
    def firstName(self) -> str:
        return self.__firstName

    @firstName.setter
    def firstName(self, name: str) -> None:
        self.__validateName(name)
        self.__firstName = name

    @property
    def lastName(self) -> str:
        return self.__lastName

    @lastName.setter
    def lastName(self, name: str) -> None:
        self.__validateName(name)
        self.__lastName = name

    @property
    def dob(self) -> datetime:
        return self.__dob

    @dob.setter
    def dob(self, dob: datetime) -> None:
        if not isinstance(dob, datetime):
            raise TypeError("Date of birth must be a datetime object.")
        self.__dob = dob

    @property
    def address(self) -> str:
        return self.__address

    @address.setter
    def address(self, address: str) -> None:
        if not isinstance(address, str) or not address.strip():
            raise ValueError("Address must be a non-empty string.")
        self.__address = address

    @property
    def phoneNumber(self) -> str:
        return self.__phoneNumber

    @phoneNumber.setter
    def phoneNumber(self, phone: str) -> None:
        if not re.match(r"^\+?[0-9\s\-]{7,15}$", phone):
            raise ValueError("Invalid phone number format.")
        self.__phoneNumber = phone

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, email: str) -> None:
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
            raise ValueError("Invalid email format.")
        self.__email = email

    @property
    def username(self) -> str:
        return self.__username

    @username.setter
    def username(self, username: str) -> None:
        if not re.match(r"^[A-Za-z0-9_.-]{3,20}$", username):
            raise ValueError("Username must be 3–20 characters and valid.")
        self.__username = username

    @property
    def password(self) -> str:
        return self.__password

    @password.setter
    def password(self, password: str) -> None:
        self.__validatePassword(password)
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        self.__password = hashed.decode("utf-8")

    # property read only
    @property
    def communityRating(self) -> float:
        return self.__communityRating

    @property
    def notifications(self) -> list:
        return self.__notifications

    @property
    def reviews(self) -> list:
        return self.__reviews

    def updateUserDetails(self):
        """
        Updates multiple user attributes
        """
        pass


    def createReport(self) -> str:
        """
        Returns a summary report of the user's data.
        """
        return (
            f"User Report for {self.__username}:\n"
            f"Name: {self.__firstName} {self.__lastName}\n"
            f"Email: {self.__email}\n"
            f"Phone: {self.__phoneNumber}\n"
            f"Address: {self.__address}\n"
            f"Community Rating: {self.__communityRating}\n"
            f"Notifications: {len(self.__notifications)}\n"
            f"Reviews: {len(self.__reviews)}"
        )

    def addReview(self, review: 'Review') -> None:
        """
        Adds a review to the account.

        Args:
            review (Review): a Review object.
        """
        if not isinstance(review, Review):
            raise TypeError("Review must be an instance of Review.")
        self.__reviews.append(review)

    def editReview(self, index: int, newReview: 'Review') -> None:
        """
        Edits an existing review by index.

        Args:
            index (int): index of the review to edit.
            newReview (Review): the new review to replace the old one.
        """
        if not isinstance(newReview, Review):
            raise TypeError("Review must be an instance of Review.")
        if index < 0 or index >= len(self.__reviews):
            raise IndexError("Invalid review index.")
        self.__reviews[index] = newReview

    def deleteReview(self, review: 'Review') -> None:
        """
        Removes a review from the account.

        Args:
            review (Review): a Review object to remove.
        """
        pass

    def deleteNotification(self, notification: 'Notification') -> None:
        """
        Removes a notification from the account.

        Args:
            notification (Notification): a Notification object to remove.
        """
        pass

    # validation methods
    @staticmethod
    def __validateName(name: str) -> None:
        if not isinstance(name, str):
            raise TypeError("Name must be a string.")
        if not name.strip():
            raise ValueError("Name cannot be empty.")
        if not re.match(r"^[A-Za-z' -]+$", name):
            raise ValueError("Name contains invalid characters.")

    @staticmethod
    def __validatePassword(password: str) -> None:
        if not isinstance(password, str):
            raise TypeError("Password must be a string.")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters.")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain an uppercase letter.")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain a lowercase letter.")
        if not re.search(r"[0-9]", password):
            raise ValueError("Password must contain a number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain a special character.")

class Provider(Account):
    """
    Represents a service provider who can offer and manage services.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.availableServices: list = self.loadServicesFromDatabase()

    def createService(self, serviceData: dict) -> None:
        # TODO: Create and save a Service object to DB
        print("Service created and stored.")

    def editService(self, serviceId: str, updatedData: dict) -> None:
        # TODO: Update service in DB and in self.availableServices
        print(f"Service {serviceId} updated.")

    def deleteService(self, serviceId: str) -> None:
        # TODO: Remove from DB and self.availableServices
        print(f"Service {serviceId} deleted.")

    def acceptServiceRequest(self, request) -> None:
        # TODO: Approve and update DB
        request.updateApproved(True)
        print("Service request approved.")

    def denyServiceRequest(self, request) -> None:
        # TODO: Remove request from DB
        print("Service request denied and deleted.")

    def completeServiceRequest(self, request) -> None:
        # TODO: Finalize request in DB and notify Consumer
        print("Service request completed and notification sent.")

    def loadServicesFromDatabase(self) -> list:
        # TODO: Fetch services from DB
        return []

class Consumer(Account):
    """
    Represents a consumer who can apply and subscribe to services.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.serviceList: list = self.loadServiceRequestsFromDatabase()
        self.subList: list = self.loadSubscriptionsFromDatabase()

    def applyForService(self, service) -> None:
        # TODO: Create and store ServiceRequest in DB
        print("Service application submitted. Status: PENDING")

    def deleteServiceRequest(self, requestId: str) -> None:
        # TODO: Delete ServiceRequest from DB and serviceList
        print(f"ServiceRequest {requestId} deleted.")

    def applyForSubscriptionOfService(self, service) -> None:
        # TODO: Create Subscription, call applyForService
        print("Subscription created and service applied.")

    def cancelSubscription(self, subscriptionId: str) -> None:
        # TODO: Cancel and delete subscription and related ServiceRequest
        print(f"Subscription {subscriptionId} cancelled.")

    def loadServiceRequestsFromDatabase(self) -> list:
        # TODO: Fetch service requests
        return []

    def loadSubscriptionsFromDatabase(self) -> list:
        # TODO: Fetch subscriptions
        return []
