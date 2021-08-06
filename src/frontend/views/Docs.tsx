import * as React from 'react'

import {Container, Header, Section} from '../components'

import {Layout} from '../Layout'
import SyntaxHighlighter from 'react-syntax-highlighter'

interface Docs {}

export default class extends React.Component<Docs> {
  render() {
    return (
      <Layout title="Docs">
        <Container>
          <Header title="Docs">
            <span>
              Add a <strong>sample</strong> query parameter to fetch a sample
              response for any API. Note that GPS coordinates should be written
              in the format{' '}
              <strong>Latitude,Longitude|Latitude,Longitude|...</strong>.
            </span>
          </Header>
          <Section paddingTop>
            <h2>Point API</h2>
            <span>Returns data for a specified GPS coordinate</span>
            <SyntaxHighlighter>
              const url = "https://research.jamesworden.com/api/v1/point"
            </SyntaxHighlighter>
            <p>
              Required parameters:
              <ul>
                <li>
                  <strong>Location</strong>: GPS Coordinate
                </li>
              </ul>
            </p>
            <p>
              Optional parameters:
              <ul>
                <li>
                  <strong>PanoramaText</strong>: Boolean value indicating
                  whether to add text from the outside environment at that
                  location point
                </li>
                <li>
                  <strong>PanoramaId</strong>: Boolean value indicating whether
                  to add a Panorama Id corresponding to the Google Image fetched
                  at the specified location
                </li>
              </ul>
            </p>
          </Section>
          <Section paddingTop>
            <h2>Report API</h2>
            <span>
              Returns a comparison between a route and detour of that route
              intersecting specified waypoints.
            </span>
            <SyntaxHighlighter>
              const url = "https://research.jamesworden.com/api/v1/report"
            </SyntaxHighlighter>
            <p>
              Required parameters:
              <ul>
                <li>
                  <strong>Origin</strong>: GPS Coordinate marking beginning of
                  route
                </li>
                <li>
                  <strong>Destination</strong>: GPS Coordinate marking end of
                  route
                </li>
                <li>
                  <strong>Waypoints</strong>: array of waypoints that a detour
                  will be created for
                </li>
              </ul>
            </p>
            <p>
              Optional parameters:
              <ul>
                <li>
                  <strong>Increment</strong>: number of meters between each
                  point
                </li>
              </ul>
            </p>
          </Section>
          <Section paddingTop>
            <h2>Route API</h2>
            <span>
              Returns an array of incremental GPS coordinates between an origin
              and destionation address with additional statistical information.
            </span>
            <SyntaxHighlighter>
              const url = "https://research.jamesworden.com/api/v1/route"
            </SyntaxHighlighter>
            <p>
              Required parameters:
              <ul>
                <li>
                  <strong>Origin</strong>: GPS Coordinate marking beginning of
                  route
                </li>
                <li>
                  <strong>Destination</strong>: GPS Coordinate marking end of
                  route
                </li>
              </ul>
            </p>
            <p>
              Optional parameters:
              <ul>
                <li>
                  <strong>Increment</strong>: number of meters between each
                  point
                </li>
                <li>
                  <strong>Waypoints</strong>: array of waypoints that a detour
                  will be created for
                </li>
                <li>
                  <strong>PanoramaText</strong>: Boolean value indicating
                  whether to add text from the outside environment at points
                  along the route
                </li>
                <li>
                  <strong>PanoramaId</strong>: Boolean value indicating whether
                  to add a Panorama Id corresponding to the Google Image fetched
                  at points along the route
                </li>
              </ul>
            </p>
          </Section>
        </Container>
      </Layout>
    )
  }
}
