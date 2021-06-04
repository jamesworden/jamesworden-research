import React from 'react';

interface NavIcon {}

export const NavIcon: React.FC<NavIcon> = ({}) => {
	return (
		<svg
			stroke='black'
			fill='black'
			stroke-width='0'
			viewBox='0 0 18 18'
			height='1em'
			width='1em'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path d='M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z'></path>
		</svg>
	);
};
