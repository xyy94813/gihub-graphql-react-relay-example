import { PureComponent } from "react";

export default class ModalContainer extends PureComponent {
  state = {
    visible: false
  };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { children } = this.props;

    return children({
      visible: visible,
      show: this.show,
      hide: this.hide
    });
  }
}
