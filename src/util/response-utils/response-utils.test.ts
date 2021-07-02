import { FunctionResponse } from '.';
import { HttpStatusCode } from '..';

describe('Function response utilities', () => {
	type MockData = {
		specificKey: 'value';
		stringKey: string;
	};

	function getMockData(getErrorResponse: boolean): FunctionResponse<MockData> {
		if (getErrorResponse) {
			return {
				error: true,
				httpResponse: {
					error: 'This is an invalid response',
				},
				httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
			};
		}

		return {
			error: false,
			httpResponse: {
				specificKey: 'value',
				stringKey: 'This is successfully requested data',
			},
			httpStatusCode: HttpStatusCode.OK,
		};
	}

	it('Access response data with error validation', () => {
		const errorResponse = true;
		const res: FunctionResponse<MockData> = getMockData(errorResponse);

		expect(res.error).toBe(true);

		if (res.error) {
			return;
		}

		/**
		 * Notice how there's no problem accessing the data property here.
		 * Typescript 'knows' this is fine because of the 'if (error) return'
		 * statement above.
		 */
		expect(res.httpResponse).toBeDefined;
	});

	it('Error handling works as expected', () => {
		const errorResponse = false; // Change from previous test
		const res: FunctionResponse<MockData> = getMockData(errorResponse);

		expect(res.error).toBe(false);

		if (res.error) {
			return;
		}

		/**
		 * Again, we can start chaining data properties and VSCode
		 * has no issue with that (at least locally) because of our
		 * type-guarding with checking if the response is an error.
		 *
		 * @see {@link https://basarat.gitbook.io/typescript/type-system/typeguard}
		 */
		expect(res.httpResponse.specificKey).toBe('value');
	});
});
