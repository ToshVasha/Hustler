import re
from datetime import datetime

class Report:
    """
    Represents a system report for logging and exporting/importing data.

    Attributes:
        reportId (str): Unique ID of the report.
        reportType (str): Type of the report.
        data (dict): Data stored in the report.
        timestamp (datetime): Timestamp of report creation.
    """

    def __init__(self, reportId: str, reportType: str, data: dict, timestamp: datetime):
        self.__reportId: str = reportId
        self.reportType = reportType
        self.data = data
        self.__timestamp: datetime = timestamp

    @property
    def reportId(self) -> str:
        return self.__reportId

    @property
    def reportType(self) -> str:
        return self.__reportType

    @reportType.setter
    def reportType(self, reportType: str) -> None:
        self.__validateReportType(reportType)
        self.__reportType = reportType

    @property
    def data(self) -> dict:
        return self.__data

    @data.setter
    def data(self, data: dict) -> None:
        if not isinstance(data, dict):
            raise TypeError("Data must be a dictionary.")
        self.__data = data

    @property
    def timestamp(self) -> datetime:
        return self.__timestamp

    def importReport(self, filePath: str = "hustlrReport.txt") -> None:
        """
        Imports report content from a file.

        Args:
            filePath (str): Path to the file to read. Default is "hustlrReport.txt".
        """
        try:
            with open(filePath, "r") as file:
                print(file.read())
        except FileNotFoundError:
            print(f"File '{filePath}' not found.")

    def exportReport(self, filePath: str = "hustlrReport.txt") -> None:
        """
        Exports report content to a file.

        Args:
            filePath (str): Path to the file to write. Default is "hustlrReport.txt".
        """
        try:
            with open(filePath, "x") as file:
                file.write(str(self.data))
        except FileExistsError:
            print(f"File '{filePath}' already exists. Export aborted.")

    # static validation helper
    @staticmethod
    def __validateReportType(reportType: str) -> None:
        if not isinstance(reportType, str):
            raise TypeError("Report type must be a string.")
        if not reportType.strip():
            raise ValueError("Report type cannot be empty.")
        if not re.fullmatch(r"[A-Za-z\s]+", reportType):
            raise ValueError("Report type must contain only letters and spaces.")
