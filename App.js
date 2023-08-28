import { getTodayDate } from "./app/utils/dates_utils.js";
import { cargarDepartamentos } from "./app/utils/pre_charge.js";
import { activate_events } from "./app/event_handling/handler.js";
import { UI } from "./app/models/ui.js";
import { Database } from "./app/db/database.js";

function initApplication() {
    activate_events();
    cargarDepartamentos();
    getTodayDate();
    new Database().connect();
    const ui = new UI();
    ui.home();
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        initApplication();
    }
};


