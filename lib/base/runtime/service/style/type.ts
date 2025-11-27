export interface StyleService {
  installStyleSheet(r: StyleRequest.Install): Promise<void>;
  uninstallStyleSheet(r: StyleRequest.Uninstall): Promise<void>;
}

export namespace StyleRequest {
  export type Install = { url: string };
  export type Uninstall = { url: string };
}

