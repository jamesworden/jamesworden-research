import * as React from 'react';

import { A } from './components/A';
import { Container } from './components/Container';
import { FOOTER_HEIGHT } from './StyleConstants';
import { Footer } from './components/Footer';
import { NavLink } from './components/NavLink';
import { Navbar } from './components/Navbar';

interface Layout {
	title: string;
	children: JSX.Element | Array<JSX.Element>;
}

const bodyStyle: React.CSSProperties = {
	fontFamily: 'neue-haas-grotesk-display',
	margin: 0,
	padding: 0,
	position: 'relative',
	minHeight: '100vh',
};

const contentStyle: React.CSSProperties = {
	paddingBottom: FOOTER_HEIGHT,
};

export const Layout: React.FC<Layout> = ({ children, title }) => {
	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel='stylesheet' href='https://use.typekit.net/tbs8oug.css' />
				<meta name='viewport' content='width=device-width, initial-scale=1'></meta>
			</head>
			<body style={bodyStyle}>
				<Navbar>
					<NavLink href='/'>Home</NavLink>
					<NavLink href='/docs'>Docs</NavLink>
					<NavLink href='/schedule'>Schedule</NavLink>
					<NavLink href='https://github.com/jamesworden/jamesworden-research'>
						Source Code
					</NavLink>
				</Navbar>
				<div style={contentStyle}>
					<Container>{children}</Container>
				</div>
				<Footer>
					<A href='https://www.jamesworden.com/'>
						James Worden &copy; {new Date().getFullYear().toString()}
					</A>
				</Footer>
			</body>
		</html>
	);
};
