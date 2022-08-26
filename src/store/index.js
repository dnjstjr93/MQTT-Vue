import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        VUE_APP_MQTT_PROTOCOL: 'mqtt',
        VUE_APP_MQTT_HOST: 'gcs.iotocean.org',
        VUE_APP_MQTT_PORT: 1883,

        client: {
            connected: false,
            loading: false
        },

        MQTT_CONNECTION_CONNECTED: false
    },
})
