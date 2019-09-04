import React from 'react';
import {Stage, Layer, Rect} from 'react-konva';
// import Konva from 'konva';
import { saveAs } from 'file-saver';

const width = window.innerWidth;
const height = window.innerHeight;

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

class BackgroundCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef();
  }

  componentDidMount() {
    document.body.addEventListener('download', this.handleDownload)
  }

  handleDownload = () => {
    const dataURL = this.stageRef.current.toDataURL({pixelRatio: 3});

    saveAs(dataURL, `${this.props.gradient.name}.png`);

    // downloadURI(dataURL, );
  };

  componentWillUnmount() {
    document.body.removeEventListener('download', this.handleDownload);
  }

  render() {
    const {gradient, direction} = this.props;
    const startAndStop = directionMap[direction];

    return (
      <Stage width={width} height={height} ref={this.stageRef} className="background-canvas">
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
}

function generateColorStops(colors) {
  let stops = [];

  colors.forEach((c, i) => {
    let position = 0.5;
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
