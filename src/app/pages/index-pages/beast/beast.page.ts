import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { beast } from 'src/app/model/beast';
import { ApiBeastService } from 'src/app/services/api-beast.service';
import { UiService } from 'src/app/services/ui.service';
import { FormbeastPage } from '../formbeast/formbeast.page';

@Component({
  selector: 'app-beast',
  templateUrl: './beast.page.html',
  styleUrls: ['./beast.page.scss'],
})
export class BeastPage implements OnInit {
  public bestias: Array<beast>;
  @ViewChild('input', {static: false}) myInput: IonSearchbar ;

  constructor(private apiBea: ApiBeastService,
    private ui:UiService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.loadAll();
  }

  //________________________________________________loadAll
  public async loadAll() {
    await this.ui.showLoading();
    try {
      this.bestias = await this.apiBea.getBeast();
      await this.ui.hideLoading();
    } catch (err) {
      this.bestias = null; //vista
      await this.ui.hideLoading();
      await this.ui.showToast(err.error, "danger");
    }
  }

  //________________________________________________removeBeast
  public async removeBeast(beast: beast) {
    await this.ui.showLoading();
    this.apiBea
      .removeBeast(beast)
      .then(async d => await this.loadAll())
      .catch(async err => await this.ui.showToast(err.error, "danger"))
      .finally(async () => {
        await this.ui.hideLoading();
      });
  }

  //________________________________________________searchBeast
  public async searchBeast($event) {
    console.log($event);
    let value = $event.detail.value;
    console.log(value);
    value = value.trim();
    if (value !== '') {
      //await this.ui.showLoading();
      this.apiBea.searchByName(value)
      .then(d => {
        this.bestias = d;
      })
      .catch(async err => await this.ui.showToast(err.error, "danger"))
      .finally(async () => {
       // await this.ui.hideLoading();
       // this.myInput.setFocus();
      });
    } else {
      await this.loadAll();
    }
  }

  //________________________________________________addBeast
  public async addBeast() {
    const beastToBeAdd = await this.ui.showModal(FormbeastPage, { beast: {} });
    console.log(beastToBeAdd);
    try {
      if (beastToBeAdd.data) {
        // si no cierra
        await this.ui.showLoading();
        await this.apiBea.createBeast(beastToBeAdd.data);
        await this.loadAll();
      }
    } catch (err) {
      await this.ui.hideLoading();
      await this.ui.showToast(err.error, "danger");
    }
  }

  //________________________________________________editBeast
  public async editBeast(_beast: beast) {
    const beastToBeUpdated = await this.ui.showModal(FormbeastPage, { beast : _beast });
    try {
      if (beastToBeUpdated.data) {
        console.log(_beast);
        // si no cierra
        await this.ui.showLoading();
        await this.apiBea.updateBeast(beastToBeUpdated.data);
        await this.loadAll();
      }
    } catch (err) {
      await this.ui.hideLoading();
      await this.ui.showToast(err.error, "danger");
    }
  }

  //__________________________________________________________AMPLIAR BESTIA
  public seecha(beast: beast){
    this.apiBea.seePJ(beast);
  }
  
  //__________________________________________________________ALERT DELETE
  async presentAlert(beast: beast) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la bestia?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          // Ha respondido que no así que no hacemos nada
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          // AquÍ borramos el sitio en la base de datos
          this.removeBeast(beast);
        }
      }]
    });

    await alert.present();
  }
}