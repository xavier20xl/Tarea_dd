const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const tareasFilePath = './tareas.json';

function leerTareas() {
  const data = fs.readFileSync(tareasFilePath);
  return JSON.parse(data);
}

function escribirTareas(tareas) {
  fs.writeFileSync(tareasFilePath, JSON.stringify(tareas, null, 2));
}

// Rutas
app.get('/tareas', (req, res) => {
  const tareas = leerTareas();
  res.json(tareas);
});

app.get('/tareas/:id', (req, res) => {
  const tareas = leerTareas();
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) return res.status(404).send('Tarea no encontrada');
  res.json(tarea);
});

app.post('/tareas', (req, res) => {
  const { titulo, descripcion } = req.body;
  if (!titulo || descripcion.length < 20) {
    return res.status(400).send('Título es obligatorio y la descripción debe tener al menos 20 caracteres.');
  }
  const tareas = leerTareas();
  const nuevaTarea = {
    id: tareas.length + 1,
    titulo,
    descripcion,
    completada: false,
    fecha_creacion: new Date()
  };
  tareas.push(nuevaTarea);
  escribirTareas(tareas);
  res.status(201).json(nuevaTarea);
});

app.put('/tareas/:id', (req, res) => {
  const { titulo, descripcion, completada } = req.body;
  const tareas = leerTareas();
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) return res.status(404).send('Tarea no encontrada');
  if (!titulo || descripcion.length < 20) {
    return res.status(400).send('Título es obligatorio y la descripción debe tener al menos 20 caracteres.');
  }
  tarea.titulo = titulo;
  tarea.descripcion = descripcion;
  tarea.completada = completada;
  escribirTareas(tareas);
  res.json(tarea);
});

app.delete('/tareas/:id', (req, res) => {
  const tareas = leerTareas();
  const tareaIndex = tareas.findIndex(t => t.id === parseInt(req.params.id));
  if (tareaIndex === -1) return res.status(404).send('Tarea no encontrada');
  tareas.splice(tareaIndex, 1);
  escribirTareas(tareas);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
