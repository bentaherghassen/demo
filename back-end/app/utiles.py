import re

def validate_required_fields(data, required_fields):
    """Check if all required fields are present and non-empty."""
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return {
            'error': 'Missing required fields.',
            'missing': missing
        }
    return None


def validate_email_format(email):
    """Check if email has a valid format."""
    pattern = r'^[^@]+@[^@]+\.[^@]+$'
    if not re.match(pattern, email):
        return {'error': 'Invalid email format.'}
    return None


def validate_password_strength(password):
    """Check if password meets minimum strength requirements."""
    if len(password) < 8:
        return {'error': 'Password must be at least 8 characters long.'}
    if not re.search(r'[A-Z]', password):
        return {'error': 'Password must contain at least one uppercase letter.'}
    if not re.search(r'[a-z]', password):
        return {'error': 'Password must contain at least one lowercase letter.'}
    if not re.search(r'[0-9]', password):
        return {'error': 'Password must contain at least one number.'}
    if not re.search(r'[\W_]', password):
        return {'error': 'Password must contain at least one special character.'}
    return None
