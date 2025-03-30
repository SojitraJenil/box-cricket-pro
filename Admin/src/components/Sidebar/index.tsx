import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { FaUserAlt } from 'react-icons/fa';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`} // Sidebar hidden on sm/md but visible on lg+
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 text-center lg:py-6.5">
        <NavLink to="/">
          <h1 className="text-md ms-4 text-white font-bold mx-auto align-bottom item--center">
            Box Cricket - Admin{' '}
          </h1>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <FaUserAlt />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semi  bold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/' || pathname.includes('dashboard')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="/"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === '/' ||
                          pathname.includes('dashboard')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                      // onClick={(e) => {
                      //   e.preventDefault();
                      //   sidebarExpanded
                      //     ? handleClick()
                      //     : setSidebarExpanded(true);
                      // }}
                      >
                        <FaUserAlt />
                        Dashboard

                      </NavLink>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <NavLink
                  to="/admin/user"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/user') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  User
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/Product"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out dark:hover:bg-meta-4 ${pathname.includes('/admin/Product') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Manage Box
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/Booked-Box"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/Booked-Box') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Booked Box
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/inquiries"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/inquiries') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Inquiries
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/categories"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/categories') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Add Box branch
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/admin/order"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/order') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/cart"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/order') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Cart
                </NavLink>
              </li> */}
              <li>
                <NavLink
                  to="/admin/chat"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/order') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  HelpDesk(Live Chat)
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/tournament"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('/admin/order') &&
                    'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <FaUserAlt />
                  Tournament
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
