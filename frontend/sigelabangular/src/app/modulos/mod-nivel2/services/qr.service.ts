import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http, Response } from '@angular/http';
import swal from 'sweetalert2';
import { URLAPI } from '../../../config';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

@Injectable()
export class QrService {
  private url = URLAPI;
  arraygeneral = [];
  constructor(private afs: AngularFirestore, private http: Http) { }
  // lista qrs sin asociar o inactivos
  listQrInactive() {
    return this.afs
      .collection('qr', ref => ref.where('active', '==', false))
      .valueChanges();
  }
  //  lista todos los qr activos o asociados a un inventario
  listQrActive() {
    return this.afs
      .collection('qr', ref => ref.where('active', '==', true))
      .valueChanges();
  }

  // obtiene un unico qr segun un id
  getQr(id) {
    return this.afs
      .collection('qr', ref => ref.where('secQr', '==', id))
      .valueChanges();
  }

  // consulta los datos en sabs
  postSabs(cod) {

    console.log('si llego el codigo' , cod);
    const body = {
      codInventario: cod,
      codLab: '5646',
      nomLab: 'fgh',
      sede: 'fgh',
      edificio: '567',
      espacio: 'fghgf'
    };

    return this.http.post(this.url, body)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }




  extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  handleErrorObservable(error: Response | any) {
    console.error(error.message || error);

    return Observable.throw(error.message || error);
  }

  getUser() {

    return new Promise((resolve, reject) => {
      const usuario = JSON.parse(sessionStorage.getItem('usuario'));
      this.afs
        .doc('user/' + usuario.uid)
        .valueChanges()
        .subscribe(data => {
          // parametro de la persona para buscar en el laboratorio
          this.getLab(data['cfPers']).then(ok => {

            resolve(ok);

          });
        });
    });
  }


  // encuentra una persona dentro de un laboratorio
  getLab(id) {

    return new Promise((resolve, reject) => {
      if (id) {


        this.afs
          .collection('cfFacil', ref =>
            ref.where('relatedPers.' + id, '==', true)
          )
          .snapshotChanges()
          .subscribe(data => {
            this.listSpaces(data).then((ok) => {

              resolve(ok);

            });
          });
      } else {
        reject('no existe el id de la persona ');
      }
    });

  }

  listSpaces(data) {

    return new Promise((resolve, reject) => {
      data.forEach(element => {
        console.log('object', element.payload.doc.data().relatedSpaces);

        this.getSpaces(element.payload.doc.data().relatedSpaces, element.payload.doc.id).then(ok => {

          resolve(ok);
        });

      });

    }


    );


  }

  getSpaces(item, idlab ?) {
    this.arraygeneral = [];
    return new Promise((resolve, reject) => {
      for (const clave in item) {
        // Controlando que json realmente tenga esa propiedad
        if (item.hasOwnProperty(clave)) {
          if (item[clave]) {
            this.afs
              .doc('space/' + clave)
              .snapshotChanges()
              .subscribe(data => {
                const espacio = data.payload.data();

                // funciona con una programacion, cuando hayan mas toca crear otro metodo
                if (espacio) {
                  const space = {
                    id_space: data.payload.id,
                    capacity: espacio.capacity,
                    createdAt: espacio.createdAt,
                    freeArea: espacio.freeArea,
                    headquarter: espacio.headquarter,
                    indxSa: espacio.indxSa,
                    map: espacio.map,
                    minArea: espacio.minArea,
                    ocupedArea: espacio.ocupedArea,
                    totalArea: espacio.totalArea,
                    spaceData: espacio.spaceData,
                    active: espacio.active,
                    idlab: idlab
                  };

                  this.arraygeneral.push(space);
                }
              });
          }
        }
      }

      resolve(this.arraygeneral);
    });


  }

  async addEquipFirebase(newEq) {

    return this.afs.collection('cfEquip').add(newEq).then((ok) => {
      swal({
        type: 'success',
        title: 'Equipo almacenado con exito.',
        showConfirmButton: true
      });
      return ok.id;

    });
  }

  addComponents(arrComponent, id) {

     console.log('llego el id', id);
    if (arrComponent.length > 0) {
       console.log('array que llego', arrComponent );
      arrComponent.forEach(element => {


        console.log(element);
        this.afs.doc('cfEquip/' + id).collection('components').add(element);

      });

    }

  }

  updateQrDoc(id, idEquip) {

    const newqr = {
      cfEquip: idEquip
    };

    this.afs.doc('qr/' + id).set(newqr, { merge: true });

  }


  getIdQr(id) {

    return new Promise((resolve, reject) => {

      this.afs.doc('qr/' + id).valueChanges()
        .subscribe(data => {

          if (data['active']) {

            this.getEquip(data['cfEquip']).subscribe(res => {

              resolve(res);
            });


          } else {
            reject('no esta asociado a ningun equipo');
          }

        });
    });


  }


  getEquip(id) {

    return this.afs.doc('cfEquip/' + id).valueChanges();

  }

  updatedLab(idLab, idEquip) {

    console.log(idLab, idEquip);
    const newLab = { relatedEquipments: {} };

    newLab.relatedEquipments[idEquip] = true;

    this.afs.doc('cfFacil/' + idLab).set(newLab, { merge: true });

  }


  updatedQr(cfEquip, idQr) {

    const newqr = {
      cfEquip,
      active: true
    };

    this.afs.doc('qr/' + idQr).set(newqr, { merge: true });
  }



  listCfFacil() {

   return this.afs.collection( 'cfFacil', ref => ref.where( 'active' , '==' , true ) ).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ... data };
    }))
  );

  }

  listCfFaculties () {
    return this.afs.collection( 'faculty' ).snapshotChanges().pipe(
     map(actions => actions.map(a => {
       const data = a.payload.doc.data();
       const id = a.payload.doc.id;
       return { id, ... data };
     }))
   );

   }


  getEquipForInventory(inventory) {
    const col = this.afs.collection('cfEquip');
    const refer = col.ref.where('inventory', '==', inventory);

    return refer.get();
  }

  addQr(doc) {
    return   this.afs.collection('qr').add(doc);
  }

  setQr(idqr, doc) {
    return this.afs.doc('qr/' + idqr).set(doc, { merge: true });
  }

  addOldQrs() {

    const qr = {

      active : false,
      cfEquip : '',
      secQr : '',
      updatedAt : '',
      createdAt : new Date().toISOString(),
    };

    for (let index = 1; index <= 500 ; index++) {
       const i = index.toString();
       qr.secQr = i;
      this.afs.collection('qr').doc(i).set(qr);
    }




  }



}
