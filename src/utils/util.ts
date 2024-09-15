import moment from "moment";

interface SlotOption {
    startDate: string;
    endDate: string;
    startHour: number;
    endHour: number;
    durationMinutes: number;
    podId: number;
    unitPrice: number;
    gap?: number;
}

export const generateSlots = (options: SlotOption) => {
    const formatType = "YYYY-MM-DD HH:mm:ss";
    const startDatetime = moment(options.startDate).set({
        hour: options.startHour,
        minute: 0,
        second: 0,
    });

    const endDatetime = moment(options.endDate).set({
        hour: options.endHour,
        minute: 0,
        second: 0,
    });

    while (startDatetime.isBefore(endDatetime)) {
        const slot = {
            start: startDatetime.format(formatType),
            end: startDatetime
                .add(options.durationMinutes, "minutes")
                .format(formatType),
        };
        console.log(`From: ${slot.start} To: ${slot.end}`);

        if (options.gap) {
            startDatetime.add(options.gap, "minutes");
        }

        if (startDatetime.hour() >= options.endHour) {
            startDatetime.add(1, "day").set({
                hour: options.startHour,
                minute: 0,
                second: 0,
            });
            console.log("=====================================");
        }
    }
};

generateSlots({
    startDate: "2022-01-01",
    endDate: "2022-01-01",
    startHour: 7,
    endHour: 12,
    durationMinutes: 60,
    podId: 30,
    unitPrice: 30.0,
});
