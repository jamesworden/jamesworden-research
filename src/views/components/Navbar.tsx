import React, { ReactElement } from 'react';

import { NavLink } from '../components/NavLink';

interface Navbar {
	children: ReactElement<typeof NavLink> | Array<ReactElement<typeof NavLink>>;
}

export const Navbar: React.FC<Navbar> = ({ children }) => {
	return <nav>{children}</nav>;
};
