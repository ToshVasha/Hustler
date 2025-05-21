
class Report(object):
    __reportID = None
    __classType = None
    __data = None
    __timestamp = None

    def __init__(self, reportID, classType, data, timestamp):
        self.__reportID = reportID
        self.__classType = classType
        self.__data = data
        self.__timestamp = timestamp

    def importReport(self):
        f = open("hustleReport.txt")
        print(f.read())

    def exportReport(self):
        f = open("hustlrReport.txt", "x")
