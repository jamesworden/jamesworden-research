import * as React from 'react';

import { A } from '../components/A';
import { Header } from '../components/Header';
import { Layout } from '../Layout';
import { Section } from '../components/Section';

interface Home {}

export default class extends React.Component<Home> {
	render() {
		return (
			<Layout title='Mitigate GPS Spoofing'>
				<Header title='Mitigate GPS Spoofing'>
					<span>Research with Dr. Erald Troja & James Worden</span>
				</Header>
				<Section>
					<p>
						Imagine you are driving a vehicle while following directions on your
						smartphone. There's been a breech of security, and a hacker has injected
						falsey directions within your routing application to lure you into unknown
						territory. How can we detect an attack like this?
					</p>
					<p>
						It is likely that such a deviation will go unnoticed by the driver. However,
						it is possible for cameras to observe the outside enviornment and use image
						data as another means of verifying that the directions of the route do not
						align with the provided destination address. These visual cues, specifically
						text on street signs, billboards, buildings, can be extracted and evaluated
						to ensure a driver arrives safely at their destination.
					</p>
					<p>
						Assuming this method of authentication works, it would function best in
						urban areas for several reasons:
						<ul>
							<li>
								Being surrounded by commercial structures ensures that vehicles will
								be surrounded by text at most points within the city.
							</li>
							<li>
								The advent of 5G allows for increased bandwith for sending image
								data to servers for processing.
							</li>
							<li>
								Ample concentrated data for a single enviornment will strenghten the
								measures of verifying if a detour is taking place.
							</li>
							<li>The highest crime rates are in urban areas.</li>
						</ul>
						Check out the <A href='/docs'>documentation</A> for related API's, the{' '}
						<A href='/schedule'>schedule</A> for seeing which features will be added to
						further our understanding of this topic, the{' '}
						<A href='https://github.com/jamesworden/jamesworden-research'>
							source code
						</A>{' '}
						to see how this webiste and the API's work under the hood, or keep reading
						below for a technical understanding of how we would approach implementing
						this idea.
					</p>
				</Section>
				<Section paddingTop={true}>
					<h2>Proof of Concept</h2>
					<p>
						Applying Google Cloud Vision OCR (optical character recognition) to Google
						Streetview images allows us to extract arrays of text from the street view
						at any relevant GPS coordinate.
					</p>
				</Section>
			</Layout>
		);
	}
}