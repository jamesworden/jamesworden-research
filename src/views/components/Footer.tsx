import * as React from 'react';

import { Container } from './Container';
import { FormattedList } from './FormattedList';

interface Footer {
	children: string;
}

export const Footer: React.FC<Footer> = ({ children }) => {
	return (
		<footer>
			<Container>
				<FormattedList>
					<li>
						{children} &copy; {new Date().getFullYear().toString()}
					</li>
				</FormattedList>
			</Container>
		</footer>
	);
};
