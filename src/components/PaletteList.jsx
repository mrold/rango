import React from "react";

function PaletteList(props) {
  return <div className='palette-list'>{props.children}</div>
}

function Palette({gradient, direction, textDirection, onClick}) {
  const colors = [...gradient.colors];

  const style = {
    background: `linear-gradient(${direction}, ${colors})`,
  };
  return (
    <div className="palette-box" onClick={onClick}>
      <div className='palette' style={style}>
        <span className='palette-name' style={{transform:`rotate(${textDirection})`}}>{gradient.name}</span>
      </div>
    </div>
  );
}

export {PaletteList, Palette};
