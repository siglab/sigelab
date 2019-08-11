import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import * as AOS from 'aos';
import { ServicesNivel3Service } from '../../mod-nivel3/services/services-nivel3.service';
import { LoginService } from '../../login/login-service/login.service';
import { QuerysPrincipalService } from '../services/querys-principal.service';

@Component({
  selector: 'app-inicio-app',
  templateUrl: './inicio-app.component.html',
  styleUrls: ['./inicio-app.component.css']
})
export class InicioAppComponent implements OnInit {
  show = false;
  numberOfFacilities;
  numberOfServices;
  numberOfUsers;
  private facilitiesData;
  private servicesData;
  private usersData;

  constructor(private router: Router, private local: ServicesNivel3Service,
    private login: LoginService, private queryService: QuerysPrincipalService) {
  }

  ngOnInit() {

    // this.queryService.getLaboratorios().then(data => {
    //   console.log(data);
    //   this.query.estructurarDataLab(data).then(datos => {
    //     this.dataSource.data = datos['data'];
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.alert.hide();
    //   });
    // });

    $('html, body').animate({ scrollTop: '0px' }, 'slow');
    if (this.local.getLocalStorageUser()) {
      this.router.navigate(['principal']);
    } else {
      this.login.verificarUsuario().then(() => {
        setTimeout(() => {
          this.router.navigate(['principal']);
        }, 1000);
      });
    }
    $(document).on('click', '#navContact', function () {
      $('html, body').animate({
        scrollTop: $('#contactInfoSec').offset().top - $('#topDiv').height()
      }, 1000);
    });
    $(document).on('click', '#navAbout', function () {
      $('html, body').animate({
        scrollTop: $('#aboutSec').offset().top - $('#topDiv').height()
      }, 1000);
    });
    $(document).on('click', '#nextBtn', function () {
      $('html, body').animate({
        scrollTop: $('#aboutSec').offset().top - $('#topDiv').height()
      }, 1000);
    });
    $(document).on('click', '#goTopBtn', function () {
      $('html, body').animate({
        scrollTop: $('#mainSec').offset().top - $('#topDiv').height()
      }, 1000);
    });
    $(document).on('click', '#goTopBtn', function () {
      $('html, body').animate({
        scrollTop: $('#mainSec').offset().top - $('#topDiv').height()
      }, 1000);
    });
    // When the user scrolls down 20px from the top of the document, show the button and set inidicators numbers
    // window.onscroll = this.scrollFunction;
    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    // Here scroll is a variable holding the anonymous function 
    // this allows scroll to be assigned to the event during onInit
    // and removed onDestroy
    // To see what changed:
    const number = event.srcElement.scrollTop;
    this.scrollFunction();
  };

  scrollFunction():void {
    try {
      const scroll = $(window).scrollTop();
      const height = $(window).height();
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("goTopBtn").style.display = "block";
      } else {
        document.getElementById("goTopBtn").style.display = "none";
      }
      if (scroll > (height/2)+50) {
        this.setIndicatorsNumbers();
      }else{
        this.unsetIndicatorsNumbers();
      }
    } catch (error) {
      return
    }
  }

  setIndicatorsNumbers():void {
    this.numberOfUsers = 5800;
    this.numberOfFacilities = 287;
    this.numberOfServices = 480;
  }

  unsetIndicatorsNumbers():void {
    this.numberOfUsers = null;
    this.numberOfFacilities = null;
    this.numberOfServices = null;
  }

  goContactSec(): void {
    $('html, body').animate(
      {
        scrollTop: $('#contactInfoSec').offset().top - $('#topDiv').height() + 5
      },
      1000
    );
  }

  goAboutSec(): void {
    $('html, body').animate(
      {
        scrollTop: $('#aboutSec').offset().top - $('#topDiv').height() + 5
      },
      1000
    );
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  toggleShow() {
    this.show = !this.show;
  }

}
