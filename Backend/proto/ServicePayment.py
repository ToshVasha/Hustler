from ServiceRequest import ServiceRequest
import datetime

class ServicePayment:

    __transactionID: str = None
    __amount: int = None
    __consumerID: str = None
    __walletID: str = None
    __businessID: str = None
    __status: str = None
    __date: datetime = None

    def __init__(self, transactionID, amount, consumerID, walletID, businessID, status, date):
        self.__transactionID = transactionID
        self.__amount = amount
        self.__consumerID = consumerID
        self.__walletID = walletID
        self.__businessID = businessID
        self.__status = status
        self.__date = date
    
    def getTransactionID(self):
        return self.transactionID
    
    def getAmount(self):
        return self.amount
    
    def getConsumerID(self):
        self.consumerID = consumer.consumerID
        return self.consumerID
    
    def getWalletID(self):
        return self.walletID
    
    def getBusinessID(self):
        self.businessID = business.businessID
        return self.businessID
    
    def getStatus(self):
        return self.status
    
    def getDate(self):
        return self.date
    
    def processPayment(self):
        pass

    def refund(self, amount):
        pass
