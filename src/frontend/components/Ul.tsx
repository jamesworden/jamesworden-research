import * as React from 'react';

interface Ul {
	children: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
}

const ulStyle: React.CSSProperties = {
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'flex',
	flexDirection: 'row',
};

export const Ul: React.FC<Ul> = ({ children }) => {
	return <ul style={ulStyle}>{children}</ul>;
};
