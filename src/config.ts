import { computed, inject, type ComputedRef, type InjectionKey } from 'vue';
import { enUS, zhCN, type UiMessages, type UiMessageKey } from './locales';
export interface UiConfig {
  locale: string;
  messages: Partial<UiMessages>;
  timeZone: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir: 'ltr' | 'rtl';
  theme?: string;
  mode?: 'light' | 'dark';
}
export interface UiContext {
  config: ComputedRef<UiConfig>;
  portalTarget: ComputedRef<HTMLElement | string>;
}
export const uiConfigKey: InjectionKey<UiContext> = Symbol('gp-ui-config');
const defaults: UiContext = {
  config: computed(() => ({
    locale: 'en-US',
    messages: {},
    timeZone: 'UTC',
    weekStartsOn: 0,
    dir: 'ltr',
  })),
  portalTarget: computed(() => 'body'),
};
export function useUiConfig() {
  const context = inject(uiConfigKey, defaults);
  const config = context.config;
  const locale = computed(() => config.value.locale);
  function tr(key: UiMessageKey, params: Record<string, string | number> = {}) {
    const builtIn = locale.value.toLowerCase().startsWith('zh') ? zhCN : enUS;
    const template = config.value.messages[key] ?? builtIn[key];
    return template.replace(/\{(\w+)\}/g, (match, key: string) => String(params[key] ?? match));
  }
  return {
    ...context,
    locale,
    tr,
    timeZone: computed(() => config.value.timeZone),
    weekStartsOn: computed(() => config.value.weekStartsOn),
    formatDate: (value: Date, options: Intl.DateTimeFormatOptions = {}) =>
      new Intl.DateTimeFormat(locale.value, { timeZone: config.value.timeZone, ...options }).format(
        value,
      ),
  };
}
