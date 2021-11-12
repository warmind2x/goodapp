<template>
  <div>
    <div class="grid-container">
      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <label
            >E-mail
            <input
              type="email"
              placeholder="Ingrese Email"
              aria-describedby="usuarioHelpText"
              v-model="user.email"
            />
          </label>
          <p class="help-text" id="usuarioHelpText">
            Ingresa tu E-mail registrado
          </p>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <label
            >Password
            <input
              type="password"
              placeholder="Ingrese Password"
              aria-describedby="passHelpText"
              v-model="user.password"
            />
          </label>
          <p class="help-text" id="passHelpText">
            Ingresa tu password (A-Z, a-z, 0-9)
          </p>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <button class="hollow button" @click="Login()">Login</button>
          <NuxtLink to="/auth/register"> Or Register?</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
    middleware: 'notAuth',
  layout: "auth",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    Login() {
      this.$axios
        .post("/login", this.user)
        .then((result) => {
          console.log(result);
          if (result.data.status == "success") {
            alert("Bienvenido " + result.data.userData.usuario);
            const auth = {
                token: result.data.token,
                userData: result.data.userData,
              };
              //token to de store - token a la tienda
              this.$store.commit("setAuth", auth);
              //set auth object in localStorage - Grabamos el token en localStorage
              localStorage.setItem("auth", JSON.stringify(auth));
            $nuxt.$router.push("/");
            return;
          } else {
            if (result.data.status == "error") {
              alert("Credenciales incorrectas");
              
            }
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Credenciales incorrectas");
          (this.user.email = ""), (this.user.password = "");
        });
    },
  },
};
</script>

<style></style>
