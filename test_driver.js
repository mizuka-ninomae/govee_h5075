const GoveeH5075  = require('govee_h5075');
let  blu_mac        = "XX:XX:XX:XX:XX:XX";
let  noble_ctl_path = "/home/pi/homebridge-sensor/node_modules/govee_h5075/";

let wosendor = new GoveeH5075 (blu_mac, noble_ctl_path, function (error, value) {
    console.log (value);
    console.log (error);
});
