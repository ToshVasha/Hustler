import re

class Wallet:
    """
    Represents a user's wallet for managing payments.

    Attributes:
        bsb (str): Bank-State-Branch number.
        account (str): Bank account number.
        abn (str): Australian Business Number (for providers).
        card (str): Credit/debit card number (for consumers).
        expiry (str): Expiry date of the card in MM/YY format.
        securityCode (int): Card security code (e.g., CVV).
    """

    def __init__(self, bsb: str, account: str, abn: str = None, card: str = None,
                 expiry: str = None, securityCode: int = None):
        self.bsb = bsb
        self.account = account
        self.abn = abn
        self.card = card
        self.expiry = expiry
        self.securityCode = securityCode

    @property
    def bsb(self) -> str:
        return self.__bsb

    @bsb.setter
    def bsb(self, bsb: str) -> None:
        if not isinstance(bsb, str) or not re.fullmatch(r"\d{6}", bsb):
            raise ValueError("BSB must be a 6-digit number.")
        self.__bsb = bsb

    @property
    def account(self) -> str:
        return self.__account

    @account.setter
    def account(self, account: str) -> None:
        if not isinstance(account, str) or not re.fullmatch(r"\d{6,10}", account):
            raise ValueError("Account number must be between 6 and 10 digits.")
        self.__account = account

    @property
    def abn(self) -> str:
        return self.__abn

    @abn.setter
    def abn(self, abn: str) -> None:
        if abn:
            if not isinstance(abn, str) or not re.fullmatch(r"\d{11}", abn):
                raise ValueError("ABN must be an 11-digit number.")
        self.__abn = abn

    @property
    def card(self) -> str:
        return self.__card

    @card.setter
    def card(self, card: str) -> None:
        if card:
            if not isinstance(card, str) or not re.fullmatch(r"\d{13,19}", card):
                raise ValueError("Card number must be between 13 and 19 digits.") # mine has 16 so +- 3 seem appropriate?
        self.__card = card

    @property
    def expiry(self) -> str:
        return self.__expiry

    @expiry.setter
    def expiry(self, expiry: str) -> None:
        if expiry:
            if not isinstance(expiry, str) or not re.fullmatch(r"(0[1-9]|1[0-2])\/\d{2}", expiry):
                raise ValueError("Expiry must be in MM/YY format.")
        self.__expiry = expiry

    @property
    def securityCode(self) -> int:
        return self.__securityCode

    @securityCode.setter
    def securityCode(self, code: int) -> None:
        if code is not None:
            if not isinstance(code, int):
                raise TypeError("Security code must be an integer.")
            if not (100 <= code <= 9999):
                raise ValueError("Security code must be a 3 or 4-digit number.")
        self.__securityCode = code
