import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuerysPrincipalService {

  // INICIALIZACION DE CONSULTAS
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;


  datosEstructurados = [];

  constructor(private afs: AngularFirestore) { }


  getLaboratorios() {
    this.itemsCollection = this.afs.collection<any>('cfFacil');
    this.items = this.itemsCollection.valueChanges();

    return this.items;
  }

  estructurarData(data: any) {

    this.datosEstructurados = [];

    for (let index = 0; index < data.length; index++) {
      const elemento = data[index];

      this.buscarDirector(elemento.facilityAdmin).subscribe(dueno => {
        const duenoLab = dueno.payload.data();
        if (duenoLab && elemento.mainSpace) {

          this.buscarEspacio(elemento.mainSpace).subscribe(espacio => {

            const espacioLab = espacio.payload.data();

            const laboratorio = {
              nombre: elemento.cfName,
              escuela: elemento.knowledgeArea,
              inves: elemento.researchGroup,
              director: duenoLab.cfFirstNames + ' ' + duenoLab.cfFamilyNames,
              coord: {lat: espacioLab.spaceData.geoRep.longitud, lon: espacioLab.spaceData.geoRep.latitud},
              info: {dir: elemento.otros.direccion, tel: elemento.otros.telefono, cel: '', email: elemento.otros.email},
              servicios: this.estructurarServicios(elemento.relatedServices),
              practicas: [],
              estado: elemento.active
            };

            this.datosEstructurados.push(laboratorio);
          });

        }
     });

    }

   // this.estructurarServicios(data[0].relatedServices);


    return this.datosEstructurados;
  }

  buscarDirector(iddirector) {
    return this.afs.doc('cfPers/' + iddirector).snapshotChanges();

  }

  buscarEspacio(idespacio) {
    return this.afs.doc('space/' + idespacio).snapshotChanges();
  }


  estructurarServicios(item) {

    console.log(item);
    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {
        console.log(item[clave]);

        if (item[clave]) {
           this.afs.doc('cfSrv/' + clave).snapshotChanges().subscribe(data => {
           const servicio =  data.payload.data();
             const serv = {
              nombre: servicio.cfName,
              descripcion: servicio.cfDesc,
              precio: servicio.cfPrice,
              activo: servicio.active
             };
             arr.push(serv);
           });
        }

      }
    }

    return arr;
  }


  addItem(item: any) {
    this.itemsCollection.add(item);
  }

   jsonKeys(id) {

  }
}
