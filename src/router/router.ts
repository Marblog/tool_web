import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from "../components/Home.vue"
import Test from "../components/Test.vue"
import Index from "../components/Index.vue";
import Rules from "../components/Rule.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Index,
        children: [
            {path: '/home', component: Home},
            {path: '/rule', component: Rules}
        ]
    },
    {path: '/test', component: Test},


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
