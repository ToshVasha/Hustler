'''manages services and service requests
possible key methods:
def createService(providerId: str, serviceData: dict) -> None: 
def editService(providerId: str, serviceId: str, updatedData: dict) -> None:
def deleteService(providerId: str, serviceId: str) -> None: 
def acceptServiceRequest(providerId: str, requestId: str) -> None:
def denyServiceRequest(providerId: str, requestId: str) -> None:
def completeServiceRequest(providerId: str, requestId: str) -> None:
def getAllProviderServices(providerId: str) -> list[Service]:

'''