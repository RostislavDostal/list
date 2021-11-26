<template>
  <div class="input-box">
    <div class="row">
      <div class="column-left">
        <div class="input-wrap">
          <input
            v-model="newText"
            placeholder="Search or Add..."
            @keyup="search"
            @keyup.esc="clear"
            @keyup.enter="add" />
        </div>
      </div>
      <div class="column-center">
        <span style="margin: 0 5px" />
        <input
          type="image"
          :src="require('./assets/add.svg')"
          class="btn"
          :class="
            newText.length === 0 || isFound ? 'btn-disabled' : 'btn-enabled'
          "
          :disabled="newText.length === 0 || isFound"
          @click="add" />
        <span style="margin: 0 5px" />
      </div>
      <div class="column-right">
        <div class="radio-buttons">
          <input
            id="byName"
            v-model="sortType"
            type="radio"
            value="1"
            @change="sortChanged" />
          <label>Sort By Value</label>
          <br />
          <input
            id="byDate"
            v-model="sortType"
            type="radio"
            value="2"
            @change="sortChanged" />
          <label>Sort By Added Date</label>
        </div>
      </div>
    </div>
  </div>

  <div class="data">
    <DataCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @item-remove="remove"
      @mouseover="item.hasRemoveButton = true"
      @mouseout="item.hasRemoveButton = false" />
  </div>
</template>

<script lang="ts">
import { defineComponent, VueElement } from '@vue/runtime-dom';
import DataCard from './components/DataCard.vue';
import {
  DataCardItem,
  DataCardStorageItem,
  SortingType,
} from './components/DataCard';
import { formatDistance } from 'date-fns';

export const localStorageKey = 'items';

export default defineComponent({
  name: 'App',
  components: {
    DataCard,
  },
  emits: ['itemRemove'],

  data() {
    return {
      newText: '',
      items: [],
      isFound: false,
      sortType: 1,
    };
  },

  mounted() {
    this.loadStorage();
  },

  methods: {
    add() {
      const item = {} as DataCardItem;

      item.id = this.$data.items.length + 1;
      item.name = this.newText;
      item.date = new Date();
      item.time = '';
      item.hasRemoveButton = false;
      item.isFound = true;

      (this.$data.items as DataCardItem[]).push(item);
      this.newText = '';

      this.saveStorage();
    },
    remove(id: number) {
      // Remove
      var ind = 0;
      (this.items as DataCardItem[]).forEach((item) => {
        var found = item.id === id;
        if (found) {
          this.items.splice(ind, 1);
          return;
        }
        ind++;
      });
      // Reindex
      ind = 1;
      (this.items as DataCardItem[]).forEach((item) => {
        item.id = ind++;
      });

      this.saveStorage();
    },
    search() {
      var found = false;
      if (this.newText.length > 0) {
        var searchText = this.newText.toLowerCase();
        (this.items as DataCardItem[]).forEach((element) => {
          element.isFound = element.name.toLowerCase() === searchText;
          if (element.isFound) {
            found = true;
          }
        });
      } else {
        this.clear();
      }
      this.isFound = found;
    },
    sortChanged() {
      var sortedItems = [...this.items] as DataCardItem[];
      if (this.sortType == SortingType.Name) {
        // By name
        alert('Sort by name');
        sortedItems = sortedItems.sort((a, b) => {
          const na = a.name.toLowerCase(),
            nb = b.name.toLowerCase();
          if (na < nb) {
            return -1;
          }
          if (na > nb) {
            return 1;
          }
          return 0;
        });
        // By value
      } else {
        sortedItems = sortedItems.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        }) as DataCardItem[];
      }

      this.items = [];
      (this.$data.items as DataCardItem[]).push(...sortedItems);
    },
    clear() {
      this.newText = '';
      (this.items as DataCardItem[]).forEach((element) => {
        element.isFound = false;
      });
      this.isFound = false;
    },
    saveStorage() {
      const storageItems = new Array<DataCardStorageItem>();
      (this.$data.items as DataCardItem[]).forEach((element) => {
        const item = {} as DataCardStorageItem;
        item.id = element.id;
        item.name = element.name;
        item.date = element.date.toISOString();
        storageItems.push(item);
      });
      localStorage.removeItem(localStorageKey);
      localStorage.setItem(localStorageKey, JSON.stringify(storageItems));
    },
    loadStorage() {
      var storageJson = localStorage.getItem(localStorageKey);
      if (storageJson !== null) {
        try {
          let storageItems = new Array<DataCardStorageItem>();
          storageItems = JSON.parse(storageJson);
          this.items = [];
          var i = 1;
          storageItems.forEach((element) => {
            const item = {} as DataCardItem;
            item.id = i++;
            item.name = element.name;
            item.date = new Date(element.date);
            (this.$data.items as DataCardItem[]).push(item);
          });
        } catch (e) {
          localStorage.removeItem(localStorageKey);
        }
      }
    },
    dateDistance(date: Date): string {
      var res = formatDistance(date, new Date(), { addSuffix: true });
      return res;
    },
  },
});
</script>

<style scoped>
@import './components/DataCard.scss';
@import './sass/global.scss';
</style>
