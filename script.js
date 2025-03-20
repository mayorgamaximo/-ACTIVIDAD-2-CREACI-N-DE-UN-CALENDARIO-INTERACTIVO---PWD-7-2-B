// Definicion de un array con los nombres de los meses
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
    "Octubre", "Noviembre", "Diciembre"];

// Obtencion del contenedor de las fechas del calendario
const datesContainer = document.getElementById("dates");

// Obtencion del mes y año actual
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Funcion para cargar el calendario en la pagina
function loadCalendar(month, year) {
    // Limpieza del contenedor de fechas
    datesContainer.innerHTML = "";

    // Actualizacion del nombre del mes y año en la pagina
    document.getElementById("month").textContent = monthNames[month];
    document.getElementById("year").textContent = year;

    // Obtencion del primer dia del mes
    let firstDay = new Date(year, month, 1).getDay();

    // Obtencion del total de dias del mes
    let totalDays = new Date(year, month + 1, 0).getDate();

    // Obtencion de los eventos almacenados
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    // Creacion de los divs para cada dia del mes
    for (let i = 1; i <= totalDays; i++) {
        let day = document.createElement("div");
        day.classList.add("day");
        day.textContent = i;

        // Marcado del dia actual
        let today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add("today");
        }

        // Verificacion de eventos para el dia actual
        const eventDate = new Date(year, month, i).toISOString().split('T')[0];
        if (storedEvents.some(event => event.date === eventDate)) {
            day.classList.add("event-day");
        }

        // Agregado del dia al contenedor de fechas
        datesContainer.appendChild(day);
    }
}

// Evento para el boton de mes anterior
document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar(currentMonth, currentYear);
});

// Evento para el boton de mes siguiente
document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentMonth, currentYear);
});

// Carga inicial del calendario
loadCalendar(currentMonth, currentYear);

// Evento DOMContentLoaded para asegurar que el DOM este cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtencion del contenedor de la lista de eventos
    const listcontainer = document.getElementById("added-events");

    // Obtencion de los inputs de titulo y fecha del evento
    const titleInput = document.getElementById("event-title");
    const dateInput = document.getElementById("event-date");

    // Funcion para cargar los eventos almacenados en localStorage
    function loadEvents() {
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        listcontainer.innerHTML = "";

        // Creacion de los elementos li para cada evento
        storedEvents.forEach((event, index) => {
            const eventLi = document.createElement("li");
            eventLi.textContent = `${event.date} ${event.title}`;

            // Creacion del boton eliminar para cada evento
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.addEventListener("click", () => {
                deleteEvent(index);
            });

            // Agregado del boton eliminar al elemento li
            eventLi.appendChild(deleteButton);

            // Agregado del elemento li al contenedor de la lista de eventos
            listcontainer.appendChild(eventLi);
        });
    }

    // Carga inicial de los eventos
    loadEvents();

    // Evento para el boton guardar evento
    document.getElementById("save-event").addEventListener("click", () => {
        const title = titleInput.value;
        const date = dateInput.value;

        // Almacenamiento del nuevo evento en localStorage
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        storedEvents.push({ date: date, title: title });
        localStorage.setItem("events", JSON.stringify(storedEvents));

        // Limpieza de los inputs de titulo y fecha del evento
        titleInput.value = "";
        dateInput.value = "";

        // Recarga del calendario para actualizar los estilos
        loadCalendar(currentMonth, currentYear);
        loadEvents();
    });

    // Funcion para eliminar un evento de localStorage y actualizar la lista
    function deleteEvent(index) {
        const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
        storedEvents.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(storedEvents));
        loadEvents();
        loadCalendar(currentMonth, currentYear);
    }
});