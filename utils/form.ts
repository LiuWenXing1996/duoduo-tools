import { type FormItemProps, type FormItemRule } from "naive-ui";
import { assign, isFunction } from "radash";
import type { DeepPartial } from "ts-essentials";

export type DefineFromItemPropsConfig = {
  label: string;
  path: string;
  rules?:
    | (FormItemRule | undefined)[]
    | ((config: DefineFromItemPropsConfig) => (FormItemRule | undefined)[]);
};

export const defineFromItemProps = (
  config: DefineFromItemPropsConfig,
  custom?: DeepPartial<FormItemProps>
): FormItemProps => {
  const configProps: FormItemProps = {
    label: config.label,
    path: config.path,
    rule: [],
  };
  if (config.rules) {
    let rules: (FormItemRule | undefined)[] = [];
    if (isFunction(config.rules)) {
      rules = config.rules(config) || [];
    } else {
      rules = config.rules;
    }
    configProps.rule = filterNullable(rules);
  }
  const newVal = assign<FormItemProps>(
    configProps,
    (custom || {}) as FormItemProps
  );
  return newVal;
};

export const defineFromItemPropsMap = <T extends Record<string, unknown>>(
  map: Record<
    keyof T,
    {
      config: Omit<DefineFromItemPropsConfig, "path">;
      custom?: DeepPartial<FormItemProps>;
    }
  >,
  common?: DeepPartial<FormItemProps>
): Record<keyof T, FormItemProps> => {
  const keys = Object.keys(map);
  const res: Record<string, FormItemProps> = {};
  keys.map((key) => {
    const options = map[key];
    const custom = assign<DeepPartial<FormItemProps>>(
      common || {},
      (options.custom || {}) as FormItemProps
    );
    res[key] = defineFromItemProps(
      { ...options.config, path: key },
      { ...custom }
    );
  });
  return res as Record<keyof T, FormItemProps>;
};

export const allFormItemTrigger = ["input", "change", "blur", "focus"];
