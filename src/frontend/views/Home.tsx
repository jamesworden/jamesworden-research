import * as React from 'react'

import {A} from '../components/A'
import {Header} from '../components/Header'
import {Hr} from '../components/Hr'
import {Layout} from '../Layout'
import {Map} from '../components/map/Map'
import {Route} from '../../model/route'
import {Section} from '../components/Section'

interface Home {
  route: Route
}

const horizontalFlex: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
}

const verticalFlex: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
}

export default class extends React.Component<Home> {
  render() {
    return (
      <Layout title="Mitigate GPS Spoofing">
        <Header title="Mitigate GPS Spoofing">
          <span>Research with James Worden</span>
        </Header>
        <Section>
          <p>
            Imagine you are driving a vehicle while following directions on your
            smartphone. There's been a breech of security, and a hacker has
            injected falsey directions within your routing application to lure
            you into unknown territory. How can we detect an attack like this?
          </p>
          <p>
            It is likely that such a deviation will go unnoticed by the driver.
            However, it is possible for cameras to observe the outside
            enviornment and use image data as another means of verifying that
            the directions of the route do not align with the provided
            destination address. These visual cues, specifically text on street
            signs, billboards, and buildings, can be extracted and evaluated to
            ensure a driver arrives safely at their destination.
          </p>
          <p>
            Assuming this method of authentication works, it would function best
            in urban areas for several reasons:
            <ul>
              <li>
                Being surrounded by commercial structures ensures that vehicles
                will be surrounded by text at most points within the city.
              </li>
              <li>
                The advent of 5G allows for increased bandwith for sending image
                data to servers for processing.
              </li>
              <li>
                Ample concentrated data for a single enviornment will strenghten
                the measures of verifying if a detour is taking place.
              </li>
              <li>The highest crime rates are in urban areas.</li>
            </ul>
            Check out the <A href="/docs">documentation</A> for related API's,
            the{' '}
            <A href="https://github.com/users/jamesworden/projects/5">
              backlog
            </A>{' '}
            for seeing which features will be added to further our understanding
            of this topic, or the{' '}
            <A href="https://github.com/jamesworden/jamesworden-research">
              source code
            </A>{' '}
            to see how this webiste and the API's work under the hood.
          </p>
        </Section>
        <Section paddingTop={true}>
          <h2>Proof of Concept</h2>
          <p>
            Applying Google Cloud Vision OCR (optical character recognition) to
            Google Streetview images allows us to extract text from the street
            view at any relevant GPS coordinate. Below is a map that displays
            real text data at points along a given route. This 'Route' was
            obtained from our <A href="/docs#route">Route API</A>. Hover over
            the points along the map to observe the text found at each point.
          </p>
          <Hr />
        </Section>
        <Section paddingTop={true}>
          <div style={verticalFlex}>
            <div style={horizontalFlex}>
              <span>
                <strong>Origin:</strong> {this.props.route.origin}
              </span>
              <span>
                <strong>Destination:</strong> {this.props.route.destination}
              </span>
            </div>
            <div style={horizontalFlex}>
              <span>
                <strong>Distance:</strong>{' '}
                {`${this.props.route.distance} meters`}
              </span>
              <span>
                <strong>Increment distance:</strong>{' '}
                {`${this.props.route.increment} meters`}
              </span>
            </div>
          </div>
        </Section>
        <Section paddingTop={true}>
          <Map points={this.props.route.points} />
        </Section>
      </Layout>
    )
  }
}
