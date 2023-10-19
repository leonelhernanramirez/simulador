// Variables JS necesarias
let alumnos = [];

// Función para crear campos de notas
function crearCamposNotas() {
  const numAlumnos = parseInt(document.getElementById("numAlumnos").value);
  const notasContainer = document.getElementById("notasContainer");
  notasContainer.innerHTML = "";

  alumnos = []; // Reinicializamos el array de alumnos

  for (let i = 1; i <= numAlumnos; i++) {
    const alumno = {
      nombre: `Alumno ${i}`,
      nota: 0 // Inicializamos la nota en 0
    };
    alumnos.push(alumno);

    notasContainer.innerHTML += `
      <div>
        <h3>${alumno.nombre}</h3>
        <label for="nota${i}">Nota:</label>
        <input type="number" id="nota${i}" min="0" max="100">
      </div>
    `;
  }
}

// Función para cargar datos de alumnos desde un archivo JSON local
function cargarDatosLocales() {
  // Realiza una solicitud GET para cargar el archivo JSON local
  axios.get('alumnos.json')
    .then(response => {
      // Maneja la respuesta exitosa aquí
      const data = response.data;
      console.log('Datos de alumnos obtenidos:', data);

      // Actualiza el array de alumnos con los datos cargados
      alumnos = data;

      // Llamar a otras funciones o actualizar la interfaz de usuario si es necesario
    })
    .catch(error => {
      // Maneja errores de la solicitud
      console.error('Error al cargar datos de alumnos:', error);
    });
}

// Función para calcular notas finales
function calcularNotasFinales() {
  const numAlumnos = parseInt(document.getElementById("numAlumnos").value);
  let sumaNotas = 0;

  for (let i = 0; i < numAlumnos; i++) {
    const nota = parseFloat(document.getElementById(`nota${i + 1}`).value);
    alumnos[i].nota = nota; // Actualizamos la nota en el objeto del alumno
    sumaNotas += nota;
  }

  const promedio = sumaNotas / numAlumnos;
  let mensaje = `El promedio de notas es ${promedio.toFixed(2)}. `;

  // Utilizamos métodos de búsqueda y filtrado en el array de alumnos
  const aprobados = alumnos.filter(alumno => alumno.nota >= 60);
  const desaprobados = alumnos.filter(alumno => alumno.nota < 60);

  mensaje += `Aprobados: ${aprobados.length}, Desaprobados: ${desaprobados.length}`;

  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = mensaje;

  // Almacenar los datos de los alumnos en LocalStorage como JSON
  localStorage.setItem("alumnosData", JSON.stringify(alumnos));

  // Mostrar el historial de notas en el área correspondiente
  const historialList = document.getElementById("historialList");
  historialList.innerHTML = ""; // Limpiar el historial antes de mostrarlo

  // Obtener y mostrar el historial de notas almacenado en LocalStorage
  const historialData = JSON.parse(localStorage.getItem("historialData")) || [];
  historialData.forEach(item => {
    historialList.innerHTML += `<li>${item}</li>`;
  });

  // Agregar la nota actual al historial y guardar en LocalStorage
  const notaActual = `Promedio: ${promedio.toFixed(2)}, Aprobados: ${aprobados.length}, Desaprobados: ${desaprobados.length}`;
  historialData.push(notaActual);
  localStorage.setItem("historialData", JSON.stringify(historialData));
}

// Detección de eventos cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos de alumnos desde LocalStorage si están disponibles
  const alumnosData = localStorage.getItem("alumnosData");
  if (alumnosData) {
    alumnos = JSON.parse(alumnosData);
  }

  // Llamar a la función crearCamposNotas al hacer clic en el botón
  document.getElementById("crearCamposButton").addEventListener("click", crearCamposNotas);

  // Llamar a la función cargarDatosLocales al hacer clic en el botón
  document.getElementById("cargarDatosLocalesButton").addEventListener("click", cargarDatosLocales);

  // Llamar a la función calcularNotasFinales al hacer clic en el botón
  document.getElementById("calcularNotasButton").addEventListener("click", calcularNotasFinales);
});