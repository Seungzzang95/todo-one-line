import { useState, useCallback, KeyboardEvent } from 'react';

type Todo = { id: string; text: string };

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: generateId(), text: trimmed }]);
    setInputText('');
  }, [inputText]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') addTodo();
    },
    [addTodo]
  );

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div>
      <h1>TODO</h1>
      <div className="form-row">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일 입력"
          aria-label="할 일 입력"
        />
        <button type="button" onClick={addTodo} aria-label="추가">
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.text}</span>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`${todo.text} 삭제`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
