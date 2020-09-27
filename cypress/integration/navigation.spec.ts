describe('When navigating in the app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should navigate with tabs', () => {
    cy.url().should('include', 'participants');
    cy.get('[data-cy=component-participants]').should('have.length', 1);

    cy.get('[data-cy=tab-title]').eq(1).click();
    cy.url().should('include', 'spendings');
    cy.get('[data-cy=component-spendings]').should('have.length', 1);

    cy.get('[data-cy=tab-title]').eq(2).click();
    cy.url().should('include', 'balance');
    cy.get('[data-cy=component-balance]').should('have.length', 1);

    cy.get('[data-cy=tab-title]').eq(0).click();
    cy.url().should('include', 'participants');
    cy.get('[data-cy=component-participants]').should('have.length', 1);
  });

  it('should save tab on refresh', () => {
    cy.get('[data-cy=tab-title]').eq(1).click();

    cy.url().should('include', 'spendings');
    cy.get('[data-cy=component-spendings]').should('have.length', 1);

    cy.reload();

    cy.url().should('include', 'spendings');
    cy.get('[data-cy=component-spendings]').should('have.length', 1);
  });
});
