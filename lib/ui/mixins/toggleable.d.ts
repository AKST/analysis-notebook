/**
 * Interface for toggleable functionality
 */
export interface ToggleableMixin {
  open: boolean;
  toggleMenu(): void;
  showMenu(show: boolean): void;
  closeMenu(): void;
}

/**
 * Constructor type for the base class
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Mixin function that adds toggleable functionality to a base class
 * @template T - The base class type
 * @param BaseClass - The base class constructor
 * @returns A new class that extends the base class with toggleable functionality
 */
export function Toggleable<T extends Constructor>(
  BaseClass: T
): T & Constructor<ToggleableMixin>;
