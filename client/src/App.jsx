import { useState, useEffect, useRef } from 'react'
import './App.css'
import logoChiapas from './assets/logoChiapasPuede.png'
import logoPolitecnica from './assets/logoPolitecnica.png'
import fotoCorreo from './assets/Correo.png'
import fotoDirección from './assets/Dirección.png'
import fotofacebok from './assets/facebok.png'
import fotoTelefono from './assets/Telefono.png'
import fotoWeb from './assets/web.png'
import fotoMas from './assets/signodemas.png'



//  Dirección del servidor: usa el mismo equipo desde el que abres la página
// (funciona con localhost y también con la IP de la red, por ejemplo desde el celular)
const API_URL = `http://${window.location.hostname}:5000`

//  Si la imagen se subió desde un dispositivo, se guarda como "/uploads/..." y aquí se completa su dirección
const urlImagen = (u) => (u && u.startsWith('/uploads/') ? `${API_URL}${u}` : u)

//  Imágenes del carrusel: se toman solas de la carpeta src/assets/carrusel (en orden: 1, 2, 3...)
const IMAGENES_CARRUSEL = Object.entries(
  import.meta.glob('./assets/carrusel/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url)

//  Carrusel de imágenes (cambia solo cada 5 segundos, con flechas, puntos y deslizar con el dedo)
function Carrusel({ imagenes, isMobile }) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const inicioToque = useRef(null)
  const total = imagenes.length

  const siguiente = () => setIndice((i) => (i + 1) % total)
  const anterior = () => setIndice((i) => (i - 1 + total) % total)

  // Avance automático (se detiene mientras tienes el cursor encima)
  useEffect(() => {
    if (pausado || total < 2) return
    const temporizador = setInterval(() => setIndice((i) => (i + 1) % total), 5000)
    return () => clearInterval(temporizador)
  }, [pausado, total])

  if (total === 0) return null   // si la carpeta está vacía, no muestra nada

  const estiloFlecha = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: isMobile ? '34px' : '46px',
    height: isMobile ? '34px' : '46px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#ffffff',
    fontSize: isMobile ? '1.2rem' : '1.6rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  }

  return (
    <div
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onTouchStart={(e) => { inicioToque.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (inicioToque.current === null) return
        const diferencia = e.changedTouches[0].clientX - inicioToque.current
        if (diferencia > 50) anterior()
        else if (diferencia < -50) siguiente()
        inicioToque.current = null
      }}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto 25px auto',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
        aspectRatio: isMobile ? '16 / 9' : '16 / 6',   /*  forma del carrusel */
        backgroundColor: '#2b2927'
      }}
    >
      {/* Tira con todas las imágenes: se desliza de lado */}
      <div style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        transform: `translateX(-${indice * 100}%)`,
        transition: 'transform 0.6s ease'
      }}>
        {imagenes.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Imagen ${i + 1} del carrusel`}
            style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ))}
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button onClick={anterior} aria-label="Imagen anterior" style={{ ...estiloFlecha, left: '12px' }}>‹</button>
          <button onClick={siguiente} aria-label="Imagen siguiente" style={{ ...estiloFlecha, right: '12px' }}>›</button>
        </>
      )}

      {/* Puntos indicadores */}
      {total > 1 && (
        <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 2 }}>
          {imagenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
              style={{
                width: i === indice ? '26px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: i === indice ? '#ffffff' : 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

//  Colores sugeridos para el recuadro de las publicaciones
const COLORES_RECUADRO = [
  { nombre: 'Gris (original)', valor: '#f1f1f1' },
  { nombre: 'Blanco', valor: '#ffffff' },
  { nombre: 'Rosa claro', valor: '#fde7f1' },
  { nombre: 'Verde agua claro', valor: '#d9f2ee' },
  { nombre: 'Amarillo claro', valor: '#fff3cd' },
  { nombre: 'Magenta', valor: '#c50069' },
  { nombre: 'Verde', valor: '#0ba495' },
  { nombre: 'Oscuro', valor: '#9633a8' }
]

//  Dice si un color de fondo es oscuro (para poner el texto en blanco y que se lea)
const esColorOscuro = (hex) => {
  let h = (hex || '#f1f1f1').replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55
}

//  Convierte un título en texto simple ("¿Qué es...?" -> "que-es"); lo usan los enlaces del menú
const slug = (texto) =>
  (texto || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

//  Tarjeta reutilizable de publicación (con botones Editar / Eliminar para el administrador)
function TarjetaPublicacion({ pub, isMobile, esAdmin, onEditar, onEliminar, onAmpliar }) {
  const fondo = pub.color || '#f1f1f1'
  const oscuro = esColorOscuro(fondo)

  // Todo es opcional: se dibuja únicamente lo que la publicación tenga
  const tieneTitulo = Boolean((pub.titulo || '').trim())
  const tieneTexto = Boolean((pub.texto || '').trim())
  const tieneImagen = Boolean(pub.imagenUrl)
  const soloImagen = tieneImagen && !tieneTitulo && !tieneTexto   // publicación de solo imagen: se muestra grande y centrada
  const imagenGrande = tieneImagen && pub.tamanoImagen === 'grande'   // imagen a todo lo ancho, debajo del texto

  return (
    <div data-seccion={slug(pub.titulo)} style={{
      backgroundColor: fondo,
      padding: isMobile ? '25px 20px' : '40px 30px',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgb(201, 149, 133)',
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '25px'
    }}>

      {/* Fila superior: texto + imagen */}
      <div style={{
        display: 'flex',
        flexDirection: (isMobile || imagenGrande) ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '30px'
      }}>
        {/* Texto: el título y el cuerpo son opcionales */}
        {(tieneTitulo || tieneTexto) && (
          <div style={{ flex: '1', minWidth: 0, textAlign: 'center' }}>
            {tieneTitulo && (
              <h2 style={{ margin: tieneTexto ? '0 0 15px 0' : '0', color: oscuro ? '#ffffff' : '#c50069', fontSize: isMobile ? '1.4rem' : '1.8rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', overflowWrap: 'anywhere' }}>
                {pub.titulo}
              </h2>
            )}
            {tieneTexto && (
              <p style={{ margin: '0', color: oscuro ? '#ffffff' : '#000000', fontSize: isMobile ? '1.0rem' : '1.1rem', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', textAlign: isMobile ? 'center' : 'justify', overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>
                {pub.texto}
              </p>
            )}
          </div>
        )}

        {/* Imagen y pie de imagen: opcionales (si es lo único que hay, se muestra más grande) */}
        {tieneImagen && (
          <div style={{
            // Ancho definido: así un pie de imagen largo se acomoda dentro de esta caja
            // y nunca le quita el espacio al texto
            flexShrink: 0,
            width: imagenGrande
              ? '100%'
              : soloImagen
                ? (isMobile ? '100%' : '420px')
                : (isMobile ? '100%' : '220px'),
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <img
              src={urlImagen(pub.imagenUrl)}
              alt="Imagen"
              title="Clic para ampliar"
              onClick={() => onAmpliar && onAmpliar(urlImagen(pub.imagenUrl))}
              style={{
                width: imagenGrande
                  ? '100%'
                  : soloImagen
                    ? (isMobile ? '100%' : '420px')
                    : (isMobile ? '130px' : '160px'),
                maxWidth: imagenGrande ? '900px' : '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.15)',
                cursor: 'zoom-in'
              }}
            />
            {pub.descripcionImagen && (
              <span style={{ marginTop: '8px', width: '100%', textAlign: 'center', overflowWrap: 'anywhere', fontSize: '0.8rem', lineHeight: '1.4', fontStyle: 'italic', color: oscuro ? '#eeeeee' : '#555', fontFamily: 'Arial, sans-serif' }}>
                {pub.descripcionImagen}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Fila inferior: botones (solo el administrador los ve) */}
      {esAdmin && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          paddingTop: '15px',
          borderTop: oscuro ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(0,0,0,0.12)'
        }}>
          <button
            onClick={() => onEditar(pub)}
            style={{ backgroundColor: '#0ba495', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Editar
          </button>
          <button
            onClick={() => onEliminar(pub)}
            style={{ backgroundColor: '#b9262e', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  )
}


//  Visor: muestra la imagen en grande sobre toda la pantalla (clic fuera, ✕ o Esc para cerrar)
function VisorImagen({ src, onCerrar }) {
  useEffect(() => {
    const alPulsar = (e) => { if (e.key === 'Escape') onCerrar() }
    window.addEventListener('keydown', alPulsar)
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'   // evita que la página se mueva detrás
    return () => {
      window.removeEventListener('keydown', alPulsar)
      document.body.style.overflow = overflowAnterior
    }
  }, [onCerrar])

  return (
    <div
      onClick={onCerrar}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 15px 70px 15px', boxSizing: 'border-box', cursor: 'zoom-out'
      }}
    >
      <button
        onClick={onCerrar}
        aria-label="Cerrar"
        style={{ position: 'absolute', top: '15px', right: '20px', width: '44px', height: '44px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '1.5rem', cursor: 'pointer' }}
      >
        ✕
      </button>

      <img
        src={src}
        alt="Imagen ampliada"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#ffffff', cursor: 'default' }}
      />

      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', bottom: '20px', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '0.95rem', textDecoration: 'underline' }}
      >
        Abrir imagen original en una pestaña nueva ↗
      </a>
    </div>
  )
}


function App() {
  // Estado para detectar si la pantalla es de un celular (menos de 600px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)

  // Estado agregado aquí para controlar el despliegue del modal de materiales
  const [mostrarMateriales, setMostrarMateriales] = useState(false)

  // Tus tres estados agregados abajo:
  const [mostrarFormulario, setMostrarFormulario] = useState(false) 
  const [usuarioActual, setUsuarioActual] = useState({ name: "Horacio", rol: "administrador" })
  const [formData, setFormData] = useState({ titulo: '', texto: '', imagenUrl: '', descripcionImagen: '', color: '#f1f1f1', destino: 'avisos', tamanoImagen: 'chica' })
  //  Guarda el _id de la publicación que se está editando (null = estamos creando una nueva)
  const [editandoId, setEditandoId] = useState(null)
  //  Imagen elegida desde el dispositivo (archivo), su vista previa y el estado de "subiendo"
  const [archivoImagen, setArchivoImagen] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState('')
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const inputArchivoRef = useRef(null)
  //  Dirección de la imagen que se está viendo en grande ('' = ninguna)
  const [imagenAmpliada, setImagenAmpliada] = useState('')
  //  Agrega esta línea para que el enlace de Avisos sepa qué hacer y no dé pantalla blanca:
  const [pestanaActiva, setPestanaActiva] = useState("inicio");




  //  ¡JUSTO AQUÍ VA COLOCADA LA LÍNEA!
  const [publicaciones, setPublicaciones] = useState([]) 

  // Abajo de esto continúa tu bloque de useEffect()...
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600)
// ...
    
    // Función que lee los registros guardados en MongoDB
    const cargarPublicaciones = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/api/publicaciones`)
        if (respuesta.ok) {
          const datos = await respuesta.json()
          setPublicaciones(datos) // Llena el muro dinámico con las tarjetas guardadas
        }
      } catch (error) {
        console.error("Error al conectar con el servidor backend:", error)
      }
    }

    cargarPublicaciones() //  Trae las publicaciones inmediatamente
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //  2. CONTROLADOR REAL CONECTADO A MONGO DB (Sustituye a tus handleChange y handleSubmit anteriores)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  //  Limpia la imagen elegida (archivo y vista previa)
  const limpiarSeleccionImagen = () => {
    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia)
    setArchivoImagen(null)
    setVistaPrevia('')
    if (inputArchivoRef.current) inputArchivoRef.current.value = ''
  }

  //  Cuando eliges una foto de tu galería o computadora
  const handleArchivo = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      alert(' Solo se pueden subir imágenes (JPG, PNG, WEBP o GIF).')
      e.target.value = ''
      return
    }
    if (archivo.size > 5 * 1024 * 1024) {
      alert(' La imagen pesa más de 5 MB. Elige una más ligera.')
      e.target.value = ''
      return
    }

    if (vistaPrevia) URL.revokeObjectURL(vistaPrevia)
    setArchivoImagen(archivo)
    setVistaPrevia(URL.createObjectURL(archivo))
  }

  //  Quita la imagen de la publicación (la elegida y la que ya tenía guardada)
  const quitarImagen = () => {
    limpiarSeleccionImagen()
    setFormData({ ...formData, imagenUrl: '' })
  }

  const FORM_VACIO = { titulo: '', texto: '', imagenUrl: '', descripcionImagen: '', color: '#f1f1f1', destino: 'avisos', tamanoImagen: 'chica' }

  //  Cancela la edición (o cierra el formulario) y limpia los campos
  const cancelarEdicion = () => {
    setEditandoId(null)
    setFormData(FORM_VACIO)
    limpiarSeleccionImagen()
    setMostrarFormulario(false)
  }

  //  Carga una publicación en el formulario para modificarla
  const handleEditar = (pub) => {
    limpiarSeleccionImagen()
    setEditandoId(pub._id)
    setFormData({
      titulo: pub.titulo || '',
      texto: pub.texto || '',
      imagenUrl: pub.imagenUrl || '',
      descripcionImagen: pub.descripcionImagen || '',
      color: pub.color || '#f1f1f1',
      destino: pub.destino || 'avisos',
      tamanoImagen: pub.tamanoImagen || 'chica'
    })
    setMostrarFormulario(true)
    setTimeout(() => {
      document.getElementById('formulario-publicacion')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  //  Elimina una publicación (pide confirmación)
  const handleEliminar = async (pub) => {
    if (!window.confirm(`¿Seguro que quieres eliminar la publicación "${pub.titulo}"?`)) return

    try {
      const respuesta = await fetch(`${API_URL}/api/publicaciones/${pub._id}`, { method: 'DELETE' })
      if (respuesta.ok) {
        setPublicaciones(publicaciones.filter(p => p._id !== pub._id))
        if (editandoId === pub._id) cancelarEdicion()
      } else {
        const detalle = await respuesta.text().catch(() => '')
        console.error("DELETE falló:", respuesta.status, detalle)
        alert(` No se pudo eliminar (error ${respuesta.status}). ` +
          (respuesta.status === 404
            ? "El servidor no encontró la ruta DELETE /api/publicaciones/:id. Agrégala en tu backend y reinicia el servidor."
            : "Revisa la consola del servidor (la terminal donde corre node index.js)."))
      }
    } catch (error) {
      console.error("Error al eliminar:", error)
      alert(" No hay comunicación con el Backend.")
    }
  }

  //  Crea una publicación nueva (POST) o guarda los cambios de una existente (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Todo es opcional, pero no se puede publicar algo completamente vacío
    const hayImagen = Boolean(archivoImagen || (formData.imagenUrl || '').trim())
    if (!formData.titulo.trim() && !formData.texto.trim() && !hayImagen) {
      alert(' La publicación está vacía. Escribe un título, un texto o elige una imagen.')
      return
    }

    const editando = Boolean(editandoId)
    const url = editando
      ? `${API_URL}/api/publicaciones/${editandoId}`
      : `${API_URL}/api/publicaciones`

    try {
      //  Si elegiste una imagen de tu dispositivo, primero se sube al servidor
      let imagenFinal = formData.imagenUrl
      if (archivoImagen) {
        setSubiendoImagen(true)
        const datosImagen = new FormData()
        datosImagen.append('imagen', archivoImagen)

        const respImagen = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: datosImagen })
        const datosResp = await respImagen.json().catch(() => ({}))

        if (!respImagen.ok) {
          alert(` No se pudo subir la imagen: ${datosResp.mensaje || 'error ' + respImagen.status}`)
          return
        }
        imagenFinal = datosResp.url   // ejemplo: /uploads/1699999999-ab12cd34.jpg
      }

      const respuesta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: formData.titulo,
          texto: formData.texto,
          imagenUrl: imagenFinal,
          descripcionImagen: formData.descripcionImagen,
          color: formData.color,
          destino: formData.destino,
          tamanoImagen: formData.tamanoImagen
        })
      })

      if (respuesta.ok) {
        const resultado = await respuesta.json()
        const guardada = resultado.data || resultado

        if (editando) {
          // Reemplaza la tarjeta editada en la lista
          setPublicaciones(publicaciones.map(p => (p._id === editandoId ? guardada : p)))
        } else {
          // Inserta la nueva al inicio de la lista
          setPublicaciones([guardada, ...publicaciones])
        }

        const destinoGuardado = guardada.destino || formData.destino;

        // Nombre de la vista donde quedó la publicación (para el mensaje final)
        const nombreDestino =
          destinoGuardado === 'principal'
            ? 'la pantalla principal'
            : destinoGuardado === 'proceso'
              ? 'Proceso - Fechas'
              : 'Avisos';

        setEditandoId(null);
        setFormData(FORM_VACIO);
        limpiarSeleccionImagen();
        setMostrarFormulario(false);

        // Lleva al administrador a la vista donde quedó la publicación
        setPestanaActiva(destinoGuardado === 'principal' ? 'inicio' : destinoGuardado);

        window.scrollTo({ top: 0, behavior: 'smooth' });

        alert(editando
          ? ` Publicación actualizada. Se muestra en ${nombreDestino}.`
          : ` ¡Publicación guardada! Se muestra en ${nombreDestino}.`)
      } else {
        console.error("Guardar falló:", respuesta.status)
        alert(` El servidor rechazó los datos (error ${respuesta.status}). ` +
          (editando && respuesta.status === 404
            ? "Falta la ruta PUT /api/publicaciones/:id en tu backend."
            : "Revisa la consola del servidor."))
      }
    } catch (error) {
      console.error("Error crítico de conexión:", error)
      alert(" No hay comunicación con el Backend. Asegúrate de que encendiste tu servidor ejecutando 'node index.js' en la carpeta server")
    } finally {
      setSubiendoImagen(false)
    }
  }

  //  Cambia a Inicio y se desplaza a la primera publicación cuyo título contenga esa palabra
  // (ejemplo: una publicación titulada "Proceso de Alfabetización" responde al enlace "Proceso")
  const irASeccion = (e, clave) => {
    e.preventDefault()
    setPestanaActiva("inicio")
    setTimeout(() => {
      const destino = document.querySelector(`[data-seccion*="${clave}"]`)
      if (destino) destino.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  //  Obtiene la fecha de creación (si no existe createdAt, la saca del _id de MongoDB)
  const obtenerFecha = (pub) =>
    pub.createdAt
      ? new Date(pub.createdAt)
      : new Date(parseInt(pub._id.substring(0, 8), 16) * 1000)

  //  Cuántos días se considera "reciente" (cámbialo a tu gusto)
  const DIAS_RECIENTES = 7

  //  Pantalla principal: todas las publicaciones con ese destino, en el orden en que se crearon
  const publicacionesPrincipal = [...publicaciones]
    .filter(pub => pub.destino === 'principal')
    .sort((a, b) => obtenerFecha(a) - obtenerFecha(b))

  //  Proceso - Fechas: en el orden en que se crearon (la primera arriba)
  const publicacionesProceso = [...publicaciones]
    .filter(pub => pub.destino === 'proceso')
    .sort((a, b) => obtenerFecha(a) - obtenerFecha(b))

  //  Avisos: solo los recientes, de la más nueva a la más vieja
  const publicacionesRecientes = [...publicaciones]
    .filter(pub => (pub.destino || 'avisos') === 'avisos')
    .sort((a, b) => obtenerFecha(b) - obtenerFecha(a))
    .filter(pub => (Date.now() - obtenerFecha(pub)) / (1000 * 60 * 60 * 24) <= DIAS_RECIENTES)
  // Alternativa: mostrar solo las últimas 5 -> sustituye el .filter(...) por .slice(0, 5)

  //  El panel de administrador solo aparece al entrar por esta ruta secreta
  const RUTA_ADMIN = "/1298347605-092467hjgdsa";  // se puede modificar la palabra
  const esAdmin = window.location.pathname === RUTA_ADMIN;

  return (
    <div style={{
      padding: isMobile ? '20px 10px' : '40px 20px',
      textAlign: 'center',
      backgroundColor: '#d2c2b4',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }}>

          {/* CABECERA: Forzada en una sola fila horizontal para computadoras y celulares */}
      <div style={{
        display: 'flex',
        flexDirection: 'row', //  SIEMPRE EN FILA HORIZONTAL
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: isMobile ? '8px' : '20px', // Menos espacio de separación en celular
        marginTop: '0px',
        width: '100%',
        maxWidth: '1300px', 
        margin: '0 auto',   
        boxSizing: 'border-box'
      }}>

        {/* LOGO IZQUIERDO */}
        <img
          src={logoChiapas}
          alt="Logo Chiapas Puede"
          style={{ 
            width: isMobile ? '65px' : '140px', //  Más pequeño en celular para que quepa de lado
            height: 'auto', 
            flexShrink: 0,
            display: 'block'
          }}
        />

        {/* RECUADRO BLANCO CON EL TÍTULO */}
        <div style={{
          backgroundColor: '#fffafd',
          padding: isMobile ? '8px 10px' : '15px 30px', // Menos relleno en celular
          boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          flex: '1', 
          margin: isMobile ? '0 5px' : '0 20px', // Márgenes pequeños a los lados
          maxWidth: '1300px', 
          boxSizing: 'border-box'
        }}>
          <h1 style={{
            margin: '0',
            color: '#b9262e',
            fontSize: isMobile ? '0.75rem' : '2.2rem', //  Texto más compacto para evitar que se rompa en mil líneas
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.3',
            letterSpacing: '0.5px',
            textAlign: 'center'
          }}>
            VOLUNTARIADO "CHIAPAS PUEDE"
          </h1>
        </div>

        {/* LOGO DERECHO */}
        <img
          src={logoPolitecnica}
          alt="Logo Universidad Politécnica"
          style={{ 
            width: isMobile ? '55px' : '100px', //  Más pequeño en celular para mantener la simetría
            height: 'auto', 
            flexShrink: 0,
            display: 'block'
          }}
        />
      </div>

    
      {/* MENÚ DE NAVEGACIÓN RESPONSIVO */}
      <div
        style={{
          backgroundColor: '#fffafd',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          margin: '15px auto 25px auto',
          maxWidth: '1300px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '12px 15px' : '20px 25px'
        }}
      >
        {/* PANTALLA PRINCIPAL */}
        <button
          onClick={() => setPestanaActiva("inicio")}
          style={{
            background: 'transparent',
            border: 'none',
            color: pestanaActiva === "inicio" ? '#b9262e' : '#333',
            fontFamily: 'Arial, sans-serif',
            fontWeight: pestanaActiva === "inicio" ? 'bold' : '500',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            cursor: 'pointer'
          }}
        >
          ¿QUÉ ES?
        </button>

        {/* PROCESO - FECHAS */}
        <button
          onClick={() => setPestanaActiva("proceso")}
          style={{
            background: 'transparent',
            border: 'none',
            color: pestanaActiva === "proceso" ? '#b9262e' : '#333',
            fontFamily: 'Arial, sans-serif',
            fontWeight: pestanaActiva === "proceso" ? 'bold' : '500',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            cursor: 'pointer'
          }}
        >
          Proceso - Fechas
        </button>

        {/* AVISOS */}
        <button
          onClick={() => setPestanaActiva("avisos")}
          style={{
            background: 'transparent',
            border: 'none',
            color: pestanaActiva === "avisos" ? '#b9262e' : '#333',
            fontFamily: 'Arial, sans-serif',
            fontWeight: pestanaActiva === "avisos" ? 'bold' : '500',
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            cursor: 'pointer'
          }}
        >
          Avisos
        </button>
      </div>



      {/*  CARRUSEL DE IMÁGENES (arriba, debajo del menú; solo en Inicio) */}
      {pestanaActiva === "inicio" && (
        <Carrusel imagenes={IMAGENES_CARRUSEL} isMobile={isMobile} />
      )}

      {/*  INTERRUPTOR MAESTRO DE VISTAS (Fuera del menú de navegación) */}
      {/* Cada vista muestra solo las publicaciones creadas con su destino */}

      {/*  AVISOS: publicaciones con destino "Avisos" (solo las recientes) */}
      {pestanaActiva === "avisos" && (
        <div style={{ width: '100%', maxWidth: '1300px', margin: '20px auto', boxSizing: 'border-box' }}>

          {/*  RECUADRO DEL ENCABEZADO DE AVISOS (mismo estilo que los demás recuadros) */}
          <div style={{
            backgroundColor: '#fffafd',
            padding: isMobile ? '25px 15px' : '35px 30px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
            marginBottom: '40px'   /*  espacio entre el recuadro y las publicaciones */
          }}>
            <h1 style={{
              color: '#b9262e',
              fontFamily: 'Arial, sans-serif',
              fontSize: isMobile ? '1.6rem' : '2.2rem',
              margin: '0'
            }}>
               Avisos recientes
            </h1>

          </div>

          {publicacionesRecientes.length === 0 ? (
            <p style={{ color: '#333', fontFamily: 'Arial, sans-serif', fontSize: '1.1rem' }}>
              No hay avisos nuevos por el momento.
            </p>
          ) : (
            publicacionesRecientes.map((pub) => (
              <TarjetaPublicacion
                key={pub._id || pub.id}
                pub={pub}
                isMobile={isMobile}
                esAdmin={esAdmin}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onAmpliar={setImagenAmpliada}
              />
            ))
          )}

          {/*  Botón de volver: solo existe dentro de Avisos */}
          <button
            onClick={() => setPestanaActiva("inicio")}
            style={{ backgroundColor: '#0ba495', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}
          >
             Volver a la Página de Inicio
          </button>
        </div>
      )}

      {/*  PROCESO - FECHAS: publicaciones con destino "Proceso - Fechas" */}
      {pestanaActiva === "proceso" && (
        <div style={{ width: '100%', maxWidth: '1300px', margin: '20px auto', boxSizing: 'border-box' }}>

          {/*  RECUADRO DEL ENCABEZADO DE PROCESO - FECHAS */}
          <div style={{
            backgroundColor: '#fffafd',
            padding: isMobile ? '25px 15px' : '35px 30px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            width: '100%',
            boxSizing: 'border-box',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h1 style={{
              color: '#b9262e',
              fontFamily: 'Arial, sans-serif',
              fontSize: isMobile ? '1.6rem' : '2.2rem',
              margin: '0'
            }}>
               Proceso - Fechas
            </h1>
          </div>

          {publicacionesProceso.length === 0 ? (
            <p style={{ color: '#333', fontFamily: 'Arial, sans-serif', fontSize: '1.1rem' }}>
              {esAdmin
                ? 'Aún no hay publicaciones en Proceso - Fechas. Usa "Agregar publicación" (al final de la página) y elige "Proceso - Fechas".'
                : 'Pronto publicaremos aquí la información del proceso y sus fechas.'}
            </p>
          ) : (
            publicacionesProceso.map((pub) => (
              <TarjetaPublicacion
                key={pub._id || pub.id}
                pub={pub}
                isMobile={isMobile}
                esAdmin={esAdmin}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onAmpliar={setImagenAmpliada}
              />
            ))
          )}
        </div>
      )}

      {/*  PANTALLA PRINCIPAL: muestra las publicaciones creadas con destino "Pantalla principal" */}
      {pestanaActiva === "inicio" && (
        <div style={{ width: '100%', maxWidth: '1300px', margin: '0 auto', boxSizing: 'border-box' }}>
          {publicacionesPrincipal.length === 0 ? (
            <p style={{ color: '#333', fontFamily: 'Arial, sans-serif', fontSize: '1.1rem', margin: '30px 0' }}>
              {esAdmin
                ? 'Aún no hay publicaciones en la pantalla principal. Usa "Agregar publicación" (al final de la página) y elige "Pantalla principal".'
                : 'Pronto publicaremos más información aquí.'}
            </p>
          ) : (
            publicacionesPrincipal.map((pub) => (
              <TarjetaPublicacion
                key={pub._id || pub.id}
                pub={pub}
                isMobile={isMobile}
                esAdmin={esAdmin}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                onAmpliar={setImagenAmpliada}
              />
            ))
          )}
        </div>
      )}

        {/*  NUEVO CONTENEDOR DE CONTACTOS DE LADO A LADO */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', /* Se apilan en celular, van lado a lado en PC */
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '25px',
        maxWidth: '1300px', /* Ajustado a 900px para alinearse perfecto con tus tarjetas de arriba */
        margin: '40px auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* RECUADRO IZQUIERDO: Datos directos */}
        <div style={{
          backgroundColor: '#fffafd',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          flex: '1',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#b9262e', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
            Contacto Oficial
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={fotoTelefono} alt="Teléfono" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}> +52 1 962 184 1202 </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={fotoCorreo} alt="Correo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}> chiapaspuede@uptap.gob.mx </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={fotoDirección} alt="Dirección" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Arial, sans-serif', color: '#333', fontSize: '0.95rem' }}> Carretera Tapachula - Puerto Madero KM. 24 + 300. Tapachula, Chiapas </span>
          </div>
        </div>

        {/* RECUADRO DERECHO: Redes Sociales */}
        <div style={{
          backgroundColor: '#fffafd',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          flex: '1',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#b9262e', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
            Nuestras Redes
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={fotofacebok} alt="Facebook" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <a href="https://www.facebook.com/share/1DyNwA2nEC/" target="_blank" rel="noreferrer" style={{ fontFamily: 'Arial, sans-serif', color: '#c50069', textDecoration: 'none', fontWeight: '500' }}>
              Universidad Politecnica
            </a>
          </div>
          
          {/* Nota: Mantenemos este ícono genérico o puedes importar uno de Instagram arriba si lo necesitas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={fotoWeb} alt="Sitio Web" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'hue-rotate(90deg)' }} />
            <a href="https://www.uptapachula.edu.mx/" target="_blank" rel="noreferrer" style={{ fontFamily: 'Arial, sans-serif', color: '#c50069', textDecoration: 'none', fontWeight: '500' }}>
              www.uptapachula
            </a>
          </div>
        </div>

      </div>

  
      {/*  AGREGA ESTE BLOQUE INTERACTIVO AQUÍ: */}
      {esAdmin && (
        <div style={{ width: '100%', maxWidth: '1300px', margin: '40px auto 0 auto' }}>
                  
                  
        <button
          onClick={() => {
            if (mostrarFormulario) {
              cancelarEdicion();
            } else {
              // Seleccionar el destino según la pestaña actual
              setFormData({
                ...FORM_VACIO,
                destino:
                  pestanaActiva === 'avisos'
                    ? 'avisos'
                    : pestanaActiva === 'proceso'
                      ? 'proceso'
                      : 'principal'
              });

              setMostrarFormulario(true);
            }
          }}
          style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '20px 15px' : '30px 40px',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            width: '100%',
            boxSizing: 'border-box',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h2
            style={{
              margin: '0',
              color: '#d2c2b4',
              fontSize: isMobile ? '1.2rem' : '1.4rem',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={fotoMas}
              alt="Agregar publicación"
              style={{
                width: '64px',
                height: '74px',
                objectFit: 'contain',
                filter: 'hue-rotate(90deg)',
                marginRight: '15px'
              }}
            />
            Agregar publicación
          </h2>
        </button>


          {mostrarFormulario && (
            <div id="formulario-publicacion" style={{ backgroundColor: '#fffafd', padding: '30px', borderRadius: '8px', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box', marginTop: '15px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ color: '#b9262e', margin: '0 0 10px 0', fontFamily: 'Arial, sans-serif', borderBottom: '2px solid #b9262e', paddingBottom: '8px' }}>{editandoId ? ' Editando publicación' : ' Crear Nueva Publicación'}</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/*  Aviso sobre los campos */}
                <div style={{ backgroundColor: '#fff3cd', color: '#5c4a00', padding: '12px 15px', borderRadius: '5px', fontFamily: 'Arial, sans-serif', fontSize: '0.95rem' }}>
                   Puedes publicar solo texto, solo una imagen o cualquier combinación. Lo único necesario es que la publicación tenga <b>al menos un título, un texto o una imagen</b>.
                </div>

                {/*  DESTINO: ¿dónde se mostrará esta publicación? */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>¿Dónde se mostrará?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                   
                
                    {[
                      { valor: 'principal', texto: ' Pantalla principal' },
                      { valor: 'proceso', texto: ' Proceso - Fechas' },
                      { valor: 'avisos', texto: ' Avisos' }
                    ].map((op) => (
                      <button
                        key={op.valor}
                        type="button"
                        onClick={() =>
                          setFormData((anterior) => ({
                            ...anterior,
                            destino: op.valor
                          }))
                        }
                        style={{
                          flex: '1 1 200px',
                          padding: '14px',
                          borderRadius: '5px',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          fontFamily: 'Arial, sans-serif',
                          cursor: 'pointer',
                          border:
                            formData.destino === op.valor
                              ? '3px solid #b9262e'
                              : '2px solid #bbb',
                          backgroundColor:
                            formData.destino === op.valor
                              ? '#fde7f1'
                              : '#ffffff',
                          color:
                            formData.destino === op.valor
                              ? '#b9262e'
                              : '#555'
                        }}
                      >
                        {op.texto}
                      </button>
                    ))}

                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Encabezado (opcional):</label>
                  <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} placeholder="Escribe el encabezado..." />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Información (opcional):</label>
                  <textarea name="texto" value={formData.texto} onChange={handleChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }} placeholder="Escribe la información..." />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Imagen:</label>
                  {/*  Subir una imagen desde el celular o la computadora */}
                  <input
                    ref={inputArchivoRef}
                    type="file"
                    accept="image/*"
                    onChange={handleArchivo}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px dashed #999', backgroundColor: '#ffffff', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                    Elige una foto de tu galería o computadora (JPG, PNG, WEBP o GIF, máximo 5 MB).
                  </span>

                  {/* Vista previa de la imagen elegida o de la que ya tenía la publicación */}
                  {(vistaPrevia || formData.imagenUrl) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <img
                        src={vistaPrevia || urlImagen(formData.imagenUrl)}
                        alt="Vista previa"
                        style={{ width: '140px', height: 'auto', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0,0,0,0.15)' }}
                      />
                      <button
                        type="button"
                        onClick={quitarImagen}
                        style={{ backgroundColor: '#b9262e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}

                  {/* Alternativa: pegar la URL de una imagen que ya está en internet */}
                  {!(formData.imagenUrl || '').startsWith('/uploads/') && (
                    <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} placeholder="…o pega la URL de una imagen (opcional)" />
                  )}
                </div>

                {/*  TAMAÑO DE LA IMAGEN (solo aparece cuando hay una imagen) */}
                {(vistaPrevia || formData.imagenUrl) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Tamaño de la imagen:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {[
                        { valor: 'chica', texto: ' Normal (al lado del texto)' },
                        { valor: 'grande', texto: ' Grande (a todo lo ancho)' }
                      ].map((op) => (
                        <button
                          key={op.valor}
                          type="button"
                          onClick={() => setFormData((anterior) => ({ ...anterior, tamanoImagen: op.valor }))}
                          style={{
                            flex: '1 1 200px',
                            padding: '14px',
                            borderRadius: '5px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                            cursor: 'pointer',
                            border: formData.tamanoImagen === op.valor ? '3px solid #b9262e' : '2px solid #bbb',
                            backgroundColor: formData.tamanoImagen === op.valor ? '#fde7f1' : '#ffffff',
                            color: formData.tamanoImagen === op.valor ? '#b9262e' : '#555'
                          }}
                        >
                          {op.texto}
                        </button>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Arial, sans-serif' }}>
                      Sea cual sea el tamaño, quien visite la página puede tocar la imagen para verla en pantalla completa.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Pie de imagen (opcional, se muestra debajo de la imagen):</label>
                  <input type="text" name="descripcionImagen" value={formData.descripcionImagen} onChange={handleChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} placeholder="Pie de imagen..." />
                </div>

                {/*  COLOR DEL RECUADRO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontFamily: 'Arial', fontWeight: 'bold', color: '#333' }}>Color del recuadro:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                    {COLORES_RECUADRO.map((c) => (
                      <button
                        key={c.valor}
                        type="button"
                        title={c.nombre}
                        onClick={() => setFormData({ ...formData, color: c.valor })}
                        style={{
                          width: '36px', height: '36px', borderRadius: '50%', backgroundColor: c.valor, cursor: 'pointer',
                          border: formData.color === c.valor ? '3px solid #b9262e' : '2px solid #bbb'
                        }}
                      />
                    ))}
                    {/* Selector libre: cualquier color que quieras */}
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      title="Elegir otro color"
                      style={{ width: '48px', height: '40px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    />
                  </div>

                  {/* Vista previa del color elegido */}
                  <div style={{
                    backgroundColor: formData.color,
                    color: esColorOscuro(formData.color) ? '#ffffff' : '#d487d2',
                    padding: '12px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center', fontFamily: 'Arial, sans-serif'
                  }}>
                    Así se verá el recuadro de tu publicación
                  </div>
                </div>

                <button type="submit" disabled={subiendoImagen} style={{ backgroundColor: subiendoImagen ? '#7fc9c1' : '#0ba495', color: 'white', padding: '14px', border: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', cursor: subiendoImagen ? 'wait' : 'pointer' }}>
                  {subiendoImagen ? ' Subiendo imagen...' : (editandoId ? ' Guardar cambios' : ' Publicar en el Muro')}
                </button>

                {editandoId && (
                  <button type="button" onClick={cancelarEdicion} style={{ backgroundColor: '#777', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {/* VISOR DE IMAGEN AMPLIADA */}
      {imagenAmpliada && (
        <VisorImagen src={imagenAmpliada} onCerrar={() => setImagenAmpliada('')} />
      )}

      {/* PIE DE PÁGINA: NOTA TÉCNICA RESPONSIVA */}
      <footer style={{ backgroundColor: '#2b2927', padding: isMobile ? '20px 15px' : '30px 40px', maxWidth: '1300px', margin: '40px auto 0 auto', borderRadius: '8px', textAlign: 'center', boxShadow: '0px 4px 10px rgba(0,0,0,0.15)', width: '100%', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#d2c2b4', fontSize: isMobile ? '1.2rem' : '1.4rem', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
          PROGRAMA DE ALFABETIZACIÓN CHIAPAS PUEDE
        </h2>

      </footer>

    </div>
  )
}

export default App

