<template>
  <body>
    <main>
      <section class="login">
        <img src="../assets/LoginTemplate/img/riot.png" class="loginlogo" />
        <h1 class="logintitle">Fazer Login</h1>

        <label class="loginlabel">
          <span>nome de usuario</span>
          <input
            v-model="loginModel.username"
            type="text"
            name="username"
            class="input"
          />
        </label>

        <label class="loginlabel">
          <span>senha</span>
          <input
            v-model="loginModel.password"
            type="password"
            name="password"
            class="input"
          />
        </label>

        <div class="loginicons">
          <button type="button" class="iconbutton">
            <img
              src="../assets/LoginTemplate/img/facebook.png"
              alt="facebook"
            />
          </button>

          <button type="button" class="iconbutton">
            <img src="../assets/LoginTemplate/img/google.png" alt="google" />
          </button>

          <button type="button" class="iconbutton">
            <img src="../assets/LoginTemplate/img/apple.png" alt="apple" />
          </button>
        </div>

        <label class="loginlabel--checkbox">
          <input type="checkbox" class="input--checkbox" />
          manter login
        </label>

        <button v-on:click="login" type="button" class="loginbutton" disabled>
          <h1>></h1>
        </button>

        <a href="#" class="loginlink">não consegue iniciar a sessão?</a>
        <a href="#" class="loginlink">criar conta</a>
      </section>

      <section class="wallpaper"></section>
    </main>
  </body>

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>載入中......</p>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, getCurrentInstance } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useCounterStore } from "../store";

const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const loginModel = ref({
  username: "",
  password: "",
});

const router = useRouter();
const store = useCounterStore()

const isLoading = ref(false);

const login = async () => {
  if (!checkData()) {
    Swal.fire("Data rỗng");
    return;
  }

  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.post(hostName + "/api/User/login", loginModel.value);
  console.log(res);
  if (res.data.success) {
    
    store.clearStore()
    store.setToken(res.data.content.token)
    if(res.data.content.role.length > 0){
        res.data.content.role.forEach(element => {
            store.setRole(element.rolename)
        });
    }
    store.setIdAccount(res.data.content.id)
    store.setAccountName(res.data.content.username)
    router.push("/dashboard");
  } else {
    Swal.fire("Tài khoản hoặc mật khẩu không chính xác");
  }
  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const checkData = () => {
  if (loginModel.value.username === "" || loginModel.value.password === "")
    return false;

  return true;
};
</script>

<style>
/* Màn hình chờ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: all; /* Kích hoạt lớp phủ ngăn tương tác */
}

/* Biểu tượng spinner */
.spinner {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Hiệu ứng xoay */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ngăn người dùng thao tác khi đang load */
body.loading {
  pointer-events: none; /* Ngăn tất cả tương tác */
  user-select: none; /* Ngăn chọn văn bản */
}
</style>
