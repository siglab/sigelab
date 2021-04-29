/**
 * Created by: Julian Rodríguez
 * Created on: 12/04/2021
 * Last modification by: Julian Rodríguez
 * Description: A file with static services info to share through interoperability system.
 *              This file should not exist and it should be replaced as soon as possible once the complete services info is
 *              stored in SigeLAB database and the system itselft support it.
 */

exports.services = {
  kTn49yLFCPuSV85HFWYK: {
    testServices: [
      {
        cfName:
          "Determinación del contenido de  mercurio (Hg) en peces por Absorción Atómica",
        cfDescr:
          "El método para la determinación del contenido de mercurio total (Hg), mediante la técnica de espectrofotometría de absorción atómica usando vapor frio como técnica de atomización, es aplicable a pescados mar y otros productos marinos, excluyendo escamas, aletas, vísceras y huesos.",
        referenceDoc: "LAI-PNT-ALM-16",
        method:
          "Official Method AOAC, 977.15 Mercury in Fish Alternative flameless Atomic Absorption Spectrophotometric Method.",
        updatedAt: new Date(2020, 00, 14).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [
          "Espectrofotómetro de absorción atómica con generador de hidruros",
          "Lámpara de cátodo hueco de mercurio",
          "Balanza Analítica",
          "Plancha de calentamiento",
          "Micropipeta de 1 mL a 10mL",
          "Micropipeta de 100 µL a 1000 µL",
        ],
        servLength: "3 meses",
      },
      {
        cfName:
          "Determinación del contenido de cadmio (Cd) en frutas por Absorción Atómica",
        cfDescr:
          "El método para la determinación del contenido de cadmio total (Cd), mediante la técnica de espectrofotometría de absorción atómica usando horno de grafito como técnica de atomización, es aplicable a frutas con altos contenidos de carbohidratos y grasas.",
        referenceDoc: "LAI-PNT-ALM-17",
        method:
          "Official Method AOAC Official Method 999.11 Lead, Cadmium, Copper, Iron and Zinc in Foods. Atomic Absorption Spectrophotometry after Dry Ashing.",
        updatedAt: new Date(2020, 00, 14).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [
          "Espectrofotómetro de absorción atómica con horno de grafito",
          "Lámpara de cátodo hueco de cadmio",
          "Mufla",
          "Balanza Analítica",
          "Plancha de calentamiento",
          "Micropipeta de 1 mL a 10mL",
          "Micropipeta de 100 µL a 1000 µL",
        ],
        servLength: "3 meses",
      },
      {
        cfName:
          "Abonos y fertilizantes (Cenizas, carbono orgánico, fósforo, hierro, humedad, potasio, nitrógeno, sodio)",
        cfDescr: "",
        referenceDoc: "Registro ICA",
        method: "Varios",
        updatedAt: new Date(2018, 00, 01).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [],
        servLength: "",
      },
      {
        cfName:
          "Tabla Nutricional (Azúcares totales, cenizas, extracto etéreo, fibra cruda, humedad, calorías, carbohidratos)",
        cfDescr: "",
        referenceDoc: "Registro ICA",
        method: "Varios",
        updatedAt: new Date(2018, 00, 01).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [],
        servLength: "",
      },
    ],
    calibServices: [],
  },
  "6NdmeFukNfST1QWbHh1T": {
    testServices: [
      {
        cfName: "Aceites y Grasas",
        cfDescr: "Método Extracción Soxhlet",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5520D",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Balanza analítica", "Estufa", "Manta de calentamiento"],
        servLength: "",
      },
      {
        cfName: "Acidez",
        cfDescr: "Método Volumétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2310B",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Bureta", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Alcalinidad",
        cfDescr: "Método Volumétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2320B",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Balanza analítica", "Bureta"],
        servLength: "",
      },
      {
        cfName: "Calcio Disuelto",
        cfDescr: "Método volumétrico EDTA",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3500 Ca B",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Balanza analítica", "Bureta"],
        servLength: "",
      },
      {
        cfName: "Carbono Orgánico Total ",
        cfDescr: "Método de Combustión a Alta Temperatura",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5310 B",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Analizador COT", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Cloruro",
        cfDescr: "Método Argentométrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 -Cl-B",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [],
        servLength: "",
      },
      {
        cfName: "Conductividad eléctrica",
        cfDescr: "Método electrométrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2510 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Conductímetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Cromo hexavalente",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3500 Cr B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Demanda Bioquímica de Oxígeno DBO5",
        cfDescr: "Método de membrana",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5210 B, 4500 O G",
        updatedAt: new Date(2021, 03, 03).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Oxímetro",
          "pHmetro",
          "Incubadora",
          "Transferpipeta",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Demanda Química de Oxígeno DQO",
        cfDescr: "Método de reflujo cerrado",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5220 D modificado",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Termo-reactor",
          "Espectrofotómetro",
          "Transferpipeta",
          "Dispensador",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Demanda Química de Oxígeno DQO",
        cfDescr: "Método de reflujo abierto",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5220 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Transferpipeta",
          "Dispensador",
          "Manta de calentamiento",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Surfactantes",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5540 C",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Dureza total",
        cfDescr: "Método volumétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2340 C",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Bureta", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Dureza cálcica",
        cfDescr: "Método volumétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SC 3500 Ca B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Bureta", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Fenol",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5530 B, D",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Fenol",
        cfDescr: "Método de extracción",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 5530 B, C",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Fósforo total",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 P B, E",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Fósforo reactivo totaL (Ortofosfato)",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 P E",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Magnesio",
        cfDescr: "Método de cálculo",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3500 Mg B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [],
        servLength: "",
      },
      {
        cfName: "Nitritos",
        cfDescr: "Método colorimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 NO2- B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Espectrofotómetro", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Sólidos suspendidos totales",
        cfDescr: "Método gravimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2540 D",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Balanza analítica",
          "Bomba de vacio",
          "Desecador",
          "Estufa",
        ],
        servLength: "",
      },
      {
        cfName: "Sólidos sedimentables",
        cfDescr: "Método volumétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 2540 F",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Cono Imhoff", "Balanza analítica"],
        servLength: "",
      },
      {
        cfName: "Sulfatos",
        cfDescr: "Método turbidimétrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 SO4 2- E",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Espectrofotómetro",
          "Plancha de agitación",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Cobre",
        cfDescr: "Método espectrofotométrico de absorción atómica",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3030 E, SM 3111 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Plancha de calentamiento",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Zinc",
        cfDescr: "Método espectrofotométrico de absorción atómica",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3030 E, SM 3111 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Plancha de calentamiento",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Hierro",
        cfDescr: "Método espectrofotométrico de absorción atómica",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3030 E, SM 3111 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Plancha de calentamiento",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Cromo",
        cfDescr: "Método espectrofotométrico de absorción atómica",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3030 E, SM 3111 D",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Plancha de calentamiento",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Plata",
        cfDescr: "Método espectrofotométrico de absorción atómica",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3030 F, SM 3111 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Plancha de calentamiento",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Mercurio",
        cfDescr: "Método espectrofotométrico de absorción atómica - vapor frío",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 3112 B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Baño maría",
          "Transferpipeta",
          "Espectrofotómetro de absorción atómica",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Toxicidad aguda para Daphnia pulex",
        cfDescr: "Método de bioensayo",
        referenceDoc: "Resolución 0062 de IDEAM de 2007",
        method: "Resolución 0062 de IDEAM de 2007",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Cabina para organismos",
          "Destilador y desionizador de agua",
          "Transferpipeta",
          "Balanza analítica",
        ],
        servLength: "",
      },
      {
        cfName: "Toxicidad Aguda en Peces sobre WAF 100 mg",
        cfDescr: "Método propio (bioensayo)",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [
          "Peceras",
          "Destilador",
          "Balanza analítica",
          "Transferpipeta",
        ],
        servLength: "",
      },
      {
        cfName: "Corrosividad. Medición electrométrica",
        cfDescr: "Método electrométrico",
        referenceDoc: "EPA SW 846-9040C",
        method: "EPA SW 846-9040C",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Electrodo de vidrio", "Balanza analítica", "pHmetro"],
        servLength: "",
      },
      {
        cfName: "Corrosividad. Reserva ácido / alcali",
        cfDescr: "Método potenciométrico",
        referenceDoc: "Resolución 0062 de 2007",
        method: "Resolución 0062 de 2007",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: ["Electrodo de vidrio", "Balanza analítica", "pHmetro"],
        servLength: "",
      },
      {
        cfName: "Cadmio. Metal TCLP",
        cfDescr:
          "Método de extracción y espectrofotometría de absorción atómica",
        referenceDoc:
          "EPA SW 846-1311. SM 3030 E modificado. SM 3111 B modificado",
        method: "EPA SW 846-1311. SM 3030 E modificado. SM 3111 B modificado",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Balanza analítica",
          "Equipo de TCLP",
          "Transferpipeta",
          "Plancha de calentamiento",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "Cadmio. Metal TCLP",
        cfDescr:
          "Método de extracción y espectrofotometría de absorción atómica",
        referenceDoc:
          "EPA SW 846-1311. SM 3030 E modificado. SM 3111 B modificado",
        method: "EPA SW 846-1311. SM 3030 E modificado. SM 3111 B modificado",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: true,
        accreditedBy: "IDEAM. Resolución 0489 de 2018 y 0570 de 2020",
        equipments: [
          "Balanza analítica",
          "Equipo de TCLP",
          "Transferpipeta",
          "Plancha de calentamiento",
          "Espectrofotómetro de absorción atómica",
        ],
        servLength: "",
      },
      {
        cfName: "pH",
        cfDescr: "Método potenciométrico",
        referenceDoc:
          "Standard Methods for the Examination of Water and Waste Water, edición 23",
        method: "SM 4500 H+ B",
        updatedAt: new Date(2021, 03, 05).toISOString(),
        accreditedService: false,
        accreditedBy: "",
        equipments: [],
        servLength: "",
      },
    ],
    calibServices: [],
  },
  H3NHxwp8rH4LOaCfyZ3b: {
    testServices: [
      {
        cfName: "TSH Neonatal",
        cfDescr:
          "Para TSH Neonatal se realiza un ensayo fluoroinmunométrico doble, en fase sólida, basado en la técnica directa del sandwich, en el cual dos anticuerpos monoclonales (derivados de ratón) son dirigidos contra dos determinantes antigénicos distintos en la molécula de hTSH. La molécula de hTSH contenida en el papel filtro de estándares, controles y muestras se hace reaccionar simultáneamente con los anticuerpos monoclonales inmovilizados en la placa, los cuales están dirigidos contra el sitio antigénico específico de la subunidad beta de hTSH y con los anticuerpos monoclonales marcados con europio, que está diluido en el tampón de ensayo, los cuales están dirigidos contra los distintos sitios antigénicos localizados una parte en la subunidad beta y otra parte en la subunidad alfa.  El tampón de ensayo disuelve la molécula de hTSH de las muestras de sangre seca recogidas en los discos de papel filtro.  Existe una solución intensificadora que disocia los iones del europio de los anticuerpos marcados en una solución donde estos forman unos quelados altamente fluorescentes con los componentes de esta solución intensificadora.  Finalmente se mide la fluorescencia producida en cada uno de los pozos y que guarda una proporción directa con la concentración de hTSH de cada muestra analizada.",
        referenceDoc:
          "Instructivo de Trabajo: PROCEDIMIENTO PARA ANÁLISIS DE TSH NEONATAL",
        method: "Fluoroinmunoensayo en tiempo resuelto",
        updatedAt: new Date(2018, 09, 01).toISOString(),
        accreditedService: true,
        accreditedBy:
          "ONAC, SECRETARIA DISTRITAL DE BOGOTA Y SECRETARIA DEPARTAMENTAL DEL VALLE",
        equipments: ["AutoDelfia"],
        servLength: "5.5 horas por cada 364 muestras de sangre",
      },
    ],
    calibServices: [],
  },
};

// Servicios de prueba
// {
//   "cfName": "",
//   "cfDescr": "",
//   "referenceDoc": "",
//   "method": "",
//   "updatedAt": new Date(2021,03,05).toISOString(),
//   "accreditedService": false,
//   "accreditedBy": "",
//   "equipments": [],
//   "servLength": "",
// }

// Servicios de calibración
// {
//   "cfName": "",
//   "cfDescr": "",
//   "referenceDoc": "",
//   "measInterval": "",
//   "updatedAt": new Date(2021,03,05).toISOString(),
//   "accreditedBy": "",
//   "equipmentsToCalib": [],
//   "patterns": [],
//   "equipments": [],
//   "calibLength": "",
// }
