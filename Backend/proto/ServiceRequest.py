#import classes from other files
from ServicePayment import ServicePayment 
import datetime

    #for future consumer class
#from Consumer import Consumer

class ServiceRequest:
    #all 
    __requestID: str = None
    __consumerID: str = None
    __serviceID: str = None
    __status: str = None
    __requestCreationTimestamp: datetime = None

    def __init__(self, requestID, consumerID, serviceID, status, requestCreationTimestamp):
        self.__requestID = requestID
        self.__consumerID = consumerID
        self.__serviceID = serviceID
        self.__status = status
        self.__requestCreationTimestamp = requestCreationTimestamp

    def getRequestID(self):
        return self.requestID

    #get consumerID from the consumer
    #will need to match it to make sure its the right one
    def getConsumerID(self):
        self.consumerID = consumer.consumerID
        return self.consumerID
    
    def getServiceID(self):
        self.serviceID = service.serviceID
        return self.serviceID
    
    def getStatus(self):
        return self.status
    
    def getRequestCreationTimestamp(self):
        return self.requestCreationTimestamp
    
    #method to cancel a Service Request
    def cancelRequest(self):
        if (consumer.serviceRequested == False):
            pass

    



