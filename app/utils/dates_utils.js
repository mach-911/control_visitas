export function getTodayDate() {
    const MESES = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    const DIAS = [
      "Domingo", "Lunes", "Martes", "Miércoles",
      "Jueves", "Viernes", "Sábado"
    ]
    const date = new Date(Date.now());

    const today = DIAS[date.getDay()] + ', ' + date.getDate() + ' de ' + MESES[date.getUTCMonth()]
    const h1 = document.querySelector("h1")
    h1.textContent = today;
    setInterval(() => {
       h1.textContent = today;
    }, 60000)
}