import React, { useState } from 'react';
import './App.css';

const initialList = ["(234) 567-8900","(333) 567-8456"];

const initialDnDState = {
  draggedFrom: null,
  draggedTo: null,
  isDragging: false,
  originalOrder: [],
  updatedOrder: []
}

const App = () => {
  const [ input, setInput ] = useState({number: ''});

  const [ results, setResults ] = useState(initialList);

  const [dragAndDrop, setDragAndDrop] = React.useState( initialDnDState );

  const { number } = input;

  const onchange = (e) => setInput({...input, [e.target.name]: e.target.value});

  const formatPhoneNumber = (phoneNumberString) => {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      let intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
  }

  let newPhone = results;

  const onSubmit = (e) => {
    e.preventDefault();
    if (number.length !== 10 ) {
      alert("Phone number should be 10 digits")
    } else {
      let phone = formatPhoneNumber(number)
      newPhone.unshift(phone);
      setResults(newPhone)
      setInput({number: ''})
    }
  }

  const onDragStart = (e) => {
    const initialPosition = Number(e.currentTarget.dataset.position);

    setDragAndDrop({
      ...dragAndDrop, 
      draggedFrom: initialPosition,
      isDragging: true, 
      originalOrder: results
    })

    e.dataTransfer.setData("text/html", '');
  }

  const onDragOver = (e) => {
    e.preventDefault();

    let newResult = dragAndDrop.originalOrder;

    const draggedFrom = dragAndDrop.draggedFrom; 

    const draggedTo = Number(e.currentTarget.dataset.position); 

    const itemDragged = newResult[draggedFrom];

    const remainingItems = newResult.filter((item, index) => index !== draggedFrom);

    newResult = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo)
    ];


    if (draggedTo !== dragAndDrop.draggedTo){
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newResult, 
        draggedTo: draggedTo
      })
    }
  }

  const onDrop = () => {
    setResults(dragAndDrop.updatedOrder);

    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false
    });
  }

  return (
    <div className="App">
      <header className="App-header">
      <div>
        <h2>Phone Book Directory</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input 
            type="number" 
            placeholder="Enter Phone Number" 
            name="number" 
            value={number} 
            onChange={e => onchange(e)} 
            required 
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
      </form>
      </header>
      <p>You can reorder your directory using the drag and drop functionality</p>
      <ul className="results">{results.map((result, index) => (
        <li 
          key={index}
          data-position={index}
          draggable="true" 
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          >
            <p>{result}</p>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
