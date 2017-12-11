import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import reducer from './Reducers/index';

export default createStore(reducer, applyMiddleware(thunk));


/**
// 基于全局 state ，哪些 state 是我们想注入的 props
function mapStateToProps(state){
    return {
        todoList: state.todos,  // 将全局的 state 的其中一个 key(即todos) 作为 props 注入
    }
}

 <TodoListComponent todoList={this.props.todoList} />   // 注意，这里的 todoList 是 mapStateToProps 返回的 key  （运行时，注释会报错，请删除注释）

**/
