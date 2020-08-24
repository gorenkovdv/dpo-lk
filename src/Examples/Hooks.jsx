import React, { useState, useEffect } from 'react'

function Hooks() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Вы нажали ${count} раз`
  })

  return (
    <div>
      {<p>Вы кликнули {count} раз</p>}
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  )
}

export default Hooks
