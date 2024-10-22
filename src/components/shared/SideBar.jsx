import { NavLink } from "react-router-dom";

const SideBar = () => {
  const sideItems = [
    { text: "New product", link: "/admin/add-product" },
    { text: "Products", link: "/admin/products" },
    { text: "Orders", link: "/admin/orders" },
  ];

  return (
    <div className="w-[18%] min-h-screen border-r-2 mt-24">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {sideItems.map((item, x) => (
          <NavLink
            key={x}
            to={item.link}
            className="flex items-center gap-3 border border-gray-200 border-r-0 px-3 py-2"
          >
            {/* <img src={item.icon} className="w-5 h-5" /> */}
            <p className="hidden md:block">{item.text}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
