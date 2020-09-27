describe('When setting the spendings', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.fixture('spending/initial-state.json').then((initialState) => {
      cy.setLocalStorage('appState', JSON.stringify(initialState));
      cy.visit('/home?tab=spendings');
    });
  });

  it('should display spendings component', () => {
    cy.get('[data-cy=component-spendings]').should('have.length', 1);
  });

  it('should add a spending', () => {
    cy.get('[data-cy=add-spending-button]').click();
    cy.get('[data-cy=spending-wrapper]').should('have.length', 4);
    cy.get('[data-cy=spending-label-input')
      .last()
      .type('Flower')
      .tab()
      .type('50')
      .tab()
      .type('Mon{downarrow}{enter}')
      .tab()
      .type('{downarrow}{downarrow}{enter}')
      .tab()
      .blur();

    cy.fixture('spending/final-state.json').then((finalState) => {
      expect(localStorage.getItem('appState')).to.equal(JSON.stringify(finalState));
    });
  });

  it('should delete a spending', () => {
    cy.fixture('spending/final-state.json').then((finalState) => {
      cy.setLocalStorage('appState', JSON.stringify(finalState));
      cy.reload();
      cy.get('[data-cy=delete-spending-button]').last().click();
      cy.get('[data-cy=spending-wrapper]').should('have.length', 3);

      cy.fixture('spending/initial-state.json').then((initialState) => {
        expect(localStorage.getItem('appState')).to.equal(JSON.stringify(initialState));
      });
    });
  });
});
