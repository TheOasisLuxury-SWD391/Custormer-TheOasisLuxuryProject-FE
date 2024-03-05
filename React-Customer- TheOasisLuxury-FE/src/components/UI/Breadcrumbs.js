import React from 'react';
import { Breadcrumb } from 'antd';

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <div className="container mx-auto px-4">
      <Breadcrumb>
        {breadcrumbs.map((item, index) => {
          const isLastItem = index === breadcrumbs.length - 1;
          return (
            <Breadcrumb.Item 
              key={index} 
              href={!isLastItem ? item.href : null} // Disable link if it's the last item
              className={`font-bold text-lg ${isLastItem ? '!text-cyan-700' : ''}`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
