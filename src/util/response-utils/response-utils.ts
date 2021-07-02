import { HttpStatusCode } from '../http-status-code';
import { Response } from 'express';

interface BaseFunctionResponse {
	httpStatusCode: HttpStatusCode;
	httpResponse: any;
	error: boolean;
}

interface FunctionError extends BaseFunctionResponse {
	httpResponse: {
		error: string;
	};
	error: true;
}

interface FunctionData<Type> extends BaseFunctionResponse {
	httpResponse: Type;
	error: false;
}

type FunctionResponse<Type> = FunctionError | FunctionData<Type>;

export { FunctionResponse, FunctionError };
