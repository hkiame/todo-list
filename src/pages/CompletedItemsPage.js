import { Spacer } from "../Utils";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * This makes a request to the server / DB to get all to-do's that aren't currently completed.
 */
const getAllToDoItems = async () => {
  return (await axios.get("http://localhost:3001/items?isComplete=true")).data;
};

/**
 * This defines a single todo item, which is defined by the schema in `database/db.json`.
 */
const TodoItem = ({ item, isLast }) => {
  console.log(item);
  return (
    <>
      <div className="TodoItemContainer">
        <p className="TodoItemHeader">{item.heading}</p>
        <p className="TodoText">{item.body}</p>
      </div>
      {!isLast && <Spacer height="5vmin" />}
    </>
  );
};

/**
 * This defines the list of completed items.
 */
export const CompletedItemsPage = () => {
  // Leave undefined so we can tell when the page is "loading"
  const [todoItems, setTodoItems] = useState();

  useEffect(() => {
    getAllToDoItems()
      .then((result) => {
        setTodoItems(result);
      })
      .catch(() => {
        console.error("Failed to fetch completed items.");
      });
  }, []);

  return (
    <div className="CenterDiv">
      {todoItems === undefined && <p>Loading...</p>}
      {todoItems !== undefined &&
        todoItems.map((item, i) => (
          <TodoItem key={i} item={item} isLast={i === todoItems.length - 1} />
        ))}
    </div>
  );
};
