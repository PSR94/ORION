import re
from typing import Dict, Any, Union

class DataSanitizer:
    """
    Sanitizes PII and sensitive patterns from tool inputs and outputs.
    """
    
    # Common PII patterns
    PATTERNS = {
        "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b',
        "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
        "credit_card": r'\b(?:\d[ -]*?){13,16}\b'
    }

    @classmethod
    def mask_string(cls, text: str) -> str:
        for name, pattern in cls.PATTERNS.items():
            text = re.sub(pattern, f'[REDACTED_{name.upper()}]', text)
        return text

    @classmethod
    def sanitize(cls, data: Union[str, Dict[str, Any], list]) -> Union[str, Dict[str, Any], list]:
        if isinstance(data, str):
            return cls.mask_string(data)
        elif isinstance(data, dict):
            return {k: cls.sanitize(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [cls.sanitize(item) for item in data]
        return data

sanitizer = DataSanitizer()
