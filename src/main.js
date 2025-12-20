import 'font-awesome-animation/css/font-awesome-animation.min.css'
import './assets/common.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPen, faTriangleExclamation, faArrowRight, faCircleCheck, faArrowLeft, faPrint, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { faLightbulb, faHouse } from '@fortawesome/free-regular-svg-icons'

library.add(faPen, faTriangleExclamation, faLightbulb, faArrowRight, faCircleCheck, faArrowLeft, faPrint, faArrowUpRightFromSquare, faHouse);

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
