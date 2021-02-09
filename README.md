# Leanga - Node - Inverview
## Introducción

Este repositorio contiene el resultado final de una prueba de desarrollo en Node.js para la compañia Leanga Software. La prueba consiste en el desarrollo de una API haciendo uso de express.js y MongoDB para almacenar los datos de una inmobiliaria. El API debe permitir almacenar los datos, filtrarlos y obtener reportes. A continuación se describe cada uno de los requisitos y cómo se solucionaron. 

## Requisitos
### 1. Importación de datos
El objetivo principal era crear una función de Node, en la cual se indicara la ruta del archivo en formato csv y esta fuera capas de leer e insertar los valores en una base de datos. Para cumplir con este requisito se implementó un servicio a través de la ruta `http://localhost:3000/uploadcsv` que permite a un usuario subir el archivo manualmente. El servidor internamente guarda localmente el archivo y luego lo lee para almacenar los registro en la base de datos de MongoDB. 

### 2. Filtrar datos
Se pide la implementación de servicio a través de un método GET el cual permita pasar atributos para poder filtrar el resultado por un rango de precios y el número de habitaciones. Para satisfacer este requisito se implementó un servico a través de la ruta `http://localhost:3000/checkhouses`. Por ejemplo para consultar las casas que tiene un precio entre 750 y 900 euros con dos habitaciones, se debe pasar hacer la petición GET a la siguiente ruta: `http://localhost:3000/checkhouses?Precio=__range_750_900&Habitaciones=2`.

### 3. Procesar datos
Se necesita una función que retorne el precio promedio del metro cuadrado para un perímetro definido por los siguientes parámetros: Latitud, Longitud y Distancia (km). Para determinar el perímetro, primero se usó la distancia entre dos puntos $x=(x_1, x_2) e $y=(y_1, y_2)$ dada por la formula de haversine:

 $$ D(x, y) = 2\arcsin\sqrt{\sin^2((x_1 - y_1) / 2) + \cos(x_1)\cos(y_1)\sin^2((x_2 - y_2) / 2)}.$$

Teniendo en cuenta el perimetro definido por esta ecuación, se procede a calcular el promedio por metro cuadrado. Para hacer uso de esta funcionalidad se puede acceder a la ruta: `http://localhost:3000/avaragepricepersquaremeter/`. Por ejemplo, para determinar el precio promedio de las casas que se  encuentra en un perímetro con Latitud de 40.9, Longitud de -3.2 y un radio de 70 km, la consulta se debe realizar así: `http://localhost:3000/avaragepricepersquaremeter?Latitud=40.9&Longitud=-3.2&Distancia=70`.

### 4. Reportes
Se requiere un servicio al cual se le pasa varios atributos de filtro y genera un reporte (PDF, CSV) que se guargda en una carpeta. Para este requisito se implementó un servicio que permite enviar un filtro con cualquier tipo de parámetros, este realiza una consulta a base de datos, extrae la información y la guarda en una carpeta local del servidor. Finalmente, regresa un documento tipo CSV al cliente. Para hacer uno de este servicio se deben pasar los parámetros del filtro a la siguiente ruta: `http://localhost:3000/report`.

### 5. Resetear la base de datos

Se implentó un servicio para resetear la base de datos, este se encuentra en: `http://localhost:3000/resetdb`.

## Servidor de pruebas.

El API se encuentra disponible de un servidor de Heroku y se pueden hacer pruebas a traves de Swagger. 

