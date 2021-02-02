import * as chrono from "../../src/";
import { testSingleCase, testUnexpectedResult } from "../test_util";
import { Meridiem } from "../../src/";

test("Test - Single Expression", () => {
    testSingleCase(chrono.nl, "De deadline is nu", new Date(2012, 7, 10, 8, 9, 10, 11), (result) => {
        expect(result.index).toBe(15);
        expect(result.text).toBe("nu");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(8);
        expect(result.start.get("minute")).toBe(9);
        expect(result.start.get("second")).toBe(10);
        expect(result.start.get("millisecond")).toBe(11);
        expect(result.start.get("timezoneOffset")).toBe(result.refDate.getTimezoneOffset() * -1);

        expect(result.start).toBeDate(result.refDate);
        expect(result.start).toBeDate(new Date(2012, 7, 10, 8, 9, 10, 11));
    });

    testSingleCase(chrono.nl, "De deadline is vandaag", new Date(2012, 7, 10, 14, 12), (result) => {
        expect(result.index).toBe(15);
        expect(result.text).toBe("vandaag");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 14, 12));
    });

    testSingleCase(chrono.nl, "De deadline is morgen", new Date(2012, 7, 10, 17, 10), (result) => {
        expect(result.index).toBe(15);
        expect(result.text).toBe("morgen");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(11);

        expect(result.start).toBeDate(new Date(2012, 7, 11, 17, 10));
    });

    testSingleCase(chrono.nl, "De deadline is morgen", new Date(2012, 7, 10, 1), (result) => {
        expect(result.start).toBeDate(new Date(2012, 7, 11, 1));
    });

    testSingleCase(chrono.nl, "De deadline was gisteren", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("gisteren");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(9);

        expect(result.start).toBeDate(new Date(2012, 7, 9, 12));
    });

    testSingleCase(chrono.nl, "De Deadline was deze ochtend", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("deze ochtend");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(6);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 6));
    });

    testSingleCase(chrono.nl, "De Deadline was deze namiddag ", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("deze namiddag");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(15);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 15));
    });

    testSingleCase(chrono.nl, "De Deadline was deze avond ", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(16);
        expect(result.text).toBe("deze avond");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(20);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 20));
    });

    testSingleCase(chrono.nl, "De deadline is vanavond", new Date(2012, 7, 10, 12), (result) => {
        expect(result.text).toBe("vanavond");
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(20);
    });

    // "Midnight" at 0~1AM, assume it's the coming midnight of following day
    // This is similar to "Tomorrow" at 0~1AM
    testSingleCase(chrono.nl, "The Deadline is om middernacht ", new Date(2012, 7, 10, 1), (result) => {
        expect(result.text).toBe("middernacht");
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(11);
        expect(result.start.get("hour")).toBe(0);
    });
});

test("Test - Combined Expression", () => {
    testSingleCase(chrono.nl, "De deadline is vandaag om 17:00", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(15);
        expect(result.text).toBe("vandaag om 17:00");

        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(17);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 17));
    });

    // TODO should be "morgenmiddag"
    testSingleCase(chrono.nl, "morgen middag", new Date(2012, 8 - 1, 10, 14), (result) => {
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(11);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 8 - 1, 11, 12));
    });
});

test("Test - Casual date range", () => {
    testSingleCase(chrono.nl, "Het evenement is vandaag - volgende vrijdag", new Date(2012, 7, 4, 12), (result) => {
        expect(result.index).toBe(17);
        expect(result.text).toBe("vandaag - volgende vrijdag");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(4);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 4, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(10);
        expect(result.end.get("hour")).toBe(12);

        expect(result.end).toBeDate(new Date(2012, 7, 10, 12));
    });

    testSingleCase(chrono.nl, "Het evenement is vandaag - volgende vrijdag", new Date(2012, 7, 10, 12), (result) => {
        expect(result.index).toBe(17);
        expect(result.text).toBe("vandaag - volgende vrijdag");

        expect(result.start).not.toBeNull();
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(8);
        expect(result.start.get("day")).toBe(10);
        expect(result.start.get("hour")).toBe(12);

        expect(result.start).toBeDate(new Date(2012, 7, 10, 12));

        expect(result.end).not.toBeNull();
        expect(result.end.get("year")).toBe(2012);
        expect(result.end.get("month")).toBe(8);
        expect(result.end.get("day")).toBe(17);
        expect(result.end.get("hour")).toBe(12);

        expect(result.end).toBeDate(new Date(2012, 7, 17, 12));
    });
});

test("Test - Casual time implication", () => {
    // TODO should be "morgennamiddag"
    testSingleCase(
        chrono.nl,
        "jaarlijks verlof vanaf vandaag tot morgen namiddag",
        new Date(2012, 8 - 1, 4, 12),
        (result) => {
            expect(result.text).toBe("vandaag tot morgen namiddag");

            expect(result.start.get("month")).toBe(8);
            expect(result.start.get("day")).toBe(4);
            expect(result.start.get("hour")).toBe(12);
            expect(result.start.isCertain("hour")).toBe(false);

            expect(result.end.get("month")).toBe(8);
            expect(result.end.get("day")).toBe(5);
            expect(result.end.get("hour")).toBe(15);
            expect(result.end.isCertain("hour")).toBe(false);
        }
    );

    testSingleCase(
        chrono.nl,
        "jaarlijks verlof vanaf deze ochtend tot morgen",
        new Date(2012, 8 - 1, 4, 12),
        (result) => {
            expect(result.text).toBe("deze ochtend tot morgen");

            expect(result.start.get("month")).toBe(8);
            expect(result.start.get("day")).toBe(4);
            expect(result.start.get("hour")).toBe(6);
            expect(result.start.isCertain("hour")).toBe(false);

            expect(result.end.get("month")).toBe(8);
            expect(result.end.get("day")).toBe(5);
            expect(result.end.get("hour")).toBe(12);
            expect(result.end.isCertain("hour")).toBe(false);
        }
    );
});

test("Test - Random text", () => {
    testSingleCase(chrono.nl, "vanavond", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(20);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.nl, "vanavond 22:00", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(22);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.nl, "vanavond om 21:00", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(21);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.nl, "morgen voor 16:00", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.nl, "morgen na 16:00", new Date(2012, 1 - 1, 1, 12), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("hour")).toBe(16);
        expect(result.start.get("year")).toBe(2012);
        expect(result.start.get("month")).toBe(1);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("meridiem")).toBe(Meridiem.PM);
    });

    testSingleCase(chrono.nl, "donderdag", (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("weekday")).toBe(4);
    });

    testSingleCase(chrono.nl, "deze avond", new Date(2016, 10 - 1, 1), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(20);
    });

    // TODO: should be "gisterennamiddag"
    testSingleCase(chrono.nl, "gisteren namiddag", new Date(2016, 10 - 1, 1), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(9);
        expect(result.start.get("day")).toBe(30);
        expect(result.start.get("hour")).toBe(15);
    });

    // TODO: should be "morgenochtend"
    testSingleCase(chrono.nl, "morgen ochtend", new Date(2016, 10 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(2);
        expect(result.start.get("hour")).toBe(6);
    });

    testSingleCase(chrono.nl, "deze namiddag om 15:00", new Date(2016, 10 - 1, 1, 8), (result, text) => {
        expect(result.text).toBe(text);
        expect(result.start.get("year")).toBe(2016);
        expect(result.start.get("month")).toBe(10);
        expect(result.start.get("day")).toBe(1);
        expect(result.start.get("hour")).toBe(15);
    });
});

test("Test - Random negative text", () => {
    testUnexpectedResult(chrono.nl, "notoday");

    testUnexpectedResult(chrono.nl, "tdtmr");

    testUnexpectedResult(chrono.nl, "xyesterday");

    testUnexpectedResult(chrono.nl, "nowhere");

    testUnexpectedResult(chrono.nl, "noway");

    testUnexpectedResult(chrono.nl, "knowledge");
});
