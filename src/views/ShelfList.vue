<template>
    <div>
      <modal v-if="isCreatingShelf" @close="isCreatingShelf = false">
        <template #header>
          <p>Create New Shelf</p>
        </template>
        <template #body>
          Name <input v-model="newShelf.name" class="modalInput" type="text">
          Detail <textarea v-model="newShelf.detail" class="modalTextarea"></textarea>
          <div>
            Rows <input v-model="newShelf.rows" class="modalNumber" type="number">
            Columns <input v-model="newShelf.columns" class="modalNumber" type="number">
          </div>
        </template>
        <template #footer>
          <button @click="isCreatingShelf = false" class="modalButton">Close</button>
          <button @click="createShelf" class="modalButton right">Create</button>
        </template>
      </modal>
      <div class="title">{{ $t("shelflist.title") }}</div>
      <div @click="isCreatingShelf = true" class="create">
        Create
      </div>
      <div v-if="shelves.length === 0">Shelf list is empty...</div>
      <div class="table_wrapper" v-if="shelves">
        <div @click="toShelf(i.ID)" class="shelf" v-for="i in shelves" :key="i">
          <img width="130px" height="130px" src="../assets/shelf.png" :onerror="onImageError"/>
          <p>{{ i.Name }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/api';
  import Modal from '@/components/modal.vue'

  export default {
    name: "ShelfListComponent",
    data() {
      return {
        shelves: [],
        newShelf: {
          name: '',
          detail: '',
          columns: 2,
          rows: 2,
        },
        isCreatingShelf: false,
      };
    },
    components: {
      Modal,
    },
    methods: {
      async createShelf() {
        try {
          await apiClient.post('/shelves', this.newShelf);
          this.isCreatingShelf = false;
          this.getShelves();
        } catch (error) {
          this.isCreatingShelf = false;
          console.error('Error creating shelf:', error);
        }
      },
      async getShelves() {
        try {
          const response = await apiClient.get('/shelves');
          this.shelves = response.data;
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },
      toShelf(id) {
      this.$router.push({
          path: './shelf/'+id,
        })
      },
      onImageError(event) {
        event.target.src = require("@/assets/notfound.jpeg");
      }
    },
    created(){
      this.getShelves()
    }
  };
  </script>
  
<style scoped>

.modalButton {
  background-color: white;
  border: none;
  color: #2a2e32;
  width: 50%;
  border-right: 1px solid #2a2e32;
  height: 30px;
}

.modalInput {
  margin-bottom: 10px;
}

.modalNumber {
  width: 30px;
  margin: 0 auto;
}

.modalTextarea {
  resize: none;
  height: 50px;
  margin-bottom: 10px;
}

.modalButton.right {
  border-right: none;
  font-weight: 700;
}

.title {
  margin: 50px 0px 30px 0px;
  font-weight: 100;
  font-size: 30px;
}

.create {
  width: 120px;
  height: 25px;
  line-height: 25px;
  margin: 0 auto;
  border: 1px solid #2a2e32;
  margin-bottom: 20px;
}

.table_wrapper {
  display: grid;
  width: 630px;
  margin: 0 auto;
  grid-template-columns: 150px 150px 150px 150px;
  column-gap: 10px;
  row-gap: 10px;
}

.shelf {
  width: 150px;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #2a2e32;
}
</style>