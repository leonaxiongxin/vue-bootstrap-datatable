<template>
  <div class="dataTable">
    <json-excel class="exportBtn btn btn-primary"
                size="lg"
                :data="filtereds"
                type="csv"
                name="download.csv">
      Export CSV
    </json-excel>
    <tableTool v-if="tableTool"
               :perPage.sync="perPage"
               :currentPage="currentPage"
               :totalRows="totalRows"
               :filter="filter"
               @onFilter="onFilter" />

    <b-table v-if="tableRendered"
             :items="filtereds"
             :fields="columns"
             :sort-by='orderColumn'
             :sort-desc.sync='sortDesc'
             :current-page='currentPage'
             :per-page='perPage'
             :filter='filter'
             @filtered='onFiltered'
             head-variant='light'
             outlined bordered
             :selectable="selectable"
             :select-mode="selectMode"
             :selectedVariant="selectedVariant"
             @row-selected="rowSelected">
      <template slot="top-row" slot-scope="{ fields }">
        <td v-for="(field, index) in fields" :key="index" >
          <vueSelect v-if="!field.value_type"
                     :options="selectColumns[field.key]"
                     @click.native.stop
                     v-model=select[field.key]
                     :searchable="true"
          >
          </vueSelect>
        </td>
      </template>
      <template v-for="(column, key) in columns"
                :slot="column.key"
                slot-scope="row">
            <renderColumn v-if="column"
                          :name="column.key"
                          :render_type="column.render_type"
                          :value_type="column.value_type"
                          :link_href="column.link_href"
                          :link_params="column.link_params"
                          :item="row.item"
                          :apiParams="apiParams"
                          :key="key"
                          :editable="editableRows[row.index]"
                          :action="editActions[row.index]"
                          @emitAction="emitAction" />
      </template>
      <template slot="edit" slot-scope="row">
        <b-button variant="info"
                  size="sm"
                  class="opsBtn"
                  @click="editRow(row.index)"
                  v-if="!editableRows[row.index]"
        >Edit</b-button>
        <div style="display: block" v-else>
          <b-button variant="warning"
                    size="sm"
                    class="opsBtn"
                    @click="saveRow(row)"
          >Save</b-button>
          <b-button variant="outline-secondary"
                    size="sm"
                    class="opsBtn"
                    style="margin-left: 1rem"
                    @click="cancelRow(row)"
          >Cancel</b-button>
        </div>
      </template>
      <template slot="delete" slot-scope="row">
        <b-button variant="outline-danger"
                  size="sm"
                  class="opsBtn"
                  @click="saveRow(row.index)"
        >Delete</b-button>
      </template>
      <template slot="table-caption" v-if="tableTool">
        <p v-if="loading" class="mt-2">Loading Data...</p>
        <p v-else-if="!items.length" class="mt-2">No data available !</p>
      </template>
    </b-table>

    <b-row v-if="tableTool"
      id="pagination"
      class="justify-content-end mr-md-2"
    >
      <b-pagination :total-rows="totalRows"
                    :per-page="perPage"
                    v-model="currentPage"/>
    </b-row>

  </div>
</template>

<script>
import { BTable } from 'bootstrap-vue';
import VueSelect from 'vue-select';
import JsonExcel from 'vue-json-excel';
import TableTool from './TableTool';
import RenderColumn from './Column';
import '@/css/dataTable.less';
import 'vue-awesome/icons/edit';


export default {
  components: {
    'b-table': BTable,
    tableTool: TableTool,
    renderColumn: RenderColumn,
    vueSelect: VueSelect,
    jsonExcel: JsonExcel,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    orderColumn: {
      type: String,
      default: null,
    },
    apiParams: {
      type: Object,
      default: () => ({}),
    },
    tableTool: {
      type: Boolean,
      default: true,
    },
    caption: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    selectMode: {
      type: String,
      default: 'multi',
    },
    selectedVariant: {
      type: String,
      default: 'info',
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
    editable: {
      type: Boolean,
      default: false,
    },
    sortDesc: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      perPage: 100,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      selectColumns: {},
      select: {},
      tableRendered: false,
      editableRows: [],
      editActions: [],
    };
  },
  mounted() {
    this.totalRows = this.items.length === 0 ? 1 : this.items.length;
    if (this.totalRows > 1000) {
      this.perPage = 1000;
    }
    this.perPage = this.items.length === 0 ? 1 : 100;
    this.columns.forEach((column) => {
      const { key } = column;
      const selectColumnOptions = this.items.map(item => item[key]);
      this.selectColumns[key] = [...new Set(selectColumnOptions)];
    });
    this.tableRendered = true;
    if (this.editable) {
      this.editableRows = new Array(this.totalRows).fill(false);
      this.editActions = new Array(this.totalRows).fill('Save');
    }
  },
  computed: {
    /* eslint-disable */
    filtereds () {
      const filtereds = this.items.filter(item => {
        Object.keys(this.select).forEach((key) => (this.select[key] == null) && delete this.select[key]);
        return Object.keys(this.select).every(key =>
          String(item[key]).includes(this.select[key]))
      });
      return filtereds;
    },
    /* eslint-disable */
  },
  methods: {
    onFilter(newVal) {
      this.filter = newVal;
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    emitAction() {

    },
    rowSelected(selectedRows) {
      this.$emit('update:selectedItems', selectedRows);
    },
    editRow(index) {
      this.editableRows[index] = true;
      this.$forceUpdate()
    },
    saveRow(row) {
      this.editableRows[row.index] = false;
      this.editActions[row.index] = 'Save';
      this.$forceUpdate();
      this.$emit('saveData', row.item);
    },
    cancelRow(row) {
      this.editableRows[row.index] = false;
      this.editActions[row.index] = 'Cancel';
      this.$forceUpdate();
    }
  },
};
</script>

<style>
.dataTable{
  margin-top: 2%;
}
.exportBtn{
  float: left;
  margin-bottom: 10px;
}
.dropdown-toggle::after {
  display: none;
}
.opsBtn {
  width: 5rem;
}
</style>
