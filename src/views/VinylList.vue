<template>
  <div class="wrapper">
    <div
      class="detail_wrapper"
      :style="{ height: `calc(var(--vh, 1vh) * 100 - 51px)` }"
    >
      <div v-if="selectedVinyl.Name">
        <p class="created_date">{{ selectedVinyl.CreatedAt.split("T")[0] }}</p>
        <p
          class="editButton"
          @click="isShowDetail = false; isEditingVinyl = true; editingVinylData = selectedVinyl; selectedVinyl = [];"
        >
          Edit
        </p>
        <img
          class="album_cover"
          alt="Album"
          width="300px"
          height="300px"
          :src="selectedVinyl.ImageURL"
          @error="onImageError"
        />
        <h2>{{ selectedVinyl.Name }}</h2>
        <p>{{ selectedVinyl.Artist }}</p>
        <div class="album_details">
          <div v-if="selectedVinyl.GenreID" class="detail_genre">
            {{ idxToGenre(selectedVinyl.GenreID) }}
          </div>
          <div
            v-if="selectedVinyl.GenreID && selectedVinyl.ReleasedDate"
            class="middle_point"
          >
            ·
          </div>
          <div v-if="selectedVinyl.ReleasedDate" class="detail_year">
            {{ selectedVinyl.ReleasedDate }}
          </div>
        </div>
        <br />
        <div v-if="selectedVinyl.Detail" class="detail_container">
          <div class="detail_container_title">
            {{ $t("vinyllist.detail.detailTitle") }}
          </div>
        </div>
        <div v-if="selectedVinyl.Detail" class="detail_container_content">
          {{ selectedVinyl.Detail }}
        </div>
        <div
          v-if="selectedVinyl.Sleeve || selectedVinyl.Media"
          class="detail_container"
        >
          <div class="detail_container_title">
            {{ $t("vinyllist.detail.conditionTitle") }}
          </div>
        </div>
        <div class="detail_condition">
          <div v-if="selectedVinyl.Sleeve" class="sleeve">
            <div class="condition_title">
              {{ $t("vinyllist.detail.conditionSleeve") }}
            </div>
            <div class="condition_content">
              {{ idxToCondition(selectedVinyl.Sleeve) }}
            </div>
          </div>
          <div v-if="selectedVinyl.Media" class="media">
            <div class="condition_title">
              {{ $t("vinyllist.detail.conditionMedia") }}
            </div>
            <div class="condition_content">
              {{ idxToCondition(selectedVinyl.Media) }}
            </div>
          </div>
        </div>
        <div
          v-if="selectedVinyl.ShelfslotID && selectedVinyl.ShelfslotID != 0"
          class="detail_container"
        >
          <div class="detail_container_title">Location</div>
        </div>
        <div
          class="detail_location"
          v-if="selectedVinyl.ShelfslotID && selectedVinyl.ShelfslotID != 0"
        >
          <table
            class="grid-table"
            v-if="selectedVinylShelf.Columns && selectedVinylShelf.Rows"
          >
            <tbody>
              <tr v-for="r in selectedVinylShelf.Rows" :key="r">
                <td v-for="c in selectedVinylShelf.Columns" :key="`${r}-${c}`">
                  <div v-if="getSlotForView(r - 1, c - 1).Enabled" class="cell">
                    <div
                      :class="{'selected': selectedVinyl.ShelfslotID == getSlotForView(r - 1, c - 1).ID}"
                      class="cell_box"
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="location_name">{{ selectedVinylShelf.Name }}</div>
        </div>
      </div>
      <div v-else-if="!isShowDetail">
        <div v-if="isAddingVinyl">
          <div class="titleContainer">
            <h2 class="addVinylTitle">
              {{ $t("vinyllist.addAlbum.addAlbumTitle") }}
            </h2>
            <p
              @click="isAddingVinyl = false; isShowDetail = true;"
              class="addVinylClose"
            >
              X
            </p>
          </div>
          <div>
            <div class="dropImage">
              <!-- ClassName Is So Fxxking LONG -->
              <div
                class="getAlbumCoversFromGivenInformationButton"
                @click="getCovers"
              >
                {{ $t("vinyllist.addAlbum.addVinylAlbumCoverButton") }}
              </div>
              <div class="pure-g albumCoversResult">
                <div
                  class="pure-u-1-4 pure-u-lg-1-4"
                  @click="this.addVinylData.ImageURL = cover.url"
                  v-for="cover in resultCovers"
                  :key="cover.Name"
                >
                  <img
                    class="pure-img"
                    :class="{ 'albumCoverSelected': this.addVinylData.ImageURL == cover.url}"
                    :src="cover.url"
                  />
                </div>
              </div>
            </div>
            <div class="addAlbumEssentials">
              <input
                class="addAlbumAlbumTitle"
                v-model="addVinylData.name"
                type="text"
                placeholder="Name"
              />
              <input
                class="addAlbumArtistName"
                v-model="addVinylData.artist"
                type="text"
                placeholder="Artist"
              />
              <div class="album_details">
                <select
                  v-model="addVinylData.GenreID"
                  id="multi-state"
                  class="pure-input-1-2"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option v-for="(g, idx) in genres" :key="idx" :value="idx+1">
                    {{ g }}
                  </option>
                </select>
                <div class="middle_point">·</div>
                <input
                  class="addAlbumYear"
                  v-model="addVinylData.ReleasedDate"
                  type="number"
                  placeholder="Year"
                />
              </div>
              <div class="addAlbumClearSubmitContainer">
                <div class="addAlbumSubmitButton" @click="clearAddVinyl">
                  {{ $t("vinyllist.addAlbum.clear") }}
                </div>
                <div class="addAlbumSubmitButton submit" @click="addVinyl">
                  {{ $t("vinyllist.addAlbum.create") }}
                </div>
              </div>
            </div>
            <div class="detail_container">
              <div class="detail_container_title">
                {{ $t("vinyllist.detail.detailTitle") }}
              </div>
            </div>
            <textarea
              class="pure-input-1-2 detailTextArea"
              v-model="addVinylData.detail"
              placeholder="Add some text..."
            ></textarea>
            <div class="detail_container">
              <div class="detail_container_title">
                {{ $t("vinyllist.detail.conditionTitle") }}
              </div>
            </div>
            <div class="detail_condition">
              <div class="sleeve">
                <div class="condition_title">
                  {{ $t("vinyllist.detail.conditionSleeve") }}
                </div>
                <select
                  id="multi-state"
                  class="pure-input-1-2"
                  v-model="addVinylData.sleeve"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option
                    v-for="(c, idx) in conditions"
                    :key="idx"
                    :value="idx+1"
                  >
                    {{ c }}
                  </option>
                </select>
              </div>
              <div class="media">
                <div class="condition_title">
                  {{ $t("vinyllist.detail.conditionMedia") }}
                </div>
                <select
                  id="multi-state"
                  class="pure-input-1-2"
                  v-model="addVinylData.media"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option
                    v-for="(c, idx) in mediaConditions"
                    :key="idx"
                    :value="idx+1"
                  >
                    {{ c }}
                  </option>
                </select>
              </div>
            </div>
            <div class="detail_container">
              <div class="detail_container_title">
                {{ $t("vinyllist.location.locationTitle") }}
              </div>
            </div>
            <br />
            <div class="condition_title">
              {{ $t("vinyllist.location.shelfNameTitle") }}
            </div>
            <select
              id="multi-state"
              class="pure-input-1-2"
              v-model="selectedShelf"
              @change="getShelf"
            >
              <option value="0">
                {{ $t("vinyllist.addAlbum.dropdownNone") }}
              </option>
              <option v-for="(s, idx) in shelves" :key="idx" :value="s.ID">
                {{ s.Name }}
              </option>
            </select>
            <div class="detail_location" v-if="this.selectedShelf != 0">
              <table class="grid-table" v-if="shelf.Columns && shelf.Rows">
                <tbody>
                  <tr v-for="r in shelf.Rows" :key="r">
                    <td v-for="c in shelf.Columns" :key="`${r}-${c}`">
                      <div v-if="getSlot(r - 1, c - 1).Enabled" class="cell">
                        <div
                          :class="{'selected': addVinylData.ShelfslotID == getSlot(r - 1, c - 1).ID}"
                          class="cell_box"
                          @click="addVinylData.ShelfslotID = getSlot(r - 1, c - 1).ID"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else-if="isEditingVinyl">
          <div class="titleContainer">
            <h2 class="addVinylTitle">
              {{ $t("vinyllist.editAlbum.editAlbumTitle") }}
            </h2>
            <p
              @click="isEditingVinyl = false; isShowDetail = true;"
              class="addVinylClose"
            >
              X
            </p>
          </div>
          <div>
            <div class="dropImage">
              <!-- ClassName Is So Fxxking LONG -->
              <div
                class="getAlbumCoversFromGivenInformationButton"
                @click="getCovers"
              >
                {{ $t("vinyllist.addAlbum.addVinylAlbumCoverButton") }}
              </div>
              <img width="250px" height="250px" v-if="resultCovers.length == 0" :src="this.editingVinylData.ImageURL">
              <div class="pure-g albumCoversResult">
                <div
                  class="pure-u-1-4 pure-u-lg-1-4"
                  @click="this.editingVinylData.ImageURL = cover.url"
                  v-for="cover in resultCovers"
                  :key="cover.Name"
                >
                  <img
                    class="pure-img"
                    :class="{ 'albumCoverSelected': this.editingVinylData.ImageURL == cover.url}"
                    :src="cover.url"
                  />
                </div>
              </div>
            </div>
            <div class="addAlbumEssentials">
              <input
                class="addAlbumAlbumTitle"
                v-model="editingVinylData.Name"
                type="text"
                placeholder="Name"
              />
              <input
                class="addAlbumArtistName"
                v-model="editingVinylData.Artist"
                type="text"
                placeholder="Artist"
              />
              <div class="album_details">
                <select
                  v-model="editingVinylData.GenreID"
                  id="multi-state"
                  class="pure-input-1-2"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option v-for="(g, idx) in genres" :key="idx" :value="idx+1">
                    {{ g }}
                  </option>
                </select>
                <div class="middle_point">·</div>
                <input
                  class="addAlbumYear"
                  v-model="editingVinylData.ReleasedDate"
                  type="number"
                  placeholder="Year"
                />
              </div>
              <div class="addAlbumClearSubmitContainer">
                <div class="editAlbumSubmitButton" @click="addVinyl">
                  {{ $t("vinyllist.editAlbum.submit") }}
                </div>
              </div>
            </div>
            <div class="detail_container">
              <div class="detail_container_title">
                {{ $t("vinyllist.detail.detailTitle") }}
              </div>
            </div>
            <textarea
              class="pure-input-1-2 detailTextArea"
              v-model="editingVinylData.Detail"
              placeholder="Add some text..."
            ></textarea>
            <div class="detail_container">
              <div class="detail_container_title">
                {{ $t("vinyllist.detail.conditionTitle") }}
              </div>
            </div>
            <div class="detail_condition">
              <div class="sleeve">
                <div class="condition_title">
                  {{ $t("vinyllist.detail.conditionSleeve") }}
                </div>
                <select
                  id="multi-state"
                  class="pure-input-1-2"
                  v-model="editingVinylData.Sleeve"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option
                    v-for="(c, idx) in conditions"
                    :key="idx"
                    :value="idx+1"
                  >
                    {{ c }}
                  </option>
                </select>
              </div>
              <div class="media">
                <div class="condition_title">
                  {{ $t("vinyllist.detail.conditionMedia") }}
                </div>
                <select
                  id="multi-state"
                  class="pure-input-1-2"
                  v-model="editingVinylData.Media"
                >
                  <option value="0">
                    {{ $t("vinyllist.addAlbum.dropdownNone") }}
                  </option>
                  <option
                    v-for="(c, idx) in mediaConditions"
                    :key="idx"
                    :value="idx+1"
                  >
                    {{ c }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="isSetting">
          <div class="titleContainer">
            <h2 class="settingTitle">
              {{ $t("vinyllist.listSetting.settingTitle") }}
            </h2>
            <p
              @click="isSetting = false; isShowDetail = true;"
              class="addVinylClose"
            >
              X
            </p>
          </div>
          <div class="detail_container">
            <div class="detail_container_title">
              {{ $t("vinyllist.listSetting.listViewTitle") }}
            </div>
          </div>
          <div>
            <div class="settingItem">
              {{ $t("vinyllist.listSetting.listMaxItem") }}
            </div>
            <input
              type="number"
              v-model="setting.listMaxNumber"
              @input="setListMaxNumber"
            />
            <div class="settingItem">
              {{ $t("vinyllist.listSetting.listItems") }}
            </div>
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="image"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.image") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="name"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.name") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="artist"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.artist") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="price"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.price") }}</label
            ><br />
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="genre"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.genre") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="year"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.year") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="sleeve"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.sleeve") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="media"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.media") }}</label
            >
            <label class="settingCheckbox"
              ><input
                type="checkbox"
                v-model="setting.listItem"
                value="location"
                @change="setListItems"
              />
              {{ $t("vinyllist.table.location") }}</label
            >
          </div>
          <div class="detail_container">
            <div class="detail_container_title">
              {{ $t("vinyllist.listSetting.gridViewTitle") }}
            </div>
          </div>
          <div class="settingItem">
            {{ $t("vinyllist.listSetting.gridMaxItem") }}
          </div>
          <input type="number" v-model="setting.gridMaxNumber" />
          <div class="settingItem">
            {{ $t("vinyllist.listSetting.gridItemsPerLine") }}
          </div>
          <input type="number" v-model="setting.gridMaxNumberPerLine" />
        </div>
      </div>
      <div v-else>
        <img
          class="album_cover"
          alt="Album"
          width="300px"
          height="300px"
          src="../assets/notfound.jpeg"
          @error="onImageError"
        />
        <h2>{{ $t("vinyllist.error.albumNull") }}</h2>
      </div>
    </div>
    <div
      v-if="$route.query.viewType == 0 || $route.query.viewType == null"
      class="list_container"
      :style="{ height: `calc(var(--vh, 1vh) * 100 - 51px)` }"
    >
      <div class="bottom_nav">
        <div class="vinylSearch">
          <select v-model="searchType" class="searchType">
            <option value="Name">{{ $t("vinyllist.search.name") }}</option>
            <option value="Artist">{{ $t("vinyllist.search.artist") }}</option>
          </select>
          <input type="text" v-model="searchQuery" class="searchQuery" />
        </div>
        <div
          class="navButton"
          :class="{ 'disabled': selectedVinyls.length === 0 }"
          @click="removeVinyls"
        >
          {{ $t("vinyllist.remove") }}
        </div>
        <div
          class="navButton"
          :class="{ 'disabled': selectedVinyls.length === 0 }"
          @click="getShelves(); openUpdateShelves();"
        >
          {{ $t("vinyllist.toshelf") }}
        </div>
        <div
          class="navButton"
          @click="getShelves(); selectedVinyl = []; isSetting = false; isAddingVinyl = true; isShowDetail = false;"
        >
          {{ $t("vinyllist.addvinyl") }}
        </div>
        <div class="navButton" @click="randomVinyl">
          {{ $t("vinyllist.pickrandom") }}
        </div>
        <div
          class="navButton"
          @click="selectedVinyl = []; isSetting = true; isAddingVinyl = false; isShowDetail = false;"
        >
          {{ $t("vinyllist.setting") }}
        </div>
        <div class="page">
          <button
            class="pageButton"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            -
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button
            class="pageButton"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            +
          </button>
        </div>
      </div>
      <table class="pure-table pure-table-horizontal vinyl_table">
        <thead class="vinyl_table_head">
          <tr>
            <th>
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAll"
              />
            </th>
            <th>{{ $t("vinyllist.table.idx") }}</th>
            <th v-if="setting.listItem.includes('image')">
              {{ $t("vinyllist.table.image") }}
            </th>
            <th v-if="setting.listItem.includes('name')">
              {{ $t("vinyllist.table.name") }}
            </th>
            <th v-if="setting.listItem.includes('artist')">
              {{ $t("vinyllist.table.artist") }}
            </th>
            <th v-if="setting.listItem.includes('price')">
              {{ $t("vinyllist.table.price") }}
            </th>
            <th v-if="setting.listItem.includes('genre')">
              {{ $t("vinyllist.table.genre") }}
            </th>
            <th v-if="setting.listItem.includes('year')">
              {{ $t("vinyllist.table.year") }}
            </th>
            <th v-if="setting.listItem.includes('sleeve')">
              {{ $t("vinyllist.table.sleeve") }}
            </th>
            <th v-if="setting.listItem.includes('media')">
              {{ $t("vinyllist.table.media") }}
            </th>
            <th v-if="setting.listItem.includes('location')">
              {{ $t("vinyllist.table.location") }}
            </th>
          </tr>
        </thead>
        <tbody class="vinyl_table_body">
          <tr
            @click="this.selectedVinyl = vinyl; isShowDetail = true; this.setSelectShelfslot(vinyl.ShelfslotID);"
            v-for="(vinyl, idx) in paginatedData"
            :key="vinyl.ID"
          >
            <td>
              <input
                type="checkbox"
                :value="vinyl.ID"
                :checked="selectedVinyls.includes(vinyl.ID)"
                @change="toggleSelection(vinyl.ID)"
              />
            </td>
            <td>{{ idx+1 }}</td>
            <td v-if="setting.listItem.includes('image')" class="img_td">
              <img
                width="50px"
                height="50px"
                class="pure-img"
                :src="vinyl.ImageURL"
              />
            </td>
            <td v-if="setting.listItem.includes('name')">{{ vinyl.Name }}</td>
            <td v-if="setting.listItem.includes('artist')">
              {{ vinyl.Artist }}
            </td>
            <td v-if="setting.listItem.includes('price')">
              {{ sign }} {{ vinyl.Price }}
            </td>
            <td v-if="setting.listItem.includes('genre')">
              {{ idxToGenre(vinyl.GenreID) }}
            </td>
            <td v-if="setting.listItem.includes('year')">
              {{ vinyl.ReleasedDate }}
            </td>
            <td v-if="setting.listItem.includes('sleeve')">
              {{ idxToCondition(vinyl.Sleeve) }}
            </td>
            <td v-if="setting.listItem.includes('media')">
              {{ idxToCondition(vinyl.Media) }}
            </td>
            <td v-if="setting.listItem.includes('location')"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="$route.query.viewType == 1"
      class="list_container"
      :style="{ height: `calc(var(--vh, 1vh) * 100 - 51px)` }"
    >
      <div class="bottom_nav">
        <a
          class="pure-button button-small"
          @click="selectedVinyl = []; isSetting = false; isAddingVinyl = true; isShowDetail = false;"
          >{{ $t("vinyllist.addvinyl") }}</a
        >
        <a
          class="pure-button button-small"
          href="#"
          >{{ $t("vinyllist.pickrandom") }}</a
        >
        <a
          class="pure-button button-small"
          @click="selectedVinyl = []; isSetting = true; isAddingVinyl = false; isShowDetail = false;"
          >{{ $t("vinyllist.setting") }}</a
        >
      </div>
      <div class="pure-g">
        <div
          class="pure-u-1-8 pure-u-lg-1-8"
          @click="this.selectedVinyl = vinyl"
          v-for="vinyl in vinyls"
          :key="vinyl.ID"
        >
          <img class="pure-img" :src="vinyl.ImageURL" />
        </div>
      </div>
    </div>
  </div>
  <!--Modal Zones-->
  <modal v-if="isUpdatingShelf" @close="isUpdatingShelf = false">
    <template #header>
      <p>Vinyls To Shelf</p>
    </template>
    <template #body>
      <select
        id="multi-state"
        class="pure-input-1-2"
        v-model="selectedShelf"
        @change="getShelf"
      >
        <option value="0">
          {{ $t("vinyllist.addAlbum.dropdownNone") }}
        </option>
        <option v-for="(s, idx) in shelves" :key="idx" :value="s.ID">
          {{ s.Name }}
        </option>
      </select>
      <div class="detail_location" v-if="this.selectedShelf != 0">
        <table class="grid-table" v-if="shelf.Columns && shelf.Rows">
          <tbody>
            <tr v-for="r in shelf.Rows" :key="r">
              <td v-for="c in shelf.Columns" :key="`${r}-${c}`">
                <div v-if="getSlot(r - 1, c - 1).Enabled" class="cell">
                  <div
                    :class="{'selected': updatingShelfSelectedSlot == getSlot(r - 1, c - 1).ID}"
                    class="cell_box"
                    @click="updatingShelfSelectedSlot = getSlot(r - 1, c - 1).ID"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #footer>
      <button @click="isUpdatingShelf = false; updatingShelfSelectedSlot = 0;" class="modalButton">Close</button>
      <button @click="updateShelves();" class="modalButton right">Submit</button>
    </template>
  </modal>
</template>

<script>
import Modal from '@/components/modal.vue'
import apiClient from '@/services/api';
import Fuse from 'fuse.js';

export default {
  data() {
    return {
      isShowDetail: true,
      isAddingVinyl: false,
      isEditingVinyl: false,
      isSetting: false,
      vinyls: [],
      sign: "KRW",
      page: 0,
      selectedVinyl: [],
      currentPage: 1,
      isUpdatingShelf: false,
      updatingShelfSelectedSlot: 0,
      shelves: [],
      resultCovers: [],
      selectedVinyls: [],
      selectedShelf: 0,
      shelf: [],
      selectedVinylShelf: [],
      searchType: 'Name',
      searchQuery: '',
      conditions: ["Mint", "Near Mint", "Very Good Plus", "Good Plus", "Good", "Fair", "Poor", "Generic", "No Cover"],
      mediaConditions: ["Mint", "Near Mint", "Very Good Plus", "Good Plus", "Good", "Fair", "Poor"],
      genres: ["Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic", "R&B", "Country", "Reggae", "Blues", "World Pop"],
      setting: {
        listMaxNumber: 15,
        listItem: ['name', 'artist', 'price', 'genre', 'year', 'sleeve', 'media', 'location'],
        gridMaxNumber: 50,
        gridMaxNumberPerLine: 10,
      },
      editingVinylData: {
        id: 0,
        name: '',
        artist: '',
        GenreID: 0,
        ReleasedDate: '',
        detail: '',
        sleeve: 0,
        media: 0,
        ShelfslotID: 0,
      },
      addVinylData: {
        name: '',
        artist: '',
        GenreID: 0,
        ReleasedDate: '',
        detail: '',
        sleeve: 0,
        media: 0,
        ShelfslotID: 0,
      },
      albumCoverReq: {
        Name: '',
        Artist: '',
      },
      fuse: null,
    };
  },
  components: {
    Modal,
  },
  watch: {
    searchType() {
      this.initFuse();
    },
  },
  computed: {
    allSelected() {
      if (this.paginatedData.length === 0) {return false}
      return this.selectedVinyls.length === this.paginatedData.length;
    },
    filteredData() {
      if (!this.searchQuery.trim()) {
        return this.vinyls;
      }
      return this.fuse.search(this.searchQuery).map((result) => result.item);
    },
    paginatedData() {
      if (this.searchQuery) {
        return this.filteredData;
      }
      const start = (this.currentPage - 1) * this.setting.listMaxNumber;
      const end = start + this.setting.listMaxNumber;
      return this.vinyls.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.vinyls.length / this.setting.listMaxNumber);
    },
  },
  async mounted() {
    this.updateViewportHeight();
    window.addEventListener("resize", this.updateViewportHeight);
    await this.fetchVinyls();
    this.initFuse();
    const lMN = this.$cookies.get('listMaxNumber');
    const lMI = this.$cookies.get('listItems');
    const gMNPL = this.$cookies.get('gridMaxNumberPerLine');
    if (lMI) {
      this.setting.listItem = lMI;
    }
    if (lMN) {
      this.setting.listMaxNumber = lMN;
    }
    if (gMNPL) {
      this.setting.gridMaxNumberPerLine = gMNPL;
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateViewportHeight);
  },
  methods: {
    openUpdateShelves() {
      if (this.selectedVinyls.length === 0) {
        return; // 선택된 바이닐이 없으면 메서드 실행 안 함
      } else {
        this.isUpdatingShelf = true;
      }
    },
    async updateShelves() {
      if (this.selectedVinyls.length === 0 || this.updatingShelfSelectedSlot === 0) {
        return; // 선택된 바이닐이 없으면 메서드 실행 안 함
      }
      for (const id of this.selectedVinyls) {
          await this.updateShelf(id, this.updatingShelfSelectedSlot);
      }
      this.fetchVinyls();
      this.updatingShelfSelectedSlot = 0;
      this.selectedShelf = 0;
      this.isUpdatingShelf = false;
    },
    async updateShelf(id, sId) {
      var data = {
        ShelfslotID: sId
      }
      await apiClient.put('/vinyls/' + id, data);
    },
    setListMaxNumber() {
      this.$cookies.set('listMaxNumber', this.setting.listMaxNumber);
    },
    setListItems() {
      this.$cookies.set('listItems', this.setting.listItem);
    },
    setGridMaxNumber() {
      this.$cookies.set('gridMaxNumber', this.setting.gridMaxNumber);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    initFuse() {
      const options = {
        keys: [this.searchType], // 검색 대상 필드
        threshold: 0.1, // 모호한 검색 정도 (0에 가까울수록 정확)
        includeScore: true, // 검색 점수 포함
      };
      this.fuse = new Fuse(this.vinyls, options);
    },
    async getCovers() {
      try {
        this.albumCoverReq.Name = this.addVinylData.name;
        this.albumCoverReq.Artist = this.addVinylData.artist;
        const response = await apiClient.post('/vinyls/covers', this.albumCoverReq);
        this.resultCovers = response.data['albums'];
        console.log(response.data['albums']);
      } catch (error) {
        console.error('Error fetching vinyls:', error);
      }
    },
    async addVinyl() {
        try {
          this.addVinylData.ReleasedDate = this.addVinylData.ReleasedDate.toString();
          await apiClient.post('/vinyls', this.addVinylData);
          this.clearAddVinyl();
          this.fetchVinyls();
        } catch (error) {
          console.error('Error creating vinyl:', error);
        }
      },
    async fetchVinyls() {
      try {
        const response = await apiClient.get('/vinyls');
        this.vinyls = response.data;
        console.log(response)
      } catch (error) {
        console.error('Error fetching vinyls:', error);
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
    async getShelf() {
      this.addVinylData.ShelfslotID = 0;
      if (this.selectedShelf == 0) return;
      try {
        const response = await apiClient.get('/shelves/' + this.selectedShelf);
        this.shelf = response.data;
        console.log(response);
      } catch (error) {
        console.error('Error fetching Shelf:', error);
      }
    },
    getSlot(row, col) {
      return this.shelf.Slots.find(slot => slot.Row === row && slot.Column === col);
    },
    async removeVinyl(id) {
      try {
          await apiClient.delete('/vinyls/' + id);
      } catch (error) {
          console.error('Error deleting vinyl:', error);
      }
    },
    async removeVinyls() {
      if (this.selectedVinyls.length === 0) {
        return; // 선택된 바이닐이 없으면 메서드 실행 안 함
      }
      for (const id of this.selectedVinyls) {
          await this.removeVinyl(id);
      }
      this.selectedVinyls = [];

      await this.fetchVinyls();
    },
    async setSelectShelfslot(id) {
      if (id === 0) return;
      try {
        const response = await apiClient.get('/slots/' + id);
        console.log(response);
        await this.getShelfForView(response.data.BookshelfID);
      } catch (error) {
        console.error('Error fetching Shelf:', error);
      }
    },
    async getShelfForView(id) {
      try {
        const response = await apiClient.get('/shelves/' + id);
        this.selectedVinylShelf = response.data;
        console.log(response);
      } catch (error) {
        console.error('Error fetching Shelf:', error);
      }
    },
    getSlotForView(row, col) {
      return this.selectedVinylShelf.Slots.find(slot => slot.Row === row && slot.Column === col);
    },
    onImageError(event) {
      event.target.src = require("@/assets/notfound.jpeg");
    },
    idxToCondition(idx) {
      if (idx == 0) {return ""}
      return this.conditions[idx-1]
    },
    idxToGenre(idx) {
      if (idx == 0) {return ""}
      return this.genres[idx-1]
    },
    updateViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
    async randomVinyl() {
      for (let i = 0; i < 10; i++) {
        var randomIndex = Math.floor(Math.random() * this.vinyls.length);
        this.selectedVinyl = this.vinyls[randomIndex]
        await this.sleep(50)
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    toggleAll() {
      if (this.allSelected) {
        this.selectedVinyls = [];
      } else {
        this.selectedVinyls = this.paginatedData.map((item) => item.ID);
      }
      console.log(this.selectedVinyls)
    },
    toggleSelection(id) {
      if (this.selectedVinyls.includes(id)) {
        this.selectedVinyls = this.selectedVinyls.filter((item) => item !== id);
      } else {
        this.selectedVinyls.push(id);
      }
      console.log(this.selectedVinyls)
    },
    clearAddVinyl() {
      this.selectedShelf = 0;
      this.resultCovers = [];
      this.addVinylData = {
        name: '',
        artist: '',
        GenreID: 0,
        ReleasedDate: '',
        ImageURL: '',
        ShelfslotID: 0,
        detail: '',
        sleeve: 0,
        media: 0,
      }
    },
  }
};
</script>

<style scoped>
input {
  border: none;
  text-align: center;
}

select {
  border: none;
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

.getAlbumCoversFromGivenInformationButton {
  padding: 3px;
}

.albumCoversResult {
  width: 100%;
  max-height: 275px;
  overflow-y: auto;
}

.albumCoverSelected {
  opacity: 0.3;
}

.addAlbumClearSubmitContainer {
  display: flex;
  width: 100%;
  height: 40px;
  border-top: 1px solid #2a2e32;
  margin-top: 20px;
}

.addAlbumSubmitButton {
  width: 50%;
  text-align: center;
  line-height: 40px;
  border-right: 1px solid #2a2e32;
  color: darkgray;
}

.editAlbumSubmitButton {
  width: 100%;
  text-align: center;
  line-height: 40px;
  color: #2a2e32;
}

.navButton {
  height: 30px;
  color: #2a2e32;
  border-left: 1px solid #2a2e32;
  padding: 0px 10px;
  text-align: center;
  line-height: 30px;
}

.navButton.disabled {
  color: lightgrey;
}

.page {
  display: flex;
  border-left: 1px solid #2a2e32;
  align-items: center;
}

.pageButton {
  background-color: transparent;
  border: none;
}

.vinylSearch {
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #2a2e32;
  position: absolute;
  left: 0;
  height: 100%;
}

.settingCheckbox {
  margin: 5px;
}

.searchQuery {
  height: 100%;
  width: 200px;
  text-align: left;
  background-color: transparent;
  border-left: 1px solid #2a2e32;
}

.searchType {
  width: 100px;
}

.addAlbumSubmitButton.submit {
  border-right: none;
  font-weight: 700;
  color: #2a2e32;
}

.addAlbumYear {
  width: 50px;
}

.addAlbumAlbumTitle {
  font-size: 1.5em;
  font-weight: 600;
}

.addAlbumArtistName {
  font-size: 16px;
  margin: 16px 0px;
}

.addAlbumEssentials {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.settingItem {
  margin: 10px;
}
.titleContainer {
  display: flex;
  margin-bottom: 30px;
  width: 100%;
}

.dropImage {
  width: 300px;
  height: 300px;
  border: 1px solid #2a2e32;
  margin: 0 auto;
  margin: 0px 70px;
}

.addVinylTitle {
  margin: 0 auto;
  margin-top: 20px;
}
.settingTitle {
  margin: 0 auto;
  margin-top: 20px;
  min-width: 440px;
}

.addVinylClose {
  position: absolute;
  right: 0;
  margin-right: 15px;
  font-size: 20px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin: 7px;
}
.album_cover {
  margin: 70px;
  margin-bottom: 0;
}
.detail_wrapper {
  flex: 0;
  border-bottom: 1px solid #2a2e32;
  position: relative;
  min-width: 440px;
  max-height: calc(100vh - 52px);
  overflow: auto;
}

.detail_condition {
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  color: #2a2e32;
}

.detailTextArea {
  width: 100%;
  height: 100%;
  resize: none;
  height: 100px;
  border: none;
  padding: 0;
}

.detail_condition .sleeve {
  margin: 20px;
}

.detail_condition .media {
  margin: 20px;
}

.condition_title {
  font-weight: 700;
}

.condition_content {
  font-size: 15px;
}

.album_details {
  display: flex;
  width: 150px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #2a2e32;
}

.detail_container {
  width: 100%;
  border-top: 1px solid #2a2e32;
  border-bottom: 1px solid #2a2e32;
}

.detail_container_title {
  padding: 10px;
  font-size: 17px;
}

.detail_container_content {
  font-size: 14px;
  margin: 10px;
}

.middle_point {
  margin: 5px;
}

.list_container {
  margin-left: 0;
  flex-grow: 1;
  border: 1px solid #2a2e32;
  border-top: none;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 52px);
  overflow: auto;
}
.vinyl_table_head {
  background-color: white;
  color: #2a2e32;
  border-color: #2a2e32;
  text-align: center;
}

.img_td {
  padding: 0%;
}

.img_td img {
  margin: 0 auto;
}

.vinyl_table_body tr td {
  border-color: #2a2e32;
  border-top: none;
}

.vinyl_table {
  border-color: #2a2e32;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
}

.vinyl_table_body {
  width: 100%;
}

.button-small {
  font-size: 85%;
}
.wrapper {
  display: flex;
  /*align-items: center;
  justify-content: center;*/
  flex: 1 1 auto;
}

.bottom_nav {
  border-bottom: 1px solid #2a2e32;
  width: 100%;
  display: flex;
  position: absolute;
  top: 0;
  background-color: white;
  position: relative;
  justify-content: end;
}

.created_date {
  position: absolute;
  left: 0;
  margin-left: 10px;
  font-size: 12px;
}

.editButton {
  position: absolute;
  right: 0;
  margin-right: 10px;
  font-size: 12px;
  color: #797979;
}

.grid-table {
  border-collapse: collapse;
  width: auto;
  margin: 0 auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
  background-color: #b9b9b9;
}

.cell_box {
  width: 48px;
  height: 48px;
  margin: 1px;
  background-color: #f9f9f9;
}

.cell_box.selected {
  background-color: rgba(255, 255, 255, 0.282);
}
</style>
