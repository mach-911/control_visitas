export class Temporizador {

    constructor(inicio) {
        this.inicio = new Date(inicio);
        this.final = new Date(this.inicio.getTime() + 18000000);;
        this.restante = '';
        this.second = 1000;
        this.minute = this.second * 60;
        this.hour = this.minute * 60;
        this.day = this.hour * 24;
    }

    formatTime(time) {
        const ftime = time <= 9 ? '0' + time : time;
        return ftime;
    }

    getTime() {
        const distance = Math.abs(new Date(Date.now()) - this.final);
        const hours = Math.floor((distance % this.day) / this.hour);
        const minutes = Math.floor((distance % this.hour) / this.minute);
        const seconds = Math.floor((distance % this.minute) / this.second);
        // console.log(this.formatTime(hours), ':', this.formatTime(minutes), ':', this.formatTime(seconds));
        // console.log(distance);
        return `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    };

    temporizar(matricula) {
    setInterval(() => {
            this.restante = this.getTime()
            document.getElementById(matricula).textContent = this.restante
        }, 1000);
    }
}