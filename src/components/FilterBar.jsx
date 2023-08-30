import React from "react";
import classnames from "classnames";

function FilterBar(props) {
  return <div className='filter-bar'>{props.children}</div>
}

function FilterGroup(props) {
  return <ul className="filter-group">{props.children}</ul>
}

function Filter (props) {
  const {bg, name, active, onFilter} = props;

  const classes = classnames('filter', {'active': active, 'light': name === 'whites'});
  return (
    <li
      className={classes}
      style={{background: bg}}
      onClick={() => onFilter(name)}
    >
      {active
        ? <span className="clear">取消</span>
        : ''
      }
    </li>
  );
}

export {FilterBar, FilterGroup, Filter};
