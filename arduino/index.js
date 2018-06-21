const five = require("johnny-five"),
      admin = require("firebase-admin"),
      serviceAccount = require("./config/serviceAccountKey.json");

class Device {
  constructor(name) {
    this.name = name;
    this.firebase = admin;
    this.board = new five.Board();

    this.state = {
      circuitClosed: false 
    }

    // Initiation Process
    this.initFirebase()
    this.initDevice()
  }

  async initDevice() {
    try {
      await this.startBoard();

      this.components = {
        switch: new five.Button(3),
        relay: new five.Relay(5) 
      }

      this.components.switch.on('press', this.onPressSwitch.bind(this));
      this.listenRemoveServer();

    } catch (e) {
      console.log(e);
      console.error('Board Not started!')
    }
  }

  listenRemoveServer() {
    this.remoteReference.on("value", snapshot => {
      this.state.circuitClosed = snapshot.val();
      this.updateRelay();
    });
  }

  startBoard() {
    return new Promise( (resolve, reject) => {
      this.board.on('ready', resolve);
      this.board.on('error', reject);
    })
  }

  initFirebase() {
    this.firebase.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://api-project-372641623055.firebaseio.com/"
    });

    this.remoteReference = admin.database().ref(`/devices/${this.name}/status`);

    this.remoteReference.once('value')
    .then(snapshot => {
      let value = snapshot.val();
      if (value === null) {
        console.log(`Registering device ${this.name}`);
        return this.remoteReference.set(false).then(() => { console.log('device registred!') });
      }
    })
  }

  updateRelay() {
    if (this.state.circuitClosed) {
      this.components.relay.close()
    } else {
      this.components.relay.open()
    }
  }

  toggleRelay() {
    this.state.circuitClosed = !this.state.circuitClosed;
    this.remoteReference.set(this.state.circuitClosed);
  }

  onPressSwitch() {
    this.toggleRelay();
  }
}

let device = new Device('desk light');