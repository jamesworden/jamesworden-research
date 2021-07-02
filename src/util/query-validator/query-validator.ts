import { HttpStatusCode } from '..';
import { Response } from 'express';

class QueryValidatior {
	response: Response;

	constructor(response: Response) {
		this.response = response;
	}

	/**
	 * Validates query parameters for routes by ensureing specified variables are defined
	 * @param object Array of values that must be defined
	 * @return error data only
	 */
	containsUndefinedValues(object: any): boolean {
		const values: String[] = [];

		for (const value in object) {
			if (!object[value]) {
				values.push(value);
			}
		}

		if (values.length == 0) {
			return false;
		}

		const parameters: string = values.join(values.length == 2 ? ' and ' : ', ');
		const s = values.length > 1 ? 's' : '';

		this.sendError({
			httpResponse: {
				error: `You must specify the ${parameters} query parameter${s}!`,
			},
			httpStatusCode: HttpStatusCode.NOT_ACCEPTABLE,
		});
		return true;
	}

	/**
	 * @param key API key required for API services
	 * @return error data only
	 */
	containsInvalidKey(key: string): boolean {
		if (!key || key.trim() === '') {
			this.sendError({
				httpResponse: {
					error: 'An API key is required to perform this function.',
				},
				httpStatusCode: HttpStatusCode.UNAUTHORIZED,
			});
			return true;
		}

		if (key != process.env.RESEARCH_API_KEY) {
			this.sendError({
				httpResponse: {
					error: 'The specified API key is invalid.',
				},
				httpStatusCode: HttpStatusCode.UNAUTHORIZED,
			});
			return true;
		}

		return false;
	}

	sendError(err: ValidationError) {
		this.response.status(err.httpStatusCode).send(err.httpResponse);
	}
}

interface ValidationError {
	httpResponse: {
		error: string;
	};
	httpStatusCode: HttpStatusCode;
}

export { QueryValidatior };
