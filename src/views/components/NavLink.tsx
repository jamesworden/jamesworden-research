import { NavIcon } from './NavIcon';
import React from 'react';

interface NavLink {
	children: string;
	href: string;
}

const aStyle: React.CSSProperties = {
	float: 'left',
	display: 'block',
	color: '#f2f2f2',
	textAlign: 'center',
	textDecoration: 'none',
};

const liStyle: React.CSSProperties = {
	marginRight: '1rem',
};

export const NavLink: React.FC<NavLink> = ({ children, href }) => {
	return (
		<li style={liStyle}>
			<NavIcon />
			<a style={aStyle} href={href}>
				{children}
			</a>
		</li>
	);
};
