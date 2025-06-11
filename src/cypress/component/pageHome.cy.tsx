import React from 'react'
import Home from "@/app/(pages)/page"
import "@/app/globals.css"

describe('<Home />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Home />)
  })
})