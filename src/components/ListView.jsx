import React from "react";
import classnames from 'classnames'

export default function ListView(props) {
  return (
    <div className={classnames('list-view', {'active': props.active})}>{props.children}</div>
  );
}
