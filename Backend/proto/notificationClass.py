#
class Notification:

    __title = None
    __description = None
    __category = None
    __businessID = None

    def __init__(self, title, description, payment, category, businessID):
        self.title = title
        self.description = description
        self.category = category
        self.businessID = businessID

    def getTitle(self):
        return self.__title
    def getDescription(self):
        return self.__description
    def getCategory(self):
        return self.__category
    def getBusinessID(self):
        return self.__businessID

    def editTitle(self, title):
        self.__title = title
    def editDescription(self, description):
        self.__description = description


