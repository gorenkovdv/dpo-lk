import React from "react";
import { Button } from "react-bootstrap";

class LikeButton extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      liked: false
    };
  }

  handleClick() {
    this.setState({
      liked: true
    });
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return (
      <Button variant="primary" onClick={this.handleClick}>
        Like
      </Button>
    );
  }
}

export default LikeButton;
