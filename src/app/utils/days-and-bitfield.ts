import { DaysOfWeek } from "../types/type.ts";

export const convertDaysToBitField = (days: DaysOfWeek[]): number => {
    return days.reduce((bitField, day) => bitField | day, 0);
};

export const convertBitFieldToDays = (bitfield: number): DaysOfWeek[] => {
    return Object.values(DaysOfWeek).filter(
        (day) => typeof day === "number" && (bitfield & day) !== 0
    ) as DaysOfWeek[];
};

export const convertStringDaysToEnumDays = (days: string[]): DaysOfWeek[] => {
    const stringToEnumMap: { [key: string]: DaysOfWeek } = {
        ["Monday"]: DaysOfWeek.Monday,
        ["Tuesday"]: DaysOfWeek.Tuesday,
        ["Wednesday"]: DaysOfWeek.Wednesday,
        ["Thursday"]: DaysOfWeek.Thursday,
        ["Friday"]: DaysOfWeek.Friday,
        ["Saturday"]: DaysOfWeek.Saturday,
        ["Sunday"]: DaysOfWeek.Sunday,
    };
    return days.map((day) => stringToEnumMap[day]);
};

export const convertEnumDaysToStringDays = (days: DaysOfWeek[]): string[] => {
    const enumToStringMap: { [key in DaysOfWeek]: string } = {
        [DaysOfWeek.Monday]: "Monday",
        [DaysOfWeek.Tuesday]: "Tuesday",
        [DaysOfWeek.Wednesday]: "Wednesday",
        [DaysOfWeek.Thursday]: "Thursday",
        [DaysOfWeek.Friday]: "Friday",
        [DaysOfWeek.Saturday]: "Saturday",
        [DaysOfWeek.Sunday]: "Sunday",
    };
    return days.map((day) => enumToStringMap[day]);
};

export const convertBitFieldToStringDays = (bitField: number): string[] => {
    const enumDays: DaysOfWeek[] = convertBitFieldToDays(bitField);
    const stringDays: string[] = convertEnumDaysToStringDays(enumDays);
    return stringDays;
};