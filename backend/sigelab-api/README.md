# sigelab-api

> Sistema para Gestión de Laboratorios de la Universidad del Valle - SIGELAB -

------------

#### Flujo de Trabajo en el Repositorio

El repositorio está configurado con dos ramas, durante la etapa de desarrollo se trabaja sobre la rama **develop** y en la rama **master** se mantiene el codigo fuente que está en producción.

Todos los **desarrolladores** que contribuyen al repositorio ***sólo pueden realizar push sobre la rama develop*** y solo un usuario con el rol de administrador del repositorio puede hacer push o merge sobre la rama master.

El usuario con el rol de administrador del repositorio es el encargado de hacer cada merge de la rama develop a la rama master y generar tags de cada versión del repositorio que se despliega en producción.

------------

**1. Clonar repositorio**

`git clone git@gitlab.com:univalle/sigelab-api.git`

**2. Usar rama develop**

`git brach develop`

Los pasos **1. Clonar repositorio** y **2. Usar rama develop** sólo se deberían hacer una vez cuando el desarrollador se une al repositorio.

Se recomienda ejecutar un **pull cada vez que el desarrollador inicia trabajo al incio del día** para actualizar su repositorio local con los cambios que existan en el repositorio remoto.

**3. Actualizar repositorio local**

`git pull origin develop`

**4. Agregar cambios en repositorio local**

Para agregar cambios al repositorio local ejecutar desde la raiz del repositorio:

`git add .`

**5. Commit de cambios**

Para mantener un trazabilidad de los cambios generados en el repositorio se debe agregar a cada commit un mensaje descriptivo de forma clara y resumida sobre los cambios realizados, así los otros desarrolladores conocen claramente los cambios que se hicieron.

`git commit -m "Se actualiza el archivo README con descripcion del repositorio"`

Se recomienda ejecutar un **push cada vez que el desarrollador termina trabajo al final del día** para actualizar el repositorio remoto con los cambios de su repositorio local.

**5. Agregar cambios en repositorio remoto**

`git push origin develop`

Como parte del trabajo del equipo de desarrollo, el equipo debe adoptar una metodología para organizar su trabajo en el repositorio, solo el equípo de desarrollo es el responsable de administrar su trabajo en el repositorio para reducir tanto como sea posible la generación de conflictos en los cambios hechos en el repositorio al momento de realizar tareas de push o pull.

------------

#### Estructura del Repositorio

	sigelab-api/
		api/
		assets/
		config/
		docs/
		logs/
		tasks/
		test/
		views/
		.editorconfig
		.gitignore
		.sailsrc
		Gruntfile.js
		README.md
		app.js
		package.json

------------

#### Generar Documentación

```bash
./node_modules/.bin/jsdoc -c docs/conf.json -t node_modules/ink-docstrap/template/ -R README.md -r api -d docs/api/
```
# Sigelab API!

API para el consumo del servicio SAPS
api construida en [sails.js](https://sailsjs.com/) en la version 0.12 


# instalación 



 - clonar el repositorio
 - ingresar a la carpeta del proyecto `cd ..sigelab-api`
 - correr el comando `npm i`
 
## Configuración 

La url del servicio sabs a consultar se configura en la ruta `config/sabs.js` la variable `sabsUrl` debe contener la url del servicio antes de correr el proyecto


## Comandos

 - desarrollo `npm run dev`
 - producción `npm run  start`

después de correr cualquiera de estos comando el api estará corriendo en el puerto **1337**

## Consumo del API

el endpoint de consumo del api es `/inventario/buscar` en el caso de localhost seria `http://localhost:1337/inventario/buscar` debe ser una petición `POST` y el cuerpo de le petición  es:
|key:| value |
|--|--|
|codInventario:| "codigo de inventario" |
| codLab | "codigo del laboratorio" |
|nomLab:| "nombre laboratorio" |
|sede:| "sede" |
| edificio | "edificio" |
|espacio:| "espacio" |


## Despliegue en producción 

para el despliegue en producción se recomienda el uso de [PM2](http://pm2.keymetrics.io/), es un administrador de aplicaciones de node.
se puede seguir esta [guía](https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps) para su configuración.