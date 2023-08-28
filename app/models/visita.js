export class Visita {
    constructor(rut, nombre, matricula = '', color = '', dpto, ingreso, motivo, phone) {
        this.rut = rut; // requerido
        this.nombre = nombre; // requerido
        this.matricula = matricula; // opcional
        this.color = color; // opcional
        this.departamento = dpto; // requerido
        this.ingreso = new Date(ingreso); // marca de tiempo de inicio
        this.motivo = motivo || '';
        this.telefono = phone || ''; // opcional
    }
}
