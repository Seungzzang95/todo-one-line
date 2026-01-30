import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function getInput() {
  return screen.getByRole('textbox', { name: /할 일 입력/i });
}

function getAddButton() {
  return screen.getByRole('button', { name: /추가/i });
}

function getTodoItems() {
  return screen.queryAllByRole('listitem');
}

describe('App', () => {
  it('"a" 추가됨?', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(getInput(), 'a');
    await user.click(getAddButton());
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(getTodoItems()).toHaveLength(1);
  });

  it('Enter로 추가됨?', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(getInput(), 'Enter로 추가{Enter}');
    expect(screen.getByText('Enter로 추가')).toBeInTheDocument();
    expect(getTodoItems()).toHaveLength(1);
  });

  it('빈 값 추가 안 됨?', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(getAddButton());
    expect(getTodoItems()).toHaveLength(0);
    await user.type(getInput(), '   ');
    await user.click(getAddButton());
    expect(getTodoItems()).toHaveLength(0);
  });

  it('삭제 잘 됨?', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(getInput(), '지울 항목');
    await user.click(getAddButton());
    expect(screen.getByText('지울 항목')).toBeInTheDocument();
    const deleteBtn = screen.getByRole('button', { name: /지울 항목 삭제/i });
    await user.click(deleteBtn);
    expect(screen.queryByText('지울 항목')).not.toBeInTheDocument();
    expect(getTodoItems()).toHaveLength(0);
  });

  it('연속 추가해도 OK?', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(getInput(), '첫 번째');
    await user.click(getAddButton());
    await user.type(getInput(), '두 번째');
    await user.click(getAddButton());
    await user.type(getInput(), '세 번째');
    await user.click(getAddButton());
    expect(screen.getByText('첫 번째')).toBeInTheDocument();
    expect(screen.getByText('두 번째')).toBeInTheDocument();
    expect(screen.getByText('세 번째')).toBeInTheDocument();
    expect(getTodoItems()).toHaveLength(3);
  });
});
