import DataTable from './components/DataTable';

const dataTable = {
  install(Vue) {
    Vue.component(DataTable.name, DataTable);
  },
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(dataTable);
}

export default dataTable;
