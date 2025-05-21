from datetime import datetime

class Review:
    """
    Represents a review given by a user to another user or service.

    Attributes:
        title (str): Title of the review.
        description (str): Body of the review.
        rating (int): Numerical rating value (1 to 5).
        dateCreated (datetime): The datetime when the review was created.
    """

    def __init__(self, title: str, description: str, rating: int, dateCreated: datetime = None):
        self.title = title
        self.description = description
        self.rating = rating
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
    def rating(self) -> int:
        return self.__rating

    @rating.setter
    def rating(self, rating: int) -> None:
        if not isinstance(rating, int):
            raise TypeError("Rating must be an integer.")
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5.")
        self.__rating = rating

    @property
    def dateCreated(self) -> datetime:
        return self.__dateCreated
