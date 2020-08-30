<template>
  <div class="wrapper">
    <template v-if="item.type === 'radio'">
      <RadioGroup>
        <Radio label="obj.value" v-for="(obj,index) in finalRadio" :key="'search'+index">
          <span>{{obj.key}}</span>
        </Radio>
      </RadioGroup>
    </template>
    <template v-else-if="item.type === 'date'">
      <DatePicker
        type="daterange"
        placement="bottom-end"
        placeholder="请选择日期时间段"
        style="width: 200px"
      ></DatePicker>
    </template>
    <template v-else-if="item.type === 'select'">
      <Select v-model="selection" multiple style="width:260px">
        <Option v-for="obj in item.options" :value="obj.value" :key="obj.value">{{ obj.key }}</Option>
      </Select>
    </template>
    <template v-else>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      searchValue: '',
      selection: [],
      radioOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {
    // 对传递进来的raio选项进行合并
    finalRadio () {
      let result = {}
      if (this.item.type === 'radio') {
        if (this.item.options) {
          result = this.item.options
        } else {
          result = this.radioOptions
        }
      }
      return result
    }
  },
  methods: {
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="less" scoped>
.wrapper {
  display: inline-block;
  margin: 0 10px;
}
</style>
