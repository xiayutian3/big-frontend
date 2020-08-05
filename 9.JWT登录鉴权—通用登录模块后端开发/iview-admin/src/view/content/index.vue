<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
      />

      <Row type="flex" justify="space-between" align="middle">
        <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        <Page
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageSizeArr"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
  </div>
</template>

<script>
import EditModel from './editModel'
import Tables from '_c/tables'
import { getList, deletePostById, updatePostById } from '@/api/content'
import dayjs from 'dayjs'
export default {
  name: 'content_management',
  components: {
    Tables,
    EditModel
  },
  data () {
    return {
      showEdit: false,
      // currentIndex: 0,
      currentItem: {},
      page: 1,
      limit: 10,
      total: 40,
      pageSizeArr: [10, 30, 50, 100],
      columns: [
        {
          type: 'selection',
          key: '',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 400
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center',
          // 方法二：使用 render 方法结构化数据
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss')
              )
            ])
          }
        },
        {
          title: '作者',
          key: 'user',
          width: 120,
          align: 'center',
          // 方法二：使用render 方法结构化数据
          render: (h, params) => {
            return h(
              'div',
              params.row.uid.name
              // [
              // h('Icon', {
              //   props: {
              //     type: 'person'
              //   }
              // }),
              // h('strong', params.row.name)
              // ]
            )
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask':
                result = '提问'
                break
              case 'advise':
                result = '建议'
                break
              case 'discuss':
                result = '交流'
                break
              case 'share':
                result = '分享'
                break
              case 'logs':
                result = '动态'
                break
              case 'notice':
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', result)
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.tags.map((o) => o.name).join(',') || '')
            ])
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '否' : '是')])
          }
        },
        {
          title: '阅读记数',
          key: 'reads',
          width: 100,
          align: 'center'
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                class: 'test',
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: '#19be6b',
                  type: params.row.isTop === '1' ? 'md-checkmark' : '',
                  size: 20
                }
              })
            ])
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          fixed: 'right',
          width: 160,
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  methods: {
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _getList () {
      getList({ page: this.page - 1, limit: this.limit }).then(
        ({ code, data, total }) => {
          if (code === 200) {
            // 方法一： 结构化数据
            // const newdata = data
            // newdata.forEach(item => {
            //   if (item.status === 0) {
            //     item.status = '打开回复'
            //   } else {
            //     item.status = '禁止回复'
            //   }
            // })
            // this.tableData = newdata

            this.tableData = data
            this.total = total
          }
        }
      )
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      // this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除文章吗？',
        content: `删除第${index + 1}条数据，文章标题"${row.title}"的文章吗？`,
        onOk: () => {
          deletePostById(row._id)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.info('成功删除！')
                this._getList()
              }
            })
            .catch((err) => {
              this.$Message.info('删除失败!原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    handleItemEdit (item) {
      updatePostById(item).then(res => {
        if (res.code === 200) {
          // 更新列表
          this._getList()
        }
      })
    },
    handleChangeEvent (value) {
      this.showEdit = value
    }
  },
  mounted () {
    this._getList()
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
