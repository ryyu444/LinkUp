import { useState } from 'react';
/*
    To create a component, do the following:
    1. Make a folder in _components with the name of the component
    2. Create a (name of component).tsx file
    3. Write "export default function (function name)" to mark the component for importing - note the function name must be in Title case
    4. Fill out the logic for the component
    5. Import the component for use (e.g check page.tsx)
*/

// interfaces are used to ensure type safety
interface ExampleProps {
  title: String;
}

// props can be handled either with props as an arg or deconstructed
// the following is deconstructed

/* 
    as an arg it would look like the following.
    export default function Example(props) {
        const title = props.title; <-- note that you have to specify the name of the prop you passed in

        ... do stuff with it
    }
*/
export default function Example({ title }: ExampleProps) {
  const [counter, setCounter] = useState(0);

  function incrementCounter() {
    setCounter((count) => count + 1);
  }

  function decrementCounter() {
    setCounter((count) => count - 1);
  }

  // note: use brackets {} if you plan on writing any javascript logic
  // you can also do `` for strings with JS logic -> use this syntax: ${insert JS STUFF} like below
  // use className rather than class 
  return (
    <div className='flex flex-col items-center bg-sky-400 border-2 rounded-sm w-fit p-1 m-1'>
      {`${title}:${counter}`}
      <div className='flex gap-1'>
        <button
          className='p-0.5 bg-gray-400 border-2 rounded-sm'
          onClick={incrementCounter}
        >
          Increment
        </button>
        <button
          className='p-0.5 bg-gray-400 border-2 rounded-sm'
          onClick={decrementCounter}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
