module.exports = function(admin, params) {
  return admin.database().ref(`/devices/${params.object}/status`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(value => {
      if (value === null) {
        return {
          speech: `Hey! this device does not exists`,
          text: `Hey! this device does not exists`
        }
      } else if (value === false) {
        return {
          speech: `The ${params.object} is already off`,
          text: `The ${params.object} is already off`
        }
      }
      return admin.database().ref(`/devices/${params.object}/status`).set(false).then(() => ({
        speech: `Turning ${params.object} off`,
        text: `Turning ${params.object} off`
      }))
    });
}