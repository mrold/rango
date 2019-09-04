import React from "react";
import classnames from "classnames";
import ClipboardJS from 'clipboard';
import {Motion, spring} from 'react-motion';
import {Tooltip} from 'antd';

function ActionBar(props) {
  return (<div className="action-bar">
    {props.children}
  </div>);
}

function ActionGroup(props) {
  const classes = classnames('action-group', props.class);
  return <div className={classes}>{props.children}</div>
}

function Action(props) {
  return (
    <Tooltip placement="bottom" title={props.title}>
      <span className='action' onClick={props.onClick}>
        {props.icon}
        {props.children}
    </span>
    </Tooltip>
  );
}

function MenuAction(props) {
  return (
     <span className='action-menu' onClick={props.onClick}>
       {props.icon}
        {props.children}
    </span>
  );
}

class CopyAction extends React.Component {
  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
    this.state = {
      'showTip': false
    };
  }

  componentDidMount() {
    this.clipboard = new ClipboardJS(this.copyRef.current, {
      text: function(trigger) {
        return trigger.getAttribute('data-color');
      }
    });
    const showTip = this.showTip;

    this.clipboard.on('success', function(e) {
      // console.info('Action:', e.action);
      // console.info('Text:', e.text);
      // console.info('Trigger:', e.trigger);

      e.clearSelection();

      showTip();
    });

    // this.clipboard.on('error', function(e) {
    //   console.error('Action:', e.action);
    //   console.error('Trigger:', e.trigger);
    // });
  }

  showTip = ()=>{
    this.setState({
      showTip: true
    });
  };

  hideTip = () => {
    this.setState({
      showTip: false
    });
  };

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render () {
    const {color} = this.props;
    return (
      <span className='action-copy'>
        <span className="hex" ref={this.copyRef} data-color={color}>
          <span className="color-box" style={{background: color}} />
          <span>{color}</span>
        </span>
        <span className="arrow">→&nbsp;</span>

        {this.state.showTip
          ? (
            <Motion defaultStyle={ { y: 0} } style={{y: spring(-30)}}  onRest={this.hideTip}>
              {({y}) =>
                <span
                  className="copied"
                  style={{
                    WebkitTransform: `translate3d(0, ${y}px, 0)`,
                    transform: `translate3d(0, ${y}px, 0)`,
                  }}
                >已复制</span> }
            </Motion>
          )
          : null
        }

      </span>
    );
  }
}

export {ActionBar, ActionGroup, Action, CopyAction, MenuAction};
