import NavbarSidebar from "./NavbarSidebar";

const NotFound: React.FC = () => {
  return (
    <NavbarSidebar>
      <div>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </NavbarSidebar>
  );
};

export default NotFound;
