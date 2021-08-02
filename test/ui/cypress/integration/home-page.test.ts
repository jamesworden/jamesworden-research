import {app} from '../models/app'
import {sampleRoute} from '../../../../src/json'

describe('Homepage', () => {
  before(() => {
    app.visit()
  })

  const {origin, destination, increment, distance} = sampleRoute

  it('Contains correct data', () => {
    cy.get('header h1').should('have.text', 'Environmental Text Extraction')
    cy.contains('span', 'Origin').should('contain.text', origin)
    cy.contains('span', 'Destination').should('contain.text', destination)
    cy.contains('span', 'Increment distance').should(
      'contain.text',
      `${increment} meters`
    )
    cy.contains('span', 'Distance')
      .should('have.length', 1) // Capital 'd' should not select 'increment distance' span
      .last()
      .should('contain.text', `${distance} meters`)
    cy.get('#map').should('be.visible')
    cy.get('footer')
      .should('contain.text', 'James Worden')
      .should('contain.text', new Date().getFullYear().toString())
  })

  it('Marker info window displays point data', () => {
    cy.get('#map').find('div[role="dialog"]').should('not.exist')
    cy.get('#map').find('div[role="button"]').first().click()
    cy.get('#map').find('div[role="dialog"]').should('be.visible')
    cy.get('#map').find('div[role="dialog"]').find('button').click()
    cy.get('#map').find('div[role="dialog"]').should('not.exist')
  })
})
