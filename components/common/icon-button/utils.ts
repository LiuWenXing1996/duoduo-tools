import type { ButtonProps } from "naive-ui";

export enum IconButtonType {
  "form-label-action",
}

export type IconButtonConfig = {
  icon?: SvgIconComponentProps;
  button?: ButtonProps;
  tooltipWrapper?: CommonTooltipWrapperComponentProps;
};

export const defaultTypes: Record<IconButtonType, IconButtonConfig> = {
  [IconButtonType["form-label-action"]]: {
    button: {
      strong: true,
      secondary: true,
      circle: true,
      size: "tiny",
    },
    tooltipWrapper: {
      tooltip: {
        keepAliveOnHover: false,
      },
    },
  },
};
