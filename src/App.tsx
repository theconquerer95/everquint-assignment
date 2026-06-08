import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTaskStore } from '@hooks/useTaskStore'
import { useTaskFilters } from '@hooks/useTaskFilters'
import { Board } from '@features/board/Board'
import { BoardFilters } from '@features/board/BoardFilters'
import { TaskFormModal } from '@features/tasks/TaskFormModal'
import { Button } from '@eqds'
import { type Task } from '@types'

function BoardPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const loadTasks = useTaskStore((state) => state.loadTasks)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)

  const { 
    filters, 
    setFilters, 
    filteredAndSortedTasks, 
    clearFilters, 
    isFiltered 
  } = useTaskFilters(tasks)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleAddTask = () => {
    setEditingTask(undefined)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(undefined)
  }

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      addTask(taskData)
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-heading font-semibold leading-heading text-text-primary">
              Team Workflow Board
            </h1>
            <p className="mt-1 text-text-secondary">
              Manage your team's tasks and track progress.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddTask}>
            Add New Task
          </Button>
        </header>

        <BoardFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          onClearFilters={clearFilters} 
        />

        <Board 
          filteredTasks={filteredAndSortedTasks} 
          onEditTask={handleEditTask}
          onAddTask={handleAddTask}
          isFiltered={isFiltered}
        />

        <TaskFormModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          initialTask={editingTask}
          onSave={handleSaveTask}
        />
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
