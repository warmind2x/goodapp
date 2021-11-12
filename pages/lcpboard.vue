<template>
<div>
  <div data-app>
    <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-container>

          <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          New Project
        </v-btn>
        </v-container>
        
        
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Project</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                <v-text-field
                  label="LCP Code"
                  required
                  v-model="newProject.lcpCode"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
              >
                <v-select
                  :items="['Capital', 'Expenses', 'Miscelaneo']"
                  label="Tipo"
                  required
                  v-model="newProject.type"
                ></v-select>
              </v-col>
              
              <v-col 
              cols="12"
              sm="6"
              md="6">
                <v-text-field
                  label="Capital"
                  
                  v-model="newProject.capital"
                ></v-text-field>
              </v-col>
              <v-col 
              cols="12"
              sm="6"
              md="6">
                <v-text-field
                  label="Expense"
                  v-model="newProject.expense"
                ></v-text-field>
              </v-col>

              <v-col 
              cols="12"
              sm="6"
              md="6">
                <v-text-field
                  label="GrafoCap"
                  v-model="newProject.grafoCap"
                ></v-text-field>
              </v-col>
              <v-col 
              cols="12"
              sm="6"
              md="6">
                <v-text-field
                  label="GrafoExp"
                  v-model="newProject.grafoExp"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                
              >
                <v-select
                  :items="['Mixer', 'Vulcanizacion', 'Preparatoria', 'Construccion', 'Final Finish', 'Planta']"
                  label="Locacion*"
                  required
                  v-model="newProject.locacion"
                ></v-select>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                
              >
                <v-select
                  :items="['OPEN', 'CLOSE']"
                  label="Status*"
                  required
                  v-model="newProject.status"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                
              >
                <v-text-field
                  label="Nombre"
                  required
                  v-model="newProject.nombre"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="createProject()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
  </div>
  <v-data-table
    :headers="headers"
    :items="projects"
    :items-per-page="5"
    class="elevation-1"
  ></v-data-table>
  
</div>
  
  
</template>


<script>
export default {
    middleware: 'Auth',
    name: 'lcp_board',
    data() {
      return {
        newProject:{
          lcpCode:"",
          nombre:"",
          type:"",
          capital:"",
          expenses:"",
          grafoCap:"",
          grafoExp:"",
          locacion:"",
          status:""
        },
        dialog: false,
        headers: [
          {
            text: 'LCP Code',
            align: 'start',
            sortable: false,
            value: 'lcpCode'
          },
          {text:'Tipo', value: 'type'},
          {text:'Capital (USD)', value: 'capital'},
          {text:'Expenses (USD)', value: 'expenses'},
          {text:'# Grafo Capital', value: 'grafoCap'},
          {text:'# Grafo Expenses', value: 'grafoExp'},
          {text:'Locacion', value: 'locacion'},
          {text:'Nombre', value: 'nombre'},
          
        ],
        projects:[],
      }
    },methods: {
      async getProjects() {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token
          }
        };

        try {
          const res = await this.$axios.get("/project", axiosHeaders);
          console.log(res.data);
          if (res.data.status == 'success') {
            this.projects = res.data.data;
            
          }
          
        } catch (error) {
          alert(error)
          return ;
          
        }
      },
      async createProject(){
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token
          }
        };

        const toSend ={
          newProject: this.newProject
        };

        try {
          const res = await this.$axios.post("/project", toSend, axiosHeaders);
          console.log(res.data);
          if (res.data.status == 'success') {
            this.dialog = false;
            this.getProjects();
            this.newProject.lcpCode = "";
            
          }
          
        } catch (error) {
          
        }

      }
    },mounted () {
      this.getProjects();
    },

}
</script>

<style>

</style>