import { E } from '../../../../base/render_app/type.js';

export type IframeWidget<Ctx, State, Config> = {
  meta: { kind: 'iframe' },
  title: string,
  path: string,
  header?: E.Item | undefined;
};

export type ParentToChildMessage<Cfg, St> =
  | { kind: 'init' }
  | { kind: 'push-render', config: Cfg, state: St }
  | { kind: 'config', config: Cfg }
  | { kind: 'state', config: St };
