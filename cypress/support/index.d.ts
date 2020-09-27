declare namespace Cypress {
  interface Chainable {
    setLocalStorage(key: string, value: string);
    getLocalStorage(key: string);
  }
}
