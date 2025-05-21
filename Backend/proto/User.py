import re
import bcrypt
from datetime import date
from Notifications import Notification

# Parent class for Admin, Consumer & Provider
class User:
    __id: int = None
    __firstName: str = None
    __lastName: str = None
    __dob: date = None
    __address: str = None
    __phoneNumber: str = None
    __email: str = None
    __username: str = None
    __password: str = None
    __notifications: list[Notification] = None
    
    def __init__(self, 
                 firstName: str, 
                 lastName: str, 
                 dob: date, 
                 address: str, 
                 phoneNumber: str, 
                 email: str, 
                 username: str, 
                 password: str):
        self.__id = None #TODO Logic for setting id required 
        self.setFirstName(firstName)
        self.setLastName(lastName)
        self.__dob = dob
        self.__address = address
        self.__phoneNumber = phoneNumber
        self.__email = email
        self.setUsername(username)
        self.setPassword(password)
        self.__notifications = []
        
    # Property & Getter Methods
    @property
    def Id(self) -> int:
        return self.__id

    @property
    def FirstName(self) -> str:
        return self.__firstName

    @property
    def LastName(self) -> str:
        return self.__lastName

    @property
    def FullName(self) -> str:
        return f"{self.FirstName} {self.LastName}"

    @property
    def Dob(self) -> date:
        return self.__dob
    
    @property
    def Address(self) -> str:
        return self.__address
    
    @property
    def PhoneNumber(self) -> str:
        return self.__phoneNumber
        
    @property
    def Email(self) -> str:
        return self.__email
    
    @property
    def Username(self) -> str:
        return self.__username
    
    def getNotifications(self) -> list[Notification]:
        return self.__notifications
    
    # Setter Methods
    def setFirstName(self, firstName: str) -> None:
        try:
            User.isValidName(firstName)
            self.__firstName = firstName
        except Exception as e:
            raise AttributeError("Invalid first name.") from e
        
    def setLastName(self, lastName: str) -> None:
        try:
            User.isValidName(lastName)
            self.__firstName = lastName
        except Exception as e:
            raise AttributeError("Invalid last name.") from e
        
    def setUsername(self, username: str) -> None:
        try:
            User.isValidName(username)
            self.__firstName = username
        except Exception as e:
            raise AttributeError("Invalid username.") from e
    
    def setPassword(self, password: str) -> None:
        try:
            User.isValidPassword(password)
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            self.__password = hashed.decode('utf-8')
        except Exception as e:
            raise AttributeError("Invalid password.") from e
        
    # Functional Methods
    def checkPassword(self, password: str) -> bool:
        if self.__password is None:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.__password.encode('utf-8'))
    
    def newNotification(self, notification: Notification) -> None:
        if not isinstance(notification, Notification):
            raise TypeError("The provided notification must be of type Notification.")
        self.__notifications.append(notification)
        
    def clearNotification(self, notification: Notification) -> None:
        try:
            self.__notifications.remove(notification)
        except ValueError:
            raise ValueError("Notification not found in the list.")
       
    # Helper Methods
    @staticmethod
    def isValidName(name) -> None:
        if not isinstance(name, str):
            raise TypeError("Name must be a string.")
        if not name.strip():
            raise ValueError("Name cannot be empty.")
        if not re.match(r"^[A-Za-z' -]+$", name):
            raise ValueError("Name contains invalid characters.")
    
    #TODO Include a check to verify username is unique
    @staticmethod
    def isValidUsername(username: str) -> None:
        if not isinstance(username, str):
            raise TypeError("Username must be a string.")
        if not username.strip():
            raise ValueError("Username cannot be empty.")
        if not re.match(r"^[A-Za-z0-9_.-]{3,20}$", username):
            raise ValueError("Username must be 3–20 characters long and contain only letters, numbers, dots, underscores, or hyphens.")
        
    @staticmethod
    def isValidPassword(password: str) -> None:
        if not isinstance(password, str):
            raise TypeError("Password must be a string.")
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", password):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain at least one special character.")