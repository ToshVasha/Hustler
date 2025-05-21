from datetime import datetime

class ServiceRequest:
    """
    Represents a service request made by a consumer.

    Attributes:
        date (datetime): Date when the request was made. Defaults to current time.
        cost (float): Cost associated with the request.
        approved (bool): Whether the request is approved.
    """

    def __init__(self, date: datetime = None, cost: float = 0.0, approved: bool = False):
        self.__date: datetime = date or datetime.now()
        self.cost = cost
        self.approved = approved

    # property read only
    @property
    def date(self) -> datetime:
        return self.__date

    @property
    def cost(self) -> float:
        return self.__cost

    @cost.setter
    def cost(self, cost: float) -> None:
        if not isinstance(cost, (float, int)):
            raise TypeError("Cost must be a numeric value.")
        if cost < 0:
            raise ValueError("Cost cannot be negative.")
        self.__cost = float(cost)

    @property
    def approved(self) -> bool:
        return self.__approved

    @approved.setter
    def approved(self, approved: bool) -> None:
        if not isinstance(approved, bool):
            raise TypeError("Approved must be a boolean.")
        self.__approved = approved
