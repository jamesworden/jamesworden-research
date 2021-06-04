// import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

// import { Helmet } from 'react-helmet';
// import { Home } from './Home';
// import { NavLink } from './components/NavLink';
// import { Navbar } from './components/Navbar';
// import React from 'react';

// interface index {}

// export const index: React.FC<index> = ({}) => {
// 	function initMap() {
// 		console.log('test');
// 	}

// 	return (
// 		<>
// 			<Helmet>
// 				<title>Mitigate GPS Spoofing</title>
// 				<link rel='stylesheet' href='https://use.typekit.net/tbs8oug.css' />
// 				<script
// 					async
// 					defer
// 					src='https://maps.googleapis.com/maps/api/js?key=<%= GOOGLE_MAPS_API_KEY %>&map_ids=b07d0e4dc4f381fb&libraries=places&callback=initMap'
// 				></script>
// 			</Helmet>
// 			<Router>
// 				<div>
// 					<Navbar>
// 						<NavLink to='/hello'>Hello</NavLink>
// 						<NavLink to='/test'>Test</NavLink>
// 						<NavLink href='https://github.com/jamesworden/jamesworden-research'>
// 							Source Code
// 						</NavLink>
// 					</Navbar>
// 					<Switch>
// 						<Route path='/'>
// 							<Home />
// 						</Route>
// 					</Switch>
// 				</div>
// 			</Router>
// 		</>
// 	);
// };

import * as React from 'react';

interface Props {
	msg: string;
}

export default class extends React.Component<Props> {
	render() {
		return <h1>{this.props.msg}</h1>;
	}
}
