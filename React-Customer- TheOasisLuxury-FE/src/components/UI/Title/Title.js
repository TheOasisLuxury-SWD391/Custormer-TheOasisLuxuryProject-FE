import React from 'react';
import PropTypes from 'prop-types';
import SectionTitleWrapper, { TitleWrapper, LinkWrapper } from './Title.style';

const SectionTitle = ({ className, title, link, ...props }) => {
  const addAllClasses = ['section_title'];
  if (className) {
    addAllClasses.push(className);
  }

  // Wrap title in a React element if it's a string
  const renderedTitle = typeof title === 'string' ? <h2>{title}</h2> : title;

  return (
    <SectionTitleWrapper className={addAllClasses.join(' ')} {...props}>
      {title && <TitleWrapper className="title_wrapper">{renderedTitle}</TitleWrapper>}
      {link && <LinkWrapper className="link_wrapper">{link}</LinkWrapper>}
    </SectionTitleWrapper>
  );
};

SectionTitle.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  link: PropTypes.element,
};

export default SectionTitle;
