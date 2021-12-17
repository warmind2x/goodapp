<template>
  <v-data-table
    :headers="headers"
    :items="requisiciones"
    sort-by="lcpCode"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Requisiciones</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Shopping Cart
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-autocomplete
                      v-model="editedItem.nombreProyecto"
                      :loading="loading"
                      :items="items"
                      :search-input.sync="search"
                      cache-items
                      class="mx-4"
                      flat
                      hide-no-data
                      hide-details
                      label="Nombre"
                      solo-inverted
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.shoppingCart"
                      label="Shopping Cart"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.descripcionGasto"
                      label="Descripcion Gasto"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select :items="items" label="Status"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.ordenCompra"
                      label="Orden Compra"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.cost"
                      label="Costo USD"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-dialog
                      ref="dialog"
                      v-model="modal"
                      :return-value.sync="date"
                      persistent
                      width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="date"
                          label="Fecha"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="modal = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.dialog.save(date)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="createReq"> Save </v-btn>
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
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    modal: false,
    loading: false,
    items: [],
    search: null,
    select: null,
    nombre: [],
    requisiciones: [],
    dialogDelete: false,
    headers: [
      {
        text: "LCP Code",
        align: "start",
        sortable: true,
        value: "lcpCode",
      },
      {
        text: "Shopping Cart",
        value: "shoppingCart",
      },
      {
        text: "Nombre Projecto",
        value: "nombreProyecto",
      },
      {
        text: "Descripcion Compra",
        value: "descripcionGasto",
      },
      {
        text: "Costo U$D",
        value: "cost",
      },
      {
        text: "Orden de compra",
        value: "ordenCompra",
      },
      {
        text: "Gasto estimado (aaaa-mm-dd)",
        value: "fechaGasto",
      },

      { text: "Actions", value: "actions", sortable: false },
    ],
    buys: [],
    editedIndex: -1,
    editedItem: {
      lcpCode: "",
      nombreProyecto: "",
      shoppingCart: null,
      descripcionGasto: "",
      ordenCompra: null,
      cost: null,
      fechaGasto: "",
    },
    defaultItem: {
      lcpCode: "",
      nombreProyecto: "",
      shoppingCart: null,
      descripcionGasto: "",
      ordenCompra: null,
      cost: null,
      fechaGasto: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva requisicion"
        : "Modificar requisicion";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },

    search(val) {
      val && val !== this.select && this.querySelections(val);
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
        const res = await this.$axios.get("/req", axiosHeaders);
        console.log(res.data.data);
        if (res.data.status == "success") {
          this.requisiciones = res.data.data;
        }
      } catch (error) {
        alert(error);
        return;
      }
    },

    editItem(item) {
      
      this.editedIndex = this.requisiciones.indexOf(item);
      this.editedItem = Object.assign({}, item);
      
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.requisiciones.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      console.log(this.requisiciones[this.editedIndex]);
      this.deleteReq(this.requisiciones[this.editedIndex]);
      this.requisiciones.splice(this.editedIndex, 1);
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
        Object.assign(this.requisiciones[this.editedIndex], this.editedItem);
      } else {
        this.requisiciones.push(this.editedItem);
      }
      this.close();
    },

    async querySelections(v) {
      this.loading = true;
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
      };
      try {
        const res = await this.$axios.get("/project", axiosHeaders);
        console.log(res.data.data);
        if (res.data.status == "success") {
          for (let index = 0; index < res.data.data.length; index++) {
            this.nombre.push(res.data.data[index].nombre);
          }
          console.log(this.nombre);
          setTimeout(() => {
            this.items = this.nombre.filter((e) => {
              return (
                (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
              );
            });
            this.loading = false;
          }, 500);
        }
      } catch (error) {
        alert(error);
        return;
      }
    },

    async createReq() {
      if (this.editedIndex === -1) {
        const axiosHeaders = {
          headers: {
            token: this.$store.state.auth.token,
          },
        };

        this.editedItem.fechaGasto = this.date;

        const toSend = {
          
          newReq: this.editedItem,
        };

        try {
          const res = await this.$axios.post("/req", toSend, axiosHeaders);
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
          editReq: this.editedItem,
        };

        try {
          const res = await this.$axios.put("/req", toSend, axiosHeaders);
          console.log(res.data);
          if (res.data.status == "success") {
            this.dialog = false;
            this.initialize();
          }
        } catch (error) {}
      }
    },

    deleteReq(req) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token,
        },
        params: {
          shoppingCart: req.shoppingCart,
        },
      };
      this.$axios
        .delete("/req", axiosHeaders)
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
  },
};
</script>

<style></style>
