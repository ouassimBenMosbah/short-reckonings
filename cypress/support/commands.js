Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((window) => {
    window.localStorage.setItem(key, value);
  });
});

Cypress.Commands.add('getLocalStorage', (key) => {
  cy.window().then((window) => {
    window.localStorage.getItem(key);
  });
});
