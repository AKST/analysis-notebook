// @ts-nocheck - refer to template

export const Toggleable = Base => class extends Base {
  #open = false;

  get open() {
    return this.#open;
  }

  toggleMenu() {
    this.showMenu(!this.#open);
  }

  showMenu(show) {
    if (show) {
      this.internals.states.add('open');
    } else {
      this.internals.states.delete('open');
    }
    this.#open = show;
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: show } }));
  }

  closeMenu() {
    this.showMenu(false);
  }
}
