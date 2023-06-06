interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

const DropDownList = () => {
  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Dropdown</a>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" href="#scrollspyHeading3">Third</a></li>
        <li><a className="dropdown-item" href="#scrollspyHeading4">Fourth</a></li>
        <li><hr className="dropdown-divider"/></li>
        <li><a className="dropdown-item" href="#scrollspyHeading5">Fifth</a></li>
      </ul>
    </li>
  );
};

export default DropDownList;
