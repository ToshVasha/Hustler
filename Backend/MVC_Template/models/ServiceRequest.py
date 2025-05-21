#import classes from other files
import datetime

class ServiceRequest:

    """
    Represents the request for a service sent to a provider
    i.e. Consumer sees ad, sends a request to the Provider who can accept/deny

    Attributes:
        requestID (str): unique identifier for the request
        consumerID (str): unique identifier for the consumer i.e. the Requester
        serviceID (str): unique identifier for the service being requested. this service will hold the relevant businessID too
        status (bool): boolean to indicate whether the request has been accepted/denied
        timestamp (date): exact date of the request creation
    """

    def __init__(self, requestID: str, consumerID: str, serviceID: str, status: bool, timestamp: datetime):
        self.__requestID: str = requestID
        self.__consumerID: str = consumerID
        self.__serviceID: str = serviceID
        self.__status: bool = status
        self.__timestamp: datetime= datetime.datetime.now()

    @property
    def requestID(self) -> str:
        return self.__requestID

    @property
    def consumerID(self) -> str:
#        self.consumerID = consumer.consumerID
        return self.__consumerID
    
    @property
    def serviceID(self) -> str:
#        self.serviceID = service.serviceID
        return self.__serviceID
    
    @property
    def status(self) -> bool:
        return self.__status
    
    """
        #method to cancel a Service Request
        def cancelRequest(self):
            if (consumer.serviceRequested == False):
                pass
    """


    



