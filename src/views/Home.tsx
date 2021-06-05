import * as React from 'react';

import { Layout } from './Layout';

interface Home {}

export default class extends React.Component<Home> {
	render() {
		return <Layout title='Mitigate GPS Spoofing'>Index</Layout>;
	}
}
