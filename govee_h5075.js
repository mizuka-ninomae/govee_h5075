const child_process = require ('child_process');
const path          = require ('path');
const AsyncLock     = require ('async-lock');

class GoveeH5075 {
  constructor (ble_mac, ble_ctl_path = '/usr/local/lib/node_modules/govee_h5075/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('ble_key', function () {

      const ble_ctl = child_process.fork (path.join (ble_ctl_path, 'ble_ctl.js'));
      const obj = { ble_mac: ble_mac }

      ble_ctl.send (obj);

      ble_ctl.on ('message', function (json) {
        ble_ctl.kill ('SIGINT');
        let buf = (json.message.ManufacturerData['60552'][1] << 16 | json.message.ManufacturerData['60552'][2] << 8 | json.message.ManufacturerData['60552'][3]);
        callback (null, {
          te: Math.round((buf / 10000) * 10) / 10,
          hu: Math.round(buf % 1000) / 10,
          bt: json.message.ManufacturerData['60552'][4]
        });
        return;
      })

      ble_ctl.on ('error', function (error) {
        callback (error, null);
        return;
      })
    }
  )}
}

if (require.main === module) {
  new GoveeH5075 (process.argv[2], process.argv[3], function (error, value) {
    console.log (value);
    console.log (error);
  });
}
else {
  module.exports = GoveeH5075;
}
