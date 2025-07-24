// @ts-nocheck
const { TextEncoder, TextDecoder } = require('util');

// Add missing globals that JSDOM needs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.customElements = dom.window.customElements;

// Override HTMLElement to be more permissive for testing
const OriginalHTMLElement = dom.window.HTMLElement;
global.HTMLElement = class HTMLElement extends OriginalHTMLElement {
  constructor() {
    // Skip the custom element registry check for tests
    super();
  }
  
  attachShadow(options) {
    this.shadowRoot = {
      appendChild: jest.fn(),
      querySelector: jest.fn(),
      addEventListener: jest.fn(),
      innerHTML: '',
    };
    return this.shadowRoot;
  }
};
