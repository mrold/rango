import React from "react";
import {Icon} from 'antd';

function Header() {
  return (
    <div className="header">
      <span className="brand">兰戈</span>
      <div className="nav right">
        <div className="nav-item">
          <a href="https://github.com/mrold/rango" className="nav-link" target="_blank"><Icon type="github" /></a>
        </div>
      </div>
    </div>
  );
}

export default Header;
