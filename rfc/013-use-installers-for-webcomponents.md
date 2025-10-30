# RFC 13 use installers for web components

Here is a example.

```ts
export class SpecialButton extends HTMLElement {
  constructor(a, b, onRequestServiceCall, c, d) {
    super(); // Still need to call parameterless super() first
    this.onRequestServiceCall = onRequestServiceCall;
    // handle a, b, c, d
  }
}

export function createSpecialButton({ service }) {
  const onRequestServiceCall = () => service.call();
  const SpecialButtonImpl = class extends SpecialButton {
    constructor(a, b, c, d) {
      super(a, b, onRequestServiceCall, c, d);
    }
  }
  customElements.define('special-button', SpecialButtonImpl);
  return SpecialButtonImpl;
}
```

We should do this when we need to inject a dependency. Anything that depends on the factories output should likewise have a factory.

```js
export class SpecialButtonUser extends HTMLElement {
  constructor(a, b, SpecialButton, c, d) {
    super(); // Still need to call parameterless super() first
    this.SpecialButton = SpecialButton;
    // handle a, b, c, d
  }
}

export function createSpecialButtonUser({ SpecialButton }) {
  const SpecialButtonUserImpl = class extends SpecialButton {
    constructor(a, b, c, d) {
      super(a, b, SpecialButton, c, d);
    }
  }
  customElements.define('special-button-user', SpecialButtonUserImpl);
  return SpecialButtonUserImpl;
}
```
