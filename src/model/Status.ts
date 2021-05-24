export enum Status {
	OK = 'Success!',
	INTERNAL_ERROR = 'There was an error processing your request!',
	ROUTE_NOT_FOUND = 'The specified route could not be found!',
	NOT_INITALIZED = 'The route has not been initalized yet.',
	EXCEEDED_MAXIMUM_DISTANCE = 'The specified route is too long!',
	NO_TEXT_DATA = 'No text was detected within the route and detor data.',
	DIFFERENT_ROUTES = 'The route and detor have differences in their locations based on the text data.',
}
