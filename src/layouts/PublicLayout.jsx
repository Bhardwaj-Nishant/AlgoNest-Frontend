import React from 'react'
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';

function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PublicLayout;
