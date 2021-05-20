export default class ErrorMessage {
	error: string;
	message: string;

	constructor(error: string, message: string) {
		this.error = error;
		this.message = message;
	}

	getError(): string {
		return this.error;
	}

	getMessage(): string {
		return this.message;
	}
}
