import React, { ReactElement } from 'react';

import { NavLink } from '../components/NavLink';

interface Navbar {
	children: ReactElement<typeof NavLink> | ReactElement<typeof NavLink>[];
}

const ulStyle: React.CSSProperties = {
	listStyle: 'none',
	margin: 0,
	padding: 0,
};

export const Navbar: React.FC<Navbar> = ({ children }) => {
	return (
		<nav>
			<ul style={ulStyle}>{children}</ul>
		</nav>
	);
};
