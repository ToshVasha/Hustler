'''
manages user data, login, reviews
possible key methods:
def registerConsumer(accountData: dict) -> Consumer:
def registerProvider(accountData: dict) -> Provider;
def login(username: str, password: str) -> Account:
def updateAccountDetails(accountId: str, updateData: dict) -> None:
def generateAccountReport(accountId: str) -> str:
def addReviewToAccount(accountId: str, review: Review) -> None:
def deleteNotification(accountId: str, notification: Notification) -> None:
'''

