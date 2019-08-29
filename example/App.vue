<template>
  <div id="app">
    <dataTable />
  </div>
</template>

<script>
import dataTable from '../src/index.js' 

export default {
  name: 'app',
  components: {
    dataTable: dataTable,
  },
  data () {
    return {
    };
  },
}
</script>

<style lang="sass" scoped>

</style>


