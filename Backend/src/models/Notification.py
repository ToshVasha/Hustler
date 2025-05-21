from datetime import datetime

class Notification:
    """
    Represents a notification message received by an account.

    Attributes:
        title (str): Title of the notification.
        description (str): Description or message body of the notification.
        dateCreated (datetime): Datetime when the notification was created. Defaults to current time.
    """

    def __init__(self, title: str, description: str, dateCreated: datetime = None):
        self.title = title
        self.description = description
        self.__dateCreated: datetime = dateCreated or datetime.now()

    @property
    def title(self) -> str:
        return self.__title

    @title.setter
    def title(self, title: str) -> None:
        if not isinstance(title, str):
            raise TypeError("Title must be a string.")
        if not title.strip():
            raise ValueError("Title cannot be empty.")
        if len(title) > 100:
            raise ValueError("Title is too long. Must be less than 100 characters.")
        self.__title = title

    @property
    def description(self) -> str:
        return self.__description

    @description.setter
    def description(self, description: str) -> None:
        if not isinstance(description, str):
            raise TypeError("Description must be a string.")
        if not description.strip():
            raise ValueError("Description cannot be empty.")
        if len(description) > 500:
            raise ValueError("Description is too long. Must be less than 500 characters.")
        self.__description = description

    @property
    def dateCreated(self) -> datetime:
        return self.__dateCreated
