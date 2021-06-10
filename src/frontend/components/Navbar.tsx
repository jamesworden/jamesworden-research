import { LIGHT_GREY, WHITE } from '../Colors';
import React, { ReactElement } from 'react';

import { Container } from './Container';
import { NavLink } from '../components/NavLink';
import { Ul } from './Ul';

interface Navbar {
	children: ReactElement<typeof NavLink>[];
}

const navStyle: React.CSSProperties = {
	width: '100%',
	overflow: 'hidden',
	borderBottom: `.05rem solid ${LIGHT_GREY}`,
	paddingBlock: '1rem',
	top: 0,
	position: 'sticky',
	backgroundColor: WHITE,
	zIndex: 1,
};

export const Navbar: React.FC<Navbar> = ({ children }) => {
	return (
		<nav style={navStyle}>
			<Container>
				<Ul>{children}</Ul>
			</Container>
		</nav>
	);
};
