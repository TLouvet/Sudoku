"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    /**
     * Start Timer
     * @param htmlId -- Node id containing the text to display
     */
    static start(htmlId) {
        Timer.intervalID = window.setInterval(() => {
            if (++Timer.seconds == 60) {
                Timer.minutes++;
                Timer.seconds = 0;
            }
            if (Timer.minutes === 60) {
                Timer.hours++;
                Timer.minutes = 0;
            }
            document.getElementById(htmlId).innerText = this.getTimeString();
        }, 1000);
    }
    static stop() {
        window.clearInterval(Timer.intervalID);
    }
    static getTimeString() {
        const hformat = Timer.format(Timer.hours);
        const mformat = Timer.format(Timer.minutes);
        const sformat = Timer.format(Timer.seconds);
        return `${hformat}:${mformat}:${sformat}`;
    }
    static format(arg) {
        return arg < 10 ? `0${arg}` : arg;
    }
    /**
     * Restart timer on Grid change
     * @param htmlId - Node id containing the text
     */
    static restart(htmlId) {
        Timer.minutes = 0;
        Timer.seconds = 0;
        Timer.hours = 0;
        window.clearInterval(Timer.intervalID);
        document.getElementById(htmlId).innerText = "00:00:00";
        Timer.start(htmlId);
    }
}
exports.Timer = Timer;
Timer.seconds = 0;
Timer.minutes = 0;
Timer.hours = 0;
Timer.intervalID = 0;
