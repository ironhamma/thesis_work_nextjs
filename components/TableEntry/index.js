import {useState} from "react";
import cn from 'clsx';

export default function TableEntry(item, key, index) {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <div
        className={cn(`${item.item.length ? item.item.length : "single"}Entry`, {
          selectedEntry: isSelected,
        })}
        key={key}
        onClick={() => {if(index != 0){setIsSelected(!isSelected)}}}
      >
        {index === 0 ? (
          id
        ) : item.item.name ? (
          <div className={`reserveTable__item ${item.item.status}`}>
            <p>{item.item.name}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
  