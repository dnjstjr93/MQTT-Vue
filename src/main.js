import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faWifi
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(
    faWifi
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
//쿠키를 사용한다.

//쿠키의 만료일은 7일이다. (글로벌 세팅)

Vue.config.productionTip = false

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
