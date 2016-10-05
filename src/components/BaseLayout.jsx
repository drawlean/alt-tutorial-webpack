import React from 'react';
import withSideEffect from 'react-side-effect';

class BaseLayout extends React.Component {


  static propTypes = {
    children: React.PropTypes.node,
    style: React.PropTypes.object,
    title: React.PropTypes.string
  }

  render() {

    const {children, style, title, ...props} = this.props;

    return (
      <div >
        {this.props.children}
      </div>
    );
  }
}

//export default BaseLayout;



const reducePropsToState = (propsList) => {
    const style = {};
    let title = '';

    propsList.forEach(function (prop) {
        title += prop.title;
        title += ">";
    });
    
    return {style, title};
}

const handleStateChangeOnClient = ({style, className, title}) => {

  if (title) {
    document.title = title;

    const iframe = document.createElement('iframe');
    iframe.src = 'logo.png';
      iframe.style.visibility = 'hidden';
      iframe.style.width = '1px';
      iframe.style.height = '1px';

      const listener = () => {
      setTimeout(() => {
        iframe.removeEventListener('load', listener);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 0);
      }, 0);
    };
    iframe.addEventListener('load', listener);
    document.body.appendChild(iframe);


  }

    for (const key in style) {
        if (document.body.style.hasOwnProperty(key)) {
            document.body.style[key] = style[key];
        }
    }
}

export default withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(BaseLayout);

