import { Database } from "../db/database.js";
import { Temporizador } from "../models/temporizador.js";

export class UI {
    home() {
      const db = new Database();
      db.getAll().then(res => {
        console.log(res);
        res.forEach(item => {
          this.agregarVisita(item);
        })
      })
    }

    agregarVisita(visita) {
        const tbody_visita = document.getElementById('tbody-visita');
        const element = document.createElement('tr');
        element.title = visita.motivo;
        element.classList.add('fw-medium');
        element.style.cursor = 'pointer';
        element.onclick = () => {
           window.open(`https://www.rutificador.co/rut/buscar/?f=${visita.rut}`, '_blank', 'fullscreen=yes,menubar=no,location=no,scrollbars=no,resizable=1')
        }
        element.oncontextmenu = (event) => {
          event.preventDefault();
        };
        element.innerHTML = `
          <!-- mostrar el nombre de la visita -->
          <td class="text-capitalize fit">${visita.nombre}</td>
          <!-- mostrar el rut de la visita -->
          <td>${visita.rut}</td>
          <!-- mostramos la patente y color del vehículo o si es peaton -->
          <td class="text-center">
             ${ visita.matricula === "peaton"
                ? `<i class="fa-solid fa-person-walking"></i> PEATÓN`
                : `<span class="patente">${visita.matricula.substring(0, 2)}·${visita.matricula.substring(2, 4)}<img src="./assets/icons/patente.png" alt="icon" height="7px">${visita.matricula.substring(4, 6)}</span>
                <div class="color d-inline-block" style='background:${visita.color}'></div>`
             }
          </td>
          <!-- mostrar el departamento -->
          <td class="fit">${visita.departamento}</td>
          <!-- mostrar la fecha y hora de ingreso -->
          <td class="fit">${new Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            dateStyle: "short"
          }).format(new Date(visita.ingreso))}</td>
          <!-- mostrar la fecha y hora hasta que hora tiene permitido -->
          <td class="fit">${ visita.matricula === "peaton"
            ? '<div class="text-center">//</div>'
            : new Intl.DateTimeFormat(undefined, {
                timeStyle: "medium",
                dateStyle: "short"
            }).format(new Date(visita.ingreso).getTime() + 18000000)}</td>
        `;

        if (visita.matricula === "peaton") {
            element.innerHTML += `
            <td><div class="text-center">//</div></td>
            `
            tbody_visita.appendChild(element);
        } else {
            element.innerHTML += `
            <td class="text-center"><span id='${visita.matricula}' class='badge text-bg-info'></span></td>
            `
            tbody_visita.appendChild(element);
            const temporizador = new Temporizador(visita.ingreso);
            temporizador.temporizar(visita.matricula);
        }
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