import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { MoonIcon, SunIcon } from 'lucide-react';
import { useState, useEffect } from 'react'
// Define the root route
export const Route = createRootRoute({
  component: Root
})

// Navbar with dark mode toggle
function NavBar() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Update the `html` element's class based on dark mode state
    const rootElement = document.documentElement
    if (isDarkMode) {
      rootElement.classList.add('dark')
    } else {
      rootElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className="p-2 flex gap-10 items-center">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/expenses" className="[&.active]:font-bold">
        Expenses
      </Link>
      <Link to="/create_expense" className="[&.active]:font-bold">
        Create
      </Link>
      <Link to="/schools" className="[&.active]:font-bold">
        Schools Data
      </Link>
      {/* Dark Mode Toggle Button */}
      <button
      onClick={() => setIsDarkMode((prev) => !prev)}
      className="ml-auto bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded flex items-center justify-center"
    >
      {isDarkMode ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
    </div>
  )
}

// Root component
function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <Outlet />
    </>
  )
}
