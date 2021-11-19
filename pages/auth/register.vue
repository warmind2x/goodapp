<template>
<div class="center">
  <v-card class="d-flex justify-center mb-12 " max-width="500">
<v-img height="250" src="https://img.autocosmos.com/noticias/fotosprinc/NAZ_915e3be9d65c430784a99ad3d13a670a.jpg"></v-img>

<v-card-title>Register</v-card-title>
<v-divider class="mx-4"></v-divider>
<v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.usuario"
            :rules="nameRules"
            
            label="Usuario"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="user.userId"
            
            
            label="User ID"
            required
          ></v-text-field>
        </v-col>

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

        <v-card-actions>
          <v-col>

            <v-btn
        color="deep-purple lighten-2"
        
        @click="register"
      >
        Register
      </v-btn>
          </v-col>

          <v-col>
            <NuxtLink to="/auth/login"> Or Login?</NuxtLink>
          </v-col>
      

      
    </v-card-actions>

       

        
      </v-row>
    </v-container>
  </v-form>

</v-card>
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

<style>

.center {
  margin: auto;
  width: 35%;
  
  padding: 1px;
}</style>
