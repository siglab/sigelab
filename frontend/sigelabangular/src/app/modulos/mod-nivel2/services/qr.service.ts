import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Http, Response } from '@angular/http';
import swal from 'sweetalert2';

@Injectable()
export class QrService {
  private url = 'http://192.168.0.15:1337/inventario/buscar';
  arraygeneral = [];
  constructor(private afs: AngularFirestore, private http: Http) {}
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
    const body = {
      codInventario: cod,
      codLab: '5646',
      nomLab: 'fgh',
      sede: 'fgh',
      edificio: '567',
      espacio: 'fghgf'
    };



    return this.http.post(this.url, body).map(
      (response: Response) => {
        // console.log('data json edificios', response.json());

        if (response.status === 200) {
          return response.json();
        } else {
          console.log('error al conectar a sabs');
          return response;
        }
      },
      err => {
        console.log('erro al conectarse a sabs', err);
      }
    );
  }


  getUser() {

    return new Promise((resolve, reject) => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      this.afs
        .doc('user/' + usuario.uid)
        .valueChanges()
        .subscribe(data => {
          // parametro de la persona para buscar en el laboratorio
          this.getLab(data['cfPers']).then( ok => {

            resolve(ok);

         } );
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
          .valueChanges()
          .subscribe(data => {
               this.listSpaces(data).then( (ok) => {

               resolve( ok );

              });
          });
      } else {
         reject('no existe el id de la persona ' );
      }
    });

  }

  listSpaces(data) {

     return new Promise((resolve, reject) => {
      data.forEach(element => {

       this.getSpaces(element.relatedSpaces).then( ok => {

        resolve(ok);
       });

      });

     }


    );


  }

  getSpaces(item) {

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
                      active: espacio.active
                    };

                    this.arraygeneral.push(space);
                  }
                });
            }
          }
        }

          resolve( this.arraygeneral  );
      });


  }

  async addEquipFirebase( newEq ) {

  return  this.afs.collection('cfEqip').add(newEq).then( (ok) => {
    swal({
      type: 'success',
      title: 'Equipo almacenado con exito.',
      showConfirmButton: true
    });
    return ok.path;

   });
  }

   addComponents(arrComponent ,  path  ) {

    if (arrComponent.length > 0 ) {

      arrComponent.forEach(element => {

        this.afs.doc( path ).collection( 'components' ).add( element );

      });

    }


   }

   updateQrDoc( id, idEquip ) {

    const newqr = {
     cfEquip : idEquip
    };

    this.afs.doc('qr/' + id ).set( newqr, { merge: true}  );

   }


}
