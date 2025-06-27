
import React from 'react';

const ColumnHeader = ({ title, headerClass }) => (
  <h2 className={`kanban-header ${headerClass} flex-shrink-0 sticky top-0 z-10`}>
    {title}
  </h2>
);

export default ColumnHeader;
