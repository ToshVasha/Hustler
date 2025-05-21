import re
from datetime import date

class Service:
    """
    Represents a service offered by a provider.

    Attributes:
        serviceId (str): Unique identifier for the service.
        serviceType (str): Type of service (e.g., plumbing, cleaning).
        datePosted (date): Date when the service was posted.
        description (str): Detailed description of the service.
        completion (bool): Whether the service has been completed.
        price (tuple[float, float]): Minimum and maximum price range.
    """

    def __init__(self, serviceId: str, serviceType: str, description: str, price: tuple[float, float]):
        if not isinstance(serviceId, str) or not serviceId.strip():
            raise ValueError("Service ID must be a non-empty string.")
        self.__serviceId: str = serviceId
        self.__datePosted: date = date.today()
        self.__completion: bool = False
        self.serviceType = serviceType
        self.description = description
        self.price = price

    # property read only
    @property
    def serviceId(self) -> str:
        return self.__serviceId

    @property
    def serviceType(self) -> str:
        return self.__serviceType

    @serviceType.setter
    def serviceType(self, serviceType: str) -> None:
        self.__validateServiceType(serviceType)
        self.__serviceType = serviceType

    # property read only
    @property
    def datePosted(self) -> date:
        return self.__datePosted

    @property
    def description(self) -> str:
        return self.__description

    @description.setter
    def description(self, description: str) -> None:
        self.__validateDescription(description)
        self.__description = description

    @property
    def completion(self) -> bool:
        return self.__completion

    @completion.setter
    def completion(self, completed: bool) -> None:
        if not isinstance(completed, bool):
            raise TypeError("Completion status must be a boolean.")
        self.__completion = completed

    @property
    def price(self) -> tuple[float, float]:
        return self.__price

    @price.setter
    def price(self, priceRange: tuple[float, float]) -> None:
        minPrice, maxPrice = priceRange
        if not (isinstance(minPrice, (float, int)) and isinstance(maxPrice, (float, int))):
            raise TypeError("Prices must be numeric values.")
        if minPrice < 0 or maxPrice < 0:
            raise ValueError("Prices must be non-negative.")
        if minPrice > maxPrice:
            raise ValueError("Minimum price cannot exceed maximum price.")
        self.__price = (float(minPrice), float(maxPrice))

    def confirmPayment(self) -> None:
        """Confirms that payment has been made."""
        print("Payment confirmed.")

    # validation methods
    @staticmethod
    def __validateServiceType(serviceType: str) -> None:
        if not isinstance(serviceType, str):
            raise TypeError("Service type must be a string.")
        if not serviceType.strip():
            raise ValueError("Service type cannot be empty.")
        if not re.match(r"^[A-Za-z\s]+$", serviceType):
            raise ValueError("Service type must contain only letters and spaces.")

    @staticmethod
    def __validateDescription(description: str) -> None:
        if not isinstance(description, str):
            raise TypeError("Description must be a string.")
        if not description.strip():
            raise ValueError("Description cannot be empty.")
        if len(description) > 300:
            raise ValueError("Description is too long. Must be less than 300 characters.")
