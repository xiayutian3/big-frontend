<template>
  <div class="wrapper">
    <i-row :gutter="10">
      <i-col span="5">
        <Card :dis-hover="true" :shadow="true">
          <!-- <Tree :data="roles"></Tree> -->
          <p slot="title">
            <Icon type="md-contacts"></Icon>角色列表
          </p>
          <a slot="extra" @click.prevent="addRoleModal" v-if="!isEdit">
            <Icon type="md-add"></Icon>新增
          </a>
          <ul class="imooc-card">
            <li
              v-for="(item,index) in roles"
              :key="'roles'+index"
              class="role"
              @click="selectRole(index)"
              :class="{selected:roleIndex===index}"
            >
              <a class="name" target="_blank">{{ item.name }}</a>
              <span>
                <Icon type="ios-create" size="16" @click.stop="editLabel(item,index)"></Icon>
                <Icon type="md-build" size="16" color="#2d8cf0" @click.stop="editRole(item,index)"></Icon>
                <Icon
                  type="md-trash"
                  size="16"
                  color="#ed4014"
                  @click.stop="_deleteRole(item,index)"
                ></Icon>
              </span>
            </li>
          </ul>
        </Card>
      </i-col>
      <i-col span="6">
        <Card :dis-hover="true" :shadow="true">
          <div slot="extra">
            <ButtonGroup class="imooc-btn-group" v-if="isEdit">
              <Button size="small" icon="ios-create" type="primary" @click="submit">确定</Button>
              <Button size="small" icon="md-trash" @click="cancel">取消</Button>
            </ButtonGroup>
          </div>
          <p slot="title">
            <Icon type="md-menu"></Icon>菜单权限
          </p>
          <Tree
            :data="menuData"
            show-checkbox
            @on-select-change="handleTreeChange"
            @on-check-change="handlesTreeChecked"
          ></Tree>
        </Card>
      </i-col>
      <i-col span="13">
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <OperationsTable
            :columns="columns"
            :tableData="tableData"
            :isEdit="isEdit"
            @on-change="handleTableChange"
          ></OperationsTable>
        </Card>
      </i-col>
    </i-row>
    <Modal
      v-model="showAdd"
      title="添加角色"
      @on-ok="modalOk"
      @on-cancel="modalCancel"
      :loading="loading"
    >
      <Form ref="form" :model="formItem" :label-width="80" :rules="formRules">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formItem.name" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色编码" prop="role">
          <Input v-model="formItem.role" placeholder="请输入角色编码"></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input v-model="formItem.desc" placeholder="请输入角色描述"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import OperationsTable from './operations'
import {
  getMenu,
  getRole,
  addRole,
  updateRole,
  deleteRole
} from '@/api/admin'
import { modifyNode, getPropertyIds } from '@/libs/util'
export default {
  name: '',
  props: {},
  data () {
    return {
      loading: true,
      isEdit: false,
      modalEdit: false,
      editIndex: '',
      showAdd: false,
      formItem: {
        name: '',
        role: '',
        desc: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        role: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
      },
      selectNode: [],
      roles: [
        {
          name: '超级管理员',
          role: 'super_admin',
          menu: ['5f58d2068bf76e4828878fc5', '5f5c8a3e7cae8c1e4cf0d706']
        }
      ],
      roleIndex: '',
      menuData: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          },
          align: 'center'
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
          }
        }
      ],
      tableData: []
    }
  },
  created () {},
  mounted () {
    // window.vue = this
    this._getMenu()
    this._getRole()
  },
  computed: {},
  methods: {
    // 获取菜单
    _getMenu () {
      getMenu().then((res) => {
        if (res.code === 200) {
          this.menuData = res.data
          localStorage.setItem('menuData', JSON.stringify(this.menuData))
        }
      })
      // menuDispatch.use('get').then((res) => {
      //   if (res.code === 200) {
      //     this.menuData = res.data
      //   }
      // })
    },
    // 获取roles
    _getRole () {
      getRole().then((res) => {
        if (res.code === 200) {
          this.roles = res.data
        }
      })
    },
    // 修改名称按钮
    editLabel (item, index) {
      this.modalEdit = true
      this.showAdd = true
      this.editIndex = index
      this.formItem = { ...item }
    },
    // 编辑按钮
    editRole (item, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    // 删除按钮
    _deleteRole (item, index) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${item.name}的角色吗？`,
        onOk: () => {
          const data = { _id: item._id }
          deleteRole(data).then(res => {
            if (res.code === 200) {
              this.roles.splice(index, 1)
              this.$Message.success('删除成功！')
              //  this._getList()
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 新增按钮
    addRoleModal () {
      this.showAdd = true
    },
    // 选中角色，变色
    selectRole (value) {
      if (this.roleIndex === '' || this.roleIndex !== value) {
        this.roleIndex = value
        if (this.roles[this.roleIndex].menu && this.roles[this.roleIndex].menu.length === 0) {
          return
        }
        // 修改右侧菜单树+权限列表的选中状态
        // 参数含义： 所有的菜单 用户的权限菜单数组 设置checked状态  true
        const tmpData = modifyNode(
          this.menuData,
          this.roles[this.roleIndex].menu,
          'checked',
          true
        )
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    // 菜单权限的确定按钮
    submit () {
      this.isEdit = false
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
      // 提交，更新menu(更新角色)
      this.roles[this.roleIndex].menu = getPropertyIds(this.menuData, [
        'children',
        'operations'
      ])
      const tmp = { ...this.roles[this.roleIndex] }
      tmp.menu = this.roles[this.roleIndex].menu
      this.roles.splice(this.roleIndex, 1, tmp)
      updateRole(tmp).then(res => {
        if (res.code === 200 && res.data.nModified === 1) {
          this.$Message.info('更新角色成功！')
          // 重新请求数据
          this._getRole()
        }
      })
    },
    // 菜单权限的取消按钮
    cancel () {
      this.isEdit = false
      const tmpData = localStorage.getItem('menuData')
      if (typeof tmpData !== 'undefined') {
        this.menuData = JSON.parse(tmpData)
        this.tableData = []
        this.selectNode = []
      }
    },
    // 模态框的确定按钮
    modalOk () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 检验通过后的逻辑
          // 1.获取表单的信息
          if (this.modalEdit) {
            const roleData = { _id: this.roles[this.editIndex]._id, ...this.formItem }
            updateRole(roleData).then(res => {
              if (res.code === 200 && res.data.nModified === 1) {
                this.roles.splice(this.editIndex, 1, roleData)
                this.$Message.info('编辑成功！')
              }
            })
          } else {
            // 2. 提交对应的数据到后台接口(添加角色)
            const data = { ...this.formItem }
            addRole(data).then(res => {
              if (res.code === 200 && res.data.name !== '') {
                this.roles.push(data)
                // this.roles.push(res.data)
                this.$Message.info('添加成功！')
              }
            })
          }

          // 3.清空表单数据
          this.initForm()
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检验表单数据！')
        }
      })
    },
    // 初始化modal的form数据
    initForm () {
      this.loading = false
      this.showAdd = false
      this.modalEdit = false
      setTimeout(() => {
        this.$refs.form.resetFields()
      }, 0)
    },
    // 模态框的取消按钮
    modalCancel () {
      this.initForm()
    },
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      this.selectNode = item
      // if (item[0].operations && item[0].operations.length > 0) {
      this.tableData = [...item[0].operations]
      // }
    },
    handleTableChange (table) {
      // 传过来勾选的数据，也可能是空数组，就是都没有勾选上
      const ids = table.map((o) => o._id)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach((item) => {
          if (!ids.includes(item._id)) {
            item._checked = false
          } else {
            item._checked = true
          }
        })
      }
    },
    handlesTreeChecked (item) {
      if (!this.isEdit) {
        const tmpData = localStorage.getItem('menuData')
        if (typeof tmpData !== 'undefined') {
          this.menuData = JSON.parse(tmpData)
        }
        this.$Message.warning('无法修改，请选择权限进行编辑')
      }
    }
  },
  components: {
    OperationsTable
  },
  watch: {}
}
</script>
<style lang="less">
.wrapper {
  .imooc-card {
    li {
      list-style: none;
    }
    span {
      display: none;
      float: right;
      i {
        margin-right: 5px;
      }
    }
    .role {
      &:hover {
        span {
          display: block;
        }
        .name {
          padding: 1px 2px;
          border-radius: 3px;
          background: #eaf4fe;
        }
      }
      &.selected {
        .name {
          background: #d5e8fc;
        }
      }
    }
    .name {
      padding: 1px 2px;
      border-radius: 3px;
    }
  }
}
@media screen and (max-width: 1200px) {
  .imooc-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .imooc-dropdown {
      display: none;
    }
  }
}
.imooc-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
  &.editing {
    a {
      color: #dcdee2;
    }
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
    button:first-child {
      border-right: 0;
    }
  }
}
</style>
