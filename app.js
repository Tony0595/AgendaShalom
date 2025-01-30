document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointmentForm");
    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");
    const adminPasswordInput = document.getElementById("adminPassword");
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const appointmentsSection = document.getElementById("appointmentsSection");
    const appointmentsList = document.getElementById("appointmentsList");
    const notification = document.getElementById("notification");

    const ADMIN_PASSWORD = "Am05.02*";

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Fechas restringidas (Miércoles y Domingos)
    function isRestrictedDate(date) {
        const day = new Date(date).getDay();
        return day === 3 || day === 0; // 3 = Miércoles, 0 = Domingo
    }

    // Horarios disponibles
    function updateTimeOptions() {
        timeSelect.innerHTML = "";
        const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

        times.forEach(time => {
            if (!appointments.some(a => a.date === dateInput.value && a.time === time)) {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            }
        });
    }

    dateInput.addEventListener("change", () => {
        if (isRestrictedDate(dateInput.value)) {
            alert("No se pueden agendar citas los miércoles ni domingos.");
            dateInput.value = "";
        } else {
            updateTimeOptions();
        }
    });

    appointmentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const service = document.getElementById("service").value;
        const date = dateInput.value;
        const time = timeSelect.value;

        if (!date || !time) return alert("Selecciona una fecha y hora válidas.");

        const appointment = { name, phone, service, date, time };
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        showNotification();
        updateTimeOptions();
    });

    function showNotification() {
        notification.classList.remove("hidden");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 3000);
    }

    adminLoginBtn.addEventListener("click", () => {
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            appointmentsSection.classList.remove("hidden");
            renderAppointments();
        } else {
            alert("Contraseña incorrecta.");
        }
    });

    function renderAppointments() {
        appointmentsList.innerHTML = "";
        appointments.forEach(({ name, phone, service, date, time }) => {
            const li = document.createElement("li");
            li.textContent = `${date} - ${time} | ${service} | ${name} (${phone})`;
            appointmentsList.appendChild(li);
        });
    }
});
