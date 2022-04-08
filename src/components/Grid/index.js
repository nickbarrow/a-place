import { useContext, useEffect, useRef, useState } from "react"
import { db } from '../../firebase/firebase'
import { ref, onValue, set } from "firebase/database";
import ColorContext from "../../context/ColorContext";

export default function Canvas () {
  const [canvasWidth, setCanvasWidth] = useState(320)
  const [gridData, setGridData] = useState(null)
  let { color } = useContext(ColorContext);

  
  const TILE_WIDTH = 20;
  const GRID_COLS = 10;

  var grid = useRef(null),
      canvasRef = useRef(null),
      canvasContextRef = useRef(null),
      scaleRef = useRef(null),
      scrollXRef = useRef(null),
      scrollYRef = useRef(null);

  // Render board using fillRect() one tile at a time.
  const renderGrid = () => {
    // Clear canvas.
    canvasContextRef.current.clearRect(0,0,canvasContextRef.current.canvas.width/scaleRef.current, canvasContextRef.current.canvas.height/scaleRef.current);

    for (const x in grid.current) {
      for (const y in grid.current[x]) {
        let tile = grid.current[x][y],
            cX = (x * TILE_WIDTH) - scrollXRef.current,
            cY = (y * TILE_WIDTH) - scrollYRef.current;

        canvasContextRef.current.fillStyle = tile.color;
        canvasContextRef.current.fillRect(cX, cY, TILE_WIDTH ,TILE_WIDTH);
      }
    }
    // for (const idx in grid.current) {
    //   let index = parseInt(idx, 10),
    //       cX = ((index % GRID_COLS) * TILE_WIDTH) - scrollXRef.current,
    //       cY = (Math.floor(idx / GRID_COLS) * TILE_WIDTH) - scrollYRef.current;
    //   canvasContextRef.current.fillStyle = grid.current[index].color;
    //   canvasContextRef.current.fillRect(cX, cY, TILE_WIDTH ,TILE_WIDTH);
    // }
  }
  
  // Setup DB listener & canvas refs ONCE on load.
  useEffect(() => {
    const handleDBUpdate = (snapshot) => {
      const data = snapshot.val();
      console.log('⏬ Grid update');
      // setGridData(data);
      grid.current = data
      renderGrid()
    }
    let unsubscribe = onValue(ref(db, 'grid/'), handleDBUpdate);

    // Grab canvas on render and setup event listeners.
    canvasRef.current = document.getElementById('canvas');
    canvasContextRef.current = canvasRef.current.getContext('2d');
    scaleRef.current = 1;
    scrollXRef.current = 0;
    scrollYRef.current = 0;
    
    // Cannot prevent default in React event handlers since they are passive.
    canvasContextRef.current.canvas.onwheel = e => {
      e.preventDefault();
    };

    setCanvasWidth(window.innerWidth - 48);

    return function cleanup () {
      unsubscribe()
    }
  }, []);

  let hold = false, oldX, oldY;
  const handleCanvasMouseDown = e => {
    let adjX = Math.floor((e.nativeEvent.offsetX  / scaleRef.current) + scrollXRef.current),
        adjY = Math.floor((e.nativeEvent.offsetY  / scaleRef.current) + scrollYRef.current),
        clampedX = Math.floor(adjX / TILE_WIDTH),
        clampedY = Math.floor(adjY / TILE_WIDTH);
    
    console.log('📍 Clicked ', clampedX, ', ', clampedY);
    // console.log('📍 Clicked: ', index, ' | Color:  ', color);

    if (color !== null) {
      console.log('🖌️ Placing ', color, ' at ', clampedX, ', ', clampedY);
      set(ref(db, `grid/${clampedX}/${clampedY}`), {
        color: color,
        user: 'me'
      });
    } else {
      console.log('Start drag')
      hold = true;
      oldX = e.nativeEvent.clientX;
      oldY = e.nativeEvent.clientY;
    }
  }

  const handleCanvasMouseUp = e => {
    if (color == null && hold) {
      console.log('End drag');
      hold = false;
    }
  }

  const handleCanvasMouseMove = e => {
    if (!color && hold) {
      console.log('movin', color, hold);
      let speed = 0.7 / scaleRef.current,
          cx = e.clientX,
          cy = e.clientY,
          xd = cx - oldX,
          yd = cy - oldY;
      
      scrollXRef.current -= xd * speed;
      scrollYRef.current -= yd * speed;

      if (scrollXRef.current < 0) scrollXRef.current = 0;
      if (scrollYRef.current < 0) scrollYRef.current = 0;
      
      oldX = cx;
      oldY = cy;
      renderGrid()         
    }
  }

  const handleCanvasMouseLeave = () => {
    hold = false;
  }

  const handleCanvasWheel = e => {
    var scaleFactor = 0.7,
        scaleMin = 0.5,
        scaleMax = 3;

    e.preventDefault();
    let previousScale = scaleRef.current;
    
    // Get direction and update scale.
    let direction = e.nativeEvent.deltaY > 0 ? -1 : 1;
    scaleRef.current += scaleFactor * direction;

    // Prevent excessive zooming.
    if (scaleRef.current < scaleMin) {
      scaleRef.current = scaleMin;
      scrollXRef.current = 0;
      scrollYRef.current = 0;
    } else if (scaleRef.current > scaleMax) scaleRef.current = scaleMax;
    
    // Update scroll values based on some magic thanks to some
    // random internet stranger, I tried so many things idek 
    // where this came from but thanks.
    scrollXRef.current += ( e.nativeEvent.offsetX / previousScale )  - (e.nativeEvent.offsetX  / scaleRef.current);
    scrollYRef.current += ( e.nativeEvent.offsetY / previousScale ) - ( e.nativeEvent.offsetY / scaleRef.current);

    if (scrollXRef.current < 0) scrollXRef.current = 0;
    if (scrollYRef.current < 0) scrollYRef.current = 0;
    
    // apply new scale in a non acumulative way
    // I dont even know what that means, thanks again stranger.
    canvasContextRef.current.setTransform(1, 0, 0, 1, 0, 0);
    canvasContextRef.current.scale(scaleRef.current, scaleRef.current);

    renderGrid()
  }

  return (
    <canvas id="canvas"
      width={canvasWidth}
      height={canvasWidth}
      onMouseDown={handleCanvasMouseDown}
      onMouseUp={handleCanvasMouseUp}
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleCanvasMouseLeave}
      onWheel={handleCanvasWheel}></canvas>
  )
}