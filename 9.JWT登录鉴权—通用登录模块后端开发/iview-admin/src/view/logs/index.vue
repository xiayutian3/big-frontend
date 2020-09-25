<template>
  <div>
    <Card :dis-hover="true" :shadow="true">
      <Table
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        @on-selection-change="handleSelect"
      ></Table>
      <Row type="flex" justify="space-between" align="middle">
        <i-col class="ctrls">
          <Button @click="deleteErrors()">批量删除</Button>
          <Button @click="handleSetBatch()">批量设置</Button>
        </i-col>
        <i-col>
          <Page
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
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { deleteErrors, getErrorList } from '@/api/admin'
import Expand from './expand'
import dayjs from 'dayjs'
export default {
  components: {
  },
  data () {
    return {
      columns: [
        {
          type: 'expand',
          key: 'stack',
          width: 50,
          render: (h, params) => {
            return h(Expand,
              {
                // 组件 prop
                props: {
                  row: params.row
                }
              })
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '错误消息',
          key: 'message',
          align: 'center',
          minWidth: 180
        },
        {
          title: '错误码',
          key: 'code',
          align: 'center',
          minWidth: 80
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center',
          minWidth: 100
        },
        {
          title: '请求路径',
          key: 'path',
          align: 'center',
          minWidth: 200
        },
        {
          title: '请求参数',
          key: 'param',
          minWidth: 200
        },
        {
          title: '日期',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
        },
        {
          title: '用户',
          key: 'username',
          align: 'center',
          minWidth: 120
        }
      ],
      data: [
        {

        }
      ],
      globalFilters: {
        // 全局过滤条件：多条件筛选、分页
        message: undefined,
        code: undefined,
        method: undefined,
        page: { num: 1, limit: 10 } // 分页
      },
      page: 1,
      limit: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      loading: true,
      selection: []
    }
  },
  mounted () {
    this._getErrorList()
  },
  methods: {
    _deleteErrors () {
      const selection = this.selection
      if (selection.length !== 0) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '确定要删除已选中的错误消息吗？',
          onOk: () => {
            const arr = selection.reduce((obj, item) => {
              obj.ids = []
              return obj.ids.push(item._id)
            }, {})
            console.log('deleteError -> arr', arr)
            deleteErrors(arr).then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('删除成功！')
              } else {
                this.$Message.error('删除失败，请联系管理员！')
              }
            })
          }
        })
      } else {
        this.$Modal.error({
          title: '错误',
          content: '请选择要删除的错误消息'
        })
      }
    },
    _getErrorList () {
      getErrorList({
        page: this.page,
        limit: this.limit,
        fitler: this.globalFilters || {}
      }).then((res) => {
        this.data = res.data
        this.total = res.total
        this.loading = false
      })
    },
    onPageChange (num) {
      // 页码
      this.globalFilters.page.num = num
    },
    onPageSizeChange (num) {
      // 每页显示条数
      this.globalFilters.page.limit = num
    },
    handleSetBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据！')
        return
      }
      // 批量进行设置 -> vip, 禁言, 角色
      this.showSet = true
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
        columns: this.columns1.filter((col, index) => index >= 0),
        data: this.data.filter((data, index) => index >= 0)
      })
    },
    handleSelect (selection) {
      this.selection = selection
    }
  }
}
</script>

<style lang="less">
.ctrls {
  margin-top: 10px;
  button {
    margin-right: 10px;
  }
}
</style>
