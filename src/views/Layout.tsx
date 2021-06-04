import * as React from 'react';

import { NavLink } from './components/NavLink';
import { Navbar } from './components/Navbar';

interface Layout {
	title: string;
}

export const Layout: React.FC<Layout> = ({ children, title }) => {
	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel='stylesheet' href='https://use.typekit.net/tbs8oug.css' />
				{/* <link rel='stylesheet' href='global.css' /> */}
			</head>
			<body>
				<Navbar>
					<NavLink href='/hello'>Hello</NavLink>
					<NavLink href='/test'>Test</NavLink>
					<NavLink href='https://github.com/jamesworden/jamesworden-research'>
						Source Code
					</NavLink>
				</Navbar>
				{children}
				<footer>James Worden &copy; {new Date().getFullYear}</footer>
			</body>
		</html>
	);
};
