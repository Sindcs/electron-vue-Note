import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default,
      children: [
        {
          path: '/nodeIndex/:uuid',
          name: 'nodeIndex',
          component: require('@/components/personalNote/index').default,
          children: [
            {
              path: '/nodeDetail/:uuid',
              name: 'nodeDetail',
              component: require('@/components/personalNote/noteEditor').default
            }
          ]
        },
        {
          path: '/newNode',
          name: 'newNode',
          component: require('@/components/personalNote/noteEditor').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
