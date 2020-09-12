<template>
  <div>
    <tables
      ref="tables"
      :columns="columns"
      v-model="localData"
      @on-selection-change="handleSelect"
    >
      <template v-slot:table-header>
        <Button @click="handleAdd" class="search-btn" type="primary" v-if="isEdit">
          <Icon type="md-person-add" />&nbsp;&nbsp;添加
        </Button>
      </template>
    </tables>
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Page
          v-if="total.length > 0"
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageArr"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Tables
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      selection: [],
      current: 0,
      localData: []
    }
  },
  watch: {
    localData () {
      this.$emit('on-change', this.localData)
    },
    tableData (newval, oldval) {
      localStorage.setItem('localData', JSON.stringify(newval))
      this.localData = newval
    }
  },
  methods: {
    handleSelect (selection) {
      this.selection = selection
      if (!this.isEdit) {
        // table组件选择的触发时机与tree组件勾选的触发时机不一样，table是更新后才触发，所以给个setTimeout，才能阻止被勾选
        // 让整个视图的更新在 table 的handleSelect事件之后， 所以添加延迟执行
        setTimeout(() => {
          const tmpData = localStorage.getItem('localData')
          if (typeof tmpData !== 'undefined') {
            this.localData = JSON.parse(tmpData)
          }
          this.$Message.warning('无法修改，请选择权限进行编辑')
        }, 0)
      }
    },
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${msg}的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          // this.localData.splice(index, 1)
          this.localData = this.localData.filter(
            (item) => !arr.includes(item.name)
          )
          this.$Message.success('删除成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      this.showSet = true
    },
    handleAdd () {
      this.showModel = true
    },
    handleItemAdd (item) {
      // 每次添加模态框架触发的添加数据的事件
      if (this.showEdit) {
        this.localData.splice(this.current, 1, item)
        this.showEdit = false
      } else {
        this.localData.push(item)
      }
    },
    // 批量设置模态框
    handleItemSet (settings) {
      const msg = this.selection.map((o) => o.name).join(',')
      this.$Modal.confirm({
        title: '确定设置吗？',
        content: `修改${msg}的资源吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o.name)
          // this.tableData.splice(index, 1)
          this.localData.map((item, index) => {
            const tmp = { ...item }
            if (arr.includes(tmp.name)) {
              for (var keys of Object.keys(settings)) {
                tmp[keys] = settings[keys]
              }
              this.$set(this.localData, index, tmp)
            }
          })
          this.$Message.success('批量设置成功！')
          //  this._getList()
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleAddChangeEvent (value) {
      this.showModel = value
    },
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (size) {
      this.limit = size
    }
  }
}
</script>

<style lang="less" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
