export type CronOptions = {
  second?: CronSecondOptions;
  minute: CronMinuteOptions;
  hour: CronHourOptions;
  day: CronDayOptions;
  month: CronMonthOptions;
  week: CronWeekOptions;
};
export type CronSecondOptions =
  | {
      type: "per";
    }
  | {
      type: "interval";
      interval: {
        start: number;
        end: number;
      };
    }
  | {
      type: "start-per";
      startPer: {
        start: number;
        per: number;
      };
    }
  | {
      type: "list";
      list: number[];
    };

export const cronSecondGen = (options: CronSecondOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "start-per":
      return `${options.startPer.start}/${options.startPer.per}`;
    case "list":
      if (options.list.length <= 0) {
        throw new Error("Invalid CronHourOptions list");
      }
      return options.list.join(",");
    default:
      throw new Error("Invalid CronSecondOptions type");
  }
};

export type CronMinuteOptions =
  | {
      type: "per";
    }
  | {
      type: "interval";
      interval: {
        start: number;
        end: number;
      };
    }
  | {
      type: "start-per";
      startPer: {
        start: number;
        per: number;
      };
    }
  | {
      type: "list";
      list: number[];
    };

export const cronMinuteGen = (options: CronMinuteOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "start-per":
      return `${options.startPer.start}/${options.startPer.per}`;
    case "list":
      if (options.list.length <= 0) {
        return "*";
      }
      return options.list.join(",");
    default:
      throw new Error("Invalid CronMinuteOptions type");
  }
};

export type CronHourOptions =
  | { type: "per" }
  | { type: "interval"; interval: { start: number; end: number } }
  | { type: "start-per"; startPer: { start: number; per: number } }
  | { type: "list"; list: number[] };

export const cronHourGen = (options: CronHourOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "start-per":
      return `${options.startPer.start}/${options.startPer.per}`;
    case "list":
      if (options.list.length <= 0) {
        throw new Error("Invalid CronHourOptions type");
      }
      return options.list.join(",");
    default:
      throw new Error("Invalid CronHourOptions type");
  }
};

export type CronDayOptions =
  | { type: "per" }
  | { type: "none" }
  | { type: "interval"; interval: { start: number; end: number } }
  | { type: "start-per"; startPer: { start: number; per: number } }
  | { type: "work"; work: number }
  | { type: "last" }
  | { type: "list"; list: number[] };

export const cronDayGen = (options: CronDayOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "none":
      return "?";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "start-per":
      return `${options.startPer.start}/${options.startPer.per}`;
    case "work":
      return `${options.work}W`;
    case "last":
      return "L";
    case "list":
      return options.list.join(",");
    default:
      throw new Error("Invalid CronDayOptions type");
  }
};

export type CronMonthOptions =
  | {
      type: "per";
    }
  | {
      type: "interval";
      interval: {
        start: number;
        end: number;
      };
    }
  | {
      type: "start-per";
      startPer: {
        start: number;
        per: number;
      };
    }
  | {
      type: "list";
      list: number[];
    };

export const cronMonthGen = (options: CronMonthOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "start-per":
      return `${options.startPer.start}/${options.startPer.per}`;
    case "list":
      return options.list.join(",");
    default:
      throw new Error("Invalid CronMonthOptions type");
  }
};

export type CronWeekOptions =
  | { type: "per" }
  | { type: "none" }
  | { type: "interval"; interval: { start: number; end: number } }
  | { type: "week"; week: { weekNo: number; weekVal: number } }
  | { type: "last"; last: number }
  | { type: "list"; list: number[] };

export const cronWeekGen = (options: CronWeekOptions): string => {
  switch (options.type) {
    case "per":
      return "*";
    case "none":
      return "?";
    case "interval":
      return `${options.interval.start}-${options.interval.end}`;
    case "week":
      return `${options.week.weekVal}#${options.week.weekNo}`;
    case "last":
      return `${options.last}L`;
    case "list":
      return options.list.join(",");
    default:
      throw new Error("Invalid CronWeekOptions type");
  }
};

export const cronGenerator = (
  options: CronOptions,
  config: {
    length: number;
  }
) => {
  const { second, minute, hour, day, month, week } = options;
  const { length } = config || {};
  return filterNullable([
    length >= 6 ? (second ? cronSecondGen(second) : "") : "",
    cronMinuteGen(minute),
    cronHourGen(hour),
    cronDayGen(day),
    cronMonthGen(month),
    cronWeekGen(week),
  ]).join(" ");
};
