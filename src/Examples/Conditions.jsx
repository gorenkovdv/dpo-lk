import React from "react";

class FirePlace extends React.Component {
  constructor(props) {
    super(props);
    this.onSetFire = this.onSetFire.bind(this);
    this.onSnuffOut = this.onSnuffOut.bind(this);
    this.state = { isBurning: false };
  }

  onSetFire() {
    this.setState({ isBurning: true });
  }

  onSnuffOut() {
    this.setState({ isBurning: false });
  }

  render() {
    const isBurning = this.state.isBurning;

    return (
      <div>
        {isBurning ? (
          <div>
            <h3>Камин горит!</h3>
            <button className="blue" onClick={this.onSnuffOut}>
              Потушить
            </button>
          </div>
        ) : (
          <div>
            <h3>Камин не горит!</h3>
            <button className="orange" onClick={this.onSetFire}>
              Зажечь
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default FirePlace;
