import {app} from '../models/app'

describe('Homepage displays correct data', () => {
  it('Contains correct title and subtitle', () => {
    app.visit()
    cy.get('header h1').should('have.text', 'Mitigate GPS Spoofing')
    cy.get('header span').should('have.text', 'Research with James Worden')
  })
})
