/**
 * Formats a phone number to the 2567... format for API and SMS use.
 * @param phone Raw phone number string
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phone: string): string => {
	// Remove any non-digit characters
	let cleaned = phone.replace(/[^0-9]/g, '');

	// If starts with 256, use it as is
	if (cleaned.startsWith('256')) {
		// Remove any 0 after 256 if present
		cleaned = cleaned.replace(/^(256)0+/, '$1');
		return cleaned;
	}

	// If starts with 0, remove it and add 256
	if (cleaned.startsWith('0')) {
		return `256${cleaned.substring(1)}`;
	}

	// If starts with 7, add 256
	if (cleaned.startsWith('7')) {
		return `256${cleaned}`;
	}

	// If starts with +256, remove + and use as is
	if (phone.startsWith('+256')) {
		return phone.substring(1);
	}

	return cleaned;
};

/**
 * Validates if a phone number is a valid Ugandan phone number.
 * @param phone Raw phone number string
 * @returns boolean indicating if the phone number is valid
 */
export const isValidUgandanPhone = (phone: string): boolean => {
	const cleaned = phone.replace(/[^0-9]/g, '');

	// Check if it's a valid Ugandan mobile number
	// Should be 9 digits starting with 7, or 12 digits starting with 256
	if (cleaned.startsWith('7') && cleaned.length === 9) {
		return true;
	}

	if (cleaned.startsWith('256') && cleaned.length === 12) {
		return true;
	}

	return false;
};
