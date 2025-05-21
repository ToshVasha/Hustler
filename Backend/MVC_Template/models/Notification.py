class Notification:
    """
    Class intended for storing notification data upon runtime

    Attributes:
        title (str): short label of the notification
        description (str): brief description of the notification
        businessID (str): unique identifier for the business that sent the notification
        <<<NOTIFICATION ID???>>>
        <<<CONSUMER ID???>>>

    """

    def __init__(self, title: str, description: str, businessID: str):
        self.title: str = title
        self.description: str = description
        self.__businessID: str = businessID

    @property
    def title(self) -> str:
        return self.__title
    
    @title.setter
    def title(self, title: str) -> None:
        try:
            self.__validateTitle(title)
            self.__title = title
        except Exception as e:
            raise ValueError("Invalid title") from e

    @property
    def description(self) -> str:
        return self.__description

    @description.setter
    def description(self, description: str) -> None:
        try: 
            self.__validateDescription(description)
            self.__description = description
        except Exception as e:
            raise ValueError("Invalid notification description") from e

    @property
    def businessID(self) -> str:
        return self.__businessID
    
    @staticmethod
    def __validateDescription(description: str) -> None:
        if not isinstance(description, str):
            raise TypeError("Description must be a string")
        if not description.strip():
            raise ValueError("Description cannot be empty")
        if len(description) > 200:
            raise ValueError("Description is too long. Must be less than 200 characters")




