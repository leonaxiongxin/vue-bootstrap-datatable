<template>
  <div class="renderColumn">
    <linkHref v-if="render_type==='link'"
      :url="url"
      :type="value_type"
      :value="item[name]"
      :rowVariant="rowVariant"
      />

    <b-dropdown v-else-if="render_type==='dropdown'"
      text="Actions"
      size="sm"
    >
      <b-dropdown-item-button
        v-for="(action, key) in dropdown_params"
        :key="key"
        @click.stop="emitAction(action)"
      >Suppress
      </b-dropdown-item-button>
    </b-dropdown>

    <b-form-textarea v-else-if="render_type==='input' && editable"
                     v-model="inputVal"
                     rows="3"
                     max-rows="8"
    >
    </b-form-textarea>

    <span v-else>
      {{ item[name] !== '' ? (value_type==='number' ? item[name].toLocaleString('en') : item[name]) : '-----' }}
    </span>

  </div>
</template>

<script>
import { replaceParams } from '@/utils/http';

export default {
  components: {
    /* eslint-disable */
    linkHref: resolve => require.ensure([], () => resolve(require('@/common/LinkHref')), 'linkHref'),
    /* eslint-disable */
  },
  props: {
    name: {
      type: String,
      default: null,
    },
    render_type: {
      type: String,
      default: null,
    },
    value_type: {
      type: String,
      default: null,
    },
    link_href: {
      type: String,
      default: null,
    },
    link_params: {
      type: [Array, String],
      default: () => [],
    },
    dropdown_params : {
      type: [Array],
      default: () => [],
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    apiParams: {
      type: Object,
      default: () => ({}),
    },
    rowVariant: {
      type: String,
      default: null,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: 'Save',
    }
  },
  data() {
    return {
      url: null,
      inputVal: '',
    };
  },
  watch: {
    item() {
      this.getUrl();
      this.getDefaultInput();
    },
    editable() {
      this.updateText();
    },
  },
  mounted() {
    this.getUrl();
    this.getDefaultInput();
  },
  methods: {
    getUrl() {
      let ParamsObject = Object.assign( this.apiParams, this.item);
      if(this.link_href) {
        this.url = replaceParams(this.link_href, ParamsObject);
      }
    },
    getDefaultInput() {
      this.inputVal  = typeof this.item[this.name] === 'object'
        ? JSON.stringify(this.item[this.name])
        : typeof this.item[this.name] === 'number'
          ? this.item[this.name].toString()
          : this.item[this.name];
    },
    updateText() {
      if (this.inputVal !== '' && this.action === 'Save') {
        this.item[this.name] = typeof this.item[this.name] === 'object'
          ? JSON.parse(this.inputVal)
          : typeof this.item[this.name] === 'number'
            ? Number.parseInt(this.inputVal)
            : this.inputVal;
      }
    },
    emitAction(item, action) {
      // eslint-disable-next-line
      console.log('emitAction',  action);
      this.$emit('emitAction', action);
    },
    concatParams(apiParams, linkParams) {
      const params = { ...apiParams, ...linkParams };
      const apiParamsKeys = Object.keys(apiParams);
      if ( typeof (linkParams.day) !== 'undefined' ) {
        if (apiParamsKeys.includes('start_day')) {
          delete params.start_day;
          delete params.end_day;
        } else if(apiParamsKeys.includes('start_time')) {
          delete params.start_time;
          delete params.end_time;
        }
      }
      return params;
    },
  },
};
</script>
