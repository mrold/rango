import {GithubOutlined} from '@ant-design/icons'

function Header() {
  return (
    <div className="header">
      <span className="brand">兰戈</span>
      <div className="nav right">
        <div className="nav-item">
          <a href="https://github.com/mrold/rango" className="nav-link" target="_blank"><GithubOutlined /></a>
        </div>
      </div>
    </div>
  );
}

export default Header;
