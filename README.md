# BE-HiveSQL

Es un servidor backend que permite ejecutar consultas SQL a la blokchain de HIVE.

## Proposito Actual

Servir a aplicaciones / Frontends para usuarios HIVE que ya posean cuenta en [HIVE](https://hive.io/)
para tener opciones versatiles a la hora de obtener datos, cuentas y/o transacciones en la blockchain de HIVE.

## Caracteristicas del Backend

- Posee seguridad basada en [Hive Keychain](https://hive-keychain.com/) para establecer una unica manera de accesar a la data y hacer peticiones.
- Permite verificar al usuario y otorgarle un JWT token valido por 2H para que pueda consultar cuentas o hacer consultas SQL.
- Utiliza [mssql](https://www.npmjs.com/package/mssql) para el manejo de las consultas SQL desde nodejs.

## Lentitud al revisar bloques en una blockchain?

Es algo comun en el ambito del desarrollo en [web3](https://es.wikipedia.org/wiki/Web3) que para leer los bloques de datos de una blockchain, el proceso pueda ser lento y un tanto tedioso. Es por eso que existen soluciones como [HiveSQL](https://hivesql.io/) que permite accesar a datos de la blockchain de HIVE, de manera mas eficiente y rapida.

//TODO below

## Ejemplo de logica de consulta en este servidor:

1. Hacemos inicio de sesión usando la extension Keychain. Debemos descargarla y configurarla. Mas info [aca](https://hive-keychain.com/).
2. El inicio de sesión consta de 2 pasos:
   2.1 Hacemos la peticion del challenge a firmar en la ruta:

En progreso Docs + CI/CD
