import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import CardsList from './components/CardsList';
import BoardForm from './components/BoardForm';
import Board from './components/Board';

function App() {

  const [boardsData, setBoardsData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({
    title: '',
    owner: '',
    board_id: null
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/boards`, {
    }).then((response) => {
      setBoardsData(response.data);
    })
  }, []);

  const selectBoard = (board) => { setSelectedBoard(board) };

  // BOARDS LIST
  // const boardsElements = boardsData.map((board) => {
  //   return (<li>
  //     <Board board={board} onBoardSelect={selectBoard}></Board>
  //   </li>)
  // });

  //BOARDS DROPDOWN MENU
  const boardsElements = boardsData.map((board) => {
    return (
    <select value={selectBoard}>
      <option value="">Please select a board</option>
      <option value={<Board board={board}></Board>}></option>
    </select>)
  });


  const createNewBoard = (newBoard) => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/boards`, newBoard).then((response) => {
      console.log("Response:", response.data.board);
      const boards = [...boardsData];
      boards.push(response.data.board);
      setBoardsData(boards);
    }).catch((error) => {
      console.log('Error:', error);
      alert('Couldn\'t create a new board.');
    });
  }


  const [isBoardFormVisible, setIsBoardFormVisible] = useState(true);
  const toggleNewBoardForm = () => {setIsBoardFormVisible(!isBoardFormVisible)}

  const deleteAll = () => {
    if (window.confirm('Are you really sure?')) {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/destroy_all`).then((response) => {
        console.log('response', response.data);
        setBoardsData([response.data.default_board]);
        setSelectedBoard({
          title: '',
          owner: '',
          board_id: null
        });
      }).catch((error) => {
        console.log('Error:', error);
        alert('Something went wrong! :(');
      });
    }
  }

  return (
    <div className="page__container">
      <div className="content__container">
        <header>
          <h1 id="title">Inspiration Board</h1>
          <div className="top__nav">
              <select value={selectBoard}>
                  <option value="">Please select a board</option>
                  {boardsElements}
              </select>
              <section>Selected Board:</section>
              <section>{selectedBoard.board_id ? `${selectedBoard.title} - ${selectedBoard.owner}` : 'Select a Board from the Board List!'}</section>
          </div>
        </header>
        <section className="boards__container">
          <section className="boards">
            {/* <h2>Boards</h2> */}
            {/* <ol className="boards__list"> */}
            {/* <section className="boards__list">
              <select value={selectBoard}>
                  <option value="">Please select a board</option>
                  {boardsElements}
              </select>
            </section> */}
            {/* </ol> */}
          </section>
          <section className="selected__boards">
            {/* <h2>Selected Board</h2>
            <p>{selectedBoard.board_id ? `${selectedBoard.title} - ${selectedBoard.owner}` : 'Select a Board from the Board List!'}</p> */}
          </section>
          <section className='new-board-form__container'>
            {isBoardFormVisible ? <BoardForm createNewBoard={createNewBoard}></BoardForm> : ''}
            <span onClick={toggleNewBoardForm} className='new-board-form__toggle-btn'>{isBoardFormVisible ? 'Hide New Board Form' : 'Show New Board Form'}</span>
          </section>
        </section>
        <section className="cards__list">
          {selectedBoard.board_id ? <CardsList board={selectedBoard}></CardsList> : ''}
        </section>
      </div>
      <footer>Click <span onClick={deleteAll} className="footer__delete-btn">here</span> to delete all boards and cards!</footer>
    </div>
  );
}


export default App;

