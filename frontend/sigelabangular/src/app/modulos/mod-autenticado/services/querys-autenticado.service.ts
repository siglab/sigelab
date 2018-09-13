import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuerysAutenticadoService {

  // INICIALIZACION DE CONSULTAS PARA SERVICIOS RESERVADOS POR EL USUARIO
  private collectionReserv: AngularFirestoreCollection<any>;

  private collectionHisto: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore) {

  }


  getCollectionReserv(userid) {
    this.collectionReserv = this.afs.collection('cfSrvReserv',
      ref => ref.where('user', '==', userid));

    return this.collectionReserv.snapshotChanges();
  }


  estructurarSolicitudesServicios(email, data) {
    console.log(data);
    let promise = new Promise((resolve,reject)=>{
      const datos = [];
      const histodatos = [];

      for (let index = 0; index < data.length; index++) {
        const elemento = data[index].payload.doc.data();      
  
          this.afs.doc('cfSrv/' + elemento.cfSrv).ref.get().then(data2 => {
            const servicio =  data2.data();
        
              const Reserv = {
                email: email,
                lab: elemento.namelab,
                uidlab: elemento.cfFacil,
                status: elemento.status,
                nombre: servicio.cfName,
                descripcion: servicio.cfDesc,
                precio: servicio.cfPrice,
                activo: servicio.active,
                variaciones: this.estructurarVariaciones(elemento.cfSrv, elemento.selectedVariations),
                condiciones: elemento.conditionsLog,
                comentario: elemento.comments,
                usuario: elemento.emailuser,
                fecha: elemento.createdAt.split('T')[0],
                uid: data2.id,
                uidreserv: data[index].payload.doc.id,
                acepto: elemento.acceptedBy,
                path: elemento.path     
              };
  
              if(elemento.status == 'aceptada' || elemento.status == 'pendiente' || elemento.status == 'procesada'){
               datos.push(Reserv);
              } else {
                histodatos.push(Reserv);
              }

         
            console.log(data.length, datos.length,histodatos.length);
              
            if(data.length == (datos.length+histodatos.length)){
              resolve({data:datos, data2: histodatos});
            }
          
          });

       

          
      }
    });
  

    return promise;
  }


  estructurarVariaciones(idser,item){
    const arr = [];

    for (const clave in item) {
      // Controlando que json realmente tenga esa propiedad
      if (item.hasOwnProperty(clave)) {

        if (item[clave]) {        
          this.afs.doc('cfSrv/' + idser + '/variations/' + clave).snapshotChanges().subscribe(data => {
           const variacion =  data.payload.data();
       
            const vari = {
              id: clave,
              nombre: variacion.cfName,
              descripcion: variacion.cfDescription,
              precio: variacion.cfPrice,
              activo: variacion.active
              };

              arr.push(vari);      

           });
        }

      }
    }

    return arr;
  }

  updateComments(id, comments){
    return this.afs.doc('cfSrvReserv/' + id).update(comments);
  }

  consultarLaboratorio(idlab){
    let nombre = '';
    this.afs.doc('cfFacil/' + idlab).snapshotChanges().subscribe(data => {
      nombre = data.payload.data().cfName;
        console.log(nombre);
    });
    return nombre;
  }

  cancerlarSolicitud(reservuid, fecha) {
    return this.afs.collection('cfSrvReserv').doc(reservuid).update({status: 'cancelada', updatedAt:fecha});
  }

  getLab(labid){
    return this.afs.doc('cfFacil/' + labid).snapshotChanges();
  }

  getPersona(persid){
    return this.afs.doc('cfPers/' + persid).snapshotChanges();
  }

  getEmailUser(userid){
    return this.afs.doc('user/' + userid).ref.get();
  }


}
