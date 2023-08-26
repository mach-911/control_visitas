import { obtenerNombres } from "./modulos/api.js";
import { getTodayDate } from "./modulos/fechas.js";
import { formatearRut } from "./modulos/formato.js";
import { cargarDatosDepartamentos } from "./modulos/precarda_de_datos.js";
import { Temporizador } from "./modulos/temporizador.js";
import { handle } from "./modulos/convertir_a_csv.js";

class Visita {
    constructor(rut, nombre, matricula = '', color = '', dpto, ingreso, phone) {
        this.rut = rut; // requerido
        this.nombre = nombre; // requerido
        this.matricula = matricula; // opcional
        this.color = color; // opcional
        this.departamento = dpto; // requerido
        // this.phone = phone || ''; // opcional
        this.ingreso = new Date(ingreso); // marca de tiempo de inicio
        // this.hasta = new Date(this.ingreso.getTime() + 18000000); // rango adicional (5 hrs) en milisegundos
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
        element.classList.add('fw-medium');
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


// Eventos del DOM
document.getElementById('visita-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        let visitas = JSON.parse(localStorage.getItem('visitas')) || [];
        const rut = document.getElementById('rut'); // rut ingresado
        const nombre = document.getElementById('nombre'); // nombre ingresado
        const tipo_visita = document.getElementById("tipo_visita");
        const matricula = document.getElementById('matricula'); // patente ingresada
        const color = document.getElementById('color').value; // color ingresado
        const depto = document.getElementById('depto').value; // depto ingresado
        const ingreso = document.getElementById('ingreso').value; // hora ingreso

        // verificamos si la pantente ya existe en los registros
        if (visitas.some(vta => vta.matricula == matricula.value.toUpperCase())) {
            matricula.focus();
            matricula.select();
            return alert(`Ya existe la patente ${matricula.value} en el registro`)
        }
        // verificamos si el rut ya existe en los registros 
        else if (visitas.some(vta => vta.rut == rut.value)) {
            rut.focus();
            rut.select();
            return alert(`Ya existe la visita con rut ${rut.value} en el registro`)
        } 
        else {
          if (tipo_visita.value === "1") {
             matricula.value = "peaton";
          }
          // almacenamos una nueva instancia de visita con los campos recolectados
          const visita = new Visita(rut.value, nombre.value, matricula.value, color, depto, ingreso);
          visitas.push(visita)
          localStorage.setItem('visitas', JSON.stringify(visitas));
          const ui = new UI();
          ui.agregarVisita(visita);
          ui.closeModal();
          ui.cleanBox();
          ui.showMessage('Visita añadida exitosamente', 'success');
        }
    });


document.getElementById('btn_csv').addEventListener('click', () => {
    const visitas = JSON.parse(localStorage.getItem('visitas'))
    handle(visitas);
})

function initApplication() {
    cargarDatosDepartamentos();
    getTodayDate();
    const ui = new UI();
    ui.home();
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        initApplication();
    }
};

document.querySelector("#rut").oninput = async (e) => {

    const nombre = await obtenerNombres(e.target.value);
    if (nombre != undefined) {
        document.querySelector("#nombre").value = nombre;
    } else {
        // alert("desconocido")
    }
}

document.getElementById('rut').addEventListener('input', function(evt) {
  let value = this.value.replace(/\./g, '').replace('-', '');
  
  if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
    value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
  }
  else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
    value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, '$1.$2.$3-$4');
  }
  else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
    value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, '$1.$2.$3');
  }
  else if (value.match(/^(\d)(\d{0,2})$/)) {
    value = value.replace(/^(\d)(\d{0,2})$/, '$1.$2');
  }
  this.value = value;
});