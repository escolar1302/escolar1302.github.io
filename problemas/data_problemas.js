const bancoDeProblemas = [
    // ==========================================
    // NIVEL 1: Hasta 3 cifras (1 Operación)
    // ==========================================
    {
        id: 101,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🏫 En una escuela había 265 libros y llegaron 143 más. ¿Cuántos libros hay ahora?"
    },
    {
        id: 102,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🛒 Un kiosco tenía 156 caramelos y compró 138 más. ¿Cuántos caramelos tiene en total?"
    },
    {
        id: 103,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🏡 Una familia recorrió 124 km por la mañana y 162 km por la tarde. ¿Cuántos kilómetros recorrieron en total?"
    },
    {
        id: 104,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🧒 Tomás tiene 312 figuritas y Carla tiene 278. ¿Cuántas más tiene Tomás que Carla?"
    },
    {
        id: 105,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "📦 Una caja puede contener 500 confites. Actualmente hay 347. ¿Cuántos faltan para llenarla?"
    },
    {
        id: 106,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🍨 Una heladería vendió 390 helados el viernes y 365 el sábado. ¿Cuántos más vendió el viernes?"
    },
    {
        id: 107,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧮 Bruno tenía 290 bolitas. Le regalaron 65 y luego perdió 38. ¿Con cuántas terminó?"
    },
    {
        id: 108,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "♻️ Una escuela recolectó 178 botellas y otra 152. Luego la primera perdió 40. ¿Cuántas más tiene la otra ahora?"
    },
    {
        id: 109,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🏅 El equipo rojo hizo 278 puntos y el azul 236. ¿Cuántos puntos más hizo el equipo rojo?"
    },
    {
        id: 110,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "📚 En una librería había 195 cuadernos. Trajeron 104 más. ¿Cuántos hay ahora?"
    },
    {
        id: 111,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "💧 Un tanque puede almacenar 900 litros de agua. Tiene 768. ¿Cuántos litros faltan para llenarlo?"
    },
    {
        id: 112,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🚴‍♂️ Camila recorrió 142 km en bici y luego 185 km más. ¿Cuántos km hizo en total?"
    },
    {
        id: 113,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🎒 Lautaro tenía 860 pesos. Gastó 340 en una mochila. ¿Cuánto le quedó?"
    },
    {
        id: 114,
        nivel: "Nivel 1",
        cifras: "Hasta 3 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🧁 Una panadería vendió 125 facturas en la mañana y 98 en la tarde. ¿Cuántas facturas vendió en total?"
    },

    // ==========================================
    // NIVEL 2: Hasta 5 cifras (Hasta 2 Operaciones)
    // ==========================================
    {
        id: 201,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🏆 En un torneo intercolegial participaron 18 escuelas. Cada escuela llevó 22 estudiantes. ¿Cuántos estudiantes participaron en total?"
    },
    {
        id: 202,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "🚌 Dos escuelas organizaron viajes. Una llevó 125 alumnos y la otra 138. ¿Cuántos alumnos viajaron en total?"
    },
    {
        id: 203,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "📖 Una biblioteca recibió 5 estanterías. Cada estantería tiene 8 niveles con 36 libros por nivel. ¿Cuántos libros hay en total?"
    },
    {
        id: 204,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏫 Una fábrica empacó 25 cajas con 45 cuadernos cada una. Luego preparó otras 16 cajas con 40 cuadernos. ¿Cuántos cuadernos empacaron en total?"
    },
    {
        id: 205,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎤 En un recital hay 26 filas con 48 sillas. Si ya se ocuparon 1.070 lugares, ¿cuántos asientos siguen libres?"
    },
    {
        id: 206,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🥪 Un comedor escolar prepara 18 bandejas con 56 empanadas cada una. Luego entrega 480 a una escuela rural. ¿Cuántas empanadas quedan?"
    },
    {
        id: 207,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏫 Una escuela organiza una feria. Compra 12 cajas con 50 paquetes de golosinas. Si ya vendieron 420 paquetes, ¿cuántos paquetes les quedan?"
    },
    {
        id: 208,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "📦 Una distribuidora recibe 16 pallets con 24 cajas cada una. Si cada caja pesa 18 kg, ¿cuánto pesa toda la carga?"
    },
    {
        id: 209,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏕 En un campamento se colocan 12 carpas con capacidad para 6 chicos cada una. ¿Cuántos chicos pueden dormir? Si llegaron 68, ¿hay carpas suficientes?"
    },
    {
        id: 210,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎟 Una función teatral vendió 15 filas de 20 asientos. Luego liberó otras 80 entradas. ¿Cuántas entradas vendió en total?"
    },
    {
        id: 211,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧺 Una lavandería lava 36 manteles por día durante 5 días. Luego se agregan 84 manteles más. ¿Cuántos lavaron en total?"
    },
    {
        id: 212,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍕 Un club compró 24 cajas con 12 porciones de pizza. Si repartió 210 porciones entre los chicos, ¿cuántas porciones le quedan?"
    },
    {
        id: 213,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🚌 Una empresa alquila 16 micros con 45 butacas cada uno. Si asisten 680 personas, ¿quedan asientos libres?"
    },
    {
        id: 214,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una fábrica empacó 22 cajas de 48 alfajores y 18 cajas de 50. ¿Cuántos alfajores empacaron? ¿Qué lote fue más grande?"
    },
    {
        id: 215,
        nivel: "Nivel 2",
        cifras: "Hasta 5 cifras",
        campo: "Aditivo (Suma/Resta)",
        enunciado: "📚 Una feria de libros vendió 125 ejemplares el primer día y 165 el segundo. Si había llevado 400 libros, ¿cuántos le quedaron sin vender?"
    },

    // ==========================================
    // NIVEL 3: Hasta 6 cifras (Hasta 3 Operaciones)
    // ==========================================
    {
        id: 301,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🧴 Una fábrica produce 26 pallets con 32 cajas cada uno. En cada caja hay 18 botellas. ¿Cuántas cajas se produjeron en total? ¿Cuántas botellas se fabricaron?"
    },
    {
        id: 302,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧮 Un torneo entrega 1.500 puntos por partido. Si un jugador gana 12 partidos y otro gana 10, ¿cuántos puntos obtuvo cada uno? ¿Cuál tiene más puntos y cuántos más?"
    },
    {
        id: 303,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "📖 Una biblioteca recibió 8 estanterías con 10 niveles. Cada nivel contiene 28 libros. ¿Cuántos libros recibió en total?"
    },
    {
        id: 304,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🚚 Una empresa distribuyó 4.800 cajas. Si cada camión transporta 120 cajas, ¿cuántos camiones se necesitaron?"
    },
    {
        id: 305,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎫 Un festival tiene 25 filas con 36 butacas. Si vendieron 890 entradas, ¿quedan lugares vacíos? ¿Cuántos?"
    },
    {
        id: 306,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una empresa armó 7 cajas con 48 sobres de figuritas y otras 9 cajas con 54 sobres. ¿Cuántos sobres hay en total?"
    },
    {
        id: 307,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧮 Una escuela organizó 14 salones con 28 alumnos en cada uno. Luego sumaron 3 grupos con 25 alumnos. ¿Cuántos alumnos hay en total?"
    },
    {
        id: 308,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🍎 Una cooperativa cosechó 3.240 manzanas. Se reparten en cajas de 36. ¿Cuántas cajas completas se pueden armar?"
    },
    {
        id: 309,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🏫 Un colegio organiza 10 filas con 12 bancos. Si se sientan 2 alumnos por banco, ¿cuántos alumnos caben? ¿Y si vienen 238 alumnos, alcanzan los bancos?"
    },
    {
        id: 310,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎒 Una tienda empacó 14 cajas con 32 mochilas cada una. Vendieron 387 mochilas. ¿Cuántas mochilas quedan en stock?"
    },
    {
        id: 311,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🥤 Se reciben 16 pallets con 18 cajas y 6 pallets con 20 cajas. Cada caja trae 24 botellas. ¿Cuántas cajas se recibieron? ¿Cuántas botellas en total?"
    },
    {
        id: 312,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "📬 Una editorial distribuyó 9.850 libros entre 32 escuelas. ¿Cuántos libros recibió cada escuela? ¿Quedaron libros sin repartir?"
    },
    {
        id: 313,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🥪 Un comedor prepara 18 bandejas con 54 empanadas y 20 bandejas con 48. ¿Cuántas empanadas hay en total?"
    },
    {
        id: 314,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🧺 Una fábrica produce 25 cajas de toallas. En cada caja hay 30 paquetes con 6 toallas. ¿Cuántas toallas se produjeron?"
    },
    {
        id: 315,
        nivel: "Nivel 3",
        cifras: "Hasta 6 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🏟 Un estadio tiene 42 sectores con 30 filas y 20 butacas cada una. Si ya se vendieron 22.000 entradas, ¿quedan butacas disponibles? ¿Cuántas?"
    },

    // ==========================================
    // NIVEL 4: Hasta 4 cifras (Hasta 4 Operaciones)
    // ==========================================
    {
        id: 401,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍞 Una panadería tiene 6 estanterías con 4 niveles cada una. En cada nivel se colocan 36 bandejas, y cada bandeja contiene 24 medialunas. ¿Cuántos niveles hay en total? ¿Cuántas bandejas hay en todas las estanterías? ¿Cuántas medialunas puede almacenar la panadería?"
    },
    {
        id: 402,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📓 Una librería recibió 8 cajas con 12 cuadernos cada una. Cada cuaderno cuesta $95. ¿Cuántos cuadernos llegaron en total? ¿Cuál es el valor total de los cuadernos?"
    },
    {
        id: 403,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏫 Una escuela tiene 5 salones. Cada salón tiene 6 filas con 4 bancos. Se sientan 2 alumnos por banco. ¿Cuántos bancos hay en total? ¿Cuántos alumnos caben en total? Si llegaron 230 alumnos, ¿cuántos no tienen asiento?"
    },
    {
        id: 404,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍬 Una fábrica empacó 3.280 caramelos. Se colocan 12 caramelos por sobre. Luego, se agrupan 10 sobres por caja. ¿Cuántos sobres completos se pueden hacer? ¿Cuántas cajas completas se pueden formar? ¿Cuántos caramelos sobran?"
    },
    {
        id: 405,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧸 En una feria hay 5 hileras con 6 mesas por hilera. En cada mesa se colocan 24 juguetes. Los juguetes se empaquetan en bolsas de 16. ¿Cuántas mesas hay en total? ¿Cuántos juguetes se colocaron? ¿Cuántas bolsas completas se formaron?"
    },
    {
        id: 406,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📖 Una biblioteca puede almacenar hasta 640 libros. Actualmente tiene 5 estanterías con 6 niveles. En cada nivel hay 18 libros. ¿Cuántos libros hay actualmente? ¿Cuántos libros más se necesitan para llenar la biblioteca?"
    },
    {
        id: 407,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍫 Un kiosco compró 6 cajas de alfajores de chocolate (12 alfajores cada una), 5 cajas de mousse (12 cada una) y 4 de dulce de leche (12 cada una). ¿Cuántos alfajores hay de cada tipo? ¿Cuántos hay en total?"
    },
    {
        id: 408,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🛒 Un supermercado tiene 9 góndolas con 5 estantes cada una. En cada estante se colocan 40 botellas. ¿Cuántos estantes hay en total? ¿Cuántas botellas hay en total?"
    },
    {
        id: 409,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Multiplicativo (Mult/Div)",
        enunciado: "🧩 Sofía tiene 2.560 figuritas. Quiere repartirlas en sobres de 18, y entregar 6 sobres por amigo. ¿Cuántos sobres puede armar? ¿Cuántos amigos recibirán sobres completos?"
    },
    {
        id: 410,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧸 Una fábrica armó 7 cajas con 36 juguetes cada una. Vendió 158 juguetes y devolvieron 12. ¿Cuántos juguetes tiene actualmente? ¿Son más o menos que los que fabricó inicialmente?"
    },
    {
        id: 411,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "💧 Una pileta fue cargada con 4 tanques que contienen 250 litros cada uno. Si la pileta puede contener hasta 1.200 litros, ¿cuántos litros tiene actualmente? ¿Cuántos le faltan para llenarse?"
    },
    {
        id: 412,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🐔 Una granja recogió 3.888 huevos. Se colocan 12 huevos por bandeja. Luego, 6 bandejas en cada caja. ¿Cuántas bandejas completas se formaron? ¿Cuántas cajas completas se llenaron?"
    },
    {
        id: 413,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎭 Una sala tiene 6 filas con 14 butacas por fila. Si ya llegaron 72 personas, ¿cuántos asientos siguen vacíos?"
    },
    {
        id: 414,
        nivel: "Nivel 4",
        cifras: "Hasta 4 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "✏️ Una fábrica produjo 5 lotes de 120 lápices cada uno. Si se colocan en paquetes de 25 lápices, ¿cuántos paquetes completos se pueden armar? ¿Cuántos lápices quedan sin agrupar?"
    },

    // ==========================================
    // NIVEL 5: Hasta 5 cifras (Contextos Complejos)
    // ==========================================
    {
        id: 501,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Un depósito tiene 12 estanterías. Cada estantería tiene 18 estantes. En cada estante caben 42 cajas. Cada caja contiene 15 paquetes. Los paquetes se agrupan en bolsas de 10. ¿Cuántos estantes hay en total? ¿Cuántas cajas hay en total? ¿Cuántos paquetes hay en total? ¿Cuántas bolsas completas se pueden formar? ¿Cuántos paquetes sobran?"
    },
    {
        id: 502,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🚛 Una distribuidora armó 14 pallets. Cada pallet contiene 24 cajas. Cada caja tiene 32 latas. Cada lata cuesta $175. ¿Cuántas cajas hay en total? ¿Cuántas latas hay en total? ¿Cuál es el valor total de toda la carga?"
    },
    {
        id: 503,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏫 Una escuela tiene 16 salones. Cada salón tiene 7 filas de 4 bancos. Si se ubica 1 alumno por banco, ¿cuántos alumnos caben en total? Si hay 430 alumnos, ¿cuántos bancos quedan vacíos? ¿Y si se ubican de a dos por banco, cuántos bancos quedan libres?"
    },
    {
        id: 504,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🔬 Una feria de ciencias dispone de 30 mesas organizadas en 5 hileras con igual cantidad de mesas. En cada mesa se colocan 48 folletos. ¿Cuántas mesas hay por hilera? ¿Cuántos folletos hay en total?"
    },
    {
        id: 505,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍫 Una fábrica armó 22 cajas con 48 alfajores y otra 26 cajas con 42 alfajores. ¿Cuántos alfajores produjo cada una? ¿Cuál fábrica produjo más? ¿Cuántos alfajores más?"
    },
    {
        id: 506,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "✏️ Una fábrica organiza 8.640 lápices en estanterías. Tiene 12 estanterías con 6 niveles. Se colocan 24 lápices por bandeja. ¿Cuántos niveles hay en total? ¿Cuántas bandejas se necesitan para acomodarlos todos?"
    },
    {
        id: 507,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍪 Una fábrica produjo 12.500 galletitas. Se agrupan en paquetes de 36. Luego se entregan 24 paquetes por escuela. ¿Cuántos paquetes completos hay? ¿Cuántas escuelas pueden recibir igual cantidad? ¿Cuántas galletitas quedan sin repartir?"
    },
    {
        id: 508,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🥤 Un supermercado recibió 8 pallets con 45 packs de gaseosa cola y 6 pallets con 36 packs de gaseosa lima. Cada pack tiene 6 botellas. ¿Cuántos packs hay de cada tipo? ¿Cuántas botellas hay en total?"
    },
    {
        id: 509,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎡 En un parque hay 18 zonas con 12 juegos cada una. Cada juego puede recibir hasta 15 personas. Si hay 2.800 visitantes, ¿Cuántas personas pueden ingresar en total? ¿Se llenan todos los juegos? ¿Cuántas personas quedarían fuera o cuántos lugares sobran?"
    },
    {
        id: 510,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏟️ Un estadio tiene 24 tribunas. Cada tribuna tiene 32 filas de 20 butacas. Si se vendieron 13.200 entradas, ¿Cuántas butacas hay en total? ¿Cuántas siguen libres?"
    },
    {
        id: 511,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una planta produce 120 paquetes por hora durante 8 horas. Luego produce 480 paquetes más. Si debe entregar 1.600 paquetes, ¿Cuántos produjo en total? ¿Cuántos faltan?"
    },
    {
        id: 512,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una fábrica armó 30 cajas con 32 productos cada una. Luego agrupó los productos en pallets de 120 unidades. ¿Cuántos productos hay en total? ¿Cuántos pallets completos se armaron? ¿Cuántos productos quedan fuera?"
    },
    {
        id: 513,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏅 En un torneo se otorgan 2.100 puntos por partido ganado. Un jugador ganó 12 partidos y otro 11. ¿Cuántos puntos tiene cada uno? ¿Quién tiene más? ¿Por cuántos puntos?"
    },
    {
        id: 514,
        nivel: "Nivel 5",
        cifras: "Hasta 5 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📚 Una campaña reunió 2.400 libros nuevos, 1.850 usados y 980 cuentos ilustrados. Se reparten en partes iguales entre 45 escuelas. ¿Cuántos libros hay en total? ¿Cuántos recibe cada escuela? ¿Quedan libros sin repartir?"
    },

    // ==========================================
    // NIVEL 6: Hasta 7 cifras (Logística Avanzada)
    // ==========================================
    {
        id: 601,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🛒 Un supermercado tiene 85 góndolas. Cada góndola tiene 12 estantes con 40 botellas. Llegó un pedido de bebidas con: 15 pallets con 24 packs de gaseosa (6 botellas por pack), 18 pallets con 30 packs de soda (4 botellas por pack), 10 pallets con 40 packs de agua (12 botellas por pack). ¿Cuántos estantes hay en total? ¿Cuántas botellas entran en el supermercado? ¿Cuántas botellas llegaron de cada tipo? ¿Cuántas botellas llegaron en total? ¿Cuántos estantes se llenan por completo? ¿Quedan estantes vacíos? ¿Cuántas botellas quedarían sin ubicar?"
    },
    {
        id: 602,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🚚 Una distribuidora de bebidas organiza su carga en 62 camiones. Cada camión lleva 16 pallets con 32 packs. Cada pack tiene 6 botellas. Deben entregarse 210.000 botellas. ¿Cuántos packs hay en total? ¿Cuántas botellas transportarían los 62 camiones? ¿Alcanzan para cubrir el pedido? ¿Cuántas botellas faltan o sobran?"
    },
    {
        id: 603,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🎪 Una feria internacional se organiza en 48 carpas. Cada carpa tiene 25 mesas con 6 personas por mesa. Se esperan 7.890 visitantes. ¿Cuántas personas caben en total? ¿Se puede recibir a todos los visitantes? ¿Cuántas plazas quedarían libres o cuántos visitantes quedarían afuera?"
    },
    {
        id: 604,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una imprenta preparó 34.000 folletos de turismo y 28.500 de cultura. Se agrupan en cajas de 90. Se envían 230 cajas a escuelas urbanas y 120 cajas a escuelas rurales. ¿Cuántos folletos se enviaron? ¿Cuántos quedan en la imprenta? ¿Cuántas cajas completas más podrían armarse?"
    },
    {
        id: 605,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "⛹️ Un club tiene 20 canchas con 12 horarios de juego cada una. Se programaron 240 partidos de fútbol y 70 de hockey. ¿Cuántos turnos hay disponibles? ¿Se ocupan todos? ¿Cuántos quedan libres?"
    },
    {
        id: 606,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🛍 Una empresa fabricó 196.200 bolsas plásticas. Cada paquete contiene 24 bolsas. Se entregaron 5.500 paquetes a sucursales. ¿Cuántos paquetes hay en total? ¿Cuántos fueron entregados? ¿Cuántos paquetes quedan? ¿Cuántas bolsas representan esos paquetes?"
    },
    {
        id: 607,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📚 Una biblioteca central recibió: 22 cajas con 85 libros de literatura, 18 cajas con 96 libros de historia, 14 cajas con 72 libros de ciencia. Se organizan en estanterías de 4 niveles con 32 libros por nivel. ¿Cuántos libros se recibieron de cada área? ¿Cuántos en total? ¿Cuántas estanterías completas se pueden llenar? ¿Cuántos libros quedarían sin ubicar?"
    },
    {
        id: 608,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🧑‍🏫 Una ONG recolectó 87.000 útiles escolares. Se reparten entre 120 escuelas. Otra campaña juntó 91.500 útiles para 135 escuelas. ¿Qué red recibió más útiles por escuela? ¿Cuál fue la diferencia?"
    },
    {
        id: 609,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "📦 Una editorial imprimió 160.000 libros. Se distribuyen en: 80 ferias (1.050 libros cada una), 320 bibliotecas (320 libros cada una). ¿Cuántos libros se distribuyen en total? ¿Quedan libros sin distribuir? ¿Cuántos? ¿Qué porcentaje del total fue a ferias?"
    },
    {
        id: 610,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏫 Una escuela organiza una jornada con 2.160 estudiantes en 72 grupos iguales. Cada grupo tiene 2 docentes y 3 mesas. Se prepararon 250 mesas. ¿Cuántos estudiantes hay por grupo? ¿Cuántas mesas se usan en total? ¿Quedan mesas sin usar?"
    },
    {
        id: 611,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🌱 Un vivero organiza 30 sectores con 14 filas y 28 plantas por fila. Recibe: 75 cajas con 96 plantines, 55 cajas con 84 plantines. ¿Cuántas plantas hay plantadas? ¿Cuántos plantines llegaron? ¿Se superó la capacidad del vivero? ¿Cuántos plantines podrían ubicarse aún?"
    },
    {
        id: 612,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🍪 Una fábrica produjo: 58 lotes de 1.350 alfajores, 16 lotes especiales de 900. Se embalan en cajas de 30. ¿Cuántos alfajores se produjeron? ¿Cuántas cajas completas se pueden formar? ¿Cuántos alfajores quedan fuera? ¿Qué lote produjo más unidades?"
    },
    {
        id: 613,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🏬 Un depósito puede almacenar hasta 320.000 unidades. Tiene: 124 pallets con 192 cajas de 6 unidades. Se sumarán otras 92 pallets con igual cantidad. ¿Cuántas unidades hay en total? ¿Cuánto espacio queda disponible?"
    },
    {
        id: 614,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "🚛 Una planta distribuye productos en 78 camiones. Cada camión tiene 20 cajas con 48 productos. Se reparten entre 130 locales en forma equitativa. ¿Cuántos productos recibe cada local? ¿Quedan productos sin repartir?"
    },
    {
        id: 615,
        nivel: "Nivel 6",
        cifras: "Hasta 7 cifras",
        campo: "Combinado (Varias operaciones)",
        enunciado: "⚽ Un torneo organizó 240 partidos en 10 días, usando 5 canchas con 6 turnos diarios cada una. Se suspendieron 38 partidos por lluvia. ¿Cuántos turnos había disponibles? ¿Alcanzaban los turnos para todos los partidos? ¿Cuántos turnos libres quedaron?"
    }
];