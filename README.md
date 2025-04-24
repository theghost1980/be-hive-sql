# BE-HiveSQL

Es un servidor backend que permite ejecutar consultas SQL a la blokchain de HIVE.

## Proposito Actual

Servir a aplicaciones / Frontends para usuarios HIVE que ya posean cuenta en [HIVE](https://hive.io/)
para tener opciones versatiles a la hora de obtener datos, cuentas y/o transacciones en la blockchain de HIVE.

## Caracteristicas del Backend

- Posee seguridad basada en [Hive Keychain](https://hive-keychain.com/) para establecer una unica manera de accesar a la data y hacer peticiones.
- Permite verificar al usuario y otorgarle un JWT token valido por 2H para que pueda consultar cuentas o hacer consultas SQL.
- Utiliza [mssql](https://www.npmjs.com/package/mssql) para el manejo de las consultas SQL desde nodejs.

En progreso Docs + CI/CD
