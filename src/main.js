import 'font-awesome-animation/css/font-awesome-animation.min.css'
import './assets/common.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPen, faComputer, faPalette, faTriangleExclamation, faArrowRight, faCheck, faArrowLeft, faPrint, faArrowUpRightFromSquare, faBriefcase, } from '@fortawesome/free-solid-svg-icons'
import { faClipboard, faHandPointer, faLightbulb, faChartBar, faHouse, faCopy } from '@fortawesome/free-regular-svg-icons'

library.add(faClipboard, faPen, faHandPointer, faComputer, faPalette, faTriangleExclamation, faLightbulb, faArrowRight, faBriefcase, faChartBar, faArrowLeft, faPrint, faArrowUpRightFromSquare, faHouse, faCheck, faCopy);

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
