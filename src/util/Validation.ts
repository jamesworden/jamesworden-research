class Validation {
	/**
	 * @param {String} String1
	 * @param {String} String2
	 * @returns True only if given strings are equal regardless of casing
	 */
	equalsIgnoreCase(string1: string, string2: string): boolean {
		return string1 && string2 && string1.toUpperCase() === string2.toUpperCase() ? true : false;
	}

	/**
	 * @param {String} String
	 * @returns True only if given strings are equal regardless of casing
	 */
	equalsTrue(string: string): boolean {
		return this.equalsIgnoreCase(string, 'true');
	}
}

export const validation = new Validation();
