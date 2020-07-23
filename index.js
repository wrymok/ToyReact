import { HiReact,HiComponent } from './hiReact.js';
import './style.css';

class HiComponentMore extends HiComponent{
    render() {
        return (
            <div hiClass={this.props} class="c-component" onClick={()=>{return '123'}}>
                <span class="c-component-slot"> I am HiComponent {true} 
                </span>
                {this.children}
            </div>
        )
    }
}

const originDom = (
    <div class="c-title">
        <span> 123</span>
        <span class="c-span"> 123</span>
        <HiComponentMore class="c-component-parent">
        <div class="c-component-inner"> i am slot</div></HiComponentMore>
    </div>
)
HiReact.render(originDom, document.body);


class Square extends HiComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }
    render() {
      return (
        <button class="square" onClick={()=> this.setState({value: 'X'})}>
          {this.props.value}{this.state.value}
        </button>
      );
    }
  }
  
  class Board extends HiComponent {
    renderSquare(i) {
      return <Square value={i}/>;
    }
  
    render() {
      const status = 'Next player: X';
  
      return (
        <div>
          <div class="status">{status}</div>
          <div class="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div class="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div class="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends HiComponent {
    render() {
      return (
        <div class="game">
          <div class="game-board">
            <Board />
          </div>
          <div class="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  
HiReact.render(
    <Game/>,
    document.body
  );
  
