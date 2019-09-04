import React from 'react';
import BackgroundCanvas from "./BackgroundCanvas";

export default function ShowView ({gradient, direction, children}) {
  // const {colors} = gradient;

  // const style = {
  //   background: `linear-gradient(${direction}, ${colors})`,
  // };

  return (
    <div className='show-view'>
      <BackgroundCanvas gradient={gradient} direction={direction}/>
      <div className="show-view-inner">{children}</div>
    </div>
  );
}
