import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

interface RouterNavLink {
	children: string;
	to: string;
	href?: never;
}
interface ATagNavLink {
	children: string;
	href: string;
	to?: never;
}
type NavLink = RouterNavLink | ATagNavLink;

const Li = styled.li``;

export const NavLink: React.FC<NavLink> = ({ to, children, href }) => {
	return (
		<Li>
			{href ? (
				<a href={to}>{children}</a>
			) : to ? (
				<Link to={to}>{children}</Link>
			) : (
				<Link to='/'>{children}</Link>
			)}
		</Li>
	);
};
