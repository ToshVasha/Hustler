
class Review:
    __reviewID = None
    __businessID = None
    __consumerID = None
    __reviewerID = None
    __reviewerName = None
    __title = None
    __description = None
    __rating = None
    __timestamp = None

    def __init__(self, reviewID, businessID, consumerID, title, description, rating, timestamp):
        self.__reviewID = reviewID
        self.__title = title
        self.__description = description
        self.__rating = rating
        self.__businessID = businessID
        self.__consumerID = consumerID
        self.__reviewerID = reviewID


    def getReviewID(self):
        return self.__reviewID
    def getBusinessID(self):
        return self.__businessID
    def getConsumerID(self):
        return self.__consumerID
    def getTitle(self):
        return self.__title
    def getDescription(self):
        return self.__description
    def getRating(self):
        return self.__rating
    def getTimestamp(self):
        return self.__timestamp

    def editTitle(self, title):
        self.__title = title
    def editDescription(self, description):
        self.__description = description
