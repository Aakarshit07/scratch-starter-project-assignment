import Icon from "./Icon";

export default function Sidebar({ onAddBlock }) {
  const handleAdd = (type) => {
    if (!onAddBlock) return;
    onAddBlock(type);
  };

  const handleDragStart = (event, type) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData("application/x-block-type", type);
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) =>
          handleDragStart(event, "EVENT_WHEN_FLAG_CLICKED")
        }
        onClick={() => handleAdd("EVENT_WHEN_FLAG_CLICKED")}
      >
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) =>
          handleDragStart(event, "EVENT_WHEN_SPRITE_CLICKED")
        }
        onClick={() => handleAdd("EVENT_WHEN_SPRITE_CLICKED")}
      >
        {"When this sprite clicked"}
      </div>

      <div className="font-bold mt-2"> {"Motion"} </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "MOTION_MOVE_STEPS")}
        onClick={() => handleAdd("MOTION_MOVE_STEPS")}
      >
        {"Move 10 steps"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "MOTION_TURN_LEFT")}
        onClick={() => handleAdd("MOTION_TURN_LEFT")}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "MOTION_TURN_RIGHT")}
        onClick={() => handleAdd("MOTION_TURN_RIGHT")}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "MOTION_GOTO_XY")}
        onClick={() => handleAdd("MOTION_GOTO_XY")}
      >
        {"Go to x: 0 y: 0"}
      </div>

      <div className="font-bold mt-4"> {"Looks"} </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "LOOKS_SAY_FOR_SECS")}
        onClick={() => handleAdd("LOOKS_SAY_FOR_SECS")}
      >
        {"Say hello for 2 seconds"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "LOOKS_THINK_FOR_SECS")}
        onClick={() => handleAdd("LOOKS_THINK_FOR_SECS")}
      >
        {"Think hmm... for 2 seconds"}
      </div>

      <div className="font-bold mt-4"> {"Control"} </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-600 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) =>
          handleDragStart(event, "CONTROL_REPEAT_ANIMATION")
        }
        onClick={() => handleAdd("CONTROL_REPEAT_ANIMATION")}
      >
        {"Repeat animation"}
      </div>
    </div>
  );
}
