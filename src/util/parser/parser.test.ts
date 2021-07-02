import { CoordinateData, FunctionResponse } from '..';

import { MAX_WAYPOINTS_PER_ROUTE } from '../../config';
import { parser } from '.';

describe('Parse coordinate string correctly', () => {
	let str: string;
	let res: FunctionResponse<CoordinateData>;

	it('Valid pair', () => {
		str = '40,-70';
		res = parser.parseCoordinateString(str);

		if (res.error) {
			expect(res.error).toBe(false);
			return;
		}

		expect(res.httpResponse).toStrictEqual({
			data: {
				coordinates: [
					{
						latitude: 40,
						longitude: -70,
					},
				],
			},
		});
	});

	it('Invalid pair', () => {
		str = '40,-70,';
		res = parser.parseCoordinateString(str);

		if (res.error) {
			expect(res.error).toBe(true);
			expect(res.httpResponse.error).toContain('Invalid');
			return;
		}
	});

	it('Valid pairs', () => {
		str = '40,-70.01|30.91,0';
		res = parser.parseCoordinateString(str);

		if (res.error) {
			expect(res.error).toBe(false);
			return;
		}

		expect(res.httpResponse).toStrictEqual({
			data: {
				coordinates: [
					{
						latitude: 40,
						longitude: -70.01,
					},
					{
						latitude: 30.91,
						longitude: 0,
					},
				],
			},
		});
	});

	it('Invalid pairs', () => {
		str = '40,-70||30.911';
		res = parser.parseCoordinateString(str);

		if (res.error) {
			expect(res.error).toBe(true);
			expect(res.httpResponse.error).toContain('Invalid');
			return;
		}
	});

	it('Too many waypoints', () => {
		const tooMany: number = MAX_WAYPOINTS_PER_ROUTE + 1;
		str = '';

		for (let i = 0; i < tooMany; i++) {
			str += '0,0|';
		}

		str = str.substring(0, str.length - 1);
		res = parser.parseCoordinateString(str);

		if (res.error) {
			expect(res.error).toBe(true);
			expect(res.httpResponse.error).toContain('too many');
			return;
		}
	});

	it('Invalid values', () => {
		str = 'value,9';
		expect(res.error).toBe(true);

		str = '0,900';
		expect(res.error).toBe(true);

		str = '78,9.32|test,9';
		expect(res.error).toBe(true);

		str = '-91,3|3,181';
		expect(res.error).toBe(true);

		str = '91,3|3,-181';
		expect(res.error).toBe(true);
	});
});
