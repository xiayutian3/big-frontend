import Main from '@/components/main'

export default [
  // 菜单分三种情况
  // 链接式的跳转 -》doc
  // 内嵌的子页面 -》 Main Layout -》 children
  // 一级菜单上添加的路由 （hideInMenu hideInBread）

  // 内容管理
  // 1.文章管理 -》 文章内容管理，文章标签管理（热门，精华，etc）

  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          icon: 'md-grid',
          title: '内容管理',
          notCache: true
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-grid',
          title: '标签管理',
          notCache: true
        },
        component: () => import('@/view/components/tables/tables.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'logo-buffer',
      title: '菜单管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '菜单管理',
          notCache: true
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'logo-buffer',
      title: '权限管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限',
          notCache: true
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'logs_check',
        meta: {
          icon: 'ios-bug',
          title: '错误日志',
          notCache: true
        },
        component: () => import('@/view/logs/index.vue')
      }
    ]
  }
]
