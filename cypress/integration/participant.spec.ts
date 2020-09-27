describe('When setting the participants', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/home?tab=particpants');
  });

  it('should display participants component', () => {
    cy.get('[data-cy=component-participants]').should('have.length', 1);
  });

  it('should add participants', () => {
    cy.get('[data-cy=input-name]').type('Chandler');
    cy.get('[data-cy=input-phone]').type('01 23 45 67 89');

    cy.get('[data-cy=add-participant-button]').click();

    cy.get('[data-cy=input-name]').last().type('Monica');
    cy.get('[data-cy=input-phone]').last().type('0198765432');

    cy.get('[data-cy=add-participant-button]').click();

    cy.get('[data-cy=input-name]').last().type('Rachel');
    cy.get('[data-cy=input-phone]').last().type('01 89 23 47 56').blur();

    cy.get('[data-cy=participant-wrapper').should('have.length', 3);
  });

  it('should delete participant', () => {
    cy.get('[data-cy=input-name]').type('Joey');
    cy.get('[data-cy=input-phone]').type('0123456798');
    cy.get('[data-cy=add-participant-button]').click();

    cy.get('[data-cy=participant-wrapper').should('have.length', 2);
    cy.get('[data-cy=delete-participant-button]').first().click();
    cy.get('[data-cy=participant-wrapper').should('have.length', 1);
  });
});
