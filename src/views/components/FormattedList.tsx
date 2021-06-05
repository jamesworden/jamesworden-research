import * as React from 'react';

interface FormattedList {
	children: JSX.Element | Array<JSX.Element>;
}

const ulStyle: React.CSSProperties = {
	listStyle: 'none',
	margin: 0,
	padding: 0,
	display: 'flex',
	flexDirection: 'row',
};

export const FormattedList: React.FC<FormattedList> = ({ children }) => {
	return <ul style={ulStyle}>{children}</ul>;
};
