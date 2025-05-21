'''handles service requests and subscriptions
possible key methods:
def requestAService(consumerId: str, serviceId: str) -> None:
def deleteServiceRequest(consumerId: str, requestId: str) -> None: 
def applyForSubscription(consumerId: str, serviceId: str) -> None: 
def cancelSubscription(consumerId: str, subscriptionId: str) -> None:
def getConsumerServiceRequests(consumerId: str) -> list:
def getConsumerSubscriptions(consumerId: str) -> list:

'''