import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import appConfig from 'src/config/appConfig';

const PageContainer = ({ title, description, children }) => (
  <div>
    <Helmet>
      <title>{title ? `${appConfig.appName} | ${title}` : appConfig.appName}</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </div>
);

PageContainer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default PageContainer;
