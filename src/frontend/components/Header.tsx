import * as React from 'react';

import { Container } from './Container';

interface Header {
	children: JSX.Element | JSX.Element[];
	title: string;
}

const headerStyle: React.CSSProperties = {
	width: '100%',
	overflow: 'hidden',
	marginTop: '6rem',
	marginBottom: '6rem',
};

const h1Style: React.CSSProperties = {
	marginTop: '0rem',
	marginBottom: '.25rem',
};

export const Header: React.FC<Header> = ({ children, title }) => {
	return (
		<header style={headerStyle}>
			<h1 style={h1Style}>{title}</h1>
			{children}
		</header>
	);
};
