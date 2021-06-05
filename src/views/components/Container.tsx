import * as React from 'react';

interface Container {
	children: JSX.Element | Array<JSX.Element>;
}

const divStyle: React.CSSProperties = {
	maxWidth: '50rem',
	margin: 'auto',
};

export const Container: React.FC<Container> = ({ children }) => {
	return <div style={divStyle}>{children}</div>;
};
