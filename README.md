#como ejecutar la app#

1. Preparación del Entorno
Primero, necesitas configurar las variables de entorno. Crea un archivo .env en la raíz del proyecto.

DATABASE_URL=tu_url_de_postgresql
SESSION_SECRET=un_secreto_seguro
NODE_ENV=development

2. Instalación de Dependencias
Ejecuta los siguientes comandos en la terminal:

$ npm istall

3. Configuración de la Base de Datos:

$ npm run db:push

4. Ejecutar la Aplicación:

$ npm run dev

5. Verificar que todo funcione:
Una vez que la aplicación esté en ejecución, deberías poder:
Acceder a la aplicación en tu navegador
Ver la página de inicio
Iniciar sesión (si tienes credenciales configuradas)
Solución de Problemas Comunes
Si encuentras algún error, aquí hay algunas verificaciones que puedes hacer:
Error de Base de Datos:
Verifica que la URL de la base de datos sea correcta
Asegúrate de que la base de datos esté accesible
Verifica que las migraciones se hayan ejecutado correctamente
Error de Puerto:
Asegúrate de que el puerto 3000 no esté en uso
Si el puerto está ocupado, puedes cambiar el puerto en la configuración

Estructura de Archivos Importante:
/client: Contiene el código del frontend
/server: Contiene el código del backend
/shared: Contiene código compartido entre frontend y backend
drizzle.config.ts: Configuración de la base de datos
package.json: Scripts y dependencias del proyecto

Estructura de despliegue:
El frontend se construye con Vite y se sirve desde el servidor Express
El backend está en el directorio server/
La base de datos usa Drizzle ORM para las migraciones
Consideraciones importantes:
Asegúrate de que el puerto 3000 (o el que configures) esté disponible
La aplicación usa WebSocket para algunas funcionalidades, así que asegúrate de que tu entorno de pruebas soporte WebSocket
Para desarrollo local, puedes usar npm run dev que iniciará tanto el servidor como el cliente en modo desarrollo
Monitoreo:
En modo desarrollo, tendrás acceso a los logs del servidor en la consola
Los errores del frontend se mostrarán en el navegador
