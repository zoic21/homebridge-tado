import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { TadoHomebridgePlatform } from './platform';

import { Tado } from("node-tado-client");

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class PresencePlatformAccessory {
  private service: Service;

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private exampleStates = {
    On: false,
    Brightness: 100,
  };

  constructor(
    private readonly platform: TadoHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'homebridge-tado')
      .setCharacteristic(this.platform.Characteristic.Model, 'switch')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'presence');

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = new this.platform.Service(this.platform.Service.Switch);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On).onSet(this.handleOnSet.bind(this));
  }

  updateValue(value){
    this.platform.log.debug('Update switch value to :', value);
    this.service.updateCharacteristic(this.platform.Characteristic.On, value);
  }

  /**
   * Handle requests to set the "On" characteristic
   */
  handleOnSet(value) {
    this.platform.log.debug('Triggered SET On:'+value);
  }

}
