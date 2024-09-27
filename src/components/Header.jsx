import React, { useEffect, useState } from 'react';

const Header = () => {
  const [headerContent, setHeaderContent] = useState('');

  useEffect(() => {
    fetch('/components.json')
      .then((response) => response.json())
      .then((data) => {
        setHeaderContent(data.header);
      })
      .catch((error) => console.error('Error fetching header:', error));
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: headerContent }} />;
};

export default Header;
