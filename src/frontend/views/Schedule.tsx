import * as React from 'react';

import { Layout } from '../Layout';

interface Schedule {}

export default class extends React.Component<Schedule> {
	render() {
		return (
			<Layout title='Mitigate GPS Spoofing'>
				<p>Content</p>
			</Layout>
		);
	}
}
