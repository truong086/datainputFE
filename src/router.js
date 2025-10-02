import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "./components/loginPage.vue";
import AdminPage from "./components/Admin/indexPage.vue"
import DasboardPage from "./components/Admin/dashboardPage.vue"
import TablePage from "./components/Admin/tablePage.vue"

import { useCounterStore } from "./store";
// import { path } from "ramda";
// import { compose } from "ramda";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage, // Đăng ký trang đăng nhập
    meta: {
      css: [
        "/LoginTemplate/style.css"
      ],
      js: [
        "/LoginTemplate/main.js"
      ],
    },
  },
  {
    path: "/Admin",
    name: "admin",
    component: AdminPage,
    meta: {
      css: [
        "/AdminTemplate/assets/css/bootstrap.min.css",
        "/AdminTemplate/assets/css/plugins.min.css",
        "/AdminTemplate/assets/css/kaiadmin.min.css",
        "/AdminTemplate/assets/css/demo.css"
      ],
      js: [
        "/AdminTemplate/assets/js/plugin/webfont/webfont.min.js",
        "/AdminTemplate/assets/js/core/jquery-3.7.1.min.js",
        "/AdminTemplate/assets/js/core/popper.min.js",
        "/AdminTemplate/assets/js/core/bootstrap.min.js",
        "/AdminTemplate/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js",
        "/AdminTemplate/assets/js/plugin/datatables/datatables.min.js",
        "/AdminTemplate/assets/js/kaiadmin.min.js",
        "/AdminTemplate/assets/js/setting-demo2.js"
      ],
      requiresAuth: true, roleAdmin: ["admin", "User"]
    },
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: DasboardPage
      },
      {
        path: "table",
        name: "table",
        component: TablePage
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function loadBootstrap(to) {
  // Load CSS
  const cssFiles = to.meta.css || [];
  cssFiles.forEach((css) => {
    if (!document.querySelector(`link[href="${css}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = css;
      document.head.appendChild(link);
    }
  });

  // Load JS
  const jsFiles = to.meta.js || [];
  jsFiles.forEach((js) => {
    if (!document.querySelector(`script[src="${js}"]`)) {
      const script = document.createElement("script");
      script.src = js;
      script.async = false;
      document.body.appendChild(script);
    }
  });
}

router.afterEach((to) => {
  loadBootstrap(to);
});

router.beforeEach((to, from, next) => {
  loadBootstrap(to);
  const counter = useCounterStore();
  const paths = ["/login"];

  const checkPaths = !paths.includes(to.path);

  const auth = to.meta.requiresAuth;
  const roles = to.meta.roleAdmin;
  const token = counter.getToken;
  const role = counter.getRole(0) || -1;

  if (checkPaths && token && (!roles || roles.includes(role))) {
    next();
  }
  if (auth && !token) {
    next("/login");
  } else if (auth && token) {
    if (!roles || roles.includes(role)) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
  if (paths) {
    next("/login");
  } else {
    next();
  }
});

export default router;
