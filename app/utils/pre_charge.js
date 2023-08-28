export function cargarDepartamentos() {
    const select_deptops = document.getElementById("depto");
    for (let index = 0; index <= 2; index++) {
        const BLOCK = ["A", "B", "C"];
        for (let j = 1; j <= 5; j++) {
            if (j == 1 || j == 2) {
                for (let k = 1; k <= 10; k++) {
                    select_deptops.innerHTML +=
                        `<option>${BLOCK[index]} ${j}${k <= 9 ? '0' + k : k}</option>`
                }
            } else {
                for (let k = 1; k <= 12; k++) {
                    select_deptops.innerHTML +=
                        `<option>${BLOCK[index]} ${j}${k <= 9 ? '0' + k : k}</option>`
                }
            }
        }
    }
    $(select_deptops).selectize({ sortField: 'text' });
}