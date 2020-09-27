describe('When consulting the balance', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.fixture('spending/initial-state.json').then((initialState) => {
      cy.setLocalStorage('appState', JSON.stringify(initialState));
      cy.visit('/home?tab=balance');
    });
  });

  it('should display balance component', () => {
    cy.get('[data-cy=component-balance]').should('have.length', 1);
  });

  /* This page should be unit tested */
});
