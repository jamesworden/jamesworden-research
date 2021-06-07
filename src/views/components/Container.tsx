import * as React from 'react';

interface Container {
	children: JSX.Element | Array<JSX.Element>;
}

const divStyle: React.CSSProperties = {
	maxWidth: '50rem',
	margin: 'auto',
	paddingLeft: '1rem',
	paddingRight: '1rem',
};

export const Container: React.FC<Container> = ({ children }) => {
	return <div style={divStyle}>{children}</div>;
};
