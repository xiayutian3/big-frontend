<template>
  <div class="wrapper">
    <i-row :gutter="10">
      <i-col span="5">
        <Card :dis-hover="true" :shadow="true">
          <!-- <Tree :data="roles"></Tree> -->
          <p slot="title">
            <Icon type="md-contacts"></Icon>角色列表
          </p>
          <a slot="extra" @click.prevent="addRole" v-if="!isEdit">
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
              <a class="name" target="_blank">{{ item.title }}</a>
              <span>
                <Icon type="md-build" size="18" color="#2d8cf0" @click.stop="editRole(item,index)"></Icon>
                <Icon type="md-trash" size="18" color="#ed4014"></Icon>
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
          <Tree :data="menuData" show-checkbox></Tree>
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
    <Modal v-model="showAdd" title="添加角色" @on-ok="modalOk" @on-cancel="modalCancel">
      <Form :model="formItem" :label-width="80" :rules="formRules">
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
export default {
  name: '',
  props: {},
  data () {
    return {
      isEdit: false,
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
          title: 'parent 1'
        },
        {
          title: 'parent 1'
        },
        {
          title: 'parent 1'
        },
        {
          title: 'parent 1'
        }
      ],
      roleIndex: '',
      menuData: [
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
  mounted () {},
  computed: {},
  methods: {
    // 编辑按钮
    editRole (item, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    // 新增按钮
    addRole () {
      this.showAdd = true
    },
    // 选中角色，变色
    selectRole (value) {
      if (this.roleIndex === '' || this.roleIndex !== value) {
        this.roleIndex = value
      } else {
        this.roleIndex = ''
      }
    },
    // 菜单权限的确定按钮
    submit () {
      this.isEdit = false
    },
    // 菜单权限的取消按钮
    cancel () {
      this.isEdit = false
    },
    // 模态框的确定按钮
    modalOk () {},
    // 模态框的取消按钮
    modalCancel () {},
    addMenu () {},
    editMenu () {},
    deleteMenu () {},
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      // 非编辑状态
      if (!this.isEdit) {
        this.selectNode = item
        // if (item[0].operations && item[0].operations.length > 0) {
        this.tableData = [...item[0].operations]
        // }
      } else {
        this.$Message.error('当前为编辑状态，请取消编辑后查看！')
      }
    },
    handleTableChange (table) {
      this.tableData = table
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
      i:first-child {
        margin-right: 7px;
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
