// POO

class Visita {
    // Lo que se va a solicitar al instanciar nuestra Visita
    constructor(matricula, color, dpto, ingreso, phone) {
        this.matricula = matricula;
        this.departamento = dpto;
        this.phone = phone || '';
        this.color = color || '';
        this.ingreso = new Date(ingreso);
        this.salida = new Date(this.ingreso.getTime() + 18000000);
    }

}

class Temporizador {
    constructor(final) {
        this.final = new Date(final);
        this.restante = '';
        this.second = 1000;
        this.minute = this.second * 60;
        this.hour = this.minute * 60;
        this.day = this.hour * 24;
    }

    formatTime(time) {
        // time <= 9 ? '0' + time : time
        // console.log(typeof time)
        const ftime = time <= 9 ? '0' + time : time;
        return ftime;
    }
    getTime() {
        const distance = Math.abs(new Date(Date.now()) - this.final);
        const hours = Math.floor((distance % this.day) / this.hour);
        const minutes = Math.floor((distance % this.hour) / this.minute);
        const seconds = Math.floor((distance % this.minute) / this.second);
        console.log(this.formatTime(hours), ':', this.formatTime(minutes), ':', this.formatTime(seconds));
        return `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
    };
    temporizar(matricula) {
        setInterval(() => {
            this.restante = this.getTime()
            document.getElementById(matricula).textContent = this.restante
        }, 1000);
    }
}

class UI {
    home() {
        JSON.parse(localStorage.getItem('visitas'))
            ? JSON.parse(localStorage.getItem('visitas')).forEach(item => {
                this.agregarVisita(item);
            })
            : ""
    }
    agregarVisita(visita) {
        const tbody_visita = document.getElementById('tbody-visita');
        const element = document.createElement('tr');
        element.innerHTML = `
            <th>${visita.matricula.toUpperCase()}</th>
            <td><div class="circle" style='background:${visita.color}'></div></td>
            <td>${visita.departamento}</td>
            <td>${new Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            dateStyle: "short"
        }).format(new Date(visita.ingreso))}</td>
            <td>${new Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            dateStyle: "short"
        }).format(new Date(visita.salida))}</td>
            <td><span id='${visita.matricula}' class='badge text-bg-info'></span></td>
        `;
        tbody_visita.appendChild(element);
        const temporizador = new Temporizador(visita.salida);
        temporizador.temporizar(visita.matricula);
    }
    cleanBox() {
        document.getElementById('visita-form').reset();
    }
    closeModal() {
        document.getElementById("btn_popup").click()
    }
    // delete
    eliminarVisita(element) {
        if (element.name === 'delete' && confirm('¿Estás seguro de retirar a esta visita?')) {
            element.parentElement.parentElement.parentElement.remove();
            this.showMessage('Producto eliminado exitosamente', 'warning')
        }
    }
    // messages
    showMessage(message, contextClass) {
        const div = document.createElement('div');
        div.className = `alert alert-${contextClass} mt-3`;
        div.appendChild(document.createTextNode(message));
        // mostrando en el dom
        const container = document.querySelector('.container');
        const app = document.querySelector('#App');
        container.insertBefore(div, app);
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 2000);
    }
}


// Eventos del DOM
document.getElementById('visita-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        let visitas = JSON.parse(localStorage.getItem('visitas')) || [];
        const patente = document.getElementById('matricula');
        const color = document.getElementById('color').value;
        const depto = document.getElementById('depto').value;
        const ingreso = document.getElementById('ingreso').value;
        const visita = new Visita(patente.value, color, depto, ingreso);
        if (visitas.some(vta => vta.matricula == patente.value.toUpperCase())) {
            patente.focus();
            patente.select();
            return alert(`Ya existe la patente ${patente.value} en el registro`)
        }
        // if (patente === '' || depto === '') {
        //     return ui.showMessage('Todos los campos son requeridos', 'danger');
        // }
        visitas.push(visita)
        localStorage.setItem('visitas', JSON.stringify(visitas));
        const ui = new UI();
        ui.closeModal();
        ui.cleanBox();
        ui.showMessage('Visita añadida exitosamente', 'success');
        ui.agregarVisita(visita);
    });


window.onload = () => {
    const ui = new UI();
    ui.home();
}