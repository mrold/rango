import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import {Modal, Button, message} from "antd";
import ClipboardJS from "clipboard";

SyntaxHighlighter.registerLanguage('css', css);

class CodeModal extends React.Component{
  handleOk = e => {
    console.log(e);
    this.setState({
      showModal: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.props.close();
  };

  getCSS() {
    const {gradient, direction} = this.props;

    return `background: ${gradient.colors[0]};  /* fallback for old browsers */
background: -webkit-linear-gradient(${direction}, ${[...gradient.colors].reverse().join(', ')});  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(${direction}, ${[gradient.colors].reverse().join(', ')}); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;
  }

  render() {
    return  <Modal
      title="复制CSS代码"
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      okText="复制"
      cancelText="取消"
      footer={<CopyButton code={this.getCSS()} />}
    >

      <SyntaxHighlighter language="css" style={docco}>
        {this.getCSS()}
      </SyntaxHighlighter>
    </Modal>
  }
}


class CopyButton extends React.Component {
  constructor(props) {
    super(props);
    this.copyRef = React.createRef();
  }

  componentDidMount() {
    const that = this;
    this.clipboard = new ClipboardJS(this.copyRef.current, {
      text: function(trigger) {
        return that.props.code;
      }
    });

    this.clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);

      e.clearSelection();

    });

    this.clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  showMessage = () => {
    message.success('复制成功');
  };

  render() {
    return (
      <div ref={this.copyRef} style={{padding: '12px', textAlign:"center"}}>
        <Button type="primary" shape="round" onClick={this.showMessage}>复制</Button>
      </div>
    );
  }
}

export default CodeModal;
