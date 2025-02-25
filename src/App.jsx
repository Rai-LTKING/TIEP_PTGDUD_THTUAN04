import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react';
import './App.css'

// Main reducer function
const todoReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload;
        case 'ADD':
            return [...state, action.payload];
        case 'TOGGLE':
            return state.map(todo =>
                todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
            );
        case 'DELETE':
            return state.filter(todo => todo.id !== action.payload);
        default:
            return state;
    }
};

const App = () => {
    // State quản lý danh sách công việc và giá trị của ô input
    const [todos, dispatch] = useReducer(todoReducer, []);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();

    // Lưu danh sách công việc vào localStorage khi danh sách thay đổi
    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos'));
        if (storedTodos) {
            dispatch({ type: 'SET', payload: storedTodos });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // Sử dụng useMemo để lọc các công việc đã hoàn thành và chưa hoàn thành
    const filteredTodos = useMemo(() => {
        return {
            incomplete: todos.filter(todo => !todo.completed),
            completed: todos.filter(todo => todo.completed),
        };
    }, [todos]);

    // Hàm xử lý khi thêm công việc mới
    const handleAddTodo = () => {
        if (!inputValue.trim()) return;
        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
        };
        dispatch({ type: 'ADD', payload: newTodo });
        setInputValue('');
        inputRef.current.focus();
    };

    // Hàm xử lý khi toggle trạng thái công việc
    const handleToggleTodo = (id) => {
        dispatch({ type: 'TOGGLE', payload: id });
    };

    // Hàm xử lý khi xóa công việc
    const handleDeleteTodo = (id) => {
        dispatch({ type: 'DELETE', payload: id });
    };

    return (
        <div>
            <h1>Todo List</h1>
            <input
                maxLength = {43}
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button className='add-todo' onClick={handleAddTodo}>Add Todo</button>
            <h2>Incomplete</h2>
            <ul>
                {filteredTodos.incomplete.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => handleToggleTodo(todo.id)}
                        >
                            {todo.text}
                        </span>
                        <button className='delete-todo' onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul> 
            <h2>Completed</h2>
            <ul>
                {filteredTodos.completed.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => handleToggleTodo(todo.id)}
                        >
                            {todo.text}
                        </span>
                        <button className='delete-todo' onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;