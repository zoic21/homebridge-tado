import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { TadoHomebridgePlatform } from './platform';

import { Tado } from "node-tado-client";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class PresencePlatformAccessory {
  private service: Service;
  private homeId;

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
    this.service = this.accessory.getService(this.platform.Service.Switch) || this.accessory.addService(this.platform.Service.Switch);
    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.name);
    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On).onSet(this.handleOnSet.bind(this));
    this.homeId = accessory.context.device.id
  }

  updateValue(value){
    if(this.service.getCharacteristic(this.platform.Characteristic.On).value != value){
      this.platform.log.debug('Update switch value to :', value);
      this.service.updateCharacteristic(this.platform.Characteristic.On, value);
    }
  }

  /**
   * Handle requests to set the "On" characteristic
   */
  handleOnSet(value) {
   
    if(value){
      this.platform.log.debug('Triggered presence to home');
      this.platform.Tado.setPresence(this.homeId,'home')
    }else{
      this.platform.log.debug('Triggered presence to away');
      this.platform.Tado.setPresence(this.homeId,'away')
    }
    this.platform.refreshData()
  }

}
