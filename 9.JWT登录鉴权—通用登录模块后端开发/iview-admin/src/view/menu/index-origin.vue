<template>
  <div class="wrapper">
    <Row :gutter="10">
      <Col :sm="24" :md="9" :lg="5">
        <Card dis-hover shadow>
          <Row type="flex" align="middle" justify="center">
            <ButtonGroup class="imooc-btn-group" :class="{'editing':isEdit}">
              <Button size="small" :disabled="isEdit">
                <Dropdown @on-click="addMenu">
                  <a href="javascript:void(0)">
                    <Icon type="md-add"></Icon>
                    <span class="imooc-dropdown">新增</span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">兄弟节点</DropdownItem>
                    <DropdownItem name="child" :disabled="menuData.length === 0 ">子节点</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Button>
              <Button
                :disabled="isEdit"
                size="small"
                type="primary"
                icon="ios-create"
                @click="editMenu"
              >修改</Button>
              <Button
                :disabled="isEdit"
                size="small"
                type="error"
                icon="md-trash"
                @click="deleteMenu"
              >删除</Button>
            </ButtonGroup>
          </Row>
          <Tree ref="tree" :data="menuData" @on-select-change="handleTreeChange"></Tree>
        </Card>
      </Col>
      <Col :sm="24" :md="15" :lg="19">
        <Card :title="$t('Menu Otionps')" dis-hover shadow style="margin-bottom:10px">
          <Form
            :disabled="!isEdit"
            ref="form"
            :model="formDate"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="菜单标题" prop="name">
              <Input v-model="formDate.name" placeholder="请输入菜单标题"></Input>
            </FormItem>
            <FormItem label="路径" prop="path">
              <Input v-model="formDate.path" placeholder="请输入菜单路由"></Input>
            </FormItem>
            <FormItem label="菜单类型">
              <Select v-model="formDate.type" placeholder="请选择菜单类型">
                <Option value="menu">目录</Option>
                <Option value="resouce">资源</Option>
              </Select>
            </FormItem>
            <FormItem label="组件" prop="component">
              <Input v-model="formDate.component" placeholder="请输入组件名称">
                <span slot="prepend">()=>import('@/view</span>
                <span slot="append">.vue')</span>
              </Input>
            </FormItem>
            <FormItem label="排序">
              <Input v-model="formDate.sort" placeholder="组件默认排序"></Input>
            </FormItem>
            <FormItem label="面包屑">
              不显示
              <Switch v-model="formDate.hideInBread" />显示
            </FormItem>
            <FormItem label="菜单显示">
              不显示
              <Switch v-model="formDate.hideInMenu" />显示
            </FormItem>
            <FormItem label="页面缓存">
              是
              <i-switch v-model="formDate.notCache" />否
            </FormItem>
            <FormItem label="图标">
              <Input v-model="formDate.icon" placeholder="请输入图标"></Input>
            </FormItem>
            <FormItem label="重定向">
              <Input v-model="formDate.redirect" placeholder="请输入重定向"></Input>
            </FormItem>

            <FormItem>
              <Button type="primary" @click="handleSubmit('form')">确定</Button>
              <Button @click="handleReset('form')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </Card>
        <Card :title="$t('Resources')" dis-hover shadow>
          <Tables
            ref="tables"
            searchable
            search-place="top"
            border
            :columns="columns"
            v-model="tableData"
            @on-row-edit="handleRowEdit"
            @on-row-remove="handleRowRemove"
            @on-selection-change="handleSelect"
            @searchEvent="searchEventHandle"
          >
            <template v-slot:table-header>
              <Button @click="handleAdd" class="search-btn" type="primary">
                <Icon type="md-person" />&nbsp;&nbsp;添加
              </Button>
            </template>
          </Tables>
          <Row type="flex" justify="space-between" align="middle">
            <Col class="ctrls">
              <Button @click="handleDeleteBatch">批量删除</Button>
              <Button @click="handleSetBatch">批量设置</Button>
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
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { sortObj } from '@/libs/util'
export default {
  name: '',
  props: {},
  data () {
    return {
      isEdit: false,
      selectNode: [],
      menuData: [],
      type: '',
      formDate: {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '菜单名称不得为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由路径不得为空', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '前端组件名称不得为空', trigger: 'blur' }
        ]
      },
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
          }
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
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
          }
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
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
      selection: [],
      page: 1,
      limit: 10,
      total: 40,
      pageSizeArr: [10, 30, 50, 100]
    }
  },
  created () {},
  mounted () {
    // 调试方法
    // window.vue = this
  },
  computed: {},
  methods: {
    // 添加菜单
    addMenu (type) {
      this.type = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true
      } else {
        this.$Message.error('请选择菜单节点后在添加！')
      }
    },
    // 删除菜单
    deleteMenu () {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: `删除${this.selectNode[0].title}的菜单项吗？`,
          onOk: () => {
            const deleteNode = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(i, 1)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    deleteNode(currentNode.children, node)
                  }
                }
              }
              return tree
            }
            this.menuData = deleteNode(this.menuData, this.selectNode[0])
            // 清空selectNode
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择菜单节点后在删除！')
      }
    },
    // 确认按钮
    handleSubmit (name) {
      // 校验
      this.$refs[name].validate((valid) => {
        if (valid) {
          // expand iview组件提供的属性，展开节点
          const data = { ...this.formDate, expand: true }
          // 赋值title
          data.title = this.formDate.name
          // 1.获取formdate中的数据 -》 menuData中
          // a.type -》 数据插入的节点 b.数据按照tree的数据格式经行格式化 -》 title
          if (this.type === 'bro') {
            // 兄弟节点
            if (this.menuData.length === 0) {
              // 没有节点的时候，
              this.menuData.push(data)
              this.$Message.success('Success!')
              // 重置操作
              this.isEdit = false
              // 清空表单
              this.$refs[name].resetFields()
            } else {
              // 选中某个节点给他添加兄弟节点
              // this.menuData = this.menuData->children -> ...->selectNode
              // 1.parent 2.selectNode->返回新的 new menuData

              // 选中的元素
              const selectNode = this.selectNode[0]
              const getMenu = (parent, select) => {
                // 1.遍历parent -》 select push
                // 2.children -> push child
                // 3.return parent
                for (let i = 0; i < parent.length; i++) {
                  const item = parent[i]
                  // 去重
                  if (item.name === select.name) {
                    // 排序
                    parent.push(data)
                    parent = sortObj(parent, 'sort')
                    return parent
                  } else {
                    if (item.children && item.children.length > 0) {
                      getMenu(item.children, select)
                    }
                  }
                }
                // 如果都执行完了，return parent
                return parent
              }
              this.menuData = getMenu(this.menuData, selectNode)
            }
          } else if (this.type === 'child') {
            // 添加子节点情况
            if (typeof this.selectNode[0].children === 'undefined') {
              this.$set(this.selectNode[0], 'children', [data])
            } else {
              // 排序？
              let arr = [...this.selectNode[0].children, data]
              arr = sortObj(arr, 'sort')
              this.$set(this.selectNode[0], 'children', arr)
            }
          } else {
            // 更新菜单节点
            const updateNode = (tree, node) => {
              for (let i = 0; i < tree.length; i++) {
                const currentNode = tree[i]
                if (currentNode.nodeKey === node.nodeKey) {
                  tree.splice(i, 1, node)
                  return tree
                } else {
                  if (currentNode.children && currentNode.children.length > 0) {
                    updateNode(currentNode.children, node)
                  }
                }
              }
              return tree
            }
            this.menuData = updateNode(this.menuData, data)
            // 设置selectNode的第0号元素
            this.$set(this.selectNode, 0, data)
          }

          // 重置操作
          this.initFields()
          // 2.提交对应的数据到后台接口
        } else {
          this.$Message.error('请检验表单数据！')
        }
      })
    },
    // 初始化数据，和清空表单
    initFields () {
      // 重置操作
      this.isEdit = false
      // 清空表单
      this.$refs.form.resetFields()
      // 表单数据恢复
      this.formDate = {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.type = ''
    },
    // 取消按钮
    handleReset (name) {
      // 重置操作
      this.initFields()
    },
    // 编辑菜单
    editMenu () {
      if (this.selectNode.length > 0) {
        this.isEdit = true
        this.formDate = { ...this.selectNode[0] }
      } else {
        this.$Message.error('请选择菜单节点后在添编辑！')
      }
    },
    // 点击树形节点选中
    handleTreeChange (item) {
      this.selectNode = item
    },
    // 编辑
    handleRowEdit () {},
    // 删除
    handleRowRemove () {},
    // 批量选择
    handleSelect () {},
    // 搜索，数量很多的时候，搜索某个范围，或某一条
    searchEventHandle () {},
    // 添加
    handleAdd () {},
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
    // 批量删除
    handleDeleteBatch () {
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据')
        return
      }
      const msg = this.selection.map((o) => o.username).join(',')

      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除${msg}的用户？`,
        onOk: () => {
          // 删除的用户id的数组
          const arr = this.selection.map((o) => o._id)
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
    }
  },
  components: {
    Tables
  },
  watch: {}
}
</script>
<style lang="less">
@media screen and (max-width: 1395px) {
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
      border-right-color: #dcdee2 !important;
      border-left-color: #dcdee2!important;
    }
    button:first-child{
      border-right: 0px;
    }
  }
}
</style>
