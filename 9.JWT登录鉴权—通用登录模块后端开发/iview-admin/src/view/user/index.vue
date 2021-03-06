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
        @on-selection-change="handleSelect"
        @searchEvent="searchEventHandle"
      >
        <template v-slot:table-header>
          <Button @click="handleAddUser" class="search-btn" type="primary">
            <Icon type="md-person" />&nbsp;&nbsp;新增用户
          </Button>
        </template>
      </tables>

      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch">批量删除</Button>
          <Button @click="handleSetBatch">批量设置</Button>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </Col>
        <Col>
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
        </Col>
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      :roles="roles"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
    <AddModel
      :isShow="showAdd"
      :roles="roles"
      @editEvent="handleItemAdd"
      @changeEvent="handleAddChangeEvent"
    ></AddModel>
     <BatchSet
      :isShow="showSet"
      :roles="roles"
      @editEvent="handleItemSet"
      @changeEvent="handleSetChangeEvent"
    ></BatchSet>'
  </div>
</template>

<script>
import EditModel from './edit'
import AddModel from './add'
import BatchSet from './batchSet'
import { getUserList, updateUserById, deleteUserById, addUser, updateUserBatchById, getRoleNames } from '@/api/admin'
import Tables from '_c/tables'
import dayjs from 'dayjs'
export default {
  name: 'user_management',
  components: {
    Tables,
    EditModel,
    AddModel,
    BatchSet
  },
  computed: {
    roleNames () {
      const tmp = {}
      this.roles.forEach(item => {
        tmp[item.role] = item.name
      })
      return tmp
    }
  },
  data () {
    return {
      showEdit: false,
      showAdd: false,
      showSet: false,
      roles: ['user'],
      // currentIndex: 0,
      currentItem: {},
      option: {},
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
          title: '用户昵称',
          key: 'name',
          minWidth: 140,
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 160,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 160,
          render: (h, params) => {
            const roleNames = params.row.roles.map(o => this.roleNames[o]).join(',')
            return h('div', [h('span', roleNames)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          hidden: true,
          minWidth: 80
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          },
          search: {
            type: 'radio',
            options: [
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
        {
          title: '是否是VIP',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [h('span', params.row.isVip === '0' ? '否' : '是')])
          },
          search: {
            type: 'radio',
            options: [
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
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss')
              )
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 100,
          align: 'center'
        }
      ],
      tableData: [],
      selection: []
    }
  },
  methods: {
    // 搜索的数据
    searchEventHandle (value) {
      // 判断是否有新的查询内容的传递，把分页数据归0
      if ((typeof this.option.search !== 'undefined' && value.search !== this.option.search) || this.option === {}) {
        // page的初始值是从1开始
        this.page = 1
      }
      this.option = value
      this._getList()
    },
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据')
        return
      }
      const msg = this.selection.map(o => o.username).join(',')

      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${msg}的用户？`,
        onOk: () => {
          // 删除的用户id的数组
          const arr = this.selection.map(o => o._id)
          deleteUserById(arr).then((res) => {
            this.$Message.success('删除成功！')
            // 更新列表
            this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 批量设置 -> vip 禁言， 角色
    handleSetBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要设置的数据')
        return
      }
      this.showSet = true
    },
    // 批量设置 modal
    handleItemSet (settings) {
      // console.log('handleItemSet -> settings', settings)

      const msg = this.selection.map(o => o.username).join(',')

      this.$Modal.confirm({
        title: '确定修改用户吗？',
        content: `修改${msg}的用户？`,
        onOk: () => {
          // 删除的用户id的数组
          const arr = this.selection.map(o => o._id)
          updateUserBatchById({ ids: arr, settings }).then((res) => {
            this.$Message.success('设置成功！')
            // 更新列表
            this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 批量设置
    handleSetChangeEvent (value) {
      this.showSet = value
    },

    // 全选
    handleSelect (selection) {
      this.selection = selection
    },
    // 处理新增用户
    handleItemAdd (item) {
      addUser(item).then(res => {
        if (res.code === 200) {
        // 更新列表
          this._getList()
        }
      })
    },
    // 处理新增用户模态框
    handleAddChangeEvent (value) {
      this.showAdd = value
    },
    // 新增用户按钮点击
    handleAddUser () {
      this.showAdd = true
    },
    handleItemEdit (item) {
      updateUserById(item).then((res) => {
        if (res.code === 200) {
          // 更新列表
          this._getList()
        }
      })
    },
    handleChangeEvent (value) {
      this.showEdit = value
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    // 页码发生改变
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    // 分页数量大小发生改变
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      // this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${row.name}的用户？`,
        onOk: () => {
          deleteUserById(row._id).then((res) => {
            this.$Message.success('删除成功！')
            // 更新列表
            this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    _getList () {
      getUserList({ page: this.page - 1, limit: this.limit, option: this.option }).then(
        ({ code, data, total }) => {
          if (code === 200) {
            this.tableData = data
            this.total = total
          }
        }
      )
    },
    _getRoleNames () {
      getRoleNames().then(res => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    }
  },
  mounted () {
    this._getList()
    this._getRoleNames()
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
