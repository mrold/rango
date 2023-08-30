import React from "react";
import { StyleProvider } from '@ant-design/cssinjs';
import hexToHsl from 'hex-to-hsl';
import gradients from './gradients';
import Header from './components/Header';
import ListView from './components/ListView';
import {ActionBar, ActionGroup, Action, CopyAction, MenuAction} from "./components/ActionBar";
import {FilterBar, FilterGroup, Filter} from "./components/FilterBar";
import {PaletteList, Palette} from "./components/PaletteList";
import ShowView from "./components/ShowView";
import CodeModal from './components/modals/CodeModal';
import './App.scss';
import {MenuOutlined, ReloadOutlined, CodeOutlined, DownloadOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons'

const filters = [
  { name: 'reds', color: '#cb2d3e' },
  { name: 'oranges', color: '#d76b26' },
  { name: 'yellows', color: '#ffd200' },
  { name: 'greens', color: '#159957' },
  { name: 'cyans', color: '#1cb5e0' },
  { name: 'blues', color: '#155799' },
  { name: 'magentas', color: '#ef32d9' },
  { name: 'whites', color: '#eaeaea' },
  { name: 'grays', color: '#c0c0cb' },
  { name: 'blacks', color: '#333333' },
];

const directions = ['to right', 'to bottom right', 'to bottom', 'to bottom left', 'to left', 'to top left', 'to top', 'to top right'];
const textDirections = ['0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg'];

class App extends React.Component {
  constructor(props) {
    super(props);

    let id;
    if (window.location.hash) {
      const name = window.location.hash.substring(1);
      id = gradients.findIndex(gradient => gradient.name.replace(/\s/g, '') === name.replace(/\s/g, ''));
    }

    if (id === undefined || id === -1) {
      id = Math.floor(Math.random() * gradients.length);
      window.location.hash = gradients[id]['name'].replace(/\s/g, '');
    }

    this.state = {
      colorMap: mapColors(gradients),
      id: id,
      currentDirection: 0,
      mode: 'display',
      currentFilter: '',
      filters: filters,
      showCodeModal: false,
    };
  }

  toggleFilter = name => {
    this.setState({
      currentFilter: this.state.currentFilter === name ? '' : name,
    });
  };

  selectGradient(id) {
    this.setState({
      id: id,
      mode: 'display'
    });

    window.location.hash = gradients[id]['name'].replace(/\s/g, '');
  }

  toggleView = () => {
    this.setState({mode: this.state.mode === 'display' ? 'list' : 'display'});
  };

  setDirection = () => {
    const {currentDirection} = this.state;
    let nextDirect = currentDirection + 1;

    nextDirect = nextDirect > directions.length - 1 ? 0 : nextDirect;

    this.setState({currentDirection: nextDirect})
  };

  prev = () => {
    const {id, colorMap, currentFilter} = this.state;
    const ids = currentFilter === '' ? colorMap['all'] : colorMap[currentFilter];
    const i = ids.indexOf(id);
    let prevId = ids[i-1];
    if (prevId === undefined) {
      prevId = ids[ids.length - 1]
    }

    this.setState({
      id: prevId
    });

    window.location.hash = gradients[prevId]['name'].replace(/\s/g, '');
  };

  next = () => {
    const {id, colorMap, currentFilter} = this.state;
    const ids = currentFilter === '' ? colorMap['all'] : colorMap[currentFilter];
    const i = ids.indexOf(id);
    let nextId = ids[i+1];
    if (nextId === undefined) {
      nextId = ids[0]
    }

    this.setState({
      id: nextId
    });

    window.location.hash = gradients[nextId]['name'].replace(/\s/g, '');
  };

  showCodeModal = () => {
    this.setState({
      showCodeModal: true
    })
  };
  closeCodeModal = () => {
    this.setState({
      showCodeModal: false
    })
  };

  download = () => {
    const event = new CustomEvent('download');

    document.body.dispatchEvent(event);
  };

  render () {
    const {id, colorMap, mode, currentDirection, currentFilter, showCodeModal} = this.state;
    const gradient = gradients[id];
    const direction = directions[currentDirection];
    const textDirection = textDirections[currentDirection];
    const ids = currentFilter === '' ? colorMap['all'] : colorMap[currentFilter];

    return (
      <StyleProvider hashPriority="high">
        <div className='app'>
          <Header />
          <ActionBar>
            <ActionGroup class="left">
              <MenuAction icon={<MenuOutlined />} onClick={this.toggleView} />
            </ActionGroup>
            <ActionGroup class="center">
              {gradient.colors.map((color, i) => {
                return <CopyAction key={i} color={color} />
              })}
            </ActionGroup>
            <ActionGroup class="right">
              <Action icon={<ReloadOutlined />} title="调整角度" onClick={this.setDirection} />
              <Action icon={<CodeOutlined />} title="复制CSS" onClick={this.showCodeModal} />
              <Action icon={<DownloadOutlined />} title="保存为图片" onClick={this.download} />
            </ActionGroup>
          </ActionBar>
          <ListView active={mode==='list'}>
            <FilterBar>
              <FilterGroup>
                {this.state.filters.map((item, i) => {
                  return (
                    <Filter
                      key={i}
                      bg={item.color}
                      name={item.name}
                      onFilter={this.toggleFilter}
                      active={item.name === this.state.currentFilter}
                    />
                  );
                }, this)}
              </FilterGroup>
            </FilterBar>
            <PaletteList>
              {ids.map((id, i) => {
                return (
                  <Palette
                    key={i}
                    gradient={gradients[id]}
                    direction={direction}
                    textDirection={textDirection}
                    onClick={this.selectGradient.bind(this, id)}
                  />
                );
              }, this)}
            </PaletteList>
          </ListView>
          <ShowView active={mode==='list'} gradient={gradient} direction={direction}>
            <h1 className='gradient-name'>{gradient.name}</h1>
            <div className='paginate prev' onClick={this.prev}><LeftOutlined /></div>
            <div className='paginate next' onClick={this.next}><RightOutlined /></div>
          </ShowView>
          <CodeModal
            visible={showCodeModal}
            gradient={gradient}
            direction={direction}
            close={this.closeCodeModal}
          />
        </div>
      </StyleProvider>
    );
  }
}

function mapColors(gradients) {
  let map = {all: []};
  gradients.forEach((gradient, i) => {
    map['all'].push(i);
    gradient.colors.forEach(color => {
      const key =  detect(color);
      if (map[key] === undefined) {
        map[key] = [i];
      } else {
        map[key].push(i);
      }
    })
  });

  let i;
  for (i in map) {
    const x = new Set(map[i]);
    map[i] =  [...x];
  }

  return map;
}

function detect (hexColor) {
  const [hue, sat, lgt] = hexToHsl(hexColor);

  if ((lgt / 100) < 0.2) return 'blacks';
  if ((lgt / 100) > 0.85) return 'whites';

  if ((sat / 100) < 0.20) return 'grays';

  if (hue < 30) return 'reds';
  if (hue < 60) return 'oranges';
  if (hue < 90) return 'yellows';
  if (hue < 150) return 'greens';
  if (hue < 210) return 'cyans';
  if (hue < 270) return 'blues';
  if (hue < 330) return 'magentas';

  return 'reds';
}

export default App;

