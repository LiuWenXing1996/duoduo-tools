const key = Symbol() as InjectionKey<Ref<string>>;

export const useToolRenderInjectHelper = () => {
  const _inject = () => {
    return inject(key);
  };
  const _provide = (val: Ref<string>) => {
    return provide(key, val);
  };
  return {
    inject: _inject,
    provide: _provide,
  };
};
