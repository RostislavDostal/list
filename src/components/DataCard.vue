<template>
  <div class="data-card">
    <div class="row">
      <div v-show="item.isFound" class="item-found">
        <img :src="require('../assets/check.svg')" alt="check" />
      </div>
      <div class="column">
        <span>
          <b>{{ item.name }}</b>
        </span>
        <span>Id: {{ item.id }}</span>
        <span v-show="item.isFound" class="item-found"><i>Exact match</i></span>
      </div>
      <span>{{ dateDistanceLocal(item.date) }}</span>
      <div class="row-buttons">
        <input
          v-show="item.hasRemoveButton"
          id="btn-cancel"
          type="image"
          class="btn btn-red"
          :src="require('../assets/trash.svg')"
          @click="$emit('itemRemove', item.id)" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatDistance } from 'date-fns';

export default {
  name: 'DataCard',
  props: {
    item: Object,
  },
  methods: {
    dateDistanceLocal(d) {
      var res = formatDistance(d, new Date(), { addSuffix: true });
      return res;
    },
  },
};
</script>

<style lang="scss">
@import 'components/DataCard.scss';
</style>
