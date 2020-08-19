const canvas = document.querySelector("canvas"),
      clear  = document.querySelector("#clear"),
      random  = document.querySelector("#random"),
      start  = document.querySelector("#start"),
      stopp  = document.querySelector("#stop"),
      count  = document.querySelector("#count")

const ctx     = canvas.getContext('2d'),
      res     = 10,
      rows    = Math.floor(canvas.height / res),
      columns = Math.floor(canvas.width / res)

const buildGrid = () => {
  return new Array( rows ).fill( undefined )
             .map( () => new Array( columns ).fill( undefined )
             .map( () => Math.floor( Math.random()*2 ) ) )
}

const renderGrid = ( grid , x_click = null , y_click = null ) => {
  if( x_click != null ){
    grid[ x_click ][ y_click ] = 1
  }
  for( let row = 0 ; row < grid.length ; row++ )
    for( let col = 0 ; col < grid[ row ].length ; col++ ){
      ctx.beginPath()
      ctx.rect( row*res , col*res , res, res )
      ctx.fillStyle = grid[ row ][ col ] ? 'red' : 'yellow'
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }
}

const nextGrid = ( prev ) => {
  // const second = prev
  const prevClone = prev.map( rows => [ ...rows ] )
  
  for( let row = 0 ; row < prev.length ; row++ )
    for( let col = 0 ; col < prev[ row ].length ; col++ ){
      let adjacentCells = 0,                    //Remaining 9
          cell          = prev[ row ][ col ]   //Target
      for ( let i = -1 ; i <=1 ; i++ )
        for( let j = -1 ; j <=1 ; j++ ){
          if( i === j & i === 0 )
            continue  
          const x = row + i,
                y = col + j
          if( x >= 0 && y >= 0 && x < rows && y < columns )
            adjacentCells += prev[ x ][ y ]
        }
      
        //RULES
      if( cell === 1 ){
        if( adjacentCells < 2 )
          prevClone[ row ][ col ] = 0
        else if( adjacentCells > 3 )
          prevClone[ row ][ col ] = 0
      } else if( cell === 0 && adjacentCells === 3)
        prevClone[ row ][ col ] = 1
    }

  return prevClone
}

const clearGrid = ( grid ) => {
  for( let row = 0 ; row < grid.length ; row++ )
    for( let col = 0 ; col < grid[ row ].length ; col++ ){
      grid[ row ][ col ] = 0
      ctx.beginPath()
      ctx.rect( row*res , col*res , res, res )
      ctx.fillStyle = 'yellow'
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }
}

let grid = buildGrid(), 
    interval,
    times = 0

const animate = () => {
  grid = nextGrid( grid )
  renderGrid( grid )
  count.textContent = times++
  // requestAnimationFrame(animate)  
}

getMousePosition = (canvas, event) => { 
  let rect = canvas.getBoundingClientRect(); 
  let x = event.clientX - rect.left; 
  let y = event.clientY - rect.top; 
  renderGrid( grid, Math.floor( x/res ), Math.floor( y/res ) ) 
} 

animate()

let isStarted = false

canvas.addEventListener("click",( event )=>{
  getMousePosition( canvas, event )
})

clear.addEventListener("click",()=>{
  clearInterval( interval )
  clearGrid( grid )
  isStarted = false
  stopp.textContent = 'START'
  times = 0
  count.textContent = times
})

random.addEventListener("click",()=>{
  clearInterval( interval )
  clearGrid( grid )
  interval  = setInterval( animate, 2000 )
  grid = buildGrid()
  isStarted = true
  stopp.textContent = "STOP"
  times = 0
  count.textContent = 0
})

stopp.addEventListener("click",()=>{
  if( isStarted === true ){
    isStarted = !isStarted
    clearInterval( interval )
    stopp.textContent = 'START'
  }
  else{
    stopp.textContent = "STOP"
    isStarted = !isStarted
    interval  = setInterval( animate, 2000 )  
  }
})
