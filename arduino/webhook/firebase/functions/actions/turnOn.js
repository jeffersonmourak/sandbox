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
      } else if (value === true) {
        return {
          speech: `The ${params.object} is already on`,
          text: `The ${params.object} is already on`
        }
      }
      return admin.database().ref(`/devices/${params.object}/status`).set(true).then(() => ({
        speech: `Turning ${params.object} on`,
        text: `Turning ${params.object} on`
      }))
    });
}