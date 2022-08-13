export class Timer {
  private seconds = 0;
  private minutes = 0;
  private hours = 0;
  private intervalID: number = 0;

  constructor() { }

  /**
   * Start Timer
   * @param htmlId -- Node id containing the text to display 
   */
  start(htmlId: string) {
    this.intervalID = window.setInterval(() => {
      this.seconds++;
      if (this.seconds == 60) {
        this.minutes++;
        this.seconds = 0;
      }

      if (this.minutes === 60) {
        this.hours++;
        this.minutes = 0;
      }

      const lambdaFormat = (arg: number) => arg < 10 ? `0${arg}` : arg;

      const hformat = lambdaFormat(this.hours);
      const mformat = lambdaFormat(this.minutes);
      const sformat = lambdaFormat(this.seconds);
      document.getElementById(htmlId)!.innerText = `${hformat}:${mformat}:${sformat}`;

    }, 1000);
  }

  /**
   * Restart timer on Grid change
   * @param htmlId - Node id containing the text
   */
  restart(htmlId: string) {
    this.minutes = 0;
    this.seconds = 0;
    this.hours = 0;
    window.clearInterval(this.intervalID);
    document.getElementById(htmlId)!.innerText = "00:00:00";
    this.start(htmlId);
  }

}