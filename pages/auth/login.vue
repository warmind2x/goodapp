<template>
<div class="center">
  <v-card class="mx-auto my-12" max-width="500">
    <v-img height="250" src="https://img.autocosmos.com/noticias/fotosprinc/NAZ_915e3be9d65c430784a99ad3d13a670a.jpg"></v-img>

    <v-card-title>Login</v-card-title>
    <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            
            label="E-mail"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>

        <v-col
        cols="12"
        md="3"
        >
          <v-btn @click="Login">Login</v-btn>
          <NuxtLink to="/auth/register"> Or Register?</NuxtLink>
        </v-col>

        
      </v-row>
    </v-container>
  </v-form>
    

  </v-card>
</div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
    middleware: 'notAuth',
  layout: "auth",
  data() {
    return {
      show1: false,
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
            $nuxt.$router.push("/projects");
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

<style>
 .center {
  margin: auto;
  width: 35%;
  
  padding: 1px;
}
</style>
