import * as React from 'react';

import { Container } from './Container';
import { FOOTER_HEIGHT } from '../StyleConstants';

interface Footer {
	children: JSX.Element | JSX.Element[];
}

const footerStyles: React.CSSProperties = {
	position: 'absolute',
	bottom: 0,
	width: '100%',
	height: FOOTER_HEIGHT,
	display: 'grid',
	justifyContent: 'center',
	alignContent: 'center',
};

export const Footer: React.FC<Footer> = ({ children }) => {
	return (
		<footer style={footerStyles}>
			<Container>{children}</Container>
		</footer>
	);
};
