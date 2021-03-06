<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>PROYECTOS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Proyecto
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.lcpCode"
                      label="lcpCode"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="projectType"
                      label="Project Type"
                      v-model="editedItem.type"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.capital"
                      label="Capital ($)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.expenses"
                      label="Expenses ($)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.grafoCap"
                      label="Grafo Capital"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-model="editedItem.grafoExp"
                      label="Grafo Expense"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      :items="projectLocation"
                      label="Locacion"
                      v-model="editedItem.locacion"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="createProject">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-cash-multiple </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  middleware: "Auth",
  data: () => ({
    projectType: ["CAPITAL", "EXPENSES", "MISCELANEO"],
    projectLocation: [
      "VULCANIZACION",
      "MIXER",
      "PREPARATORIA",
      "PLANTA",
      "FINAL FINISH",
      "CONSTRUCCION",
      "BODEGAS",
    ],
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "LCP Code",
        align: "start",
        sortable: false,
        value: "lcpCode",
      },
      { text: "Tipo", value: "type" },
      { text: "Capital (USD)", value: "capital" },
      { text: "Expenses (USD)", value: "expenses" },
      { text: "# Grafo Capital", value: "grafoCap" },
      { text: "# Grafo Expenses", value: "grafoExp" },
      { text: "Locacion", value: "locacion" },
      { text: "Nombre", value: "nombre" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    projects: [],
    editedIndex: -1,
    editedItem: {
      lcpCode: "",
      nombre: "",
      type: "",
      capital: null,
      expenses: null,
      grafoCap: null,
      grafoExp: null,
      locacion: "",
      status: "",
    },
    defaultItem: {
      lcpCode: "",
      nombre: "",
      type: "",
      capital: null,
      expenses: null,
      grafoCap: null,
      grafoExp: null,
      locacion: "",
      status: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Proyecto" : "Modificar Proyecto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };

      try {
        const res = await this.$axios.get("/project", axiosHeaders);
        console.log(res.data);
        if (res.data.status == "success") {
          this.projects = res.data.data;
          this.$store.dispatch("saveProjects");
        }
      } catch (error) {
        alert(error);
        return;
      }
    },

    editItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteProject(this.projects[this.editedIndex]);
      this.projects.splice(this.editedIndex, 1);

      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.projects[this.editedIndex], this.editedItem);
        
      } else {
        this.projects.push(this.editedItem);
        
      }
      this.close();
    },
    deleteProject(project) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
        params: {
          lcpCode: project.lcpCode,
        },
      };
      this.$axios
        .delete("/project", axiosHeaders)
        .then((res) => {
          if (res.data.status == "success") {
          }
          $nuxt.$emit("time-to-get-devices");
          return;
        })
        .catch((e) => {
          console.log(e);

          return;
        });
    },
    async createProject() {
      if (this.editedIndex === -1) {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token,
          },
        };

        const toSend = {
          newProject: this.editedItem,
        };

        try {
          const res = await this.$axios.post("/project", toSend, axiosHeaders);
          console.log(res.data);
          if (res.data.status == "success") {
            this.dialog = false;
            this.initialize();
          }
        } catch (error) {}
      } else {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token,
          },
        };

        const toSend = {
          editProject: this.editedItem,
        };

        try {
          const res = await this.$axios.put("/project", toSend, axiosHeaders);
          console.log(res.data);
          if (res.data.status == "success") {
            this.dialog = false;
            this.initialize();
          }
        } catch (error) {}
      }
    },
  },
};
</script>
