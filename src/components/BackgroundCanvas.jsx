import {useEffect, useRef} from 'react';
import {Stage, Layer, Rect} from 'react-konva';
// import Konva from 'konva';
import { saveAs } from 'file-saver';

const width = window.innerWidth;
const height = window.innerHeight - 86;

const directionMap = {
  'to right': [{x: 0, y: 0}, {x: width, y: 0}],
  'to bottom right': [{x: 0, y: 0}, {x: width, y: height}],
  'to bottom': [{x: 0, y: 0}, {x: 0, y: height}],
  'to bottom left': [{x: width, y: 0}, {x: 0, y: height}],
  'to left': [{x: width, y: 0}, {x: 0, y: 0}],
  'to top left': [{x: width, y: height}, {x: 0, y: 0}],
  'to top': [{x: 0, y: height}, {x: 0, y: 0}],
  'to top right': [{x: 0, y: height}, {x: width, y: 0}]
};

function BackgroundCanvas(props) {
  const stageRef = useRef(null)

  useEffect(() => {
    document.body.addEventListener('download', handleDownload)
    return () => {
      document.body.removeEventListener('download', handleDownload);
    }
  }, []);

  const handleDownload = () => {
    const dataURL = stageRef.current.toDataURL({pixelRatio: 3});

    saveAs(dataURL, `${props.gradient.name}.png`);

    // downloadURI(dataURL, );
  };

    const {gradient, direction} = props;
    const startAndStop = directionMap[direction];

    return (
      <Stage width={width} height={height} ref={stageRef} className="background-canvas">
        <Layer>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fillLinearGradientStartPoint={startAndStop[0]}
            fillLinearGradientEndPoint={startAndStop[1]}
            fillLinearGradientColorStops={generateColorStops(gradient.colors)}
          />
        </Layer>
      </Stage>
    );
}

function generateColorStops(colors) {
  let stops = [];

  // 0 1
  // 0 0.5 1
  // 0 0.33 0.66 1
  // 0 0.25 0.5 0.75 1

  const len = colors.length;

  let unit;
  if (len < 2) {
    unit = 1;
  } else {
    unit = 1/(len - 1);
  }

  colors.forEach((c, i) => {
    let position = unit * i;
    if (i === 0 ) {
      position = 0;
    }
    if (i === colors.length - 1) {
      position = 1;
    }

    stops.push(position, c)
  });

  return stops;
}

export default BackgroundCanvas;
