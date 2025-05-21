
from datetime import datetime
from typing import List

class Notification:
    def __init__(self, title: str, description: str):
        self.__title = title
        self.__description = description

    def getTitle(self) -> str:
        return self.__title

    def getDescription(self) -> str:
        return self.__description


class Wallet:
    def __init__(self, bsb: str, account: str, secureCode: int):
        self.__bsb = bsb
        self.__account = account
        self.__secureCode = secureCode

    def setBSB(self, bsb: str):
        self.__bsb = bsb

    def setAccount(self, account: str):
        self.__account = account

    def setSecureCode(self, code: int):
        self.__secureCode = code

    def verify(self, pin: int) -> bool:
        return self.__secureCode == pin


class Review:
    def __init__(self, reviewID: str, title: str, description: str, rating: int):
        self.__reviewID = reviewID
        self.__title = title
        self.__description = description
        self.__rating = rating

    def getTitle(self) -> str:
        return self.__title

    def getDescription(self) -> str:
        return self.__description

    def getRating(self) -> int:
        return self.__rating

    @staticmethod
    def addReview(reviewID: str, title: str, description: str, rating: int) -> 'Review':
        return Review(reviewID, title, description, rating)


class Account:
    def __init__(self, accountID: str, fullName: str, dob: datetime, address: str,
                 phone: str, username: str, password: str, communityRating: int,
                 notifs: List[Notification]):
        self.__accountID = accountID
        self.__fullName = fullName
        self.__dob = dob
        self.__address = address
        self.__phone = phone
        self.__username = username
        self.__password = password
        self.__communityRating = communityRating
        self.__notifs = notifs

    def getAccountID(self) -> str:
        return self.__accountID

    def getAddress(self) -> str:
        return self.__address

    def getPhone(self) -> str:
        return self.__phone

    def getUsername(self) -> str:
        return self.__username

    def getPassword(self) -> str:
        return self.__password

    def getCommunityRating(self) -> int:
        return self.__communityRating

    def getNotifications(self) -> List[Notification]:
        return self.__notifs

    def setAddress(self, address: str):
        self.__address = address

    def setPhone(self, phone: str):
        self.__phone = phone

    def setUsername(self, username: str):
        self.__username = username

    def setPassword(self, password: str):
        self.__password = password

    def addNotification(self, notif: Notification):
        self.__notifs.append(notif)

    @staticmethod
    def addAccount(accountID: str, fullName: str, dob: datetime, address: str,
                   phone: str, username: str, password: str, communityRating: int) -> 'Account':
        return Account(accountID, fullName, dob, address, phone, username, password, communityRating, [])
