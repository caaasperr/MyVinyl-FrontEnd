<template>
  <div class="masterWrapper">
    <div class="wrapper">
      <div v-if="shelf.Detail" class="detail">{{ shelf.Detail }}</div>
        <div class="bnc_container">
          <div @click="this.$router.push({path: '../shelves'})" class="back">...</div>
          <h1 class="title">{{ shelf.Name }}</h1>
          <img width="20px" src="../assets/info.png" @click="isOpeningInfo = true;" class="info">
        </div>
        <br>
        <table class="grid-table" v-if="shelf.Columns && shelf.Rows">
          <tbody>
            <tr v-for="r in shelf.Rows" :key="r">
              <td 
                v-for="c in shelf.Columns" 
                :key="`${r}-${c}`" 
              >
              <div v-if="getSlot(r - 1, c - 1).Enabled" class="cell">
                <div class="cell_box" @click="selectedShelfSlot = getSlot(r - 1, c - 1).ID; getShelfslotVinyls(getSlot(r - 1, c - 1).ID);"></div>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
      <p v-else>Empty Shelves...</p>
    </div>
    <div v-if="selectedShelfSlot" class="shelfDetail">
      <div class="shelfDetailCell">
        <div class="shelfDetailCellBox">
          <div class="shelfNavBar">
            <div class="ssTitle">{{ getSlotById(selectedShelfSlot).Name }}</div>
            <div class="shelfClose" @click="selectedShelfSlot = 0; vinyls = [];">X</div>
          </div>
          <div class="notfound" v-if="vinyls.length === 0">
            Nothing to show about...
          </div>
          <div class="pure-g albumCoversResult">
            <div
              class="pure-u-1-4 pure-u-lg-1-4"
              v-for="v in vinyls"
              :key="v.Name"
            >
              <img
                class="pure-img"
                :src="v.ImageURL"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpeningInfo" class="shelfDetail">
      <div class="shelfDetailCell">
        <div class="shelfDetailCellBox">
          <div class="shelfNavBar">
            <div class="shelfInfoTitle">Shelf Information</div>
          </div>
          <div style="max-height: 430px; overflow-y: auto;">
            <input class="nameInput" type="text" v-model="updateShelfData.Name" placeholder="Name...">
            <textarea class="detailTa" v-model="updateShelfData.Detail" placeholder="Detail..."></textarea>
            <div class="adjustTitle">{{ $t("shelf.setting.setting_enabled") }}</div>
            <table class="grid-table small" v-if="shelf.Columns && shelf.Rows">
              <tbody>
                <tr v-for="r in shelf.Rows" :key="r">
                  <td v-for="c in shelf.Columns" :key="`${r}-${c}`">
                    <div class="cell small">
                      <div
                        class="cell_box small"
                      >
                        <input type="checkbox" :checked="getSlot(r - 1, c - 1).Enabled" @change="updateJson(getSlot(r - 1, c - 1).ID, $event.target.checked)">
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div @click="isDeleteShelf = true;" class="shelf_delete">Delete Shelf</div>
          </div>
          <div class="bottom_nav">
            <div class="bottom_button" @click="isOpeningInfo = false && updateShelfData;">Close</div>
            <div class="bottom_button right" @click="updateAll">Save Changes</div>
          </div>
        </div>
      </div>
    </div>
    <modal v-if="isDeleteShelf" @close="isDeleteShelf = false">
    <template #header>
      <p>Delte Shelf</p>
    </template>
    <template #body>
      <p>Sure deleting shelf? <strong>{{ shelf.Name }}</strong></p>
    </template>
    <template #footer>
      <button @click="isDeleteShelf = false" class="modalButton">Close</button>
      <button @click="deleteShelf" class="modalButton right">Remove</button>
    </template>
  </modal>
  </div>
</template>

<script>
import apiClient from '@/services/api';
import Modal from '@/components/modal.vue'

export default {
  name: "ShelfView",
  data() {
    return {
      shelf: {
        Columns: 0,
        Rows: 0,
        Slots: [],
      },
      updateShelfData: {
        Name: '',
        Detail: '',
      },
      vinyls: [],
      slotState: {},
      selectedShelfSlot: 0,
      isDeleteShelf: false,
      isOpeningInfo: false,
    };
  },
  components: {
    Modal,
  },
  methods: {
    refreshUpdateShelfData() {
      this.slotState = this.shelf["Slots"].reduce((acc, item) => {
        acc[item.ID] = item.Enabled;
        return acc
      }, {});
      this.updateShelfData.Name = this.shelf.Name;
      this.updateShelfData.Detail = this.shelf.Detail;
    },
    async getShelf() {
      try {
        const response = await apiClient.get('/shelves/' + this.$route.params.id);
        this.shelf = response.data;
        this.refreshUpdateShelfData();
      } catch (error) {
        console.error('Error fetching Shelf');
      }
    },
    async deleteShelf() {
      try {
        await apiClient.delete('/shelves/' + this.$route.params.id);
        this.$router.push({path: '../shelves'});
      } catch (error) {
        console.error('Error fetching Shelf');
      }
    },
    getSlot(row, col) {
      return this.shelf.Slots.find(slot => slot.Row === row && slot.Column === col);
    },
    getSlotById(id) {
      return this.shelf.Slots.find(slot => slot.ID === id);
    },
    async updateAll() {
      await this.updateShelf();
      await this.updateShelfSlotState();
      this.getShelf();
      this.isOpeningInfo = false;
    },
    async updateShelf() {
      try {
        await apiClient.put('/shelves/' + this.$route.params.id, this.updateShelfData);
      } catch (error) {
        console.error('Error fetching Shelf');
      }
    },
    async updateShelfSlotState() {
      try {
        const changeState = Object.entries(this.slotState).map(([id, state]) => ({
          ID: parseInt(id), // ID로 변환
          State: state,     // State 키와 값 설정
        }));
        await apiClient.put('/shelves/' + this.$route.params.id + '/slots/state', {SlotsID: changeState});
      } catch (error) {
        console.error('Error fetching Shelf');
      }
    },
    async getShelfslotVinyls(id) {
      try {
        const response = await apiClient.get('/shelves/' + this.$route.params.id + '/slots/' + id);
        this.vinyls = response.data
      } catch (error) {
        console.error('Error fetching Shelf');
      }
    },
    updateJson(id, isChecked) {
      this.slotState[id] = isChecked;
    },
  },
  created() {
    this.getShelf();
  },
};
</script>

<style scoped>

.ssTitle {
  position: absolute;
  line-height: 30px;
  margin-left: 10px;
}

.notfound {
  line-height: 235px;
}

.shelf_delete {
  color: rgb(255, 111, 111);
  font-weight: 700;
  width: 150px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 30px;
  border: 1px solid rgb(255, 111, 111);
}

.bottom_button {
  width: 235px;
  height: 30px;
  line-height: 30px;
  border-top: 1px solid #2a2e32;
  background-color: white;
  border-right: 1px solid #2a2e32;
}

.bottom_button.right {
  border-right: none;
}

.bottom_nav {
  position: absolute;
  bottom: 0;
  display: flex;
}

.nameInput {
  display: block;
  margin: 0 auto;
  border: none;
  font-weight: 700;
  background-color: transparent;
  text-align: center;
  font-size: 25px;
  margin-top: 20px;
}

.detailTa {
  display: block;
  border: none;
  background-color: transparent;
  text-align: center;
  resize: none;
  margin: 0 auto;
  margin-top: 20px;
}

.adjustTitle {
  margin: 20px;
  font-size: 20px;
}

.modalButton {
  background-color: white;
  border: none;
  color: #2a2e32;
  width: 50%;
  border-right: 1px solid #2a2e32;
  height: 30px;
}

.modalButton.right {
  border-right: none;
  font-weight: 700;
}
.shelfInfoTitle {
  line-height: 30px;
}

.albumCoversResult {
  max-height: 440px;
  overflow-y: auto;
}

.shelfClose {
  right: 0;
  position: absolute;
  line-height: 30px;
  margin-right: 10px;
}

.shelfNavBar {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #2a2e32;
  background-color: #fff;
  position: relative;
}

.shelfDetailCell {
  width: 500px;
  height: 500px;
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
  background-color: #b9b9b9;
}

.shelfDetailCellBox {
  width: 470px;
  height: 470px;
  margin: 15px;
  position: relative;
  background-color: #f9f9f9;
}

.shelfDetail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #2a2e321f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.masterWrapper {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-items: center;
}

.title {
  margin: 0 auto;
  margin: 0px 20px;
}

.grid-table {
  border-collapse: collapse;
  width: auto;
  margin: 0 auto;
}

.cell {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
  background-color: #b9b9b9;
}

.cell.small {
  width: 50px;
  height: 50px;
}

.cell_box {
  width: 180px;
  height: 180px;
  margin: 10px;
  background-color: #f9f9f9;
}

.cell_box.small {
  width: 45px;
  height: 45px;
  margin: 2.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bnc_container {
  display: flex;
  align-items: center;
  justify-items: center;
  width: auto;
  padding: 20px;
  margin: 0 auto;
  position: relative;
}

.info {
  position: absolute;
  right: 0;
}

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

</style>
