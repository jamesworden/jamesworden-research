class App {
  visit() {
    const uiUrl: string = Cypress.env('uiUrl')
    cy.visit(uiUrl)
  }
}

export const app = new App()
