import { Database } from "../db/database.js";
import { downloadAsExcel } from "../utils/export_as_excel.js";
import { libreApiGetNames } from "../utils/apis.js";
import { Visita } from "../models/visita.js";
import { darFormatoRUT } from "../utils/format.js";
import { UI } from "../models/ui.js"

export function activate_events() {

  document.getElementById('btn_modal').addEventListener('click', () => {
    document.getElementById('modal').showModal();
      const ingreso = document.getElementById("ingreso");
      const dt = new Date();
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
      ingreso.value = dt.toISOString().slice(0, 16)
      ingreso.min = dt.toISOString().slice(0, 11) + '00:00'
      ingreso.max = dt.toISOString().slice(0, 16)
  })
  document.getElementById('nombre').oninput = (e) => {
    e.target.value = e.target.value.toLowerCase();
  }

	document.getElementById('visita-form')
    .addEventListener('submit', function (e) {
        e.preventDefault();
        const db = new Database();
        const rut = document.getElementById('rut'); // rut ingresado
        const nombre = document.getElementById('nombre'); // nombre ingresado
        const tipo_visita = document.getElementById("tipo_visita");
        const matricula = document.getElementById('matricula'); // patente ingresada
        const color = document.getElementById('color').value; // color ingresado
        const depto = document.getElementById('depto').value; // depto ingresado
        const motivo = document.getElementById('motivo').value; // motivo ingresado
        const ingreso = document.getElementById('ingreso').value; // hora ingreso

        db.getAll().then(res => {
          // verificamos si la pantente ya existe en los registros
          if (res.some(vta => vta.matricula == matricula.value.toUpperCase())) {
            matricula.focus();
            matricula.select();
            return alert(`Ya existe la patente ${matricula.value} en el registro`)
          }
          // verificamos si el rut ya existe en los registros
          else if (res.some(vta => vta.rut == rut.value)) {
            rut.focus();
            rut.select();
            return alert(`Ya existe la visita con rut ${rut.value} en el registro`)
          }
          else {
            if (tipo_visita.value === "1") {
              matricula.value = "peatón";
            } else {
              // verificamos que la matricula sea vacía
              if (matricula.value === "") {
                  matricula.focus();
                  return alert(`Debes ingresar una patente`)
              }
            }
            // almacenamos una nueva instancia de visita con los campos recolectados
            const visita = new Visita(rut.value, nombre.value, matricula.value, color, depto, ingreso, motivo);
            new Database().create(visita);
            const ui = new UI();
            ui.agregarVisita(visita);
            ui.closeModal();
            ui.cleanBox();
            ui.showMessage('Visita añadida exitosamente', 'success');
          }
        })
    });

  // Editar registro
  document.getElementById('editar');
	// Reset database
	document.getElementById('btn_reset').addEventListener('click', () => {
	  const db = new Database();
	  db.destroy();
	  location.reload();
	})

	// Download excel
	document.getElementById('btn_excel').addEventListener('click',() => {
    const db = new Database();
    db.getAll().then(res => {
      const visitas = res.map(vta => {
          return {
            rut: vta.rut,
            nombre: vta.nombre,
            patente: vta.matricula,
            ingreso: new Intl.DateTimeFormat(undefined, {
              timeStyle: "medium",
              dateStyle: "short"
            }).format(new Date(vta.ingreso)),
            motivo: vta.motivo
          }
        })
        downloadAsExcel(visitas);
      })
	})

	// Input to get names
	document.querySelector("#rut").oninput = async (e) => {
  	const nombre = await libreApiGetNames(e.target.value);
  	if (nombre != undefined) {
      	document.querySelector("#nombre").value = nombre;
  	} else {
    	  // alert("desconocido")
  	}
	}
	// format rut
	document.getElementById('rut').addEventListener('input', (e) => {
    let rutFormateado = darFormatoRUT(e.target.value);
    e.target.value = rutFormateado;
  });

}