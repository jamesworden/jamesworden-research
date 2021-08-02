import * as React from 'react'

import {BLUE_GREEN, WHITE} from '../style-constants'
import {Container, Header, Map, Section} from '../components'
import {Point, Region, Route} from '../../model'

import {Layout} from '../Layout'

interface Map {
  route: Route
  detour: Route
  region: Region
  points: Point[]
  error: string
  userInput: string
}

const Field = ({children}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    }}>
    {children}
  </div>
)

export default class extends React.Component<Map> {
  render() {
    return (
      <Layout title="Map Playground">
        <Container>
          <Header title="Map">
            <p>
              Enter points to visualize on the map below. If no points are
              speficed, a sample route and region will be displayed. Click on
              the markers to see the data for each point.
            </p>
          </Header>
          <Section>
            <form>
              <Field>
                <label style={{marginRight: '1rem'}}>Points:</label>
                <input
                  style={{border: `1px solid ${BLUE_GREEN}`}}
                  placeholder={
                    this.props.userInput
                      ? this.props.userInput
                      : 'latitude,longitude|latitude,longitude|...'
                  }
                  value={this.props.userInput ? this.props.userInput : ''}
                  name="points"
                />
              </Field>
              <Field>
                <label style={{marginRight: '1rem'}}>
                  API key (required for point options):
                </label>
                <input style={{border: `1px solid ${BLUE_GREEN}`}} name="key" />
              </Field>
              <Field>
                <label style={{marginRight: '1rem'}}>Panorama Text</label>
                <input type="checkbox" name="panoramaText" value="true" />
              </Field>
              <Field>
                <label style={{marginRight: '1rem'}}>Panorama Id</label>
                <input type="checkbox" name="panoramaId" value="true" />
              </Field>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around'
                }}>
                <input
                  type="submit"
                  value="Search Points"
                  style={{
                    border: `1px solid ${BLUE_GREEN}`,
                    color: BLUE_GREEN,
                    backgroundColor: WHITE,
                    cursor: 'pointer',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    letterSpacing: '.2rem',
                    padding: '.5rem 2rem'
                  }}
                />
              </div>
            </form>
          </Section>
          <Section paddingTop={true}>
            {this.props.error ? <span>{this.props.error}</span> : <div />}
            <Map
              route={this.props.route}
              detour={this.props.detour}
              region={this.props.region}
              points={this.props.points}
              zoom={15}
            />
          </Section>
          {this.props.points ? (
            <Section paddingTop={true}>
              <h3>Points response as JSON output:</h3>
              <pre>{JSON.stringify(this.props.points, null, '\t')}</pre>
            </Section>
          ) : (
            <div />
          )}
        </Container>
      </Layout>
    )
  }
}
