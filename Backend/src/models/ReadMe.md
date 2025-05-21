# Techniques Used

Below is a detailed breakdown of the documentation techniques applied across the classes we developed; Use this as a reference for documentation in final deliverable.

---

## 1. Class Docstrings

Each class begins with a docstring that:

- Explains class purpose.
- Lists attributes with types and descriptions.

```python
class Report:
    """
    Represents a system report for logging and exporting/importing data.

    Attributes:
        reportId (str): Unique ID of the report.
        reportType (str): Type of the report.
        data (dict): Data stored in the report.
        timestamp (datetime): Timestamp of report creation.
    """
    ...
```

**Benefits:**

- Provides context and intent for the class.
- Clarifies the data model and expected types.

---

## 2. Method Docstrings

Each method (that are not self-explanatory) has its own docstring describing:

- Purpose of the method.
- Parameters (`Args` section) and their types.
- Return type when appropriate.

```python
def importReport(self, filePath: str = "hustleReport.txt") -> None:
    """
    Imports report content from a file.

    Args:
        filePath (str): Path to read. Defaults to "hustleReport.txt".
    """
    ...
```

**Benefits:**

- Guides devs on how to call the method.
- Documents default values and side effects.

---

## 3. Type Annotations

- Function signatures include parameter and return types.
- Expectations for IDEs and linters.

```python
def exportReport(self, filePath: str = "hustlrReport.txt") -> None:
    ...
```

**Benefits:**

- Readability.
- Static analysis and auto-completion.

---

## 4. Validation & Error Messages

- Setters perform type checks and value validation.
- Exceptions have clear, descriptive messages.

```python
if not isinstance(data, dict):
    raise TypeError("Data must be a dictionary.")
```

**Benefits:**

- Prevents misuse and invalid state.
- Easy debugging with explicit errors.

---

## 5. `@property` Decorators

- Encapsulation!!! (access to private attributes.)
- Validation logic is always applied.

```python
@property
def reportId(self) -> str:
    return self.__reportId
```

**Benefits:**

- Maintains internal invariants.
- Clean public API.

---

## 6. Static Methods for Shared Logic

- Internal validation logic uses static methods.

```python
@staticmethod
def __validateReportType(reportType: str) -> None:
    ...
```

**Benefits:**

- Separates concerns without accessing instance state.
- Reusable across multiple setters.

---

## 8. Consistent Naming Conventions

- Naming convention: `CamelCase` (e.g., `ServiceRequest`).
- Private attributes prefixed with double underscores (`__`).

**Benefits:**

- Adheres to Python style guides.
- Readability and predictability.

## 9. String Matching and Regular Expressions

Classes that involve user input validation (such as Wallet and Service) employ regular expressions to validate inputs such as BSB numbers, card numbers, and ABN formats.

```python
if not re.fullmatch(r"\d{6}", bsb):
    raise ValueError("BSB must be a 6-digit number.")
    ...
```

**Benefits:**

- Input validity through structured patterns.
- Reduces human error by enforcing format consistency.
