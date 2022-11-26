import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faWifi, faList, faCircle
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import VueClipboard from 'vue-clipboard2'

library.add(
    faWifi, faList, faCircle
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
