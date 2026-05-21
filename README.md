# Fotaza  2

## Objetivos 

- Desarrollar y poner en práctica los conocimientos adquiridos en la asignatura a partir del desarrollo de un caso de estudio. 

## Especificación del problema

- App Web que permita almacenar , ordenar , buscar , vender y compartir fotografias en linea , atraves de internet.

## Requerimientos minimos

- Autenticacion de usuarios.
  - Solo usuarios registrados y autenticados podran publicar imagenes en el sitio.
  - Usuarios anonimos podran ver contenido sin copyright.
- Gestion de contenido.
  - Podran postear publicaciones con titulo, descripcion (opcional), varias imagenes y varias etiquetas.
  - Las publicaciones se podran denunciar con motivo y descripcion. Si la publicacion tiene una denuncia no se podra editar.
    Si la publicacion tiene 3 denuncias pasara a una lista negra que vera el admin , donde puede desetimarlas o dar de baja la publicacion.
    Si el usuario tiene 3 publicaciones dadas de baja se inactivara su cuenta.
  - Se podran comentar las imagenes de la publicacion. Esta seccion se podra desactivar por el propietario , pero se vera el historial antes de que lo hiciera.
    Los comentarios pueden denunciarse (motivo y descripcion), solo el propietario podra verlas. El propietario puede borrar comentarios de sus publicaciones.
  - Las imagenes podran valorizarse por usuarios que no son propietarios de la publicación. Las imagenes mostraran una valorizacion promedio y la cantidad de las mismas.
  - El Home del usuario priorizara publicaciones con mayor valorizacion promedio y mayor cantidad de valorizaciones, pero debe haber un balance con las demas.
  - Las imagenes de cada publicacion tendran dos tipos de licencia, copyright y sin copyright. Cuando la imagen tenga la licencia copyright debera tener una marca de agua
    personalizada por el usuario.
  - Las imagenes tendran un boton "Quiero adquirirla" que notificara al propietario el perfil que desea hacerlo. Se debe proporcionar una mensajeria para que la transaccion 
    se lleve acabo.

- Motor de búsqueda de contenidos.
  - Se debe poder buscar imagenes/publicaciones.
  
- Seguimiento de usuario (Followers) 
  - Los usuarios podran seguir perfiles y otros perfiles los podran seguir. Un usuario no se podra seguir a si mismo y no se puede seguir mas de dos veces a un mismo usuario.
  
- Gestor de notificaciones
  - Los usuarios tendran una gestion de notificaciones que notificara de eventos como comentarios nuevos, valorizaciones nuevas de sus propias imagenes, intencio de adquirir 
    sus imagenes y nuevos seguimientos de usuarios.

- Gestión de colecciones o favoritos
  - Los usuarios podran guardar publicaciones en una seccion de favoritos que solo podra ver el propio usuario. Esta estara dividida en colecciones , las cuales no pueden tener 
    la misma publicacion repetida.