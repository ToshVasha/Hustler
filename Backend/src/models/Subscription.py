from datetime import date

class Subscription:
    """
    Represents a subscription to a recurring service.

    Attributes:
        transactionId (str): Unique identifier for the subscription.
        amount (float): Payment amount for the subscription.
        startDate (date): Date the subscription began. Defaults to today.
        isActive (bool): Whether the subscription is currently active.
    """

    def __init__(self, transactionId: str, amount: float, startDate: date = None, isActive: bool = True):
        if not isinstance(transactionId, str) or not transactionId.strip():
            raise ValueError("Transaction ID must be a non-empty string.")
        self.__transactionId: str = transactionId
        self.amount = amount
        self.__startDate: date = startDate or date.today()
        self.isActive = isActive

    # read only
    @property
    def transactionId(self) -> str:
        return self.__transactionId

    @property
    def amount(self) -> float:
        return self.__amount

    @amount.setter
    def amount(self, amount: float) -> None:
        if not isinstance(amount, (float, int)):
            raise TypeError("Amount must be a numeric value.")
        if amount < 0:
            raise ValueError("Amount must be non-negative.")
        self.__amount = float(amount)

    # read only
    @property
    def startDate(self) -> date:
        return self.__startDate

    @property
    def isActive(self) -> bool:
        return self.__isActive

    @isActive.setter
    def isActive(self, active: bool) -> None:
        if not isinstance(active, bool):
            raise TypeError("isActive must be a boolean.")
        self.__isActive = active
