export type MenuItem =
  | [string, string, MenuItem[]]
  | [string, string];

export const DEFAULT_APP_ID: string;
export const menuStructure: MenuItem[];
