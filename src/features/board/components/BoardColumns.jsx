import React from "react";
import Column from "@column/components/Column";
import AddColumnIndicator from "@column/components/AddColIndicator/AddColumnIndicator";
import { useBoardLogic } from "@board/hooks/useBoardLogic";
import { useScreen } from "@context/ScreenContext";

function BoardColumns() {
  const { activeBoardColumns, hoveredIndex, onEnter, onLeave } =
    useBoardLogic();
  const { isTouch } = useScreen();

  if (!activeBoardColumns) return null;

  return activeBoardColumns.map((col, index) => (
    <React.Fragment key={col.id}>
      <Column columnData={col} index={index} />

      {!isTouch && index < activeBoardColumns.length - 1 && (
        <div
          className="add-column-zone"
          onMouseEnter={() => onEnter(index)}
          onMouseLeave={onLeave}
        >
          {hoveredIndex === index && <AddColumnIndicator indexAt={index} />}
        </div>
      )}
    </React.Fragment>
  ));
}

export default React.memo(BoardColumns);
