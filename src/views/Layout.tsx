import * as React from 'react';

import { Container } from './components/Container';
import { Footer } from './components/Footer';
import { NavLink } from './components/NavLink';
import { Navbar } from './components/Navbar';

interface Layout {
	title: string;
	children: JSX.Element | Array<JSX.Element>;
}

const bodyStyle: React.CSSProperties = {
	fontFamily: 'neue-haas-grotesk-display',
};

export const Layout: React.FC<Layout> = ({ children, title }) => {
	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel='stylesheet' href='https://use.typekit.net/tbs8oug.css' />
			</head>
			<body style={bodyStyle}>
				<Navbar>
					<NavLink href='/hello'>Hello</NavLink>
					<NavLink href='/test'>Test</NavLink>
					<NavLink href='https://github.com/jamesworden/jamesworden-research'>
						Source Code
					</NavLink>
				</Navbar>
				<Container>{children}</Container>
				<Footer>James Worden</Footer>
			</body>
		</html>
	);
};
