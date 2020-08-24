import React from 'react'

class Conditioner extends React.Component {
  constructor(props) {
    super(props)
    this.state = { temperature: 0 }

    this.onIncrease = this.onIncrease.bind(this)
  }

  onIncrease() {
    this.setState(prevState => ({
      temperature: prevState.temperature + 1,
    }))
  }

  onDecrease() {
    this.setState(state => ({
      temperature: state.temperature - 1,
    }))
  }

  onZero() {
    this.setState(prevState => ({
      temperature: 0,
    }))
  }

  render() {
    return (
      <p>
        <h2>Текущая температура: {this.state.temperature}</h2>
        <button onClick={e => this.onDecrease(e)}>-</button>
        <button onClick={this.onIncrease}>+</button>
        <button onClick={e => this.onZero(e)}>0</button>
      </p>
    )
  }
}

export default Conditioner
