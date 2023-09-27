import { Database } from "../db/database.js";
import { Temporizador } from "../models/temporizador.js";

export class UI {
    home() {
      let container = document.getElementById('main_container');
      const db = new Database();
      db.getAll().then(res => {
        if (res.length != 0) {
          res.forEach(item => {
              this.agregarVisita(item);
          })
        }
      })
    }

    agregarVisita(visita) {
        const tbody_visita = document.getElementById('tbody-visita');
        const element = document.createElement('tr');
        element.title = visita.motivo;
        element.classList.add('fw-medium');
        element.style.cursor = 'pointer';
        element.onclick = () => {
          this.showPopup(visita)
        }
        element.oncontextmenu = (event) => {
          event.preventDefault();
        };


        element.innerHTML = /*html*/`
          <!-- mostrar el nombre de la visita -->
          <td class="text-capitalize fit">${visita.nombre}</td>
          <!-- mostrar el rut de la visita -->
          <td>${visita.rut}</td>
          <!-- mostramos la patente y color del vehículo o si es peaton -->
          <td class="text-center">
             ${ visita.matricula === "peatón"
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
          <td class="fit">${ visita.matricula === "peatón"
            ? '<div class="text-center">//</div>'
            : new Intl.DateTimeFormat(undefined, {
                timeStyle: "medium",
                dateStyle: "short"
            }).format(new Date(visita.ingreso).getTime() + 18000000)}</td>
        `;

        if (visita.matricula === "peatón") {
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
            temporizador.temporizar(document.getElementById(visita.matricula));
        }
    }
    cleanBox() {
        document.getElementById('visita-form').reset();
    }
    closeModal() {
        document.getElementById("btn_popup").click()
    }
    // delete
    eliminarVisita(id) {
        if (confirm('¿Estás seguro de retirar a esta visita?')) {
          alert(id)
            // element.parentElement.parentElement.parentElement.remove();
            // this.showMessage('Producto eliminado exitosamente', 'warning')
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

    showPopup(visita) {
      let left = (screen.width/2)-(460/2);
      let top = (screen.height/2)-(460/2);
      let params = `directories=no,scrollbars=0,resizable=1,status=0,location=no,toolbar=0,menubar=1,width=460,height=460,left=${left},top=${top}`;
      const popup = open('', '_blank', params);
      popup.focus()
      popup.document.write(`<script src="https://kit.fontawesome.com/6b8f0c7049.js" crossorigin="anonymous"></script>`)
      popup.document.write(`
        <style>* {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: sans-serif;
         }
         body {
          background: radial-gradient(#fff, #ddd 65%, #99bE9E 10%, #ddd);
          padding: 30px 0;
          color: #292929;
          min-height: 100vh;
         }

         main {
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
          height: 100%;
         }

         hr {
          background: #ccc;
          border: 0;
          height: 3px;
          width: 80%;
         }
         button {
          border: none;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 18px;
          cursor: pointer;
         }
         button.editar {
          background: #f7b620;
         }
         button.eliminar {
          background: #f74640;
         }
         *[contenteditable='true']:hover {
           background-color: rgba(0, 0, 0,0.2);
           border-radius: 3px;
          }

        </style>`)
      const db = new Database();
      popup.document.write(`<main>`)
      popup.document.write(`<title>${visita.nombre}</title>`)
      popup.document.write(`<h1>${visita.motivo}</h1>`)
      popup.document.write(`<div>`)
      popup.document.write(`<h2><span contenteditable='true' id='nombre'>${visita.nombre}</span> <i class='fa fa-pencil'></i></h2>`)
      popup.document.write(`</div>`)
      popup.document.write(`<hr>`)
      popup.document.write(`<h3>${visita.rut}</h3>`)
      popup.document.write(`<h3 id=${visita.matricula}></h3>`)
      popup.document.write(`<i class='login'></i>`)
      popup.document.write(`<button type='button' class='close' onclick='window.close()'>Cerrar</button>`)
      popup.document.write(`<button type='button' id='actualizar'>Actualizar</button>`)
      popup.document.write(`</main>`)
      popup.document.write(`<script>`)
      popup.document.write(`
        document.getElementById('nombre').focus();
        const btn = document.getElementById('actualizar');
        btn.addEventListener('click', () => {
          const request = indexedDB.open('visitas', 1);

          request.onsuccess = (event) => {
            const db = event.target.result;
            console.log(db);
            let transaction = db.transaction(["visitas"], "readwrite");
            let objectStore = transaction.objectStore("visitas")
            console.log(transaction);
            console.log(objectStore);
            let cursorRequest = objectStore.openCursor();
            cursorRequest.onsuccess = (e) => {
              const cursor = e.target.result;
              if (cursor){
                if(cursor.value.rut === '${visita.rut}') {
                  const updateData = cursor.value;
                  console.log(updateData.nombre);
                  updateData.nombre = document.getElementById('nombre').textContent;
                  const request = cursor.update(updateData);
                  request.onsuccess = (e) => {
                    window.close();
                    window.opener.location.reload();
                  }
                }
                cursor.continue();
              }
            }
          }
        })


      `)
      popup.document.write(`</script>`)
        // document.querySelector('.eliminar').addEventListener('click', () => {
      //     const request = indexedDB.open('visitas', 1);
      //         request.onsuccess = (event) => {
      //         const db = event.target.result;
      //         // Create a new transaction
      //         const txn = db.transaction('visitas', 'readwrite');

      //         // get the object store
      //         const store = txn.objectStore('visitas');

      //         let query = store.delete(${visita.rut});
      //         query.onerror = (event) => {
      //           console.log(event.target.errorCode)
      //         }

      //         query.onsuccess = (event) => {
      //           console.log(event);
      //         }
      //         // close database once the
      //         // transaction completes
      //         txn.oncomplete = () => {
      //           db.close();
      //         }
      //       }
      //     })
     // </script>`)
 }

}