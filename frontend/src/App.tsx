import { useState } from "react"
import "./App.css"
import { Button } from "@/src/components/ui/button";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="flex flex-col bg-background">
        <Button className="bg-blue-400 hover:bg-blue-500 text-foreground" onClick={() => setCount((count) => count + 1)}>
          up
        </Button>
        <div style={{ marginLeft: 15 }}></div>
        <p>{count}</p>
        <div style={{ marginLeft: 15 }}></div>
        <Button className="bg-red-400 hover:bg-red-500" onClick={() => setCount((count) => count - 1)}>
          down
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  )
}

export default App
