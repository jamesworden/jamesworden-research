import React, { ReactElement } from 'react';

import { Container } from './Container';
import { FormattedList } from './FormattedList';
import { NavLink } from '../components/NavLink';

interface Navbar {
	children: ReactElement<typeof NavLink> | ReactElement<typeof NavLink>[];
}

const navStyle: React.CSSProperties = {
	width: '100%',
	overflow: 'hidden',
	backgroundColor: '#333',
	paddingBlock: '1rem',
};

export const Navbar: React.FC<Navbar> = ({ children }) => {
	return (
		<nav style={navStyle}>
			<Container>
				<FormattedList>{children}</FormattedList>
			</Container>
		</nav>
	);
};
