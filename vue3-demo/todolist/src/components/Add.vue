<template>
  <div class="form-group">
    <label for="">添加代办事项</label>{{ inputValue }}
    <div class="row">
      <div class="col-8">
        <input
          type="text"
          v-model="inputValue"
          class="form-control"
          @keydown.enter="add"
        />
      </div>
      <div class="col-4">
        <select class="form-control" v-model="filterState" @change="changState">
          <option :value="TodoItemState.ALL">选择已过滤</option>
          <option :value="TodoItemState.OPEN">代办中</option>
          <option :value="TodoItemState.DONE">已完成</option>
          <option :value="TodoItemState.DELETE">已删除</option>
        </select>
      </div>
    </div>
    <small class="form-text text-muted">回车即可加入</small>
  </div>
  <div class="list-group">
    <li
      class="list-group-item d-flex align-item-center justify-content-between"
      v-for="item in todos"
      :key="item.id"
      @click.prevent="checkFun(item)"
    >
      <!-- @click.stop="checkFun(item)"  // 第二种取消默认行为 -->

      <div class="form-check">
        <input
          type="checkbox"
          :id="item.id"
          class="form-checkinput"
          :checked="item.state === TodoItemState.DONE"
          :disabled="item.state === TodoItemState.DELETE"
        />
        <label :for="item.id" :class="{'text-black-50 line-through':item.state === TodoItemState.DONE}">{{ item }}</label>
        <!-- // 第二种取消默认行为 -->
        <!-- <label :for="item.id"  @click.stop.prevent="checkFun(item)">{{ item }}</label> -->
      </div>
      <div class="float-right ctrls" :class="{'d-none':item.state !== TodoItemState.OPEN}">
        <div class="btn btn-warning btn-sm mr-2 text-light">编辑</div>
        <div class="btn btn-danger btn-sm" @click.stop="remove(item.id)">删除</div>
      </div>
    </li>
  </div>
  <button type="button" class="btn btn-danger float-right mt-4" @click="hide">
    {{filterState === TodoItemState.OPEN?'显示所有':'隐藏已完成'}}
  </button>
</template>

<script lang="ts">
import store from '@/store'
import { TodoItem } from '../common/interface'
import { TodoItemState } from '../common/const'
import { computed, defineComponent, ref } from 'vue'
// import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup () {
    const inputValue = ref('')
    const filterState = ref(TodoItemState.ALL)

    const add = () => {
      // console.log(inputValue.value)
      // 更新vuex
      store.commit('add', inputValue.value)
      // 重置
      inputValue.value = ''
    }

    const checkFun = (item: TodoItem) => {
      if (item.state === TodoItemState.OPEN || item.state === TodoItemState.DONE) {
        store.commit('check', item.id)
      }
      // console.log('item', item)
    }

    const remove = (id: string) => {
      store.commit('remove', id)
    }

    const changState = (event: any) => {
      // 两种方法都可以拿到变化的值
      console.log('event', event.target.selectedIndex)
      // console.log(filterState.value)
    }

    const filterItem = (value: TodoItemState) => {
      if (value === TodoItemState.ALL) {
        return store.state.todos
      }
      return store.state.todos.filter(item => item.state === value)
    }

    const hide = () => {
      if (filterState.value === TodoItemState.OPEN) {
        filterState.value = TodoItemState.ALL
      } else {
        filterState.value = TodoItemState.OPEN
      }
    }

    // return reactive({   //都可以
    //   inputValue
    // })
    return {
      inputValue,
      add,
      todos: computed(() => filterItem(filterState.value)),
      TodoItemState,
      checkFun,
      remove,
      filterState,
      changState,
      hide
    }
  }
})
</script>

<style lang="scss" scoped>
.line-through{
  text-decoration: line-through;
}
.list-group-item {
  user-select: none;  //不然选中文本
  &:hover {
    .ctrls {
      display: block;
    }
  }
  .ctrls {
    display: none;
  }
}
</style>
