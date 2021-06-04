import { NavIcon } from './NavIcon';
import React from 'react';

interface NavLink {
	children: string;
	href: string;
}

export const NavLink: React.FC<NavLink> = ({ children, href }) => {
	return (
		<li>
			<NavIcon />
			<a href={href}>{children}</a>
		</li>
	);
};
