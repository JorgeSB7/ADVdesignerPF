import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { character } from 'src/app/model/character';
import { AuthService } from 'src/app/services/auth.service';
import { ImageaddService } from 'src/app/services/imageadd.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-formcharacter',
  templateUrl: './formcharacter.page.html',
  styleUrls: ['./formcharacter.page.scss'],
})
export class FormcharacterPage {
  private character: character;
  public mode: string;
  private form: FormGroup;
  private result; result1; result2; result3 = 0;
  private aux = 0;
  private fue; des; con; int; sab; car = 0;

  constructor(private modal: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private authS: AuthService,
    private gallery: ImageaddService,
    private ui: UiService) {

    this.character = this.navParams.get('character');
    if (this.character && this.character.code) {
      console.log(this.character);
      this.mode = 'Editing';
    } else {
      this.mode = 'Creating';
      this.character = {
        code: '',  // for autoincrement
        namecharacter: '',
        race: '',
        rolclass: '',
        image: '',
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        creator: this.authS.getUser()
      };
    }

    this.form = this.formBuilder.group({
      code: new FormControl(this.character.code),

      namecharacter: new FormControl(
        this.character.namecharacter,
        Validators.compose([Validators.required, Validators.maxLength(30)])
      ),
      race: new FormControl(
        this.character.race,
        Validators.compose([Validators.required])
      ),
      rolclass: new FormControl(
        this.character.rolclass,
        Validators.compose([Validators.required])
      ),
      strength: new FormControl(
        this.character.strength,
        Validators.compose([Validators.required])
      ),
      dexterity: new FormControl(
        this.character.dexterity,
        Validators.compose([Validators.required])
      ),
      constitution: new FormControl(
        this.character.constitution,
        Validators.compose([Validators.required])
      ),
      intelligence: new FormControl(
        this.character.intelligence,
        Validators.compose([Validators.required])
      ),
      wisdom: new FormControl(
        this.character.wisdom,
        Validators.compose([Validators.required])
      ),
      charisma: new FormControl(
        this.character.charisma,
        Validators.compose([Validators.required])
      ),
    });
  }

  /**
   * Funcion que genera un numero aletorio.
   * @param min el minimo valor que puede dar como resultado.
   * @param max el maximo valor que puede dar como resultado.
   * @returns devuelve un numero aletorio en el rango entre el min y el max (ambos incluidos).
   */
  randomIntFromInterval(min, max) { // min and max included
    this.result = Math.floor(Math.random() * (max - min + 1) + min);
    return this.result;
  }

  /**
   * La funcion simula una suma de tres tiradas de un dado de 6 caras. De esta forma se determinan los valores de las caracteristicas de un juego de rol que integre el sistema d20. La función genera tres numeros aleatorios entre el 1 al 6, los suma y aplica el valor resultante a la caracteristica deseada.
   * @param carac recibe un string que determina a que caracteristica va a atacar la funcion.
   */
  tirada(carac: string) {
    this.result1 = this.randomIntFromInterval(1, 6);
    this.result2 = this.randomIntFromInterval(1, 6);
    this.result3 = this.randomIntFromInterval(1, 6);
    this.aux = this.result1 + this.result2 + this.result3;
    if (carac == "fue") {
      this.fue = this.aux;
    } else if (carac == "des") {
      this.des = this.aux;
    } else if (carac == "con") {
      this.con = this.aux;
    } else if (carac == "int") {
      this.int = this.aux;
    } else if (carac == "sab") {
      this.sab = this.aux;
    } else if (carac == "car") {
      this.car = this.aux;
    } else {
      this.ui.showToast("ERROR", "danger");
    }
  }
  // Se envia el formulario
  submitForm() {
    console.log("ENVIANDO FORMULARIO")
    let character = this.form.value
    /* En esta parte del codigo se aplican los bonus por raza. Solo aparecen si se esta creando el personaje y no editando uno existente. */
    if (character.race == "Dracónido" && this.mode != 'Editing') {
      character.strength = character.strength + 2;
      character.charisma = character.charisma + 1;
    } else if (character.race == "Humano" && this.mode != 'Editing') {
      character.strength = character.strength + 1;
      character.dexterity = character.dexterity + 1;
      character.constitution = character.constitution + 1;
      character.intelligence = character.intelligence + 1;
      character.wisdom = character.wisdom + 1;
      character.charisma = character.charisma + 1;
    } else if (character.race == "Elfo" && this.mode != 'Editing') {
      character.dexterity = character.dexterity + 1;
      character.intelligence = character.intelligence + 1;
    } else if (character.race == "Gnomo" && this.mode != 'Editing') {
      character.intelligence = character.intelligence + 2;
    } else if (character.race == "Enano" && this.mode != 'Editing') {
      character.constitution = character.constitution + 2;
    } else if (character.race == "Mediano" && this.mode != 'Editing') {
      character.dexterity = character.dexterity + 2;
    } else if (character.race == "Semielfo" && this.mode != 'Editing') {
      character.charisma = character.charisma + 2;
      character.dexterity = character.dexterity + 1;
      character.intelligence = character.intelligence + 1;
    } else if (character.race == "Semiorco" && this.mode != 'Editing') {
      character.strength = character.strength + 2;
      character.constitution = character.constitution + 1;
    } else if (character.race == "Tiefling" && this.mode != 'Editing') {
      character.charisma = character.charisma + 2;
      character.intelligence = character.intelligence + 1;
    }
    character.image = this.character.image
    // Si no se ha insertado una imagen en el formulario se inserta una por defecto.
    if (character.image == null) {
      character.image = 'data:image/jpeg;base64,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'
    }
    character.creator = this.authS.getUser();
    console.log(character);
    this.dismiss(character);
  }

  public dismiss(character: character) {
    this.modal.dismiss(character);
  }

  //_________________________________________________IMG
  /**
   * Selecciona una imagen de la galeria.
   */
  setImg() {
    this.gallery.getImage().then(result => {
      this.character.image = this.gallery.image
      console.log(this.gallery.image)
    }).catch(err => {
      console.log(err)
    });
  }

}