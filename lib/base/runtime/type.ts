import { DocumentWidget } from './widget/document/type.js'
import { RemoteWidget } from './widget/remote/type.js'
import { RenderWidgetMeta, RenderWidget, RenderContextInit } from './widget/canvas/type.ts';
import { E } from '../../base/render_app/type.js'

export {
  DocumentWidget,
  RemoteWidget,
  RenderWidgetMeta,
  RenderContextInit,
}

export { WidgetChild as Widget };

export type WidgetHud = {
  header?: E.Item
};

export type WidgetSize = { height?: number, gridColumn?: GridColumnCfg };
export type RenderStrategy = 'frame' | 'event';
export type ScalingStrategy = 'fluid' | 'fixed';

export type WidgetAnchor = {
  title: string,
  titleId: string,
  titleLevel: number,
}

export interface WidgetRunner<State, Config> {
  scalingStrategy: ScalingStrategy;
  constructor: {
    renderStrategy: RenderStrategy;
  };
  module: WidgetChild<unknown, State, Config>;
  initialize(onEvent: (event: unknown) => void): void;
  render(config: Config, state: State): void;
  resize(newWidth: number, newHeight?: number): void;
  cleanup?(): void;
  setStyle(styles: Record<string, string | null>): void;
  getHUD(): WidgetHud
  getAnchors(): WidgetAnchor[];
}


export type ModuleCommon<State, Config, Event> = {
  getConfig?(): any;
  createState?(cfg: Config): State;
  onUpdate?(state: State, event: Event): State;
};

export type MultiModule<State, Config, Event> = {
  meta: {
    kind: 'multi',
    layout?: {
      gridTemplateColumns?: string[],
      breakpoints?: Record<string, number>,
    },
  };
  createStyle?(): Record<string, any>;
  children: WidgetChild<any, State, Config, Event>[];
} & ModuleCommon<State, Config, Event>;


export type SingleModule<Ctx, State, Config, Event> =
    Exclude<Module<Ctx, State, Config, Event>, { meta: { kind: 'multi' } }>;

export type Module<Ctx, State, Config, Event> =
  | RemoteModule<Ctx, State, Config, Event>
  | DocumentModule<Ctx, State, Config, Event>
  | RenderModule<Ctx, State, Config, Event>
  | MultiModule<State, Config, Event>;

export type RemoteModule<Ctx, State, Config, Event> =
  & RemoteWidget<Ctx, State, Config, Event>
  & ModuleCommon<State, Config, Event>;

export type RenderModule<Ctx, State, Config, Event> =
  & RenderWidget<Ctx, State, Config>
  & ModuleCommon<State, Config, Event>;

export type DocumentModule<Ctx, State, Config, Event> =
  & DocumentWidget<Ctx, State, Config>
  & ModuleCommon<State, Config, Event>;;



export type WidgetChild<Ctx, State, Config, Event = any> = (
  | Omit<DocumentChildWidget<Ctx, State, Config>, 'createStyle'>
  | RemoteWidget<Ctx, State, Config, Event>
  | RenderChildWidget<Ctx, State, Config>
) & ({
  size?: WidgetSize,
});

export type RenderChildWidget<Ctx, State, Config> =
  & RenderWidget<Ctx, State, Config>;

export type DocumentChildWidget<Ctx, State, Config> =
  & DocumentWidget<Ctx, State, Config>;

export type RemoteChildWidget<Ctx, State, Config, Event> =
  & RemoteWidget<Ctx, State, Config, Event>;

type GridColumnCfg = { default: number } & Record<string, number>;

export type ChildWidgetParam = {
  container: HTMLElement,
  containerId: string,
  viewportWidth: number,
  viewportHeight?: number,
};

export type WidgetFactory = {
  create<S, C, E>(module: WidgetChild<any, S, C, E>, config: ChildWidgetParam): WidgetRunner<S, C>;
}

