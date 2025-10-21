import { E } from '../../../../base/dom_app/type.js';

export type RemoteWidget<Ctx, State, Config, Event> = {
  meta: { kind: 'remote' },
  title: string,
  source: RemoteVariant,
  header?: E.Item | undefined;
  initialise?(): Generator<any>;
  normaliseSend?(message: ParentToChildMessage<Config, State>): Generator<any>;
  normaliseRecv?(message: any): Generator<NormalisedRecv<Event>>;
};

export type IframeAttrs = Record<'scrolling', string>;

export type RemoteVariant =
  | { kind: 'worker', src: string }
  | { kind: 'iframe', src: string, attrs?: IframeAttrs }

export type RemoteConnection =
  | { kind: 'worker', worker: Worker }
  | { kind: 'iframe', iframe: HTMLIFrameElement }

export type NormalisedRecv<E> =
  | ['dispatch', E]
  | ['reply', any];

export type ParentToChildMessage<Cfg, St> =
  | { kind: 'push', config: Cfg, state: St }
