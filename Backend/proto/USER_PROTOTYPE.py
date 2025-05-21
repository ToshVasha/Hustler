
#User class as parent of Consumer AND Provider??
class User:
    def __init__(self, firstName, lastName, dob, phoneNumber, userName, password, communityRating, email, type):
        self.firstName = firstName
        self.lastName = lastName
        self.dob = dob
        self.phoneNumber = phoneNumber
        self.userName = userName
        self.password = password
        self.communityRating = communityRating or 0
        self.email = email
        self.type = type

    def getFullName(self):
        fullName = self.firstName + " " + self.lastName
        print(fullName)
        
        #return fullName
    def getDob(self):
        return self.dob
    def getPhoneNumber(self):
        return self.phoneNumber 
    def getUserName(self):
        return self.userName 
    def getPassword(self):
        return self.password   
    def getCommunityRating(self):
        return self.communityRating   
    def getType(self):
        return self.type
    def displayUser(self):
        fullName = self.getFullName()
        print(f"Name: {fullName}\nDOB: {self.dob}\nPhone Number: {self.phoneNumber}\nUsername: {self.userName}\nEmail: {self.email}\nCurrent Rating: {float(self.communityRating)}")

class Consumer(User):
    def __init__(self, firstName, lastName, dob, phoneNumber, userName, password, communityRating, email, type, servicesNeeded):
        super().__init__(firstName, lastName, dob, phoneNumber, userName, password, communityRating, email, type)
        self.servicesNeeded = servicesNeeded
    
#while loop for main code
while True:
    try:
#initialise variables through user inputs
        print("Welcome to User creation")
        firstName = str(input("Please enter your first name: "))
        lastName = str(input("Please enter your last name: "))
        dob = str(input("Please enter your date of birth (DD/MM/YYYY): "))
        email = str(input("Please enter your email: "))
        phoneNumber = int(input("Please enter your mobile number: "))
        userName = str(input("Please enter your user name: "))
        password = str(input("Please enter your password: "))

        type = str(input("What type of account would you like to create? (Consumer/Business): ")).lower

        if type == ("consumer"):

        #Add new consumer object
            new_consumer = Consumer(firstName, lastName, dob, phoneNumber, userName, password, "", email, type, "")

            new_consumer.displayUser()


    #ask the user to continue or not, to exit while loop
        running = input("\nContinue running system? (Y/N): ")

        if running == "Y":
            continue
        elif running == "N":
            break

#'except' block 
    except ValueError as VE:
        print(f"Error: {VE}")

    #ask the user to continue or not, to exit while loop
        running = input("\nContinue running system? (Y/N): ")
        if running == "Y":
            continue
        elif running == "N":
            break

    
