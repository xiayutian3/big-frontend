<template>
  <div class="wrapper">
    <Row :gutter="10">
      <Col :sm="24" :md="9" :lg="5">
        <Card dis-hover shadow>
          <Row type="flex" align="middle" justify="center">
            <ButtonGroup class="imooc-btn-group">
              <Button size="small" icon="md-add">新增</Button>
              <Button size="small" type="primary" icon="ios-create">修改</Button>
              <Button size="small" type="error" icon="md-trash">删除</Button>
            </ButtonGroup>
          </Row>
          <Tree :data="data1"></Tree>
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
              <Input v-model="formDate.component" placeholder="请输入组件名称"></Input>
              <span slot="prepend">()=>import('@/view</span>
              <span slot="append">.vue')</span>
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
              <Button type="primary" @click="handleSubmit('form')">Submit</Button>
              <Button @click="handleReset('form')" style="margin-left: 8px">Reset</Button>
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
export default {
  name: '',
  props: {},
  data () {
    return {
      isEdit: false,
      data1: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
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
  mounted () {},
  computed: {},
  methods: {
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
  }
}
.imooc-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
}
</style>
