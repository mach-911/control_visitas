export class Database {
	constructor(){
		this.request = indexedDB.open('visitas', 1);
	}

	connect() {
		this.request.onerror = (event) => {
		  console.log(`Error al conectar con la base de datos: ${event.target.errorCode}`)	
		}

		this.request.onsuccess = (event) => {
			console.log(`Conexión exitosa: ${event.target.result}`)
		}

		this.request.onupgradeneeded = (event) => {
			console.log(`Se creo la db exitosa: ${event.target.result}`)
			const db = event.target.result;
			let store = db.createObjectStore('visitas', {
				autoIncrement: true
			})

			let index = store.createIndex('rut', 'rut', {
				unique: true
			})
		}
	}

	getAll() {
	 return new Promise((res, rej) => {
	 	this.request.onsuccess = (event) => {
	 		const db = event.target.result;
		 		const txn = db.transaction('visitas', "readonly");
				const objectStore = txn.objectStore('visitas');
		 		const result = [] 

				let query = objectStore.getAll();

				query.onsuccess = (event) => { 
					const visitas = event.target.result;
				  visitas.forEach(visita => {
				      result.push(visita);
				   })
				}
		    
		    // Resolve 
		    txn.oncomplete = (event) => {
		    	db.close();
		      res(result)
		    }
	      txn.onerror = (event) => {
	        rej(event)
	      }
    }
	})
	}

	destroy() {
		window.indexedDB.databases().then((r) => {
	    for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
		}).then(() => {
	    console.log('Todo limpio');
		});
	}
	
	create(data) {

		this.request.onsuccess = (event) => {
     		const db = event.target.result;
			// Create a new transaction
			const txn = db.transaction('visitas', 'readwrite');

			// get the object store
			const store = txn.objectStore('visitas');

			let query = store.put(data);

			query.onerror = (event) => {
				console.log(event.target.errorCode)
			}

			query.onsuccess = (event) => { 
				console.log(event);
			}

			// close database once the
			// transaction completes
			txn.oncomplete = () => { 
				db.close();
			}
		}
	}

	deleteById(id) {
		this.request.onsuccess = (event) => {
     		const db = event.target.result;
			// Create a new transaction
			const txn = db.transaction('visitas', 'readwrite');

			// get the object store
			const store = txn.objectStore('visitas');

			let query = store.delete(id);

			query.onerror = (event) => {
				console.log(event.target.errorCode)
			}

			query.onsuccess = (event) => { 
				console.log(event);
			}
			// close database once the
			// transaction completes
			txn.oncomplete = () => { 
				db.close();
			}
		}
	}

}