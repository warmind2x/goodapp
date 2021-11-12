<template>
  <div>
    <div class="grid-container">
      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <label
            >Usuario
            <input
              type="text"
              placeholder="Ingrese Usuario"
              aria-describedby="usuarioHelpText"
              v-model="user.usuario"
            />
          </label>
          <p class="help-text" id="usuarioHelpText">
            Ingresa tu nombre de usuario
          </p>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <label
            >Email
            <input
              type="email"
              placeholder="Ingrese Correo"
              aria-describedby="emailHelpText"
              v-model="user.email"
            />
          </label>
          <p class="help-text" id="emailHelpText">Ingresa tu Email</p>
        </div>
      </div>

      <div class="grid-x grid-margin-x">
        <div class="cell small-4">
          <label
            >User ID
            <input
              type="text"
              placeholder="Ingrese UserID"
              aria-describedby="useridHelpText"
              v-model="user.userId"
            />
          </label>
          <p class="help-text" id="useridHelpText">Ingresa tu User ID</p>
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
          <button class="hollow button" @click="register()">Register</button>
          <NuxtLink to="/auth/login"> Or Login?</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    middleware: 'notAuth',
  layout: "auth",
  data() {
    return {
      user: {
        usuario: "",
        email: "",
        password: "",
        userId:""
      },
    };
  },
  methods: {
    register() {
      // logica axios para registrar en base de datos

      this.$axios
        .post("/register", this.user)
        .then((result) => {
          console.log(result);
          if (result.data.status == "success") {
            alert("Usuario creado con exito");
            $nuxt.$router.push("/auth/login")
          }
        })
        .catch((err) => {
          console.log(err.response.data);
          if (err.response.data.error.errors.email.kind == "unique") {
            alert("E-mail o User ID ya existe");
            this.user.usuario = "";
            this.user.email = "";
            this.user.password = "";
            this.user.userId = "";
          }
        });
      console.log("Se esta registrando " + this.user.usuario);
      this.user.usuario = "";
      this.user.email = "";
      this.user.password = "";
      this.user.userId = "";
    },
  },
};
</script>

<style></style>
