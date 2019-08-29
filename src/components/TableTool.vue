<template>
  <div class="tableTool mb-sm-2">
    <div class="d-inline-flex justify-content-start">
          <b-form-select
               v-model='perPage'
               size="sm"
               class="w-35"
               :options="sizeOptions"
               @change="resize">
               <template slot="first">
                 <option :value="totalRows">All</option>
               </template>
          </b-form-select>
          <label class="ml-sm-1">records per page</label>
    </div>

    <div>
      <label class="text">showing {{(currentPage-1)*perPage + 1}} to
        {{perPage > totalRows ? totalRows : currentPage*perPage}}
        of {{totalRows}} entries
      </label>
    </div>

    <div class="d-inline-flex justify-content-end">
              <label class="mr-sm-2">Search:</label>
              <b-form-input v-model='search'
                            size="sm"
                            placeholder='Type to Filter' />

    </div>
  </div>
</template>

<script>
export default{
  props: {
    perPage: {
      type: Number,
      default: 100,
    },
    totalRows: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    filter: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sizeOptions: [50, 100, 1000],
      search: this.filter,
    };
  },
  mounted() {
  },
  watch: {
    /* eslint-disable */
    filter: function(newVal) {
      // console.log('filter', newVal);
      this.search = newVal;
    },
    search: function(newVal) {
      // console.log('search', newVal);
      this.$emit('onFilter', newVal);
    },
    /* eslint-disable */
  },
  computed: {
  },
  methods: {
    resize(newVal) {
      this.$emit('update:perPage', newVal);
    },
  },
};
</script>

<style lang="less" scoped>
.tableTool{
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  .text{
    text-align: center;
    margin-left: 3.5rem;
  }
    label{
      margin-bottom: 0 !important;
      line-height: 2rem;
      text-align: center;
    }

}
</style>
